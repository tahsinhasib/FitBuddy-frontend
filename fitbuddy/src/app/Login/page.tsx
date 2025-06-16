'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaFacebookF } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import Navbar from '@/components/HomePage/Navbar';
import ModalAlert from '@/components/Login/Modals/ModalAlert';
import Footer from '@/components/HomePage/Footer';






export default function Login() {

    // Inside the component:
    const [alert, setAlert] = useState<{
        type: 'success' | 'error';
        message: string;
        subMessage?: string;
    } | null>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const data = { email, password };

  try {
    const response = await axios.post('http://localhost:3000/auth/login', data);

    const { access_token, user } = response.data;

    // Save token if needed (optional)
    localStorage.setItem('token', access_token);

    setAlert({
      type: 'success',
      message: 'Login Successful!',
      subMessage: `Welcome ${user.role}. Redirecting to your dashboard...`,
    });

    setTimeout(() => {
      // Redirect based on role
      switch (user.role) {
        case 'user':
          window.location.href = '/Dashboard/User'; // hard reload
          break;
        case 'trainer':
          window.location.href = '/Dashboard/User'; // hard reload
          break;
        case 'nutritionist':
          
          break;
        default:
          window.location.href = '/Dashboard/User'; // hard reload
      }
    }, 2000);
  } catch (error) {
    setAlert({
      type: 'error',
      message: 'Login Failed',
      subMessage: 'Invalid credentials. Please try again.',
    });

    setTimeout(() => {
      setAlert(null);
    }, 3000);
  }
};



    return (
        <>
            <Navbar />

            <div
                className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1570829460005-c840387bb1ca?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGd5bSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D')",
                }}
            >
                <div className="w-full max-w-md p-8 space-y-6 bg-gray-100 rounded-2xl shadow-xl relative">
                    <h1 className="mb-8 text-2xl md:text-2xl font-extrabold leading-tight tracking-tight text-black text-center">
                        LOGIN TO YOUR ACCOUNT
                    </h1>

                    {alert && (
                        <ModalAlert
                            type={alert.type}
                            message={alert.message}
                            subMessage={alert.subMessage}
                            onClose={() => setAlert(null)}
                        />
                    )}


        

                    

                    <form className="space-y-5 pt-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900"
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn w-full py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition duration-300"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-gray-100 px-3 text-gray-500">Or sign in with</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <button className="flex items-center justify-center w-40 sm:w-auto gap-2 border rounded-lg px-4 py-2 hover:bg-gray-100 cursor-pointer transition">
                            <FaFacebookF className="text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Facebook</span>
                        </button>
                        <button className="flex items-center justify-center w-40 sm:w-auto gap-2 border rounded-lg px-4 py-2 hover:bg-gray-100 cursor-pointer  transition">
                            <FcGoogle />
                            <span className="text-sm font-medium text-gray-700">Google</span>
                        </button>
                        <button className="flex items-center justify-center w-40 sm:w-auto gap-2 border rounded-lg px-4 py-2 hover:bg-gray-100 cursor-pointer  transition">
                            <FaApple className="text-black" />
                            <span className="text-sm font-medium text-gray-700">Apple</span>
                        </button>
                    </div>

                    <p className="text-sm text-center text-gray-500">
                        Don’t have an account?{' '}
                        <a href="#" className="text-indigo-600 hover:underline">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>

            <Footer />
        </>
    );
}