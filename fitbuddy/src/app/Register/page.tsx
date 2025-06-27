'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaApple } from 'react-icons/fa';
import Navbar from '@/components/HomePage/Navbar';
import Footer from '@/components/HomePage/Footer';
import { HiUsers } from 'react-icons/hi';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await axios.post('http://localhost:3000/auth/register', form);
            setSuccess('Registration successful! Redirecting...');
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const handleSocialLogin = (provider: string) => {
        alert(`Redirecting to ${provider} login...`);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
            <Navbar />

            <div className="flex flex-col lg:flex-row min-h-[90vh]">
                {/* Right Panel FIRST on Mobile */}
                <div className="flex-1 order-1 lg:order-2 flex items-center justify-center px-6 py-40 bg-gray-100 dark:bg-gray-800">
                    <div className="max-w-md text-left space-y-4">
                        <h2 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">Why Join FitBuddy?</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Track your workouts, nutrition, and progress in one place.</li>
                            <li>Connect with certified trainers and nutritionists.</li>
                            <li>Get personalized workout plans tailored to your goals.</li>
                            <li>Receive real-time updates, reminders, and motivational insights.</li>
                            <li>Access your fitness data from anywhere, anytime.</li>
                        </ul>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="flex-1 order-2 lg:order-1 flex items-center justify-center px-6 py-35">
                    <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-8 shadow-md rounded-xl">
                        <div className="text-center">
                            <HiUsers className="mx-auto text-indigo-600 dark:text-indigo-400 text-4xl" />
                            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Create a FitBuddy Account
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            {success && <p className="text-sm text-green-500">{success}</p>}

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Select Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="user">User</option>
                                    <option value="trainer">Trainer</option>
                                    <option value="nutritionist">Nutritionist</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Register
                            </button>
                        </form>

                        <div className="flex items-center gap-4">
                            <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
                            <span className="text-gray-500 dark:text-gray-400 text-sm">or continue with</span>
                            <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
                        </div>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => handleSocialLogin('Google')}
                                className="flex items-center justify-center w-10 h-10 rounded-full border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FcGoogle size={20} />
                            </button>
                            <button
                                onClick={() => handleSocialLogin('Facebook')}
                                className="flex items-center justify-center w-10 h-10 rounded-full border text-blue-600 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FaFacebookF size={18} />
                            </button>
                            <button
                                onClick={() => handleSocialLogin('Apple')}
                                className="flex items-center justify-center w-10 h-10 rounded-full border text-black dark:text-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FaApple size={20} />
                            </button>
                        </div>

                        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            Already a member?{' '}
                            <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
