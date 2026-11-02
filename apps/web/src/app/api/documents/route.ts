import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { countWords } from '@pinterbacaarab/shared';

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

    // Ambil atau buat akun default untuk user / guest
    let userId: string;
    const { data: usersData } = await admin.auth.admin.listUsers();
    if (usersData?.users && usersData.users.length > 0) {
      userId = usersData.users[0].id;
    } else {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: `guest_${Date.now()}@nahwustudio.local`,
        password: 'GuestPassword123!',
        email_confirm: true,
      });
      if (createErr || !created.user) {
        throw new Error(`Gagal inisialisasi akun pengguna: ${createErr?.message}`);
      }
      userId = created.user.id;
    }

    // 1. Simpan dokumen via admin client (melewati RLS)
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

    // 2. Buat job antrean
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

    return NextResponse.json({
      documentId: doc.id,
      jobId: job.id,
      status: 'queued',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Terjadi kesalahan server.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ documents: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
