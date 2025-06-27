'use client';

import { useState } from 'react';
import { HiUserCircle } from 'react-icons/hi';
import EditProfileModal from './Modals/EditProfileModal';


interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    bio?: string;
    profilePicture?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    location?: string;
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
    };
    specialization?: string;
    experience?: string;
    certifications?: string;
    skills?: string[];
    availability?: {
        days: string[];
        timeSlots: string[];
    };
    trainer?: {
        id: number;
        name: string;
    };
}

export default function UserProfileCard({ user }: { user: User }) {
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(user);

    const display = (value: any) =>
        value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
            ? 'None'
            : value;

    return (
        <div className="mx-auto max-w-screen-lg px-4 py-8 2xl:px-0">
            {/* Profile Header */}
            <div className="mb-8 flex items-center space-x-4">
                {currentUser.profilePicture ? (
                    <img
                        className="h-16 w-16 rounded-lg"
                        src={currentUser.profilePicture}
                        alt="Profile"
                    />
                ) : (
                    <HiUserCircle className="h-16 w-16 text-gray-400 dark:text-gray-600" />
                )}
                <div>
                    <span className="mb-1 inline-block rounded bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                        {currentUser.role.toUpperCase()}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentUser.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                </div>
            </div>

            {/* Info Sections */}
            <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-5">
                    <Field label="Bio" value={display(currentUser.bio)} />
                    <Field label="Phone" value={display(currentUser.phone)} />
                    <Field label="Gender" value={display(currentUser.gender)} />
                    <Field label="Date of Birth" value={display(currentUser.dateOfBirth)} />
                    <Field label="Location" value={display(currentUser.location)} />
                </div>
                <div className="space-y-5">
                    <Field label="Specialization" value={display(currentUser.specialization)} />
                    <Field label="Experience" value={display(currentUser.experience)} />
                    <Field label="Certifications" value={display(currentUser.certifications)} />
                    <Field label="Skills" value={display(currentUser.skills?.join(', '))} />
                    <Field
                        label="Availability"
                        value={
                            currentUser.availability
                                ? `${currentUser.availability.days.join(', ')} at ${currentUser.availability.timeSlots.join(', ')}`
                                : 'None'
                        }
                    />
                </div>
            </div>

            {/* Social Links */}
            <div className="mt-10 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-1">Social Links</h3>
                <dl className="space-y-2">
                    <FieldLink label="Facebook" url={currentUser.socialLinks?.facebook} />
                    <FieldLink label="Twitter" url={currentUser.socialLinks?.twitter} />
                    <FieldLink label="LinkedIn" url={currentUser.socialLinks?.linkedin} />
                </dl>
            </div>

            {/* Trainer Info */}
            <div className="mt-10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-1">Trainer Info</h3>
                <Field label="Trainer Name" value={currentUser.trainer?.name || 'None'} />
            </div>

            {/* Edit Button */}
            <div className="mt-8 text-right">
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-800"
                >
                    <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6M4 21h16" />
                    </svg>
                    Edit your profile
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <EditProfileModal
                    user={currentUser}
                    onClose={() => setShowModal(false)}
                    onUpdated={(updatedUser) => setCurrentUser(updatedUser)}
                />
            )}
        </div>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <dl>
            <dt className="font-semibold text-gray-900 dark:text-white">{label}</dt>
            <dd className="text-gray-500 dark:text-gray-400">{value}</dd>
        </dl>
    );
}

function FieldLink({ label, url }: { label: string; url?: string }) {
    return (
        <div>
            <dt className="text-sm font-medium text-gray-900 dark:text-white">{label}</dt>
            <dd className="text-sm text-gray-500 dark:text-gray-400">
                {url ? (
                    <a href={url} target="_blank" className="text-indigo-500 underline">
                        {url}
                    </a>
                ) : (
                    'None'
                )}
            </dd>
        </div>
    );
}
