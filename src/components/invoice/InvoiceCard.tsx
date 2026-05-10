import Link from 'next/link';
import type { Invoice } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { SyncBadge } from '@/components/ui/Badge';

interface Props {
  invoice: Invoice;
}

export function InvoiceCard({ invoice }: Props) {
  return (
    <Link
      href={`/invoice/${invoice.id}`}
      className="block bg-white rounded-2xl border border-gray-200 px-4 py-3 shadow-card hover:shadow-card-md hover:border-gold-300 transition-all active:scale-[0.99]"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-bold text-gray-900 truncate">
              {invoice.customerName || 'Walk-in Customer'}
            </p>
            <SyncBadge status={invoice.syncStatus} />
          </div>
          <p className="text-xs text-gray-500 truncate">
            {invoice.items?.map(it => it.itemName).filter(Boolean).join(', ') || '—'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right shrink-0 ml-3">
          <p className="text-base font-bold text-gold-700 tabular-nums">
            {formatCurrency(invoice.total)}
          </p>
          <p className="text-xs text-gray-400">{formatDate(invoice.createdAt)}</p>
        </div>
      </div>
    </Link>
  );
}
