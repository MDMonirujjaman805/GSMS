# GSMS — Grocery Shop Management System

## Master Project Context & Development Specification

### Version: 1.0

### Date: 2026-10-06

---

# 1. PROJECT OVERVIEW

Build a production-oriented **Grocery Shop Management System (GSMS)** for a small/minimal grocery shop.

The purpose of this system is to keep all shop operations in one place:

- Product management
- Inventory management
- Purchases
- Sales / POS
- Customers
- Suppliers
- Customer dues
- Supplier dues
- Payments
- Income
- Expenses
- Cash/account ledger
- Profit & loss
- Reports
- Product batches and expiry
- Returns
- Barcode support
- Invoice generation
- User roles and permissions
- Audit logs
- Dashboard
- Future PWA/offline support

The system should be designed so it can start as a single-shop system and later scale to multiple shops/branches.

---

# 2. OWNER'S TECHNOLOGY PREFERENCE

The preferred technology stack is:

## Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- Recharts

## Backend

- Node.js
- Express.js
- TypeScript
- Zod
- Prisma ORM

## Database

- PostgreSQL

## Package Manager

- Yarn

## Recommended Supporting Tools

- ESLint
- Prettier
- Husky
- lint-staged
- GitHub Actions
- Docker
- Docker Compose

---

# 3. HIGH-LEVEL ARCHITECTURE

The application should follow this architecture:

Browser
|
| REST API / JSON
v
React + TypeScript Frontend
|
v
Express.js + Node.js Backend
|
v
Prisma ORM
|
v
PostgreSQL

Business logic must live primarily in the backend.

The frontend should be responsible for:

- UI
- User interaction
- Form handling
- Client-side validation
- API consumption
- State/query management

The backend should be responsible for:

- Authentication
- Authorization
- Validation
- Business rules
- Database transactions
- Inventory calculations
- Accounting calculations
- Payment logic
- Due calculations
- Reporting queries

---

# 4. CORE BUSINESS FLOWS

These are the most important flows in the application.

## Purchase Flow

Supplier
-> Purchase
-> Purchase Items
-> Product Batch
-> Inventory increases
-> Stock Transaction created
-> Supplier balance updated
-> Payment recorded
-> Cash/account ledger updated

## Sales Flow

Customer
-> Sale
-> Sale Items
-> Validate stock
-> Inventory decreases
-> Stock Transaction created
-> Payment recorded
-> Customer due updated if applicable
-> Cash/account ledger updated

## Expense Flow

Expense
-> Expense Category
-> Payment method
-> Cash/account ledger decreases

## Income Flow

Other Income
-> Income Category
-> Payment method
-> Cash/account ledger increases

## Sale Return

Sale Return
-> Return Items
-> Inventory increases
-> Customer/account balance adjusted
-> Refund/payment ledger adjusted

## Purchase Return

Purchase Return
-> Return Items
-> Inventory decreases
-> Supplier/account balance adjusted
-> Refund/payment ledger adjusted

---

# 5. CRITICAL ACCOUNTING PRINCIPLES

Do not rely only on a current stock number.

Maintain transaction history.

## Stock

Opening Stock

- Purchases
- Sale Returns

* Sales
* Purchase Returns
* Damage
  +/- Adjustments
  = Current Stock

## Customer Balance

Sales on due increase customer receivable.
Customer payments decrease customer receivable.
Sale returns decrease customer receivable where applicable.

## Supplier Balance

Purchases on due increase supplier payable.
Supplier payments decrease supplier payable.
Purchase returns decrease supplier payable where applicable.

## Cash

Opening Cash

- Cash Sales
- Customer Due Collections
- Other Income
- Supplier Refunds

* Purchase Payments
* Supplier Payments
* Expenses
* Customer Refunds
* Withdrawals
  = Expected Closing Cash

## Gross Profit

Sales Revenue - Cost of Goods Sold = Gross Profit

## Net Profit

Gross Profit - Operating Expenses = Net Profit

Use Decimal/NUMERIC money values. Do NOT use floating-point values for financial calculations.

---

# 6. USER ROLES

Initial roles:

## ADMIN

Full access.

Can manage:

- Users
- Products
- Categories
- Inventory
- Purchases
- Sales
- Customers
- Suppliers
- Payments
- Expenses
- Income
- Reports
- Settings
- Audit logs

