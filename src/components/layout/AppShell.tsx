'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [ready, setReady] = useState(false);
    const [open, setOpen] = useState(false);


    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/login');
        } else {
            setReady(true);
        }
    }, [router]);

    if (!ready) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar open={open} setOpen={setOpen} />
            <main className="h-screen flex-1 overflow-y-auto md:ml-64 ">
                <div className="p-4 md:hidden flex items-center justify-between bg-white">
                    <button
                        onClick={() => setOpen(true)}
                        className="px-3 py-2 bg-green-50 shadow-md rounded-md text-gray-600 hover:bg-gray-50 transition"
                    >
                        ≡
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3  px-4 py-2.5 rounded-lg text-sm font-medium bg-red-50 shadow-md rounded-md text-gray-600 hover:bg-red-600 hover:text-white transition-colors"
                    >
                            <span>Logout</span>
                        <span>🚪</span> 
                    </button>
                </div>
                <div className="md:max-w-7xl md:mx-auto px-6 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
