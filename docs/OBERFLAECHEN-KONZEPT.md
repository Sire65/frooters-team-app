# Konzept Oberflächen nach Rolle (FR-UI)

**Stand:** 05.11.2026 · **Status:** KONZEPT · **Ansichtsbeispiele:** `docs/oberflaechen.html` (frooters-Logo und -Farben)
**Grundlage:** Fragebogen vom 04.11.2026 (Pilot Ochtrup, Reihenfolge Einsatzplanung, Hygiene, Rezepte), Testversion 0.3.0

## 1. Grundsatz

**Jede Rolle bekommt ihre eigene Startseite.** Gleiche App, gleiche Daten, aber nur das, was diese Person braucht.

| Rolle | Gerät | Frage, die die Startseite beantwortet |
|---|---|---|
| 🧃 **Mitarbeiter und Aushilfen** | Handy | „Wann arbeite ich, was muss ich heute tun, was ist neu?“ |
| 🍍 **Shopleitung und Stellvertretung** | Handy und Tablet im Shop | „Läuft mein Shop heute, und was muss ich entscheiden?“ |
| 🗺️ **Bezirksleitung** | Tablet oder PC, unterwegs Handy | „Welcher meiner Shops braucht mich gerade?“ |
| 👑 **Inhaber / CEO** | PC, unterwegs Handy | „Wie stehen alle Shops da, einzeln und zusammen?“ |

Dazu kommen zwei Nebenrollen ohne eigene Oberfläche: **Qualität & Pflege** (Rezepte und Hygieneregeln, nutzt die Verwaltung des Inhabers mit eingeschränkten Rechten) und **Hygieneberater** (nur lesen).

## 2. Gestaltungsregeln für alle Oberflächen

1. **Logo und Farben von frooters:** Logo oben links. Salbei `#A3A983` für Flächen und Kopfbereich, Rot `#C10230` für die wichtigste Aktion auf jeder Seite, Grün `#76BC21` für „erledigt / in Ordnung“, Schrift `#1D1D1B`. Hintergrund fast weiß. Im Dunkelmodus werden die Farben angepasst.
2. **Schriften:** Arvo für Überschriften, Didact Gothic für Text, wie auf frooters.de. In der fertigen App werden sie **selbst ausgeliefert**, nicht von Google geladen, damit keine Daten an Google gehen (DSGVO).
3. **Ampel immer mit Wort:** 🟢 erledigt, 🟡 jetzt fällig, 🔴 überfällig oder Problem, ⚪ noch nicht dran. Die Farbe steht nie allein, für Farbenblinde und für schnelles Lesen.
4. **Höchstens zwei Tipps bis zum Ziel:** Krank melden, Hygiene abhaken und den eigenen Dienst sehen gehen von der Startseite mit einem Tipp.
5. **Große Bedienflächen:** Knöpfe mindestens 48 Pixel hoch, Schrift mindestens 16 Pixel. Alles ist mit einer Hand am Handy bedienbar.
6. **Untere Navigation am Handy:** 4 bis 5 feste Reiter, immer an derselben Stelle. Am Tablet und PC steht die Navigation links.
7. **Frootie hilft überall:** Das ❓ oben rechts öffnet eine kurze Erklärung zur Seite. Später gibt es zu jeder Funktion ein Video.
8. **Leitung ist auch Mitarbeiter:** Shopleitung, Stellvertretung und Bezirksleitung haben oben einen Umschalter **„Mein Dienst ↔ Shop“** bzw. **„Mein Dienst ↔ Bezirk“**. So sehen sie ihren eigenen Plan genauso einfach wie ihr Team.
9. **Fehlende Daten sind sichtbar:** „Noch nicht gestempelt“ oder „keine Daten“ wird nie als grün oder 0 angezeigt.

## 3. Mitarbeiter und Aushilfen: die einfache Oberfläche

**Ziel:** In 5 Sekunden wissen, wann man arbeitet und was heute zu tun ist. Keine Verwaltung, keine Fachbegriffe.

