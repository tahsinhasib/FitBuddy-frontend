'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface Props {
    user: any;
    onClose: () => void;
    onUpdated: (updatedUser: any) => void;
}

export default function EditProfileModal({ user, onClose, onUpdated }: Props) {
    const [formData, setFormData] = useState({ ...user });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        if (name.startsWith('socialLinks.')) {
            const key = name.split('.')[1];
            setFormData((prev: any) => ({
                ...prev,
                socialLinks: {
                    ...(prev.socialLinks || {}),
                    [key]: value,
                },
            }));
        } else if (name === 'skills') {
            setFormData((prev: any) => ({
                ...prev,
                skills: value.split(',').map((s: string) => s.trim()),
            }));
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem('token');

        try {
            const res = await axios.patch('http://localhost:3000/users/me', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success('Profile updated successfully!');
            onUpdated(res.data);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden flex flex-col">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white z-10"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Modal Header */}
                <div className="px-6 pt-6 pb-2 border-b dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                        Edit Your Profile
                    </h2>
                </div>

                {/* Scrollable Form Area */}
                <div className="overflow-y-auto px-6 py-4 space-y-5">
                    <form onSubmit={handleSubmit} className="space-y-5 pb-2">
                        <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
                        <Input label="Phone" name="phone" value={formData.phone || ''} onChange={handleChange} />
                        <Input label="Bio" name="bio" value={formData.bio || ''} onChange={handleChange} />
                        <Input label="Gender" name="gender" value={formData.gender || ''} onChange={handleChange} />
                        <Input label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} />
                        <Input label="Location" name="location" value={formData.location || ''} onChange={handleChange} />
                        <Input label="Skills (comma separated)" name="skills" value={formData.skills?.join(', ') || ''} onChange={handleChange} />
                        <Input label="Facebook" name="socialLinks.facebook" value={formData.socialLinks?.facebook || ''} onChange={handleChange} />
                        <Input label="Twitter" name="socialLinks.twitter" value={formData.socialLinks?.twitter || ''} onChange={handleChange} />
                        <Input label="LinkedIn" name="socialLinks.linkedin" value={formData.socialLinks?.linkedin || ''} onChange={handleChange} />
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="px-6 pb-6 pt-2 border-t dark:border-gray-700 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-600 dark:text-gray-300 hover:underline"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
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
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <input
                id={name}
                name={name}
                value={value}
                type={type}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
    );
}
