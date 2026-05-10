import type { Invoice } from '@/types';

export async function generateInvoicePdf(invoice: Invoice): Promise<void> {
  const [{ pdf }, { InvoicePDF }, React] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./InvoicePDF'),
    import('react'),
  ]);

  const element = React.createElement(InvoicePDF, { invoice });
  const blob = await pdf(element as React.ReactElement).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${invoice.invoiceNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
