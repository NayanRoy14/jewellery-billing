// ─── Enums ───────────────────────────────────────────────────────────────────

export type MakingChargeType = 'percentage' | 'fixed';
export type KaratType = 22 | 24;
export type SyncStatus = 'pending' | 'synced' | 'error';

// ─── Domain Models ────────────────────────────────────────────────────────────

export interface ShopInfo {
  id?: string;
  name: string;
  address: string;
  phone: string;
  gstin: string;
  logo?: string; // base64 data URL
}

export interface GoldRates {
  22: number;
  24: number;
}

export interface BillingItem {
  id: string;
  itemName: string;
  hsnCode: string;
  weightGrams: number | '';
  makingChargeType: MakingChargeType;
  makingChargeValue: number | '';
  hallmarkCharge: number | '';
}

export interface BillingInput {
  // Buyer (customer purchasing)
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerPan: string;
  // Seller (party selling)
  sellerName: string;
  sellerPhone: string;
  sellerAddress: string;
  sellerPan: string;
  // Items
  goldRate: number | '';
  items: BillingItem[];
  discount: number | '';
  gstPercent: number | '';
}

export interface BillingItemResult {
  goldPrice: number;
  makingCharges: number;
  hallmarkCharge: number;
  itemSubtotal: number;
}

export interface BillingResult {
  items: BillingItemResult[];
  subtotal: number;
  discount: number;
  afterDiscount: number;
  gstAmount: number;
  total: number;
  roundOff: number;
  grandTotal: number;
}

export interface InvoiceItem {
  itemName: string;
  hsnCode?: string;
  weightGrams: number;
  makingChargeType: MakingChargeType;
  makingChargeValue: number;
  hallmarkCharge: number;
  goldPrice: number;
  makingCharges: number;
  hallmarkChargeAmount: number;
  itemSubtotal: number;
}

export interface Invoice {
  id: string;
  localId: string;
  invoiceNumber: string;
  // Buyer
  buyerName: string;
  buyerPhone: string;
  buyerAddress?: string;
  buyerPan?: string;
  // Seller party
  sellerName?: string;
  sellerPhone?: string;
  sellerAddress?: string;
  sellerPan?: string;
  // Items
  goldRate: number;
  items: InvoiceItem[];
  gstPercent: number;
  // Computed totals
  subtotal: number;
  discount: number;
  afterDiscount: number;
  gstAmount: number;
  total: number;
  roundOff: number;
  grandTotal: number;
  // Meta
  shopInfo: ShopInfo;
  createdAt: string;
  syncStatus: SyncStatus;
  // Legacy compat (old invoices saved with customerName)
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerPan?: string;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface AppSettings {
  shopInfo: ShopInfo;
  goldRates: GoldRates;
  defaultGstPercent: number;
  defaultKarat: KaratType;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
