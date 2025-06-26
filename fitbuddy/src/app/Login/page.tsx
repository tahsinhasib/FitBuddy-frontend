'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { FaFacebookF, FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import ModalAlert from '@/components/Login/Modals/ModalAlert';
import Navbar from '@/components/HomePage/Navbar';
import Footer from '@/components/HomePage/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

  const featureTexts = [
    "Get custom workout routines that align with your personal goals and fitness level.",
    "Track your health metrics in real-time and visualize your progress clearly.",
    "Stay connected with certified trainers and receive timely feedback and motivation.",
    "Never miss a session with smart calendar reminders and consistency analytics.",
  ];

  return (
    <>
      <Navbar />
      <div className="relative isolate bg-gradient-to-b from-yellow-50 to-white dark:from-slate-900 dark:to-slate-800 min-h-screen">
        {/* Decorative Background */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        >
          <div
            className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-yellow-400 to-orange-400 opacity-30 dark:from-yellow-600 dark:to-orange-700"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="min-h-screen flex flex-col md:flex-row">
          {/* Left Panel */}
          <div className="hidden md:flex w-full md:w-3/5 items-center justify-center px-10 py-24 text-black dark:text-white">
            <div className="max-w-xl space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Welcome to <span className="text-yellow-400">FitBuddy</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200">
                Your all-in-one platform to elevate your fitness journey. Monitor progress,
                collaborate with expert trainers, and stay accountable—every step of the way.
              </p>
              <div className="space-y-4 mt-6 text-base text-gray-800 dark:text-gray-300">
                {featureTexts.map((text, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.5, duration: 0.6, ease: 'easeOut' }}
                  >
                    {text}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-2/5 flex items-center justify-center px-6 py-24 bg-white dark:bg-slate-900 border-l md:border-l border-gray-200 dark:border-slate-700">
            <div className="w-full max-w-md space-y-8">
              {/* Logo and Heading */}
              <div className="text-center">
                <img
                  alt="FitBuddy"
                  src="https://fitbuddysupplements.com/wp-content/uploads/2025/02/Untitled-design2.png"
                  className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Sign in to your account
                </h2>
              </div>

              {alert && (
                <ModalAlert
                  type={alert.type}
                  message={alert.message}
                  subMessage={alert.subMessage}
                  onClose={() => setAlert(null)}
                />
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 block w-full rounded-md bg-white dark:bg-slate-800 px-3 py-2 text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                      Password
                    </label>
                    <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                      Forgot password?
                    </a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 block w-full rounded-md bg-white dark:bg-slate-800 px-3 py-2 text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </form>

              {/* Social Login */}
              <div className="space-y-3 text-center">
                <SocialButton icon={<FaFacebookF className="text-blue-600" />} label="Continue with Facebook" />
                <SocialButton icon={<FcGoogle />} label="Continue with Google" />
                <SocialButton icon={<FaApple className="text-black dark:text-white" />} label="Continue with Apple" />
              </div>

              <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Don’t have an account?{' '}
                <Link href="/Register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex justify-center items-center gap-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition text-sm font-medium text-gray-700 dark:text-gray-200">
      {icon}
      <span>{label}</span>
    </button>
  );
}
