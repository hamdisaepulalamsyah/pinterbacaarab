import { createWorkerSupabaseClient } from './index';
import fs from 'fs';

async function main() {
  const supabase = createWorkerSupabaseClient();
  const docId = 'ebaf8586-064d-45ff-a222-c0b8d5031e4d';

  const { data: doc } = await supabase.from('documents').select('*').eq('id', docId).single();
  console.log('Dokumen status:', doc.status);
  console.log('PDF Path di Storage:', doc.pdf_path);

  const { data: urlData, error } = await supabase.storage
    .from('exports')
    .createSignedUrl(doc.pdf_path, 300);

  if (error) throw error;
  console.log('Signed Download URL:', urlData.signedUrl);

  const { data: downloadBlob } = await supabase.storage.from('exports').download(doc.pdf_path);
  const buffer = Buffer.from(await downloadBlob!.arrayBuffer());

  const localSavedPath = 'C:\\Users\\Kamila\\Documents\\pinterbacaarab\\hasil_kajian_contoh.pdf';
  fs.writeFileSync(localSavedPath, buffer);
  console.log('PDF berhasil diunduh dan disimpan ke:', localSavedPath);
  console.log('Ukuran PDF:', buffer.length, 'bytes');
}

main().catch(console.error);
