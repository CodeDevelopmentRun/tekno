import React, { createContext, useState, useEffect, useContext } from "react";
import { CartAPI } from "../api/endpoints";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useContext(AuthContext) || {};

  useEffect(() => {
    if (user) loadCart();
    else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [user]);

  const loadCart = async () => {
    try {
      const response = await CartAPI.get();
      const items = response.data.data || [];
      setCartItems(items);
      calculateCartCount(items);
    } catch (error) {
      console.error("Cart load error:", error);
    }
  };

  const calculateCartCount = (items) => {
    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  };

  // ✅ variant parametresi eklendi
  const addToCart = async (product, variant = null, quantity = 1) => {
    try {
      await CartAPI.add(
        product._id,
        quantity,
        variant ? { color: variant.color, colorCode: variant.colorCode } : null,
      );
      await loadCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Sepete eklenemedi",
      };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await CartAPI.update(itemId, quantity);
      await loadCart();
    } catch (error) {
      console.error("Update quantity error:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await CartAPI.remove(itemId);
      await loadCart();
    } catch (error) {
      console.error("Remove from cart error:", error);
    }
  };

  const clearCart = async () => {
    try {
      await CartAPI.clear();
      setCartItems([]);
      setCartCount(0);
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
