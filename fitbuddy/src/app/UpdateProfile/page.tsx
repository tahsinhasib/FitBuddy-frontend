'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface User {
    name: string;
    bio?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    location?: string;
    specialization?: string;
    experience?: string;
    certifications?: string;
    skills?: string[];
    availability?: {
        days: string[];
        timeSlots: string[];
    };
}

export default function EditUserProfileForm() {
    const [formData, setFormData] = useState<User>({
        name: '',
        bio: '',
        phone: '',
        gender: '',
        dateOfBirth: '',
        location: '',
        specialization: '',
        experience: '',
        certifications: '',
        skills: [],
        availability: {
            days: [],
            timeSlots: [],
        },
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:3000/users/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFormData(response.data);
            } catch (err) {
                console.error('Failed to fetch user data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        if (name === 'skills') {
            setFormData((prev) => ({
                ...prev,
                skills: value.split(',').map((skill: string) => skill.trim()),
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem('token');

        try {
            await axios.patch('http://localhost:3000/users/me', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('✅ Profile updated successfully!');
        } catch (err) {
            console.error('Update failed', err);
            setMessage('❌ Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-center mt-10 text-gray-600 dark:text-gray-300">Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto mt-10 px-6 py-8 bg-white dark:bg-gray-900 shadow-lg rounded-2xl">
            {/* Back Button */}
            <div className="mb-6">
                <Link
                    href="/Dashboard/User"
                    className="inline-flex items-center text-indigo-600 hover:underline dark:text-indigo-400"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Profile
                </Link>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Your Profile</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal and professional details</p>
            </div>

            {/* Message */}
            {message && (
                <p className="mb-4 text-sm text-center font-medium text-green-600 dark:text-green-400">{message}</p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
                <Input label="Bio" name="bio" value={formData.bio || ''} onChange={handleChange} />
                <Input label="Phone" name="phone" value={formData.phone || ''} onChange={handleChange} />
                <Input label="Gender" name="gender" value={formData.gender || ''} onChange={handleChange} />
                <Input label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth || ''} onChange={handleChange} />
                <Input label="Location" name="location" value={formData.location || ''} onChange={handleChange} />
                <Input label="Specialization" name="specialization" value={formData.specialization || ''} onChange={handleChange} />
                <Input label="Experience" name="experience" value={formData.experience || ''} onChange={handleChange} />
                <Input label="Certifications" name="certifications" value={formData.certifications || ''} onChange={handleChange} />
                <Input label="Skills (comma separated)" name="skills" value={formData.skills?.join(', ') || ''} onChange={handleChange} />

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-white text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}

function Input({
    label,
    name,
    value,
    onChange,
    type = 'text',
}: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}) {
    return (
        <div>
            <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
        </div>
    );
}
