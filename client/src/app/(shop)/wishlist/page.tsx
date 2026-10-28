"use client";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, X } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistActions } from "@/hooks/useWishlist";
import { useHydrated } from "@/hooks/useHydrated";
import { formatPrice, PLACEHOLDER_IMAGE } from "@/lib/format";
import type { Product, WishlistItem } from "@/types";

const toProduct = (i: WishlistItem): Product => ({
  _id: i._id,
  slug: i.slug,
  title: i.title,
  price: i.price,
  originalPrice: i.originalPrice,
  discountPercent: 0,
  images: i.image ? [{ url: i.image }] : [],
  stock: i.stock,
  inStock: i.inStock,
  createdAt: "",
});

export default function WishlistPage() {
  const hydrated = useHydrated();
  const items = useWishlistStore((s) => s.items);
  const add = useCartStore((s) => s.add);
  const { remove } = useWishlistActions();

  const moveToCart = async (item: WishlistItem) => {
    add(toProduct(item));
    await remove(item._id);
  };

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8">
      <h1 className="text-3xl font-bold">Wishlist <span className="text-lg font-normal text-base-content/50">(পছন্দের তালিকা)</span></h1>

      {!hydrated ? (
        <div className="mt-6 h-40 animate-pulse rounded-box bg-base-300/60" />
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-box border border-dashed border-base-300 bg-base-100 p-12 text-center">
          <Heart size={40} className="mx-auto text-base-content/30" />
          <p className="mt-3 font-semibold">Your wishlist is empty</p>
          <p className="text-sm text-base-content/60">Tap the heart on any product to save it here.</p>
          <Link href="/products" className="btn btn-primary btn-sm mt-4">Browse products</Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-box border border-base-300/70 bg-base-100">
          <table className="table">
            <thead>
              <tr><th className="w-10"><span className="sr-only">Remove</span></th><th colSpan={2}>Product</th><th className="text-right">Price</th><th className="text-right">Actions</th></tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const soldOut = !item.inStock || item.stock <= 0;
                return (
                  <tr key={item._id} className="hover:bg-base-200/40">
                    <td><button onClick={() => remove(item._id)} aria-label={`Remove ${item.title} from wishlist`} className="text-error hover:scale-110"><X size={18} /></button></td>
                    <td className="w-20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image ?? PLACEHOLDER_IMAGE} alt="" className="size-16 rounded-lg object-cover" />
                    </td>
                    <td>
                      <Link href={`/products/${item.slug}`} className="font-medium hover:text-secondary">{item.title}</Link>
                      {soldOut && <p className="text-xs font-medium text-error">Out of stock</p>}
                    </td>
                    <td className="text-right">
                      {item.originalPrice && item.originalPrice > item.price && <span className="mr-2 text-xs text-base-content/45 line-through">{formatPrice(item.originalPrice)}</span>}
                      <span className="font-bold text-accent">{formatPrice(item.price)}</span>
                    </td>
                    <td>
                      <div className="flex flex-wrap justify-end gap-2">
                        <button className="btn btn-sm btn-outline btn-secondary gap-1.5" disabled={soldOut} onClick={() => add(toProduct(item))}><ShoppingCart size={14} /> Add to cart</button>
                        <button className="btn btn-sm btn-primary gap-1.5" disabled={soldOut} onClick={() => moveToCart(item)}><Trash2 size={14} /> Move to cart</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
