'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Invoice } from '@/types';
import { getDb } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { flushPendingInvoices } from '@/lib/sync';
import { useOnlineStatus } from './useOnlineStatus';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const isOnline = useOnlineStatus();

  const loadInvoices = useCallback(async (search?: string) => {
    const db = getDb();
    let query = db.invoices.orderBy('createdAt').reverse();

    const all = await query.toArray();

    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      const filtered = all.filter(
        (inv) =>
          (inv.buyerName || inv.customerName || '').toLowerCase().includes(term) ||
          inv.invoiceNumber.toLowerCase().includes(term) ||
          (inv.items ?? []).some(it => it.itemName.toLowerCase().includes(term)),
      );
      setInvoices(filtered);
    } else {
      setInvoices(all);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  // Flush pending when coming back online
  useEffect(() => {
    if (isOnline && supabase) {
      flushPendingInvoices(supabase).catch(() => {
        // Silently ignore sync errors — will retry next time
      });
    }
  }, [isOnline]);

  const saveInvoice = useCallback(async (invoice: Invoice): Promise<void> => {
    const db = getDb();

    // Always write locally first
    await db.invoices.put(invoice);

    // Optimistically update UI
    setInvoices((prev) => [invoice, ...prev]);

    if (isOnline && supabase) {
      try {
        await flushPendingInvoices(supabase);
        // Refresh the local record to reflect 'synced' status
        const updated = await db.invoices.get(invoice.id);
        if (updated) {
          setInvoices((prev) =>
            prev.map((inv) => (inv.id === updated.id ? updated : inv)),
          );
        }
      } catch {
        // Sync failed — local record stays as 'pending'
      }
    }
  }, [isOnline]);

  const getInvoiceById = useCallback(async (id: string): Promise<Invoice | undefined> => {
    return getDb().invoices.get(id);
  }, []);

  const todayCount = useCallback(async (): Promise<number> => {
    const db = getDb();
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

    return db.invoices
      .where('createdAt')
      .between(startOfDay, endOfDay)
      .count();
  }, []);

  return {
    invoices,
    loading,
    saveInvoice,
    getInvoiceById,
    loadInvoices,
    todayCount,
  };
}
