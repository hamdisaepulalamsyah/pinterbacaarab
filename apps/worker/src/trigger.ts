import { createWorkerSupabaseClient } from './index';

async function main() {
  const supabase = createWorkerSupabaseClient();
  console.log('--- MENGIRIM TEST JOB REALTIME KE VPS WORKER ---');

  const { data: users } = await supabase.auth.admin.listUsers();
  const userId = users!.users[0].id;

  const sampleHadith = 'ذهب أهل الدثور بالأجور، يصلون كما نصلي، ويصومون كما نصوم.';
  const { data: doc, error: docErr } = await supabase
    .from('documents')
    .insert({
      user_id: userId,
      title: 'Uji Coba Live Worker VPS Linode',
      source_name: 'Shahih Muslim',
      source_text: sampleHadith,
      detail: 'full',
      status: 'queued',
    })
    .select()
    .single();

  if (docErr) throw docErr;
  console.log('Dokumen dibuat:', doc.id);

  const { data: job, error: jobErr } = await supabase
    .from('jobs')
    .insert({
      document_id: doc.id,
      user_id: userId,
      kind: 'process',
      status: 'pending',
    })
    .select()
    .single();

  if (jobErr) throw jobErr;
  console.log('Job antrean dibuat:', job.id);
  console.log('Worker di VPS akan otomatis mengklaim dan memproses job ini!');
}

main().catch(console.error);
