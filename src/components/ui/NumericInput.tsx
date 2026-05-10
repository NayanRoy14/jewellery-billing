import type { InputHTMLAttributes } from 'react';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
  error?: string;
}

export function NumericInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  hint,
  error,
  className = '',
  ...rest
}: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === '' || raw === '.') {
      onChange('');
      return;
    }
    const num = parseFloat(raw);
    if (!isNaN(num)) onChange(num);
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div
        className={[
          'flex items-center gap-1 bg-white border rounded-xl overflow-hidden',
          'focus-within:ring-2 focus-within:ring-gold-500 focus-within:border-gold-500',
          error ? 'border-red-400' : 'border-gray-300',
          className,
        ].join(' ')}
      >
        {prefix && (
          <span className="pl-3 text-gray-500 text-sm font-medium select-none shrink-0">
            {prefix}
          </span>
        )}
        <input
          {...rest}
          type="text"
          inputMode="decimal"
          pattern="[0-9]*\.?[0-9]*"
          value={value === '' ? '' : value}
          onChange={handleChange}
          className={[
            'flex-1 py-3 px-3 text-lg font-semibold text-gray-900',
            'bg-transparent outline-none min-w-0',
            prefix ? 'pl-1' : '',
            suffix ? 'pr-1' : '',
          ].join(' ')}
        />
        {suffix && (
          <span className="pr-3 text-gray-500 text-sm font-medium select-none shrink-0">
            {suffix}
          </span>
        )}
      </div>
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
