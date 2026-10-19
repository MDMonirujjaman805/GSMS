import { PrismaClient, Role, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting GSMS Database Seed...');

  // 1. Clean existing records (in reverse dependency order)
  await prisma.auditLog.deleteMany();
  await prisma.accountTransaction.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.saleReturnItem.deleteMany();
  await prisma.saleReturn.deleteMany();
  await prisma.purchaseReturnItem.deleteMany();
  await prisma.purchaseReturn.deleteMany();
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.purchaseItem.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.stockAdjustmentItem.deleteMany();
  await prisma.stockAdjustment.deleteMany();
  await prisma.stockTransaction.deleteMany();
  await prisma.productBatch.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customerTransaction.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplierTransaction.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.expenseCategory.deleteMany();
  await prisma.income.deleteMany();
  await prisma.incomeCategory.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  // 2. Users (Admin, Manager, Cashier)
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@gsms.com',
      password: passwordHash,
      name: 'System Administrator',
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      username: 'manager',
      email: 'manager@gsms.com',
      password: passwordHash,
      name: 'Shop Manager',
      role: Role.MANAGER,
    },
  });

  await prisma.user.create({
    data: {
      username: 'cashier',
      email: 'cashier@gsms.com',
      password: passwordHash,
      name: 'POS Cashier',
      role: Role.CASHIER,
    },
  });

  console.log('✅ Created Default Users: Admin, Manager, Cashier (Password: Password123!)');

  // 3. System Settings
  await prisma.setting.createMany({
    data: [
      {
        key: 'shop_name',
        value: 'Al-Modina Grocery Superstore',
        description: 'Business Name for Receipts & Invoices',
      },
      {
        key: 'shop_address',
        value: 'Plot 12, Main Road, Block C, Mirpur, Dhaka',
        description: 'Physical Shop Address',
      },
      { key: 'shop_phone', value: '+880 1711-000000', description: 'Contact Phone Number' },
      {
        key: 'shop_email',
        value: 'contact@almodina-grocery.com',
        description: 'Support Email Address',
      },
      { key: 'currency', value: 'BDT', description: 'Primary System Currency Code' },
      { key: 'currency_symbol', value: '৳', description: 'Primary Currency Symbol' },
      { key: 'invoice_prefix', value: 'INV-2026-', description: 'Sales Invoice Numbering Prefix' },
      {
        key: 'low_stock_threshold_default',
        value: '5',
        description: 'Global Low Stock Alert Trigger',
      },
    ],
  });

  console.log('✅ Created System Settings');

  // 4. Categories
  const catRice = await prisma.category.create({
    data: {
      name: 'Rice & Staples',
      slug: 'rice-staples',
      description: 'Rice, Flour, Sugar, Pulses & Oil',
    },
  });

  const catDairy = await prisma.category.create({
    data: {
      name: 'Dairy & Eggs',
      slug: 'dairy-eggs',
      description: 'Fresh Milk, Butter, Cheese, Eggs',
    },
  });

  const catBeverages = await prisma.category.create({
    data: { name: 'Beverages', slug: 'beverages', description: 'Tea, Coffee, Soft Drinks, Juices' },
  });

  await prisma.category.create({
    data: {
      name: 'Snacks & Confectionery',
      slug: 'snacks-confectionery',
      description: 'Biscuits, Chips, Chocolates',
    },
  });

  console.log('✅ Created Product Categories');

  // 5. Products & Initial Inventory
  const productsData = [
    {
      name: 'Miniket Rice 5kg Premium Pack',
      sku: 'SKU-MINIKET-5KG',
      barcode: '894110011001',
      categoryId: catRice.id,
      unit: 'bag',
      purchasePrice: '380.00',
      sellingPrice: '420.00',
      minStock: '10.00',
      initialStock: '50.00',
    },
    {
      name: 'Rupchanda Soyabean Oil 5L Can',
      sku: 'SKU-OIL-SOYA-5L',
      barcode: '894110011002',
      categoryId: catRice.id,
      unit: 'can',
      purchasePrice: '780.00',
      sellingPrice: '830.00',
      minStock: '5.00',
      initialStock: '30.00',
    },
    {
      name: 'Aarong Pasteurized Liquid Milk 1L',
      sku: 'SKU-MILK-1L',
      barcode: '894110011003',
      categoryId: catDairy.id,
      unit: 'pack',
      purchasePrice: '80.00',
      sellingPrice: '90.00',
      minStock: '15.00',
      initialStock: '40.00',
    },
    {
      name: 'Ispahani Mirzapore Tea Bag 500g',
      sku: 'SKU-TEA-500G',
      barcode: '894110011004',
      categoryId: catBeverages.id,
      unit: 'pack',
      purchasePrice: '210.00',
      sellingPrice: '235.00',
      minStock: '8.00',
      initialStock: '25.00',
    },
    {
      name: 'Teer Refined White Sugar 1kg',
      sku: 'SKU-SUGAR-1KG',
      barcode: '894110011005',
      categoryId: catRice.id,
      unit: 'pack',
      purchasePrice: '120.00',
      sellingPrice: '135.00',
      minStock: '20.00',
      initialStock: '60.00',
    },
  ];

  for (const prodItem of productsData) {
    const product = await prisma.product.create({
      data: {
        name: prodItem.name,
        sku: prodItem.sku,
        barcode: prodItem.barcode,
        categoryId: prodItem.categoryId,
        unit: prodItem.unit,
        purchasePrice: prodItem.purchasePrice,
        sellingPrice: prodItem.sellingPrice,
        minStock: prodItem.minStock,
        status: ProductStatus.ACTIVE,
      },
    });

    await prisma.inventory.create({
      data: {
        productId: product.id,
        currentStock: prodItem.initialStock,
        openingStock: prodItem.initialStock,
      },
    });

    await prisma.stockTransaction.create({
      data: {
        productId: product.id,
        type: 'ADJUSTMENT_ADD',
        quantity: prodItem.initialStock,
        previousStock: '0.00',
        newStock: prodItem.initialStock,
        note: 'Opening Inventory Seed',
        createdById: admin.id,
      },
    });
  }

  console.log('✅ Created Products & Initial Stock Balances');

  // 6. Customers & Suppliers
  await prisma.customer.create({
    data: {
      name: 'Walk-in Retail Customer',
      phone: '00000000000',
      address: 'General Store POS',
    },
  });

  await prisma.customer.create({
    data: {
      name: 'Tanvir Ahmed',
      phone: '01712345678',
      email: 'tanvir@gmail.com',
      address: 'House 45, Road 3, Mirpur 11, Dhaka',
      openingBalance: '0.00',
    },
  });

  await prisma.supplier.create({
    data: {
      name: 'Akij Food & Beverage Ltd',
      company: 'Akij Group',
      phone: '01899990000',
      email: 'sales@akijfood.com',
      address: 'Tejgaon Industrial Area, Dhaka',
    },
  });

  await prisma.supplier.create({
    data: {
      name: 'Square Consumer Products Ltd',
      company: 'Square Group',
      phone: '01888880000',
      email: 'orders@squareconsumer.com',
      address: 'Uttara, Dhaka',
    },
  });

  console.log('✅ Created Default Customers & Suppliers');

  // 7. Expense & Income Categories
  await prisma.expenseCategory.create({
    data: { name: 'Shop Rent', description: 'Monthly premises rental' },
  });
  await prisma.expenseCategory.create({
    data: { name: 'Utility Bills', description: 'Electricity, Water, Internet' },
  });
  await prisma.expenseCategory.create({
    data: { name: 'Employee Salary', description: 'Staff payroll' },
  });

  await prisma.incomeCategory.create({
    data: { name: 'Delivery Charge', description: 'Home delivery fees' },
  });
  await prisma.incomeCategory.create({
    data: { name: 'Miscellaneous Income', description: 'Scrap packaging sales' },
  });

  console.log('✅ Created Financial Expense & Income Categories');

  console.log('🎉 Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Database Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
