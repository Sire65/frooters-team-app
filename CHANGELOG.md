# Änderungen frooters Team-App

## 0.12.0 (DEV) · 12.11.2026 · Bedienkonzept wie in der Club-App
- Abgleich mit der Club-App: `docs/ABGLEICH-CLUB-APP.md` (was übernommen wird, was später kommt, was nicht passt)
- „⚙️ Meine App“: Ansicht Einfach/Erweitert, große Schrift, Hell/Dunkel/wie das Handy, Kachelgröße; gilt nur auf diesem Gerät
- Kacheln sortieren (↑ ↓) und ausblenden; „Einfach“ zeigt nur das Nötigste, alles andere bleibt über die Suche erreichbar
- Zurück-Taste des Handys: schließt zuerst das offene Fenster, dann eine Seite zurück (vorher verließ sie die App); Esc schließt Fenster am PC
- Einweisung: Frootie erklärt jeden Bereich beim ersten Öffnen mit „👍 Verstanden“, danach nur noch über ❓; „Alle Erklärungen wieder zeigen“
- Vorlesen 🔊 an Frootie-Hinweisen und an der Zubereitung jedes Rezepts
- „Frag Frootie“ wie „Frag Twinkey“: Frage eintippen, Antworten mit „👉 Zeig es mir“, versteht ähnliche Wörter und Tippfehler, häufige Fragen; ohne KI und ohne Server
- Suche 🔍 im Kopf über Bereiche, Personen, Rezepte, Zutaten, Artikel, Pinnwand und häufige Fragen; verzeiht Tippfehler; zeigt nur, was die Person öffnen darf
- „Was ist neu“ nach einem Update in einem Satz mit Sprungknopf; Ruhe-Regel: höchstens ein Info-Fenster pro Öffnen, die Pinnwand geht vor
- Zähler am App-Symbol (ungelesene Zettel), wo das Handy es kann
- Rechte je Ansicht an einer Stelle (für Seiten, Suche und „Zeig es mir“)

## 0.11.0 (DEV) · 05.11.2026 · PC-Version Stufe 4 (Teil ohne Gastronovi)
- Kassendaten einlesen: CSV aus Gastronovi oder einer anderen Kasse (Datei oder Kopieren/Einfügen); Spalten Datum, Uhrzeit, Umsatz, Anzahl, Artikel werden an der Kopfzeile erkannt oder von Hand zugeordnet; deutsche Zahlen und Datumsangaben; Vorschau je Tag; erneutes Einlesen ersetzt dieselben Tage (nichts doppelt)
- Umsatz & Personal (Shopleitung): Ø Umsatz je Stunde aus den letzten 4 gleichen Wochentagen neben den Personen laut Plan, Umsatz je Personalstunde; Hinweis rot bei viel Umsatz für wenig Personal, grün bei ruhigen Stunden mit mehr Personal
- Monatsübersicht für den Steuerberater (in der Stundenliste): Soll aus dem Stundenumfang, gestempelt, geplant, Differenz und Abwesenheitstage je Art; als CSV je Filiale oder (Inhaber) alle Filialen
- Beispielumsätze (erfunden) für die Testversion, deutlich gekennzeichnet

## 0.10.0 (DEV) · 05.11.2026 · PC-Version Stufe 3
- Artikel & Lieferanten (Zentrale): Artikel mit Lieferant, Bestellnummer, Lagerort, Einheit, Gebinde (z. B. Karton à 6 l), Verknüpfung zur Zutat, optional Einkaufspreis; Lieferanten mit E-Mail, Telefon, Bestelltagen
- Sortiment & Soll (Shopleitung): welche Artikel die Filiale führt, Sollbestand und Mindestbestand
- Bestand aufnehmen am Handy, nach Lagerort sortiert, letzter Wert als Hilfe; leer = nicht gezählt
- Bestellvorschlag je Lieferant: Soll − Ist − schon unterwegs, aufgerundet auf volle Gebinde; unter Mindestbestand rot und oben; ohne gezählten Bestand kein Vorschlag
- Mengen prüfen und „Bestellung freigeben“: je Lieferant eine Bestellung; Drucken/PDF im frooters-Design, E-Mail vorbereiten (öffnet das Mailprogramm, nichts wird automatisch verschickt), „als bestellt markieren“
- Wareneingang: mit dem Lieferschein vergleichen, Abweichungen werden notiert und der Shopleitung gemeldet

## 0.9.0 (DEV) · 05.11.2026 · PC-Version Stufe 2
- Zutaten & Allergene: Zutatenstamm mit Lieferant, Artikelnummer, Zusatzstoffen und den 14 Hauptallergenen je Zutat (enthält / Spuren / nein); am PC als Tabelle mit allen Allergenen
- Rezepte rechnen ihre Allergene und Spuren aus den Zutaten; Zutatenzeilen ohne Allergene („Zutat | Mengen | Einheit“), unbekannte Zutaten werden neu angelegt
- 4-Augen-Freigabe: Jede Änderung an Rezept oder Zutat ist zuerst ein Entwurf; gültig erst nach Freigabe durch eine zweite Person (Qualität & Pflege, Inhaber oder Shopleitung). Eigene Änderungen kann man nicht selbst freigeben. Ein Rezept mit ungeprüften Zutaten kann nicht freigegeben werden
- Bis zur Freigabe sieht das Team die alte Fassung; neue Rezepte erscheinen erst nach der Freigabe in Rezepten, Quiz, Preisliste und Allergen-Aushang
- Seite „Freigaben“ mit allen offenen Änderungen und was sich ändert (z. B. „enthält neu: Soja · betrifft: …“), Freigeben oder Verwerfen
- Fassungen: Jede Freigabe ergibt eine neue Fassung, die alten bleiben lesbar
- Rezept im Shop zeigt Spuren und Fassung; Allergen-Aushang mit ○ für Spuren
- Shopleitung hat die Kachel „Rezepte pflegen“ (als zweite Person für Freigaben)

