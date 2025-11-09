"use client";
import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { IoClose } from "react-icons/io5";
import Link from 'next/link';
import Input from '../uis/Input';
import { FaFacebook } from 'react-icons/fa';
import ForgotPasswordModal from './ForgotPasswordModal';
import Image from 'next/image';
import toast from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();

        toast.success('Login successful! Welcome back.');
        onClose();
        window.location.href = '/'; // Reload the page to update header
      } else {
        const errorData = await res.json();
        const errorMessage = errorData.message || 'Login failed';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Error during traditional login:', err);
      setError('An error occurred during login.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: credentialResponse.credential }),
      });

      if (res.ok) {
        const data = await res.json();

        toast.success('Google login successful! Welcome back.');
        onClose();
        window.location.href = '/'; // Reload the page to update header
      } else {
        const errorData = await res.json();
        console.error('Google login failed:', errorData);
        const errorMessage = errorData.message || 'Google login failed';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Error during Google login:', err);
      setError('An error occurred during Google login.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    setError('Google login failed. Please try again.');
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className="fixed inset-0 text-black z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-white p-5 rounded-lg shadow-lg relative w-full max-w-[400px] mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-800 text-2xl"
        >
          <IoClose />
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Log in</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full  px-3  placeholder:text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full   placeholder:text-gray-600 px-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-black h-9 cursor-pointer text-white rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-blue-600 cursor-pointer hover:underline text-sm"
          >
            Forgot password?
          </button>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="space-y-3">
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
                render={({ onClick }) => (
                <button
                  onClick={onClick}
                  className="w-full flex items-center cursor-pointer text-gray-700 justify-center gap-2 px-4 py-3 border border-gray-300 rounded-md font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Image src="/images/google-icon.svg" alt="Google" width={20} height={20} className="w-5 h-5" unoptimized />
                  Continue with Google
                </button>
              )}
            />
          </GoogleOAuthProvider>

          {/* Placeholder for Facebook Login */}
          <button
            className="w-full flex items-center cursor-pointer text-gray-700 gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <FaFacebook size={20} color='#0866ff' className='mr-[16%]'/>
            Continue with Facebook
          </button>
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign up
          </button>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

export default AuthModal;
