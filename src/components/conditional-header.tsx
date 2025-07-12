'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';

const HIDDEN_PATHS = ['/login', '/signup'];

export function ConditionalHeader() {
  const pathname = usePathname();

  if (HIDDEN_PATHS.includes(pathname)) {
    return null;
  }

  return <Header />;
}
