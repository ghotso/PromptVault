# PromptVault Demo Setup

Diese Anleitung erklärt, wie du die Demo-Umgebung für PromptVault einrichtest und verwendest.

## 🚀 Demo-Features

- **Automatisches Reseeding**: Alle 6 Stunden werden die Demo-Daten automatisch zurückgesetzt
- **Manuelles Reseeding**: API-Endpunkt zum manuellen Zurücksetzen der Demo-Daten
- **Vordefinierte Demo-Daten**: 6 Beispiel-Prompts, 4 Teams, 10 Tags, 3 Demo-User
- **Vorkonfigurierte Demo-Accounts**: 3 Benutzer mit verschiedenen Rollen und Teams

## 🔑 Demo-Zugangsdaten

**Sofort einsatzbereit mit diesen Demo-Accounts:**

- **Admin-Account**: `demo.admin@promptvault.com` / `demo123` (Engineering Team, ADMIN-Rolle)
- **User-Account**: `demo.user@promptvault.com` / `demo123` (Marketing Team, USER-Rolle)  
- **Team-Account**: `demo.team@promptvault.com` / `demo123` (Engineering Team, USER-Rolle)

**Alle Accounts verwenden das Passwort: `demo123`**

## 🔧 Einrichtung

### 1. Environment Variables

**WICHTIG**: Der Demo-API-Schlüssel muss über eine Environment Variable gesetzt werden und darf nicht im Code stehen!

Füge diese Variablen zu deiner `.env` Datei hinzu:

```bash
# Demo-Modus aktivieren
DEMO_MODE=true

# Demo API-Schlüssel (ERFORDERLICH - für manuelles Reseeding)
DEMO_API_KEY=dein-sicherer-demo-schlüssel-2024

# Optional: Produktionsmodus überschreiben
NODE_ENV=development
```

**Beispiel für einen sicheren API-Schlüssel:**
```bash
DEMO_API_KEY=demo_$(openssl rand -hex 32)
```

### 2. Automatisches Reseeding

Das automatische Reseeding startet automatisch, wenn:
- `DEMO_MODE=true` gesetzt ist, ODER
- `NODE_ENV` nicht auf `production` gesetzt ist

**Reseeding-Intervall**: Alle 6 Stunden

## 📡 API-Endpunkte

### Demo-Daten seeden

```bash
POST /api/demo/seed
Headers: x-demo-api-key: dein-demo-schlüssel-2024
```

**Oder als Query-Parameter:**
```bash
POST /api/demo/seed?apiKey=dein-demo-schlüssel-2024
```

### Demo-Status abfragen

```bash
GET /api/demo/status
Headers: x-demo-api-key: dein-demo-schlüssel-2024
```

## 🎯 Demo-Daten

### Teams
- Engineering
- Marketing  
- Sales
- Design

### Tags
- AI, Productivity, Writing, Code
- Marketing, Sales, Design
- Analysis, Creative, Technical

### Beispiel-Prompts

1. **Professional Email Writer** (Team, öffentlich geteilt)
2. **Code Review Assistant** (Team, privat)
3. **Social Media Post Generator** (Privat, öffentlich geteilt)
4. **Meeting Agenda Creator** (Team, privat)
5. **Data Analysis Framework** (Privat, privat)
6. **Creative Writing Prompt** (Team, öffentlich geteilt)

### Demo-User

**Zugangsdaten für die Demo-Umgebung:**

| Benutzer | E-Mail | Passwort | Team | Rolle |
|----------|--------|----------|------|-------|
| **Demo Admin** | `demo.admin@promptvault.com` | `demo123` | Engineering | ADMIN |
| **Demo User** | `demo.user@promptvault.com` | `demo123` | Marketing | USER |
| **Team Member** | `demo.team@promptvault.com` | `demo123` | Engineering | USER |

**WICHTIG**: Diese Zugangsdaten sind für die Demo-Umgebung gedacht und sollten in einer echten Produktionsumgebung geändert werden!

## 🔄 Reseeding-Prozess

Beim Reseeding werden alle Daten gelöscht und neu erstellt:

1. Alle bestehenden Daten löschen (außer Settings)
2. Teams erstellen
3. Tags erstellen
4. User erstellen und Teams zuordnen
5. Prompts erstellen mit Tags und Ratings
6. Settings sicherstellen

## 🛡️ Sicherheit

- **API-Schlüssel**: Der Demo-API-Schlüssel sollte in Produktion sicher sein
- **Produktionsmodus**: Automatisches Reseeding läuft nur im Demo-Modus
- **Daten-Isolation**: Demo-Daten werden von echten Daten getrennt

## 📝 Verwendung

### Manuelles Reseeding

```bash
# Mit curl
curl -X POST http://localhost:3000/api/demo/seed \
  -H "x-demo-api-key: $DEMO_API_KEY"

# Mit Postman/Insomnia
POST http://localhost:3000/api/demo/seed
Headers: x-demo-api-key: [dein-gesetzter-api-schlüssel]
```

### Demo-Status prüfen

```bash
curl http://localhost:3000/api/demo/status \
  -H "x-demo-api-key: $DEMO_API_KEY"
```

## 🚨 Wichtige Hinweise

- **Datenverlust**: Reseeding löscht alle bestehenden Daten!
- **Produktionsumgebung**: Niemals in einer echten Produktionsumgebung aktivieren
- **Backup**: Vor dem ersten Reseeding alle wichtigen Daten sichern
- **API-Schlüssel**: Den Demo-API-Schlüssel sicher aufbewahren

## 🔍 Troubleshooting

### Reseeding funktioniert nicht

1. Prüfe die Environment Variables
2. Stelle sicher, dass der API-Schlüssel korrekt ist
3. Prüfe die Server-Logs auf Fehler
4. Verifiziere, dass die Demo-Route korrekt registriert ist

### Automatisches Reseeding startet nicht

1. Prüfe `DEMO_MODE` oder `NODE_ENV`
2. Schaue in die Server-Logs
3. Starte den Server neu

### Demo-Daten werden nicht angezeigt

1. Führe manuelles Reseeding aus
2. Prüfe die Datenbank-Verbindung
3. Verifiziere die Prisma-Migrationen
