import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { useAnalyticsStore } from '../store/analyticsStore';

export const DashboardScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { 
    todayRevenue, 
    monthlyRevenue, 
    totalBills, 
    averageBillValue, 
    isLoading, 
    loadAnalytics 
  } = useAnalyticsStore();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAnalytics();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadAnalytics} />}
    >
      <View style={styles.grid}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Today's Revenue</Text>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
              {todayRevenue.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">This Month</Text>
            <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
              {monthlyRevenue.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Total Bills</Text>
            <Text variant="headlineMedium">{totalBills}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Average Bill</Text>
            <Text variant="headlineMedium">{averageBillValue.toFixed(2)}</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
  }
});
