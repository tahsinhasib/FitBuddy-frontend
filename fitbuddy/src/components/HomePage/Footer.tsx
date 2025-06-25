import React from 'react';
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
} from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 pt-16 pb-10 px-6 sm:px-10 lg:px-32">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-12">

                {/* Logo & Description */}
                <aside className="space-y-4">
                    <div className="flex items-center gap-3">
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            className="fill-yellow-500 dark:fill-yellow-400"
                        >
                            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
                        </svg>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FitBuddy</h1>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 max-w-xs">
                        FitBuddy helps you stay motivated, consistent, and results-driven — for trainers and fitness lovers alike.
                    </p>
                    <div className="flex gap-4 mt-4 text-xl text-gray-600 dark:text-gray-300">
                        <a href="#" className="hover:text-yellow-500 transition"><FaFacebookF /></a>
                        <a href="#" className="hover:text-yellow-500 transition"><FaTwitter /></a>
                        <a href="#" className="hover:text-yellow-500 transition"><FaInstagram /></a>
                        <a href="#" className="hover:text-yellow-500 transition"><FaLinkedinIn /></a>
                    </div>
                </aside>

                {/* Services */}
                <nav className="space-y-3">
                    <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Services</h6>
                    <a href="#" className="block hover:text-yellow-500">Branding</a>
                    <a href="#" className="block hover:text-yellow-500">Design</a>
                    <a href="#" className="block hover:text-yellow-500">Marketing</a>
                    <a href="#" className="block hover:text-yellow-500">Advertisement</a>
                </nav>

                {/* Company */}
                <nav className="space-y-3">
                    <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Company</h6>
                    <a href="#" className="block hover:text-yellow-500">About us</a>
                    <a href="#" className="block hover:text-yellow-500">Contact</a>
                    <a href="#" className="block hover:text-yellow-500">Jobs</a>
                    <a href="#" className="block hover:text-yellow-500">Press kit</a>
                </nav>

                {/* Legal */}
                <nav className="space-y-3">
                    <h6 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Legal</h6>
                    <a href="#" className="block hover:text-yellow-500">Terms of use</a>
                    <a href="#" className="block hover:text-yellow-500">Privacy policy</a>
                    <a href="#" className="block hover:text-yellow-500">Cookie policy</a>
                </nav>
            </div>

            {/* Copyright */}
            <div className="mt-12 text-center text-xs text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} FitBuddy. All rights reserved.
            </div>
        </footer>
    );
}
