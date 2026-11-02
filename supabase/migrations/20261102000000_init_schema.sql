-- Supabase Initial Schema for Nahwu Studio
create extension if not exists "pgcrypto";

create type doc_status as enum
  ('draft','queued','processing','needs_review','ready','exporting','exported','failed');
create type job_kind as enum ('process','regenerate','export');
create type job_status as enum ('pending','running','done','failed');
create type detail_level as enum ('brief','full');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  daily_quota int not null default 20,
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  source_name text,
  source_text text not null,
  detail detail_level not null default 'full',
  status doc_status not null default 'draft',
  word_count int not null default 0,
  pdf_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists segments (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  position int not null,
  source_text text not null,
  title text,
  arabic_vocalized text,
  translation_id text,
  status text not null default 'pending',  -- pending|ok|needs_review|failed
  error text,
  unique (document_id, position)
);

create table if not exists words (
  id uuid primary key default gen_random_uuid(),
  segment_id uuid not null references segments(id) on delete cascade,
  position int not null,
  ar text not null,
  meaning_id text,
  nahwu text,
  sharf_root text,
  sharf_wazan text,
  sharf_tashrif text,
  sharf_note text,
  confidence numeric(3,2),
  checked boolean not null default false,
  edited boolean not null default false,
  unique (segment_id, position)
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind job_kind not null,
  status job_status not null default 'pending',
  progress_done int not null default 0,
  progress_total int not null default 0,
  attempts int not null default 0,
  payload jsonb,
  error text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz
);

create index if not exists idx_documents_user on documents (user_id, created_at desc);
create index if not exists idx_segments_doc on segments (document_id, position);
create index if not exists idx_words_segment on words (segment_id, position);
create index if not exists idx_jobs_status on jobs (status, created_at);

-- Worker Job Claim RPC
create or replace function claim_job() returns jobs
language plpgsql security definer as $$
declare j jobs;
begin
  select * into j from jobs
   where status = 'pending'
   order by created_at
   for update skip locked limit 1;
  if found then
    update jobs set status='running', started_at=now(), attempts=attempts+1
     where id = j.id returning * into j;
  end if;
  return j;
end $$;

-- Updated_at trigger
create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end $$ language plpgsql;

drop trigger if exists t_docs_touch on documents;
create trigger t_docs_touch before update on documents
for each row execute function touch_updated_at();

-- RLS
alter table profiles  enable row level security;
alter table documents enable row level security;
alter table segments  enable row level security;
alter table words     enable row level security;
alter table jobs      enable row level security;

drop policy if exists own_profile on profiles;
create policy own_profile on profiles for all using (id = auth.uid());

drop policy if exists own_docs on documents;
create policy own_docs on documents for all using (user_id = auth.uid());

drop policy if exists own_jobs on jobs;
create policy own_jobs on jobs for select using (user_id = auth.uid());

drop policy if exists own_segments on segments;
create policy own_segments on segments for all using (
  exists (select 1 from documents d where d.id = document_id and d.user_id = auth.uid()));

drop policy if exists own_words on words;
create policy own_words on words for all using (
  exists (select 1 from segments s join documents d on d.id = s.document_id
          where s.id = segment_id and d.user_id = auth.uid()));
