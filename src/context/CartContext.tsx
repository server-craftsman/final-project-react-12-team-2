import React, { createContext, useState, ReactNode, useContext } from "react";
import { Carts } from "../models/prototype/Carts";

export interface CartItem extends Carts {
  title: string;
  discountedPrice: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Carts) => void;
  removeFromCart: (id: string) => void;
}

const defaultCartContext: CartContextType = {
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {}
};

export const CartContext = createContext<CartContextType>(defaultCartContext);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Carts) => {
    const cartItem: CartItem = {
      ...item,
      title: item.cart_no,
      discountedPrice: item.price_paid
    };
    setCartItems((prevItems) => [...prevItems, cartItem]);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
