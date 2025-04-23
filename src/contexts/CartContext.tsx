
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
          console.log("Cart loaded from localStorage:", parsedCart);
        } else {
          console.error("Cart data is not an array:", parsedCart);
          localStorage.removeItem('cart');
        }
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      localStorage.removeItem('cart');
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      console.log("Saving cart to localStorage:", cartItems);
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        const updatedItems = prevItems.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
        console.log("Updated cart after adding:", updatedItems);
        return updatedItems;
      }
      const newItems = [...prevItems, item];
      console.log("Updated cart after adding new item:", newItems);
      return newItems;
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      console.log("Updated cart after removing item:", updatedItems);
      return updatedItems;
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      console.log("Updated cart after changing quantity:", updatedItems);
      return updatedItems;
    });
  };

  const clearCart = () => {
    console.log("Clearing cart");
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getCartCount = () => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    console.log("Current cart count:", count);
    return count;
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart,
      getCartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
