# frooters Verwaltung – Konzept PC-Version

Stand 05.11.2026 · Entwurf zur Abstimmung mit Christian Kötterheinrich (Inhaber)
Ansicht zum Durchklicken: `docs/verwaltung.html` (öffentlich: https://sire65.github.io/frooters-testversion/verwaltung.html)

## 1. Ziel

Am PC wird **alles eingestellt**, was die App im Shop braucht: Filialen, Mitarbeiter mit ihren Daten und Einsatzwünschen, Beschäftigungsarten, Rezepte und Allergene, Sortiment und Bestellung, später die Kasse. Das Handy bleibt für den Alltag im Shop (Stechuhr, Dienstplan ansehen, Hygiene abhaken, Rezepte nachschlagen).

**Eine App, zwei Oberflächen.** Die PC-Version ist kein zweites Programm. Es ist dieselbe App mit denselben Daten und Rechten. Ab etwa 1100 Pixel Breite zeigt sie eine Seitenleiste, breite Tabellen und Bearbeiten in mehreren Zeilen. Damit gibt es nichts doppelt zu pflegen, und eine Änderung am PC ist sofort auf dem Handy sichtbar.

| Wer | Was am PC |
|---|---|
| Inhaber / CEO | alles, alle Filialen, Betreiber und Franchise, Rechte, Einstellungen |
| feste Person für Rezepte und Hygiene (Zentrale/Qualität) | Rezepte, Zutaten, Allergene, Hygieneregeln, Sortiment |
| Shopleitung / Stellvertretung | eigene Filiale: Mitarbeiter (ohne Personalakte), Einsatzprofile, Dienstplan, Bestellung, Inventur |
| Mitarbeiter / Aushilfen | keine PC-Version nötig (Handy reicht), können sie aber im Browser öffnen |

## 2. Aufbau am PC

Links die Seitenleiste, oben Filialwahl und Suche, in der Mitte Tabellen mit Filter und Sortierung. Ein Klick auf eine Zeile öffnet rechts die Details zum Bearbeiten.

1. **Übersicht:** Was ist offen (unbesetzte Schichten, Anträge, Hygiene-Auffälligkeiten, Bestellungen, ablaufende Belehrungen)
2. **Filialen**
3. **Mitarbeiter**
4. **Dienstplan** (wie bisher, am PC als ganze Woche aller Filialen)
5. **Rezepte & Allergene**
6. **Sortiment & Bestellung**
7. **Kasse & Schnittstellen**
8. **Büro** (Ordner, Druckstudio, wie in 0.7.0)
9. **Einstellungen** (Beschäftigungsarten, Schichtzeiten, Feiertage, Rechte, Betreiber/Datenbank)

Für alle Bereiche gilt:
- **Änderungsprotokoll:** wer hat wann was geändert (z. B. Stundenumfang von 15 auf 20)
- **Import aus Excel:** für den Start, die bisherige Mitarbeiter- und Dienstplanliste einlesen
- **Export:** als Excel/CSV und zum Drucken

## 3. Filialen

Je Filiale:
- **Allgemein:** Name, Kurzname, Marke (frooters, Bowls & Smoothie), Art (Shop, Café, mobiler Stand), Betreiber (eigene Filiale oder Franchise), Adresse
- **Bundesland:** steuert die Feiertage. Ochtrup und Oberhausen liegen in NRW, Sinsheim in Baden-Württemberg, Osnabrück in Niedersachsen. Beim Road Runner gilt der jeweilige Einsatzort.
- **Öffnungszeiten** je Wochentag, Sonderöffnungen (verkaufsoffener Sonntag, Feiertag); beim Road Runner die Einsätze mit Ort und Zeit
- **Sortiment:** welche Warengruppen und Artikel hier verkauft werden (steuert Rezepte, Preisliste, Allergen-Aushang, Bestellung)
- **Besetzungsmatrix:** wie bisher, je Tagesart mit Rollen
- **Geräte:** Kühlvitrine, Tiefkühler, Froyo-Maschine usw.; steuert die Hygiene-Tagesliste
- **Ansprechpartner:** Shopleitung, Stellvertretung, Center-Management, Hygieneberater

Die Filialen sind die aus dem Fragebogen: Ochtrup (Pilot), Oberhausen Centro, Sinsheim Therme, Osnabrück, Pick-Nick und Road Runner. Neue Filialen legt nur der Inhaber an. Eine Filiale wird nie gelöscht, sondern **geschlossen**. Ihre alten Pläne, Stunden und Hygiene-Nachweise bleiben im Archiv.

## 4. Mitarbeiter

### 4.1 Stammdaten
- Vorname, Name, Spitzname in der App, Foto (freiwillig), Telefon, E-Mail (freiwillig)
- Stammfiliale, Eintritt, befristet bis, Austritt
- Rolle in der App: Mitarbeiter, Aushilfe, Stellvertretung, Shopleitung, Bezirksleitung, Inhaber. Die Rolle regelt die Rechte und ist **getrennt** von der Beschäftigungsart.
- Geburtsdatum nur, wenn die Person **unter 18** ist (Jugendarbeitsschutz). Sonst reicht der Haken „volljährig“.

**Nicht in die App:** Steuer-ID, Sozialversicherungsnummer, IBAN, Krankenkasse, Gehalt. Diese Daten bleiben beim Steuerberater, der die Löhne macht. Was die App nicht hat, kann sie auch nicht verlieren.

### 4.2 Beschäftigungsart

| Art | Was die Planung beachtet |
|---|---|
| Vollzeit | Stundenumfang z. B. 40 Std./Woche |
| Teilzeit | Stundenumfang z. B. 20 Std./Woche |
| Minijob (geringfügig) | Stundenumfang je Monat; Warnung vor der Verdienstgrenze. Die Grenze ist ein Wert in den Einstellungen (2026: 603 €, bitte vom Steuerberater bestätigen) und der Stundenlohn kommt dazu. |
| Kurzfristig beschäftigt | zählt die Arbeitstage im Kalenderjahr (Grenze 70 Tage, in den Einstellungen) |
| Werkstudent | Stundenumfang je Woche; Hinweis bei mehr als 20 Std. in der Vorlesungszeit |
| Auszubildende/r | Berufsschultage werden nicht verplant; unter 18 gelten die Jugendregeln |
| Schüler/in, Ferienjob | meist unter 18: Jugendregeln, nur in den Ferien oder an freigegebenen Tagen |
| Praktikum | Zeitraum von–bis, Stundenumfang |

**Jugendregeln (unter 18):** höchstens 8 Std. am Tag und 40 Std. in der Woche, 5-Tage-Woche, Pausen, keine Arbeit spät abends (Grundregel bis 20 Uhr; für über 16-Jährige in der Gastronomie Ausnahmen bis 22 Uhr). Das steht im Jugendarbeitsschutzgesetz. Die genauen Werte werden vor dem Start mit dem Steuerberater oder einer Rechtsberatung geprüft und stehen dann in den Einstellungen. Bis dahin warnt die App nur und sperrt nichts.

### 4.3 Stundenumfang und Überschreiten
- **Stundenumfang:** Zahl und Einheit (je Woche oder je Monat). Wie in 0.6.0 fragt die Planung „Trotzdem einplanen?“, wenn die Stunden voll sind.
- **Neu: Markierung „darf Stunden überschreiten“**
  - **aus (Standard):** Rückfrage beim Einplanen, und der Planvorschlag plant nicht darüber.
  - **an:** Keine Rückfrage bis zu einer Grenze, z. B. „+5 Std./Woche“ oder „bis 48 Std./Woche“. Der Planvorschlag darf die Person dann auch über den Umfang einplanen, wenn sonst eine Schicht leer bliebe.
  - Bei **Minijob, Jugendlichen und den 10 Stunden am Tag** bleibt die Warnung trotzdem. Diese Grenzen kann der Haken nicht aufheben.
- **Überstundenkonto** (Stufe 2): Plus und Minus aus den gestempelten Zeiten, Ausgleich als „Freizeitausgleich“ (gibt es schon als Abwesenheitsart)

### 4.4 Einsatzprofil („Wann und wo kann die Person?“)

Mehrere Punkte sind kombinierbar:
- **Zeit:**
  - total flexibel
  - nur Frühdienst
  - nur Spätdienst
  - nur morgens (bis … Uhr)
  - nur abends (ab … Uhr)
  - nur an bestimmten Wochentagen
  - nur Wochenende
  - nicht an bestimmten Tagen (z. B. Berufsschule am Dienstag)
- **Bereitschaftsdienst:** Die Person kann kurzfristig einspringen. Die Planung schlägt sie bei Krankmeldungen zuerst vor. Optional mit Zeitfenster („Bereitschaft Sa 10–14 Uhr“). Ob und wie Bereitschaft bezahlt wird, legt der Inhaber fest; die App zeigt die Bereitschaftszeiten nur an.
- **Springer:** In welchen anderen Filialen darf die Person arbeiten? Mit Angabe „mit Auto / ÖPNV / braucht Fahrt“ und Fahrzeit. Für den Road Runner kommt „Führerschein“ dazu.
- **Wünsche bleiben Wünsche:** Das Profil ist die **feste** Regel (die Planung hält sich daran). Die Dienstwünsche aus der App gelten nur für eine bestimmte Woche und werden **wenn möglich** erfüllt.

### 4.5 Ansprüche
- **Urlaub:** Anspruch je Jahr, Übertrag, Bildungsurlaub (wie 0.6.0), Zählweise Mo–Fr oder Mo–Sa (Einstellung, noch offen), Feiertage nach Bundesland der Stammfiliale
- **Qualifikationen mit Ablaufdatum:**
  - Belehrung nach § 43 Infektionsschutzgesetz
  - jährliche Hygieneschulung
  - Allergenschulung
  - Kasse
  - Schlüssel/Tresor
  - Leitung
  - Road-Runner-Fahrer

  Läuft eine Qualifikation bald ab, erscheint sie unter „offen“ in der Übersicht. Die Planung kann z. B. verlangen, dass in jeder Schicht eine Person mit Kassenrecht ist.
- **Personalakte** (nur Inhaber, Büro): Verträge, Belehrungen und Bescheinigungen als Datei

## 5. Rezepte & Allergene

**Grundsatz:** Allergene werden **an der Zutat** gepflegt, nicht am Rezept. Das Rezept rechnet sie aus seinen Zutaten zusammen. Wechselt ein Lieferant und die neue Soße enthält plötzlich Senf, ändert man es einmal an der Zutat. Danach stimmen alle Rezepte, der Allergen-Aushang und das Quiz.

- **Zutatenstamm:** Name, Lieferant, Artikelnummer, die 14 Hauptallergene nach LMIV (enthält / Spuren / nein), Zusatzstoffe (Farbstoff, Konservierung …), Datenblatt des Lieferanten als Datei, „geprüft am / von“
- **Rezepte:** Warengruppe, Größen (S/M/L), Zutaten mit Menge je Größe, Arbeitsschritte mit Fotos, Kühl- und Standzeiten, Preis je Größe (für Preisliste und Kasse, wird nie erfunden)
- **Freigabe nach dem 4-Augen-Prinzip:** Ein Rezept oder eine Allergen-Änderung ist erst gültig, wenn eine zweite berechtigte Person freigibt (feste Person plus Inhaber oder Shopleitung). Bis dahin zeigt das Handy die alte Fassung.
- **Fassungen:** Jede Änderung bekommt eine neue Fassung, die alten bleiben lesbar (wichtig bei Kontrollen: „Was galt am 12. Oktober?“)
- **Sortiment je Filiale** bestimmt, welche Rezepte dort sichtbar sind (Osnabrück: Bowls, Smoothies, Kaffee …)
- Daraus entstehen automatisch: Allergen-Aushang, Preisliste, Quizfragen, später die Kassen-Artikel

## 6. Sortiment & Bestellung (Shopleitung)

### Stufe 1: Bestellliste aus Soll und Ist
1. **Artikelstamm:** Ware mit Lieferant, Bestellnummer, Einheit und Gebinde (z. B. Karton à 6 × 1 l), Lagerort (Kühlung, TK, trocken), optional Einkaufspreis
2. **Sortiment je Filiale** mit **Sollbestand** (so viel soll da sein) und **Mindestbestand**
3. **Bestandsaufnahme am Handy:** Die Shopleitung tippt im Lager die Mengen ein, nach Lagerort sortiert
4. **Automatische Bestellliste:** Vorschlag = Soll − Ist, aufgerundet auf volle Gebinde, getrennt nach Lieferant. Was unter dem Mindestbestand liegt, steht oben in Rot.
5. **Prüfen und freigeben:** Die Shopleitung ändert Mengen und gibt frei. Daraus wird eine Bestellung je Lieferant zum Drucken, als PDF oder per E-Mail. **Nichts wird automatisch verschickt.**

### Stufe 2: Abgleich
- **Bestellt ↔ geliefert:** Beim Wareneingang Lieferschein mit der Bestellung abgleichen, Abweichungen markieren (fehlt, zu viel, beschädigt). Zusätzlich die Hygiene-Prüfung Wareneingang (Temperatur, MHD), die es schon gibt.
- **Geliefert ↔ Rechnung:** optional für die Zentrale

### Stufe 3: Vorschlag aus dem Verkauf
- Mit Verkaufszahlen aus der Kasse: verkaufte Becher × Rezeptmenge = Verbrauch an Zutaten. Daraus Prognose für die nächsten Tage (Wochentag, Saison, Ferien, Aktionen) und ein besserer Vorschlag als nur Soll − Ist.
- Abgleich **Soll-Verbrauch ↔ Ist-Verbrauch** zeigt Schwund, Bruch oder falsche Portionsgrößen

## 7. Kasse & Schnittstellen

Ihr nutzt heute **Gastronovi**. Gebraucht werden aus der Kasse: Verkäufe je Artikel und Tag, Umsatz je Stunde (zeigt, wann mehr Personal nötig ist) und später die Preise.

| Weg | Was | Aufwand und Risiko |
|---|---|---|
| **A: Gastronovi-Export einlesen** | Die Shopleitung oder Zentrale lädt den Tagesbericht aus Gastronovi (CSV/Excel) in der Verwaltung hoch | Ob und welcher Export geht, ist **unbekannt** und muss bei euch in Gastronovi nachgesehen werden. Funktioniert ohne Verträge. **Empfehlung für den Start.** |
| **B: Gastronovi-Schnittstelle** | Automatisch jede Nacht | **Unbekannt**, ob Gastronovi eine Schnittstelle für euren Vertrag anbietet und was sie kostet. Bei Gastronovi anfragen, erst danach planen. |
| **C: KC Bilderrechner für frooters** | Kasse mit großen Bildkacheln (wie im Köcheclub), Kacheln kommen direkt aus Sortiment, Rezepten und Preisen der Verwaltung, Verkäufe landen sofort in Bestellung und Auswertung | Als **echte Kasse im Laden** braucht sie in Deutschland eine zertifizierte TSE (KassenSichV), den DSFinV-K-Export, Belegausgabe und die Meldung ans Finanzamt. Das ist ein eigenes Projekt und muss **vorher mit dem Steuerberater** geklärt werden. Gastronovi erfüllt das bereits. |
| **C1: Bilderrechner ohne Kassenfunktion** | Bilderrechner als **Bild-Erfassung** für Inventur, Bestellung, Bruch/Abschriften und Personalessen, ohne Bezahlung | Keine TSE nötig, weil nichts kassiert wird. Gute Mischung aus Schulungsstand (Bilderrechner bekannt) und geringem Risiko. |
| **D: Steuerberater** | Export der Stunden je Monat und Person (Stundenzettel) | Format beim Steuerberater erfragen (CSV, Excel oder DATEV-Format); bis dahin gibt es den CSV-Export schon |

**Empfehlung:** A für die Verkaufszahlen, C1 für die Erfassung mit Bildern, D sofort. C erst, wenn ihr Gastronovi ersetzen wollt und der Steuerberater zugestimmt hat.

## 8. Einstellungen
- **Beschäftigungsarten** mit ihren Grenzen (Minijob-Grenze, 70 Tage, Jugendregeln, 10 Std./Tag), jeweils mit Datum „gilt ab“, damit Änderungen zum 1. Januar sauber greifen
- **Schichtzeiten** je Filiale (Frühdienst, Spätdienst, relativ zur Öffnung)
- **Feiertage** nach Bundesland, automatisch und änderbar
- **Urlaub:** Zählweise Mo–Fr / Mo–Sa, Übertrag bis 31.03. (Einstellung)
- **Rechte:** Rollen × Bereiche (wie die Büro-Freigaben)
- **Betreiber & Datenbank** (wie 0.4.0, Franchise mit eigener Supabase/Neon in Frankfurt)

## 9. Datenmodell (Ergänzungen)

```
person:     + beschaeftigung (vollzeit|teilzeit|minijob|kurzfristig|werkstudent|azubi|schueler|praktikum)
            + umfang {std, einheit}, ueberschreiten {erlaubt, bisStd}
            + profil {zeit: [frueh|spaet|morgens<bis>|abends<ab>|flexibel], tage, nichtTage,
                      bereitschaft [{tag, von, bis}], springer [{filiale, anreise, minuten}]}
            + quali [{art, gueltigBis}], unter18 (Geburtsdatum nur dann)
filiale:    + bundesland, geschlossenAm, ansprechpartner
zutat:      {id, name, lieferant, artNr, allergene {A..N: ja|spuren|nein}, zusatzstoffe, geprueft}
rezept:     + zutaten [{zutat, menge je Größe}], fassung, freigabe {von, am, zweiteVon}
artikel:    {id, name, lieferant, bestellNr, einheit, gebinde, lagerort, ekPreis?}
sortiment:  {filiale, artikel, soll, min}
inventur:   {filiale, datum, von, posten [{artikel, ist}]}
bestellung: {filiale, lieferant, posten [{artikel, menge}], status entwurf|frei|geschickt|geliefert, abweichungen}
verkauf:    {filiale, datum, quelle gastronovi-csv|bilderrechner, posten [{artikel/rezept, groesse, anzahl, umsatz}]}
protokoll:  {wer, wann, was, alt, neu}
```

## 10. Stufenplan

| Stufe | Inhalt | Wo |
|---|---|---|
| 1 | PC-Ansicht (Seitenleiste, Tabellen), Filialen, Mitarbeiter mit Beschäftigungsart, Umfang, „darf überschreiten“, Einsatzprofil, Springer, Qualifikationen, Excel-Import | Testversion mit Beispieldaten |
| 2 | Zutatenstamm, Allergene aus Zutaten, Rezept-Freigabe 4-Augen, Fassungen | Testversion |
| 3 | Artikelstamm, Sortiment je Filiale, Inventur am Handy, Bestellliste Soll − Ist, Bestellung als PDF | Testversion |
| 4 | Gastronovi-Export einlesen, Umsatz je Stunde in der Dienstplanung, Stunden-Export Steuerberater | nach Klärung des Exports |
| 5 | Verbrauchsprognose, Abgleich Soll-/Ist-Verbrauch, Bilderrechner-Erfassung (C1) | nach Stufe 4 |
| 6 | Bilderrechner als Kasse (C) | nur nach Freigabe Steuerberater, eigenes Projekt |

Alles läuft weiter mit **Beispieldaten im Browser**, bis die Datenbank (Supabase plus Neon in Frankfurt) freigegeben ist. Echte Mitarbeiterdaten kommen erst danach in die App.

## 11. Offene Fragen an frooters
1. Welche Beschäftigungsarten gibt es heute wirklich, und wie viele Personen je Art?
2. Soll es Bereitschaft geben, und wird sie bezahlt (pauschal oder gar nicht)?
3. „Darf Stunden überschreiten“: Grenze je Person, oder eine feste Grenze für alle?
4. Gibt es unter 18-Jährige oder Azubis? Welche Berufsschultage?
5. Kann Gastronovi bei euch Tagesberichte als CSV/Excel exportieren? Gibt es einen Vertrag mit Schnittstelle?
6. Wer bestellt heute bei welchen Lieferanten, und wie (Telefon, Mail, Portal)? Gibt es eine Bestellliste als Excel?
7. Gibt es Datenblätter der Lieferanten mit Allergenen für alle Zutaten?
8. Welches Format braucht der Steuerberater für die Stunden?
9. KC Bilderrechner: zuerst nur zur Erfassung (C1) oder gleich als Kasse (C)?