## 0.8.0 (DEV) · 05.11.2026 · PC-Version Stufe 1
- PC-Ansicht ab 1100 Pixel Breite für Leitung, Zentrale und Qualität: Seitenleiste mit allen Bereichen und Zählern, breiter Inhalt; am Handy bleibt alles wie bisher
- Mitarbeiter am PC als Tabelle mit Filtern (Filiale, Beschäftigung, Einsatz, Suche), Klick auf eine Zeile öffnet die Details rechts
- Neue Felder: Beschäftigungsart (Vollzeit, Teilzeit, Minijob, kurzfristig, Werkstudent, Azubi, Schüler/Ferienjob, Praktikum), Eintritt, befristet bis, unter 18 (ab 16)
- „Darf Stunden überschreiten“ mit Grenze (z. B. +5 Std.): keine Rückfrage bis zur Grenze, der Planvorschlag darf bis dahin planen; gilt nie bei Minijob und unter 18
- Einsatzprofil: total flexibel, nur Frühdienst, nur Spätdienst, nur morgens bis … Uhr, nur abends ab … Uhr, nur an bestimmten Tagen, nicht an Tagen (mit Grund); Bereitschaftsdienst mit Zeitfenstern
- Springer mit Anreise (Auto, Bus/Bahn, braucht Fahrt) und Fahrzeit je Filiale
- Qualifikationen mit Ablaufdatum (Belehrung § 43 IfSG, Hygieneschulung, Allergenschulung, Kasse, Schlüssel, Führerschein); Hinweis auf der Startseite, wenn etwas in 30 Tagen abläuft
- Planung: Profil ist feste Regel im Planvorschlag; beim Einteilen von Hand Rückfrage „Trotzdem einplanen?“ bei Profil, Stunden und Jugendschutz; Bereitschaft wird bevorzugt vorgeschlagen
- Hinweise (warnen nur): Jugendschutz (8 Std./Tag, 40 Std./Woche, 5 Tage, abends 20 bzw. 22 Uhr), kurzfristig (70 Tage im Jahr), Werkstudent (20 Std./Woche). Werte vorläufig, vom Steuerberater bestätigen
- Mitarbeiter aus Excel einlesen (CSV oder Kopieren/Einfügen) mit Vorschau, Fehlern je Zeile und Vorlage zum Herunterladen
- Shopleitung pflegt die Mitarbeiter der eigenen Filiale (Kachel „Mitarbeiter“)
- Filialen mit Bundesland (für Feiertage) und Übersichtstabelle am PC

## 0.7.0 (DEV) · 05.11.2026
- Kachel „🗂️ Büro“ für Leitung, Zentrale, Qualität und Hygieneberater: Ordner-Regal, der Inhaber sieht alle 11 Ordner, Shopleitungen 6 (Standard)
- Ordner: Grafik- & Druckstudio, Shop-Unterlagen, Hygiene-Nachweise (Bericht zum Drucken, 7 oder 30 Tage), Adressen & Lieferanten, Lohn & Stunden, Archiv, Personalakte (nur Inhaber), Briefe (Briefpapier), Zentrale, Auswertungen, Freigaben
- Freigaben (nur Inhaber): je Ordner und Rolle an/aus; „Zentrale“ und „Freigaben“ bleiben beim Inhaber
- Grafik- & Druckstudio im frooters-Design: Preisliste (Vorschlag aus den Rezepten der Filiale), Schild/Hinweis, Öffnungszeiten (aus den Filialdaten, beim Road Runner die nächsten Einsätze), Aktion/Angebot, Allergen-Aushang (aus den Rezepten), Aushang fürs Team
- Live-Vorschau, Hoch-/Querformat, 4 Farben, Symbole, Frootie; Drucken über den Druckdialog (auch „Als PDF speichern“), Speichern im Ordner, später erneut drucken
- Lange Listen werden automatisch kleiner gesetzt, damit nichts vom Blatt fällt; Preise werden nie erfunden: leere Preise erscheinen als „… €“

## 0.6.0 (DEV) · 05.11.2026
- Stundenumfang je Mitarbeiter in den Stammdaten (pro Woche oder pro Monat, z. B. 15 Std./Woche oder 40 Std./Monat bei Aushilfen)
- Einplanen über den Stundenumfang: Rückfrage „Trotzdem einplanen?“ mit bisherigen und neuen Stunden (Aushilfen: Hinweis Minijob-Grenze); der Planvorschlag plant niemanden über den Umfang
- Kachel „Abwesenheit“ statt „Krank melden“ und „Urlaub“: Urlaub, Krankmeldung, Kind krank, Bildungsurlaub, Sonderurlaub, Freizeitausgleich, Schule, unbezahlter Urlaub; Krank gilt sofort, alles andere nach Genehmigung, beantragte Anträge lassen sich zurückziehen
- Urlaubskonto: Anspruch, Übertrag, genommen, geplant, beantragt, Rest (Arbeitstage Mo–Fr); Bildungsurlaub als eigenes Konto; Anspruch, Übertrag und Bildungsurlaub in den Stammdaten
- Anträge für alle genehmigungspflichtigen Arten mit Tagen, Kontostand nach Genehmigung und Hinweis, wer in der Zeit schon fehlt
- Urlaubsübersicht für die Leitung: Filter Filialen (eigene, alle, bestimmte) und Art; Monatskalender je Person, Urlaubskonten je Person, Liste. Krankmeldungen aus fremden Filialen erscheinen nur als „abwesend“ (außer für den Inhaber)

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
