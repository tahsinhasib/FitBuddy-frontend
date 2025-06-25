'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';

const testimonials = [
    {
        name: 'Judith Black',
        role: 'CEO of Workcation',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        quote:
            '“Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae.”',
    },
    {
        name: 'Michael Lee',
        role: 'CTO of DevCo',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        quote:
            '“A game-changer for our business. We saw results in weeks. The team was amazing to work with.”',
    },
    {
        name: 'Sara Kim',
        role: 'Product Designer at Loop',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        quote:
            '“The UI is sleek, the experience smooth, and it integrated perfectly with our workflow.”',
    },
];

export default function Testimonials() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-yellow-50 to-white dark:from-slate-900 dark:to-slate-800 px-6 py-24 sm:py-32 lg:px-8 text-black dark:text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_60rem_at_top,var(--tw-gradient-stops))] from-yellow-100 via-white to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 opacity-30" />

            {/* Main Content */}
            <div className="mx-auto max-w-2xl lg:max-w-4xl text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-10 tracking-tight">FitBuddy</h1>

                <AnimatePresence mode="wait">
                    <motion.figure
                        key={current}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <blockquote className="text-xl sm:text-2xl font-semibold">
                            <p>{testimonials[current].quote}</p>
                        </blockquote>
                        <figcaption className="flex flex-col items-center mt-6">
                            <img
                                src={testimonials[current].image}
                                alt={testimonials[current].name}
                                className="w-14 h-14 rounded-full shadow-md"
                            />
                            <div className="mt-2 text-base font-medium">
                                <span>{testimonials[current].name}</span>
                                <span className="mx-2 text-yellow-500">•</span>
                                <span className="text-gray-600 dark:text-gray-300">{testimonials[current].role}</span>
                            </div>
                        </figcaption>
                    </motion.figure>
                </AnimatePresence>
            </div>

            {/* Stats Section */}
            <section className="pt-20 px-6 lg:px-20 text-center text-black dark:text-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">

                    {/* Clients */}
                    <div className="flex flex-col items-center">
                        <span className="text-5xl font-extrabold text-yellow-500 dark:text-yellow-400">
                            <CountUp end={20} duration={2.5} separator="," suffix="+" enableScrollSpy scrollSpyDelay={200} />
                        </span>
                        <p className="mt-2 text-lg font-medium">Active Clients</p>
                    </div>

                    {/* Trainers */}
                    <div className="flex flex-col items-center">
                        <span className="text-5xl font-extrabold text-yellow-500 dark:text-yellow-400">
                            <CountUp end={10} duration={2.5} separator="," suffix="+" enableScrollSpy scrollSpyDelay={200} />
                        </span>
                        <p className="mt-2 text-lg font-medium">Professional Trainers</p>
                    </div>

                    {/* Workouts Tracked */}
                    <div className="flex flex-col items-center">
                        <span className="text-5xl font-extrabold text-yellow-500 dark:text-yellow-400">
                            <CountUp end={30} duration={2.5} separator="," suffix="+" enableScrollSpy scrollSpyDelay={200} />
                        </span>
                        <p className="mt-2 text-lg font-medium">Workouts Tracked</p>
                    </div>

                </div>
            </section>

        </section>
    );
}
