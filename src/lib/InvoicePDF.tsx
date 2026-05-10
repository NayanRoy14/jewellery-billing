import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import type { Invoice } from '@/types';
import { numberToWords } from './utils';

// ── Palette (print-friendly — no heavy fills) ──────────────────────────────
const BLACK  = '#000000';
const DARK   = '#1a1a1a';
const DGRAY  = '#444444';  // secondary text
const MGRAY  = '#999999';  // muted / row nums
const BGRAY  = '#cccccc';  // borders
const LGRAY  = '#f5f5f5';  // alternating row tint (very light)
const WHITE  = '#ffffff';

// ── Layout ─────────────────────────────────────────────────────────────────
const PAD = 34;

// Column widths — total = 595 - PAD*2 = 527pt
const CW = { part: 178, hsn: 53, wt: 63, rate: 63, mkg: 81, amt: 89 } as const;

const DATA_ROWS = 11;

// ── Helpers ────────────────────────────────────────────────────────────────
const fmtAmt = (n: number) => {
  const a = Math.abs(n);
  const rs = Math.floor(a).toLocaleString('en-IN');
  const ps = Math.round((a - Math.floor(a)) * 100).toString().padStart(2, '0');
  return `${rs}.${ps}`;
};

const getBuyerName    = (inv: Invoice) => inv.buyerName    || inv.customerName    || '';
const getBuyerPhone   = (inv: Invoice) => inv.buyerPhone   || inv.customerPhone   || '';
const getBuyerAddress = (inv: Invoice) => inv.buyerAddress || inv.customerAddress || '';
const getBuyerPan     = (inv: Invoice) => inv.buyerPan     || inv.customerPan     || '';

