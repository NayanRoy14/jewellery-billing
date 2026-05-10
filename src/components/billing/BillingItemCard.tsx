import type { BillingItem, MakingChargeType } from '@/types';
import { NumericInput } from '@/components/ui/NumericInput';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';

const inputClass =
  'w-full py-3 px-3 text-base rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500';

interface Props {
  item: BillingItem;
  index: number;
  canRemove: boolean;
  onUpdate: <K extends keyof BillingItem>(field: K, value: BillingItem[K]) => void;
  onMakingTypeChange: (type: MakingChargeType) => void;
  onRemove: () => void;
}

export function BillingItemCard({ item, index, canRemove, onUpdate, onMakingTypeChange, onRemove }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Item {index + 1}</span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-0.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Item / Particulars</label>
          <input
            type="text"
            value={item.itemName}
            onChange={e => onUpdate('itemName', e.target.value)}
            placeholder="e.g. Gold Ring 22K"
            className={inputClass}
          />
        </div>
        <div className="w-24 flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">HSN Code</label>
          <input
            type="text"
            inputMode="numeric"
            value={item.hsnCode}
            onChange={e => onUpdate('hsnCode', e.target.value)}
            placeholder="7113"
            className={inputClass}
          />
        </div>
        <div className="w-32">
          <NumericInput
            label="Weight"
            value={item.weightGrams}
            onChange={v => onUpdate('weightGrams', v)}
            suffix="g"
            placeholder="0.000"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Making Charges</label>
        <ToggleSwitch
          leftLabel="% Percentage"
          rightLabel="₹ Fixed"
          isRight={item.makingChargeType === 'fixed'}
          onToggle={() => onMakingTypeChange(item.makingChargeType === 'percentage' ? 'fixed' : 'percentage')}
        />
        <NumericInput
          label=""
          value={item.makingChargeValue}
          onChange={v => onUpdate('makingChargeValue', v)}
          prefix={item.makingChargeType === 'fixed' ? '₹' : undefined}
          suffix={item.makingChargeType === 'percentage' ? '%' : undefined}
          placeholder={item.makingChargeType === 'percentage' ? 'e.g. 6' : 'e.g. 500'}
        />
      </div>

      <NumericInput
        label="Hallmark Charge (₹)"
        value={item.hallmarkCharge}
        onChange={v => onUpdate('hallmarkCharge', v)}
        prefix="₹"
        placeholder="0"
      />
    </div>
  );
}
