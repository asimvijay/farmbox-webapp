import  sql  from '../farmboxes/db';
import { getSessionToken } from '../auth/auth';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { customerId, itemId, quantity } = req.body;

  // Validate input
  if (!customerId || !itemId || quantity === undefined || quantity < 1) {
    console.error('Invalid input received:', { customerId, itemId, quantity });
    return res.status(400).json({ 
      message: 'Invalid input', 
      details: 'customerId, itemId, and quantity (minimum 1) are required' 
    });
  }

  try {
    // Verify authentication
    const session = getSessionToken(req.cookies);
    
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

    // Verify customer exists
   
    let customer;
    try {
      customer = await sql`
        SELECT id FROM customers WHERE id = ${customerId}
      `;
    
    } catch (queryError) {
      console.error('Customer query failed:', queryError);
      throw new Error('Database query failed');
    }
    // Handle different result formats
    const customerRows = Array.isArray(customer) ? customer : customer.rows || [];
    if (customerRows.length === 0) {
      console.error('Customer not found:', { customerId, customer });
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Verify cart item exists and belongs to the customer
    
    let cartItem;
    try {
      cartItem = await sql`
        SELECT id, box_id, quantity FROM cart_items WHERE id = ${itemId} AND customer_id = ${customerId}
      `;
      console.log('Cart item query result:', cartItem);
    } catch (queryError) {
      console.error('Cart item query failed:', queryError);
      throw new Error('Database query failed');
    }
    const cartItemRows = Array.isArray(cartItem) ? cartItem : cartItem.rows || [];
    if (cartItemRows.length === 0) {
      console.error('Cart item not found:', { itemId, customerId });
      return res.status(404).json({ message: 'Cart item not found for this customer' });
    }

    // Check farmbox stock
    
    let farmbox;
    try {
      farmbox = await sql`
        SELECT maxquantity FROM farmboxes WHERE id = ${cartItemRows[0].box_id}
      `;
      
    } catch (queryError) {
      console.error('Farmbox query failed:', queryError);
      throw new Error('Database query failed');
    }
    const farmboxRows = Array.isArray(farmbox) ? farmbox : farmbox.rows || [];
    if (farmboxRows.length === 0) {
      console.error('Farmbox not found for box_id:', cartItemRows[0].box_id);
      return res.status(404).json({ message: 'Farmbox not found' });
    }
    if (farmboxRows[0].maxquantity < quantity) {
      console.error('Insufficient stock:', { box_id: cartItemRows[0].box_id, requested: quantity, available: farmboxRows[0].maxquantity });
      return res.status(400).json({ 
        message: `Insufficient stock for farmbox ID ${cartItemRows[0].box_id}`,
        details: `Requested quantity: ${quantity}, Available: ${farmboxRows[0].maxquantity}`
      });
    }

    // Update cart item quantity
   
    await sql`
      UPDATE cart_items
      SET quantity = ${quantity}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${itemId} AND customer_id = ${customerId}
    `;

    // Fetch updated cart items
    
    let updatedCartItems;
    try {
      updatedCartItems = await sql`
        SELECT 
          ci.id,
          ci.quantity,
          ci.price,
          ci.frequency,
          json_build_object('id', f.id, 'name', f.name) AS product
        FROM cart_items ci
        JOIN farmboxes f ON ci.box_id = f.id
        WHERE ci.customer_id = ${customerId}
      `;
      console.log('Updated cart items query result:', updatedCartItems);
    } catch (queryError) {
      console.error('Updated cart items query failed:', queryError);
      throw new Error('Database query failed');
    }
    const updatedCartItemRows = Array.isArray(updatedCartItems) ? updatedCartItems : updatedCartItems.rows || [];

    return res.status(200).json({
      customer_id: customerId,
      items: updatedCartItemRows.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        frequency: item.frequency,
        product: item.product,
      })),
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return res.status(500).json({ 
      message: 'Failed to update cart item quantity', 
      details: error.message 
    });
  }
}