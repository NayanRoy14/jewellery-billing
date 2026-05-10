'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Invoice } from '@/types';
import { PageShell } from '@/components/layout/PageShell';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { InvoiceActions } from '@/components/invoice/InvoiceActions';
import { useInvoices } from '@/hooks/useInvoices';
import { Button } from '@/components/ui/Button';

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getInvoiceById } = useInvoices();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getInvoiceById(id).then((inv) => {
      setInvoice(inv ?? null);
      setLoading(false);
    });
  }, [id, getInvoiceById]);

  return (
    <PageShell
      title="Invoice"
      action={
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          ← Back
        </Button>
      }
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !invoice ? (
        <div className="text-center py-16">
          <p className="text-gray-500">Invoice not found</p>
          <Button variant="ghost" className="mt-4" onClick={() => router.push('/history')}>
            Go to History
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <InvoicePreview invoice={invoice} />
          <InvoiceActions invoice={invoice} />
        </div>
      )}
    </PageShell>
  );
}
