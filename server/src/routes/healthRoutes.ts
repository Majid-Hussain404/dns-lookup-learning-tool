import { Router, Request, Response } from 'express';
import { HealthResponse } from '../types/dns';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const health: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    service: 'DNS Lookup Learning Tool API',
    version: '1.0.0',
  };

  res.status(200).json(health);
});

export default router;
