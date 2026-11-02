import { createWorkerSupabaseClient } from './index';

async function main() {
  const supabase = createWorkerSupabaseClient();
  const docId = 'ebaf8586-064d-45ff-a222-c0b8d5031e4d';

  const { data: doc } = await supabase.from('documents').select('*').eq('id', docId).single();

  const { data: job, error } = await supabase
    .from('jobs')
    .insert({
      document_id: docId,
      user_id: doc!.user_id,
      kind: 'export',
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  console.log('Job ekspor PDF dibuat:', job.id);
}

main().catch(console.error);