## MANAGER

Can manage:

- Products
- Inventory
- Purchases
- Sales
- Customers
- Suppliers
- Reports

## CASHIER

Primarily:

- POS
- Sales
- Customers

Authorization must be enforced on the backend.

---

# 7. MAIN MODULES

The system should contain these modules:

1. Authentication
2. Users
3. Dashboard
4. Products
5. Categories
6. Product Batches
7. Inventory
8. Stock Transactions
9. Stock Adjustments
10. Suppliers
11. Supplier Ledger
12. Customers
13. Customer Ledger
14. Purchases
15. Purchase Items
16. Purchase Returns
17. Sales
18. Sale Items
19. Sale Returns
20. Payments
21. Expenses
22. Expense Categories
23. Income
24. Income Categories
25. Cash/Account Ledger
26. Reports
27. Settings
28. Audit Logs

---

# 8. RECOMMENDED PROJECT STRUCTURE

## Root

gsms/
├── frontend/
├── backend/
├── docs/
├── .gitignore
├── README.md
└── package.json

## Frontend

frontend/
└── src/
├── assets/
├── components/
├── layouts/
├── pages/
├── routes/
├── features/
│ ├── auth/
│ ├── products/
│ ├── categories/
│ ├── inventory/
│ ├── purchases/
│ ├── sales/
│ ├── customers/
│ ├── suppliers/
│ ├── payments/
│ ├── expenses/
│ ├── incomes/
│ └── reports/
├── hooks/
├── services/
├── schemas/
├── stores/
├── types/
├── utils/
└── lib/

## Backend

backend/
├── prisma/
│ ├── schema.prisma
│ ├── migrations/
│ └── seed.ts
└── src/
├── app.ts
├── server.ts
├── config/
├── middlewares/
├── modules/
│ ├── auth/
│ ├── users/
│ ├── products/
│ ├── categories/
│ ├── inventory/
│ ├── purchases/
│ ├── sales/
│ ├── customers/
│ ├── suppliers/
│ ├── payments/
│ ├── expenses/
│ ├── incomes/
│ ├── returns/
│ ├── reports/
│ └── dashboard/
├── routes/
├── utils/
├── errors/
├── types/
├── lib/
└── generated/
└── prisma/

Each backend module should normally contain:

- controller
- service
- route
- validation
- types where needed

Example:

products/
├── product.controller.ts
├── product.service.ts
├── product.route.ts
├── product.validation.ts
└── product.types.ts

---

# 9. FRONTEND ROUTES

Recommended initial routes:

/login
/dashboard

/products
/products/new
/products/:id
/products/:id/edit

/categories

/inventory
/inventory/adjustment

/purchases
/purchases/new
/purchases/:id

/sales
/sales/:id

/pos

/customers
/customers/:id

/suppliers
/suppliers/:id

/expenses
/income

/reports/sales
/reports/purchases
/reports/inventory
/reports/profit-loss
/reports/due
/reports/cash-flow

/users
/settings

---

# 10. POS REQUIREMENTS

POS is one of the most important screens.

The POS should support:

- Product search
- Barcode scan
- Add/remove item
- Quantity update
- Unit price
- Discount
- Subtotal
- Grand total
- Cash payment
- bKash
- Nagad
- Rocket
- Card
- Bank
- Due
- Mixed payment in a future version if needed
- Received amount
- Change calculation
- Customer selection
- Complete sale
- Invoice number
- Print invoice
- PDF invoice

Example:

Product | Qty | Price | Total
Rice | 2 | 70 | 140
Oil | 1 | 180 | 180
Sugar | 2 | 120 | 240

Subtotal = 560
Discount = 10
Grand Total = 550
Received = 600
Change = 50

---

# 11. PRODUCT REQUIREMENTS

Product fields should include:

- id
- name
- SKU
- barcode
- description
- category
- unit
- purchase price
- selling price
- wholesale price
- minimum stock
- maximum stock
- status
- createdAt
- updatedAt

Product status:

- ACTIVE
- INACTIVE
- DISCONTINUED

Product barcode must be unique when provided.

---

# 12. PRODUCT BATCH / EXPIRY

Some products may have:

- batch number
- expiry date
- purchase price
- selling price
- quantity
- remaining quantity

The system should support expiry alerts.

Example:

