"use client";
import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { CategoryIcon, ICON_KEYS } from "@/lib/categoryIcons";
import type { Category } from "@/types";

const blank = { name: "", icon: "package", isFeatured: true };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => api.categories.list().then((r) => setCategories(r.categories)).catch((e: Error) => toast.error(e.message)), []);
  useEffect(() => { load(); }, [load]);

  const reset = () => { setForm(blank); setEditingId(null); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editingId) await api.categories.update(editingId, form);
      else await api.categories.create(form);
      toast.success(editingId ? "Category updated" : "Category added");
      reset();
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (c: Category) => {
    if (!window.confirm(`Delete “${c.name}”?`)) return;
    try {
      await api.categories.remove(c._id);
      toast.success("Category deleted");
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold">Categories</h1>

      <form onSubmit={save} className="mt-4 grid items-end gap-3 rounded-box bg-base-100 p-4 sm:grid-cols-[1fr_180px_auto_auto]">
        <label><span className="mb-1 block text-sm font-medium">{editingId ? "Edit category" : "New category"}</span>
          <input required className="input input-bordered w-full" placeholder="e.g. Tea & Coffee Ware" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label><span className="mb-1 block text-sm font-medium">Icon</span>
          <select className="select select-bordered w-full" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>{ICON_KEYS.map((k) => <option key={k}>{k}</option>)}</select></label>
        <label className="flex h-12 cursor-pointer items-center gap-2 text-sm"><input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
        <div className="flex gap-2">
          <button className="btn btn-secondary" disabled={busy}>{editingId ? "Save" : "Add"}</button>
          {editingId && <button type="button" className="btn btn-ghost" onClick={reset}>Cancel</button>}
        </div>
      </form>

      <ul className="mt-4 divide-y divide-base-200 rounded-box bg-base-100">
        {categories.map((c) => (
          <li key={c._id} className="flex items-center gap-3 px-4 py-3">
            <span className="grid size-10 place-items-center rounded-full bg-primary/12 text-secondary"><CategoryIcon name={c.icon} size={20} /></span>
            <div className="flex-1"><p className="font-medium">{c.name}</p><p className="text-xs text-base-content/55">/{c.slug} · {c.productCount ?? 0} products{c.isFeatured === false && " · hidden from home"}</p></div>
            <button className="btn btn-ghost btn-sm btn-square" aria-label={`Edit ${c.name}`} onClick={() => { setEditingId(c._id); setForm({ name: c.name, icon: c.icon ?? "package", isFeatured: c.isFeatured !== false }); }}><Pencil size={16} /></button>
            <button className="btn btn-ghost btn-sm btn-square text-error" aria-label={`Delete ${c.name}`} onClick={() => remove(c)}><Trash2 size={16} /></button>
          </li>
        ))}
        {categories.length === 0 && <li className="px-4 py-8 text-center text-base-content/55">No categories yet. Add your first one above.</li>}
      </ul>
    </div>
  );
}
