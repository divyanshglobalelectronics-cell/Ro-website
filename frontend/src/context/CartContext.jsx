import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {//initializing cart from local storage
    try {
      const raw = localStorage.getItem('cart:v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart:v1', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.slug === product.slug);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      // console.log("product added",product);
      return [
        ...prev,
        {
          productId: product._id,
          description: product.description,
          slug: product.slug,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || '',
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (slug) => setItems((prev) => prev.filter((it) => it.slug !== slug));

  const updateQuantity = (slug, quantity) => {
    setItems((prev) => prev.map((it) => (it.slug === slug ? { ...it, quantity: Math.max(1, quantity) } : it)));
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((sum, it) => sum + it.price * it.quantity, 0), [items]);

  const value = { items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
