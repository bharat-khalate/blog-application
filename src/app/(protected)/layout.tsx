'use client';

import { AppShell } from '@/components/layout/AppShell';
import Provider from '@/providers/provider';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return <Provider><AppShell>{children}</AppShell></Provider>;
}
