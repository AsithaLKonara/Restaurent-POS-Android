import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, useTheme, Surface, Divider } from 'react-native-paper';
import { useHistoryStore, Bill } from '../store/historyStore';
import { printBill } from '../services/printerService';

export const BillDetailsScreen = ({ route, navigation }: any) => {
  const bill: Bill = route.params.bill;
  const { currentBillItems, loadBillItems } = useHistoryStore();
  const theme = useTheme();

  useEffect(() => {
    loadBillItems(bill.id);
  }, [bill.id]);

  const handleReprint = async () => {
    await printBill({
      billNo: bill.bill_no,
      date: new Date(bill.date_time).toLocaleString(),
      items: currentBillItems.map(i => ({ name: i.item_name, qty: i.qty, price: i.unit_price })),
      subtotal: bill.total,
      cash: bill.cash_received,
      change: bill.change_amount,
      restaurantName: 'OfflinePOS Lite'
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.receiptContainer} elevation={1}>
        <Text variant="headlineSmall" style={styles.centerText}>Receipt Summary</Text>
        <Text variant="bodyMedium" style={styles.centerText}>{bill.bill_no}</Text>
        <Text variant="bodySmall" style={styles.centerText}>
          {new Date(bill.date_time).toLocaleString()}
        </Text>
        
        <Divider style={styles.divider} />

        <View style={styles.tableHeader}>
          <Text style={{ flex: 2, fontWeight: 'bold' }}>Item</Text>
          <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>Qty</Text>
          <Text style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Total</Text>
        </View>

        {currentBillItems.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={{ flex: 2 }}>{item.item_name}</Text>
            <Text style={{ flex: 1, textAlign: 'center' }}>{item.qty}</Text>
            <Text style={{ flex: 1, textAlign: 'right' }}>{item.line_total.toFixed(2)}</Text>
          </View>
        ))}

        <Divider style={styles.divider} />

        <View style={styles.totalsRow}>
          <Text variant="titleMedium">Total Amount</Text>
          <Text variant="titleMedium">{bill.total.toFixed(2)}</Text>
        </View>
        <View style={styles.totalsRow}>
          <Text variant="bodyMedium">Cash Received</Text>
          <Text variant="bodyMedium">{bill.cash_received.toFixed(2)}</Text>
        </View>
        <View style={styles.totalsRow}>
          <Text variant="bodyMedium">Change</Text>
          <Text variant="bodyMedium">{bill.change_amount.toFixed(2)}</Text>
        </View>
      </Surface>

      <Button 
        mode="contained" 
        icon="printer" 
        onPress={handleReprint}
        style={styles.printBtn}
      >
        Reprint Bill
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  receiptContainer: {
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  centerText: {
    textAlign: 'center',
    marginBottom: 4,
  },
  divider: {
    marginVertical: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  printBtn: {
    marginBottom: 40,
    paddingVertical: 8,
  }
});
