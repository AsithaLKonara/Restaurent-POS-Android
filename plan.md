# 🧾 PROJECT OVERVIEW

## Product Name (suggested)
**OfflinePOS Lite**

## Goal
A **fast, offline-first billing app** for small restaurants and shops that:
* Works without internet
* Runs on Android phones & tablets
* Supports Bluetooth thermal printing
* Handles only cash billing
* Provides basic sales reports

---

# 🧰 TECH STACK

* React Native (Bare Workflow)
* TypeScript
* Zustand (state management)
* SQLite (react-native-sqlite-storage)
* ESC/POS Bluetooth printer support
* React Native Paper (UI)
* React Navigation
* FlashList (performance)

---

# ⚙️ SYSTEM ARCHITECTURE

```
React Native App
   ↓
Zustand State Layer
   ↓
SQLite Local DB
   ↓
Bluetooth Printer Module
```

## Folder Structure
```
/src
  /screens
  /components
  /database
  /services
  /store
  /utils
  /assets
  /navigation
  /constants
```

---

# 📱 APP MODULES (FEATURES)

1. **🔐 AUTH**: PIN login, auto lock, change PIN.
2. **🍔 MENU**: Add/edit/delete items, category, active toggle.
3. **💳 BILLING (CORE)**: Tap-to-add items, qty controls, clear bill, auto total, cash calculation, change calculation.
4. **🖨️ PRINTING**: Bluetooth pairing, print bill, reprint last, test receipt.
5. **📊 ANALYTICS**: Daily/monthly sales, total bills, average value.
6. **🧾 BILL HISTORY**: View all bills, details, reprint.
7. **⚙️ SETTINGS**: Restaurant info, PIN settings, Printer config.

---

# 🎨 UI DESIGN SYSTEM

* Dark + light theme support
* Material 3 / premium POS style
* Large touch buttons (cashier friendly)
* Card-based UI
* Primary Color: Modern Blue/Green
* Billing Screen Layout: Category grid (left), cart (right), checkout (bottom).

---

# 🗄️ DATABASE DESIGN (SQLite)

* `menu_items`: id, name, price, category, is_active
* `bills`: id, bill_no, date_time, subtotal, discount, total, cash_received, change_amount
* `bill_items`: id, bill_id, item_name, qty, unit_price, line_total
* `settings`: id, restaurant_name, address, pin, printer_mac_address

---

# 🚀 GIT COMMIT PLAN

1. `chore: initial project setup with RN base structure`
2. `feat(auth): implement PIN login system`
3. `feat(menu): add CRUD for menu items`
4. `feat(billing): implement POS billing engine`
5. `feat(printer): integrate Bluetooth ESC/POS printing`
6. `feat(history): add bill history and reprint feature`
7. `feat(analytics): add offline revenue dashboard`
8. `ui: improve POS interface with modern design system`
9. `chore: finalize production-ready offline POS`

---

# ⚠️ OFFLINE STRATEGY

100% offline via local SQLite database. No cloud sync, no server dependency. Everything runs natively on the device.
