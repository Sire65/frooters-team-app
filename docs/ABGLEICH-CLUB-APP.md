# Abgleich frooters Team-App ↔ Club-App (Köcheclub)

Stand 12.11.2026 · Club-App 2.937.0 · frooters Team-App 0.13.0 (Bedienkonzept in 0.12.0, Nachrichten und Termine in 0.13.0 umgesetzt)

Ziel: Was sich in der Club-App bewährt hat und für ein Team im Shop passt, wird in frooters übernommen. Vereinsthemen (Spiele, Garten, Clubabend, Fotoalbum usw.) werden nicht übernommen.

## 1. Bedienkonzept

| Club-App | frooters bisher | Entscheidung |
|---|---|---|
| Kacheln je Rolle, Zähler auf der Kachel | ✅ vorhanden | bleibt |
| Kacheln selbst sortieren und ausblenden, Kachelgröße | – | **übernommen (0.12.0)**, auf dem Gerät gespeichert |
| Ansicht „Einfach“ / „Erweitert“, Unterstützungsstufe | – | **übernommen (0.12.0)**: „Einfach“ zeigt nur das Nötigste |
| Große Schrift, Dunkel/Hell | Dunkel nur automatisch | **übernommen (0.12.0)**: Einstellungen „Meine App“ |
| Zurück-Taste des Handys schließt zuerst das Fenster, dann eine Seite zurück | Zurück verließ die App | **übernommen (0.12.0)** |
| Einweisung beim ersten Öffnen eines Bereichs („👍 Verstanden“) | Frootie-Hinweis immer sichtbar | **übernommen (0.12.0)**: Frootie erklärt beim ersten Mal, danach nur noch ❓ |
| Ruhe-Regel: höchstens EIN Info-Fenster pro Öffnen | – | **übernommen (0.12.0)**: Pinnwand vor „Was ist neu“ |
| „Was ist neu“ nach einem Update, ein Satz mit Sprungknopf | – | **übernommen (0.12.0)** |
| Hilfe-Zentrum mit Suche, „Frag Twinkey“ mit Synonymen und „👉 Zeig es mir“ | einfache Liste | **übernommen (0.12.0)** als „Frag Frootie“ (ohne KI, ohne Server) |
| Globale Suche (Lupe) | – | **übernommen (0.12.0)**: Personen, Rezepte, Zutaten, Artikel, Pinnwand, Bereiche |
| Vorlesen | – | **übernommen (0.12.0)**: 🔊 an Frootie-Hinweisen und Rezepten |
| Zähler am App-Symbol (Badge) | – | **übernommen (0.12.0)**, wo das Handy es kann |
| Erinnerung als Kalender-Datei (ICS) | – | **übernommen (0.13.0)**: Dienste und Termine in den Handy-Kalender |
| Schritt-Hilfe, „Klick zeigen“, Rundgang mit Ton, Erklär-Videos | „Video folgt“ | später (nach dem Pilot, wenn die Abläufe feststehen) |
| PIN und Sichtschutz nach Inaktivität | – | später, wichtig für das Shop-Tablet (Stechuhr) |
| Update-Hinweis, Versionsvertrag, kein Mischstand | ✅ vorhanden | bleibt |
| Offline-Stand, Notbetrieb, Lade-Leiste, Schnecke | – | erst mit Server (Supabase) sinnvoll |
| Login per persönlichem Link oder Kurzcode | Personenwahl (Testversion) | mit Server |
| Push-Mitteilungen mit Ruhezeiten | – | mit Server |
| Kachel-Rückseite, Eselsohr, Szenen, Glücksbringer, Spiele, Garten | – | nicht übernommen (Vereins-Spaß, im Shop eher störend) |

## 2. Funktionen

| Club-App | frooters | Entscheidung |
|---|---|---|
| Nachrichten / Chats mit Lesebestätigung ✓✓ | **fehlte** (war in der Anforderung) | **neu (0.13.0)**: Filial-Chat, Leitung, Direktnachricht |
| Termine mit Zu-/Absage/Vielleicht, Erinnerung | **fehlte** (war in der Anforderung) | **neu (0.13.0)**: Teamsitzung, Schulung, Inventur, Hygiene-Besuch … |
| Startnachricht mit Lesebestätigung | Pinnwand ❗ wichtig + „Gelesen und verstanden“ | vorhanden |
| Pinnwand | ✅ wie Club-App | bleibt |
| Abstimmungen | – | später (z. B. Sortimentswünsche) |
| Dienst: Wunsch → Plan → Ist, Stempeln, Tausch | ✅ vorhanden | bleibt |
| Büro als Raum: Aktenschrank mit Jalousie, Ordner, Schreibtisch mit gezeichneten Teilen, Namensschild | ✅ **übernommen (0.14.0)**, eigenes Büro je Rolle; Einrichten per Antippen/Ziehen und Zusatzkatalog **übernommen (0.15.0)** | – |
| Briefbogen, Druck im Corporate Design, Schilder, Etiketten | ✅ Druckstudio | Preisetiketten später |
| Dokumente, Archiv | ✅ Büro-Ordner | bleibt |
| Rezeptbuch | ✅ Rezepte + Quiz + Allergene | bleibt |
| Wünsche an Claude (Wunschliste) | – | später, für die Zentrale |
| Anrufe, Video, Runder Tisch, Fernhilfe, SOS | – | nicht übernommen |

## 3. Regeln aus der Club-App, die frooters übernimmt
- Daten nie als aktuell zeigen, wenn sie es nicht sind (Beispieldaten sind gekennzeichnet).
- Keine Schlüssel im Browser, Zugänge nur als Prüfwert.
- Versionsvertrag: eine Versionsnummer in app.js, sw.js, version.json und index.html.
- Höchstens ein Info-Fenster pro Öffnen (Ruhe-Regel).
- Einstellungen, die nur das Gerät betreffen (Schrift, Ansicht, Kacheln), bleiben auf dem Gerät.
