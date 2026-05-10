import type { BillingInput, BillingResult, BillingItemResult, MakingChargeType } from '@/types';

export function computeGoldPrice(weight: number, rate: number): number {
  return weight * rate;
}

export function computeMakingCharges(
  goldPrice: number,
  type: MakingChargeType,
  value: number,
): number {
  return type === 'percentage' ? (goldPrice * value) / 100 : value;
}

export function computeBilling(input: BillingInput): BillingResult | null {
  const rate = input.goldRate;
  const gst  = input.gstPercent;

  if (rate === '' || (rate as number) <= 0 || gst === '' || (gst as number) < 0) return null;
  if (!input.items.length) return null;

  const hasValidItem = input.items.some(
    (it) => it.weightGrams !== '' && (it.weightGrams as number) > 0,
  );
  if (!hasValidItem) return null;

  const discountValue = input.discount === '' ? 0 : (Number(input.discount) || 0);

  const itemResults: BillingItemResult[] = input.items.map((item) => {
    const w  = item.weightGrams      === '' ? 0 : (item.weightGrams      as number);
    const mv = item.makingChargeValue === '' ? 0 : (Number(item.makingChargeValue) || 0);
    const hv = item.hallmarkCharge    === '' ? 0 : (Number(item.hallmarkCharge)    || 0);

    const goldPrice      = computeGoldPrice(w, rate as number);
    const makingCharges  = computeMakingCharges(goldPrice, item.makingChargeType, mv);
    const hallmarkCharge = hv;
    const itemSubtotal   = goldPrice + makingCharges + hallmarkCharge;

    return {
      goldPrice:      round2(goldPrice),
      makingCharges:  round2(makingCharges),
      hallmarkCharge: round2(hallmarkCharge),
      itemSubtotal:   round2(itemSubtotal),
    };
  });

  const subtotal      = round2(itemResults.reduce((s, r) => s + r.itemSubtotal, 0));
  const discount      = round2(Math.max(0, Math.min(discountValue, subtotal)));
  const afterDiscount = round2(subtotal - discount);
  const gstAmount     = round2((afterDiscount * (gst as number)) / 100);
  const total         = round2(afterDiscount + gstAmount);
  const grandTotal    = Math.round(total);
  const roundOff      = round2(grandTotal - total);

  return {
    items: itemResults,
    subtotal,
    discount,
    afterDiscount,
    gstAmount,
    total,
    roundOff,
    grandTotal,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
