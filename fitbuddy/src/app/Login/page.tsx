'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaFacebookF, FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import ModalAlert from '@/components/Login/Modals/ModalAlert';
import Navbar from '@/components/HomePage/Navbar';
import Footer from '@/components/HomePage/Footer';

export default function Login() {
    const [alert, setAlert] = useState<{
        type: 'success' | 'error';
        message: string;
        subMessage?: string;
    } | null>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/auth/login', { email, password });
            const { access_token, user } = res.data;

            localStorage.setItem('token', access_token);
            setAlert({
                type: 'success',
                message: 'Login Successful!',
                subMessage: `Welcome ${user.role}`,
            });

            setTimeout(() => {
                window.location.href = '/Dashboard/User';
            }, 2000);
        } catch {
            setAlert({
                type: 'error',
                message: 'Login Failed',
                subMessage: 'Invalid credentials. Please try again.',
            });
            setTimeout(() => setAlert(null), 3000);
        }
    };

    return (
        <>
        <Navbar />
            <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">

                {/* Left Info Panel */}
                <div className="w-full md:w-7xl flex items-center justify-center p-10 mt-16 md:mt-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 min-h-[500px] md:min-h-screen">


                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="max-w-md text-center"
                    >
                        <h1 className="text-2xl md:text-4xl font-extrabold text-indigo-700 mb-4">Welcome to FitBuddy</h1>
                        <p className="text-lg text-indigo-900">
                            Your personalized fitness companion. Track your progress, connect with trainers,
                            and stay committed to your goals with real-time support.
                        </p>
                        <ul className="mt-6 text-sm text-indigo-800 space-y-2 text-left">
                            <li>💪 Smart workout tracking</li>
                            <li>📈 Health metrics monitoring</li>
                            <li>📬 Chat with personal trainers</li>
                            <li>🧠 Insights on consistency & growth</li>
                        </ul>
                    </motion.div>
                </div>

                {/* Right Login Form */}
                <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 mt-16 md:mt-0">

                    <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
  className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 relative"
>
  <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Login to FitBuddy</h2>
  <p className="text-center text-sm text-gray-500 mb-4">Enter your credentials to continue</p>

  {/* Modal Alert */}
  {alert && (
    <div className="mb-4">
      <ModalAlert
        type={alert.type}
        message={alert.message}
        subMessage={alert.subMessage}
        onClose={() => setAlert(null)}
      />
    </div>
  )}


                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="my-6 flex items-center gap-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="text-sm text-gray-400">OR</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <SocialButton icon={<FaFacebookF className="text-blue-600" />} label="Continue with Facebook" />
                            <SocialButton icon={<FcGoogle />} label="Continue with Google" />
                            <SocialButton icon={<FaApple className="text-black" />} label="Continue with Apple" />
                        </div>

                        <p className="text-sm text-center text-gray-600 mt-6">
                            Don’t have an account?{' '}
                            <a href="#" className="text-indigo-500 hover:underline">Sign up</a>
                        </p>
                    </motion.div>
                </div>

                
            </div>
            <Footer />
            </>
    );
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <button className="flex items-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition text-sm font-medium text-gray-700">
            {icon}
            {label}
        </button>
    );
}
