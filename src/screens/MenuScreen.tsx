import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, FAB, Card, IconButton, useTheme, Switch } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { useMenuStore, MenuItem } from '../store/menuStore';

export const MenuScreen = ({ navigation }: any) => {
  const { items, loadItems, updateItem, deleteItem } = useMenuStore();
  const theme = useTheme();

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = (id: number) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteItem(id) }
    ]);
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <Card style={styles.card}>
      <Card.Title 
        title={item.name}
        subtitle={`${item.category || 'No Category'} • ${item.price.toFixed(2)}`}
        right={(props) => (
          <View style={styles.actions}>
            <Switch 
              value={item.is_active === 1}
              onValueChange={(val) => updateItem(item.id, { is_active: val ? 1 : 0 })}
            />
            <IconButton icon="pencil" onPress={() => navigation.navigate('AddEditMenuItem', { item })} />
            <IconButton icon="delete" iconColor={theme.colors.error} onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlashList
        data={items}
        renderItem={renderItem}
        estimatedItemSize={80}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No menu items found. Add one!</Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => navigation.navigate('AddEditMenuItem')}
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  }
});
