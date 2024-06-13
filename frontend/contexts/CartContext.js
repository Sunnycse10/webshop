// context/CartContext.js
import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Initialize cart count from local storage or API call if needed
    const savedCartCount = parseInt(localStorage.getItem('cartCount')) || 0;
    setCartCount(savedCartCount);
  }, []);

  useEffect(() => {
    // Save cart count to local storage
    localStorage.setItem('cartCount', cartCount);
  }, [cartCount]);

  const resetCartCount = () => {
    setCartCount(0);
    localStorage.removeItem('cartCount');
  };

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount, resetCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
