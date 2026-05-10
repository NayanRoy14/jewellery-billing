import type { Invoice } from '@/types';
import { numberToWords } from '@/lib/utils';

// ── Helpers (mirrors InvoicePDF.tsx) ───────────────────────────────────────
const getBuyerName    = (inv: Invoice) => inv.buyerName    || inv.customerName    || '';
const getBuyerPhone   = (inv: Invoice) => inv.buyerPhone   || inv.customerPhone   || '';
const getBuyerAddress = (inv: Invoice) => inv.buyerAddress || inv.customerAddress || '';
const getBuyerPan     = (inv: Invoice) => inv.buyerPan     || inv.customerPan     || '';

const fmtAmt = (n: number) => {
  const a = Math.abs(n);
  const rs = Math.floor(a).toLocaleString('en-IN');
  const ps = Math.round((a - Math.floor(a)) * 100).toString().padStart(2, '0');
  return `${rs}.${ps}`;
};

// Column widths as percentages (mirrors PDF: 178+53+63+63+81+89 = 527)
const W = {
  part: '33.78%',
  hsn:  '10.06%',
  wt:   '11.95%',
  rate: '11.95%',
  mkg:  '15.37%',
  amt:  '16.89%',
} as const;

const DATA_ROWS = 11;

// ── Column header cell ──────────────────────────────────────────────────────
function HCell({ w, label, align = 'left', last = false }: {
  w: string; label: string; align?: 'left' | 'center' | 'right'; last?: boolean;
}) {
  return (
    <div
      style={{ width: w, textAlign: align }}
      className={`px-1 py-1 text-[7.5px] font-bold text-black ${last ? '' : 'border-r border-[#ccc]'}`}
    >
      {label}
    </div>
  );
}

