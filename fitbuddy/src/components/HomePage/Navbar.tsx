'use client';

import DarkModeToggle from '@/hooks/DarkModeToggle';
import Link from 'next/link';
import React from 'react';

export default function Navbar() {
    return (
        <div className="navbar fixed top-0 left-0 w-full z-50 p-4 shadow-md text-black dark:text-white transition-colors duration-300 bg-gradient-to-r from-amber-50 to-yellow-100 dark:from-slate-900 dark:to-slate-800 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">

            {/* Start: Hamburger + Logo */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-lg w-52 rounded-box bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-base space-y-2"
                    >
                        <li><a>Home</a></li>
                        <li><a>About</a></li>
                        <li><a>Training</a></li>
                        <li><a>Instructors</a></li>
                        <li><a>Membership</a></li>

                        {/* Mobile-only: Login and Sign Up buttons */}
                        <li>
                            <Link
                                href="/Login"
                                className="block w-full text-center px-4 py-2 rounded-full font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black dark:text-black shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
                            >
                                Log in
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/Register"
                                className="block w-full text-center px-4 py-2 rounded-full font-semibold border border-yellow-500 hover:bg-yellow-100 text-yellow-700 dark:border-yellow-400 dark:hover:bg-yellow-900 dark:text-yellow-300 transition-all duration-300 ease-in-out"
                            >
                                Sign up
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Logo */}
                <Link
                    href="http://localhost:3001/HomePage"
                    className="text-2xl font-bold tracking-wide flex items-center gap-1 transition-transform duration-300 hover:scale-105"
                >
                    <span className="text-yellow-600 dark:text-yellow-400">FIT</span>
                    <span className="text-black dark:text-white">BUDDY</span>
                </Link>
            </div>

            {/* Center Menu for large screens */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 text-lg font-medium space-x-2">
                    <li><Link href="/HomePage" className="hover:text-yellow-600 dark:hover:text-yellow-400">Home</Link></li>
                    <li><a className="hover:text-yellow-600 dark:hover:text-yellow-400">About</a></li>
                    <li><a className="hover:text-yellow-600 dark:hover:text-yellow-400">Training</a></li>
                    <li><a className="hover:text-yellow-600 dark:hover:text-yellow-400">Instructors</a></li>
                    <li><a className="hover:text-yellow-600 dark:hover:text-yellow-400">Membership</a></li>
                </ul>
            </div>

            {/* End: Dark mode toggle (always visible) and desktop-only buttons */}
            <div className="navbar-end gap-3 items-center">
                {/* Always-visible Dark Mode toggle */}
                <div className="tooltip tooltip-bottom" data-tip="Toggle theme">
                    <DarkModeToggle />
                </div>

                {/* Desktop-only Login/Signup */}
                <div className="hidden lg:flex gap-3 items-center">
                    <Link
                        href="/Login"
                        className="px-5 py-2 md:px-6 md:py-2.5 rounded-full font-semibold text-sm md:text-base
            bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600
            text-black shadow-md hover:shadow-lg transition-all duration-300 ease-in-out
            dark:from-yellow-300 dark:to-yellow-400 dark:hover:from-yellow-400 dark:hover:to-yellow-500"
                    >
                        Log in
                    </Link>

                    <Link
                        href="/Register"
                        className="px-5 py-2 md:px-6 md:py-2.5 rounded-full font-semibold text-sm md:text-base
            border border-yellow-500 hover:bg-yellow-100 text-yellow-700
            dark:border-yellow-400 dark:hover:bg-yellow-900 dark:text-yellow-300
            transition-all duration-300 ease-in-out"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
