import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, useTheme, Text, Switch } from 'react-native-paper';
import { useMenuStore, MenuItem } from '../store/menuStore';

export const AddEditMenuItemScreen = ({ navigation, route }: any) => {
  const item: MenuItem | undefined = route.params?.item;
  const { addItem, updateItem } = useMenuStore();
  const theme = useTheme();

  const [name, setName] = useState(item?.name || '');
  const [price, setPrice] = useState(item ? String(item.price) : '');
  const [category, setCategory] = useState(item?.category || '');
  const [isActive, setIsActive] = useState(item ? item.is_active === 1 : true);

  const handleSave = async () => {
    if (!name || !price) return;
    
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) return;

    if (item) {
      await updateItem(item.id, {
        name,
        price: parsedPrice,
        category,
        is_active: isActive ? 1 : 0
      });
    } else {
      await addItem({
        name,
        price: parsedPrice,
        category,
        is_active: isActive ? 1 : 0
      });
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        label="Item Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Category (Optional)"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
        mode="outlined"
      />

      <View style={styles.switchRow}>
        <Text variant="titleMedium">Active Status</Text>
        <Switch value={isActive} onValueChange={setIsActive} />
      </View>

      <Button 
        mode="contained" 
        onPress={handleSave} 
        style={styles.button}
        disabled={!name || !price}
      >
        {item ? 'Update Item' : 'Add Item'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  button: {
    paddingVertical: 8,
  }
});
