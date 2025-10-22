import client from 'prom-client';
import express, { Request, Response } from 'express';

export const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP reçues',
  labelNames: ['method', 'route', 'status'],
});

export function registerMetrics(app: express.Express) {
  client.collectDefaultMetrics();

  app.use((req: Request, res: Response, next) => {
    res.on('finish', () => {
      httpRequests.labels(req.method, req.route?.path || req.path, String(res.statusCode)).inc();
    });
    next();
  });

  app.get('/metrics', async (_req: Request, res: Response) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  });
}
