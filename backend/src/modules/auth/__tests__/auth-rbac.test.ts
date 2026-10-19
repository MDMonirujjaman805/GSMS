import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../../app';

describe('Phase 3 — Authentication & RBAC Test Suite', () => {
  let adminToken: string;
  let managerToken: string;
  let cashierToken: string;

  beforeAll(async () => {
    // Obtain valid tokens from seeded test accounts
    const adminRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ usernameOrEmail: 'admin', password: 'Password123!' });
    adminToken = adminRes.body.data.token;

    const managerRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ usernameOrEmail: 'manager', password: 'Password123!' });
    managerToken = managerRes.body.data.token;

    const cashierRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ usernameOrEmail: 'cashier', password: 'Password123!' });
    cashierToken = cashierRes.body.data.token;
  });

  describe('1. Login Endpoint (POST /api/v1/auth/login)', () => {
    it('should successfully authenticate admin with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ usernameOrEmail: 'admin', password: 'Password123!' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('ADMIN');
      expect(res.body.data.token).toBeDefined();
    });

    it('should successfully authenticate using email address', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ usernameOrEmail: 'cashier@gsms.com', password: 'Password123!' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.username).toBe('cashier');
    });

    it('should reject login with invalid password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ usernameOrEmail: 'admin', password: 'WrongPassword!' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('AUTHENTICATION_ERROR');
    });

    it('should reject login with non-existent user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ usernameOrEmail: 'nonexistentuser', password: 'Password123!' });

      expect(res.status).toBe(401);
      expect(res.body.errorCode).toBe('AUTHENTICATION_ERROR');
    });

    it('should return validation error for missing fields', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({});

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });
  });

  describe('2. Current User & Authenticated Requests (GET /api/v1/auth/me)', () => {
    it('should return profile for authenticated request', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe('admin');
      expect(res.body.data.role).toBe('ADMIN');
    });

    it('should reject unauthorized request without token', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('AUTHENTICATION_ERROR');
    });

    it('should reject request with malformed or invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid_token_xyz');

      expect(res.status).toBe(401);
      expect(res.body.errorCode).toBe('AUTHENTICATION_ERROR');
    });
  });

  describe('3. Role-Based Access Control (RBAC)', () => {
    it('should allow Admin to access Admin-only route', async () => {
      const res = await request(app)
        .get('/api/v1/test/admin-only')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Admin access granted');
    });

    it('should deny Manager from accessing Admin-only route', async () => {
      const res = await request(app)
        .get('/api/v1/test/admin-only')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('AUTHORIZATION_ERROR');
    });

    it('should deny Cashier from accessing Admin-only route', async () => {
      const res = await request(app)
        .get('/api/v1/test/admin-only')
        .set('Authorization', `Bearer ${cashierToken}`);

      expect(res.status).toBe(403);
      expect(res.body.errorCode).toBe('AUTHORIZATION_ERROR');
    });

    it('should allow Manager to access Manager-or-Admin route', async () => {
      const res = await request(app)
        .get('/api/v1/test/manager-or-admin')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Manager or Admin access granted');
    });

    it('should deny Cashier from accessing Manager-or-Admin route', async () => {
      const res = await request(app)
        .get('/api/v1/test/manager-or-admin')
        .set('Authorization', `Bearer ${cashierToken}`);

      expect(res.status).toBe(403);
      expect(res.body.errorCode).toBe('AUTHORIZATION_ERROR');
    });

    it('should allow Cashier to access Cashier-allowed route', async () => {
      const res = await request(app)
        .get('/api/v1/test/cashier-allowed')
        .set('Authorization', `Bearer ${cashierToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Cashier allowed');
    });
  });

  describe('4. Logout & Password Change', () => {
    it('should successfully process logout', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${cashierToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logout successful');
    });

    it('should allow password change with valid current password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send({ currentPassword: 'Password123!', newPassword: 'NewSecurePassword123!' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Password changed successfully');

      // Revert password back for idempotency
      await request(app)
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send({ currentPassword: 'NewSecurePassword123!', newPassword: 'Password123!' });
    });
  });
});
