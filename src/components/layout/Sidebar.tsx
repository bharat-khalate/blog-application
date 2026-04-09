'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/categories', label: 'Categories', icon: '🏷️' },
    { href: '/products', label: 'Products', icon: '📦' },
    { href: '/posts', label: 'Posts', icon: '📝' }
];


interface SidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <>
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/40 md:hidden z-40"
                />
            )}




            <aside className={` fixed top-0 left-0 z-50 flex flex-col justify-between  h-screen w-64 bg-gray-900 border-r
  transform transition-transform duration-300
  ${open ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0`}>
                {/* Logo */}
                <div className="px-6 py-5 border-b border-gray-700">
                    <h1 className="text-xl font-bold tracking-tight text-indigo-400">⚡ CleanApp</h1>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-3 py-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
