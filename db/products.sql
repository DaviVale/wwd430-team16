-- Product listings. Each belongs to a seller (sellers.userId). A seller manages
-- their own listings from /account/listings.
create table if not exists public.products (
  id            text primary key default gen_random_uuid()::text,
  "sellerId"    text not null references public.sellers("userId") on delete cascade,
  title         text not null,
  slug          text not null unique,
  description   text,
  "priceCents"  integer not null default 0 check ("priceCents" >= 0),
  category      text not null default 'other',
  "imageUrl"    text,
  "imagePath"   text,
  "createdAt"   timestamp without time zone not null default now(),
  "updatedAt"   timestamp without time zone not null default now()
);

create index if not exists products_seller_idx on public.products ("sellerId");
create index if not exists products_category_idx on public.products (category);

-- Reuse the shared trigger function that stamps NEW."updatedAt" = now().
drop trigger if exists update_products_updated_at on public.products;
create trigger update_products_updated_at
  before update on public.products
  for each row execute function public.update_updated_at_column();
