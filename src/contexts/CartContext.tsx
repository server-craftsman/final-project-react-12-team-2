import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartService } from "../services/cart/cart.service";
import { useAuth } from "./AuthContext";
import { CartStatusEnum } from "../models/prototype/Carts";
import { useDispatch } from "react-redux";
import { setCartCount } from "../app/redux/cartSlice";

interface CartContextType {
  cartItems: any[];
  updateCartItems: (status?: CartStatusEnum) => Promise<any[] | undefined>;
  updateCartStatus: (cartIds: string | string[], status: CartStatusEnum) => Promise<void>;
  deleteCartItem: (cartId: string) => Promise<void>;
  getNewCartCount: () => Promise<number>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { token } = useAuth();
  const dispatch = useDispatch();

  // Define a function to set cart count
  const setCartCountInStore = (count: number) => {
    dispatch(setCartCount(count));
  };

  const getNewCartCount = useCallback(async () => {
    const newCartCount = await CartService.getCartItems({
      searchCondition: {
        status: CartStatusEnum.new,
        is_delete: false
      },
      pageInfo: { pageNum: 1, pageSize: 50 }
    });
    const totalItems = newCartCount.data.data.pageInfo.totalItems;
    setCartCountInStore(totalItems);
    return totalItems;
  }, [dispatch]);

  const updateCartItems = useCallback(async (status?: CartStatusEnum) => {
    if (!token) {
      console.log("No token found, skipping cart fetch");
      return;
    }
    setCartItems([]);
    try {
      const response = await CartService.getCartItems({
        searchCondition: {
          status: status ?? CartStatusEnum.new,
          is_delete: false
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      });
      const items = Array.isArray(response.data.data.pageData) ? response.data.data.pageData : [response.data.data.pageData];
      setCartItems(items);
      getNewCartCount();
      return items;
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  }, [token, dispatch]);

  const updateCartStatus = useCallback(async (cartIds: string | string[], status: CartStatusEnum) => {
    try {
      const idsArray = Array.isArray(cartIds) ? cartIds : [cartIds];

      const itemsToUpdate = cartItems.filter((item) => idsArray.includes(item._id));
      if (itemsToUpdate.length > 0) {
        const items = itemsToUpdate.map((item) => ({ _id: item._id, cart_no: item.cart_no }));
        await CartService.updateCartStatus({ status, items });
        await updateCartItems(status);
      } else {
        console.error(`No cart items found for the provided IDs: ${idsArray.join(", ")}`);
      }
    } catch (error) {
      console.error("Error updating cart status:", error);
    }
  }, [cartItems, dispatch]);

  const deleteCartItem = useCallback(async (cartId: string) => {
    try {
      await CartService.deleteCart(cartId);
      await updateCartItems();
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  }, [cartItems, dispatch]);

  useEffect(() => {
    if (token) {
      updateCartItems();
    } else {
      setCartItems([]);
    }
  }, [token, updateCartItems]);

  return <CartContext.Provider value={{ cartItems, updateCartItems, updateCartStatus, deleteCartItem, getNewCartCount }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
