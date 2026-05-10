import type { MakingChargeType } from '@/types';
import { NumericInput } from '@/components/ui/NumericInput';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';

interface Props {
  type: MakingChargeType;
  value: number | '';
  onTypeChange: (type: MakingChargeType) => void;
  onValueChange: (value: number | '') => void;
}

export function MakingChargesRow({ type, value, onTypeChange, onValueChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Making Charges</label>
      <ToggleSwitch
        leftLabel="% Percentage"
        rightLabel="₹ Fixed"
        isRight={type === 'fixed'}
        onToggle={() => onTypeChange(type === 'percentage' ? 'fixed' : 'percentage')}
      />
      <NumericInput
        label=""
        value={value}
        onChange={onValueChange}
        prefix={type === 'fixed' ? '₹' : undefined}
        suffix={type === 'percentage' ? '%' : undefined}
        placeholder={type === 'percentage' ? 'e.g. 6' : 'e.g. 500'}
      />
    </div>
  );
}
