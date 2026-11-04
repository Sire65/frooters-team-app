// Fachliche Tests der Programmlogik: node --test tests/
const test = require("node:test");
const assert = require("node:assert/strict");
const L = require("../logik.js");
const D = require("../daten.js");

const MITTWOCH = "2026-11-04";
const neu = () => D.demoDaten(MITTWOCH);
const pid = (s, vorname) => s.personen.find((p) => p.vorname === vorname).id;

test("Datum: Montag der Woche und Wochentag", () => {
  assert.equal(L.montag(MITTWOCH), "2026-11-02");
  assert.equal(L.wochentag("2026-11-08"), "so");
  assert.equal(L.plusTage("2026-12-31", 1), "2027-01-01");
});

test("Sonntag geschlossen: keine Schichten, kein Bedarf, keine Hygiene-Aufgaben", () => {
  const s = neu();
  const f = s.filialen[0];
  assert.equal(L.oeffnung(f, "2026-11-08"), null);
  assert.equal(L.bedarf(f, "2026-11-08", "frueh"), 0);
  assert.deepEqual(L.tagesliste(s, f.id, "2026-11-08", { datum: MITTWOCH, min: 600 }), []);
});

test("Springer: nur in Filialen mit Haken einsetzbar", () => {
  const s = neu();
  const jonas = s.personen.find((p) => p.vorname === "Jonas");
  assert.equal(L.darfInFiliale(jonas, "och"), true);
  assert.equal(L.darfInFiliale(jonas, "rr"), true);
  assert.equal(L.darfInFiliale(jonas, "obh"), false);
  jonas.springer = false;
  assert.equal(L.darfInFiliale(jonas, "rr"), false, "ohne Springer-Haken nur Stammfiliale");
  const lena = s.personen.find((p) => p.vorname === "Lena");
  assert.equal(L.kandidaten(s, "obh", MITTWOCH, "frueh").some((k) => k.person.id === lena.id), false);
});

test("Kandidaten: krank und 'kann nicht' sind nicht möglich, Überschneidung in anderer Filiale wird erkannt", () => {
  const s = neu();
  const lukas = pid(s, "Lukas");
  assert.equal(L.kandidaten(s, "obh", MITTWOCH, "frueh").find((k) => k.person.id === lukas).moeglich, false);
  const tag = "2026-11-10";
  s.wuensche.push({ id: "w1", personId: pid(s, "Paul"), datum: tag, art: "nicht", schicht: "egal" });
  assert.equal(L.kandidaten(s, "sin", tag, "frueh").find((k) => k.person.vorname === "Paul").moeglich, false);
  const mia = pid(s, "Mia");
  s.plan.push({ id: "x1", filiale: "osn", datum: tag, schicht: "frueh", personId: mia });
  const k = L.kandidaten(s, "och", tag, "frueh").find((x) => x.person.id === mia);
  assert.equal(k.moeglich, false);
  assert.ok(k.gruende.some((g) => g.includes("Osnabrück")));
});

test("Planvorschlag: füllt nur bis zum Bedarf und plant niemanden doppelt", () => {
  const s = neu();
  s.plan = [];
  let n = 0;
  const mo = "2026-11-09";
  s.plan.push(...L.planVorschlag(s, "och", mo, () => "t" + n++));
  for (const d of L.woche(mo)) for (const sch of L.SCHICHTEN) {
    const a = L.abdeckung(s, "och", d, sch.id);
    assert.ok(a.ist <= a.soll, `${d} ${sch.id} überplant`);
    const ids = L.schichtenAm(s, d, (x) => x.schicht === sch.id).map((x) => x.personId);
    assert.equal(new Set(ids).size, ids.length);
  }
  assert.ok(n > 0);
});

test("Planvorschlag nurStamm: keine Springer", () => {
  const s = neu();
  s.plan = [];
  const neuS = L.planVorschlag(s, "och", "2026-11-09", () => "q" + Math.random(), { nurStamm: true });
  assert.ok(neuS.length > 0);
  assert.ok(neuS.every((x) => s.personen.find((p) => p.id === x.personId).stammfiliale === "och"));
});

