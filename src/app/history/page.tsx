'use client';

import { useEffect, useState } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { InvoiceCard } from '@/components/invoice/InvoiceCard';
import { useInvoices } from '@/hooks/useInvoices';

export default function HistoryPage() {
  const { invoices, loading, loadInvoices } = useInvoices();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => loadInvoices(search), 200);
    return () => clearTimeout(t);
  }, [search, loadInvoices]);

  return (
    <PageShell title="Invoice History">
      <div className="flex flex-col gap-3">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or invoice no..."
            className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No invoices yet</p>
            <p className="text-gray-400 text-sm mt-1">
              {search ? 'No results for your search' : 'Create your first bill to get started'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>
            {invoices.map((inv) => (
              <InvoiceCard key={inv.id} invoice={inv} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
