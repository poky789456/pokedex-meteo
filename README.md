# Pokedex Weather Service (TypeScript + TypeORM + MongoDB + Redis)

API CRUD de Pokémon avec intégration **Open‑Meteo** pour calculer un **statut** selon la météo (pluie, orage, etc.).

## Endpoints
- `GET /health`
- CRUD Pokémon
  - `GET /api/pokemon`
  - `POST /api/pokemon` – body: { uid, name, type, hp, attack, defense, speed }
  - `GET /api/pokemon/:uid`
  - `PUT /api/pokemon/:uid`
  - `DELETE /api/pokemon/:uid`
- **Statut météo**: `GET /api/pokemon/:uid/status?city=Paris&country=FR`

## Démarrer (Docker)
```bash
cp .env.example .env
docker compose up --build
```
Puis `http://localhost:3000/health`.

## Local
```bash
npm install
cp .env.example .env
npm run dev
```

## Tests
```bash
npm test
```

## Remarques
- Géocodage Open‑Meteo: `https://geocoding-api.open-meteo.com/v1/search?name=Paris&count=1&language=fr`
- Météo courante: `https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=weather_code,precipitation`
- Aucune clé API requise pour usage non‑commercial.
