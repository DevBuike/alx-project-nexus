import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  id: number;
  name: string;
  primary_image: {
    image_url: string;
    alt_text: string;
  };
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: any) => void; 
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [messageText, setMessageText] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setMessageText(msg);
    const timer = setTimeout(() => setMessageText(null), 2000);
    return () => clearTimeout(timer);
  };

  
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const addToCart = (item: any) => {
    showMessage("Item added to cart");

    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      
      const priceAsNumber = parseFloat(item.price.replace(/[^\d.]/g, ""));

      return [...prev, { 
          ...item, 
          price: priceAsNumber,
          quantity: 1 
      }];
    });
  };

  const removeFromCart = (id: number) => {
    showMessage("Item removed from cart");
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    showMessage("Cart cleared!");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
      {messageText && (
        <div className="w-[220px] px-5 py-2 bg-white border border-gray-300 rounded-lg shadow-md fixed top-3 right-4 z-99">
          <p className="text-black">{messageText}</p>
        </div>
      )}
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