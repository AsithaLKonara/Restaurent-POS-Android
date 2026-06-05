import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Text, Card, Button, useTheme, IconButton, Divider } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { useMenuStore, MenuItem } from '../store/menuStore';
import { useBillingStore, CartItem } from '../store/billingStore';

export const BillingScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  const theme = useTheme();

  const { items: menuItems, loadItems } = useMenuStore();
  const { 
    cart, 
    subtotal, 
    addToCart, 
    incrementQty, 
    decrementQty, 
    clearCart 
  } = useBillingStore();

  useEffect(() => {
    loadItems();
  }, []);

  const activeItems = menuItems.filter(i => i.is_active === 1);

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity onPress={() => addToCart(item)} style={styles.menuItemCard}>
      <Card style={{ backgroundColor: theme.colors.surfaceVariant }}>
        <Card.Content style={styles.menuItemContent}>
          <Text variant="titleMedium" numberOfLines={2}>{item.name}</Text>
          <Text variant="titleMedium" style={{ color: theme.colors.primary }}>{item.price.toFixed(2)}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={{ flex: 1 }}>
        <Text variant="bodyLarge">{item.name}</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
          {(item.price * item.qty).toFixed(2)}
        </Text>
      </View>
      <View style={styles.qtyContainer}>
        <IconButton icon="minus" size={20} onPress={() => decrementQty(item.id)} />
        <Text variant="titleMedium">{item.qty}</Text>
        <IconButton icon="plus" size={20} onPress={() => incrementQty(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { flexDirection: isTablet ? 'row' : 'column', backgroundColor: theme.colors.background }]}>
      
      {/* LEFT PANEL: Menu Items Grid */}
      <View style={[styles.menuPanel, { flex: isTablet ? 2 : 1 }]}>
        <Text variant="headlineSmall" style={styles.panelTitle}>Menu</Text>
        <FlashList
          data={activeItems}
          renderItem={renderMenuItem}
          estimatedItemSize={100}
          numColumns={isTablet ? 3 : 2}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* RIGHT/BOTTOM PANEL: Cart */}
      <View style={[styles.cartPanel, { flex: isTablet ? 1 : 1, borderLeftWidth: isTablet ? 1 : 0, borderTopWidth: isTablet ? 0 : 1, borderColor: theme.colors.surfaceVariant }]}>
        <View style={styles.cartHeader}>
          <Text variant="headlineSmall">Current Bill</Text>
          <IconButton icon="delete-sweep" iconColor={theme.colors.error} onPress={clearCart} disabled={cart.length === 0} />
        </View>

        <View style={styles.cartListContainer}>
          <FlashList
            data={cart}
            renderItem={renderCartItem}
            estimatedItemSize={60}
          />
        </View>

        <Divider style={{ marginVertical: 10 }} />
        
        <View style={styles.totalsContainer}>
          <Text variant="headlineMedium">Total: {subtotal.toFixed(2)}</Text>
          <Button 
            mode="contained" 
            style={styles.checkoutBtn} 
            contentStyle={{ paddingVertical: 8 }}
            disabled={cart.length === 0}
            onPress={() => navigation.navigate('Checkout')}
          >
            Checkout
          </Button>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuPanel: {
    padding: 10,
  },
  panelTitle: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  menuItemCard: {
    flex: 1,
    margin: 5,
  },
  menuItemContent: {
    height: 100,
    justifyContent: 'space-between',
  },
  cartPanel: {
    padding: 10,
    backgroundColor: '#fff',
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cartListContainer: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalsContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  checkoutBtn: {
    marginTop: 15,
  }
});