Expiring Soon:

- Milk — 5 days
- Juice — 12 days
- Biscuit — 18 days

---

# 13. INVENTORY REQUIREMENTS

Inventory must support:

- Current quantity
- Reserved quantity
- Opening stock
- Purchase increase
- Sale decrease
- Sale return increase
- Purchase return decrease
- Damage decrease
- Manual adjustment
- Stock movement history
- Low stock alert
- Out-of-stock alert
- Stock valuation

Never update stock without recording a stock movement/transaction where appropriate.

Critical inventory operations should use database transactions and proper concurrency handling.

---

# 14. PURCHASE REQUIREMENTS

Purchase should contain:

- Invoice number
- Supplier
- Created by
- Purchase date
- Items
- Quantity
- Unit price
- Discount
- Transport cost
- Other cost
- Subtotal
- Grand total
- Paid amount
- Due amount
- Status
- Note

Purchase statuses:

- DRAFT
- RECEIVED
- PARTIAL
- PAID
- CANCELLED
- RETURNED

Purchase confirmation should update inventory and supplier balance atomically.

---

# 15. SALES REQUIREMENTS

Sale should contain:

- Invoice number
- Optional customer
- Cashier
- Sale date
- Items
- Quantity
- Unit price
- Cost price
- Discount
- Tax
- Subtotal
- Grand total
- Paid amount
- Due amount
- Status
- Note

Sale statuses:

- DRAFT
- COMPLETED
- PARTIAL
- DUE
- CANCELLED
- RETURNED

Before completing a sale:

1. Validate product exists.
2. Validate product is active.
3. Validate stock is sufficient.
4. Create sale.
5. Create sale items.
6. Reduce inventory.
7. Create stock transactions.
8. Create payment(s).
9. Update customer ledger if needed.
10. Update cash/account ledger.
11. Commit the entire operation atomically.

If any critical step fails, rollback the entire transaction.

---

# 16. CUSTOMER REQUIREMENTS

Customer:

- name
- phone
- email
- address
- opening balance
- active status

Customer functionality:

- Sales history
- Payment history
- Due amount
- Ledger
- Due collection
- Sale return history

---

# 17. SUPPLIER REQUIREMENTS

Supplier:

- name
- phone
- email
- address
- opening balance
- active status

Supplier functionality:

- Purchase history
- Payment history
- Due amount
- Ledger
- Supplier payment
- Purchase return history

---

# 18. PAYMENT REQUIREMENTS

Payment methods:

- CASH
- BKASH
- NAGAD
- ROCKET
- CARD
- BANK
- DUE
- OTHER

Payment statuses:

- PENDING
- PARTIAL
- PAID
- CANCELLED
- REFUNDED

Payments should support references to:

- Sale
- Purchase
- Customer
- Supplier
- User who received/recorded the payment

Backend validation must ensure a payment is not incorrectly attached to conflicting transaction types.

---

# 19. EXPENSE REQUIREMENTS

Expense categories may include:

- Shop Rent
- Electricity
- Internet
- Transport
- Employee Salary
- Packaging
- Maintenance
- Personal Withdrawal
- Others

Expense fields:

- category
- amount
- date
- payment method
- description
- status
- created by

Expense must affect the cash/account ledger according to payment method.

---

# 20. INCOME REQUIREMENTS

Other income categories:

- Other Income
- Delivery Charge
- Miscellaneous
- Other business income

Sales revenue should remain represented by the Sales module rather than being duplicated as a manual Income record.

---

# 21. RETURNS

## Sale Return

Customer returns product:

Sale Return
-> Return Items
-> Inventory increases
-> Financial/customer balance adjusted
-> Refund recorded if applicable

## Purchase Return

Shop returns product to supplier:

Purchase Return
-> Return Items
-> Inventory decreases
-> Supplier balance adjusted
-> Refund/payment adjustment recorded if applicable

Return statuses:

- PENDING
- COMPLETED
- CANCELLED

---

# 22. STOCK ADJUSTMENT

Stock adjustment should support:

- INCREASE
- DECREASE

Reasons:

- Physical count correction
- Damage
- Lost item
- Opening stock correction
- Other

Each adjustment should record:

- adjustment number
- type
- reason
- user
- product
- quantity
- previous stock
- new stock
- note
- timestamp

---

