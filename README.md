# GSMS — Grocery Shop Management System

GSMS is a production-oriented, full-stack Grocery Shop Management System designed for small to medium retail grocery shops. It integrates Point of Sale (POS), Inventory Control, Supplier Purchases, Customer/Supplier Dues Ledgers, Expense & Income Tracking, and Financial Reporting.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, React Router v6, Tailwind CSS, TanStack Query, React Hook Form, Zod, Recharts, Lucide Icons.
- **Backend:** Node.js, Express.js, TypeScript, Zod, Prisma ORM.
- **Database:** PostgreSQL.
- **Package Manager:** Yarn (Workspaces).

## Project Structure

```
gsms/
├── backend/            # Express.js REST API server
├── frontend/           # React + Vite application shell
├── docs/               # Architecture & specifications
└── GSMS_Master_Project_Context.md
```

## Getting Started

### Prerequisites

- Node.js >= 18.x
- Yarn >= 1.22.x
- PostgreSQL >= 15.x

### Setup

```bash
# Install all dependencies across workspaces
yarn install

# Start backend & frontend in development mode
yarn dev
```

### Health Check

- Backend Health Check: `GET http://localhost:5000/api/v1/health`
