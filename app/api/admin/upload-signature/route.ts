import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/supabase/admin-auth';

export const dynamic = 'force-dynamic';

/**
 * Signs a Cloudinary upload for the admin dashboard. The API secret never
 * leaves the server — the browser only receives the resulting signature, and
 * only an authenticated admin can get one.
 */
export async function POST() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Not authorised.' }, { status: 401 });

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Cloudinary is not configured (cloud name, API key and API secret are required).' },
      { status: 500 },
    );
  }

  const folder = 'shuvo-photography';
  const timestamp = Math.floor(Date.now() / 1000);
  // Cloudinary signs the sorted request params (excluding file/api_key) + the secret.
  const signature = createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest('hex');

  return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature });
}
