"use client";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useWishlistActions } from "@/hooks/useWishlist";
import { useHydrated } from "@/hooks/useHydrated";
import { formatPrice, PLACEHOLDER_IMAGE } from "@/lib/format";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const hydrated = useHydrated();
  const add = useCartStore((s) => s.add);
  const wished = useWishlistStore((s) => s.items.some((i) => i._id === product._id));
  const { toggle } = useWishlistActions();
  const soldOut = !product.inStock || product.stock <= 0;
  const isWished = hydrated && wished;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-box border border-base-300/70 bg-base-100 transition-transform duration-300 hover:z-10 hover:scale-[1.03] hover:shadow-xl hover:shadow-secondary/10">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-base-200" aria-label={product.title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images?.[0]?.url ?? PLACEHOLDER_IMAGE}
          alt={product.title}
          loading="lazy"
          className={`size-full object-cover transition-transform duration-500 group-hover:scale-110 ${soldOut ? "opacity-60 grayscale-[0.4]" : ""}`}
        />
        {product.discountPercent > 0 && !soldOut && (
          <span className="absolute left-2 top-2 rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-accent-content">-{product.discountPercent}%</span>
        )}
        {soldOut && <span className="absolute left-2 top-2 rounded-md bg-neutral px-2 py-0.5 text-xs font-semibold text-neutral-content">Out of stock</span>}
      </Link>

      <button
        onClick={() => toggle(product)}
        aria-pressed={isWished}
        aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-white/95 shadow transition-transform hover:scale-110"
      >
        <Heart size={18} className={isWished ? "fill-accent text-accent" : "text-base-content/60"} />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3">
        {product.category && <p className="text-xs text-base-content/55">{product.category.name}</p>}
        <Link href={`/products/${product.slug}`} className="line-clamp-2 min-h-[2.75rem] text-sm font-medium leading-snug hover:text-secondary">
          {product.title}
        </Link>
        <p className="mt-auto flex items-baseline gap-2">
          <span className="text-base font-bold text-accent">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-base-content/45 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </p>
        <button onClick={() => add(product)} disabled={soldOut} className="btn btn-sm btn-outline btn-secondary w-full gap-2">
          <ShoppingCart size={15} /> {soldOut ? "Unavailable" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