test("Abdeckung: krank gemeldete Person zählt nicht", () => {
  const s = neu();
  const lukas = pid(s, "Lukas");
  s.plan = [{ id: "a", filiale: "obh", datum: MITTWOCH, schicht: "frueh", personId: lukas }];
  assert.equal(L.abdeckung(s, "obh", MITTWOCH, "frueh").ist, 0);
});

test("Hygiene: Shop ohne Eismaschine bekommt keine Eismaschinen-Aufgabe, neues Gerät erzeugt sie", () => {
  const s = neu();
  const eis = s.hygiene.regeln.find((r) => r.geraetetyp === "eis");
  const hat = (fid) => L.tagesliste(s, fid, MITTWOCH, { datum: MITTWOCH, min: 600 }).some((a) => a.regel.id === eis.id);
  assert.equal(hat("obh"), false);
  assert.equal(hat("sin"), true);
  s.hygiene.geraete.push({ id: "gneu", filiale: "obh", typ: "eis", name: "Eismaschine neu", status: "aktiv" });
  assert.equal(hat("obh"), true);
});

test("Hygiene: zwei Kühlvitrinen ergeben doppelte Messaufgaben, gestörtes Gerät pausiert", () => {
  const s = neu();
  const r = s.hygiene.regeln.find((x) => x.titel === "Temperatur Kühlvitrine");
  const zahl = (fid) => L.tagesliste(s, fid, MITTWOCH, { datum: MITTWOCH, min: 600 }).filter((a) => a.regel.id === r.id).length;
  assert.equal(zahl("och"), 2 * zahl("obh"));
  s.hygiene.geraete.find((g) => g.filiale === "och" && g.typ === "vitrine").status = "gestoert";
  assert.equal(zahl("och"), zahl("obh"));
});

test("Hygiene: Zuteilung 'trifft nicht zu' entfernt die Regel nur in diesem Shop", () => {
  const s = neu();
  const r = s.hygiene.regeln.find((x) => x.titel === "Theke und Arbeitsflächen reinigen");
  s.hygiene.zuteilung[`${r.id}|och`] = { status: "nicht" };
  const hat = (fid) => L.tagesliste(s, fid, MITTWOCH, { datum: MITTWOCH, min: 600 }).some((a) => a.regel.id === r.id);
  assert.equal(hat("och"), false);
  assert.equal(hat("obh"), true);
});

test("Hygiene: ohne Durchführung nie erledigt (UNKNOWN ist nie OK)", () => {
  const s = neu();
  const liste = L.tagesliste(s, "och", "2026-11-03", { datum: MITTWOCH, min: 600 });
  assert.ok(liste.length > 0);
  assert.ok(liste.every((a) => a.status === "verpasst"));
  assert.equal(L.tagesSumme(liste).erledigt, 0);
});

test("Hygiene: Grenzwerte ok, Warnung, kritisch", () => {
  const pp = { art: "messwert", max: 7, krit: 8 };
  assert.equal(L.pruefeWert(pp, "6.9"), "ok");
  assert.equal(L.pruefeWert(pp, "7.5"), "warn");
  assert.equal(L.pruefeWert(pp, "8.1"), "kritisch");
  assert.equal(L.pruefeWert(pp, ""), "offen");
  const tk = { art: "messwert", max: -18, krit: -15 };
  assert.equal(L.pruefeWert(tk, "-20"), "ok");
  assert.equal(L.pruefeWert(tk, "-16"), "warn");
  assert.equal(L.pruefeWert(tk, "-12"), "kritisch");
});

test("Hygiene: Zuständigkeit Spätdienst kommt aus dem Einsatzplan, sonst Shopleitung", () => {
  const s = neu();
  const r = s.hygiene.regeln.find((x) => x.titel === "Boden und Abfall");
  const tag = "2026-11-10";
  s.plan = s.plan.filter((x) => x.datum !== tag);
  const ohne = L.zustaendig(s, r, "och", tag);
  assert.equal(ohne.ersatz, true);
  assert.deepEqual(ohne.ids, [pid(s, "Sandra")]);
  s.plan.push({ id: "z", filiale: "och", datum: tag, schicht: "spaet", personId: pid(s, "Lena") });
  assert.deepEqual(L.zustaendig(s, r, "och", tag).ids, [pid(s, "Lena")]);
});

