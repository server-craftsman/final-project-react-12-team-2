import React, { createContext, useContext, useState, useEffect } from "react";
import { CartService } from "../services/cart/cart.service";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cartItems: any[];
  updateCartItems: (items?: any[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { token } = useAuth();

  const updateCartItems = async (items?: any[]) => {
    if (items) {
      console.log("Updating cart items:", items);
      setCartItems(items);
      return;
    }
    if (!token) {
      console.log("No token found, skipping cart fetch");
      return;
    }

    try {
      const response = await CartService.getCartItems({
        searchCondition: {
          status: "new",
          is_delete: false
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      });
      const items = Array.isArray(response.data.data.pageData) ? response.data.data.pageData : [response.data.data.pageData];
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    if (token) {
      updateCartItems();
    } else {
      setCartItems([]); // Clear cart items when token is not present
    }
  }, [token]);

  return (
    <CartContext.Provider value={{ cartItems, updateCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};