import type { ReactNode } from 'react';

const inputClass =
  'w-full py-3 px-3 text-base rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function SectionHeader({ title, color }: { title: string; color: 'blue' | 'gold' }) {
  return (
    <div className={`flex items-center gap-2 ${color === 'blue' ? 'text-blue-900' : 'text-gold-700'}`}>
      <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
        color === 'blue' ? 'bg-blue-100' : 'bg-gold-100'
      }`}>
        {title}
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

interface Props {
  activeParty: 'buyer' | 'seller';
  onActivePartyChange: (p: 'buyer' | 'seller') => void;
  // Buyer fields
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerPan: string;
  onBuyerNameChange: (v: string) => void;
  onBuyerPhoneChange: (v: string) => void;
  onBuyerAddressChange: (v: string) => void;
  onBuyerPanChange: (v: string) => void;
  // Seller fields
  sellerName: string;
  sellerPhone: string;
  sellerAddress: string;
  sellerPan: string;
  onSellerNameChange: (v: string) => void;
  onSellerPhoneChange: (v: string) => void;
  onSellerAddressChange: (v: string) => void;
  onSellerPanChange: (v: string) => void;
}

export function ItemInputRow({
  activeParty, onActivePartyChange,
  buyerName, buyerPhone, buyerAddress, buyerPan,
  onBuyerNameChange, onBuyerPhoneChange, onBuyerAddressChange, onBuyerPanChange,
  sellerName, sellerPhone, sellerAddress, sellerPan,
  onSellerNameChange, onSellerPhoneChange, onSellerAddressChange, onSellerPanChange,
}: Props) {
  const active = activeParty;

  return (
    <div className="flex flex-col gap-3">

      {/* ── TAB TOGGLE ───────────────────────────────────────────────── */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200">
        <button
          type="button"
          onClick={() => onActivePartyChange('buyer')}
          className={`flex-1 py-2 text-sm font-semibold transition-colors ${
            active === 'buyer'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-500 hover:bg-blue-50'
          }`}
        >
          Buyer
        </button>
        <button
          type="button"
          onClick={() => onActivePartyChange('seller')}
          className={`flex-1 py-2 text-sm font-semibold transition-colors ${
            active === 'seller'
              ? 'bg-amber-500 text-white'
              : 'bg-white text-gray-500 hover:bg-amber-50'
          }`}
        >
          Seller
        </button>
      </div>

      {/* ── BUYER ────────────────────────────────────────────────────── */}
      {active === 'buyer' && (
        <>
          <div className="flex gap-3">
            <Field label="Buyer Name *">
              <input type="text" value={buyerName} onChange={e => onBuyerNameChange(e.target.value)}
                placeholder="Customer name" required className={inputClass} />
            </Field>
            <Field label="Phone *">
              <input type="tel" inputMode="numeric" value={buyerPhone}
                onChange={e => onBuyerPhoneChange(e.target.value)}
                placeholder="Mobile no." required className={inputClass} />
            </Field>
          </div>
          <div className="flex gap-3">
            <Field label="Buyer Address">
              <input type="text" value={buyerAddress} onChange={e => onBuyerAddressChange(e.target.value)}
                placeholder="Optional" className={inputClass} />
            </Field>
            <Field label="Buyer PAN No.">
              <input type="text" value={buyerPan} onChange={e => onBuyerPanChange(e.target.value.toUpperCase())}
                placeholder="Optional" className={inputClass} />
            </Field>
          </div>
        </>
      )}

      {/* ── SELLER ───────────────────────────────────────────────────── */}
      {active === 'seller' && (
        <>
          <div className="flex gap-3">
            <Field label="Seller Name">
              <input type="text" value={sellerName} onChange={e => onSellerNameChange(e.target.value)}
                placeholder="Seller / supplier name" className={inputClass} />
            </Field>
            <Field label="Phone">
              <input type="tel" inputMode="numeric" value={sellerPhone}
                onChange={e => onSellerPhoneChange(e.target.value)}
                placeholder="Mobile no." className={inputClass} />
            </Field>
          </div>
          <div className="flex gap-3">
            <Field label="Seller Address">
              <input type="text" value={sellerAddress} onChange={e => onSellerAddressChange(e.target.value)}
                placeholder="Optional" className={inputClass} />
            </Field>
            <Field label="Seller PAN No.">
              <input type="text" value={sellerPan} onChange={e => onSellerPanChange(e.target.value.toUpperCase())}
                placeholder="Optional" className={inputClass} />
            </Field>
          </div>
        </>
      )}
    </div>
  );
}
