import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromBuffer } from '@/lib/extract-text';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'File dokumen wajib diunggah.' },
        { status: 400 },
      );
    }

    // Batas ukuran 15MB
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file melebihi batas maksimal 15MB.' },
        { status: 400 },
      );
    }

    // Ekstensi yang didukung
    const ext = file.name.toLowerCase().split('.').pop() || '';
    const allowedExts = ['pdf', 'txt', 'docx', 'doc'];
    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        { error: `Format file .${ext} tidak didukung. Gunakan PDF, TXT, atau DOCX.` },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await extractTextFromBuffer(buffer, file.name, file.type);

    if (!result.text || result.text.trim().length === 0) {
      return NextResponse.json(
        {
          error:
            'Tidak dapat menemukan teks pada dokumen ini. Pastikan dokumen memuat teks Arab yang jelas atau bukan file kosong.',
        },
        { status: 422 },
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Error in /api/documents/extract:', err);
    return NextResponse.json(
      { error: err.message || 'Terjadi kegagalan saat mengekstrak dokumen.' },
      { status: 500 },
    );
  }
}
