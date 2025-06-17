'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

interface JwtPayload {
    userId: number;
    email: string;
    name: string;
    role: string;
}

interface UserSummary {
    id: number;
    name: string;
    email: string;
}

export interface IncomingRequest {
    id: number;
    status: string;
    requestedAt: string;
    client: UserSummary;
    trainer: UserSummary;
}

export default function TrainerRequestsPanel() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    const [trainer, setTrainer] = useState<JwtPayload | null>(null);
    const [requests, setRequests] = useState<IncomingRequest[]>([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:3000/trainer-requests/incoming', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(res.data);
        } catch (err) {
            console.error('Failed to fetch incoming requests:', err);
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (requestId: number, status: 'accepted' | 'rejected' | 'pending') => {
        try {
            const res = await axios.patch(
                `http://localhost:3000/trainer-requests/${requestId}`,
                { action: status === 'accepted' ? 'accept' : 'reject' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(`Request ${status}`);
            fetchRequests();
        } catch (err) {
            toast.error('Failed to update request');
        }
    };

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode<JwtPayload>(token);
            setTrainer(decoded);
        }
    }, [token]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const acceptedClients = requests.filter((req) => req.status === 'accepted');
    const pendingRequests = requests.filter((req) => req.status === 'pending');

    const paginatedPending = pendingRequests.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );
    const totalPages = Math.ceil(pendingRequests.length / itemsPerPage);

    const removeAcceptedClient = async (requestId: number) => {
        try {
            await axios.delete(`http://localhost:3000/trainer-requests/${requestId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Client removed and request deleted');
            fetchRequests();
        } catch (err) {
            toast.error('Failed to remove client');
        }
    };


    return (
        <div className="p-6 bg-white rounded-xl shadow w-full">
            <Toaster />

            {trainer && (
                <div className="mb-4">
                    <p className="text-lg font-bold">Welcome, {trainer.name}</p>
                    <p className="text-sm text-gray-600">{trainer.email}</p>
                </div>
            )}

            <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                Incoming Trainer Requests
                {pendingRequests.length > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                        {pendingRequests.length}
                    </span>
                )}
            </h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {pendingRequests.length === 0 ? (
                        <p className="text-gray-500">No pending requests.</p>
                    ) : (
                        <div className="space-y-4">
                            {paginatedPending.map((req) => (
                                <div key={req.id} className="p-4 border rounded-lg mb-2">
                                    <Link href={`/users/${req.client.id}`} className="block hover:underline">
                                        <p className="font-semibold">{req.client.name}</p>
                                        <p className="text-sm text-gray-700">{req.client.email}</p>
                                    </Link>
                                    <p className="text-xs text-gray-500">
                                        Requested at: {new Date(req.requestedAt).toLocaleString()}
                                    </p>
                                    <div className="mt-2 space-x-2">
                                        <button
                                            onClick={() => updateStatus(req.id, 'accepted')}
                                            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => updateStatus(req.id, 'rejected')}
                                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span>Page {page} of {totalPages}</span>
                                <button
                                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                    disabled={page === totalPages}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    <h3 className="text-lg font-semibold mt-8 mb-2">Accepted Clients</h3>
                    {acceptedClients.length === 0 ? (
                        <p className="text-gray-500">No clients accepted yet.</p>
                    ) : (
                        <ul className="list-disc pl-5 text-gray-800 space-y-1">
                            {acceptedClients.map((req) => (
                                <li key={req.id} className="flex justify-between items-center">
                                    <span>
                                        <Link href={`/users/${req.client.id}`} className="hover:underline">
                                            {req.client.name} ({req.client.email})
                                        </Link>
                                    </span>
                                    <button
                                        onClick={() => removeAcceptedClient(req.id)}
                                        className="text-xs px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    >
                                        Remove Client
                                    </button>

                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}
