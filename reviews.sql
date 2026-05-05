create table if not exists public.reviews (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null,
  utegym_name text not null,
  review_title text not null,
  review_text text not null,
  photo_url text,
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "Anyone can read reviews" on public.reviews;
create policy "Anyone can read reviews"
on public.reviews
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users can insert own reviews" on public.reviews;
create policy "Authenticated users can insert own reviews"
on public.reviews
for insert
to authenticated
with check (auth.uid() = user_id);
