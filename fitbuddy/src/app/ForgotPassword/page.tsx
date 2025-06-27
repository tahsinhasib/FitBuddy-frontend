'use client';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/HomePage/Navbar';
import Footer from '@/components/HomePage/Footer';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/forgot-password', { email });
      setMessage(`Check your email. Token: ${res.data.resetLink}`);
    } catch (err) {
      setMessage('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <div className="flex items-center justify-center py-20 px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-8 rounded-xl bg-white dark:bg-gray-800 shadow">
          <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
          <label className="block text-sm mb-2">Enter your email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
          >
            Send Reset Link
          </button>
          {message && <p className="mt-4 text-sm text-green-500">{message}</p>}
        </form>
      </div>
      <Footer />
    </div>
  );
}
