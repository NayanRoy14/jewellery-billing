'use client';

import { useCallback, useState } from 'react';
import type { Invoice } from '@/types';
import { generateInvoicePdf } from '@/lib/pdf';

export function usePdfGenerator() {
  const [generating, setGenerating] = useState(false);

  const downloadPdf = useCallback(async (invoice: Invoice) => {
    setGenerating(true);
    try {
      await generateInvoicePdf(invoice);
    } finally {
      setGenerating(false);
    }
  }, []);

  return { generating, downloadPdf };
}
