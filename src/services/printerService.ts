import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';

export interface PrintItem {
  name: string;
  qty: number;
  price: number;
}

export interface PrintBillData {
  billNo: string;
  date: string;
  items: PrintItem[];
  subtotal: number;
  cash: number;
  change: number;
  restaurantName?: string;
  address?: string;
}

export const connectPrinter = async (macAddress: string) => {
  try {
    await BluetoothManager.connect(macAddress);
    return true;
  } catch (error) {
    console.error('Failed to connect to printer:', error);
    return false;
  }
};

export const printTestReceipt = async () => {
  try {
    await BluetoothEscposPrinter.printerInit();
    await BluetoothEscposPrinter.printerLeftSpace(0);

    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
    await BluetoothEscposPrinter.printText('PRINTER TEST\n\r', { encoding: 'GBK', codepage: 0, widthtimes: 1, heigthtimes: 1, fonttype: 1 });
    await BluetoothEscposPrinter.printText('Connection Successful\n\r', {});
    await BluetoothEscposPrinter.printText('----------------------\n\r', {});
    await BluetoothEscposPrinter.printText('\n\r\n\r\n\r', {});
  } catch (error) {
    console.error('Test print failed:', error);
  }
};

export const printBill = async (data: PrintBillData) => {
  try {
    await BluetoothEscposPrinter.printerInit();
    await BluetoothEscposPrinter.printerLeftSpace(0);

    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
    await BluetoothEscposPrinter.printText(`${data.restaurantName || 'Offline POS'}\n\r`, { widthtimes: 1, heigthtimes: 1 });
    await BluetoothEscposPrinter.printText(`${data.address || 'Address goes here'}\n\r`, {});
    
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
    await BluetoothEscposPrinter.printText('--------------------------------\n\r', {});
    await BluetoothEscposPrinter.printText(`Bill No: ${data.billNo}\n\r`, {});
    await BluetoothEscposPrinter.printText(`Date: ${data.date}\n\r`, {});
    await BluetoothEscposPrinter.printText('--------------------------------\n\r', {});
    
    // Header
    await BluetoothEscposPrinter.printColumn(
      [16, 6, 10],
      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
      ['Item', 'Qty', 'Price'],
      {}
    );

    // Items
    for (const item of data.items) {
      await BluetoothEscposPrinter.printColumn(
        [16, 6, 10],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
        [item.name.substring(0, 16), String(item.qty), (item.price * item.qty).toFixed(2)],
        {}
      );
    }
    
    await BluetoothEscposPrinter.printText('--------------------------------\n\r', {});
    
    // Totals
    await BluetoothEscposPrinter.printColumn(
      [16, 16],
      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      ['Total', data.subtotal.toFixed(2)],
      {}
    );
    await BluetoothEscposPrinter.printColumn(
      [16, 16],
      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      ['Cash Received', data.cash.toFixed(2)],
      {}
    );
    await BluetoothEscposPrinter.printColumn(
      [16, 16],
      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      ['Change', data.change.toFixed(2)],
      {}
    );

    await BluetoothEscposPrinter.printText('\n\r', {});
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
    await BluetoothEscposPrinter.printText('Thank You!\n\r', {});
    await BluetoothEscposPrinter.printText('\n\r\n\r\n\r', {});

  } catch (error) {
    console.error('Print bill failed:', error);
  }
};
