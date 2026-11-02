import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = createAdminClient();

    const { data: doc, error } = await admin
      .from('documents')
      .select('*, segments(*, words(*))')
      .eq('id', id)
      .single();

    if (error || !doc) {
      return NextResponse.json({ error: 'Dokumen tidak ditemukan.' }, { status: 404 });
    }

    // Ambil signed URL PDF jika sudah ada
    let downloadUrl: string | null = null;
    if (doc.pdf_path) {
      const { data: urlData } = await admin.storage
        .from('exports')
        .createSignedUrl(doc.pdf_path, 600);
      downloadUrl = urlData?.signedUrl || null;
    }

    return NextResponse.json({
      document: doc,
      downloadUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
