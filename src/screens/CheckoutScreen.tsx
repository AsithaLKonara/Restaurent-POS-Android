import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, Surface } from 'react-native-paper';
import { useBillingStore } from '../store/billingStore';
import { printBill } from '../services/printerService';

export const CheckoutScreen = ({ navigation }: any) => {
  const { subtotal, cashReceived, changeAmount, setCashReceived, saveBill } = useBillingStore();
  const theme = useTheme();
  const [cashInput, setCashInput] = useState('');

  useEffect(() => {
    const val = parseFloat(cashInput);
    if (!isNaN(val)) {
      setCashReceived(val);
    } else {
      setCashReceived(0);
    }
  }, [cashInput]);

  const handleCheckout = async () => {
    if (cashReceived < subtotal) return;
    
    // Save current cart data for printing before clearCart is called in saveBill
    const { cart } = useBillingStore.getState();
    const currentSubtotal = subtotal;
    const currentCash = cashReceived;
    const currentChange = changeAmount;
    
    const billNo = await saveBill();
    if (billNo) {
      // Trigger Printer
      await printBill({
        billNo,
        date: new Date().toLocaleString(),
        items: cart,
        subtotal: currentSubtotal,
        cash: currentCash,
        change: currentChange,
        restaurantName: 'OfflinePOS Lite'
      });
      
      navigation.navigate('MainTabs', { screen: 'Billing' });
    }
  };

  const isCashSufficient = cashReceived >= subtotal;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.summaryCard} elevation={2}>
        <View style={styles.row}>
          <Text variant="titleLarge">Total Amount</Text>
          <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
            {subtotal.toFixed(2)}
          </Text>
        </View>
      </Surface>

      <TextInput
        label="Cash Received"
        value={cashInput}
        onChangeText={setCashInput}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        autoFocus
      />

      {/* Quick Cash Buttons */}
      <View style={styles.quickCashContainer}>
        {[500, 1000, 2000, 5000].map(amt => (
          <Button 
            key={amt} 
            mode="outlined" 
            style={styles.quickCashBtn}
            onPress={() => setCashInput(String(amt))}
          >
            +{amt}
          </Button>
        ))}
      </View>

      <Surface style={styles.summaryCard} elevation={1}>
        <View style={styles.row}>
          <Text variant="titleLarge">Change Amount</Text>
          <Text 
            variant="headlineMedium" 
            style={{ color: changeAmount >= 0 ? theme.colors.primary : theme.colors.error }}
          >
            {changeAmount.toFixed(2)}
          </Text>
        </View>
      </Surface>

      <Button
        mode="contained"
        onPress={handleCheckout}
        disabled={!isCashSufficient}
        style={styles.checkoutBtn}
        contentStyle={{ paddingVertical: 12 }}
      >
        Complete Transaction
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    marginBottom: 16,
    fontSize: 24,
  },
  quickCashContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickCashBtn: {
    flex: 1,
    marginHorizontal: 4,
  },
  checkoutBtn: {
    marginTop: 20,
  }
});
