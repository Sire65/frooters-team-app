// Büro und Druckstudio: Rechte der Ordner, Vorlagen ohne erfundene Preise, sichere Ausgabe
const test = require("node:test");
const assert = require("node:assert/strict");
const L = require("../logik.js");
const D = require("../daten.js");
const B = require("../buero.js");
const neu = () => D.demoDaten("2026-11-05");

test("Ordner: Inhaber sieht alle, Shopleitung weniger, Freigaben wirken, Freigaben-Ordner nur Inhaber", () => {
  const s = neu();
  const anzahl = (rolle) => B.ORDNER.filter((o) => B.darfOrdner(s, rolle, o.id)).length;
  assert.equal(anzahl("zentrale"), B.ORDNER.length);
  assert.ok(anzahl("shopleitung") < anzahl("zentrale"));
  assert.equal(B.darfOrdner(s, "shopleitung", "personal"), false);
  assert.equal(B.darfOrdner(s, "mitarbeiter", "studio"), false);
  assert.equal(B.darfOrdner(s, "berater", "hygiene"), true);
  assert.equal(B.darfOrdner(s, "berater", "studio"), false);
  s.buero.rechte.personal = { shopleitung: true };
  assert.equal(B.darfOrdner(s, "shopleitung", "personal"), true);
  s.buero.rechte.studio = { stv: false };
  assert.equal(B.darfOrdner(s, "stv", "studio"), false);
  s.buero.rechte.freigaben = { shopleitung: true };
  assert.equal(B.darfOrdner(s, "shopleitung", "freigaben"), false, "Freigaben bleiben beim Inhaber");
});

test("Preisliste: Artikel aus dem Sortiment der Filiale, Preise leer, leere Preise als „… €“", () => {
  const s = neu();
  const osn = s.filialen.find((f) => f.id === "osn");
  const d = B.neuerDruck(s, "preisliste", osn);
  assert.ok(d.posten.includes("Açaí Bowl"));
  assert.ok(!d.posten.includes("Waffel Classic"), "Osnabrück verkauft keine Waffeln");
  assert.ok(d.posten.split("\n").every((z) => z.trim().endsWith("|")), "kein Preis erfunden");
  assert.equal(B.preisTxt(""), "… €");
  assert.equal(B.preisTxt("3,5"), "3,50 €");
  assert.equal(B.preisTxt("4.9"), "4,90 €");
});

test("Öffnungszeiten-Vorlage fasst gleiche Tage zusammen, mobiler Stand zeigt Einsätze", () => {
  const s = neu();
  assert.equal(B.oeffnungText(s.filialen.find((f) => f.id === "och")), "Mo–Sa  10:00–20:00 Uhr\nSo  geschlossen");
  assert.ok(B.oeffnungText(s.filialen.find((f) => f.id === "rr")).includes("Wochenmarkt"));
});

test("Druckblatt: Logo und Filiale drin, Eingaben werden maskiert", () => {
  const s = neu();
  const f = s.filialen[0];
  const d = { ...B.neuerDruck(s, "schild", f), titel: "<script>x</script>", text: "Zeile 1\nZeile <b>2</b>" };
  const h = B.blattHtml(s, d, f, { logo: "logo.svg", frootie: "frootie.svg" });
  assert.ok(h.includes('src="logo.svg"'));
  assert.ok(h.includes(f.name));
  assert.ok(!h.includes("<script>"));
  assert.ok(h.includes("&lt;b&gt;2&lt;/b&gt;"));
  const al = B.blattHtml(s, B.neuerDruck(s, "allergene", f), f, { logo: "l", frootie: "f" });
  assert.ok(al.includes("Gluten") && al.includes("Waffel Classic"));
});

// ---------- 0.14.0: eigene Büros je Rolle, Ordner überschneiden sich, Bezirksleitung ----------
test("Eigene Büros je Rolle: Ordner überschneiden sich, Inhaber sieht alle, Freigaben bleiben beim Inhaber", () => {
  const s = D.demoDaten("2026-11-13");
  const ord = (r) => B.ORDNER.filter((o) => B.darfOrdner(s, r, o.id)).map((o) => o.id);
  for (const r of ["zentrale", "bezirk", "qualitaet", "shopleitung", "stv", "berater"]) assert.ok(B.BUEROS[r] && B.BUEROS[r].dinge.length >= 8, r);
  assert.equal(ord("zentrale").length, B.ORDNER.length);
  assert.ok(ord("bezirk").includes("bezirk") && !ord("shopleitung").includes("bezirk"));
  assert.ok(ord("qualitaet").includes("regeln") && !ord("shopleitung").includes("regeln"));
  assert.ok(ord("shopleitung").includes("lohn") && !ord("stv").includes("lohn"));
  const gemeinsam = ord("qualitaet").filter((x) => ord("shopleitung").includes(x));
  assert.ok(gemeinsam.includes("hygiene") && gemeinsam.includes("studio"), "Ordner überschneiden sich");
  assert.deepEqual(ord("berater"), ["hygiene"]);
  assert.ok(!ord("bezirk").includes("freigaben") && !ord("bezirk").includes("personal"));
  for (const k of Object.values(B.BUEROS).flatMap((b) => b.dinge)) assert.ok(["monitor", "kalender"].includes(k) || B.BU_SVG[k], "Zeichnung für " + k);
});

