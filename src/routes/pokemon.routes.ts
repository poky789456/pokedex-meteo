import { Router } from 'express';
import { PokemonController } from '../controllers/PokemonController';

export function createPokemonRouter() {
  const router = Router();
  const c = new PokemonController();

  router.get('/pokemon', c.list.bind(c));
  router.get('/pokemon/:uid', c.get.bind(c));
  router.post('/pokemon', c.create.bind(c));
  router.put('/pokemon/:uid', c.update.bind(c));
  router.delete('/pokemon/:uid', c.remove.bind(c));

  router.get('/pokemon/:uid/status', c.status.bind(c)); // ?city=Paris&country=FR

  return router;
}
