import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const USER_COOKIE_NAME = 'pba_user_id';

/**
 * Mendapatkan atau membuat ID pengguna unik untuk sesi perangkat saat ini.
 * Memastikan arsip kajian bersifat privat per pengunjung dan tidak bercampur.
 */
export async function getOrCreateSessionUserId(
  req: NextRequest,
  res?: NextResponse,
): Promise<{ userId: string; isNew: boolean }> {
  const admin = createAdminClient();

  // 1. Cek apakah ada cookie user id tersimpan
  const existingUserId =
    req.cookies.get(USER_COOKIE_NAME)?.value ||
    req.headers.get('x-user-id');

  if (existingUserId) {
    // Verifikasi bahwa user id valid di Supabase Auth
    try {
      const { data: userRecord } = await admin.auth.admin.getUserById(existingUserId);
      if (userRecord?.user) {
        return { userId: existingUserId, isNew: false };
      }
    } catch {
      // Abaikan dan lanjutkan membuat baru jika id lama sudah tidak ada
    }
  }

  // 2. Buat akun anonim unik untuk pengunjung ini
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const userAgent = req.headers.get('user-agent') || 'Browser Web';
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'Local';

  const { data: created, error } = await admin.auth.admin.createUser({
    email: `pengguna_${randomSuffix}_${Date.now()}@pinterbacaarab.local`,
    password: `PbaPass_${Math.random().toString(36).substring(2, 12)}!`,
    email_confirm: true,
    user_metadata: {
      user_agent: userAgent,
      ip_address: ip,
      created_at: new Date().toISOString(),
      display_name: `Pengguna ${randomSuffix.toUpperCase()}`,
    },
  });

  if (error || !created.user) {
    throw new Error(`Gagal membuat sesi pengguna: ${error?.message || 'Unknown error'}`);
  }

  const newUserId = created.user.id;

  // 3. Pasang cookie 1 tahun pada response jika diberikan
  if (res) {
    res.cookies.set(USER_COOKIE_NAME, newUserId, {
      path: '/',
      maxAge: 365 * 24 * 60 * 60, // 1 tahun
      sameSite: 'lax',
      httpOnly: false, // bisa diakses client-side untuk state
    });
  }

  return { userId: newUserId, isNew: true };
}
