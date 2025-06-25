'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <div className="w-full bg-gradient-to-br from-yellow-50 to-white dark:from-slate-900 dark:to-slate-800 text-black dark:text-white">
            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center lg:h-screen px-6 lg:px-20 gap-12 py-12 lg:py-0">

                {/* Text Content (LEFT) */}
                <motion.div
                    initial={{ opacity: 0, y: 70 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    viewport={{ amount: 0.3, once: false }} // 👈 Repeats on scroll
                    className="max-w-4xl text-center lg:text-left"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                        About <span className="text-yellow-500 dark:text-yellow-400">FitBuddy</span>
                    </h1>
                    <p className="text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-200 text-justify">
                        At <strong>FitBuddy</strong>, we believe fitness should be personal, powerful, and accessible.
                        Our platform empowers both trainers and enthusiasts with tools to track progress, build personalized
                        workout plans, and manage clients seamlessly. Whether you're coaching or training, FitBuddy helps
                        you stay <span className="font-semibold text-yellow-600 dark:text-yellow-400">motivated</span>,
                        <span className="font-semibold text-yellow-600 dark:text-yellow-400"> consistent</span>, and
                        <span className="font-semibold text-yellow-600 dark:text-yellow-400"> results-driven</span>.
                    </p>
                    <button className="mt-6 px-6 py-3 text-lg font-semibold rounded-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
                        Read More
                    </button>
                </motion.div>

                {/* Image (RIGHT) */}
                <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    src="https://cdn-icons-png.flaticon.com/512/9255/9255047.png"
                    alt="About FitBuddy"
                    className="max-w-sm w-full rounded-3xl shadow-2xl transition-transform hover:scale-105 duration-300"
                />
            </div>
        </div>
    );
}
