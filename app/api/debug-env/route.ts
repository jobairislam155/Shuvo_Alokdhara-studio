import { NextResponse } from 'next/server';

// TEMPORARY diagnostic route — confirms whether Vercel is passing the
// Supabase/Cloudinary env vars into the running app, without ever
// exposing the secret values themselves. Delete this file once the
// admin panel works.
export async function GET() {
  const mask = (v: string | undefined) => (v ? `set (${v.length} chars, starts "${v.slice(0, 8)}")` : 'MISSING');

  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: mask(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: mask(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: mask(process.env.SUPABASE_SERVICE_ROLE_KEY),
    ADMIN_SETUP_CODE: mask(process.env.ADMIN_SETUP_CODE),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: mask(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
  });
}