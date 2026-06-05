import { create } from 'zustand';
import { getDBConnection } from '../database/db';

export interface Bill {
  id: number;
  bill_no: string;
  date_time: string;
  subtotal: number;
  discount: number;
  total: number;
  cash_received: number;
  change_amount: number;
}

export interface BillItem {
  id: number;
  bill_id: number;
  item_name: string;
  qty: number;
  unit_price: number;
  line_total: number;
}

interface HistoryState {
  bills: Bill[];
  currentBillItems: BillItem[];
  isLoading: boolean;
  loadBills: () => Promise<void>;
  loadBillItems: (billId: number) => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  bills: [],
  currentBillItems: [],
  isLoading: false,

  loadBills: async () => {
    set({ isLoading: true });
    try {
      const db = await getDBConnection();
      const results = await db.executeSql('SELECT * FROM bills ORDER BY id DESC');
      const bills: Bill[] = [];
      results.forEach(result => {
        for (let i = 0; i < result.rows.length; i++) {
          bills.push(result.rows.item(i));
        }
      });
      set({ bills, isLoading: false });
    } catch (error) {
      console.error('Failed to load bills', error);
      set({ isLoading: false });
    }
  },

  loadBillItems: async (billId: number) => {
    set({ isLoading: true });
    try {
      const db = await getDBConnection();
      const results = await db.executeSql('SELECT * FROM bill_items WHERE bill_id = ?', [billId]);
      const items: BillItem[] = [];
      results.forEach(result => {
        for (let i = 0; i < result.rows.length; i++) {
          items.push(result.rows.item(i));
        }
      });
      set({ currentBillItems: items, isLoading: false });
    } catch (error) {
      console.error('Failed to load bill items', error);
      set({ isLoading: false });
    }
  }
}));
