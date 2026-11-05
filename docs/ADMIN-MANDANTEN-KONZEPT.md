# Konzept Admin-Einstellungen: Betreiber und eigene Datenbanken (FR-ADMIN)

**Stand:** 05.11.2026 · **Status:** KONZEPT, Oberfläche in der Testversion ab 0.4.0
**Entscheidung (ersetzt Kap. 4.4 im Hauptkonzept „ein Supabase-Projekt mit Mandantentrennung“):**
**Jeder Franchisenehmer bekommt eine eigene Datenbank** (eigenes Supabase-Projekt und eigenes Neon-Projekt für Spiegel und Datensicherung, beide in Frankfurt). Die eigenen Filialen der Genussmanufaktur laufen ebenfalls in einem eigenen Projekt.

## 1. Warum getrennte Datenbanken

| Grund | Erklärung |
|---|---|
| Datenschutz | Jeder Franchisenehmer ist eigener Arbeitgeber und Verantwortlicher für seine Mitarbeiterdaten. Bei getrennten Projekten können sich Daten verschiedener Firmen auch technisch nicht mischen. |
| Kosten | Jeder Betreiber nutzt seinen eigenen kostenlosen Tarif oder bezahlt seinen Tarif selbst. Die Grenzen des kostenlosen Tarifs gelten je Projekt. |
| Vertragsende | Endet ein Franchisevertrag, behält der Franchisenehmer sein Projekt mit allen Daten. Bei frooters wird nur die Verbindung gelöscht. |
| Ausfallsicherheit | Ein Problem in einem Projekt trifft nur diesen Betreiber (KICC-Regel 12: kein Single Point of Failure). |

## 2. Aufbau

```
                       frooters Zentrale-Registry (kleines Supabase-Projekt von frooters, Frankfurt)
                       ├─ Betreiber: Name, Status, Filialen, öffentliche Verbindungsdaten
                       ├─ Systeminhalte: Rezepte, Warengruppen, Hygieneregeln, Videos (Vorlagen)
                       └─ Kennzahlen, die laut Franchisevertrag geliefert werden (ohne Personennamen)
                                   ▲ nur vereinbarte Kennzahlen
          ┌────────────────────────┼────────────────────────┐
  Genussmanufaktur              Franchisenehmer A          Franchisenehmer B
  Supabase (Frankfurt)          Supabase (Frankfurt)       Supabase (Frankfurt)
  Neon-Spiegel + Backup         Neon-Spiegel + Backup      Neon-Spiegel + Backup
  Ochtrup, Oberhausen, …        eigene Filialen            eigene Filialen
```

**Anmeldung:** Der persönliche Einladungslink eines Mitarbeiters enthält den Betreiber. Die App holt aus der Registry nur die **öffentlichen** Verbindungsdaten dieses Betreibers und spricht danach ausschließlich mit dessen eigenem Server (Edge Function `fr-app` im Projekt des Betreibers). Mitarbeiterdaten fließen nie über die Registry.

**Systeminhalte** (Rezepte, Hygieneregeln) werden von der Registry an alle Betreiber verteilt. Jeder Betreiber-Server holt neue Versionen und übernimmt sie. Eigene Ergänzungen des Betreibers bleiben erhalten.

## 3. Was in den Admin-Einstellungen steht

| Feld | Beispiel | Hinweis |
|---|---|---|
| Betreiber | „Franchise Muster GmbH“ | Art: eigene Filialen oder Franchise |
| Ansprechpartner, E-Mail | | für Rückfragen zur Einrichtung |
| AV-Vertrag unterschrieben am | 12.12.2026 | ohne Datum keine Freigabe |
| Filialen | Ochtrup, Oberhausen … | jede Filiale gehört genau einem Betreiber |
| Supabase Projekt-Adresse | `https://abcdefghijklmnopqrst.supabase.co` | wird geprüft: Format und Projektkennung |
| Supabase Publishable Key | `sb_publishable_…` | **öffentlicher** Schlüssel, darf in der App stehen |
| Supabase Region | Frankfurt (eu-central-1) | andere Regionen werden abgelehnt |
| Neon Projekt-ID | `frooters-muster-1234` | für Spiegel und Datensicherung |
| Neon Region | Frankfurt (aws-eu-central-1) | andere Regionen werden abgelehnt |

