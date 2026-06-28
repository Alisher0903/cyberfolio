'use client';
import dynamic from 'next/dynamic';

// ssr:false — window ob'ekti kerak, server da yo'q
const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false });

export default function CustomCursorWrapper() {
  return <CustomCursor />;
}
