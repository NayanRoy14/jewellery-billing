'use client';

import { useCallback } from 'react';
import type { Invoice } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';

function getBuyerName(inv: Invoice)    { return inv.buyerName    || inv.customerName    || ''; }
function getBuyerPhone(inv: Invoice)   { return inv.buyerPhone   || inv.customerPhone   || ''; }
function getBuyerAddress(inv: Invoice) { return inv.buyerAddress || inv.customerAddress || ''; }
function getBuyerPan(inv: Invoice)     { return inv.buyerPan     || inv.customerPan     || ''; }

function buildWhatsAppText(invoice: Invoice): string {
  const lines: string[] = [];

  // ── Shop header ────────────────────────────────────────────────────────────
  lines.push(`*${invoice.shopInfo.name}*`);
  if (invoice.shopInfo.address) lines.push(invoice.shopInfo.address);
  if (invoice.shopInfo.phone)   lines.push(`Ph: ${invoice.shopInfo.phone}`);
  if (invoice.shopInfo.gstin)   lines.push(`GSTIN: ${invoice.shopInfo.gstin}`);
  lines.push('');

  // ── Invoice meta ───────────────────────────────────────────────────────────
  lines.push(`Invoice No: ${invoice.invoiceNumber}`);
  lines.push(`Date: ${formatDateTime(invoice.createdAt)}`);
  lines.push('');

  // ── Buyer ──────────────────────────────────────────────────────────────────
  const buyerName = getBuyerName(invoice);
  if (buyerName) {
    lines.push('*Buyer*');
    lines.push(`Name: ${buyerName}`);
    const phone = getBuyerPhone(invoice);
    if (phone)   lines.push(`Phone: ${phone}`);
    const addr = getBuyerAddress(invoice);
    if (addr)    lines.push(`Address: ${addr}`);
    const pan = getBuyerPan(invoice);
    if (pan)     lines.push(`PAN: ${pan}`);
    lines.push('');
  }

  // ── Seller ─────────────────────────────────────────────────────────────────
  if (invoice.sellerName) {
    lines.push('*Seller*');
    lines.push(`Name: ${invoice.sellerName}`);
    if (invoice.sellerPhone)   lines.push(`Phone: ${invoice.sellerPhone}`);
    if (invoice.sellerAddress) lines.push(`Address: ${invoice.sellerAddress}`);
    if (invoice.sellerPan)     lines.push(`PAN: ${invoice.sellerPan}`);
    lines.push('');
  }

  // ── Items ──────────────────────────────────────────────────────────────────
  const items = invoice.items ?? [];
  lines.push('*Item Details*');
  lines.push(`Gold Rate: ${formatCurrency(invoice.goldRate)}/g`);
  items.forEach((item, i) => {
    if (items.length > 1) lines.push(`\n_Item ${i + 1}: ${item.itemName || 'Gold Item'}_`);
    else                  lines.push(`Item: ${item.itemName || 'Gold Item'}`);
    if (item.hsnCode) lines.push(`HSN Code: ${item.hsnCode}`);
    lines.push(`Weight: ${item.weightGrams.toFixed(3)} g`);

    const makingLabel =
      item.makingChargeType === 'percentage'
        ? `Labour (${item.makingChargeValue}%):`
        : 'Labour Charges:';
    lines.push(`Gold Price:    ${formatCurrency(item.goldPrice)}`);
    lines.push(`${makingLabel}  ${formatCurrency(item.makingCharges)}`);
    if (item.hallmarkChargeAmount > 0) {
      lines.push(`Hallmark:      ${formatCurrency(item.hallmarkChargeAmount)}`);
    }
  });
  lines.push('');

  // ── Price breakdown ────────────────────────────────────────────────────────
  lines.push('*Price Breakdown*');
  lines.push(`Subtotal:         ${formatCurrency(invoice.subtotal)}`);
  if (invoice.discount > 0) {
    lines.push(`Discount:        -${formatCurrency(invoice.discount)}`);
    lines.push(`After Discount:   ${formatCurrency(invoice.afterDiscount)}`);
  }
  lines.push(`GST (${invoice.gstPercent}%):         ${formatCurrency(invoice.gstAmount)}`);
  if (invoice.roundOff !== 0) {
    lines.push(`Round Off:        ${formatCurrency(invoice.roundOff)}`);
  }
  lines.push('');
  lines.push(`*Grand Total: ${formatCurrency(invoice.grandTotal)}*`);
  lines.push('');
  lines.push('Thank you for your purchase! 🙏');

  return lines.join('\n');
}

export function useWhatsApp() {
  const shareWhatsApp = useCallback((invoice: Invoice) => {
    const text = buildWhatsAppText(invoice);
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const copyText = useCallback(async (invoice: Invoice): Promise<boolean> => {
    const text = buildWhatsAppText(invoice);
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { shareWhatsApp, copyText };
}
