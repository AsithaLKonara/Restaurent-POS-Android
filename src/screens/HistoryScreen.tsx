import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { useHistoryStore, Bill } from '../store/historyStore';

export const HistoryScreen = ({ navigation }: any) => {
  const { bills, loadBills } = useHistoryStore();
  const theme = useTheme();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadBills();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: Bill }) => {
    const dateStr = new Date(item.date_time).toLocaleString();
    return (
      <TouchableOpacity onPress={() => navigation.navigate('BillDetails', { bill: item })}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View>
              <Text variant="titleMedium">{item.bill_no}</Text>
              <Text variant="bodySmall" style={{ color: 'gray' }}>{dateStr}</Text>
            </View>
            <View style={styles.totalContainer}>
              <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
                {item.total.toFixed(2)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlashList
        data={bills}
        renderItem={renderItem}
        estimatedItemSize={80}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No past bills found.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  }
});
