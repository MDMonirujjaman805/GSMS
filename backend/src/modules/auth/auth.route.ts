import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { loginSchema, changePasswordSchema } from './auth.validation';

const router = Router();

router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);
router.post(
  '/change-password',
  authenticate,
  validateRequest(changePasswordSchema),
  authController.changePassword
);

export default router;
