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

test("Admin: geheime Schlüssel und Passwörter werden erkannt, öffentliche nicht", () => {
  const jwt = (role) => "eyJhbGciOiJIUzI1NiJ9." + Buffer.from(JSON.stringify({ role })).toString("base64url") + ".x";
  assert.ok(L.geheimErkannt("sb_secret_1234567890"));
  assert.ok(L.geheimErkannt(jwt("service_role")));
  assert.ok(L.geheimErkannt("postgresql://neondb_owner:abc123@ep-1.eu-central-1.aws.neon.tech/neondb"));
  assert.ok(L.geheimErkannt("napi_abcdef"));
  assert.equal(L.geheimErkannt(jwt("anon")), null);
  assert.equal(L.geheimErkannt("sb_publishable_abcdefghijk"), null);
});

test("Admin: Verbindungsdaten nur Frankfurt, Freigabe erst nach automatischer Prüfung", () => {
  const b = { avvDatum: "2026-11-01", schritte: { antrag: true, einrichtung: true }, supabase: { url: "https://abcdefghijklmnopqrst.supabase.co", key: "sb_publishable_abcdefghijk", region: "eu-central-1" }, neon: { projekt: "ruhiger-see-12345678", region: "aws-eu-central-1" }, pruefung: {} };
  let st = L.betreiberStand(b);
  assert.equal(st.anzahl, 5);
  assert.equal(st.freigabeMoeglich, false, "ohne automatische Prüfung keine Freigabe");
  b.pruefung = { verbindung: "ok", sicherung: "ok" };
  assert.equal(L.betreiberStand(b).freigabeMoeglich, true);
  b.supabase.region = "andere";
  st = L.betreiberStand(b);
  assert.equal(st.freigabeMoeglich, false);
  assert.ok(st.verbindung.fehler.some((f) => f.includes("Frankfurt")));
  assert.ok(L.pruefeVerbindung({ supabase: { url: "https://falsch.example.com" }, neon: {} }).fehler.length);
});

test("Besetzungsmatrix: Vorgaben je Rolle (Personen, Leitung, feste Mitarbeiter, Aushilfen)", () => {
  const b = { gesamt: 3, sl: 0, stv: 1, ma: 1, maxAus: 1 };
  const P = (rolle) => ({ rolle });
  assert.equal(L.slotPruefen(b, [P("stv"), P("mitarbeiter"), P("aushilfe")]).status, "gruen");
  assert.equal(L.slotPruefen(b, [P("stv"), P("mitarbeiter")]).status, "rot");
  const ohneLeitung = L.slotPruefen(b, [P("mitarbeiter"), P("mitarbeiter"), P("aushilfe")]);
  assert.equal(ohneLeitung.status, "gelb");
  assert.ok(ohneLeitung.gruende.some((g) => g.includes("Leitung")));
  const aushilfen = L.slotPruefen(b, [P("shopleitung"), P("aushilfe"), P("aushilfe")]);
  assert.equal(aushilfen.status, "gelb");
  assert.ok(aushilfen.gruende.some((g) => g.includes("Aushilfen")));
  assert.equal(L.slotPruefen({ gesamt: 2, sl: 1, stv: 0, ma: 0 }, [P("stv"), P("mitarbeiter")]).gruende[0], "keine Shopleitung");
  assert.equal(L.slotPruefen(b, [P("stv"), P("mitarbeiter"), P("mitarbeiter"), P("aushilfe")]).status, "ueber");
});

test("Besetzung: Lücken eines Tages werden zu Zeiträumen zusammengefasst, Krankmeldung zählt nicht mit", () => {
  const s = neu();
  const tag = "2026-11-10", f = s.filialen.find((x) => x.id === "och");
  s.plan = [{ id: "a", filiale: "och", datum: tag, schicht: "frueh", personId: pid(s, "Tom") }, { id: "b", filiale: "och", datum: tag, schicht: "frueh", personId: pid(s, "Lena") }];
  const l = L.besetzungsLuecken(s, "och", tag);
  assert.ok(l.length >= 1);
  assert.equal(l[l.length - 1].bis, L.oeffnung(f, tag).zu, "nachmittags bis Ladenschluss niemand");
  assert.equal(L.besetzungsLuecken(s, "och", tag).filter((x) => x.von < 14 * 60).length, 0, "vormittags passt es (Tom ist Leitung)");
  s.abwesenheiten.push({ id: "k", personId: pid(s, "Tom"), art: "krank", von: tag, bis: tag });
  assert.ok(L.besetzungsLuecken(s, "och", tag).some((x) => x.von === 10 * 60 && x.gruende.some((g) => g.includes("Leitung"))));
});

