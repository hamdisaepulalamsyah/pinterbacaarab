import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = createAdminClient();

    // 1. Ambil dokumen
    const { data: doc, error } = await admin.from('documents').select('*').eq('id', id).single();

    if (error || !doc) {
      return NextResponse.json({ error: 'Dokumen tidak ditemukan.' }, { status: 404 });
    }

    // 2. Buat job ekspor PDF
    const { data: job, error: jobErr } = await admin
      .from('jobs')
      .insert({
        document_id: doc.id,
        user_id: doc.user_id,
        kind: 'export',
        status: 'pending',
      })
      .select()
      .single();

    if (jobErr) {
      return NextResponse.json({ error: jobErr.message }, { status: 500 });
    }

    // Jika sudah ada pdf_path, buat signed URL langsung
    let downloadUrl = null;
    if (doc.pdf_path) {
      const { data: urlData } = await admin.storage
        .from('exports')
        .createSignedUrl(doc.pdf_path, 600);
      downloadUrl = urlData?.signedUrl || null;
    }

    return NextResponse.json({
      jobId: job.id,
      downloadUrl,
      status: 'pending',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