### 3.1 Startseite „Heute“
Von oben nach unten, nur was heute wichtig ist:

| Block | Inhalt | Aktion |
|---|---|---|
| Begrüßung | „Hallo Lena!“ mit Frootie, darunter ein wichtiger Pinnwand-Zettel, falls vorhanden | – |
| **Mein nächster Dienst** | Tag, Uhrzeit, Filiale (beim Road Runner der Ort), Kollegen in derselben Schicht | „Plan ansehen“ |
| **Meine Aufgaben jetzt** | fällige Hygiene-Aufgaben für mich, zum Beispiel „2 Aufgaben · Kühlvitrine messen“ | direkt abhaken |
| **Neu für dich** | ungelesene Nachrichten, Pflicht-Infos zum Bestätigen, Antwort auf Urlaub oder Tausch | antippen öffnet |
| **Nächster Termin** | zum Beispiel „Teamrunde Do 9:00“ mit Zusage, Absage oder Vielleicht | Zusage |
| Schnellknöpfe | 🤒 **Krank melden** · 🏖️ **Urlaub** · 🔁 **Tauschen** | ein Tipp |

### 3.2 Untere Navigation (5 Reiter)

| Reiter | Inhalt |
|---|---|
| 🏠 **Heute** | Startseite |
| 🗓️ **Dienst** | Mein Plan (diese und nächste Woche) · Dienstwünsche · Tauschbörse · Urlaub · Krank melden · später mein Stundenkonto |
| 🧼 **Hygiene** | Meine Aufgaben · alle Aufgaben im Shop · abhaken mit Maßnahme bei Abweichung |
| 💬 **Team** | Nachrichten (Shop-Team, Shopleitung, Einzelne) · Pinnwand · Termine |
| 📖 **Lernen** | Rezepte nach Warengruppen · Allergene · Rezept-Quiz · Erklärvideos · Frag Frootie |

Meine Daten, Einstellungen und App-Version stehen hinter dem Profilbild oben rechts, nicht in der Navigation.

### 3.3 Was Mitarbeiter nicht sehen
Andere Personen in Krankmeldungen (nur „abwesend“), Stundenlöhne, Planung anderer Shops, Regeln und Geräte, Auswertungen.

### 3.4 Aushilfen
Gleiche Oberfläche. Unterschied nur in den Daten: Minijob-Grenze im Stundenkonto, Wünsche für mehrere Wochen, als Springer sehen sie Schichten aller freigegebenen Filialen mit Filialname.

## 4. Shopleitung und Stellvertretung

**Ziel:** Den Shop heute im Griff haben und alles Offene schnell entscheiden.

### 4.1 Startseite „Mein Shop heute“

| Block | Inhalt |
|---|---|
| **Besetzung heute** | Früh- und Spätdienst mit Namen, Ampel (z. B. 2/2), wer ist eingestempelt, wer fehlt (krank) |
| **Zu entscheiden** (Zahl im roten Kreis) | Urlaubsanträge · Tauschanfragen · Krankmeldungen mit offenen Schichten · Korrekturen von Stempelzeiten |
| **Hygiene heute** | Fortschritt in % · überfällige Aufgaben · offene Abweichungen mit Maßnahme |
| **Diese Woche** | Lücken im Plan (rote Tage), Plan veröffentlicht ja oder nein |
| **Team-Nachrichten** | neue Nachrichten, offene Pflicht-Infos („3 haben noch nicht gelesen“) |

### 4.2 Navigation

| Reiter | Inhalt |
|---|---|
| 🏠 **Shop heute** | Startseite |
| 📅 **Planung** | Einsatzplan Woche · Vorschlag · Veröffentlichen · offene Schichten · Springer anfragen |
| ✅ **Anträge** | Urlaub · Tausch · Krankmeldungen · Stempelkorrekturen |
| 🧼 **Hygiene** | Tagesliste · Kontrolle 7 Tage · Regeln und Geräte des Shops |
| ☰ **Mehr** | Team · Stundenliste für den Steuerberater · Nachrichten und Pflicht-Infos senden · Pinnwand · Termine anlegen |