test("Hygiene: Durchführung mit Abweichung zählt als Abweichung, nicht als grün", () => {
  const s = neu();
  const a = L.tagesliste(s, "och", MITTWOCH, { datum: MITTWOCH, min: 700 }).find((x) => x.regel.titel === "Temperatur Kühlvitrine");
  s.hygiene.durchfuehrungen.push({ key: a.key, personId: "p1", zeit: MITTWOCH + "T11:00:00", werte: { 0: "9" }, bewertung: "kritisch", ergebnis: "erledigt" });
  const b = L.tagesliste(s, "och", MITTWOCH, { datum: MITTWOCH, min: 700 }).find((x) => x.key === a.key);
  assert.equal(b.status, "abweichung");
});

test("Stechuhr: Arbeit und Pause, Hinweis bei fehlender Pause", () => {
  const e = [{ art: "kommen", zeit: "2026-11-04T08:00:00" }, { art: "gehen", zeit: "2026-11-04T15:00:00" }];
  const sum = L.stempelSumme(e);
  assert.deepEqual(sum, { arbeit: 420, pause: 0 });
  assert.equal(L.arbeitszeitHinweise(sum).length, 1);
  const mitPause = [{ art: "kommen", zeit: "2026-11-04T08:00:00" }, { art: "pause", zeit: "2026-11-04T11:00:00" }, { art: "weiter", zeit: "2026-11-04T11:30:00" }, { art: "gehen", zeit: "2026-11-04T15:30:00" }];
  assert.deepEqual(L.stempelSumme(mitPause), { arbeit: 420, pause: 30 });
  assert.equal(L.arbeitszeitHinweise(L.stempelSumme(mitPause)).length, 0);
  assert.equal(L.stempelStatus(mitPause), "aus");
});

test("Rezepte: Allergene aus Zutaten, Quiz mit eindeutiger richtiger Antwort", () => {
  const s = neu();
  const waffel = s.rezepte.rezepte.find((r) => r.name === "Waffel Classic");
  assert.deepEqual(L.allergeneVon(waffel), ["Ei", "Gluten", "Milch"]);
  const q = L.quiz(s.rezepte.rezepte, s.rezepte.warengruppen, 10, 7);
  assert.equal(q.length, 10);
  for (const f of q) {
    assert.equal(f.antworten.filter((x) => x === f.richtig).length, 1, f.frage);
    assert.ok(f.antworten.length >= 3);
  }
  assert.deepEqual(L.quiz(s.rezepte.rezepte, s.rezepte.warengruppen, 5, 3).map((x) => x.frage), L.quiz(s.rezepte.rezepte, s.rezepte.warengruppen, 5, 3).map((x) => x.frage));
});

test("Mobiler Stand: nur an Einsatztagen geöffnet, mit Ort; Hygiene nur dann", () => {
  const s = neu();
  const rr = s.filialen.find((f) => f.id === "rr");
  const e = rr.einsaetze[0];
  assert.equal(L.oeffnung(rr, e.datum).ort, e.ort);
  assert.equal(L.oeffnung(rr, L.plusTage(e.datum, 1)), null);
  assert.ok(L.tagesliste(s, "rr", e.datum, { datum: MITTWOCH, min: 600 }).some((a) => a.regel.geraetetyp === "kuehlbox"));
  assert.deepEqual(L.tagesliste(s, "rr", L.plusTage(e.datum, 1), { datum: MITTWOCH, min: 600 }), []);
});

test("Übergreifende Rollen (Qualität, Berater) werden nie in Schichten eingeplant", () => {
  const s = neu();
  for (const p of s.personen.filter((x) => L.UEBERGREIFEND.includes(x.rolle))) for (const f of s.filialen) assert.equal(L.darfInFiliale(p, f.id), false);
});

test("Stundenliste: je Person und Tag, offene Tage markiert, CSV mit Semikolon", () => {
  const s = neu();
  s.stempel = [
    { personId: "p1", filiale: "och", art: "kommen", zeit: "2026-11-02T09:30:00" }, { personId: "p1", filiale: "och", art: "gehen", zeit: "2026-11-02T15:00:00" },
    { personId: "p1", filiale: "och", art: "kommen", zeit: "2026-11-03T09:30:00" },
    { personId: "p2", filiale: "obh", art: "kommen", zeit: "2026-11-02T10:00:00" }, { personId: "p2", filiale: "obh", art: "gehen", zeit: "2026-11-02T12:00:00" },
  ];
  const z = L.stundenliste(s, "2026-11", "och");
  assert.equal(z.length, 2);
  assert.equal(z[0].arbeit, 330);
  assert.equal(z[1].offen, true);
  const c = L.csv([["A; B", 1]], ["Name", "Std"]);
  assert.equal(c, 'Name;Std\r\n"A; B";1');
});

