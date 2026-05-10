'use client';

import { useState } from 'react';
import type { Invoice, InvoiceItem, ShopInfo } from '@/types';
import { useBillingCalculator } from '@/hooks/useBillingCalculator';
import { useInvoices } from '@/hooks/useInvoices';
import { useToast } from '@/components/ui/Toast';
import { generateId, generateInvoiceNumber } from '@/lib/utils';
import { ItemInputRow } from './ItemInputRow';
import { BillingItemCard } from './BillingItemCard';
import { RateInputRow } from './RateInputRow';
import { GstRow } from './GstRow';
import { TotalsCard } from './TotalsCard';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { InvoiceActions } from '@/components/invoice/InvoiceActions';
import { Button } from '@/components/ui/Button';
import { NumericInput } from '@/components/ui/NumericInput';

interface Props {
  shopInfo: ShopInfo;
  goldRates: { 22: number; 24: number };
  defaultGst: number;
}

export function BillingForm({ shopInfo, goldRates, defaultGst }: Props) {
  const { showToast } = useToast();
  const { saveInvoice, todayCount } = useInvoices();
  const {
    input, result, isValid,
    setField, updateItem, setItemMakingChargeType, addItem, removeItem, reset,
  } = useBillingCalculator(goldRates[22] || undefined, defaultGst);

  const [savedInvoice, setSavedInvoice] = useState<Invoice | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeParty, setActiveParty] = useState<'buyer' | 'seller'>('buyer');

  async function handleSave() {
    if (!result || !isValid) return;
    setSaving(true);
    try {
      const count = await todayCount();
      const invoiceNumber = await generateInvoiceNumber(count);
      const id = generateId();

      const invoiceItems: InvoiceItem[] = input.items.map((item, i) => {
        const r = result.items[i];
        return {
          itemName:             item.itemName || 'Gold Item',
          hsnCode:              item.hsnCode || undefined,
          weightGrams:          item.weightGrams === '' ? 0 : (item.weightGrams as number),
          makingChargeType:     item.makingChargeType,
          makingChargeValue:    item.makingChargeValue === '' ? 0 : (item.makingChargeValue as number),
          hallmarkCharge:       item.hallmarkCharge === '' ? 0 : (item.hallmarkCharge as number),
          goldPrice:            r?.goldPrice ?? 0,
          makingCharges:        r?.makingCharges ?? 0,
          hallmarkChargeAmount: r?.hallmarkCharge ?? 0,
          itemSubtotal:         r?.itemSubtotal ?? 0,
        };
      });

      const invoice: Invoice = {
        id,
        localId: id,
        invoiceNumber,
        buyerName:    activeParty === 'buyer' ? input.buyerName : '',
        buyerPhone:   activeParty === 'buyer' ? input.buyerPhone : '',
        buyerAddress: activeParty === 'buyer' ? (input.buyerAddress || undefined) : undefined,
        buyerPan:     activeParty === 'buyer' ? (input.buyerPan || undefined) : undefined,
        sellerName:   activeParty === 'seller' ? (input.sellerName || undefined) : undefined,
        sellerPhone:  activeParty === 'seller' ? (input.sellerPhone || undefined) : undefined,
        sellerAddress:activeParty === 'seller' ? (input.sellerAddress || undefined) : undefined,
        sellerPan:    activeParty === 'seller' ? (input.sellerPan || undefined) : undefined,
        goldRate:     input.goldRate as number,
        items:        invoiceItems,
        gstPercent:   input.gstPercent as number,
        subtotal:     result.subtotal,
        discount:     result.discount,
        afterDiscount:result.afterDiscount,
        gstAmount:    result.gstAmount,
        total:        result.total,
        roundOff:     result.roundOff,
        grandTotal:   result.grandTotal,
        shopInfo,
        createdAt:    new Date().toISOString(),
        syncStatus:   'pending',
      };
      await saveInvoice(invoice);
      setSavedInvoice(invoice);
      showToast('Invoice saved!', 'success');
    } catch {
      showToast('Failed to save invoice', 'error');
    } finally {
      setSaving(false);
    }
  }

  function handleNewBill() {
    setSavedInvoice(null);
    reset();
  }

  if (savedInvoice) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Invoice Generated</h2>
          <Button variant="ghost" size="sm" onClick={handleNewBill}>+ New Bill</Button>
        </div>
        <InvoicePreview invoice={savedInvoice} />
        <InvoiceActions invoice={savedInvoice} />
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
      <ItemInputRow
        activeParty={activeParty}
        onActivePartyChange={setActiveParty}
        buyerName={input.buyerName}
        buyerPhone={input.buyerPhone}
        buyerAddress={input.buyerAddress}
        buyerPan={input.buyerPan}
        onBuyerNameChange={v => setField('buyerName', v)}
        onBuyerPhoneChange={v => setField('buyerPhone', v)}
        onBuyerAddressChange={v => setField('buyerAddress', v)}
        onBuyerPanChange={v => setField('buyerPan', v)}
        sellerName={input.sellerName}
        sellerPhone={input.sellerPhone}
        sellerAddress={input.sellerAddress}
        sellerPan={input.sellerPan}
        onSellerNameChange={v => setField('sellerName', v)}
        onSellerPhoneChange={v => setField('sellerPhone', v)}
        onSellerAddressChange={v => setField('sellerAddress', v)}
        onSellerPanChange={v => setField('sellerPan', v)}
      />

      <RateInputRow
        value={input.goldRate}
        onChange={v => setField('goldRate', v)}
        goldRates={goldRates}
      />

      {/* Items */}
      <div className="flex flex-col gap-3">
        {input.items.map((item, i) => (
          <BillingItemCard
            key={item.id}
            item={item}
            index={i}
            canRemove={input.items.length > 1}
            onUpdate={(field, value) => updateItem(i, field, value)}
            onMakingTypeChange={(type) => setItemMakingChargeType(i, type)}
            onRemove={() => removeItem(i)}
          />
        ))}
        <button
          type="button"
          onClick={addItem}
          className="w-full py-2.5 rounded-2xl border-2 border-dashed border-gold-300 text-gold-700 text-sm font-semibold hover:bg-gold-50 transition-colors"
        >
          + Add Item
        </button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <NumericInput
            label="Discount (₹)"
            value={input.discount}
            onChange={v => setField('discount', v)}
            prefix="₹"
            hint="Optional discount"
            placeholder="0"
          />
        </div>
        <div className="flex-1">
          <GstRow value={input.gstPercent} onChange={v => setField('gstPercent', v)} />
        </div>
      </div>

      <TotalsCard result={result} input={input} />

      {isValid && (
        <Button type="submit" size="lg" fullWidth loading={saving}>
          Save &amp; Generate Invoice
        </Button>
      )}
    </form>
  );
}