test("Pinnwand: Empfänger, gelesen, abnehmen nur bei Lesern", () => {
  const s = neu();
  const heute = "2026-11-05";
  const z = { id: "z1", filiale: "och", vonId: pid(s, "Sandra"), text: "Test", zeit: heute + "T08:00", wichtig: true, farbe: 1, fuer: "alle", empfaenger: [], gelesen: {}, abgenommen: {} };
  s.pinnwand = [z];
  const empf = L.pinEmpfaenger(s, z);
  assert.ok(empf.includes(pid(s, "Lena")));
  assert.ok(empf.includes(pid(s, "Mia")), "Springerin für Ochtrup bekommt Zettel");
  assert.ok(!empf.includes(pid(s, "Anna")), "Oberhausen nicht");
  assert.ok(!empf.includes(pid(s, "Sandra")), "Verfasserin nicht");
  const lena = s.personen.find((p) => p.vorname === "Lena");
  assert.equal(L.pinUngelesen(s, lena, heute).length, 1);
  z.gelesen[lena.id] = heute + "T09:00";
  assert.equal(L.pinUngelesen(s, lena, heute).length, 0);
  assert.equal(L.pinStand(s, z).gelesen.length, 1);
  z.abgenommen[lena.id] = heute + "T10:00";
  assert.equal(L.pinSichtbar(s, z, lena, heute), false);
  assert.equal(L.pinSichtbar(s, z, s.personen.find((p) => p.vorname === "Leonie"), heute), true, "bei Nicht-Lesern hängt er weiter");
  const leit = { ...z, id: "z2", fuer: "leitung" };
  assert.deepEqual(L.pinEmpfaenger(s, leit), [pid(s, "Tom")]);
  assert.equal(L.pinAktiv({ ...z, bis: "2026-11-04" }, heute), false, "abgelaufen");
});

test("Arbeitszeit: niemand wird über 10 Std. am Tag eingeplant", () => {
  const s = neu();
  for (const f of s.filialen) for (const d of L.woche(L.montag(MITTWOCH))) {
    const proPerson = {};
    for (const x of L.schichtenAm(s, d, (y) => y.personId)) { const z = L.planZeit(s, x); if (z) proPerson[x.personId] = (proPerson[x.personId] || 0) + z.ende - z.start; }
    for (const [id, m] of Object.entries(proPerson)) assert.ok(m <= 600, `${d} ${id}: ${m} Min.`);
  }
});

test("Urlaubskonto: Anspruch, Übertrag, genommen, geplant, beantragt, Rest; Arbeitstage Mo–Fr", () => {
  const s = neu();
  const p = { id: "u1", urlaubsanspruch: 30, urlaubUebertrag: 2 };
  s.abwesenheiten = [
    { personId: "u1", art: "urlaub", von: "2026-03-02", bis: "2026-03-13", status: "genehmigt" }, // 10 Tage, vorbei
    { personId: "u1", art: "urlaub", von: "2026-11-02", bis: "2026-11-06", status: "genehmigt" }, // läuft: 3 genommen, 2 geplant
    { personId: "u1", art: "urlaub", von: "2026-12-21", bis: "2026-12-24", status: "beantragt" },
    { personId: "u1", art: "urlaub", von: "2026-08-03", bis: "2026-08-07", status: "abgelehnt" },
    { personId: "u1", art: "bildungsurlaub", von: "2026-09-14", bis: "2026-09-16", status: "genehmigt" },
  ];
  const k = L.urlaubskonto(s, p, "2026", "2026-11-05");
  assert.deepEqual(k, { anspruch: 30, uebertrag: 2, genommen: 13, geplant: 2, beantragt: 4, rest: 17 });
  assert.equal(L.urlaubskonto(s, p, "2026", "2026-11-05", "bildung").genommen, 3);
  assert.equal(L.urlaubsTage("2026-11-02", "2026-11-08"), 5);
  assert.equal(L.urlaubsTage("2026-11-02", "2026-11-08", "mo-sa"), 6);
});

test("Abwesenheit: Krank gilt sofort, Urlaub erst genehmigt, abgelehnt und zurückgezogen nie", () => {
  const s = neu();
  const id = pid(s, "Lena"), tag = "2026-11-12";
  s.abwesenheiten = [{ personId: id, art: "bildungsurlaub", von: tag, bis: tag, status: "beantragt" }];
  assert.equal(L.abwesenheitAm(s, id, tag), undefined);
  s.abwesenheiten[0].status = "genehmigt";
  assert.ok(L.abwesenheitAm(s, id, tag));
  s.abwesenheiten = [{ personId: id, art: "kind_krank", von: tag, bis: tag, status: "gemeldet" }];
  assert.ok(L.abwesenheitAm(s, id, tag));
  s.abwesenheiten[0].status = "zurueckgezogen";
  assert.equal(L.abwesenheitAm(s, id, tag), undefined);
});

