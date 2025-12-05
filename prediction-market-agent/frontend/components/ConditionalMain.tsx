'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function ConditionalMain({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    // No padding for chat page (full-page experience)
    const shouldHavePadding = pathname !== '/chat';

    return (
        <main className={`relative ${shouldHavePadding ? 'pt-20' : ''}`}>
            {children}
        </main>
    );
}
