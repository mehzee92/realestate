'use client';

import { useRouter } from 'next/navigation';
import RegisterModal from '@/components/auth/RegisterModal';

export default function Register() {
    const router = useRouter();

    return (
        <RegisterModal 
            isOpen={true} 
            onClose={() => router.back()}
        />
    );
}