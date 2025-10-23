import { db } from '@/db/db';
import { productsTable, salesTable } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await db.delete(salesTable);
    // await db.delete(productsTable);

    // Insert products
    await db.insert(productsTable).values([
      { name: 'Laptop', category: 'Electronics', price: 999.99, stock: 50 },
      { name: 'Mouse', category: 'Electronics', price: 25.99, stock: 200 },
      { name: 'Keyboard', category: 'Electronics', price: 75.0, stock: 150 },
      { name: 'Monitor', category: 'Electronics', price: 299.99, stock: 75 },
      { name: 'Desk Chair', category: 'Furniture', price: 199.99, stock: 40 },
      { name: 'Desk', category: 'Furniture', price: 399.99, stock: 30 },
      { name: 'Notebook', category: 'Stationery', price: 5.99, stock: 500 },
      { name: 'Pen Set', category: 'Stationery', price: 12.99, stock: 300 },
      { name: 'Coffee Mug', category: 'Kitchen', price: 9.99, stock: 120 },
      { name: 'Water Bottle', category: 'Kitchen', price: 15.99, stock: 180 },
    ]);

    console.log('✅ Products seeded');

    // Insert sales
    await db.insert(salesTable).values([
      {
        product_id: 1,
        quantity: 2,
        total_amount: 1999.98,
        customer_name: 'John Doe',
        region: 'North',
      },
      {
        product_id: 2,
        quantity: 5,
        total_amount: 129.95,
        customer_name: 'Jane Smith',
        region: 'South',
      },
      {
        product_id: 3,
        quantity: 3,
        total_amount: 225.0,
        customer_name: 'Bob Johnson',
        region: 'East',
      },
      {
        product_id: 1,
        quantity: 1,
        total_amount: 999.99,
        customer_name: 'Alice Brown',
        region: 'West',
      },
      {
        product_id: 4,
        quantity: 2,
        total_amount: 599.98,
        customer_name: 'Charlie Wilson',
        region: 'North',
      },
      {
        product_id: 5,
        quantity: 4,
        total_amount: 799.96,
        customer_name: 'Diana Davis',
        region: 'South',
      },
      {
        product_id: 6,
        quantity: 1,
        total_amount: 399.99,
        customer_name: 'Eve Martinez',
        region: 'East',
      },
      {
        product_id: 7,
        quantity: 20,
        total_amount: 119.8,
        customer_name: 'Frank Lee',
        region: 'West',
      },
      {
        product_id: 8,
        quantity: 10,
        total_amount: 129.9,
        customer_name: 'Grace Kim',
        region: 'North',
      },
      {
        product_id: 2,
        quantity: 3,
        total_amount: 77.97,
        customer_name: 'Henry Chen',
        region: 'South',
      },
      {
        product_id: 3,
        quantity: 2,
        total_amount: 150.0,
        customer_name: 'Ivy Wang',
        region: 'East',
      },
      {
        product_id: 1,
        quantity: 1,
        total_amount: 999.99,
        customer_name: 'Jack Taylor',
        region: 'West',
      },
      {
        product_id: 9,
        quantity: 8,
        total_amount: 79.92,
        customer_name: 'Kate Anderson',
        region: 'North',
      },
      {
        product_id: 10,
        quantity: 6,
        total_amount: 95.94,
        customer_name: 'Leo Thomas',
        region: 'South',
      },
      {
        product_id: 4,
        quantity: 3,
        total_amount: 899.97,
        customer_name: 'Maria Garcia',
        region: 'East',
      },
    ]);

    console.log('✅ Sales seeded');
    console.log('🎉 Database seeding complete!');

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      stats: {
        products: 10,
        sales: 15,
      },
    });
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
