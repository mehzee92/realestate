'use client';

import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }) {
  return (
    <>
      {children}
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
        },
      }} />
    </>
  );
}