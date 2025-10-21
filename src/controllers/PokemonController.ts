import { Request, Response } from 'express';
import { PokemonService } from '../services/PokemonService';
import { RedisCache } from '../config/redis';
import { OpenMeteoService } from '../services/OpenMeteoService';

const weatherService = new OpenMeteoService(new RedisCache());
const service = new PokemonService(undefined as any, weatherService);

export class PokemonController {
  async list(_req: Request, res: Response) {
    const items = await service.list();
    res.json(items);
  }
  async get(req: Request, res: Response) {
    const item = await service.get(req.params.uid);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  }
  async create(req: Request, res: Response) {
    const created = await service.create(req.body);
    res.status(201).json(created);
  }
  async update(req: Request, res: Response) {
    const updated = await service.update(req.params.uid, req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  }
  async remove(req: Request, res: Response) {
    const ok = await service.remove(req.params.uid);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  }
  async status(req: Request, res: Response) {
    const { uid } = req.params;
    const city = (req.query.city as string) || '';
    const country = (req.query.country as string) || undefined;
    if (!city) return res.status(400).json({ error: 'Query param city is required' });

    try {
      const result = await service.statusByCity(uid, city, country);
      res.json(result);
    } catch (e: any) {
      res.status(404).json({ error: e.message });
    }
  }
}
