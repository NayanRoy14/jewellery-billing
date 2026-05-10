'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BillingInput, BillingResult, BillingItem, MakingChargeType } from '@/types';
import { computeBilling } from '@/lib/billing';
import { generateId } from '@/lib/utils';

function newItem(): BillingItem {
  return {
    id: generateId(),
    itemName: '',
    hsnCode: '',
    weightGrams: '',
    makingChargeType: 'percentage',
    makingChargeValue: '',
    hallmarkCharge: '',
  };
}

const DEFAULT_INPUT: BillingInput = {
  buyerName: '',
  buyerPhone: '',
  buyerAddress: '',
  buyerPan: '',
  sellerName: '',
  sellerPhone: '',
  sellerAddress: '',
  sellerPan: '',
  goldRate: '',
  items: [],
  discount: '',
  gstPercent: 3,
};

export function useBillingCalculator(defaultGoldRate?: number, defaultGst?: number) {
  const [input, setInput] = useState<BillingInput>(() => ({
    ...DEFAULT_INPUT,
    goldRate: defaultGoldRate || '',
    gstPercent: defaultGst ?? 3,
    items: [newItem()],
  }));
  const [result, setResult] = useState<BillingResult | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setResult(computeBilling(input));
    }, 150);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  const setField = useCallback(<K extends keyof Omit<BillingInput, 'items'>>(
    field: K,
    value: BillingInput[K],
  ) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateItem = useCallback(<K extends keyof BillingItem>(
    index: number,
    field: K,
    value: BillingItem[K],
  ) => {
    setInput((prev) => {
      const items = prev.items.map((it, i) =>
        i === index ? { ...it, [field]: value } : it,
      );
      return { ...prev, items };
    });
  }, []);

  const setItemMakingChargeType = useCallback((index: number, type: MakingChargeType) => {
    setInput((prev) => {
      const items = prev.items.map((it, i) =>
        i === index ? { ...it, makingChargeType: type, makingChargeValue: '' as const } : it,
      );
      return { ...prev, items };
    });
  }, []);

  const addItem = useCallback(() => {
    setInput((prev) => ({ ...prev, items: [...prev.items, newItem()] }));
  }, []);

  const removeItem = useCallback((index: number) => {
    setInput((prev) => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((_, i) => i !== index) : prev.items,
    }));
  }, []);

  const reset = useCallback(() => {
    setInput({
      ...DEFAULT_INPUT,
      goldRate: defaultGoldRate || '',
      gstPercent: defaultGst ?? 3,
      items: [newItem()],
    });
    setResult(null);
  }, [defaultGoldRate, defaultGst]);

  const isValid =
    input.buyerName.trim() !== '' &&
    input.buyerPhone.trim() !== '' &&
    input.goldRate !== '' &&
    (input.goldRate as number) > 0 &&
    input.gstPercent !== '' &&
    (input.gstPercent as number) >= 0 &&
    input.items.some(
      (it) => it.weightGrams !== '' && (it.weightGrams as number) > 0,
    );

  return { input, result, isValid, setField, updateItem, setItemMakingChargeType, addItem, removeItem, reset };
}
