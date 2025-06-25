import React from 'react'

export default function Hero() {
    return (
        <>
            <div
                className="hero min-h-screen"
                style={{
                    backgroundImage:
                        "url(https://dam.northwell.edu/m/5bc04a96a07a6355/Drupal-TheWell_fitness-trackers_AS_289134517.jpg)",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="hero-overlay"></div>
                <div className="hero-content w-full justify-end text-neutral-content px-6 lg:px-20">
                    <div className="max-w-xl text-right">
                        <h1 className="mb-6 text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                            SHAPE YOUR <span className="text-primary">BODY</span> TODAY
                        </h1>
                        <p className="mb-6 text-lg text-blue-50">
                            A powerful fitness tracking dashboard for trainers. Manage client workouts, track progress, and grow your fitness business with ease.
                        </p>
                        <button className="btn btn-primary shadow-lg hover:scale-105 transition-transform duration-300">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}