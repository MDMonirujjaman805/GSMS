import { Router, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get(
  '/test/admin-only',
  authenticate,
  authorize(Role.ADMIN),
  (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Admin access granted',
      user: req.user,
    });
  }
);

router.get(
  '/test/manager-or-admin',
  authenticate,
  authorize(Role.ADMIN, Role.MANAGER),
  (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Manager or Admin access granted',
      user: req.user,
    });
  }
);

router.get(
  '/test/cashier-allowed',
  authenticate,
  authorize(Role.ADMIN, Role.MANAGER, Role.CASHIER),
  (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Cashier allowed route accessed',
      user: req.user,
    });
  }
);

export default router;
