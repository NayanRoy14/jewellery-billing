'use client';

import type { Invoice } from '@/types';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';

interface Props {
  invoice: Invoice;
}

export function InvoiceActions({ invoice }: Props) {
  const { generating, downloadPdf } = usePdfGenerator();
  const { shareWhatsApp, copyText } = useWhatsApp();
  const { showToast } = useToast();

  async function handleCopy() {
    const ok = await copyText(invoice);
    showToast(ok ? 'Copied to clipboard!' : 'Copy failed', ok ? 'success' : 'error');
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={generating}
          onClick={() => downloadPdf(invoice)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          Download PDF
        </Button>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={() => shareWhatsApp(invoice)}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.528 5.845L.057 23.985l6.337-1.454A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.028-1.383l-.36-.214-3.732.856.897-3.629-.235-.374A9.785 9.785 0 012.182 12C2.182 6.59 6.59 2.182 12 2.182S21.818 6.59 21.818 12 17.41 21.818 12 21.818z"/>
          </svg>
          WhatsApp
        </Button>
      </div>
      <Button variant="ghost" size="md" fullWidth onClick={handleCopy}>
        Copy as Text
      </Button>
    </div>
  );
}
