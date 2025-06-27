'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/HomePage/Navbar';
import Footer from '@/components/HomePage/Footer';
import { FaLock } from 'react-icons/fa';
import { IoMailUnreadSharp } from 'react-icons/io5';
import { MdPassword } from 'react-icons/md';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/auth/reset-password', {
                token,
                newPassword,
            });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
                {/* Left Panel */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-12 bg-indigo-50 dark:bg-indigo-900">
                    <MdPassword className="text-indigo-600 dark:text-indigo-300 text-9xl mb-4" />
                    <h2 className="text-xl font-semibold text-center">
                        Let's help you get back in!
                    </h2>
                    <p className="text-sm mt-2 text-center max-w-sm text-gray-600 dark:text-gray-300">
                        Enter a strong new password below. You’re just one step away from regaining access.
                    </p>
                </div>

                {/* Right Panel */}
                <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-16">
                    <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
                            <FaLock className="text-indigo-600 dark:text-indigo-400 text-2xl" />
                            <span>Create a new strong password</span>
                        </h2>

                        {message && <p className="text-sm mb-4 text-green-500">{message}</p>}

                        <label className="block text-sm mb-2">New Password</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 font-medium"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
