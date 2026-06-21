create table if not exists public.support_conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_id text,
  user_email text,
  language text not null default 'zh',
  status text not null default 'open',
  page_path text,
  page_title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.support_conversations(id) on delete cascade,
  sender text not null check (sender in ('visitor', 'agent', 'system')),
  author text not null default '',
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists support_conversations_last_message_idx
  on public.support_conversations(last_message_at desc);

create index if not exists support_messages_conversation_created_idx
  on public.support_messages(conversation_id, created_at asc);

alter table public.support_conversations enable row level security;
alter table public.support_messages enable row level security;

-- The q-c.hk API routes use SUPABASE_SERVICE_ROLE_KEY, so no public RLS policy
-- is required for this independent customer-service backend.