**Nie in den Admin-Einstellungen, nie in der App, nie im Repository** (KICC-Regel 15):
- der geheime Supabase-Schlüssel (`sb_secret_…` oder „service_role“)
- Datenbank-Passwörter und Verbindungszeichen wie `postgresql://user:passwort@…`
- Neon-API-Schlüssel

Diese Geheimnisse trägt der Betreiber selbst in **seinem** Supabase-Projekt ein (Vault bzw. Edge-Function-Secrets). Die Admin-Seite erkennt solche Eingaben und **weist sie zurück**, statt sie zu speichern.

## 4. Ablauf „Franchisenehmer beantragt eigene Datenbank“

| # | Schritt | Wer | Wie wird es geprüft |
|---|---|---|---|
| 1 | Antrag erfasst (Betreiber, Ansprechpartner, Filialen) | frooters Admin | von Hand |
| 2 | AV-Vertrag unterschrieben | Franchisenehmer und frooters | Datum eingetragen |
| 3 | Supabase-Konto und Projekt in **Frankfurt** angelegt, Adresse und Publishable Key übermittelt | Franchisenehmer (mit Anleitung) | Format und Region geprüft |
| 4 | Neon-Projekt in **Frankfurt** angelegt | Franchisenehmer | Projekt-ID und Region eingetragen |
| 5 | Einrichtung ausgeführt: Datenbank-Tabellen, Edge Function `fr-app`, Geheimnisse im eigenen Vault | Franchisenehmer oder frooters-Technik mit Einladung ins Projekt | von Hand bestätigt |
| 6 | **Verbindung geprüft:** Der Server des Betreibers antwortet mit Version, Region und Tabellenstand | automatisch | erst mit Server-Version |
| 7 | **Erste Datensicherung geprüft:** Spiegel und Backup in Neon gelaufen und wiederherstellbar | automatisch | erst mit Server-Version |
| 8 | Freigegeben: Einladungslinks für die Mitarbeiter können erzeugt werden | frooters Admin | nur wenn 1 bis 7 grün sind |

Schritte 6 und 7 kann niemand von Hand abhaken. Solange sie nicht automatisch geprüft sind, steht dort „⚪ noch nicht geprüft“ und der Betreiber kann nicht freigegeben werden (KICC-Regel 11: UNKNOWN ist nie OK).

**Vertragsende:** Freigabe zurücknehmen → Einladungslinks werden ungültig → Verbindung aus der Registry löschen. Das Projekt und die Daten bleiben beim Franchisenehmer.

## 5. Rechte

| Aktion | Inhaber / Zentrale | Technik-Admin (später) | Franchisenehmer |
|---|---|---|---|
| Betreiber anlegen, Filialen zuordnen | ✅ | ✅ | – |
| Verbindungsdaten eintragen | ✅ | ✅ | nur eigene, über Antrag |
| Freigeben, Freigabe zurücknehmen | ✅ | – | – |
| Geheime Schlüssel sehen | **niemand** | **niemand** | nur im eigenen Supabase-Projekt |

Jede Änderung wird im Protokoll der Registry gespeichert (wer, wann, was).

## 6. Umsetzung

| Schritt | Inhalt | Version |
|---|---|---|
| 1 | Admin-Seite in der Testversion: Betreiber, Filialen, Verbindungsdaten mit Prüfung, Schritte, gesperrte Freigabe | 0.4.0 |
| 2 | Anleitung für Franchisenehmer „Supabase und Neon in Frankfurt anlegen“ mit Bildern | mit der Server-Version |
| 3 | Registry-Projekt und Server-Prüfung (Schritte 6 und 7) | mit der Server-Version |
| 4 | Verteilung der Systeminhalte und Kennzahlen an die Registry | danach |

**Hinweis zur Freigabe:** Für die Registry und die Genussmanufaktur werden Supabase- und Neon-Projekte gebraucht. Angelegt wird erst, wenn du das freigibst (Tarifentscheidung).