test("Bezirksleitung: Leitung in ihren Filialen, keine eigenen Schichten, im Chat und in Leitungsterminen", () => {
  const s = D.demoDaten("2026-11-13");
  const bz = s.personen.find((p) => p.rolle === "bezirk");
  assert.ok(bz && bz.bezirk.length === 3);
  assert.equal(L.istLeitung(bz, "och"), true); assert.equal(L.istLeitung(bz, "osn"), false);
  assert.deepEqual(L.filialenVon(bz), ["och", "obh", "sin"]);
  assert.equal(L.darfInFiliale(bz, "och"), false);
  assert.ok(L.chatsFuer(s, bz.id).some((c) => c.id === "ch-och") && !L.chatsFuer(s, bz.id).some((c) => c.id === "ch-osn"));
  assert.ok(L.chatsFuer(s, bz.id).some((c) => c.art === "leitung"));
  const inv = s.termine.find((t) => t.fuer === "leitung");
  assert.ok(L.terminEingeladen(s, inv).includes(bz.id));
});

// ---------- 0.15.0: Büro einrichten ----------
test("Büro einrichten: Reihenfolge, Tauschen, Schieben, Zusatzteile höchstens 4 und nur erlaubte", () => {
  const basis = ["lampe", "monitor", "kalender", "korb"];
  assert.deepEqual(B.einrichtungAnwenden(basis, null), basis);
  assert.deepEqual(B.einrichtungAnwenden(basis, { folge: ["korb", "unbekannt", "lampe"] }), ["korb", "lampe", "monitor", "kalender"]);
  const e = B.einrichtungAnwenden(basis, { extra: ["uhr", "uhr", "pflanze", "kopierer", "becher", "figur", "gibtsnicht"] });
  assert.deepEqual(e.slice(4), ["uhr", "pflanze", "kopierer", "becher"]);
  assert.deepEqual(B.einrichtungAnwenden(basis, { extra: ["uhr", "rahmen"] }, ["uhr"]).slice(4), ["uhr"]);
  assert.deepEqual(B.teileTauschen(basis, "lampe", "korb"), ["korb", "monitor", "kalender", "lampe"]);
  assert.deepEqual(B.teilSchieben(basis, "monitor", -1), ["monitor", "lampe", "kalender", "korb"]);
  assert.deepEqual(B.teilSchieben(basis, "lampe", -1), basis);
  for (const k of B.KATALOG) assert.ok(B.BU_SVG[k.id], "Zeichnung für " + k.id);
  assert.match(B.BU_SVG.uhr(new Date(2026, 10, 13, 3, 0)), /rotate\(90 35 36\)/);
});

// ---------- 0.17.0: Etiketten mit Barcode ----------
test("Code 128: Prüfsumme, Zeichensatz B und C, Start/Stopp, ungültige Zeichen", () => {
  const breiten = (t) => B.code128(t);
  const a = breiten("A"); // Start B (104), A (33), Prüfsumme (104+33)%103=34, Stopp
  assert.equal(a.length, 6 * 3 + 7); assert.equal(a.join(""), "211214" + "111323" + "131123" + "2331112");
  const c = breiten("1234"); // Start C (105), 12, 34, Prüfsumme (105+12+68)%103=82
  assert.equal(c.slice(0, 6).join(""), "211232");
  assert.equal(c.reduce((s, x) => s + x, 0), 11 * 4 + 13, "jedes Zeichen 11 Module, Stopp 13");
  assert.equal(B.code128("Grüße"), null); assert.equal(B.code128(""), null);
  assert.match(B.code128Svg("FR-ar1", 10), /^<svg class="et-strich"/);
});

test("Etiketten: Formate passen auf A4, Preise je Größe nie geraten", () => {
  for (const f of B.ET_FORMATE) { const r = B.etRaster(f); assert.ok(r.sp >= 2 && r.ze >= 3 && r.sp * f.w <= 198 && r.ze * f.h <= 285, f.id); }
  assert.deepEqual(B.etRaster(B.ET_FORMATE.find((f) => f.id === "60x60")), { sp: 3, ze: 4 });
  assert.deepEqual(B.etPreise("3,5 / 4,9", ["S", "M", "L"]).map((x) => x.p), ["3,50 €", "4,90 €", "… €"]);
  assert.deepEqual(B.etPreise("", []).map((x) => x.p), ["… €"]);
});