// ── Styles ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: WHITE, paddingBottom: 30 },

  // Header — no background fill, just borders + text
  header: {
    paddingHorizontal: PAD,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: BLACK,
    borderTopWidth: 3,
    borderTopColor: BLACK,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 38, height: 38, marginRight: 14, borderWidth: 0.5, borderColor: BGRAY },
  headerCenter: { flex: 1, alignItems: 'center' },
  shopName: { color: BLACK, fontSize: 22, fontFamily: 'Helvetica-Bold' },
  tagline: { color: DGRAY, fontSize: 8.5, marginTop: 4 },
  shopAddr: { color: DGRAY, fontSize: 8.5, marginTop: 2 },
  shopContact: { color: DGRAY, fontSize: 8, marginTop: 2 },
  taxBadge: {
    borderWidth: 1,
    borderColor: BLACK,
    paddingHorizontal: 7,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  taxBadgeText: { color: BLACK, fontSize: 7, fontFamily: 'Helvetica-Bold' },

  // Party + Meta
  partyRow: {
    flexDirection: 'row',
    marginHorizontal: PAD,
    marginTop: 10,
    borderWidth: 0.7,
    borderColor: BLACK,
    minHeight: 100,
  },
  partyLeft: { flex: 1 },
  metaRight: { width: 180, borderLeftWidth: 0.7, borderLeftColor: BLACK },
  panelBar: {
    borderBottomWidth: 0.7,
    borderBottomColor: BLACK,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  panelBarText: { color: BLACK, fontSize: 7, fontFamily: 'Helvetica-Bold' },
  partyBody: { padding: 9 },
  partyFieldRow: { flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start' },
  partyLbl: { color: DGRAY, fontSize: 8, width: 42, paddingTop: 1 },
  partyVal: { color: DARK, fontSize: 9.5, fontFamily: 'Helvetica-Bold', flex: 1 },
  metaBody: { padding: 9 },
  metaFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.4,
    borderBottomColor: BGRAY,
  },
  metaFieldRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  metaLbl: { color: DGRAY, fontSize: 8 },
  metaVal: { color: DARK, fontSize: 9, fontFamily: 'Helvetica-Bold' },

  // Table
  tableWrap: {
    marginHorizontal: PAD,
    marginTop: 10,
    borderWidth: 0.7,
    borderColor: BLACK,
  },
  tblHdrRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: BLACK,
  },
  tblRow:    { flexDirection: 'row', minHeight: 20 },
  tblRowAlt: { backgroundColor: LGRAY },

  // Summary rows — outline only, no fills
  summLight: {
    flexDirection: 'row',
    minHeight: 20,
    borderTopWidth: 0.4,
    borderTopColor: BGRAY,
    alignItems: 'center',
  },
  summTotal: {
    flexDirection: 'row',
    minHeight: 20,
    borderTopWidth: 1.5,
    borderTopColor: BLACK,
    alignItems: 'center',
  },
  summLblLight: { flex: 1, paddingLeft: 8, color: DGRAY,  fontSize: 9.5 },
  summLblTotal: { flex: 1, paddingLeft: 8, color: BLACK,  fontSize: 10.5, fontFamily: 'Helvetica-Bold' },
  summValLight: { width: CW.amt, paddingRight: 6, color: DARK,  fontSize: 9.5, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
  summValTotal: { width: CW.amt, paddingRight: 6, color: BLACK, fontSize: 11,  fontFamily: 'Helvetica-Bold', textAlign: 'right' },

  // Bottom
  bottomRow: {
    flexDirection: 'row',
    marginHorizontal: PAD,
    marginTop: 8,
    borderWidth: 0.7,
    borderColor: BLACK,
    minHeight: 72,
  },
  wordsPanel: { flex: 1, padding: 9, borderRightWidth: 0.7, borderRightColor: BLACK },
  wordsPanelLbl: {
    color: DGRAY,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
    paddingBottom: 4,
    borderBottomWidth: 0.4,
    borderBottomColor: BGRAY,
  },
  wordsText: { color: DARK, fontSize: 9.5, fontFamily: 'Helvetica-Bold', lineHeight: 1.45 },
  gstPanel: { width: 180 },
  gstRowLight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderBottomWidth: 0.4,
    borderBottomColor: BGRAY,
  },
  gstRowTotal: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1.5,
    borderTopColor: BLACK,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  gstLbl:      { color: DGRAY, fontSize: 9 },
  gstVal:      { color: DARK,  fontSize: 9.5, fontFamily: 'Helvetica-Bold' },
  gstLblTotal: { color: BLACK, fontSize: 10.5, fontFamily: 'Helvetica-Bold' },
  gstValTotal: { color: BLACK, fontSize: 11,   fontFamily: 'Helvetica-Bold' },

  // Closing rule
  closingRule: { height: 1.5, backgroundColor: BLACK, marginTop: 8 },

  // Footer
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: PAD, marginTop: 14, height: 60 },
  sigBlock: { alignItems: 'center', width: 140 },
  sigShopName: { color: DARK, fontSize: 9.5, fontFamily: 'Helvetica-Bold', marginBottom: 18 },
  sigLine: { height: 0.7, backgroundColor: BLACK, width: '100%', marginBottom: 4 },
  sigLbl: { color: DGRAY, fontSize: 8.5 },
});

// ── Sub-components ──────────────────────────────────────────────────────────

function HCell({ w, label, align = 'left', last = false }: {
  w: number; label: string; align?: 'left' | 'center' | 'right'; last?: boolean;
}) {
  return (
    <View style={{ width: w, paddingHorizontal: 4, borderRightWidth: last ? 0 : 0.5, borderRightColor: BGRAY }}>
      <Text style={{ color: BLACK, fontSize: 7.5, fontFamily: 'Helvetica-Bold', textAlign: align }}>{label}</Text>
    </View>
  );
}