# 23. DASHBOARD

Dashboard should show:

- Today's sales
- Today's purchases
- Today's expenses
- Today's profit
- Cash balance
- Customer due
- Supplier due
- Stock value
- Low-stock products
- Out-of-stock products
- Recent sales
- Recent purchases
- Top-selling products

Charts:

- 7-day sales
- 30-day sales
- Monthly sales
- Monthly profit
- Expense breakdown
- Top products

---

# 24. REPORTS

## Sales Reports

- Daily sales
- Weekly sales
- Monthly sales
- Yearly sales
- Product-wise sales
- Customer-wise sales
- Payment-wise sales
- Cash sales
- Due sales

## Purchase Reports

- Daily purchase
- Monthly purchase
- Supplier-wise purchase
- Product-wise purchase

## Inventory Reports

- Current stock
- Low stock
- Out of stock
- Stock movement
- Stock valuation
- Expiring products

## Financial Reports

- Income
- Expenses
- Gross profit
- Net profit
- Profit & Loss
- Customer due
- Supplier due
- Cash flow

---

# 25. PROFIT CALCULATION

For each sale item, preserve the cost price used at the time of sale.

Example:

Purchase price = 100
Selling price = 120
Quantity = 10

Revenue = 1,200
COGS = 1,000
Gross Profit = 200

Then:

Gross Profit - Operating Expenses = Net Profit

Do not calculate historical profit using the current Product.purchasePrice because product purchase prices can change.

---

# 26. INVOICE

Invoice format should contain:

Al Modina Grocery Shop

Invoice number
Date
Customer
Items
Quantity
Unit price
Discount
Subtotal
Grand total
Paid
Due
Payment method
Change where applicable

Invoice should support:

- Printable version
- PDF generation
- Future receipt-printer support

Recommended invoice format:

INV-2026-000001

---

# 27. BARCODE

Product should have:

- SKU
- Barcode

POS should support barcode scanners connected through USB/Bluetooth.

Flow:

Barcode Scan
-> Find Product
-> Add to Cart
-> Quantity
-> Complete Sale

---

# 28. SECURITY

Minimum security requirements:

- Password hashing
- Authentication
- Authorization
- Role-based access
- Backend validation
- Zod
- Helmet
- CORS
- Rate limiting
- Secure cookies/session or secure JWT architecture
- Environment variables
- Audit logs
- SQL injection protection through Prisma
- Input sanitization where appropriate

Never trust frontend validation for security.

---

# 29. ERROR HANDLING

Use centralized backend error handling.

Example response:

{
"success": false,
"message": "Insufficient stock",
"errorCode": "INSUFFICIENT_STOCK"
}

Recommended error categories:

- VALIDATION_ERROR
- AUTHENTICATION_ERROR
- AUTHORIZATION_ERROR
- NOT_FOUND
- CONFLICT
- INSUFFICIENT_STOCK
- BUSINESS_RULE_ERROR
- INTERNAL_SERVER_ERROR

---

# 30. VALIDATION

Frontend and backend must both validate.

Examples:

- Product name required
- Selling price > 0
- Purchase price >= 0
- Quantity > 0
- Discount within valid range
- Phone valid format
- Email valid format
- Due amount cannot be negative
- Payment amount cannot exceed valid transaction limits
- Sale quantity cannot exceed available stock

Zod is recommended.

---

# 31. AUDIT LOG

Important actions should be logged.

Audit log should capture:

- User
- Action
- Entity
- Entity ID
- Old data
- New data
- IP address
- User agent
- Timestamp

Examples:

Admin changed product price:
Old = 180
New = 190

Actions:

- CREATE
- UPDATE
- DELETE
- LOGIN
- LOGOUT
- CANCEL
- APPROVE
- COMPLETE
- ADJUST

---

# 32. SETTINGS

System settings should support things such as:

- Shop name
- Shop address
- Phone
- Email
- Invoice prefix
- Currency
- Tax configuration if required
- Receipt settings
- Low stock defaults
- Other configurable values

---

# 33. DATABASE MODEL REQUIREMENTS

The current production-oriented Prisma design contains approximately 30 models/entities around:

