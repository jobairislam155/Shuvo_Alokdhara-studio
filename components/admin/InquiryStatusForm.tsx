'use client';

import { useTransition } from 'react';
import { updateInquiryStatus } from '@/lib/supabase/admin-actions';
import type { InquiryStatus } from '@/types';

const statuses: InquiryStatus[] = ['new', 'contacted', 'booked', 'archived'];

export function InquiryStatusForm({ id, status }: { id: string; status: string }) {
  const [, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      onChange={(e) => {
        const formData = new FormData();
        formData.set('id', id);
        formData.set('status', e.target.value);
        startTransition(() => {
          updateInquiryStatus(formData);
        });
      }}
      className="admin-input py-1.5 text-xs"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