test("Stundenumfang: Woche oder Monat, Überschreitung wird erkannt und im Vorschlag vermieden", () => {
  const s = neu();
  const jonas = s.personen.find((p) => p.vorname === "Jonas");
  assert.equal(jonas.stundenEinheit, "monat");
  const tag = "2026-11-12";
  const st = L.stundenStand(s, jonas, tag, 600);
  assert.equal(st.einheit, "monat");
  assert.equal(st.neu, Math.round((L.stundenImMonat(s, jonas.id, tag) + 10) * 10) / 10);
  const lena = s.personen.find((p) => p.vorname === "Lena");
  lena.wochenstunden = 5;
  assert.equal(L.stundenStand(s, lena, "2026-11-04", 330).ueber, true);
  s.plan = s.plan.filter((x) => x.datum < "2026-11-09");
  const neuS = L.planVorschlag(s, "och", "2026-11-09", (() => { let n = 0; return () => "v" + n++; })());
  for (const p of s.personen) {
    const vorher = 0, min = neuS.filter((x) => x.personId === p.id).reduce((n, x) => { const z = L.planZeit(s, x); return n + z.ende - z.start; }, 0) / 60;
    if (p.stundenEinheit !== "monat" && p.wochenstunden) assert.ok(vorher + min <= p.wochenstunden + L.darfUeberschreiten(p), `${p.vorname}: ${min} > ${p.wochenstunden}`);
  }
});

// ---------- 0.8.0: Beschäftigungsart, Einsatzprofil, Überschreiten, Jugendschutz, Import ----------
test("darf Stunden überschreiten: bis zur Grenze ohne Rückfrage, nie bei Minijob und unter 18", () => {
  const s = neu();
  const p = s.personen.find((x) => x.vorname === "Lena");
  s.plan = []; p.ueberschreiten = { erlaubt: false, bisStd: 0 };
  p.wochenstunden = 5; p.stundenEinheit = "woche"; p.beschaeftigung = "teilzeit";
  const tag = "2026-11-04";
  let st = L.stundenStand(s, p, tag, 330);
  assert.equal(st.ueber, true); assert.equal(st.ueberGrenze, true);
  p.ueberschreiten = { erlaubt: true, bisStd: 3 };
  st = L.stundenStand(s, p, tag, 330);
  assert.equal(st.ueber, true); assert.equal(st.ueberGrenze, false); assert.equal(st.grenze, 8);
  p.beschaeftigung = "minijob";
  assert.equal(L.stundenStand(s, p, tag, 330).ueberGrenze, true);
  p.beschaeftigung = "teilzeit"; p.unter18 = true;
  assert.equal(L.stundenStand(s, p, tag, 330).ueberGrenze, true);
});

test("Einsatzprofil: nur Spätdienst, nur bis/ab Uhr, nur bestimmte Tage, nicht an Tagen", () => {
  const p = { profil: { zeit: "spaet" } };
  assert.deepEqual(L.profilPruefen(p, "2026-11-04", { start: 570, ende: 870 }, "spaet"), []);
  assert.deepEqual(L.profilPruefen(p, "2026-11-04", { start: 570, ende: 870 }, "frueh"), ["nur Frühdienst".replace("Früh", "Spät")]);
  assert.equal(L.profilPruefen({ profil: { zeit: "morgens", bis: "14:00" } }, "2026-11-04", { start: 570, ende: 870 }).length, 1);
  assert.equal(L.profilPruefen({ profil: { zeit: "morgens", bis: "15:00" } }, "2026-11-04", { start: 570, ende: 870 }).length, 0);
  assert.equal(L.profilPruefen({ profil: { zeit: "abends", ab: "16:00" } }, "2026-11-04", { start: 960, ende: 1230 }).length, 0);
  assert.equal(L.profilPruefen({ profil: { zeit: "abends", ab: "16:00" } }, "2026-11-04", { start: 900, ende: 1230 }).length, 1);
  assert.equal(L.profilPruefen({ profil: { tage: ["sa", "so"] } }, "2026-11-04", null).length, 1); // Mittwoch
  assert.equal(L.profilPruefen({ profil: { tage: ["sa", "so"] } }, "2026-11-07", null).length, 0); // Samstag
  assert.match(L.profilPruefen({ profil: { nichtTage: ["di"], nichtGrund: "Berufsschule" } }, "2026-11-03", null)[0], /Berufsschule/);
});

