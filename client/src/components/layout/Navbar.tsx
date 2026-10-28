"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LogIn, Menu, ReceiptText, ShoppingCart, X, LayoutDashboard, LogOut } from "lucide-react";
import SearchBar from "./SearchBar";
import { signOut, useSession } from "@/lib/auth-client";
import { useHydrated } from "@/hooks/useHydrated";
import { cartCount, useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { STORE } from "@/lib/constants";

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return <span className="badge badge-primary badge-sm indicator-item font-semibold">{count > 99 ? "99+" : count}</span>;
}

export default function Navbar() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartItems = useCartStore((s) => cartCount(s.items));
  const openCart = useCartStore((s) => s.open);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const user = session?.user;

  const handleSignOut = async () => {
    await signOut();
    useWishlistStore.getState().clear();
    (document.activeElement as HTMLElement | null)?.blur();
    router.push("/");
    router.refresh();
  };

  const linkCls = "rounded-lg px-3 py-2 text-sm font-medium text-neutral-content/90 transition-colors hover:bg-white/10 hover:text-white";
  // Icon buttons: always white so they are visible on the dark navbar (hover only adds a soft background)
  const iconBtn = "grid size-10 place-items-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-primary";

  return (
    <header className="sticky top-0 z-40 bg-neutral text-neutral-content shadow-lg shadow-neutral/20">
      <div className="mx-auto flex h-16 max-w-350 items-center gap-3 px-4 lg:gap-5">
        <button className={`${iconBtn} lg:hidden`} aria-label="Menu" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={STORE.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="h-10 w-auto drop-shadow-[0_0_8px_rgba(25,191,220,0.45)]" />
          <span className="hidden font-brand leading-[1.05] sm:block">
            <span className="block bg-gradient-to-r from-primary to-sky-200 bg-clip-text text-[15px] font-extrabold tracking-[0.18em] text-transparent">BROTHERS</span>
            <span className="block text-[11.5px] font-semibold tracking-[0.3em] text-white">CROCKERIES</span>
          </span>
        </Link>

        {/* Search + About/Contact */}
        <div className="hidden min-w-0 flex-1 items-center gap-2 lg:flex">
          <div className="max-w-xl flex-1">
            <Suspense fallback={<div className="h-10 rounded-lg bg-white/10" />}>
              <SearchBar />
            </Suspense>
          </div>
          <Link href="/about-us" className={linkCls}>About Us</Link>
          <Link href="/contact-us" className={linkCls}>Contact Us</Link>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link href="/wishlist" className={iconBtn} aria-label="Wishlist">
            <div className="indicator">
              <Heart size={22} />
              {hydrated && <Badge count={wishlistCount} />}
            </div>
          </Link>
          <button className={iconBtn} aria-label="Open cart" onClick={openCart}>
            <div className="indicator">
              <ShoppingCart size={22} />
              {hydrated && <Badge count={cartItems} />}
            </div>
          </button>

          {user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-primary btn-sm h-10 gap-2 rounded-full px-3">
                <span className="grid size-6 place-items-center rounded-full bg-neutral text-xs font-bold text-primary">{user.name?.[0]?.toUpperCase() ?? "U"}</span>
                <span className="hidden max-w-24 truncate sm:inline">{user.name?.split(" ")[0]}</span>
              </div>
              <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-56 rounded-box bg-base-100 p-2 text-base-content shadow-xl">
                {user.role === "admin" && (
                  <li><Link href="/admin/dashboard" onClick={() => (document.activeElement as HTMLElement)?.blur()}><LayoutDashboard size={16} /> Admin panel</Link></li>
                )}
                <li><Link href="/orders" onClick={() => (document.activeElement as HTMLElement)?.blur()}><ReceiptText size={16} /> My orders</Link></li>
                <li><Link href="/wishlist" onClick={() => (document.activeElement as HTMLElement)?.blur()}><Heart size={16} /> My wishlist</Link></li>
                <li><button onClick={handleSignOut}><LogOut size={16} /> Sign out</button></li>
              </ul>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm h-10 gap-2 rounded-full px-4">
              <LogIn size={16} /> <span>Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile: search + links */}
      <div className={`border-t border-white/10 px-4 pb-3 lg:hidden ${menuOpen ? "block" : "hidden"}`}>
        <div className="py-3">
          <Suspense fallback={null}>
            <SearchBar onNavigate={() => setMenuOpen(false)} />
          </Suspense>
        </div>
        <nav className="flex gap-2">
          <Link href="/products" className={linkCls} onClick={() => setMenuOpen(false)}>All Products</Link>
          <Link href="/about-us" className={linkCls} onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link href="/contact-us" className={linkCls} onClick={() => setMenuOpen(false)}>Contact Us</Link>
        </nav>
      </div>
    </header>
  );
}