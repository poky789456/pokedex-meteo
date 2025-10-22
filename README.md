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
npm run test
```

## Remarques
- Géocodage Open‑Meteo: `https://geocoding-api.open-meteo.com/v1/search?name=Paris&count=1&language=fr`
- Météo courante: `https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=weather_code,precipitation`


# Pokedex API + Observability (Prometheus + Grafana)

### Development (un seul hôte)
1. Copiez `.env.example` vers `.env` et ajustez les valeurs.
2. Lancez: `docker compose -f docker-compose.dev.yml up -d --build`
3. Ouvrez:
   - API: http://localhost:3000
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3001 (admin/admin)
4. Ajoutez des tableaux de bord dans Grafana
### Production (hôtes séparés)
**Hôte applicatif:**
- `docker compose -f docker-compose.prod.app.yml up -d --build`

**Hôte de monitoring:**
- Définissez `APP_HOST`(DNS ou IP de l’**hôte applicatif**), ensuite:
- `APP_HOST=app.example.com docker compose -f docker-compose.prod.monitoring.yml up -d`

### Sécurité & durcissement
- L’API tourne en utilisateur non-root, avec système de fichiers en lecture seule, healthchecks et limites de ressources.
- L’hôte de monitoring est séparé, isolant Prometheus/Grafana.
- Changez le mot de passe admin de Grafana (GF_SECURITY_ADMIN_PASSWORD) en production.
- Restreignez les ports des exporters (9121, 9216, 8080, 3000) avec un pare-feu pour qu’ils ne soient accessibles qu’à l’hôte de monitoring.

### Metrics de l'API
Ajoutez `prom-client` ainsi que le fichier `metrics.ts` et le snippet `index.ts` fournis.
Votre API exposera alors `/metrics`, que Prometheus viendra scrapper.


