'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';

interface ICategory {
    _id: string;
    name: string;
    category_code: string;
    createdAt: string;
}

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<ICategory | null>(null);
    const [form, setForm] = useState({ name: '', category_code: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const authHeader = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
        return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    };

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/v1/categories', { headers: authHeader() });
            if (res.status === 401) { router.push('/login'); return; }
            const data = await res.json();
            setCategories(data.data ?? []);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const openCreate = () => {
        setEditTarget(null);
        setForm({ name: '', category_code: '' });
        setError(''); setFieldErrors({});
        setModalOpen(true);
    };

    const openEdit = (cat: ICategory) => {
        setEditTarget(cat);
        setForm({ name: cat.name, category_code: cat.category_code });
        setError(''); setFieldErrors({});
        setModalOpen(true);
    };

    const handleDelete = async (cat: ICategory) => {
        if (!confirm(`Delete "${cat.name}"?`)) return;
        await fetch(`/api/v1/categories/${cat._id}`, { method: 'DELETE', headers: authHeader() });
        fetchCategories();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setFieldErrors({});
        setSaving(true);
        try {
            const url = editTarget ? `/api/v1/categories/${editTarget._id}` : '/api/v1/categories';
            const method = editTarget ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(form) });
            const data = await res.json();
            if (!res.ok) {
                if (data.errors) setFieldErrors(data.errors);
                else setError(data.message || 'Something went wrong');
                return;
            }
            setModalOpen(false);
            fetchCategories();
        } finally {
            setSaving(false);
        }
    };

    const columns: Column<ICategory>[] = [
        { key: 'name', header: 'Name' },
        { key: 'category_code', header: 'Code' },
        {
            key: 'createdAt',
            header: 'Created',
            render: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage product categories</p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                >
                    + New Category
                </button>
            </div>

            <DataTable
                columns={columns}
                data={categories}
                loading={loading}
                emptyMessage="No categories yet. Create your first one!"
                onEdit={openEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editTarget ? 'Edit Category' : 'New Category'}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${fieldErrors.name ? 'border-red-400' : 'border-gray-300'}`}
                            placeholder="e.g. Electronics"
                        />
                        {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Code</label>
                        <input
                            type="text"
                            value={form.category_code}
                            onChange={(e) => setForm({ ...form, category_code: e.target.value.toUpperCase() })}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono ${fieldErrors.category_code ? 'border-red-400' : 'border-gray-300'}`}
                            placeholder="e.g. ELEC"
                        />
                        {fieldErrors.category_code && <p className="text-xs text-red-500 mt-1">{fieldErrors.category_code}</p>}
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : editTarget ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
