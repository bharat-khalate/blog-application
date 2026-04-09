'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';

interface ICategory { _id: string; name: string; category_code: string; }
interface IProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: string;
    createdAt: string;
}

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<IProduct | null>(null);
    const [form, setForm] = useState({ name: '', description: '', price: '', stock: '0', category_id: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const authHeader = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
        return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch('/api/v1/products', { headers: authHeader() }),
                fetch('/api/v1/categories', { headers: authHeader() }),
            ]);
            if (prodRes.status === 401) { router.push('/login'); return; }
            const [prodData, catData] = await Promise.all([prodRes.json(), catRes.json()]);
            setProducts(prodData.data ?? []);
            setCategories(catData.data ?? []);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const categoryName = (id: string) => categories.find((c) => c._id === id)?.name ?? id;

    const openCreate = () => {
        setEditTarget(null);
        setForm({ name: '', description: '', price: '', stock: '0', category_id: categories[0]?._id ?? '' });
        setError(''); setFieldErrors({});
        setModalOpen(true);
    };

    const openEdit = (prod: IProduct) => {
        setEditTarget(prod);
        setForm({
            name: prod.name,
            description: prod.description,
            price: String(prod.price),
            stock: String(prod.stock),
            category_id: prod.category_id,
        });
        setError(''); setFieldErrors({});
        setModalOpen(true);
    };

    const handleDelete = async (prod: IProduct) => {
        if (!confirm(`Delete "${prod.name}"?`)) return;
        await fetch(`/api/v1/products/${prod._id}`, { method: 'DELETE', headers: authHeader() });
        fetchData();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setFieldErrors({});
        setSaving(true);
        try {
            const url = editTarget ? `/api/v1/products/${editTarget._id}` : '/api/v1/products';
            const method = editTarget ? 'PUT' : 'POST';
            const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
            const res = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(payload) });
            const data = await res.json();
            if (!res.ok) {
                if (data.errors) setFieldErrors(data.errors);
                else setError(data.message || 'Something went wrong');
                return;
            }
            setModalOpen(false);
            fetchData();
        } finally {
            setSaving(false);
        }
    };

    const columns: Column<IProduct>[] = [
        { key: 'name', header: 'Name' },
        { key: 'description', header: 'Description', render: (r) => <span title={r.description} className="truncate max-w-xs block">{r.description}</span> },
        { key: 'price', header: 'Price', render: (r) => `$${r.price.toFixed(2)}` },
        { key: 'stock', header: 'Stock' },
        { key: 'category_id', header: 'Category', render: (r) => categoryName(r.category_id) },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                >
                    + New Product
                </button>
            </div>

            <DataTable
                columns={columns}
                data={products}
                loading={loading}
                emptyMessage="No products yet. Create your first one!"
                onEdit={openEdit}
                onDelete={handleDelete}
            />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Product' : 'New Product'} size="lg">
                <form onSubmit={handleSave} className="space-y-4">
                    {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${fieldErrors.name ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="Product name"
                            />
                            {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={2}
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none ${fieldErrors.description ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="Short product description"
                            />
                            {fieldErrors.description && <p className="text-xs text-red-500 mt-1">{fieldErrors.description}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                            <input
                                type="number" min="0" step="0.01"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${fieldErrors.price ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="0.00"
                            />
                            {fieldErrors.price && <p className="text-xs text-red-500 mt-1">{fieldErrors.price}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input
                                type="number" min="0"
                                value={form.stock}
                                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${fieldErrors.stock ? 'border-red-400' : 'border-gray-300'}`}
                                placeholder="0"
                            />
                            {fieldErrors.stock && <p className="text-xs text-red-500 mt-1">{fieldErrors.stock}</p>}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={form.category_id}
                                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${fieldErrors.category_id ? 'border-red-400' : 'border-gray-300'}`}
                            >
                                <option value="">— Select category —</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id}>{c.name} ({c.category_code})</option>
                                ))}
                            </select>
                            {fieldErrors.category_id && <p className="text-xs text-red-500 mt-1">{fieldErrors.category_id}</p>}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setModalOpen(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={saving} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
                            {saving ? 'Saving...' : editTarget ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
