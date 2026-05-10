'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AppSettings, ShopInfo, GoldRates } from '@/types';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'jb_settings';

const DEFAULT_SETTINGS: AppSettings = {
  shopInfo: {
    name: 'My Jewellery Shop',
    address: '',
    phone: '',
    gstin: '',
  },
  goldRates: { 22: 0, 24: 0 },
  defaultGstPercent: 3,
  defaultKarat: 22,
};

function loadFromStorage(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveToStorage(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSettings(loadFromStorage());
    setLoading(false);
  }, []);

  const updateShopInfo = useCallback(async (shopInfo: ShopInfo) => {
    const updated = { ...settings, shopInfo };
    setSettings(updated);
    saveToStorage(updated);

    // Sync to Supabase when available (best-effort)
    if (supabase) {
      await supabase.from('shops').upsert(
        {
          id: shopInfo.id,
          name: shopInfo.name,
          address: shopInfo.address,
          phone: shopInfo.phone,
          gstin: shopInfo.gstin,
          logo_url: shopInfo.logo || '',
        },
        { onConflict: 'id' },
      );
    }
  }, [settings]);

  const updateGoldRates = useCallback(async (goldRates: GoldRates) => {
    const updated = { ...settings, goldRates };
    setSettings(updated);
    saveToStorage(updated);
  }, [settings]);

  const updateDefaultGst = useCallback((gst: number) => {
    const updated = { ...settings, defaultGstPercent: gst };
    setSettings(updated);
    saveToStorage(updated);
  }, [settings]);

  return {
    settings,
    loading,
    updateShopInfo,
    updateGoldRates,
    updateDefaultGst,
  };
}
