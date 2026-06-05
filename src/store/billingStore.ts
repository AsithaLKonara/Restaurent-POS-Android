import { create } from 'zustand';
import { getDBConnection } from '../database/db';
import { MenuItem } from './menuStore';

export interface CartItem extends MenuItem {
  qty: number;
}

interface BillingState {
  cart: CartItem[];
  subtotal: number;
  cashReceived: number;
  changeAmount: number;
  
  addToCart: (item: MenuItem) => void;
  incrementQty: (id: number) => void;
  decrementQty: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  setCashReceived: (amount: number) => void;
  saveBill: () => Promise<string | null>;
}

export const useBillingStore = create<BillingState>((set, get) => ({
  cart: [],
  subtotal: 0,
  cashReceived: 0,
  changeAmount: 0,

  addToCart: (item) => {
    const { cart } = get();
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      get().incrementQty(item.id);
    } else {
      const newCart = [...cart, { ...item, qty: 1 }];
      set({ 
        cart: newCart, 
        subtotal: get().subtotal + item.price,
        changeAmount: get().cashReceived - (get().subtotal + item.price)
      });
    }
  },

  incrementQty: (id) => {
    const { cart } = get();
    const newCart = cart.map(item => {
      if (item.id === id) {
        set({ subtotal: get().subtotal + item.price });
        return { ...item, qty: item.qty + 1 };
      }
      return item;
    });
    set({ 
      cart: newCart,
      changeAmount: get().cashReceived - get().subtotal
    });
  },

  decrementQty: (id) => {
    const { cart } = get();
    let removed = false;
    const newCart = cart.map(item => {
      if (item.id === id && item.qty > 1) {
        set({ subtotal: get().subtotal - item.price });
        return { ...item, qty: item.qty - 1 };
      }
      if (item.id === id && item.qty === 1) {
        removed = true;
      }
      return item;
    }).filter(item => item.id !== id || !removed);
    
    if (removed) {
      const removedItem = cart.find(c => c.id === id);
      if (removedItem) {
        set({ subtotal: get().subtotal - removedItem.price });
      }
    }
    
    set({ 
      cart: newCart,
      changeAmount: get().cashReceived - get().subtotal
    });
  },

  removeFromCart: (id) => {
    const { cart } = get();
    const removedItem = cart.find(c => c.id === id);
    if (removedItem) {
      set({ 
        cart: cart.filter(c => c.id !== id),
        subtotal: get().subtotal - (removedItem.price * removedItem.qty)
      });
      set({ changeAmount: get().cashReceived - get().subtotal });
    }
  },

  clearCart: () => set({ cart: [], subtotal: 0, cashReceived: 0, changeAmount: 0 }),

  setCashReceived: (amount) => {
    set({ 
      cashReceived: amount,
      changeAmount: amount - get().subtotal
    });
  },

  saveBill: async () => {
    const { cart, subtotal, cashReceived, changeAmount, clearCart } = get();
    if (cart.length === 0) return null;

    try {
      const db = await getDBConnection();
      
      // Generate Bill Number: B-YYYYMMDD-HHMMSS
      const now = new Date();
      const dateStr = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
      const billNo = `B-${dateStr}`;

      const insertBill = await db.executeSql(
        'INSERT INTO bills (bill_no, date_time, subtotal, discount, total, cash_received, change_amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [billNo, now.toISOString(), subtotal, 0, subtotal, cashReceived, changeAmount]
      );
      
      const billId = insertBill[0].insertId;

      for (const item of cart) {
        await db.executeSql(
          'INSERT INTO bill_items (bill_id, item_name, qty, unit_price, line_total) VALUES (?, ?, ?, ?, ?)',
          [billId, item.name, item.qty, item.price, item.price * item.qty]
        );
      }

      clearCart();
      return billNo;
    } catch (error) {
      console.error('Failed to save bill', error);
      return null;
    }
  }
}));
