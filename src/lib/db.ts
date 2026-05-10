import Dexie, { type Table } from 'dexie';
import type { Invoice } from '@/types';

class JewelleryDB extends Dexie {
  invoices!: Table<Invoice, string>;

  constructor() {
    super('JewelleryBillingDB');
    this.version(1).stores({
      // Only indexed fields listed here; full object is stored automatically
      invoices: 'id, localId, customerName, createdAt, syncStatus',
    });
  }
}

// Singleton — safe to import anywhere in client components
let _db: JewelleryDB | null = null;

export function getDb(): JewelleryDB {
  if (!_db) {
    _db = new JewelleryDB();
  }
  return _db;
}
