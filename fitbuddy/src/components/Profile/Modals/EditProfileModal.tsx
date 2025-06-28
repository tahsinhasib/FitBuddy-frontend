'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
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
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          leave="ease-in duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              leave="ease-in duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
                    Edit Your Profile
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-500 hover:text-red-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
                  <Input label="Phone" name="phone" value={formData.phone || ''} onChange={handleChange} />
                  <Input label="Bio" name="bio" value={formData.bio || ''} onChange={handleChange} />
                  <Input label="Gender" name="gender" value={formData.gender || ''} onChange={handleChange} />
                  <Input type="date" label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} />
                  <Input label="Location" name="location" value={formData.location || ''} onChange={handleChange} />
                  <Input label="Skills (comma separated)" name="skills" value={formData.skills?.join(', ') || ''} onChange={handleChange} />
                  <Input label="Facebook" name="socialLinks.facebook" value={formData.socialLinks?.facebook || ''} onChange={handleChange} />
                  <Input label="Twitter" name="socialLinks.twitter" value={formData.socialLinks?.twitter || ''} onChange={handleChange} />
                  <Input label="LinkedIn" name="socialLinks.linkedin" value={formData.socialLinks?.linkedin || ''} onChange={handleChange} />

                  {/* Footer */}
                  <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-zinc-700 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-gray-600 dark:text-gray-300 hover:underline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
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
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
