'use client';

import { useRouter } from 'next/navigation';
import AuthModal from '@/components/auth/AuthModal';

export default function Login() {
    const router = useRouter();

    return (
        <AuthModal 
            isOpen={true} 
            onClose={() => router.back()}
        />
    );
}