-- profiles table mirrors the types defined in src/lib/database.types.ts
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  nickname text,
  phone text,
  email text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;

create policy if not exists "Users can read their profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy if not exists "Users can insert their profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy if not exists "Users can update their profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists handle_profiles_updated_at on public.profiles;

create trigger handle_profiles_updated_at
before update on public.profiles
for each row
execute procedure public.handle_profiles_updated_at();
