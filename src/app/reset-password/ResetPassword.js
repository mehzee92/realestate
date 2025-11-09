'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ResetPasswordModal from '../../components/auth/ResetPasswordModal';

export default function ResetPassword() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Redirect to home page after modal closes
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Password Reset</h1>
        <p className="text-gray-600">
          {token ? 'Opening password reset form...' : 'No reset token provided.'}
        </p>
      </div>
      
      <ResetPasswordModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        token={token}
      />
    </div>
  );
}