- User
- Category
- Product
- ProductBatch
- Inventory
- StockTransaction
- Supplier
- Customer
- Purchase
- PurchaseItem
- Sale
- SaleItem
- Payment
- CustomerTransaction
- SupplierTransaction
- ExpenseCategory
- Expense
- IncomeCategory
- Income
- AccountTransaction
- StockAdjustment
- StockAdjustmentItem
- SaleReturn
- SaleReturnItem
- PurchaseReturn
- PurchaseReturnItem
- Setting
- AuditLog

---

# 34. PRISMA REQUIREMENTS

Use Prisma 7 style configuration.

Generator:

generator client {
provider = "prisma-client"
output = "../src/generated/prisma"
}

Datasource:

datasource db {
provider = "postgresql"
}

Use Decimal for financial values.

Do not use Float for:

- Price
- Amount
- Cost
- Payment
- Profit
- Due
- Financial balances

Use appropriate PostgreSQL NUMERIC/DECIMAL types.

Use migrations for schema changes.

Development commands:

yarn prisma format
yarn prisma validate
yarn prisma migrate dev --name init
yarn prisma generate

Production:

yarn prisma migrate deploy

---

# 35. DATABASE DESIGN PRINCIPLES

Use:

- UUID primary keys
- Foreign keys
- Unique constraints
- Composite/indexed lookup fields where useful
- Restrict deletes for historical business records
- SetNull where historical records should survive deletion/deactivation
- Cascade only for dependent child records where safe
- Decimal values for money
- Transactional writes for business operations

Do not hard-delete historical sales/purchases/payments casually.

Prefer cancellation/status changes for business records.

---

# 36. IMPORTANT DATABASE RELATIONSHIP RULES

Category 1 -> many Products

Product 1 -> 1 Inventory

Product 1 -> many ProductBatches

Product 1 -> many PurchaseItems

Product 1 -> many SaleItems

Product 1 -> many StockTransactions

Supplier 1 -> many Purchases

Supplier 1 -> many SupplierTransactions

Supplier 1 -> many Payments

Customer 1 -> many Sales

Customer 1 -> many CustomerTransactions

Customer 1 -> many Payments

Purchase 1 -> many PurchaseItems

Purchase 1 -> many Payments

Purchase 1 -> many PurchaseReturns

Sale 1 -> many SaleItems

Sale 1 -> many Payments

Sale 1 -> many SaleReturns

SaleReturn 1 -> many SaleReturnItems

PurchaseReturn 1 -> many PurchaseReturnItems

ExpenseCategory 1 -> many Expenses

IncomeCategory 1 -> many Incomes

StockAdjustment 1 -> many StockAdjustmentItems

User 1 -> many Sales

User 1 -> many Purchases

User 1 -> many Expenses

User 1 -> many Incomes

User 1 -> many Payments

User 1 -> many AuditLogs

---

# 37. API DESIGN

Base URL:

/api/v1

Recommended modules:

/api/v1/auth
/api/v1/users
/api/v1/products
/api/v1/categories
/api/v1/inventory
/api/v1/purchases
/api/v1/sales
/api/v1/customers
/api/v1/suppliers
/api/v1/payments
/api/v1/expenses
/api/v1/incomes
/api/v1/returns
/api/v1/reports
/api/v1/dashboard
/api/v1/settings

Example:

POST /api/v1/auth/login

GET /api/v1/products
POST /api/v1/products
GET /api/v1/products/:id
PATCH /api/v1/products/:id
DELETE /api/v1/products/:id

GET /api/v1/sales
POST /api/v1/sales
GET /api/v1/sales/:id

GET /api/v1/purchases
POST /api/v1/purchases
GET /api/v1/purchases/:id

API documentation should define:

- Request body
- Query parameters
- Path parameters
- Response format
- Error responses
- Authentication
- Required role/permission

---

# 38. TRANSACTION SAFETY

The following operations must use database transactions:

## Sale

Create Sale

- Create Sale Items
- Reduce Inventory
- Create Stock Transactions
- Create Payment
- Update Customer Ledger
- Update Account Ledger

## Purchase

Create Purchase

- Create Purchase Items
- Create/Update Product Batch
- Increase Inventory
- Create Stock Transactions
- Create Supplier Ledger entry
- Create Payment
- Update Account Ledger

## Sale Return

Create return

- increase inventory
- create stock movement
- adjust customer/account balance
- refund if applicable

## Purchase Return

Create return

