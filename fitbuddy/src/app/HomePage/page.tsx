

import About from '@/components/HomePage/About'
import Footer from '@/components/HomePage/Footer'
import Hero from '@/components/HomePage/Hero'
import Navbar from '@/components/HomePage/Navbar'
import Pricing from '@/components/HomePage/Pricing'
import Testimonials from '@/components/HomePage/Testimonials'
import React from 'react'

export default function HomePage() {
    return (
        <>
            <Navbar />
            <Hero />
            <About />
            <Testimonials />
            <Pricing />
            <Footer />
        </>
    )
}