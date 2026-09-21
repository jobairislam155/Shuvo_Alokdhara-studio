import { NextRequest, NextResponse } from 'next/server';
import { submitInquiry } from '@/lib/supabase/queries';

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const required = ['name', 'email', 'phone', 'eventType', 'eventDate', 'message'];
  const missing = required.filter((key) => !body[key]?.trim());
  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: `Missing required fields: ${missing.join(', ')}` },
      { status: 400 },
    );
  }

  const result = await submitInquiry({
    name: body.name ?? '',
    email: body.email ?? '',
    phone: body.phone ?? '',
    event_type: body.eventType ?? '',
    event_date: body.eventDate ?? '',
    location: body.location ?? '',
    budget: body.budget ?? '',
    service: body.service ?? '',
    message: body.message ?? '',
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error ?? 'Unable to send inquiry.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
