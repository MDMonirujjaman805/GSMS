import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'GSMS API Service is healthy',
    data: {
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      service: 'gsms-backend',
    },
  });
});

export default router;