Oben der Umschalter **„Mein Dienst ↔ Shop“**: Mit „Mein Dienst“ sieht die Shopleitung genau die Mitarbeiter-Oberfläche aus Kapitel 3.

### 4.3 Stellvertretung
Gleiche Oberfläche. Was sie genehmigen darf, legt die Shopleitung fest (Standard: Planung und Tausch ja, Urlaub nur bei Abwesenheit der Shopleitung).

## 5. Bezirksleitung

**Ziel:** Auf einen Blick sehen, welcher Shop Hilfe braucht, und Springer verteilen. Laut Fragebogen macht das zurzeit der Inhaber selbst. Die Rolle ist trotzdem vorbereitet, damit sie später ohne Umbau vergeben werden kann.

### 5.1 Startseite „Mein Bezirk“
- **Eine Karte je Filiale** mit vier Ampeln: Besetzung heute · Hygiene heute · offene Anträge · Krankmeldungen. Sortiert nach Handlungsbedarf, der Shop mit den meisten roten Ampeln steht oben.
- **Brennt gerade:** unbesetzte Schichten in den nächsten 3 Tagen · Hygiene überfällig seit mehr als 2 Std. · kritische Abweichungen ohne Abschluss
- **Springer:** wer ist diese Woche noch frei, mit Vorschlag „in Oberhausen einplanen“

### 5.2 Navigation

| Reiter | Inhalt |
|---|---|
| 🗺️ **Bezirk** | Startseite |
| 🏪 **Filialen** | Antippen öffnet die Shop-Oberfläche dieser Filiale (wie die Shopleitung, mit Hinweis „Sie sehen Ochtrup als Bezirksleitung“) |
| 📅 **Springer** | Springer-Plan über alle Filialen des Bezirks |
| 🧼 **Hygiene** | Erfüllung je Filiale, Abweichungen, Berichte für Lebensmittelkontrolle und Berater |
| 📊 **Zahlen** | Besetzung, Stunden, Krankenquote je Filiale und zusammen |

## 6. Inhaber / CEO

**Ziel:** Alle Shops einzeln und zusammen auf einen Blick, Entscheidungen auf Unternehmensebene, Stammdaten.

### 6.1 Startseite „Cockpit“ (PC)
- **Kennzahlen-Leiste** für alle Shops zusammen, jeweils mit Vergleich zur Vorwoche:
  - Besetzung dieser Woche in %
  - geplante und gestempelte Stunden
  - Krankenquote
  - Hygiene-Erfüllung
  - offene kritische Abweichungen
- **Tabelle je Filiale:** dieselben Zahlen je Shop, Antippen öffnet die Filiale
- **Hinweise:** fällige Belehrungen, Stunden des Monats nicht abgeschlossen, Pilot-Rückmeldungen
- **Später:** Umsatz und Personalkostenquote über die Kasse **Gastronovi**

### 6.2 Navigation (links am PC)

| Bereich | Inhalt |
|---|---|
| 📊 **Cockpit** | Startseite |
| 🏪 **Filialen** | Öffnungszeiten, Besetzung, Sortiment, Road-Runner-Einsätze, Geräte |
| 👥 **Personal** | Mitarbeiter aufnehmen, Rolle, Stammfiliale, **Springer-Filialen**, Austritt |
| 🧼 **Hygiene & Qualität** | Regeln für alle Filialen, Maßnahmen, Berichte, Zugang für den Hygieneberater |
| 📖 **Rezepte** | Warengruppen, Rezepte, Allergene (auch für die Rolle Qualität & Pflege) |
| 📤 **Lohn & Export** | Stundenliste je Monat für den Steuerberater |
| ⚙️ **Einstellungen** | Rollen und Rechte, Grenzwerte, Marken |

