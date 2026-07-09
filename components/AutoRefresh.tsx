'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const intervalTime = Number(process.env.NEXT_PUBLIC_AUTO_REFRESH_INTERVAL) || 30000;
    
    const interval = setInterval(() => {
      router.refresh();
    }, intervalTime);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
