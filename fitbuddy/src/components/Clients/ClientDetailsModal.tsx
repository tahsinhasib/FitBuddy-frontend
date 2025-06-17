'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface ClientDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: number | null;
    token: string;
}

interface FullClient {
    id: number;
    name: string;
    email: string;
    bio?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    location?: string;
    profilePicture?: string;
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
    };
    specialization?: string;
    experience?: string;
    certifications?: string;
    skills?: string[];
}

export default function ClientDetailsModal({ isOpen, onClose, clientId, token }: ClientDetailsModalProps) {
    const [client, setClient] = useState<FullClient | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClient = async () => {
            if (!clientId || !token) return;
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:3000/users/${clientId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClient(res.data);
            } catch (err) {
                console.error('Failed to fetch client details', err);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchClient();
        }
    }, [clientId, isOpen, token]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
                >
                    &times;
                </button>

                {loading ? (
                    <p>Loading client info...</p>
                ) : client ? (
                    <>
                        <h2 className="text-xl font-bold mb-4 text-center">Client Profile</h2>

<div className="flex items-center space-x-4 mb-6">
  {client?.profilePicture ? (
    <img
      src={client.profilePicture}
      alt="Profile"
      className="w-16 h-16 rounded-full object-cover shadow"
    />
  ) : (
    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-semibold text-white shadow">
      {client?.name?.[0] || '?'}
    </div>
  )}
  <div>
    <p className="text-lg font-semibold">{client?.name || 'N/A'}</p>
    <p className="text-sm text-gray-600">{client?.email || 'N/A'}</p>
  </div>
</div>

<div className="grid grid-cols-1 gap-3 text-sm">
  <div>
    <strong className="text-gray-600">Phone:</strong> {client?.phone || 'N/A'}
  </div>
  <div>
    <strong className="text-gray-600">Gender:</strong> {client?.gender || 'N/A'}
  </div>
  <div>
    <strong className="text-gray-600">Bio:</strong> {client?.bio || 'N/A'}
  </div>
  <div>
    <strong className="text-gray-600">Location:</strong> {client?.location || 'N/A'}
  </div>
  <div>
    <strong className="text-gray-600">Date of Birth:</strong>{' '}
    {client?.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString() : 'N/A'}
  </div>

  <div>
    <strong className="text-gray-600">Social Links:</strong>
    <ul className="list-disc ml-5">
      <li>Facebook: {client?.socialLinks?.facebook || 'N/A'}</li>
      <li>Twitter: {client?.socialLinks?.twitter || 'N/A'}</li>
      <li>LinkedIn: {client?.socialLinks?.linkedin || 'N/A'}</li>
    </ul>
  </div>
</div>


                    </>
                ) : (
                    <p>Client not found.</p>
                )}
            </div>
        </div>
    );
}
