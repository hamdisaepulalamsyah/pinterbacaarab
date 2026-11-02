import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: job, error } = await supabase
      .from('jobs')
      .select('*, documents(*)')
      .eq('id', id)
      .single();

    if (error || !job) {
      return NextResponse.json({ error: 'Job tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      id: job.id,
      documentId: job.document_id,
      status: job.status,
      progressDone: job.progress_done,
      progressTotal: job.progress_total,
      documentStatus: job.documents?.status,
      error: job.error,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
