import { create } from 'zustand';
import { getDBConnection } from '../database/db';

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string | null;
  is_active: number;
}

interface MenuState {
  items: MenuItem[];
  isLoading: boolean;
  loadItems: () => Promise<void>;
  addItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateItem: (id: number, item: Partial<MenuItem>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  items: [],
  isLoading: false,

  loadItems: async () => {
    set({ isLoading: true });
    try {
      const db = await getDBConnection();
      const results = await db.executeSql('SELECT * FROM menu_items ORDER BY category, name');
      const items: MenuItem[] = [];
      results.forEach(result => {
        for (let i = 0; i < result.rows.length; i++) {
          items.push(result.rows.item(i));
        }
      });
      set({ items, isLoading: false });
    } catch (error) {
      console.error('Failed to load menu items', error);
      set({ isLoading: false });
    }
  },

  addItem: async (item) => {
    try {
      const db = await getDBConnection();
      await db.executeSql(
        'INSERT INTO menu_items (name, price, category, is_active) VALUES (?, ?, ?, ?)',
        [item.name, item.price, item.category, item.is_active]
      );
      await get().loadItems();
    } catch (error) {
      console.error('Failed to add item', error);
    }
  },

  updateItem: async (id, item) => {
    try {
      const db = await getDBConnection();
      const updates: string[] = [];
      const values: any[] = [];
      
      Object.entries(item).forEach(([key, value]) => {
        updates.push(`${key} = ?`);
        values.push(value);
      });
      values.push(id);

      await db.executeSql(
        `UPDATE menu_items SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      await get().loadItems();
    } catch (error) {
      console.error('Failed to update item', error);
    }
  },

  deleteItem: async (id) => {
    try {
      const db = await getDBConnection();
      await db.executeSql('DELETE FROM menu_items WHERE id = ?', [id]);
      await get().loadItems();
    } catch (error) {
      console.error('Failed to delete item', error);
    }
  }
}));