function DCell({ w, last = false, children }: { w: number; last?: boolean; children?: React.ReactNode }) {
  return (
    <View style={{
      width: w,
      paddingHorizontal: 4,
      paddingVertical: 3,
      borderRightWidth: last ? 0 : 0.3,
      borderRightColor: BGRAY,
      borderTopWidth: 0.3,
      borderTopColor: BGRAY,
      justifyContent: 'center',
    }}>
      {children}
    </View>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export function InvoicePDF({ invoice }: { invoice: Invoice }) {
  const hasBuyer  = !!(invoice.buyerName  || invoice.customerName);
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

  const items  = invoice.items ?? [];
  const words  = numberToWords(invoice.grandTotal);
  const contact = [
    invoice.shopInfo.phone ? 'Mob: ' + invoice.shopInfo.phone : '',
    invoice.shopInfo.gstin ? 'GSTIN: ' + invoice.shopInfo.gstin : '',
  ].filter(Boolean).join('     |     ');

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <View style={s.header}>
          <View style={s.headerRow}>
            {invoice.shopInfo.logo
              ? <Image src={invoice.shopInfo.logo} style={s.logo} />
              : null}
            <View style={s.headerCenter}>
              <Text style={s.shopName}>{invoice.shopInfo.name || 'Jewellery Shop'}</Text>
              <Text style={s.tagline}>Manufacturer  ·  Retailer  ·  Job Worker</Text>
              {invoice.shopInfo.address
                ? <Text style={s.shopAddr}>{invoice.shopInfo.address}</Text>
                : null}
              {contact
                ? <Text style={s.shopContact}>{contact}</Text>
                : null}
            </View>
            <View style={s.taxBadge}>
              <Text style={s.taxBadgeText}>TAX INVOICE</Text>
            </View>
          </View>
        </View>

        {/* ── PARTY + META ──────────────────────────────────────────────── */}
        <View style={s.partyRow}>
          <View style={s.partyLeft}>
            <View style={s.panelBar}>
              <Text style={s.panelBarText}>{pLabel}</Text>
            </View>
            <View style={s.partyBody}>
              {pData
                ? [
                    { l: 'Name',    v: pData.name  },
                    { l: 'Phone',   v: pData.phone },
                    { l: 'Address', v: pData.addr  },
                    { l: 'PAN No.', v: pData.pan   },
                  ].map((r, i) => (
                    <View key={i} style={s.partyFieldRow}>
                      <Text style={s.partyLbl}>{r.l}:</Text>
                      <Text style={s.partyVal}>{r.v || '—'}</Text>
                    </View>
                  ))
                : <Text style={s.partyLbl}>—</Text>}
            </View>
          </View>
          <View style={s.metaRight}>
            <View style={s.panelBar}>
              <Text style={[s.panelBarText, { textAlign: 'center' }]}>INVOICE DETAILS</Text>
            </View>
            <View style={s.metaBody}>
              {meta.map((row, i) => (
                <View key={i} style={row.last ? s.metaFieldRowLast : s.metaFieldRow}>
                  <Text style={s.metaLbl}>{row.l}</Text>
                  <Text style={s.metaVal}>{row.v || '—'}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── TABLE ─────────────────────────────────────────────────────── */}
        <View style={s.tableWrap}>
          {/* Column headers */}
          <View style={s.tblHdrRow}>
            <HCell w={CW.part} label="PARTICULARS"    align="left"   />
            <HCell w={CW.hsn}  label="HSN CODE"       align="center" />
            <HCell w={CW.wt}   label="WEIGHT (g)"     align="center" />
            <HCell w={CW.rate} label="RATE /g"         align="right"  />
            <HCell w={CW.mkg}  label="MAKING"          align="right"  />
            <HCell w={CW.amt}  label="AMOUNT (Rs.)"    align="right"  last />
          </View>

          {/* Data rows */}
          {Array.from({ length: DATA_ROWS }, (_, i) => {
            const item = items[i];
            return (
              <View key={i} style={[s.tblRow, i % 2 === 0 ? s.tblRowAlt : {}]}>
                <DCell w={CW.part}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={{ color: MGRAY, fontSize: 7, marginRight: 3 }}>{i + 1}</Text>
                    {item ? <Text style={{ color: DARK, fontSize: 9.5 }}>{item.itemName.substring(0, 25)}</Text> : null}
                  </View>
                </DCell>
                <DCell w={CW.hsn}>
                  {item ? <Text style={{ color: DGRAY, fontSize: 9, textAlign: 'center' }}>{item.hsnCode || '—'}</Text> : null}
                </DCell>
                <DCell w={CW.wt}>
                  {item ? <Text style={{ color: DGRAY, fontSize: 9, textAlign: 'center' }}>{item.weightGrams.toFixed(3)}</Text> : null}
                </DCell>
                <DCell w={CW.rate}>
                  {item ? <Text style={{ color: DGRAY, fontSize: 9, textAlign: 'right' }}>{invoice.goldRate.toFixed(0)}</Text> : null}
                </DCell>
                <DCell w={CW.mkg}>
                  {item
                    ? <View>
                        <Text style={{ color: DARK, fontSize: 9.5, textAlign: 'right' }}>{fmtAmt(item.makingCharges)}</Text>
                        {item.hallmarkChargeAmount > 0
                          ? <Text style={{ color: DGRAY, fontSize: 7, textAlign: 'right', marginTop: 1 }}>HM: {fmtAmt(item.hallmarkChargeAmount)}</Text>
                          : null}
                      </View>
                    : null}
                </DCell>
                <DCell w={CW.amt} last>
                  {item ? <Text style={{ color: DARK, fontSize: 9.5, fontFamily: 'Helvetica-Bold', textAlign: 'right' }}>{fmtAmt(item.goldPrice)}</Text> : null}
                </DCell>
              </View>
            );
          })}

          {/* Summary */}
          <View style={s.summLight}>
            <Text style={s.summLblLight}>Subtotal</Text>
            <Text style={s.summValLight}>{fmtAmt(invoice.subtotal)}</Text>
          </View>
          <View style={s.summLight}>
            <Text style={s.summLblLight}>Discount</Text>
            <Text style={s.summValLight}>{fmtAmt(invoice.discount)}</Text>
          </View>
          <View style={s.summTotal}>
            <Text style={s.summLblTotal}>Net Amount</Text>
            <Text style={s.summValTotal}>{fmtAmt(invoice.afterDiscount)}</Text>
          </View>
        </View>

        {/* ── BOTTOM — words + GST ─────────────────────────────────────── */}
        <View style={s.bottomRow}>
          <View style={s.wordsPanel}>
            <Text style={s.wordsPanelLbl}>AMOUNT IN WORDS</Text>
            <Text style={s.wordsText}>{words} Only</Text>
          </View>
          <View style={s.gstPanel}>
            <View style={s.gstRowLight}>
              <Text style={s.gstLbl}>GST @ {invoice.gstPercent}%</Text>
              {invoice.gstAmount !== 0 ? <Text style={s.gstVal}>{fmtAmt(invoice.gstAmount)}</Text> : null}
            </View>
            <View style={s.gstRowLight}>
              <Text style={s.gstLbl}>Round Off</Text>
              {invoice.roundOff !== 0 ? <Text style={s.gstVal}>{fmtAmt(invoice.roundOff)}</Text> : null}
            </View>
            <View style={s.gstRowTotal}>
              <Text style={s.gstLblTotal}>Grand Total</Text>
              <Text style={s.gstValTotal}>{fmtAmt(invoice.grandTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Closing rule */}
        <View style={s.closingRule} />

        {/* ── FOOTER ────────────────────────────────────────────────────── */}
        <View style={s.footer}>
          <View style={[s.sigBlock, { justifyContent: 'flex-end' }]}>
            <Text style={s.sigLbl}>Customer's Signature</Text>
          </View>
          <View style={[s.sigBlock, { justifyContent: 'space-between' }]}>
            <Text style={s.sigShopName}>For {invoice.shopInfo.name || 'Jewellery Shop'}</Text>
            <Text style={s.sigLbl}>Authorised Signatory</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