test("Planvorschlag hält Profil ein, Kandidaten zeigen Profil, Bereitschaft gibt Vorrang", () => {
  const s = neu();
  const f = s.filialen.find((x) => x.id === "och");
  const leute = s.personen.filter((p) => p.stammfiliale === "och");
  for (const p of leute) p.profil = { zeit: "spaet" };
  let n = 1;
  const vor = L.planVorschlag(s, "och", L.montag("2026-11-09"), () => "t" + n++);
  assert.ok(vor.length > 0);
  assert.ok(vor.every((x) => x.schicht === "spaet" || s.personen.find((p) => p.id === x.personId).stammfiliale !== "och"));
  const k = L.kandidaten(s, "och", "2026-11-10", "frueh").find((x) => x.person.stammfiliale === "och");
  assert.ok(k.gruende.some((g) => /Profil: nur Spätdienst/.test(g)));
  const tom = leute[1]; tom.profil = { zeit: "flexibel", bereitschaft: [{ tag: "di", von: "08:00", bis: "14:00" }] };
  const k2 = L.kandidaten(s, "och", "2026-11-10", "frueh").find((x) => x.person.id === tom.id);
  assert.ok(k2.gruende.includes("in Bereitschaft"));
  assert.ok(f);
});

test("Jugendschutz und kurzfristige Beschäftigung: Hinweise", () => {
  const s = neu();
  s.plan = [];
  const p = s.personen.find((x) => x.vorname === "Leonie");
  p.unter18 = true; p.ab16 = false;
  const h = L.gesetzHinweise(s, p, "2026-11-04", { start: 17 * 60, ende: 20 * 60 + 30 });
  assert.ok(h.some((x) => /nach 20:00/.test(x)));
  p.ab16 = true;
  assert.equal(L.gesetzHinweise(s, p, "2026-11-04", { start: 17 * 60, ende: 20 * 60 + 30 }).some((x) => /nach/.test(x)), false);
  const q = s.personen.find((x) => x.vorname === "Jonas");
  q.beschaeftigung = "kurzfristig"; s.parameter.grenzen = { kurzfristigTage: 2 };
  s.plan.push({ id: "a", filiale: "och", datum: "2026-03-02", schicht: "frueh", personId: q.id }, { id: "b", filiale: "och", datum: "2026-03-03", schicht: "frueh", personId: q.id });
  assert.ok(L.gesetzHinweise(s, q, "2026-11-04", { start: 570, ende: 870 }).some((x) => /3\. Arbeitstag/.test(x)));
});

test("Qualifikationen: Ablauf in 30 Tagen", () => {
  const s = neu();
  for (const x of s.personen) x.quali = [];
  s.personen[3].quali = [{ art: "ifsg", bis: "2026-11-20" }, { art: "kasse", bis: "2027-06-01" }];
  s.personen[4].quali = [{ art: "hygiene", bis: "2026-10-01" }];
  const r = L.qualiAblauf(s, "2026-11-05", 30);
  assert.equal(r.length, 2); assert.equal(r[0].abgelaufen, true); assert.equal(r[1].name, "Belehrung § 43 IfSG");
});

test("Mitarbeiter-Import aus Excel (CSV mit Semikolon, Kopfzeile, Umlaute)", () => {
  const s = neu();
  const csv = "﻿Vorname;Nachname;Filiale;Rolle;Beschäftigung;Stunden;Einheit;Urlaub\r\nKai;Muster;Ochtrup;Aushilfe;geringfügig;40;Monat;20\nEva;\"Beispiel, Dr.\";Sinsheim;Stellvertretung;Teilzeit;25,5;Woche;28\nX;Y;Limbecker;Chef;;abc;;\n";
  const r = L.mitarbeiterImport(s, csv);
  assert.equal(r.zeilen.length, 3);
  assert.equal(r.zeilen[0].person.beschaeftigung, "minijob"); assert.equal(r.zeilen[0].person.stundenEinheit, "monat"); assert.equal(r.zeilen[0].person.stammfiliale, "och");
  assert.equal(r.zeilen[1].person.nachname, "Beispiel, Dr."); assert.equal(r.zeilen[1].person.rolle, "stv"); assert.equal(r.zeilen[1].person.wochenstunden, 25.5);
  assert.equal(r.zeilen[2].person, null); assert.equal(r.zeilen[2].fehler.length, 3);
  const r2 = L.mitarbeiterImport(s, "Sandra\tBecker\toch\tShopleitung\tVollzeit\t38\tWoche\t30");
  assert.equal(r2.zeilen[0].doppelt, true);
});

