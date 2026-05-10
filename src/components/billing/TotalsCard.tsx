import type { BillingResult, BillingInput } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface Props {
  result: BillingResult | null;
  input: BillingInput;
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-1.5 ${bold ? 'border-t border-gold-200 mt-1 pt-2' : ''}`}>
      <span className={`text-sm ${bold ? 'font-bold text-gray-900' : muted ? 'text-gray-400' : 'text-gray-600'}`}>
        {label}
      </span>
      <span className={`tabular-nums ${bold ? 'text-2xl font-bold text-gold-700' : muted ? 'text-xs text-gray-400' : 'text-sm font-semibold text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}

export function TotalsCard({ result, input }: Props) {
  if (!result) {
    return (
      <div className="rounded-2xl bg-gold-50 border border-gold-200 p-4">
        <p className="text-sm text-gold-700 text-center">Enter weight and gold rate to see totals</p>
      </div>
    );
  }

  const gst = input.gstPercent === '' ? 3 : (input.gstPercent as number);

  return (
    <div className="rounded-2xl bg-white border border-gold-200 shadow-card overflow-hidden">
      <div className="px-4 py-2 bg-gold-600">
        <h2 className="text-sm font-semibold text-white">Price Breakdown</h2>
      </div>
      <div className="px-4 pb-1 divide-y divide-gray-100">
        {result.items.map((r, i) => {
          const item = input.items[i];
          const makingLabel =
            item?.makingChargeType === 'percentage' && item?.makingChargeValue !== ''
              ? `Item ${i + 1} Labour (${item.makingChargeValue}%)`
              : `Item ${i + 1} Labour`;
          return (
            <div key={i}>
              {input.items.length > 1 && (
                <p className="text-xs font-semibold text-gray-400 pt-2">
                  {item?.itemName || `Item ${i + 1}`}
                </p>
              )}
              <Row label="Gold Price"    value={formatCurrency(r.goldPrice)} />
              <Row label={makingLabel}   value={formatCurrency(r.makingCharges)} />
              {r.hallmarkCharge > 0 && (
                <Row label="Hallmark Charge" value={formatCurrency(r.hallmarkCharge)} />
              )}
            </div>
          );
        })}
        <Row label="Subtotal"          value={formatCurrency(result.subtotal)} />
        {result.discount > 0 && (
          <Row label="Discount"        value={`- ${formatCurrency(result.discount)}`} />
        )}
        {result.discount > 0 && (
          <Row label="After Discount"  value={formatCurrency(result.afterDiscount)} />
        )}
        <Row label={`GST (${gst}%)`}   value={formatCurrency(result.gstAmount)} />
        {result.roundOff !== 0 && (
          <Row label="Round Off"       value={formatCurrency(result.roundOff)} muted />
        )}
        <div className="pt-2 pb-3">
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-gray-900">Grand Total</span>
            <span className="text-2xl font-bold text-gold-700 tabular-nums">
              {formatCurrency(result.grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
