"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import ProductGrid, { ProductGridSkeleton } from "@/components/product/ProductGrid";
import type { Product } from "@/types";

export default function PopularProducts() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    api.products.list({ limit: 10, sort: "newest" }).then((r) => setProducts(r.products)).catch(() => setProducts([]));
  }, []);

  return (
    <section className="mx-auto mt-12 max-w-[1400px] px-4" aria-labelledby="latest-products">
      <div className="mb-5 flex items-end justify-between">
        <h2 id="latest-products" className="text-2xl font-bold">New in the shop</h2>
        <Link href="/products" className="flex items-center gap-1 text-sm font-semibold text-secondary hover:underline">View all products <ArrowRight size={16} /></Link>
      </div>
      {products === null ? <ProductGridSkeleton /> : products.length === 0 ? (
        <p className="rounded-box border border-dashed border-base-300 bg-base-100 p-8 text-center text-sm text-base-content/60">No products yet. Add some from the Admin panel, or run <code>npm run seed</code> in the server folder.</p>
      ) : <ProductGrid products={products} />}
    </section>
  );
}
