"use client"

import React, { useEffect, useState } from 'react';

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
    logo: 'https://tailwindcss.com/plus-assets/img/logos/statickit-logo-indigo-600.svg',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-100),white)] opacity-20" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      
      <div className="mx-auto max-w-2xl lg:max-w-4xl transition-all duration-700 ease-in-out">
        <h1 className='text-5xl md:text-7xl font-extrabold text-black text-center '>FitBuddy</h1>
        <figure className="mt-10 text-center transition-opacity duration-700 opacity-100">
          <blockquote className="text-xl font-semibold text-gray-900 sm:text-2xl">
            <p>{testimonials[current].quote}</p>
          </blockquote>
          <figcaption className="mt-10">
            <img
              alt={testimonials[current].name}
              src={testimonials[current].image}
              className="mx-auto size-12 rounded-full"
            />
            <div className="mt-4 flex items-center justify-center space-x-3 text-base">
              <div className="font-semibold text-gray-900">{testimonials[current].name}</div>
              <svg width={3} height={3} viewBox="0 0 2 2" className="fill-gray-900" aria-hidden="true">
                <circle cx={1} cy={1} r={1} />
              </svg>
              <div className="text-gray-600">{testimonials[current].role}</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}