// ---------- 0.9.0: Zutaten mit Allergenen, Rezepte rechnen sie aus, 4-Augen-Freigabe, Fassungen ----------
test("Zutatenstamm: Allergene kommen aus der Zutat, Spuren getrennt", () => {
  const s = neu();
  assert.ok(s.rezepte.zutaten.length > 20);
  const waffel = s.rezepte.rezepte.find((r) => r.name === "Waffel Classic");
  assert.ok(waffel.zutaten.every((l) => l.zutatId));
  const granola = L.zutatFinden(s, "  granola ");
  assert.deepEqual(L.zutatAllergene(granola), { ja: ["Gluten", "Schalenfrüchte"], spuren: ["Erdnüsse", "Sesam"] });
  L.allergeneAktualisieren(s);
  const mitGranola = s.rezepte.rezepte.find((r) => r.zutaten.some((l) => l.zutatId === granola.id));
  assert.ok(L.spurenVon(mitGranola).includes("Sesam"));
});

test("4-Augen-Freigabe: eigene Änderung nicht, Mitarbeiter nicht, zweite Person ja; Fassung steigt, alte bleibt lesbar", () => {
  const s = neu();
  const pid2 = (v) => s.personen.find((p) => p.vorname === v).id;
  const zt = L.zutatFinden(s, "Froyo-Basis Natur");
  const rz = s.rezepte.rezepte.filter((r) => r.zutaten.some((l) => l.zutatId === zt.id));
  L.entwurfSpeichern(s, "zutat", zt.id, { name: zt.name, lieferant: "", artNr: "", zusatzstoffe: "", allergene: { Milch: "ja", Soja: "ja" } }, pid2("Petra"), "2026-11-05T10:00");
  assert.ok(!L.allergeneVon(rz[0]).includes("Soja"), "vor Freigabe gilt die alte Fassung");
  assert.match(L.aenderungen(s, "zutat", zt.id).join(" "), /enthält neu: Soja/);
  assert.equal(L.freigabePruefen(s, "zutat", zt.id, pid2("Petra")).moeglich, false);
  assert.equal(L.freigabePruefen(s, "zutat", zt.id, pid2("Lena")).moeglich, false);
  const r = L.freigeben(s, "zutat", zt.id, pid2("Inhaber"), "2026-11-05T11:00");
  assert.equal(r.moeglich, true); assert.equal(zt.fassung, 2); assert.equal(zt.fassungen[0].daten.allergene.Soja, undefined);
  assert.ok(rz.every((x) => L.allergeneVon(x).includes("Soja")), "alle Rezepte mit der Zutat rechnen neu");
  assert.equal(L.offeneFreigaben(s).some((x) => x.e === zt), false);
});

test("Rezept-Entwurf: unbekannte Zutat gemeldet, ungeprüfte Zutat sperrt die Freigabe, neues Rezept erst nach Freigabe sichtbar", () => {
  const s = neu();
  const pid2 = (v) => s.personen.find((p) => p.vorname === v).id;
  const z = L.zutatenZeilen(s, "Froyo-Basis Natur | 100/150/200 | g\nKokos-Chips | 5/8/10 | g\nApfel | x | g", ["S", "M", "L"]);
  assert.equal(z.zutaten.length, 1); assert.deepEqual(z.unbekannt, ["Kokos-Chips"]); assert.equal(z.fehler.length, 1);
  s.rezepte.zutaten.push({ id: "ztneu", name: "Kokos-Chips", allergene: {}, neu: true, entwurf: { daten: { name: "Kokos-Chips", lieferant: "", artNr: "", zusatzstoffe: "", allergene: {} }, von: pid2("Petra"), am: "2026-11-05T09:00" } });
  const r = { id: "rneu", gruppe: "froyo", name: "Froyo Kokos", beschreibung: "", groessen: ["S", "M", "L"], zutaten: [], schritte: [], neu: true };
  s.rezepte.rezepte.push(r);
  const z2 = L.zutatenZeilen(s, "Froyo-Basis Natur | 100/150/200 | g\nKokos-Chips | 5/8/10 | g", ["S", "M", "L"]);
  L.entwurfSpeichern(s, "rezept", r.id, { ...r, zutaten: z2.zutaten, schritte: ["Einfüllen"] }, pid2("Petra"), "2026-11-05T10:00");
  assert.equal(L.rezepteFreigegeben(s).includes(r), false);
  assert.match(L.freigabePruefen(s, "rezept", r.id, pid2("Inhaber")).grund, /Kokos-Chips/);
  assert.equal(L.freigeben(s, "zutat", "ztneu", pid2("Inhaber"), "2026-11-05T10:30").moeglich, true);
  assert.equal(L.freigeben(s, "rezept", r.id, pid2("Sandra"), "2026-11-05T11:00").moeglich, true);
  assert.equal(r.fassung, 1); assert.equal(r.neu, undefined); assert.ok(L.rezepteFreigegeben(s).includes(r));
  assert.deepEqual(L.allergeneVon(r), ["Milch"]);
});

