-- ============================================================
-- Central de gestão — schema do banco de dados (Supabase / Postgres)
-- Como usar: no painel do Supabase, vá em "SQL Editor" > "New query",
-- cole todo este arquivo e clique em "Run". Só precisa fazer isso uma vez.
-- ============================================================

-- Tabela única de dados: guarda cada "área" do sistema (motoboys, caixa,
-- colaboradores, escala, usuários, auditoria etc.) como uma linha,
-- identificada por uma chave (key) e o conteúdo em formato JSON (value).
create table if not exists kv_store (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Segurança em nível de linha (RLS): sem isso, o Supabase bloqueia
-- qualquer acesso à tabela por padrão.
alter table kv_store enable row level security;

-- IMPORTANTE — leia isto:
-- As políticas abaixo liberam leitura e escrita para qualquer pessoa que
-- tenha a "chave anon public" do seu projeto (a mesma chave que fica no
-- index.html). Isso é o mesmo nível de proteção que já existia no
-- protótipo: controla o uso do dia a dia, mas não é segurança de nível
-- bancário. Se no futuro você quiser travar isso de verdade (ex: só quem
-- fez login pode ler/escrever), me avise — dá pra evoluir sem perder dados.

drop policy if exists "permite leitura" on kv_store;
create policy "permite leitura"
  on kv_store for select
  using (true);

drop policy if exists "permite inserir" on kv_store;
create policy "permite inserir"
  on kv_store for insert
  with check (true);

drop policy if exists "permite atualizar" on kv_store;
create policy "permite atualizar"
  on kv_store for update
  using (true);

-- Índice para consultas rápidas por data de atualização (útil se um dia
-- quisermos relatórios de "o que mudou recentemente").
create index if not exists kv_store_updated_at_idx on kv_store (updated_at desc);
