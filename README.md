# frooters Team-App (Testversion 0.10.0, DEV)

Handy- und Tablet-App (PWA) für alle frooters-Filialen. Aufbau wie die Köcheclub Club-App: Programm ohne Build-Schritt,
Kacheln je Rolle, Frootie als Helfer (statt Twinkey), Versionsvertrag mit atomarem Update.
Konzept: `docs/FROOTERS-APP-KONZEPT.md`, Hygiene: `docs/FROOTERS-HYGIENE-KONZEPT.md`. Regeln für Menschen und Coding-Agents: `AGENTS.md` (KC-Entwicklervertrag). PC-Version (Verwaltung): `docs/PC-VERWALTUNG-KONZEPT.md` mit Ansicht `docs/verwaltung.html`.

**Stand 0.1.0:** Die App läuft mit **Beispieldaten im Browser** (Adapter `demo`). Es gibt noch keinen Server, kein Supabase-Projekt
und keine echte Anmeldung. Oben wählt man eine Person und sieht die App aus ihrer Sicht. Nur Filialen, kein Franchise.
Filialen und Rollen folgen den Antworten aus dem Fragebogen (`docs/ANTWORTEN-FRAGEBOGEN-2026-11.md`): Pilot Ochtrup, dazu Oberhausen, Sinsheim, Osnabrück und der mobile Stand Road Runner.

**Testversion zum Weitergeben:** https://sire65.github.io/frooters-testversion/ (öffentliches Repository `frooters-testversion`, nur App-Dateien mit Beispieldaten).

## Starten

```
python3 -m http.server 8765    # dann http://localhost:8765 öffnen
npm test                       # Logik- und Vertragstests (node --test)
```

## Bereiche

| Bereich | Wer | Inhalt | Feature-ID |
|---|---|---|---|
| Mein Bereich | Mitarbeiter, Aushilfen, Leitung | Mein Dienstplan (auch Springer-Einsätze), Dienstwünsche (möchte / kann / kann nicht, Früh oder Spät), **Abwesenheit** (Urlaub, Krankmeldung, Bildungsurlaub und mehr) mit **Urlaubskonto**, **Tauschbörse** (Schicht oder Stunden abgeben, übernehmen, gegen eigene Schicht tauschen), Stechuhr mit Pausenhinweis | FR-PLANUNG, FR-TAUSCH, FR-FEHLZEITEN, FR-STECHUHR |
| Hygiene | alle im Shop | Tagesliste aus Regeln, Geräten, Öffnungszeit und Einsatzplan, abhaken mit Messwert, Maßnahme bei Abweichung, automatische Nachkontrolle, Meldung an die Shopleitung | FR-HYG-03 bis 09 |
| Rezepte | alle | nach Warengruppen, Mengen je Größe, Allergene, Zubereitung, **Rezept-Quiz** (Frage und Antwort) | FR-REZEPTE |
| Pinnwand | alle | wie in der Club-App: Farben, Empfänger, ❗ wichtig, Lesebestätigung mit Übersicht wer gelesen hat, Antworten, Erinnern, Abnehmen (auch nur bei Lesern), Einstellungen im Admin | FR-PINNWAND |
| Shopleitung / Stellvertretung | Leitung der eigenen Filiale | Einsatzplan (Woche, Ampel, Vorschlag erst mit eigenem Team, dann mit Springern, Veröffentlichen), **Besetzungsmatrix** mit Rollenvorgaben, grafische Übersicht und Lückenliste, Anträge genehmigen (Urlaub, Bildungsurlaub und Schichttausch), **Urlaubsübersicht** mit Filter nach Filialen, Krank und offene Schichten, Hygiene-Kontrolle (7 Tage), Regeln und Geräte des Shops (gilt hier / trifft nicht zu, eigene Uhrzeit, Gerät gestört), Stempelzeiten, Stundenliste mit CSV-Export für den Steuerberater, Team | FR-PLANUNG, FR-HYG-05, FR-HYG-10 |
| Qualität & Pflege | feste Person | Hygieneregeln und Rezepte für alle Filialen pflegen, Hygiene-Kontrolle | FR-REZEPTE, FR-HYG-02 |
| Hygieneberater | extern, nur lesen | Hygiene-Tagesliste und Kontrolle aller Filialen ansehen, nichts ändern | FR-HYG-10 |
| Zentrale (Inhaber) | Zentrale | Auswertung je Filiale und gesamt, Mitarbeiter-Stammdaten mit **Stundenumfang (Woche/Monat), Urlaubsanspruch, Springer-Haken und Einsatzfilialen**, Filialen (Öffnungszeiten, Besetzung), Hygieneregeln global (Assistent in 6 Schritten), **Admin: Betreiber und eigene Datenbanken je Franchisenehmer** (`docs/ADMIN-MANDANTEN-KONZEPT.md`), Rezepte pflegen, Sortiment je Filiale, Einsätze des mobilen Stands | FR-PERSONAL, FR-ORG, FR-HYG-02 |

