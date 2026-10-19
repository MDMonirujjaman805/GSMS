import { z } from 'zod';

export const dateRangeSchema = z.object({
  query: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate must be YYYY-MM-DD'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'endDate must be YYYY-MM-DD'),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const stockMovementSchema = z.object({
  query: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate must be YYYY-MM-DD').optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'endDate must be YYYY-MM-DD').optional(),
    productId: z.string().optional(),
    type: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const expirySchema = z.object({
  query: z.object({
    days: z.string().optional(), // days ahead to check, default 30
  }),
});