test("Entwurf verwerfen: neue Einträge verschwinden, bestehende behalten die freigegebene Fassung", () => {
  const s = neu();
  const zt = s.rezepte.zutaten.find((z) => z.entwurf);
  assert.ok(zt, "Beispieldaten haben eine offene Änderung");
  assert.ok(L.entwurfVerwerfen(s, "zutat", zt.id));
  assert.equal(zt.entwurf, undefined); assert.ok(s.rezepte.zutaten.includes(zt));
});

// ---------- 0.10.0: Sortiment, Bestandsaufnahme, Bestellliste ----------
test("Bestellvorschlag: Soll − Ist, aufgerundet auf volle Gebinde, Mindestbestand oben", () => {
  const s = neu();
  const v = L.bestellVorschlag(s, "och");
  const froyo = v.find((z) => z.artikel.name === "Froyo-Basis Natur");
  assert.equal(froyo.ist, 5); assert.equal(froyo.soll, 24); assert.equal(froyo.gebinde, 4); // 19 l fehlen, Karton à 6 l
  assert.equal(froyo.unterMin, true);
  assert.ok(v.findIndex((z) => !z.unterMin) > v.findIndex((z) => z.unterMin));
  assert.equal(v.find((z) => z.artikel.name === "Servietten").gebinde, 0);
  assert.equal(L.mengeText(froyo.artikel, 4), "4 Kartons à 6 l");
  assert.equal(L.mengeText(froyo.artikel, 1), "1 Karton à 6 l");
});

test("Bestellvorschlag: ohne Bestandsaufnahme nichts raten, offene Bestellungen werden abgezogen", () => {
  const s = neu();
  const obh = L.bestellVorschlag(s, "obh");
  assert.ok(obh.every((z) => !z.gezaehlt && z.gebinde === 0 && z.fehlt === null));
  const v1 = L.bestellVorschlag(s, "och");
  const froyo = v1.find((z) => z.artikel.name === "Froyo-Basis Natur").artikel;
  let n = 0;
  const neuB = L.bestellungenAnlegen(s, "och", { [froyo.id]: 2 }, "p1", "2026-11-05T10:00", () => "b" + n++);
  assert.equal(neuB.length, 1); assert.equal(neuB[0].lieferant, froyo.lieferant);
  const v2 = L.bestellVorschlag(s, "och").find((z) => z.artikel.id === froyo.id);
  assert.equal(v2.unterwegs, 12); assert.equal(v2.gebinde, 2);
  // Ware ist da, 1 Karton fehlt
  const b = L.wareneingang(s, neuB[0].id, { [froyo.id]: 1 }, "p1", "2026-11-06T09:00");
  assert.equal(b.status, "geliefert"); assert.deepEqual(b.geliefert.abweichungen, [{ artikel: froyo.id, bestellt: 2, geliefert: 1 }]);
  assert.equal(L.unterwegs(s, "och", froyo.id), 0);
  assert.equal(L.wareneingang(s, neuB[0].id, {}, "p1", "x"), null);
});

test("Bestellungen je Lieferant getrennt, Nullmengen werden ignoriert", () => {
  const s = neu();
  const v = L.bestellVorschlag(s, "och");
  const mengen = Object.fromEntries(v.map((z) => [z.artikel.id, z.gebinde]));
  let n = 0;
  const b = L.bestellungenAnlegen(s, "och", mengen, "p1", "2026-11-05T10:00", () => "b" + n++);
  const lieferanten = new Set(v.filter((z) => z.gebinde).map((z) => z.lieferant));
  assert.equal(b.length, lieferanten.size);
  assert.ok(b.every((x) => x.posten.every((p) => p.menge > 0) && x.status === "frei"));
});

// ---------- 0.11.0: Kassendaten, Umsatz je Stunde, Monatsübersicht ----------
test("Zahlen, Datum und Uhrzeit aus deutschen Kassen-Exporten", () => {
  assert.equal(L.zahlDe("1.234,56 €"), 1234.56); assert.equal(L.zahlDe("4,9"), 4.9); assert.equal(L.zahlDe("12.50"), 12.5); assert.equal(L.zahlDe("1.000"), 1000); assert.equal(L.zahlDe("abc"), null);
  assert.equal(L.datumDe("05.11.2026"), "2026-11-05"); assert.equal(L.datumDe("5.1.26"), "2026-01-05"); assert.equal(L.datumDe("2026-11-05T10:00"), "2026-11-05"); assert.equal(L.datumDe("Montag"), null);
  assert.equal(L.stundeDe("14:35:10"), 14); assert.equal(L.stundeDe("9"), 9); assert.equal(L.stundeDe("25"), null);
});

