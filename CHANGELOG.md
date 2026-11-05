# Änderungen frooters Team-App

## 0.5.0 (DEV) · 05.11.2026
- Pinnwand wie in der Club-App: Zettel in 4 Farben (leicht schräg), für alle im Shop, die Leitung, bestimmte Personen, nur für mich oder (Inhaber) alle Filialen; ❗ wichtig mit „Gelesen und verstanden“; optional „hängt bis“
- Lesebestätigung: Fenster mit neuen Zetteln beim Öffnen, „✓ Gelesen“ je Zettel; Verfasser und Leitung sehen, wer wann gelesen hat und wer noch nicht, und können erinnern
- Antworten mit eigenem Zettel an den Verfasser, Filter (ungelesen, für mich, wichtig, von mir), Erinnerung an eigene Zettel, die lange hängen („abnehmen“ oder „hängen lassen“)
- Verwalten (Verfasser, Shopleitung, Inhaber): wichtig an/aus, ganz abnehmen oder nur bei denen, die gelesen haben
- Admin: Pinnwand-Einstellungen (Zettel je Person, Zeichen, Erinnern nach Tagen, Pause)
- Besetzungsmatrix je Filiale und Tagesart (Mo–Fr, Sa, So, Einsatz) mit Zeitblöcken: Personen, Shopleitung, weitere Leitung, feste Mitarbeiter, höchstens Aushilfen
- Grafische Wochenübersicht (Stundenraster mit Ampel und „da / nötig“), Tagesansicht mit Balken je Person und Rolle, Liste aller nicht richtig besetzten Zeiten mit Grund und „+ einteilen“
- Planvorschlag beachtet die Matrix (fehlt eine Leitung, zuerst Leitung; zu viele Aushilfen, keine weiteren) und plant niemanden über 10 Std. am Tag

## 0.4.1 (DEV) · 05.11.2026
- Original-Logo von frooters oben in der App und auf der Startseite, Frootie (Erdbeere mit grüner Kappe, Vorschlag 1) größer bei der Begrüßung und in den Hilfetexten

## 0.4.0 (DEV) · 05.11.2026
- Admin-Einstellungen (Inhaber): Betreiber anlegen (eigene Filialen oder Franchisenehmer), Filialen zuordnen, AV-Vertrag, eigene Datenbank je Betreiber (Supabase-Projekt und Neon-Projekt, beide Frankfurt)
- Prüfung der Verbindungsdaten: Format, Region Frankfurt; geheime Schlüssel (sb_secret, service_role), Datenbank-Passwörter und Neon-API-Schlüssel werden erkannt und nicht gespeichert
- 7 Schritte bis zur Freigabe; Verbindung und erste Datensicherung werden nur automatisch geprüft (ab Server-Version), deshalb bleibt die Freigabe bis dahin gesperrt
- Konzept: `docs/ADMIN-MANDANTEN-KONZEPT.md` (jeder Franchisenehmer mit eigener Datenbank)

## 0.3.0 (DEV) · 05.11.2026
- Tauschbörse: Mitarbeiter bieten eine ganze Schicht oder einzelne Stunden (am Anfang oder Ende, mindestens 1 Std.) an. Kollegen übernehmen oder tauschen gegen eine eigene ganze Schicht.
- Die App prüft vor jedem Tausch: darf in der Filiale arbeiten (Springer-Haken), nicht krank oder im Urlaub, keine Überschneidung; Hinweise bei „kann nicht“ und überschrittenen Wochenstunden
- Die Shopleitung bestätigt unter „Anträge“, erst dann ändert sich der Plan. Abgegebene Stunden erscheinen im Plan mit eigener Uhrzeit.

## 0.2.0 (DEV) · 04.11.2026
Antworten aus dem Fragebogen (`docs/ANTWORTEN-FRAGEBOGEN-2026-11.md`) eingearbeitet.
- Filialen: Ochtrup Designer Outlet (Pilot), Oberhausen Centro, Sinsheim Therme, Osnabrück (Bowls & Smoothie, Café) und Road Runner als mobiler Stand mit Einsatztagen und Ort. Kurze Einsätze haben eine durchgehende Schicht.
- Sortiment je Filiale (Warengruppen), neue Warengruppen Bowls und Café, Rezepte und Quiz zeigen nur das Sortiment der Filiale
- Neue Rollen: Qualität & Pflege (feste Person für Rezepte und Hygieneregeln) und Hygieneberater (liest Hygiene aller Filialen, kann nichts ändern)
- Keine eigene Bezirksleitung: der Inhaber sieht alle Filialen
- Rezepte pflegen (Zutaten mit Mengen je Größe und Allergenen, Zubereitung)
- Stundenliste je Filiale und Monat mit CSV-Export für den Steuerberater (statt Stundenzettel)
- Neue Gerätetypen Kaffeemaschine und Kühlbox (mobil) mit Hygieneregeln

## 0.1.2 (DEV) · 04.11.2026
- Fehler behoben: Im geteilten Link blieb die App bei „wird geladen“ hängen, weil der gesperrte Update-Dienst den Start abbrach. Die App zeigt sich jetzt zuerst an und versucht den Update-Dienst danach, abgesichert.

## 0.1.1 (DEV) · 04.11.2026
- Hell- und Dunkel-Design folgen auch einer festen Auswahl der Anzeige (data-theme), nicht nur der Systemeinstellung
- Testversion zusätzlich als Seite mit Link zum Weitergeben

## 0.1.0 (DEV) · 04.11.2026
Erste Testversion auf Basis der Club-App, nur Filialen (kein Franchise), Beispieldaten im Browser.
- Mitarbeiter: Mein Dienstplan, Dienstwünsche, Krank melden, Urlaubsantrag, Stechuhr mit Pausenhinweis
- Hygiene: Tagesliste je Filiale aus Regeln, Geräten, Öffnungszeit und Einsatzplan, Messwerte mit Grenzwerten, Maßnahmen, Nachkontrolle, Meldung an die Shopleitung
- Rezepte nach Warengruppen mit Größen, Allergenen, Zubereitung und Rezept-Quiz
- Pinnwand je Filiale
- Shopleitung und Stellvertretung: Einsatzplan mit Ampel und Vorschlag (eigenes Team, dann Springer), Veröffentlichen, Anträge, Krank und offene Schichten, Hygiene-Kontrolle, Regeln und Geräte des Shops, Stempelzeiten, Team
- Zentrale: Auswertung je Filiale und gesamt, Mitarbeiter mit Springer-Haken und Einsatzfilialen, Filialen, Hygieneregeln
- Frootie (Vorschlag 1) mit Hilfetext in jedem Bereich
- Versionsvertrag, atomarer Service Worker, 20 Tests
