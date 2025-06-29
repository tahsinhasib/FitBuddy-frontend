'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Trainer {
    id: number;
    name: string;
    email: string;
}

interface SentRequest {
    id: number;
    trainer: Trainer;
    status: 'pending' | 'accepted' | 'rejected';
    requestedAt: string;
}

export default function TrainersYouMayKnow() {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    const [showSentRequests, setShowSentRequests] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [trainersRes, requestsRes] = await Promise.all([
                axios.get('http://localhost:3000/users/trainers', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get('http://localhost:3000/trainer-requests/sent', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);
            setTrainers(trainersRes.data);
            setSentRequests(requestsRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const sendRequest = async (trainerId: number) => {
        try {
            await axios.post(
                `http://localhost:3000/trainer-requests/${trainerId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (err: any) {
            alert(
                'Failed to send request: ' +
                (axios.isAxiosError(err) ? err.response?.data?.message || err.message : 'Unknown error')
            );
        }
    };

    const cancelRequest = async (requestId: number) => {
        try {
            await axios.delete(`http://localhost:3000/trainer-requests/${requestId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchData();
        } catch (err: any) {
            alert(
                'Failed to cancel request: ' +
                (axios.isAxiosError(err) ? err.response?.data?.message || err.message : 'Unknown error')
            );
        }
    };

    const filteredTrainers = trainers.filter(
        (t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.email.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedTrainers = filteredTrainers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const isTrainerRequested = (trainerId: number) =>
        sentRequests.some((req) => req.trainer.id === trainerId);

    const getTrainerRequestStatus = (trainerId: number) =>
        sentRequests.find((req) => req.trainer.id === trainerId)?.status;

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Trainers You May Know</h2>

            <input
                type="text"
                placeholder="Search trainers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />

            {loading ? (
                <p className="text-gray-700 dark:text-gray-300">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
                    {paginatedTrainers.length === 0 && (
                        <p className="col-span-full text-gray-600 dark:text-gray-400">No trainers found.</p>
                    )}
                    {paginatedTrainers.map((trainer) => (
                        <div
                            key={trainer.id}
                            className="relative group bg-gray-200 dark:bg-gray-800 rounded-xl shadow-sm border border-transparent hover:border-indigo-500 transition flex flex-col justify-between items-center p-4 text-center cursor-pointer"
                        >
                            {/* Tooltip */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-40 bg-black text-white text-xs rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                <p>
                                    <strong>{trainer.name}</strong>
                                </p>
                                <p>{trainer.email}</p>
                                {isTrainerRequested(trainer.id) && (
                                    <p>
                                        Status:{' '}
                                        <span
                                            className={`${getTrainerRequestStatus(trainer.id) === 'pending'
                                                    ? 'text-yellow-400'
                                                    : getTrainerRequestStatus(trainer.id) === 'accepted'
                                                        ? 'text-green-400'
                                                        : 'text-red-400'
                                                }`}
                                        >
                                            {getTrainerRequestStatus(trainer.id)}
                                        </span>
                                    </p>
                                )}
                            </div>

                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content w-16 h-16 rounded-full flex items-center justify-center text-center p-4">
                                    <span className="text-lg font-semibold">
                                        {trainer.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .toUpperCase()
                                            .slice(0, 2)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-2">
                                <p className="font-semibold text-sm truncate text-gray-900 dark:text-gray-100">{trainer.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{trainer.email}</p>
                            </div>
                            <div className="flex flex-col items-center gap-2 mt-2">
                                {isTrainerRequested(trainer.id) ? (
                                    <span
                                        className={`px-2 py-1 text-xs rounded-md font-medium ${getTrainerRequestStatus(trainer.id) === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800 px-7 py-2 mb-3 dark:bg-yellow-900 dark:text-yellow-400'
                                                : getTrainerRequestStatus(trainer.id) === 'accepted'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400'
                                            }`}
                                    >
                                        {getTrainerRequestStatus(trainer.id)}
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => sendRequest(trainer.id)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-7 py-2 rounded-md transition mb-3"
                                    >
                                        Send Request
                                    </button>
                                )}

                                <button
                                    onClick={() => alert(`Redirect to profile of ${trainer.name}`)}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {filteredTrainers.length > pageSize && (
                <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: Math.ceil(filteredTrainers.length / pageSize) }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* Sent Requests */}
            <div className="mt-8 mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sent Requests</h3>
                <button
                    onClick={() => setShowSentRequests(!showSentRequests)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                >
                    {showSentRequests ? 'Hide' : 'Show'} Sent Requests
                </button>
            </div>

            <div className="space-y-3">
                {showSentRequests && (
                    <div className="space-y-3">
                        {sentRequests.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">No requests sent yet.</p>
                        ) : (
                            sentRequests.map((req) => (
                                <div
                                    key={req.id}
                                    className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-md shadow-sm text-gray-900 dark:text-gray-100 font-semibold transition-colors"
                                >
                                    <div>
                                        <p>{req.trainer.name}</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Status:{' '}
                                            <span
                                                className={`font-semibold ${req.status === 'pending'
                                                        ? 'text-yellow-600 dark:text-yellow-400'
                                                        : req.status === 'accepted'
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-red-600 dark:text-red-400'
                                                    }`}
                                            >
                                                {req.status}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {new Date(req.requestedAt).toLocaleString()}
                                        </p>
                                        {req.status === 'pending' && (
                                            <button
                                                onClick={() => cancelRequest(req.id)}
                                                className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-400 dark:hover:bg-red-700 cursor-pointer hover:text-red-800 dark:hover:text-red-100 px-3 py-1 rounded-full text-sm font-medium transition-all shadow-sm"
                                                aria-label={`Cancel request to ${req.trainer.name}`}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