test("Kassen-Import: Spalten erkennen, je Stunde zusammenfassen, Fehler melden, beim zweiten Einlesen ersetzen", () => {
  const csv = "Belegdatum;Uhrzeit;Artikel;Menge;Umsatz brutto\n03.11.2026;10:15;Froyo M;2;9,80\n03.11.2026;10:40;Smoothie;1;4,50\n03.11.2026;14:05;Froyo L;1;5,90\n03.11.2026;;Gutschein;1;10,00\nkaputt;;;;\n";
  const r = L.kassenImport(csv);
  assert.equal(r.zuordnung.datum, 0); assert.equal(r.zuordnung.zeit, 1); assert.equal(r.zuordnung.umsatz, 4);
  assert.deepEqual(r.posten.map((x) => [x.stunde, x.umsatz, x.anzahl]), [[null, 10, 1], [10, 14.3, 3], [14, 5.9, 1]]);
  assert.equal(r.fehler.length, 2);
  const s = neu(); s.verkauf = [];
  assert.equal(L.kassenUebernehmen(s, "och", r.posten, "csv"), 1);
  L.kassenUebernehmen(s, "och", r.posten, "csv");
  assert.equal(s.verkauf.length, 3, "kein doppeltes Einlesen");
  const r2 = L.kassenImport("Datum;Uhrzeit;Wert\n03.11.2026;10:00;5");
  assert.ok(r2.fehler[0].includes("Umsatz")); assert.equal(r2.posten.length, 0);
  const r3 = L.kassenImport("Datum;Uhrzeit;Wert\n03.11.2026;10:00;5", { umsatz: 2 });
  assert.equal(r3.posten[0].umsatz, 5);
  const r4 = L.kassenImport("Zeitpunkt,Betrag\n03.11.2026 18:20,\"3,50\"", { datum: 0, zeit: 0 });
  assert.equal(r4.posten[0].stunde, 18); assert.equal(r4.posten[0].umsatz, 3.5);
});

test("Umsatz je Stunde: Mittel der letzten Wochen am gleichen Wochentag, Personal je Stunde", () => {
  const s = neu(); s.verkauf = [];
  const d = "2026-11-11"; // Mittwoch
  L.kassenUebernehmen(s, "och", [{ datum: "2026-11-04", stunde: 12, umsatz: 100, anzahl: 0 }, { datum: "2026-10-28", stunde: 12, umsatz: 60, anzahl: 0 }, { datum: "2026-10-28", stunde: 13, umsatz: 40, anzahl: 0 }], "csv");
  const u = L.umsatzJeStunde(s, "och", d, 4);
  assert.deepEqual(u.tage, ["2026-10-28", "2026-11-04"]); assert.equal(u.proStunde[12], 80); assert.equal(u.proStunde[13], 20); assert.equal(u.tagesumsatz, 100);
  const pj = L.personalJeStunde(s, "och", "2026-11-04");
  assert.ok(Object.keys(pj).length >= 9);
});

test("Monatsübersicht: Soll aus Woche × 4,33, gestempelt, Abwesenheitstage je Art", () => {
  const s = neu();
  const p = s.personen.find((x) => x.vorname === "Tom");
  s.stempel.push({ id: "x1", personId: p.id, filiale: "och", art: "kommen", zeit: "2026-10-05T09:00" }, { id: "x2", personId: p.id, filiale: "och", art: "gehen", zeit: "2026-10-05T15:00" });
  s.abwesenheiten.push({ id: "ab1", personId: p.id, art: "krank", von: "2026-10-12", bis: "2026-10-14", status: "gemeldet" }, { id: "ab2", personId: p.id, art: "urlaub", von: "2026-10-29", bis: "2026-11-03", status: "genehmigt" });
  const m = L.monatsuebersicht(s, "2026-10", "och").find((x) => x.person.id === p.id);
  assert.equal(m.sollMin, Math.round(35 * 4.33 * 60));
  assert.ok(m.istMin >= 330); assert.equal(m.abw.krank, 3); assert.equal(m.abw.urlaub, 2); // 29. und 30. Okt (Do, Fr), Samstag zählt nicht
});