- decrease inventory
- create stock movement
- adjust supplier/account balance
- refund if applicable

If a critical step fails, rollback.

---

# 39. TESTING REQUIREMENTS

At minimum test:

Authentication
Authorization
Product CRUD
Category CRUD
Inventory
Purchase
Purchase return
Sale
Sale return
Payment
Customer due
Supplier due
Expense
Income
Cash ledger
Profit calculation
Stock calculation

Critical business tests:

Sale -> stock decreases

Purchase -> stock increases

Sale return -> stock increases

Purchase return -> stock decreases

Customer payment -> customer due decreases

Supplier payment -> supplier due decreases

Expense -> cash decreases

Income -> cash increases

Sale + Purchase + Expense -> correct profit calculation

---

# 40. DEVELOPMENT ROADMAP

## Phase 1 — Foundation

- Repository
- Frontend
- Backend
- TypeScript
- Yarn
- ESLint
- Prettier
- Environment configuration

## Phase 2 — Database

- ERD
- Prisma schema
- PostgreSQL
- Migrations
- Seed
- Indexes
- Constraints

## Phase 3 — Authentication

- Login
- Logout
- Session/JWT
- User
- Role
- Authorization
- Protected routes

## Phase 4 — Core Data

- Categories
- Products
- Suppliers
- Customers
- Inventory

## Phase 5 — Transactions

- Purchases
- Sales
- POS
- Payments
- Customer due
- Supplier due
- Expenses
- Income

## Phase 6 — Reports

- Dashboard
- Sales report
- Purchase report
- Inventory report
- Due reports
- Profit & Loss
- Cash flow

## Phase 7 — Advanced

- Returns
- Product batches
- Expiry
- Barcode
- Invoice
- Audit log
- Alerts

## Phase 8 — Production

- Tests
- Security hardening
- Docker
- Database backup
- CI/CD
- Deployment
- Monitoring

---

# 41. MVP SCOPE

Do NOT implement everything at once.

MVP should contain:

- Authentication
- Products
- Categories
- Inventory
- Purchases
- Sales
- Customers
- Suppliers
- Payments
- Expenses
- Dashboard
- Basic reports

After MVP:

## V2

- Barcode
- Invoice
- Returns
- Expiry
- Advanced reports

## V3

- PWA
- Offline mode
- Multi-user improvements
- Advanced permissions
- Automated backup

## V4

- Multi-shop
- Multi-branch
- Cloud sync
- Mobile app
- Advanced analytics

---

# 42. FUTURE PWA / OFFLINE SUPPORT

Do not prioritize offline mode in MVP.

Future architecture:

Online:
React PWA -> API -> PostgreSQL

Offline:
React PWA -> IndexedDB/local queue

When online:
Local queue -> Sync API -> Server

Offline inventory/sales synchronization requires conflict resolution and should be implemented only after the online version is stable.

---

# 43. BARCODE / HARDWARE FUTURE

Future hardware:

- USB barcode scanner
- Bluetooth barcode scanner
- Receipt printer
- Cash drawer
- External POS display

Typical flow:

Barcode scanner
-> browser input
-> POS
-> product lookup
-> cart
-> payment
-> invoice
-> receipt printer

---

# 44. DEPLOYMENT

Possible production architecture:

Frontend:

- Vercel or Cloudflare

Backend:

- Railway
- Render
- VPS
- Docker-based server

Database:

- Managed PostgreSQL
- PostgreSQL on VPS for advanced/self-managed deployment

Alternative:

Single VPS
-> Docker Compose
-> React frontend
-> Express backend
-> PostgreSQL
-> reverse proxy

---

# 45. DOCKER

Recommended services:

- frontend
- backend
- postgres

Development can use Docker Compose for PostgreSQL and optionally the application services.

---

# 46. BACKUP

Database backup is mandatory.

Recommended:

- Daily backup
- Weekly backup
- Monthly backup
- Off-site/cloud backup

Never rely on a single local copy of the database.

---

# 47. DOCUMENTATION

Create:

docs/
├── requirements.md
├── architecture.md
├── database.md
├── erd.png
├── api-documentation.md
├── business-rules.md
├── deployment.md
└── user-guide.md

README should explain:

- Project purpose
- Tech stack
- Setup
- Environment variables
- Database setup
- Migration
- Seed
- Development
- Testing
- Build
- Deployment