// ── Data cell ───────────────────────────────────────────────────────────────
function DCell({ w, last = false, align = 'left', children }: {
  w: string; last?: boolean; align?: 'left' | 'center' | 'right'; children?: React.ReactNode;
}) {
  return (
    <div
      style={{ width: w, textAlign: align }}
      className={`px-1 py-0.5 border-t border-[#ccc] self-stretch flex flex-col justify-center ${last ? '' : 'border-r border-[#ccc]'}`}
    >
      {children}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const hasBuyer  = !!(invoice.buyerName || invoice.customerName);
  const hasSeller = !!invoice.sellerName;
  const pLabel = hasBuyer ? 'BILL TO — BUYER' : hasSeller ? 'BILL TO — SELLER' : 'CUSTOMER';
  const pData  = hasBuyer
    ? { name: getBuyerName(invoice), phone: getBuyerPhone(invoice), addr: getBuyerAddress(invoice), pan: getBuyerPan(invoice) }
    : hasSeller
      ? { name: invoice.sellerName!, phone: invoice.sellerPhone || '', addr: invoice.sellerAddress || '', pan: invoice.sellerPan || '' }
      : null;

  const meta = [
    { l: 'Invoice No.', v: invoice.invoiceNumber,                                  last: false },
    { l: 'Date',        v: new Date(invoice.createdAt).toLocaleDateString('en-IN'), last: false },
    { l: 'GST No.',     v: getBuyerPan(invoice) || invoice.sellerPan || '',         last: true  },
  ];

  const items   = invoice.items ?? [];
  const words   = numberToWords(invoice.grandTotal);
  const contact = [
    invoice.shopInfo.phone ? 'Mob: ' + invoice.shopInfo.phone : '',
    invoice.shopInfo.gstin ? 'GSTIN: ' + invoice.shopInfo.gstin : '',
  ].filter(Boolean).join('     |     ');

  return (
    <div className="bg-white font-sans leading-tight text-[11px]">

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="border-t-[3px] border-t-black border-b-[1.5px] border-b-black px-8 py-3.5">
        <div className="flex items-center gap-3">
          {invoice.shopInfo.logo
            ? <img src={invoice.shopInfo.logo} alt="logo" className="w-10 h-10 object-cover border border-[#ccc] shrink-0" />
            : null}
          <div className="flex-1 flex flex-col items-center">
            <h1 className="text-[22px] font-bold text-black leading-tight">{invoice.shopInfo.name || 'Jewellery Shop'}</h1>
            <p className="text-[#b9a264] text-[9px] mt-1">Manufacturer  ·  Retailer  ·  Job Worker</p>
            {invoice.shopInfo.address
              ? <p className="text-[#444] text-[8.5px] mt-0.5">{invoice.shopInfo.address}</p>
              : null}
            {contact
              ? <p className="text-[#444] text-[8px] mt-0.5">{contact}</p>
              : null}
          </div>
          <div className="border border-black px-2 py-1 self-start shrink-0">
            <span className="text-black text-[7px] font-bold">TAX INVOICE</span>
          </div>
        </div>
      </div>

      {/* ── PARTY + META ──────────────────────────────────────────────── */}
      <div className="flex mx-8 mt-2.5 border border-black" style={{ minHeight: 100 }}>
        {/* Party panel */}
        <div className="flex-1">
          <div className="border-b border-black px-2 py-1">
            <span className="text-black text-[7px] font-bold">{pLabel}</span>
          </div>
          <div className="p-2 space-y-1.5">
            {pData
              ? [
                  { l: 'Name',    v: pData.name  },
                  { l: 'Phone',   v: pData.phone },
                  { l: 'Address', v: pData.addr  },
                  { l: 'PAN No.', v: pData.pan   },
                ].map((r, i) => (
                  <div key={i} className="flex items-baseline gap-1">
                    <span className="text-[#444] text-[8px] shrink-0" style={{ width: 42 }}>{r.l}:</span>
                    <span className="text-[#1a1a1a] font-bold text-[9.5px] flex-1">{r.v || '—'}</span>
                  </div>
                ))
              : <span className="text-[#444] text-[8px]">—</span>}
          </div>
        </div>
        {/* Divider */}
        <div className="w-px bg-black" />
        {/* Meta panel */}
        <div style={{ width: 180 }}>
          <div className="border-b border-black px-2 py-1 text-center">
            <span className="text-black text-[7px] font-bold">INVOICE DETAILS</span>
          </div>
          <div className="p-2">
            {meta.map((row, i) => (
              <div key={i} className={`flex justify-between items-center py-1.5 ${row.last ? '' : 'border-b border-[#ccc]'}`}>
                <span className="text-[#444] text-[8px]">{row.l}</span>
                <span className="text-[#1a1a1a] font-bold text-[9px]">{row.v || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABLE ─────────────────────────────────────────────────────── */}
      <div className="mx-8 mt-2.5 border border-black">
        {/* Header row */}
        <div className="flex border-b border-black py-1.5">
          <HCell w={W.part} label="PARTICULARS"    align="left"   />
          <HCell w={W.hsn}  label="HSN CODE"       align="center" />
          <HCell w={W.wt}   label="WEIGHT (g)"     align="center" />
          <HCell w={W.rate} label="RATE /g"         align="right"  />
          <HCell w={W.mkg}  label="MAKING"          align="right"  />
          <HCell w={W.amt}  label="AMOUNT (Rs.)"    align="right"  last />
        </div>

        {/* Data rows */}
        {Array.from({ length: DATA_ROWS }, (_, i) => {
          const item = items[i];
          return (
            <div key={i} className={`flex min-h-[20px] ${i % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-white'}`}>
              <DCell w={W.part}>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#999] text-[7px] shrink-0">{i + 1}</span>
                  {item ? <span className="text-[#1a1a1a] text-[9.5px]">{item.itemName.substring(0, 25)}</span> : null}
                </div>
              </DCell>
              <DCell w={W.hsn} align="center">
                {item ? <span className="text-[#444] text-[9px]">{item.hsnCode || '—'}</span> : null}
              </DCell>
              <DCell w={W.wt} align="center">
                {item ? <span className="text-[#444] text-[9px]">{item.weightGrams.toFixed(3)}</span> : null}
              </DCell>
              <DCell w={W.rate} align="right">
                {item ? <span className="text-[#444] text-[9px]">{invoice.goldRate.toFixed(0)}</span> : null}
              </DCell>
              <DCell w={W.mkg} align="right">
                {item
                  ? <>
                      <span className="text-[#1a1a1a] text-[9.5px]">{fmtAmt(item.makingCharges)}</span>
                      {item.hallmarkChargeAmount > 0
                        ? <span className="text-[#444] text-[7px]">HM: {fmtAmt(item.hallmarkChargeAmount)}</span>
                        : null}
                    </>
                  : null}
              </DCell>
              <DCell w={W.amt} align="right" last>
                {item ? <span className="text-[#1a1a1a] font-bold text-[9.5px]">{fmtAmt(item.goldPrice)}</span> : null}
              </DCell>
            </div>
          );
        })}

        {/* Summary rows */}
        <div className="flex items-center min-h-[20px] border-t border-[#ccc]">
          <span className="flex-1 pl-2 text-[#444] text-[9.5px]">Subtotal</span>
          <div style={{ width: W.amt }} className="pr-1.5 text-right font-bold text-[9.5px] text-[#1a1a1a]">{fmtAmt(invoice.subtotal)}</div>
        </div>
        <div className="flex items-center min-h-[20px] border-t border-[#ccc]">
          <span className="flex-1 pl-2 text-[#444] text-[9.5px]">Discount</span>
          <div style={{ width: W.amt }} className="pr-1.5 text-right font-bold text-[9.5px] text-[#1a1a1a]">{fmtAmt(invoice.discount)}</div>
        </div>
        <div className="flex items-center min-h-[20px] border-t-[1.5px] border-t-black">
          <span className="flex-1 pl-2 font-bold text-[10.5px] text-black">Net Amount</span>
          <div style={{ width: W.amt }} className="pr-1.5 text-right font-bold text-[11px] text-black">{fmtAmt(invoice.afterDiscount)}</div>
        </div>
      </div>

      {/* ── BOTTOM — words + GST ─────────────────────────────────────── */}
      <div className="flex mx-8 mt-2 border border-black" style={{ minHeight: 72 }}>
        {/* Words panel */}
        <div className="flex-1 p-2 border-r border-black">
          <p className="text-[#444] text-[7.5px] font-bold pb-1 mb-1 border-b border-[#ccc]">AMOUNT IN WORDS</p>
          <p className="text-[#1a1a1a] font-bold text-[9.5px] leading-snug">{words} Only</p>
        </div>
        {/* GST panel */}
        <div style={{ width: 180 }} className="flex flex-col">
          <div className="flex justify-between items-center px-2 py-[7px] border-b border-[#ccc]">
            <span className="text-[#444] text-[9px]">GST @ {invoice.gstPercent}%</span>
            {invoice.gstAmount !== 0 ? <span className="font-bold text-[9.5px] text-[#1a1a1a]">{fmtAmt(invoice.gstAmount)}</span> : null}
          </div>
          <div className="flex justify-between items-center px-2 py-[7px] border-b border-[#ccc]">
            <span className="text-[#444] text-[9px]">Round Off</span>
            {invoice.roundOff !== 0 ? <span className="font-bold text-[9.5px] text-[#1a1a1a]">{fmtAmt(invoice.roundOff)}</span> : null}
          </div>
          <div className="flex-1 flex justify-between items-center px-2 py-[7px] border-t-[1.5px] border-t-black">
            <span className="font-bold text-[10.5px] text-black">Grand Total</span>
            <span className="font-bold text-[11px] text-black">{fmtAmt(invoice.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Closing rule — full width, matches PDF */}
      <div className="h-[1.5px] bg-black mt-2" />

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <div className="flex justify-between mx-8 mt-3 mb-4" style={{ height: 60 }}>
        <div className="flex items-end" style={{ width: 140 }}>
          <span className="text-[#444] text-[8.5px]">Customer's Signature</span>
        </div>
        <div className="flex flex-col justify-between items-center" style={{ width: 140 }}>
          <span className="font-bold text-[9.5px] text-[#1a1a1a]">For {invoice.shopInfo.name || 'Jewellery Shop'}</span>
          <span className="text-[#444] text-[8.5px]">Authorised Signatory</span>
        </div>
      </div>

    </div>
  );
}
