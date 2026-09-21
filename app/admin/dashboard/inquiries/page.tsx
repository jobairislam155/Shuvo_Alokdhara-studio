import { createServerSupabaseClient } from '@/lib/supabase/server';
import { deleteInquiry } from '@/lib/supabase/admin-actions';
import { InquiryStatusForm } from '@/components/admin/InquiryStatusForm';

export default async function AdminInquiriesPage() {
  const supabase = createServerSupabaseClient();
  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl text-ink-50">Inquiries</h1>

      <div className="divide-y divide-ink-400 border-t border-ink-400">
        {inquiries?.map((inquiry) => (
          <div key={inquiry.id} className="flex flex-wrap items-start justify-between gap-4 py-5">
            <div className="max-w-xl">
              <p className="font-serif text-lg text-ink-50">{inquiry.name}</p>
              <p className="font-sans text-xs uppercase tracking-widest text-ink-200">
                {inquiry.email} · {inquiry.phone} · {inquiry.event_type}
                {inquiry.event_date ? ` · ${inquiry.event_date}` : ''}
              </p>
              {inquiry.message && (
                <p className="mt-2 font-sans text-sm text-ink-100">{inquiry.message}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <InquiryStatusForm id={inquiry.id} status={inquiry.status} />
              <form action={deleteInquiry}>
                <input type="hidden" name="id" value={inquiry.id} />
                <button className="font-sans text-xs uppercase tracking-widest text-danger hover:text-danger-hover">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {!inquiries?.length && (
          <p className="py-6 font-sans text-sm text-ink-200">No inquiries yet.</p>
        )}
      </div>
    </div>
  );
}
