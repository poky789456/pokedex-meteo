import 'reflect-metadata';
import express from 'express';
import { createPokemonRouter } from './routes/pokemon.routes';
import { registerMetrics } from './metrics';

export function createApp() {
  const app = express();
  app.use(express.json());
  registerMetrics(app);
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api', createPokemonRouter());
  return app;
}
