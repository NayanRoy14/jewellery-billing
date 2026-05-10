'use client';

import { useState } from 'react';
import type { GoldRates } from '@/types';
import { NumericInput } from '@/components/ui/NumericInput';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface Props {
  goldRates: GoldRates;
  onSave: (rates: GoldRates) => Promise<void>;
}

export function GoldRatesForm({ goldRates, onSave }: Props) {
  const { showToast } = useToast();
  const [rate22, setRate22] = useState<number | ''>(goldRates[22] || '');
  const [rate24, setRate24] = useState<number | ''>(goldRates[24] || '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({ 22: rate22 === '' ? 0 : rate22, 24: rate24 === '' ? 0 : rate24 });
      showToast('Gold rates saved!', 'success');
    } catch {
      showToast('Failed to save rates', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-4">
      <h2 className="text-base font-bold text-gray-900">Today's Gold Rates</h2>
      <div className="flex gap-3">
        <NumericInput
          label="22K Rate"
          value={rate22}
          onChange={setRate22}
          prefix="₹"
          suffix="/g"
          placeholder="e.g. 6800"
        />
        <NumericInput
          label="24K Rate"
          value={rate24}
          onChange={setRate24}
          prefix="₹"
          suffix="/g"
          placeholder="e.g. 7200"
        />
      </div>
      <p className="text-xs text-gray-400">
        These rates will auto-fill in the billing screen. Update daily.
      </p>
      <Button onClick={handleSave} loading={saving} fullWidth>
        Save Rates
      </Button>
    </div>
  );
}
