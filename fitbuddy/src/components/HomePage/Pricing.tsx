import { url } from 'inspector';
import React from 'react';

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-sky-50" style={{
        backgroundImage:
        "url('https://www.cnet.com/a/img/resize/4578ddeaee9d0637dffa6cdebc74b7fafe365064/hub/2024/08/05/7587f34e-0faf-4143-bf2a-e71cd41fb5bb/person-tracking-workout-on-phone.jpg?auto=webp&fit=crop&height=675&width=1200')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        
    }}>
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-4 text-white">Choose your plan</h1>
        <p className="text-base text-white">
          Find the perfect plan for your needs. Upgrade anytime.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Card 1 */}
        <div className="card w-96 bg-base-100 shadow-sm transition-transform transform hover:scale-105 duration-300">
          <div className="card-body">
            <span className="badge badge-xs badge-warning">Most Popular</span>
            <div className="flex justify-between">
              <h2 className="text-3xl font-bold">Premium</h2>
              <span className="text-xl">$29/mo</span>
            </div>
            <ul className="mt-6 flex flex-col gap-2 text-xs">
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>High-resolution image generation</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Customizable style templates</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Batch processing capabilities</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>AI-driven image enhancements</span>
              </li>
              <li className="opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="line-through">Seamless cloud integration</span>
              </li>
              <li className="opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="line-through">Real-time collaboration tools</span>
              </li>
            </ul>
            <div className="mt-6">
              <button className="btn btn-primary btn-block">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Card 2 (Basic Plan Example) */}
        <div className="card w-96 bg-base-100 shadow-sm transition-transform transform hover:scale-105 duration-300">
          <div className="card-body">
            <div className="flex justify-between">
              <h2 className="text-3xl font-bold">Basic</h2>
              <span className="text-xl">$9/mo</span>
            </div>
            <ul className="mt-6 flex flex-col gap-2 text-xs">
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Basic image generation</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Standard templates</span>
              </li>
              <li className="opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="line-through">Batch processing capabilities</span>
              </li>
              <li className="opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="line-through">AI-driven image enhancements</span>
              </li>
            </ul>
            <div className="mt-6">
              <button className="btn btn-outline btn-primary btn-block">Choose Plan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}