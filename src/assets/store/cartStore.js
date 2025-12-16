import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
    (set, get) => ({
      cart: [],
      deliveryFee: 20,
      serviceFee: 10,
      setCart: (cart) => set({ cart }),
      addToCart: (item) => {
        const itemIndex = get().cart.findIndex(cartItem => cartItem.FoodMenuItemId === item.FoodMenuItemId);
        if (itemIndex !== -1) {
          const updatedCart = [...get().cart];
          updatedCart[itemIndex].quantity += 1;
          set({ cart: updatedCart });
        } else {
          set({ cart: [...get().cart, item] });
        }
      },
      removeFromCart: (itemId) => set({ cart: get().cart.filter(item => item.FoodMenuItemId !== itemId) }),
      clearCart: () => set({ cart: [] }),
      updateQuantity: (itemId, quantity) => set({ cart: quantity === 0 ? get().cart.filter(item => item.FoodMenuItemId !== itemId) : get().cart.map(item => item.FoodMenuItemId === itemId ? { ...item, quantity } : item) }),
      getTotalPrice: () => get().cart.reduce((total, item) => total + item.FoodMenuItemPrice * item.quantity, 0),
      getTotalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),
      setDeliveryFee: (deliveryFee) => set({ deliveryFee }),

    }),
  )
  
);