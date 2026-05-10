'use client';

import { PageShell } from '@/components/layout/PageShell';
import { BillingForm } from '@/components/billing/BillingForm';
import { OnlineBadge } from '@/components/ui/Badge';
import { useSettings } from '@/hooks/useSettings';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function BillingPage() {
  const { settings, loading } = useSettings();
  const isOnline = useOnlineStatus();

  return (
    <PageShell
      title="New Bill"
      action={<OnlineBadge online={isOnline} />}
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <BillingForm
          shopInfo={settings.shopInfo}
          goldRates={settings.goldRates}
          defaultGst={settings.defaultGstPercent}
        />
      )}
    </PageShell>
  );
}
