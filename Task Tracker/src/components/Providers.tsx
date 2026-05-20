'use client';
import { StoreProvider } from '@/lib/Store';

export function Providers({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