**Springer:** In den Stammdaten bekommt eine Person den Haken „Springer“ und Haken bei jeder Filiale, in der sie aushelfen darf.
Nur dort taucht sie bei der Einsatzplanung auf (grauer Rand, „↔“). Überschneidungen mit Schichten in anderen Filialen werden erkannt.

**Hygiene-Regeln:** Regeln mit Gerätetyp gelten je Gerät. Ein Shop ohne Eismaschine bekommt keine Eismaschinen-Aufgabe.
Pflichtregeln kann nur die Zentrale abschalten. Nicht erledigte Aufgaben werden nie grün (KICC-Regel 11).

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html` | Seite mit Content-Security-Policy, lädt die Programmdateien mit `?v=<Version>` |
| `logik.js` | reine Rechenlogik (Planung, Springer, Abdeckung, Hygiene-Tagesliste, Grenzwerte, Stechuhr, Quiz), auch in Node testbar |
| `daten.js` | Daten-Adapter (Registry) und Beispieldaten. Ein Adapter `supabase` muss `laden`, `speichern`, `zuruecksetzen` liefern. |
| `buero.js` | Büro: Ordner und Rechte, Vorlagen des Grafik- & Druckstudios, Druckblätter, Briefe, Hygiene-Bericht |
| `app.js` | Oberfläche, Ansichten, Aktionen |
| `sw.js` | Service Worker: alle Dateien einer Version zusammen (alles oder nichts) |
| `version.json`, `manifest.webmanifest`, `frootie.svg`, `icon-*.png` | Version, Installation, Frootie |
| `tests/` | `logik.test.js` (Fachtests), `buero.test.js` (Ordnerrechte, Preise, Druckblätter), `vertrag.test.js` (Versionsvertrag, Service Worker, Sicherheit, Hilfetexte); zusammen 52 Tests |

**Version:** `APP_VERSION` (app.js) = `VERSION` (sw.js) = `version.json` = alle `?v=` in index.html. Jede Änderung erhöht alle gemeinsam, der Test prüft das.

## Noch nicht enthalten (nächste Schritte)

1. Server: Supabase-Projekt in Frankfurt, Edge Function `fr-app`, Tabellen `fr_*` mit RLS, Adapter `supabase` (braucht Freigabe, Tarifentscheidung)
2. Echte Anmeldung (Einladungslink, PIN, zweiter Faktor für Leitung), Stand-Tablet mit Ausweis-QR
3. Push-Nachrichten (Krankmeldung, Abweichung, Plan veröffentlicht), Nachrichten/Chat und Termine aus der Club-App
4. Neon-Spiegel und Datensicherung wie bei der Club-App
5. Erklärvideos zu jeder Funktion (Pflicht vor FINAL), Arbeitsvideos zu Rezepten
6. Offline-Warteschlange fürs Tablet, Lohnexport, Schichttausch, Korrekturanträge für Stempelzeiten
7. Echte Rezepte, Grenzwerte und Geräteliste von frooters, Logo nach Freigabe
