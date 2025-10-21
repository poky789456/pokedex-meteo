import 'reflect-metadata';
import express from 'express';
import { createPokemonRouter } from './routes/pokemon.routes';

export function createApp() {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api', createPokemonRouter());
  return app;
}
