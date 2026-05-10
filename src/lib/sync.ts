import type { SupabaseClient } from '@supabase/supabase-js';
import type { Invoice } from '@/types';
import { getDb } from './db';

function toSupabaseRow(inv: Invoice) {
  return {
    local_id:      inv.localId,
    invoice_number:inv.invoiceNumber,

    // Buyer
    buyer_name:    inv.buyerName   || inv.customerName   || '',
    buyer_phone:   inv.buyerPhone  || inv.customerPhone  || '',
    buyer_address: inv.buyerAddress || inv.customerAddress || '',
    buyer_pan:     inv.buyerPan    || inv.customerPan    || '',

    // Seller
    seller_name:   inv.sellerName    || '',
    seller_phone:  inv.sellerPhone   || '',
    seller_address:inv.sellerAddress || '',
    seller_pan:    inv.sellerPan     || '',

    // Items (stored as JSONB — pass array directly, not stringified)
    items:         inv.items ?? [],

    gold_rate:     inv.goldRate,
    gst_percent:   inv.gstPercent,

    // Amounts
    subtotal:      inv.subtotal,
    discount:      inv.discount,
    after_discount:inv.afterDiscount,
    gst_amount:    inv.gstAmount,
    total:         inv.total,
    round_off:     inv.roundOff,
    grand_total:   inv.grandTotal,

    // Shop snapshot
    shop_name:     inv.shopInfo.name,
    shop_address:  inv.shopInfo.address,
    shop_phone:    inv.shopInfo.phone,
    shop_gstin:    inv.shopInfo.gstin,

    created_at:    inv.createdAt,
    synced_at:     new Date().toISOString(),
  };
}

export async function flushPendingInvoices(supabase: SupabaseClient): Promise<void> {
  const db = getDb();
  const pending = await db.invoices
    .where('syncStatus')
    .equals('pending')
    .toArray();

  if (pending.length === 0) return;

  const rows = pending.map(toSupabaseRow);

  const { error } = await supabase
    .from('invoices')
    .upsert(rows, { onConflict: 'local_id', ignoreDuplicates: false });

  if (error) {
    await Promise.all(
      pending.map((inv) => db.invoices.update(inv.id, { syncStatus: 'error' })),
    );
    throw error;
  }

  await Promise.all(
    pending.map((inv) => db.invoices.update(inv.id, { syncStatus: 'synced' })),
  );
}
