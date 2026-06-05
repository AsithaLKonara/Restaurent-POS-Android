import { create } from 'zustand';
import { getDBConnection } from '../database/db';

interface AnalyticsState {
  todayRevenue: number;
  monthlyRevenue: number;
  totalBills: number;
  averageBillValue: number;
  isLoading: boolean;
  loadAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  todayRevenue: 0,
  monthlyRevenue: 0,
  totalBills: 0,
  averageBillValue: 0,
  isLoading: false,

  loadAnalytics: async () => {
    set({ isLoading: true });
    try {
      const db = await getDBConnection();
      
      const now = new Date();
      // YYYY-MM-DD format for SQLite simple comparison
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Today Revenue
      const todayRes = await db.executeSql(
        'SELECT SUM(total) as rev FROM bills WHERE date_time >= ?', 
        [todayStart]
      );
      const todayRevenue = todayRes[0].rows.item(0).rev || 0;

      // Monthly Revenue
      const monthRes = await db.executeSql(
        'SELECT SUM(total) as rev FROM bills WHERE date_time >= ?', 
        [monthStart]
      );
      const monthlyRevenue = monthRes[0].rows.item(0).rev || 0;

      // Total Bills & Average
      const totalRes = await db.executeSql(
        'SELECT COUNT(*) as count, AVG(total) as avg FROM bills'
      );
      const totalBills = totalRes[0].rows.item(0).count || 0;
      const averageBillValue = totalRes[0].rows.item(0).avg || 0;

      set({
        todayRevenue,
        monthlyRevenue,
        totalBills,
        averageBillValue,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load analytics', error);
      set({ isLoading: false });
    }
  }
}));