### 6.3 Unterwegs am Handy
Nur das Cockpit in Kurzform (vier Kennzahlen, Ampel je Filiale) und Meldungen bei kritischen Abweichungen. Die Verwaltung bleibt am PC.

## 7. Nachrichten und Termine (neu, aus der Club-App)

| Funktion | Inhalt | Wer schreibt |
|---|---|---|
| **Shop-Chat** | eine Gruppe je Filiale | alle im Shop |
| **Einzel-Nachrichten** | zum Beispiel an die Shopleitung | alle |
| **Leitungs-Runde** | alle Shopleitungen und der Inhaber | Leitung |
| **Pflicht-Info** | zum Beispiel neue Reinigungsanweisung. Jeder bestätigt mit „Gelesen und verstanden“, die Leitung sieht, wer offen ist. | Shopleitung, Bezirk, Inhaber |
| **Pinnwand** | kurze Zettel je Filiale und für alle | alle, wichtig nur Leitung |
| **Termine** | Teamrunde, Schulung, Inventur, Belehrung. Mit Zusage, Absage oder Vielleicht und Erinnerung am Vortag. Ein Termin in der Arbeitszeit erscheint im Dienstplan. | Leitung, Inhaber |

Ruhezeiten: Außerhalb der eigenen Schicht kommen keine Push-Nachrichten, außer bei „dringend“.

## 8. Wer sieht was

| Bereich | Mitarbeiter / Aushilfe | Shopleitung / Stv. | Bezirksleitung | Inhaber |
|---|---|---|---|---|
| Eigener Dienst, Wünsche, Tausch, Urlaub, krank | ✅ | ✅ (Umschalter) | ✅ (Umschalter) | – |
| Hygiene abhaken | ✅ | ✅ | im Shop vor Ort | – |
| Nachrichten, Pinnwand, Termine | ✅ | ✅ + senden an Team | ✅ + an Bezirk | ✅ + an alle |
| Rezepte lernen, Quiz | ✅ | ✅ | ✅ | ✅ |
| Einsatzplan erstellen | – | ✅ eigener Shop | ✅ Springer im Bezirk | ansehen |
| Anträge entscheiden | – | ✅ | ✅ für Shopleitungen | – |
| Hygiene-Kontrolle | – | eigener Shop | Bezirk | alle |
| Stundenliste / Export | – | eigener Shop | Bezirk | alle |
| Personal, Filialen, Regeln, Rezepte pflegen | – | Geräte und Regeln im Shop | – | ✅ |
| Cockpit alle Filialen | – | – | Bezirk | ✅ |

## 9. Umsetzung in der Testversion

| Schritt | Inhalt | Version |
|---|---|---|
| 1 | Rollen-Startseiten und untere Navigation für Mitarbeiter, Shopleitung, Bezirksleitung, Inhaber, mit Logo und frooters-Schriften (selbst ausgeliefert) | 0.4.0 |
| 2 | Umschalter „Mein Dienst ↔ Shop/Bezirk“, Cockpit für den Inhaber | 0.4.0 |
| 3 | Nachrichten (Shop-Chat, Einzel, Pflicht-Info) und Termine mit Zusagen | 0.5.0 |
| 4 | Bezirksleitung als eigene Rolle mit Bezirken in den Stammdaten | 0.5.0 |
| 5 | Erklärvideos je Reiter, Frootie-Änderungen nach Rückmeldung | 0.6.0 |

**Prüfung je Schritt:** Oberflächentest je Rolle am Handy (400 px) und Tablet, keine Seite breiter als der Bildschirm. Für Mitarbeiter muss jede der Hauptaufgaben aus Kapitel 3.1 in höchstens zwei Tipps erreichbar sein.

## 10. Offene Fragen an frooters
1. Soll es neben dem Inhaber eine eigene Bezirksleitung geben, und welche Filialen gehören zu welchem Bezirk?
2. Wer darf Pflicht-Infos an alle Filialen schicken?
3. Freigabe von Logo, Farben und Frootie (mit welchen Änderungen?)
