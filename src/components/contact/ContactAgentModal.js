'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import Input from '@/components/uis/Input';

const ContactAgentModal = ({ isOpen, onClose, propertyAddress = '' }) => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        message: propertyAddress ? `Hello, I'm interested in the property located at ${propertyAddress}. Could you please provide additional information?` : "Hello, I'd like to inquire about a property."
    });
    const [isChecked, setIsChecked] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);


    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic

        onClose();
    };

    const fullText = "By providing Village Properties your contact information, you acknowledge and agree to our Privacy Policy and consent to receiving marketing communications, including through automated technology, such as autodialers, text messages, and prerecorded messages, from Village Properties and its affiliates. You understand that your consent is not a condition of any purchase. You may opt out of receiving marketing communications at any time.";
    const truncatedText = "By providing Village Properties your contact information, you acknowledge and agree to our Privacy Policy and consent to receiving marketing communications, including through automate...";

    return (
        <div className="fixed inset-0 bg-black/50 flex z-50 justify-center items-center p-4" style={{ zIndex: '9999' }}>
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-[400px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Contact agent</h2>
                    <button onClick={onClose} className='cursor-pointer'>
                        <IoClose className="h-6 w-4" />
                    </button>
                </div>
                <div className="flex items-center mb-6">
                    <Image src="/images/logo2.png" alt="logo" width={50} height={50} className="rounded-full" />
                    <div className="ml-4">
                        <h3 className="font-bold text-lg">Max</h3>
                        <p className="text-sm text-gray-500">Real Estate Broker</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='h-[300px] overflow-y-auto'>
                        <div className="mb-4">
                            <Input placeholder="Email*" type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="px-4 py-3" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Input placeholder="First name*" type="text" name="firstName" id="firstName" required value={formData.firstName} onChange={handleChange} className="px-4 py-3" />
                            <Input placeholder="Last name*" type="text" name="lastName" id="lastName" required value={formData.lastName} onChange={handleChange} className="px-4 py-3" />
                        </div>
                        <div className="mb-4">
                            <Input placeholder="Phone*" type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} className="px-4 py-3" />
                        </div>
                        <div className="mb-4">
                            <textarea name="message" id="message" rows="5" value={formData.message} onChange={handleChange} className="block w-full px-4 py-3 border border-gray-300 rounded-md  focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"></textarea>
                            <p className="text-xs text-gray-500 mt-1 text-right">{formData.message.length}/1000</p>
                        </div>
                    </div>


                    <button type="submit" className="w-full bg-black text-white font-semibold py-3 px-4 cursor-pointer rounded-md hover:bg-gray-800 transition-colors">Send message</button>
                    <div className="mt-4 text-xs text-gray-500 flex items-start">
                        <input type="checkbox" id="consent" checked={isChecked} onChange={() => setIsChecked(!isChecked)} className="mt-1 mr-2" />
                        <label htmlFor="consent">
                            {isExpanded ? fullText : truncatedText}
                            <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="underline cursor-pointer text-gray-700">
                                {isExpanded ? 'Read less' : 'Read more'}
                            </button>
                        </label>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactAgentModal;