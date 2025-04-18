"use client";

export const checkAuthStatus = async (setIsLoggedIn, setUserData, setUserOrder, setUserCart) => {
  try {
    const response = await fetch('/api/farmboxes/check', {
      method: 'GET',
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      setIsLoggedIn(true);
      setUserData(data.user);
      setUserOrder(data.orders);
      setUserCart(data.cart);
    } else {
      setIsLoggedIn(false);
      setUserData(null);
      setUserOrder(null);
      setUserCart(null);
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
  }
};

export const handleLogout = async (setIsLoggedIn, setUserData) => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });

    if (response.ok) {
      setIsLoggedIn(false);
      setUserData(null);
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const toggleProfilePopup = (setShowProfilePopup, showProfilePopup) => {
  setShowProfilePopup(!showProfilePopup);
};

export const toggleMyOrders = (setShowMyOrders, showMyOrders, userOrder) => {
  setShowMyOrders(!showMyOrders);
  console.log(userOrder);
};

export const toggleMyCart = (setShowMyCart, showMyCart, userCart) => {
  setShowMyCart(!showMyCart);
  console.log(userCart);
};

export const toggleMobileMenu = (setMobileMenuOpen, isMobileMenuOpen) => {
  setMobileMenuOpen(!isMobileMenuOpen);
};

export const closeMobileMenu = (setMobileMenuOpen) => {
  setMobileMenuOpen(false);
};

export const toggleWhyFarmbox = (setWhyFarmboxOpen, isWhyFarmboxOpen) => {
  setWhyFarmboxOpen(!isWhyFarmboxOpen);
};