"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { CategoryIcon } from "@/lib/categoryIcons";
import type { Category } from "@/types";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    api.categories.list().then((r) => setCategories(r.categories.filter((c) => c.isFeatured !== false))).catch(() => setCategories([]));
  }, []);

  if (categories && categories.length === 0) return null;

  return (
    <section className="mx-auto mt-10 max-w-[1400px] px-4" aria-labelledby="featured-categories">
      <div className="mb-5">
        <h2 id="featured-categories" className="text-2xl font-bold">Shop by category</h2>
        <p className="text-sm text-base-content/60">Pick a category to see only those products.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {(categories ?? Array.from({ length: 10 })).map((c, i) =>
          c ? (
            <Link
              key={(c as Category)._id}
              href={`/categories/${(c as Category).slug}`}
              className="group flex flex-col items-center gap-3 rounded-box border border-base-300/70 bg-base-100 px-3 py-5 text-center transition-transform duration-300 hover:scale-[1.03] hover:border-primary hover:shadow-lg hover:shadow-primary/15"
            >
              {(c as Category).image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={(c as Category).image} alt="" className="size-14 rounded-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <span className="grid size-14 place-items-center rounded-full bg-primary/12 text-secondary transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-content">
                  <CategoryIcon name={(c as Category).icon} />
                </span>
              )}
              <span className="text-sm font-medium leading-snug">{(c as Category).name}</span>
            </Link>
          ) : (
            <div key={i} className="h-[132px] animate-pulse rounded-box bg-base-300/60" />
          )
        )}
      </div>
    </section>
  );
}
