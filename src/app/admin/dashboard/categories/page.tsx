'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/portals/admin/lib/api';
import {
  Tags,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Check,
  X,
} from 'lucide-react';

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await adminFetch('/api/admin/categories');
    if (res.ok && res.data) {
      setCategories(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    if (editingCategory) {
      const res = await adminFetch(`/api/admin/categories/${editingCategory.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchCategories();
      }
    } else {
      const res = await adminFetch('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchCategories();
      }
    }
    setActionLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this safety category?')) return;
    const res = await adminFetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      fetchCategories();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e8e8f0] rounded-[18px] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
        <p className="text-xs text-[#5b5b6e] font-medium">
          Categories organize distress reports, campus safety concerns, and peer advice threads.
        </p>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-[12px] bg-[#6d4aff] hover:bg-[#5833e4] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
        >
          <Plus size={15} /> Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-[#5b5b6e] text-xs">
            <Loader2 size={24} className="animate-spin inline-block text-[#6d4aff] mb-2" />
            <p>Loading category list...</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-[#e8e8f0] rounded-[18px] p-5 flex flex-col justify-between hover:border-[#6d4aff]/40 hover:shadow-md transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-[10px] bg-[#f4f0ff] border border-[#e5dcff] flex items-center justify-center text-[#6d4aff]">
                    <Tags size={16} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-[#fafafc] text-[#5b5b6e] border border-[#e8e8f0]">
                    {cat.postCount || 0} posts
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#16161d] tracking-tight">{cat.name}</h3>
                <p className="text-xs text-[#5b5b6e] mt-1.5 line-clamp-2 leading-relaxed">
                  {cat.description || 'No specialized description provided.'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-3.5 mt-4 border-t border-[#f0f0f5]">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 rounded-[8px] bg-white border border-[#e8e8f0] hover:bg-[#f7f7fa] text-[#16161d] transition-colors shadow-2xs"
                  title="Edit Category"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 rounded-[8px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shadow-2xs"
                  title="Delete Category"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white border border-[#e8e8f0] rounded-[22px] max-w-sm w-full p-6 space-y-4 shadow-xl text-[#16161d]"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#16161d]">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[#9797ab] hover:text-[#16161d] hover:bg-[#f7f7fa]"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="block text-[10.5px] font-bold text-[#717184] uppercase tracking-wider mb-2">
                Category Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Workplace Harassment"
                className="w-full bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] p-2.5 text-xs font-medium focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 shadow-2xs placeholder-[#9797ab]"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-bold text-[#717184] uppercase tracking-wider mb-2">
                Description (Optional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Guidelines or context for this category..."
                className="w-full bg-white border border-[#e2e2ec] text-[#16161d] rounded-[12px] p-2.5 text-xs font-medium focus:outline-none focus:border-[#6d4aff] focus:ring-2 focus:ring-[#6d4aff]/15 shadow-2xs placeholder-[#9797ab]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold text-[#5b5b6e] hover:bg-[#f7f7fa] border border-[#e8e8f0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-2 rounded-[10px] text-xs font-bold bg-[#6d4aff] hover:bg-[#5833e4] text-white shadow-xs"
              >
                {actionLoading ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
