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
