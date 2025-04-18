import  sql  from '../farmboxes/db';
import { getSessionToken } from '../auth/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { customerId, items, totalAmount } = req.body;

  if (!customerId || !items || !totalAmount || !Array.isArray(items) || items.length === 0) {
    console.error('Invalid input received:', { customerId, items, totalAmount });
    return res.status(400).json({ 
      message: 'Invalid input', 
      details: 'customerId, items (non-empty array), and totalAmount are required' 
    });
  }

  // Validate totalAmount as a number
  const parsedTotalAmount = parseFloat(totalAmount);
  if (isNaN(parsedTotalAmount) || parsedTotalAmount < 0) {
    console.error('Invalid totalAmount:', totalAmount);
    return res.status(400).json({ 
      message: 'Invalid input', 
      details: 'totalAmount must be a valid non-negative number' 
    });
  }
  // Convert to integer for customers.total_spent and orders.amount
  const integerTotalAmount = Math.floor(parsedTotalAmount);

  try {
    // Verify authentication
    const session = getSessionToken(req.cookies);
    console.log('Session:', session, 'Customer ID:', customerId);
    if (!session) {
      console.error('No session found:', { cookies: req.cookies });
      return res.status(401).json({ 
        message: 'Unauthorized', 
        details: 'No session cookie found' 
      });
    }
    if (!session.id || session.id !== customerId) {
      console.error('Session ID mismatch:', { sessionId: session.id, customerId });
      return res.status(401).json({ 
        message: 'Unauthorized', 
        details: 'Session ID does not match customer ID' 
      });
    }

    // Run all database operations in a transaction
    const result = await sql.begin(async (transaction) => {
      // Verify customer exists
      console.log('Executing customer query for ID:', customerId);
      let customer;
      try {
        customer = await transaction`
          SELECT id FROM customers WHERE id = ${customerId}
        `;
        console.log('Customer query result:', customer);
      } catch (queryError) {
        console.error('Customer query failed:', queryError);
        throw new Error('Database query failed');
      }
      const customerRows = Array.isArray(customer) ? customer : customer.rows || [];
      if (customerRows.length === 0) {
        console.error('Customer not found:', customerId);
        throw new Error('Customer not found');
      }

      // Validate stock for each item
      for (const item of items) {
        console.log('Executing farmbox query for ID:', item.product.id);
        let farmbox;
        try {
          farmbox = await transaction`
            SELECT maxquantity FROM farmboxes WHERE id = ${item.product.id}
          `;
          console.log('Farmbox query result:', farmbox);
        } catch (queryError) {
          console.error('Farmbox query failed:', queryError);
          throw new Error('Database query failed');
        }
        const farmboxRows = Array.isArray(farmbox) ? farmbox : farmbox.rows || [];
        if (farmboxRows.length === 0) {
          console.error('Farmbox not found:', item.product.id);
          throw new Error(`Farmbox ${item.product.id} not found`);
        }
        if (farmboxRows[0].maxquantity < item.quantity) {
          console.error('Insufficient stock:', { farmboxId: item.product.id, requested: item.quantity, available: farmboxRows[0].maxquantity });
          throw new Error(`Insufficient stock for farmbox ${item.product.name}`);
        }
      }

      // Generate order ID in format FB-XXX
      console.log('Executing order count query');
      let orderCount;
      try {
        orderCount = await transaction`
          SELECT COUNT(*) AS count FROM orders
        `;
        console.log('Order count query result:', orderCount);
      } catch (queryError) {
        console.error('Order count query failed:', queryError);
        throw new Error('Database query failed');
      }
      const orderCountRows = Array.isArray(orderCount) ? orderCount : orderCount.rows || [];
      const nextOrderNumber = parseInt(orderCountRows[0].count) + 1;
      const orderId = `FB-${nextOrderNumber.toString().padStart(3, '0')}`;

      // Create the order with status 'processing'
      console.log('Inserting order:', { orderId, customerId, totalAmount: integerTotalAmount });
      await transaction`
        INSERT INTO orders (id, customer_id, amount, status, date)
        VALUES (${orderId}, ${customerId}, ${integerTotalAmount}, 'Processing', CURRENT_TIMESTAMP)
      `;

      // Add order items
      for (const item of items) {
        console.log('Inserting order item:', { orderId, farmboxId: item.product.id, quantity: item.quantity });
        await transaction`
          INSERT INTO order_items (order_id, farmbox_id, quantity, price)
          VALUES (${orderId}, ${item.product.id}, ${item.quantity}, ${item.price})
        `;
      }

      // Update farmbox stock (decrease maxquantity)
      for (const item of items) {
        console.log('Updating farmbox stock:', { farmboxId: item.product.id, quantity: item.quantity });
        await transaction`
          UPDATE farmboxes
          SET maxquantity = maxquantity - ${item.quantity}
          WHERE id = ${item.product.id}
        `;
      }

      // Update customer statistics
      console.log('Updating customer statistics:', customerId);
      await transaction`
        UPDATE customers
        SET total_orders = total_orders + 1,
            total_spent = total_spent + ${integerTotalAmount},
            last_order = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${customerId}
      `;

      // Clear the cart
      console.log('Clearing cart for customer:', customerId);
      await transaction`
        DELETE FROM cart_items WHERE customer_id = ${customerId}
      `;

      return { orderId };
    });

    return res.status(200).json({ message: 'Order placed successfully', orderId: result.orderId });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(error.message.includes('not found') || error.message.includes('Insufficient stock') ? 400 : 500).json({ 
      message: 'Failed to place order', 
      details: error.message 
    });
  }
}