---

# 48. GIT / DEVELOPMENT PRACTICES

Use meaningful commits.

Examples:

feat: add product management
feat: implement purchase module
feat: implement POS sales
feat: add customer due ledger
fix: resolve stock calculation
fix: prevent negative inventory
refactor: improve inventory service
test: add sale transaction tests
docs: update API documentation

Avoid giant commits that contain unrelated features.

---

# 49. IMPORTANT ENGINEERING RULES FOR THE CODING AGENT

The coding agent MUST:

1. Read this document before changing architecture.
2. Preserve the chosen technology stack unless explicitly asked to change it.
3. Prefer TypeScript strictness.
4. Never use Float for financial values.
5. Never trust frontend validation alone.
6. Keep business logic in backend services.
7. Use Prisma transactions for multi-step business operations.
8. Avoid destructive database changes without explicit confirmation.
9. Avoid hard-deleting historical financial records.
10. Preserve auditability.
11. Keep stock movements traceable.
12. Keep customer/supplier balances traceable.
13. Write tests for critical financial/inventory logic.
14. Keep API responses consistent.
15. Use environment variables for secrets.
16. Never commit .env files or secrets.
17. Prefer small, reviewable commits.
18. Do not introduce unnecessary dependencies.
19. Do not rewrite working architecture without a reason.
20. Before modifying Prisma schema, check relationship implications and migration safety.

---

# 50. CURRENT PROJECT STATUS

Already defined/discussed:

- Project concept
- Main feature set
- Technology stack
- High-level architecture
- Folder structure
- Database architecture
- Production-oriented Prisma schema
- ERD concept
- API module plan
- Business flows
- Development roadmap

Still needs implementation/finalization:

- Final Prisma schema review
- Prisma migrations
- Seed script
- Prisma client setup
- Express application bootstrap
- Authentication
- RBAC
- API implementation
- Frontend implementation
- POS
- Inventory transaction services
- Accounting/ledger services
- Reports
- Testing
- Docker
- Deployment
- Backup
- CI/CD

---

# 51. RECOMMENDED NEXT STEPS FOR THE CODING AGENT

Work in this exact order:

1. Review this specification.
2. Review the Prisma schema.
3. Validate all business relationships.
4. Finalize ERD/cardinality.
5. Finalize Prisma schema.
6. Run Prisma format/validate.
7. Create initial migration.
8. Create production-quality seed.ts.
9. Create Prisma client setup.
10. Create Express application architecture.
11. Implement centralized error handling.
12. Implement validation system.
13. Implement authentication.
14. Implement RBAC.
15. Implement categories.
16. Implement products.
17. Implement suppliers.
18. Implement customers.
19. Implement inventory service.
20. Implement purchase service.
21. Implement sales/POS service.
22. Implement payment service.
23. Implement customer/supplier ledgers.
24. Implement expenses/income.
25. Implement returns.
26. Implement dashboard.
27. Implement reports.
28. Implement audit logging.
29. Implement frontend pages.
30. Add tests.
31. Add Docker.
32. Add CI/CD.
33. Configure backups.
34. Deploy.
35. Perform production verification.

---

# 52. DEFINITION OF DONE

A feature is NOT considered complete just because the UI exists.

A feature is complete only when:

- Database model exists
- Migration works
- Backend validation exists
- Backend service exists
- Controller/route exists
- Authorization is correct
- Error handling exists
- Frontend UI exists
- Loading state exists
- Empty state exists
- Error state exists
- API integration works
- Critical business rules work
- Tests exist where appropriate
- Audit/ledger/stock impact is handled
- Documentation is updated where necessary

---

# 53. FINAL PRODUCT VISION

The finished application should behave like a lightweight professional POS + inventory + accounting system for a grocery shop.

Core loop:

Products
-> Purchase
-> Inventory
-> Sale/POS
-> Payment
-> Customer/Supplier Ledger
-> Cash Ledger
-> Profit/Loss
-> Reports

The system should be simple enough for daily grocery-shop use but architected cleanly enough to expand later.

The first goal is NOT maximum features.

The first goal is:

**Correct inventory + correct money + correct dues + correct reports.**

Once those are reliable, add barcode, invoice, PWA, offline support, multi-shop, and advanced analytics.

---

# END OF MASTER PROJECT CONTEXT
