"use client";
import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { IoClose } from "react-icons/io5";
import Link from 'next/link';
import Input from '../uis/Input';
import { FaFacebook } from "react-icons/fa";
import toast from 'react-hot-toast';

const RegisterModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return;
    }

    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return;
    }

    if (!formData.email) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!formData.confirmPassword) {
      setError('Please confirm your password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      if (res.ok) {
        const data = await res.json();

        toast.success('Registration successful! Welcome to our platform.');
        onClose();
        router.push('/'); // Redirect to home or dashboard
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setError('An error occurred during registration.');
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

        toast.success('Google registration successful! Welcome to our platform.');
        onClose();
        router.push('/'); // Redirect to home or dashboard
      } else {
        const errorData = await res.json();
        console.error('Google registration failed:', errorData);
        const errorMessage = errorData.message || 'Google registration failed';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Error during Google registration:', err);
      const errorMessage = 'An error occurred during Google registration.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleGoogleError = () => {
    console.error('Google registration failed');
    const errorMessage = 'Google registration failed. Please try again.';
    setError(errorMessage);
    toast.error(errorMessage);
  };

  return (
    <div className="fixed text-gray-800 inset-0 z-[9999] flex items-center justify-center bg-black/50 bg-opacity-50">
      <div className="bg-white px-5 py-3 rounded-lg shadow-lg relative w-full max-w-[400px] mx-auto max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-800 text-2xl"
        >
          <IoClose />
        </button>
        <h2 className="text-xl font-bold mb-3 text-center">Sign up</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                name="firstName"
                placeholder="First Name*"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name*"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email*"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password*"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password*"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-black cursor-pointer text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            Sign up
          </button>
        </form>

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
                  className="w-full flex cursor-pointer items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {/* <img src="/images/google-icon.svg" alt="Google" className="w-5 h-5" /> */}
                  Continue with Google
                </button>
              )}
            />
          </GoogleOAuthProvider>

          {/* Placeholder for Facebook Login */}
          <button
            className="w-full flex items-center cursor-pointer gap-2 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <FaFacebook size={20} color='#0866ff' className='mr-[16%]'/>
            Continue with Facebook
          </button>
        </div>

       
      </div>
    </div>
  );
};

export default RegisterModal;
