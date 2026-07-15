import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [tableNumber, setTableNumber] = useState(() => {
    return localStorage.getItem('tableNumber') || null;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (tableNumber) localStorage.setItem('tableNumber', tableNumber);
  }, [tableNumber]);

  const addItem = (food, customization = {}) => {
    const {
      quantity = 1,
      removedIngredients = [],
      addedIngredients = [],
      specialInstructions = '',
    } = customization;

    const extrasTotal = addedIngredients.reduce((sum, e) => sum + (e.price || 0), 0);
    const unitPrice = food.price + extrasTotal;

    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.foodId === food._id &&
          JSON.stringify(item.removedIngredients) === JSON.stringify(removedIngredients) &&
          JSON.stringify(item.addedIngredients) === JSON.stringify(addedIngredients) &&
          item.specialInstructions === specialInstructions
      );

      if (existing) {
        return prev.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * unitPrice }
            : item
        );
      }

      return [
        ...prev,
        {
          foodId: food._id,
          foodName: food.name,
          foodImage: food.image,
          unitPrice: food.price,
          quantity,
          removedIngredients,
          addedIngredients,
          specialInstructions,
          subtotal: unitPrice * quantity,
        },
      ];
    });
  };

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return removeItem(index);
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const extrasTotal = item.addedIngredients.reduce((sum, e) => sum + (e.price || 0), 0);
        const unitPrice = item.unitPrice + extrasTotal;
        return { ...item, quantity, subtotal: unitPrice * quantity };
      })
    );
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        tableNumber,
        setTableNumber,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