test("Tauschbörse: Stunden am Ende abgeben teilt die Schicht, Stunden zählen richtig", () => {
  const s = neu();
  s.plan = [{ id: "s1", filiale: "och", datum: "2026-11-10", schicht: "frueh", personId: pid(s, "Lena") }];
  const z = L.planZeit(s, s.plan[0]); // 09:30–15:00
  assert.equal(L.teilPruefen(z, { start: z.start + 60, ende: z.ende - 60 }), "Abgeben geht nur am Anfang oder Ende der Schicht.");
  assert.equal(L.teilPruefen(z, { start: z.ende - 30, ende: z.ende }), "Mindestens 1 Stunde abgeben.");
  const a = { id: "x1", schichtId: "s1", vonId: pid(s, "Lena"), teil: { start: z.ende - 120, ende: z.ende }, status: "angefragt", nehmerId: pid(s, "Leonie") };
  assert.equal(L.tauschPruefen(s, a, a.nehmerId).moeglich, true);
  L.tauschAusfuehren(s, a, () => "s2");
  const lena = s.plan.find((x) => x.id === "s1"), leonie = s.plan.find((x) => x.id === "s2");
  assert.deepEqual(lena.zeit, { start: z.start, ende: z.ende - 120 });
  assert.equal(leonie.personId, pid(s, "Leonie"));
  assert.equal(L.stundenInWoche(s, pid(s, "Lena"), "2026-11-09") + L.stundenInWoche(s, pid(s, "Leonie"), "2026-11-09"), (z.ende - z.start) / 60);
});

test("Tauschbörse: Übernahme nur wer in der Filiale darf, nicht krank und frei ist", () => {
  const s = neu();
  const tag = "2026-11-10";
  s.plan = [{ id: "s1", filiale: "och", datum: tag, schicht: "frueh", personId: pid(s, "Lena") }, { id: "s2", filiale: "och", datum: tag, schicht: "frueh", personId: pid(s, "Tom") }];
  const a = { id: "x1", schichtId: "s1", vonId: pid(s, "Lena"), teil: null, status: "offen" };
  assert.equal(L.tauschPruefen(s, a, pid(s, "Anna")).moeglich, false, "Oberhausen darf nicht nach Ochtrup");
  assert.equal(L.tauschPruefen(s, a, pid(s, "Tom")).moeglich, false, "hat schon Dienst");
  assert.equal(L.tauschPruefen(s, a, pid(s, "Mia")).moeglich, true, "Springerin aus Osnabrück darf");
  s.abwesenheiten.push({ id: "k", personId: pid(s, "Mia"), art: "krank", von: tag, bis: tag });
  assert.equal(L.tauschPruefen(s, a, pid(s, "Mia")).moeglich, false);
});

test("Tauschbörse: Tausch gegen eigene Schicht tauscht beide Personen", () => {
  const s = neu();
  s.plan = [{ id: "s1", filiale: "och", datum: "2026-11-10", schicht: "frueh", personId: pid(s, "Lena") }, { id: "s2", filiale: "och", datum: "2026-11-11", schicht: "spaet", personId: pid(s, "Leonie") }];
  const a = { id: "x1", schichtId: "s1", vonId: pid(s, "Lena"), teil: null, status: "angefragt", nehmerId: pid(s, "Leonie"), gegenId: "s2" };
  assert.equal(L.tauschPruefen(s, a, a.nehmerId, "s2").moeglich, true);
  L.tauschAusfuehren(s, a, () => "neu");
  assert.equal(s.plan[0].personId, pid(s, "Leonie"));
  assert.equal(s.plan[1].personId, pid(s, "Lena"));
  assert.equal(L.tauschPruefen(s, { ...a, teil: { start: 600, ende: 720 } }, a.nehmerId, "s2").moeglich, false, "Teilstunden nicht gegen Schicht");
});
