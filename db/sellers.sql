-- Seller storefront profiles. One-to-one with a user (a user "becomes a seller"
-- by creating a row here). Keeps public storefront data separate from the
-- private account fields on `users`.
create table if not exists public.sellers (
  "userId"       text primary key references public.users(id) on delete cascade,
  "shopName"     text not null,
  slug           text not null unique,
  tagline        text,
  bio            text,
  location       text,
  specialties    text[] not null default '{}',
  "websiteUrl"   text,
  "instagramUrl" text,
  "createdAt"    timestamp without time zone not null default now(),
  "updatedAt"    timestamp without time zone not null default now()
);

-- Reuse the shared trigger function that stamps NEW."updatedAt" = now().
drop trigger if exists update_sellers_updated_at on public.sellers;
create trigger update_sellers_updated_at
  before update on public.sellers
  for each row execute function public.update_updated_at_column();
