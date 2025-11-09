"use client";
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import Input from '../uis/Input';

const ResetPasswordModal = ({ isOpen, onClose, token }) => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!password) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        // Auto close modal after 3 seconds on success
        setTimeout(() => {
          onClose();
          setPassword('');
          setMessage('');
        }, 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }

    setLoading(false);
  };

  const handleClose = () => {
    onClose();
    setPassword('');
    setMessage('');
    setError('');
  };

  return (
    <div className="fixed inset-0 text-black z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-white p-5 rounded-lg shadow-lg relative w-full max-w-[400px] mx-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-800 text-2xl"
        >
          <IoClose />
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Reset Your Password</h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Enter your new password below.
        </p>

        {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-center mb-4 text-sm">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="New Password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 placeholder:text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black cursor-pointer text-white rounded-md font-semibold hover:bg-gray-800 transition-colors py-3"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleClose}
            className="text-blue-600 hover:underline text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
