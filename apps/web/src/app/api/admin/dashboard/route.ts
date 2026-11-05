import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const ADMIN_KEY = process.env.ADMIN_KEY || 'hamdipyxis';

export async function GET(req: NextRequest) {
  try {
    const key =
      req.headers.get('x-admin-key') ||
      req.nextUrl.searchParams.get('key');

    if (key !== ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Akses ditolak. Kunci rahasia admin tidak valid.' },
        { status: 401 },
      );
    }

    const admin = createAdminClient();

    // 1. Ambil seluruh dokumen
    const { data: documents, error: docErr } = await admin
      .from('documents')
      .select('id, user_id, title, source_name, word_count, status, pdf_path, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (docErr) {
      throw new Error(`Gagal mengambil data dokumen: ${docErr.message}`);
    }

    // 2. Ambil daftar users dari auth.users
    const { data: usersData, error: userErr } = await admin.auth.admin.listUsers();
    if (userErr) {
      throw new Error(`Gagal mengambil data pengguna: ${userErr.message}`);
    }

    const allUsers = usersData?.users || [];
    const userMap = new Map<string, any>();

    for (const u of allUsers) {
      userMap.set(u.id, {
        id: u.id,
        email: u.email,
        displayName: u.user_metadata?.display_name || u.email?.split('@')[0] || 'Tamu',
        userAgent: u.user_metadata?.user_agent || 'Peramban Web',
        ipAddress: u.user_metadata?.ip_address || 'Lokal',
        createdAt: u.created_at,
        docCount: 0,
        totalWords: 0,
        lastDocDate: null,
      });
    }

    // Hitung aggregasi per user
    let totalWordsAll = 0;
    const docsWithUser = (documents || []).map((doc) => {
      totalWordsAll += doc.word_count || 0;
      const u = userMap.get(doc.user_id);
      if (u) {
        u.docCount += 1;
        u.totalWords += doc.word_count || 0;
        if (!u.lastDocDate || new Date(doc.created_at) > new Date(u.lastDocDate)) {
          u.lastDocDate = doc.created_at;
        }
      }
      return {
        ...doc,
        creator: u
          ? {
              displayName: u.displayName,
              email: u.email,
              userAgent: u.userAgent,
            }
          : { displayName: 'Pengguna Sistem', email: doc.user_id },
      };
    });

    // Urutkan pengguna berdasarkan naskah terbanyak / terakhir aktif
    const userList = Array.from(userMap.values())
      .filter((u) => u.docCount > 0 || new Date().getTime() - new Date(u.createdAt).getTime() < 86400000)
      .sort((a, b) => b.docCount - a.docCount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      metrics: {
        totalDocuments: documents?.length || 0,
        totalUsers: userList.length,
        totalWords: totalWordsAll,
        statusBreakdown: {
          ready: documents?.filter((d) => d.status === 'ready').length || 0,
          needs_review: documents?.filter((d) => d.status === 'needs_review').length || 0,
          processing: documents?.filter((d) => d.status === 'processing' || d.status === 'queued').length || 0,
          exported: documents?.filter((d) => d.status === 'exported' || d.pdf_path).length || 0,
        },
      },
      users: userList,
      documents: docsWithUser,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Terjadi kesalahan sistem admin.' },
      { status: 500 },
    );
  }
}
