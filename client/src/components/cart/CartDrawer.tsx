"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { cartSubtotal, useCartStore } from "@/store/useCartStore";
import { useHydrated } from "@/hooks/useHydrated";
import { formatPrice, PLACEHOLDER_IMAGE } from "@/lib/format";

export default function CartDrawer() {
  const hydrated = useHydrated();
  const pathname = usePathname();
  const { items, isOpen, close, setQuantity, remove } = useCartStore();
  const subtotal = cartSubtotal(items);

  useEffect(() => close(), [pathname, close]);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <div className={`fixed inset-0 z-50 transition-[visibility] duration-300 ${isOpen ? "visible" : "pointer-events-none invisible"}`} aria-hidden={!isOpen}>
      <div onClick={close} className={`absolute inset-0 bg-neutral/60 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-base-100 shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between border-b border-base-300 px-5 py-4">
          <h2 className="text-lg font-bold">Shopping cart</h2>
          <button onClick={close} className="btn btn-ghost btn-circle btn-sm" aria-label="Close cart"><X size={20} /></button>
        </header>

        {!hydrated || items.length === 0 ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <ShoppingBag size={44} className="mx-auto text-base-content/30" />
              <p className="mt-3 font-medium">Your cart is empty</p>
              <p className="text-sm text-base-content/60">Add a product and it will show up here.</p>
              <Link href="/products" className="btn btn-primary btn-sm mt-4">Browse products</Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-base-200 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 py-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image ?? PLACEHOLDER_IMAGE} alt="" className="size-20 rounded-lg bg-base-200 object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/products/${item.slug}`} className="line-clamp-2 text-sm font-medium hover:text-secondary">{item.title}</Link>
                      <button onClick={() => remove(item.productId)} aria-label={`Remove ${item.title}`} className="text-error"><X size={16} /></button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="join border border-base-300">
                        <button className="btn btn-ghost btn-xs join-item" aria-label="Decrease" onClick={() => setQuantity(item.productId, item.quantity - 1)}><Minus size={14} /></button>
                        <span className="join-item grid w-9 place-items-center text-sm font-semibold">{item.quantity}</span>
                        <button className="btn btn-ghost btn-xs join-item" aria-label="Increase" onClick={() => setQuantity(item.productId, item.quantity + 1)} disabled={item.quantity >= item.maxQty}><Plus size={14} /></button>
                      </div>
                      <p className="text-sm text-base-content/70">{item.quantity} × <span className="font-bold text-accent">{formatPrice(item.price)}</span></p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="space-y-3 border-t border-base-300 bg-base-200/60 px-5 py-5">
              <p className="flex items-center justify-between text-lg font-bold">
                <span>Subtotal</span><span className="text-accent">{formatPrice(subtotal)}</span>
              </p>
              <p className="text-xs text-base-content/60">Shipping is calculated at checkout.</p>
              <Link href="/cart" className="btn btn-outline w-full">View cart</Link>
              <Link href="/checkout" className="btn btn-accent w-full">Checkout</Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
