export const updateCartItemQuantity = async (customerId, itemId, quantity) => {
  try {
    if (!customerId || !itemId || quantity < 1) {
      throw new Error('Invalid input: customerId, itemId, and quantity (minimum 1) are required');
    }

    console.log('Sending update request:', { customerId, itemId, quantity });

    const response = await fetch('/api/auth/cartupd', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        itemId,
        quantity,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Update cart error response:', errorData);
      throw new Error(errorData.message || 'Failed to update cart item quantity');
    }

    return await response.json();
  } catch (error) {
    console.error('Update cart item quantity error:', error);
    throw error;
  }
};

export const placeOrder = async (customerId, cartItems, totalAmount, onProgress) => {
  try {
    if (!customerId || !cartItems || !totalAmount || !Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('Invalid input: customerId, items (non-empty array), and totalAmount are required');
    }

    // Notify progress - starting
    if (onProgress) onProgress({ status: 'processing', progress: 0 });

    // Ensure totalAmount is a number (integer)
    const parsedTotalAmount = parseFloat(totalAmount);
    if (isNaN(parsedTotalAmount) || parsedTotalAmount < 0) {
      throw new Error('Invalid totalAmount: must be a valid non-negative number');
    }
    const integerTotalAmount = Math.floor(parsedTotalAmount);

    console.log('Sending place order request:', { customerId, cartItems, totalAmount: integerTotalAmount });

    // Notify progress - request being prepared
    if (onProgress) onProgress({ status: 'processing', progress: 30 });

    const response = await fetch('/api/auth/placeorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        items: cartItems,
        totalAmount: integerTotalAmount,
      }),
      credentials: 'include',
    });

    // Notify progress - request sent, waiting for response
    if (onProgress) onProgress({ status: 'processing', progress: 70 });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Place order error response:', errorData);
      throw new Error(errorData.message || 'Failed to place order');
    }

    const result = await response.json();

    // Notify progress - complete
    if (onProgress) onProgress({ status: 'complete', progress: 100 });

    return result;
  } catch (error) {
    console.error('Place order error:', error);
    // Notify progress - error
    if (onProgress) onProgress({ status: 'error', progress: 0, error });
    throw error;
  }
};