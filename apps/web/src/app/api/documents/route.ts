import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { countWords } from '@pinterbacaarab/shared';
import { getOrCreateSessionUserId, USER_COOKIE_NAME } from '@/lib/user-session';

export async function POST(req: NextRequest) {
  try {
    const admin = createAdminClient();
    const body = await req.json();

    const { title, source_name, source_text, detail } = body;

    if (!source_text || typeof source_text !== 'string' || !source_text.trim()) {
      return NextResponse.json({ error: 'Teks sumber Arab wajib diisi.' }, { status: 400 });
    }

    const words = countWords(source_text);
    if (words > 3000) {
      return NextResponse.json(
        { error: 'Batas teks maksimal adalah 3.000 kata per dokumen.' },
        { status: 400 },
      );
    }

    // 1. Dapatkan atau buat akun unik per perangkat pengunjung
    const { userId } = await getOrCreateSessionUserId(req);

    // 2. Simpan dokumen via admin client
    const { data: doc, error: docError } = await admin
      .from('documents')
      .insert({
        user_id: userId,
        title: title?.trim() || 'Kajian Dokumen Tanpa Judul',
        source_name: source_name?.trim() || null,
        source_text: source_text.trim(),
        detail: detail === 'brief' ? 'brief' : 'full',
        word_count: words,
        status: 'queued',
      })
      .select()
      .single();

    if (docError || !doc) {
      return NextResponse.json(
        { error: `Gagal membuat dokumen: ${docError?.message}` },
        { status: 500 },
      );
    }

    // 3. Buat job antrean
    const { data: job, error: jobError } = await admin
      .from('jobs')
      .insert({
        document_id: doc.id,
        user_id: userId,
        kind: 'process',
        status: 'pending',
      })
      .select()
      .single();

    if (jobError || !job) {
      return NextResponse.json(
        { error: `Gagal membuat antrean job: ${jobError?.message}` },
        { status: 500 },
      );
    }

    const res = NextResponse.json({
      documentId: doc.id,
      jobId: job.id,
      status: 'queued',
    });

    // Pasang cookie user ID agar perangkat mengingat arsipnya secara permanen
    res.cookies.set(USER_COOKIE_NAME, userId, {
      path: '/',
      maxAge: 365 * 24 * 60 * 60,
      sameSite: 'lax',
      httpOnly: false,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Terjadi kesalahan server.' },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = createAdminClient();
    const { userId } = await getOrCreateSessionUserId(req);

    // Hanya ambil dokumen milik pengguna/perangkat ini (arsip privat)
    const { data, error } = await admin
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const res = NextResponse.json({ documents: data || [] });

    // Pastikan cookie tersimpan pada browser
    res.cookies.set(USER_COOKIE_NAME, userId, {
      path: '/',
      maxAge: 365 * 24 * 60 * 60,
      sameSite: 'lax',
      httpOnly: false,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
