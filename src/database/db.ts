import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase;

export const getDBConnection = async () => {
  if (db) return db;
  db = await SQLite.openDatabase({ name: 'pos.db', location: 'default' });
  return db;
};

export const initDatabase = async () => {
  const db = await getDBConnection();

  const createMenuItemsTable = `
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT,
      is_active INTEGER DEFAULT 1
    );
  `;

  const createBillsTable = `
    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_no TEXT NOT NULL,
      date_time TEXT NOT NULL,
      subtotal REAL,
      discount REAL,
      total REAL NOT NULL,
      cash_received REAL NOT NULL,
      change_amount REAL NOT NULL
    );
  `;

  const createBillItemsTable = `
    CREATE TABLE IF NOT EXISTS bill_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      qty INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      line_total REAL NOT NULL,
      FOREIGN KEY (bill_id) REFERENCES bills (id) ON DELETE CASCADE
    );
  `;

  const createSettingsTable = `
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      restaurant_name TEXT,
      address TEXT,
      pin TEXT,
      printer_mac_address TEXT
    );
  `;

  await db.executeSql(createMenuItemsTable);
  await db.executeSql(createBillsTable);
  await db.executeSql(createBillItemsTable);
  await db.executeSql(createSettingsTable);
  
  // Enforce foreign keys
  await db.executeSql('PRAGMA foreign_keys = ON;');
};
