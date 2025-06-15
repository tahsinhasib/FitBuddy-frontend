import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <>
    <div className="navbar fixed top-0 left-0 w-full z-50 text-white bg-base-200 p-3" >
        <div className="navbar-start">
            <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow text-xl font-sans">
                <li><a>Home</a></li>
                <li><a>About</a></li>
                <li><a>Training</a></li>
                <li><a>Instructors</a></li>
                <li><a>Membership</a></li>
            </ul>
            </div>
            <a className="btn btn-ghost text-xl text-white">FITBUDDY</a>
        </div>
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 text-xl text-white">
            <li><Link href="/HomePage">Home</Link></li>
            <li><a>About</a></li>
            <li><a>Training</a></li>
            <li><a>Instructors</a></li>
            <li><a>Membership</a></li>
            </ul>
        </div>
        <div className="navbar-end">
            <Link href="/Login" className="btn btn-primary"> Log in </Link>
        </div>
    </div>
    </>
  )
}