import { NumericInput } from '@/components/ui/NumericInput';

interface Props {
  value: number | '';
  onChange: (value: number | '') => void;
}

export function GstRow({ value, onChange }: Props) {
  return (
    <NumericInput
      label="GST"
      value={value}
      onChange={onChange}
      suffix="%"
      hint="Standard GST on jewellery is 3%"
      placeholder="3"
    />
  );
}
