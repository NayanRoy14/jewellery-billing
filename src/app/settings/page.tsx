'use client';

import { PageShell } from '@/components/layout/PageShell';
import { GoldRatesForm } from '@/components/settings/GoldRatesForm';
import { ShopInfoForm } from '@/components/settings/ShopInfoForm';
import { useSettings } from '@/hooks/useSettings';

export default function SettingsPage() {
  const { settings, loading, updateShopInfo, updateGoldRates } = useSettings();

  if (loading) {
    return (
      <PageShell title="Settings">
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Settings">
      <div className="flex flex-col gap-4">
        <GoldRatesForm goldRates={settings.goldRates} onSave={updateGoldRates} />
        <ShopInfoForm shopInfo={settings.shopInfo} onSave={updateShopInfo} />
      </div>
    </PageShell>
  );
}
