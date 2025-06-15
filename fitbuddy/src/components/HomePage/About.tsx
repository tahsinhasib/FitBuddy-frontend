import React from 'react';

export default function About() {
  return (
    <div className="hero min-h-screen bg-gradient-to-r bg-sky-50">
      <div className="hero-content w-full flex-col lg:flex-row-reverse gap-10 px-6">
        <img
          src="https://cdn-icons-png.flaticon.com/512/9255/9255047.png"
          alt="Box Office"
          className="max-w-sm rounded-3xl shadow-2xl transition-transform hover:scale-105 duration-300"
        />
        <div className="max-w-full">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-black">
            About <span className="text-primary">Fitbuddy</span>
          </h1>
          <p className="py-4 text-black text-lg leading-relaxed">
            At FitBuddy, we believe fitness should be personal, powerful, and accessible. 
                    Our platform is built to empower fitness trainers and enthusiasts alike with 
                    intuitive tools to track progress, design personalized workout plans, and manage 
                    client relationships—all in one place. Whether you're a professional trainer managing 
                    multiple clients or an individual striving toward your fitness goals, FitBuddy offers a 
                    seamless, data-driven experience to help you stay on track. With a focus on performance, 
                    motivation, and community, we’re here to support every step of your fitness journey.
          </p>
          <button className="btn btn-primary mt-4 shadow-lg hover:shadow-xl transition-all">
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}