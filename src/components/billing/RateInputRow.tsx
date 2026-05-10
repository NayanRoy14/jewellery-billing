import { NumericInput } from '@/components/ui/NumericInput';

interface Props {
  value: number | '';
  onChange: (value: number | '') => void;
  goldRates?: { 22: number; 24: number };
}

export function RateInputRow({ value, onChange, goldRates }: Props) {
  const has22k = goldRates && goldRates[22] > 0;
  const has24k = goldRates && goldRates[24] > 0;

  return (
    <div className="flex flex-col gap-2">
      <NumericInput
        label="Gold Rate"
        value={value}
        onChange={onChange}
        prefix="₹"
        suffix="/g"
        placeholder="e.g. 6800"
      />
      {(has22k || has24k) && (
        <div className="flex gap-2">
          {has22k && (
            <button
              type="button"
              onClick={() => onChange(goldRates![22])}
              className="flex-1 py-1.5 px-2 rounded-lg bg-gold-100 text-gold-800 text-xs font-medium hover:bg-gold-200 transition-colors"
            >
              22K: ₹{goldRates![22].toLocaleString('en-IN')}
            </button>
          )}
          {has24k && (
            <button
              type="button"
              onClick={() => onChange(goldRates![24])}
              className="flex-1 py-1.5 px-2 rounded-lg bg-gold-100 text-gold-800 text-xs font-medium hover:bg-gold-200 transition-colors"
            >
              24K: ₹{goldRates![24].toLocaleString('en-IN')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
