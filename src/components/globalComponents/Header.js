"use client";
import React, { useState, useEffect } from 'react';
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ContactAgentModal from '../contact/ContactAgentModal';

import AuthModal from '../auth/AuthModal';
import RegisterModal from '../auth/RegisterModal';

const Header = () => {
    const [showContactModal, setShowContactModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState(''); // New state for user's name
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // New state for dropdown
    
    const router = useRouter();

    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setIsLoggedIn(data.isAuthenticated);
                    if (data.isAuthenticated) {
                        setUserName(data.user.email); // Use email as name placeholder
                        if (data.user.role === 'admin') {
                            setIsAdmin(true);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user status', error);
            }
        };
        fetchUserStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setIsLoggedIn(false);
            setIsAdmin(false);
            router.push('/');
        } catch (error) {
            console.error('Failed to logout', error);
        }
    };

    return (
        <header className={`fixed top-0 left-0 bg-white ${showContactModal || showAuthModal || showRegisterModal ? 'z-50' : 'z-20'} w-full border-b border-gray-200 py-2`}>
            <div className=" mx-auto px-4 sm:px-6 lg:px-5">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <Link href="/">

                            <Image src={"/images/logo.png"} priority alt="MaxVilla Logo" width={300} height={80} />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center text-sm ">
                            
                            {/* <Link href="/news" className="text-gray-700 hover:text-gray-900 border-r px-5 font-bold">
                                News
                            </Link> */}
                            <button onClick={() => setShowContactModal(true)} className="text-gray-700 hover:text-gray-900 border-r px-5 font-bold">
                                Contact Agent
                            </button>
                            <Link href="tel:+16308911111" className="text-gray-700 hover:text-gray-900 px-5 font-bold">
                                +16308911111
                            </Link>
                        </nav>
                    </div>

                    {/* Desktop Login/Register / User Menu */}
                    <div className="hidden md:flex text-sm items-center z-30 space-x-4">
                        {!isLoggedIn ? (
                            <>
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="text-gray-700 hover:text-gray-900 font-bold"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => setShowRegisterModal(true)}
                                    className="text-gray-700 hover:text-gray-900 font-bold"
                                >
                                    Register
                                </button>
                            </>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="text-gray-700 hover:text-gray-900 font-bold focus:outline-none"
                                >
                                    {userName}
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <Link
                                            href="/profile" // Assuming a profile page exists
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
                        >
                            {isMenuOpen ? (
                                <IoClose className="h-6 w-6" />
                            ) : (
                                <TiThMenu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 bg-white">
                            
                            {/* <Link
                                href="/news"
                                className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                            >
                                News
                            </Link> */}
                            <button
                                onClick={() => {
                                    setShowContactModal(true);
                                    setIsMenuOpen(false);
                                }}
                                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                            >
                                Contact Agent
                            </button>
                            <Link
                                href="tel:(805) 969-8900"
                                className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                            >
                                (805) 969-8900
                            </Link>
                            <div className="border-t border-gray-200 pt-2">
                                {!isLoggedIn ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setShowAuthModal(true);
                                                setIsMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowRegisterModal(true);
                                                setIsMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                                        >
                                            Register
                                        </button>
                                    </>
                                ) : (
                                    <div className="py-2">
                                        <span className="block px-3 py-2 text-gray-700 font-medium">
                                            Hello, {userName}
                                        </span>
                                        <Link
                                            href="/profile"
                                            className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 font-medium"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>


            <ContactAgentModal 
                isOpen={showContactModal} 
                onClose={() => setShowContactModal(false)} 
            />
            
            <AuthModal 
                isOpen={showAuthModal} 
                onClose={() => setShowAuthModal(false)}
                onSwitchToRegister={() => {
                    setShowAuthModal(false);
                    setShowRegisterModal(true);
                }}
            />
            
            <RegisterModal 
                isOpen={showRegisterModal} 
                onClose={() => setShowRegisterModal(false)}
            />
        </header>
    );
};

export default Header;
