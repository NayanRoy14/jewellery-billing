'use client';

import { useRef, useState } from 'react';
import type { ShopInfo } from '@/types';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface Props {
  shopInfo: ShopInfo;
  onSave: (info: ShopInfo) => Promise<void>;
}

export function ShopInfoForm({ shopInfo, onSave }: Props) {
  const { showToast } = useToast();
  const [form, setForm] = useState<ShopInfo>({ ...shopInfo });
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function setField(field: keyof ShopInfo, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      showToast('Logo must be under 500 KB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    setForm((prev) => ({ ...prev, logo: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSave() {
    if (!form.name.trim()) {
      showToast('Shop name is required', 'error');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      showToast('Shop info saved!', 'success');
    } catch {
      showToast('Failed to save shop info', 'error');
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    'w-full py-3 px-3 text-base rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-4">
      <h2 className="text-base font-bold text-gray-900">Shop Information</h2>

      {/* Logo upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Shop Logo</label>
        <div className="flex items-center gap-4">
          {form.logo ? (
            <img
              src={form.logo}
              alt="Shop logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-gold-300"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#0f3472] flex items-center justify-center text-white font-bold text-2xl shrink-0">
              {form.name ? form.name[0].toLowerCase() : 'j'}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-gold-700 font-medium underline underline-offset-2"
            >
              {form.logo ? 'Change logo' : 'Upload logo'}
            </button>
            {form.logo && (
              <button
                type="button"
                onClick={removeLogo}
                className="text-sm text-red-500 font-medium underline underline-offset-2"
              >
                Remove
              </button>
            )}
            <p className="text-xs text-gray-400">PNG/JPG, max 500 KB</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleLogoChange}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Shop Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          placeholder="e.g. Sharma Jewellers"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <textarea
          value={form.address}
          onChange={(e) => setField('address', e.target.value)}
          placeholder="Shop address"
          rows={2}
          className={inputClass + ' resize-none'}
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder="10-digit number"
            className={inputClass}
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">GSTIN</label>
          <input
            type="text"
            value={form.gstin}
            onChange={(e) => setField('gstin', e.target.value.toUpperCase())}
            placeholder="22AAAAA0000A1Z5"
            className={inputClass}
          />
        </div>
      </div>

      <Button onClick={handleSave} loading={saving} fullWidth>
        Save Shop Info
      </Button>
    </div>
  );
}
