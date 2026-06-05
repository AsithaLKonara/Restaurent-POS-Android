import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, PermissionsAndroid, Platform } from 'react-native';
import { Text, Button, Card, useTheme, ActivityIndicator } from 'react-native-paper';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import { connectPrinter, printTestReceipt } from '../services/printerService';
import { getDBConnection } from '../database/db';

export const PrinterSetupScreen = () => {
  const theme = useTheme();
  const [pairedDevices, setPairedDevices] = useState<any[]>([]);
  const [foundDs, setFoundDs] = useState<any[]>([]);
  const [bleOpend, setBleOpend] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [boundAddress, setBoundAddress] = useState<string>('');

  useEffect(() => {
    checkBluetoothPermissions();
    BluetoothManager.isBluetoothEnabled().then((enabled: boolean)=> {
      setBleOpend(enabled);
      if(enabled){
        scanDevices();
      }
    });
    
    // Load saved printer MAC from DB
    const loadSavedPrinter = async () => {
      const db = await getDBConnection();
      const result = await db.executeSql('SELECT printer_mac_address FROM settings WHERE id = 1');
      if (result[0].rows.length > 0) {
        setBoundAddress(result[0].rows.item(0).printer_mac_address || '');
      }
    };
    loadSavedPrinter();
  }, []);

  const checkBluetoothPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }
  };

  const scanDevices = () => {
    setLoading(true);
    BluetoothManager.enableBluetooth().then((r: any) => {
      setBleOpend(true);
      BluetoothManager.scanDevices()
        .then((s: any) => {
          let paired = s.paired || [];
          let found = s.found || [];
          try { paired = JSON.parse(paired); } catch (e) {}
          try { found = JSON.parse(found); } catch (e) {}
          
          setPairedDevices(paired);
          setFoundDs(found);
          setLoading(false);
        }, (er: any) => {
          setLoading(false);
          alert('error ' + JSON.stringify(er));
        });
    }, (err: any) => {
      alert(err);
      setLoading(false);
    });
  };

  const handleConnect = async (address: string) => {
    setLoading(true);
    const connected = await connectPrinter(address);
    setLoading(false);
    
    if (connected) {
      setBoundAddress(address);
      const db = await getDBConnection();
      await db.executeSql(
        'INSERT INTO settings (id, printer_mac_address) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET printer_mac_address = excluded.printer_mac_address',
        [address]
      );
      alert('Connected successfully!');
    } else {
      alert('Connection failed!');
    }
  };

  const renderDevice = ({ item }: { item: any }) => {
    const isConnected = item.address === boundAddress;
    return (
      <Card style={styles.deviceCard}>
        <Card.Title 
          title={item.name || 'Unknown Device'} 
          subtitle={item.address}
          right={() => (
            <Button 
              mode={isConnected ? "contained" : "outlined"}
              onPress={() => handleConnect(item.address)}
            >
              {isConnected ? 'Connected' : 'Connect'}
            </Button>
          )}
        />
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="titleLarge">Bluetooth State: {bleOpend ? 'ON' : 'OFF'}</Text>
        <Button mode="contained" onPress={scanDevices} loading={loading}>
          Scan Printers
        </Button>
      </View>

      <View style={styles.testSection}>
        <Button mode="contained-tonal" onPress={printTestReceipt} disabled={!boundAddress}>
          Print Test Receipt
        </Button>
      </View>

      <Text variant="titleMedium" style={styles.listTitle}>Paired Devices</Text>
      <FlatList
        data={pairedDevices}
        keyExtractor={(item) => item.address}
        renderItem={renderDevice}
        ListEmptyComponent={<Text style={styles.emptyText}>No paired devices</Text>}
      />

      <Text variant="titleMedium" style={styles.listTitle}>Discovered Devices</Text>
      <FlatList
        data={foundDs}
        keyExtractor={(item) => item.address}
        renderItem={renderDevice}
        ListEmptyComponent={
          loading ? <ActivityIndicator style={{marginTop: 20}} /> : <Text style={styles.emptyText}>No new devices found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  testSection: {
    marginBottom: 20,
  },
  listTitle: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  deviceCard: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
    color: 'gray',
  }
});
