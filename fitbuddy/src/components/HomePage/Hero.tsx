'use client';

import React from 'react';
import Typewriter from 'typewriter-effect';
import { useInView } from 'react-intersection-observer';

export default function Hero() {
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.3,
    });

    return (
        <div className="hero min-h-screen relative overflow-hidden">
            {/* Blurred Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center filter blur-xs scale-105"
                style={{
                    backgroundImage:
                        "url(https://dam.northwell.edu/m/5bc04a96a07a6355/Drupal-TheWell_fitness-trackers_AS_289134517.jpg)",
                }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-black/10 dark:from-black/40 dark:via-black/30 dark:to-black/20 z-10" />

            {/* Content */}
            <div className="hero-content w-full justify-end text-white px-6 lg:px-20 relative z-20">
                <div className="max-w-xl text-right space-y-8" ref={ref}>
                    {/* Animated Heading */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight flex justify-end gap-2">
                        <span className={inView ? 'animate-slide-in-left' : 'opacity-0'}>SHAPE YOUR</span>
                        <span className={`${inView ? 'animate-slide-in-right' : 'opacity-0'} text-yellow-400`}>BODY TODAY</span>
                    </h1>

                    {/* Typing Effect */}
                    <div
                        className={`text-lg sm:text-xl md:text-2xl font-medium text-blue-100 min-h-[70px] ${inView ? 'animate-subtle-bounce' : ''
                            }`}
                    >
                        <Typewriter
                            options={{
                                strings: [
                                    'A powerful fitness tracking dashboard for trainers.',
                                    'Manage client workouts efficiently.',
                                    'Track progress and stay consistent.',
                                    'Grow your fitness business with confidence.',
                                ],
                                autoStart: true,
                                loop: true,
                                delay: 30,
                                deleteSpeed: 20,
                            }}
                        />
                    </div>

                    {/* CTA Button */}
                    <button className="px-8 py-4 text-lg md:text-xl font-semibold rounded-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 ease-in-out">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
}