// ---------- 0.13.0: Nachrichten und Termine ----------
test("Nachrichten: Chats je Filiale und Leitungsrunde, Springer im Chat ihrer Einsatzfiliale, Berater nicht", () => {
  const s = neu();
  const id = (v) => s.personen.find((p) => p.vorname === v).id;
  const och = s.chats.find((c) => c.id === "ch-och");
  const m = L.chatMitglieder(s, och);
  assert.ok(m.includes(id("Lena")) && m.includes(id("Inhaber")));
  assert.ok(m.includes(id("Mia")), "Springerin Mia darf auch in Ochtrup");
  assert.ok(!m.includes(id("Anna")) && !m.includes(id("Hygieneberater")));
  assert.deepEqual(L.chatsFuer(s, id("Lena")).map((c) => c.id), ["ch-och"]);
  assert.ok(L.chatsFuer(s, id("Sandra")).some((c) => c.art === "leitung"));
});

test("Nachrichten: senden nur als Mitglied, ungelesen, gelesen markieren, ✓✓ erst wenn alle gelesen haben", () => {
  const s = neu();
  const id = (v) => s.personen.find((p) => p.vorname === v).id;
  let n = 0; const nid = () => "n" + n++;
  assert.equal(L.nachrichtSenden(s, "ch-och", id("Anna"), "Hallo", "2026-11-12T10:00", nid), null);
  assert.equal(L.nachrichtSenden(s, "ch-och", id("Lena"), "   ", "2026-11-12T10:00", nid), null);
  const x = L.nachrichtSenden(s, "ch-och", id("Lena"), "Wer hat den Schlüssel?", "2026-11-12T10:00", nid);
  assert.ok(x);
  assert.ok(L.chatUngelesen(s, "ch-och", id("Sandra")) >= 1);
  assert.equal(L.lesestand(s, x).alle, false);
  for (const pid of L.chatMitglieder(s, s.chats.find((c) => c.id === "ch-och"))) L.chatGelesen(s, "ch-och", pid, "2026-11-12T10:05");
  assert.equal(L.lesestand(s, x).alle, true);
  assert.equal(L.chatUngelesen(s, "ch-och", id("Sandra")), 0);
  const d1 = L.direktChat(s, id("Lena"), id("Tom"), nid), d2 = L.direktChat(s, id("Tom"), id("Lena"), nid);
  assert.equal(d1, d2);
  assert.ok(L.chatsFuer(s, id("Tom")).includes(d1) && !L.chatsFuer(s, id("Sandra")).includes(d1));
});

test("Termine: Eingeladene je Filiale/Leitung, Antworten, Stand, Absage sperrt", () => {
  const s = neu();
  const id = (v) => s.personen.find((p) => p.vorname === v).id;
  const ts = s.termine.find((t) => t.art === "teamsitzung");
  const ein = L.terminEingeladen(s, ts);
  assert.ok(ein.includes(id("Lena")) && !ein.includes(id("Anna")) && !ein.includes(id("Hygieneberater")));
  assert.equal(L.terminAntwort(s, ts.id, id("Anna"), "ja", "x"), false);
  assert.equal(L.terminAntwort(s, ts.id, id("Lena"), "ja", "x"), true);
  assert.equal(L.terminAntwort(s, ts.id, id("Lena"), "egal", "x"), false);
  const st = L.terminStand(s, ts);
  assert.ok(st.ja.includes(id("Lena")) && st.vielleicht.includes(id("Leonie")) && st.offen.length > 0);
  const inv = s.termine.find((t) => t.fuer === "leitung");
  assert.ok(L.terminEingeladen(s, inv).includes(id("Anna")) && !L.terminEingeladen(s, inv).includes(id("Lena")));
  assert.ok(L.termineFuer(s, id("Lena"), "2000-01-01").some((t) => t.id === ts.id));
  ts.abgesagt = true; assert.equal(L.terminAntwort(s, ts.id, id("Lena"), "nein", "x"), false);
});

test("Kalender-Datei (ICS): Zeiten, Sonderzeichen, Erinnerung", () => {
  const t = L.ics([{ uid: "t1", titel: "Teamsitzung; Ochtrup, Pausenraum", datum: "2026-11-17", von: "18:30", bis: "19:30", ort: "Pausenraum", notiz: "Zeile 1\nZeile 2" }], 60);
  assert.match(t, /BEGIN:VCALENDAR\r\n/); assert.match(t, /DTSTART:20261117T183000\r\n/); assert.match(t, /DTEND:20261117T193000/);
  assert.match(t, /SUMMARY:Teamsitzung\\; Ochtrup\\, Pausenraum/); assert.match(t, /DESCRIPTION:Zeile 1\\nZeile 2/);
  assert.match(t, /TRIGGER:-PT60M/); assert.match(t, /END:VCALENDAR\r\n$/);
});
