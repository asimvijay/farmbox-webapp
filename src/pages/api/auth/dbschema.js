// pages/api/auth/dbschema.js
import sql from '../farmboxes/db';

export default async function handler(req, res) {
  try {
    // Check if schema_status table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'schema_status'
      ) AS table_exists
    `;

    const schemaStatusTableExists = tableCheck[0].table_exists;

    if (schemaStatusTableExists) {
      // Check if initialized flag is set
      const status = await sql`
        SELECT initialized FROM schema_status WHERE id = 1
      `;
      
      if (status.length > 0 && status[0].initialized) {
        return res.status(200).json({
          success: true,
          message: 'Database already initialized',
        });
      }
    }

    // If schema_status table doesn't exist, create it
    if (!schemaStatusTableExists) {
      await sql`
        CREATE TABLE schema_status (
          id INTEGER PRIMARY KEY,
          initialized BOOLEAN NOT NULL
        )
      `;
    }

    // Create customers table
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        total_orders INT DEFAULT 0,
        total_spent NUMERIC DEFAULT 0,
        last_order TIMESTAMP,
        password VARCHAR(255) NOT NULL,
        city VARCHAR(100),
        country VARCHAR(100),
        postalcode VARCHAR(20),
        area VARCHAR(100),
        user_type VARCHAR(20),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create farmboxes table
    await sql`
      CREATE TABLE IF NOT EXISTS farmboxes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL,
        products VARCHAR[],
        image VARCHAR(255),
        category VARCHAR(100),
        isfeatured BOOLEAN DEFAULT FALSE,
        deliveryfrequency VARCHAR(50),
        boxtype VARCHAR(50),
        maxquantity INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        price NUMERIC NOT NULL,
        stock INT DEFAULT 0,
        image VARCHAR(255)
      )
    `;

    // Create stats table
    await sql`
      CREATE TABLE IF NOT EXISTS stats (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        value NUMERIC NOT NULL,
        change VARCHAR(50),
        trend VARCHAR(50)
      )
    `;

    // Create orders table with custom string ID
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(10) PRIMARY KEY,
        customer_id VARCHAR(20) NOT NULL REFERENCES customers(id),
        amount NUMERIC NOT NULL,
        status VARCHAR(50) NOT NULL,
        date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create order_items table
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(10) NOT NULL REFERENCES orders(id),
        farmbox_id INT NOT NULL REFERENCES farmboxes(id),
        quantity INT NOT NULL,
        price NUMERIC NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
        // Create cart_items table
        await sql`
        CREATE TABLE IF NOT EXISTS cart_items (
          id SERIAL PRIMARY KEY,
          customer_id VARCHAR(20) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
          box_id INT NOT NULL REFERENCES farmboxes(id) ON DELETE CASCADE,
          quantity INT NOT NULL DEFAULT 1,
          frequency VARCHAR(50),
          price NUMERIC NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
      CREATE TABLE IF NOT EXISTS otp_verifications(
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        otp VARCHAR(10) NOT NULL,
        expiry TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULTCURRENT_TIMESTAMP,
      )
      `;
  

    // Drop old trigger function if exists
    await sql`DROP FUNCTION IF EXISTS update_customer_totals CASCADE`;

    // Create customer update trigger function
    await sql`
      CREATE OR REPLACE FUNCTION update_customer_totals()
      RETURNS TRIGGER AS $$
      BEGIN
          IF TG_OP = 'INSERT' THEN
              UPDATE customers
              SET 
                  total_orders = (SELECT COUNT(*) FROM orders WHERE customer_id = NEW.customer_id),
                  total_spent = (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE customer_id = NEW.customer_id),
                  last_order = (SELECT MAX(date) FROM orders WHERE customer_id = NEW.customer_id)
              WHERE id = NEW.customer_id;
          ELSIF TG_OP = 'UPDATE' THEN
              IF OLD.customer_id <> NEW.customer_id THEN
                  UPDATE customers
                  SET 
                      total_orders = (SELECT COUNT(*) FROM orders WHERE customer_id = OLD.customer_id),
                      total_spent = (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE customer_id = OLD.customer_id),
                      last_order = (SELECT MAX(date) FROM orders WHERE customer_id = OLD.customer_id)
                  WHERE id = OLD.customer_id;
              END IF;
              UPDATE customers
              SET 
                  total_orders = (SELECT COUNT(*) FROM orders WHERE customer_id = NEW.customer_id),
                  total_spent = (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE customer_id = NEW.customer_id),
                  last_order = (SELECT MAX(date) FROM orders WHERE customer_id = NEW.customer_id)
              WHERE id = NEW.customer_id;
          ELSIF TG_OP = 'DELETE' THEN
              UPDATE customers
              SET 
                  total_orders = (SELECT COUNT(*) FROM orders WHERE customer_id = OLD.customer_id),
                  total_spent = (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE customer_id = OLD.customer_id),
                  last_order = (SELECT MAX(date) FROM orders WHERE customer_id = OLD.customer_id)
              WHERE id = OLD.customer_id;
          END IF;
          RETURN NULL;
      END;
      $$ LANGUAGE plpgsql
    `;

    // Drop and recreate the customer update trigger
    await sql`DROP TRIGGER IF EXISTS orders_update_customer_totals ON orders`;
    await sql`
      CREATE TRIGGER orders_update_customer_totals
      AFTER INSERT OR UPDATE OR DELETE ON orders
      FOR EACH ROW
      EXECUTE FUNCTION update_customer_totals()
    `;

    // Backfill totals for existing customers
    await sql`
      UPDATE customers
      SET 
          total_orders = (SELECT COUNT(*) FROM orders o WHERE o.customer_id = customers.id),
          total_spent = (SELECT COALESCE(SUM(amount), 0) FROM orders o WHERE o.customer_id = customers.id),
          last_order = (SELECT MAX(date) FROM orders o WHERE o.customer_id = customers.id)
    `;

    // Create sequence for order ID numbers
    await sql`
      CREATE SEQUENCE IF NOT EXISTS order_id_seq START 1
    `;

    // Create trigger function to generate formatted order ID like FB-001
    await sql`
      CREATE OR REPLACE FUNCTION generate_order_id()
      RETURNS TRIGGER AS $$
      DECLARE
        new_id VARCHAR(10);
      BEGIN
        new_id := 'FB-' || LPAD(NEXTVAL('order_id_seq')::TEXT, 3, '0');
        NEW.id := new_id;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `;

    // Create trigger for setting order ID
    await sql`
      DROP TRIGGER IF EXISTS set_order_id ON orders
    `;
    await sql`
      CREATE TRIGGER set_order_id
      BEFORE INSERT ON orders
      FOR EACH ROW
      WHEN (NEW.id IS NULL)
      EXECUTE FUNCTION generate_order_id()
    `;

    // Set initialized flag
    await sql`
      INSERT INTO schema_status (id, initialized)
      VALUES (1, true)
      ON CONFLICT (id) DO UPDATE SET initialized = true
    `;

    res.status(200).json({
      success: true,
      message: 'Database schema and triggers initialized with formatted order IDs (FB-001...)',
    });
  } catch (error) {
    console.error('Initialization error:', error);
    res.status(500).json({
      success: false,
      error: 'Database setup failed',
      details: error.message,
    });
  }
}