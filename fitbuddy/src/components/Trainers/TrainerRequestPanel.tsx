'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Optional icon
import ClientDetailsModal from '../Clients/ClientDetailsModal';

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

    const [showModal, setShowModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

    const [showAcceptedClients, setShowAcceptedClients] = useState(false);


    const [acceptedPage, setAcceptedPage] = useState(1);
    const acceptedItemsPerPage = 6;

    const paginatedAcceptedClients = acceptedClients.slice(
        (acceptedPage - 1) * acceptedItemsPerPage,
        acceptedPage * acceptedItemsPerPage
    );
    const totalAcceptedPages = Math.ceil(acceptedClients.length / acceptedItemsPerPage);


    const [showClientModal, setShowClientModal] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

    

    return (
        <div className="p-6 bg-white rounded-xl shadow w-full">
            <Toaster />


            {/* {trainer && (
                <div className="mb-4">
                    <p className="text-lg font-bold">Welcome, {trainer.name}</p>
                    <p className="text-sm text-gray-600">{trainer.email}</p>
                </div>
            )}
             */}

            <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                Incoming Requests
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                                {paginatedPending.map((req) => {
                                    const initials = req.client.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase();

                                    return (
                                        <div
                                            key={req.id}
                                            className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <Link
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setSelectedClientId(req.client.id);
                                                            setShowClientModal(true);
                                                        }}
                                                        className="text-base font-semibold hover:underline"
                                                    >
                                                        {req.client.name}
                                                    </Link>
                                                    <p className="text-sm text-gray-500">{req.client.email}</p>
                                                    <p className="text-xs text-gray-400">
                                                        Requested at: {new Date(req.requestedAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
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
                                    );
                                })}
                            </div>

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

                    <ConfirmDeleteModal
                        isOpen={showModal}
                        onCancel={() => {
                            setShowModal(false);
                            setSelectedRequestId(null);
                        }}
                        onConfirm={() => {
                            if (selectedRequestId !== null) {
                                removeAcceptedClient(selectedRequestId);
                                setShowModal(false);
                                setSelectedRequestId(null);
                            }
                        }}
                    />

                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">Accepted Clients</h3>
                            <button
                                onClick={() => setShowAcceptedClients((prev) => !prev)}
                                className="text-sm text-blue-600 hover:underline flex items-center"
                            >
                                {showAcceptedClients ? (
                                    <>
                                        Hide Clients <ChevronUp className="ml-1 w-4 h-4" />
                                    </>
                                ) : (
                                    <>
                                        Show Clients <ChevronDown className="ml-1 w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>

                        {showAcceptedClients && (
                            <>
                                {acceptedClients.length === 0 ? (
                                    <p className="text-gray-500">No clients accepted yet.</p>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                                            {paginatedAcceptedClients.map((req) => {
                                                const initials = req.client.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .toUpperCase();

                                                return (
                                                    <div
                                                        key={req.id}
                                                        className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition"
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
                                                                {initials}
                                                            </div>
                                                            <div>
                                                                <Link
                                                                    href="#"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setSelectedClientId(req.client.id);
                                                                        setShowClientModal(true);
                                                                    }}
                                                                    className="text-base font-semibold hover:underline"
                                                                >
                                                                    {req.client.name}
                                                                </Link>


                                                                <p className="text-sm text-gray-500">{req.client.email}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedRequestId(req.id);
                                                                setShowModal(true);
                                                            }}
                                                            className="text-xs px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Pagination */}
                                        <div className="flex justify-between items-center mt-4">
                                            <button
                                                onClick={() => setAcceptedPage((p) => Math.max(p - 1, 1))}
                                                disabled={acceptedPage === 1}
                                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                            >
                                                Previous
                                            </button>
                                            <span>
                                                Page {acceptedPage} of {totalAcceptedPages}
                                            </span>
                                            <button
                                                onClick={() => setAcceptedPage((p) => Math.min(p + 1, totalAcceptedPages))}
                                                disabled={acceptedPage === totalAcceptedPages}
                                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                        <ClientDetailsModal
                            isOpen={showClientModal}
                            onClose={() => {
                                setShowClientModal(false);
                                setSelectedClientId(null);
                            }}
                            clientId={selectedClientId}
                            token={token || ''}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
