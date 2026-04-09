'use client';

import React from 'react';

export interface Column<T> {
    key: keyof T | string;
    header: string;
    className?: string;
    render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends object> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    idKey?: keyof T;
    onView?: (row: T) => void
}

export function DataTable<T extends object>({
    columns,
    data,
    loading = false,
    emptyMessage = 'No records found.',
    onEdit,
    onDelete,
    onView,
}: DataTableProps<T>) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl shadow ring-1 ring-black ring-opacity-5">
            <table className="min-w-full  table-fixed divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                className={`px-6 py-3  text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className ? "text-left" + col.className : "text-left"}`}
                            >
                                {col.header}
                            </th>
                        ))}
                        {(onEdit || onDelete || onView) && (
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)}
                                className="px-6 py-10 text-center text-gray-400 text-sm"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                {columns.map((col) => (
                                    <td key={String(col.key)} className={`px-6 py-4 text-sm text-gray-700 whitespace-nowrap ${col.className ?? ""}`}>
                                        {col.render
                                            ? col.render(row)
                                            : String(row[col.key as keyof T] ?? '-')}
                                    </td>
                                ))}
                                {(onEdit || onDelete || onView) && (
                                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(row)}
                                                className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition"
                                            >
                                                Delete
                                            </button>
                                        )}
                                        {onView && (
                                            <button
                                                onClick={() => onView(row)}
                                                className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition"
                                            >
                                                View
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
