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
    const [loading, setLoading] = useState(false);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

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
            console.error('Error fetching trainers or requests', err);
        } finally {
            setLoading(false);
        }
    };

    const sendRequest = async (trainerId: number) => {
        try {
            await axios.post(
                `http://localhost:3000/trainer-requests/${trainerId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData(); // Refresh lists
        } catch (err: unknown) {
  let message = 'An error occurred while sending the request.';

  if (axios.isAxiosError(err)) {
    message = err.response?.data?.message || err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  alert('Failed to send request: ' + message);
}

    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-6 bg-white rounded-xl shadow w-full">
            <h2 className="text-xl font-bold mb-4">👥 Trainers You May Know</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="space-y-4">
                    {trainers.length === 0 && <p>No new trainers available right now.</p>}
                    {trainers.map(trainer => (
                        <div
                            key={trainer.id}
                            className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm"
                        >
                            <div>
                                <p className="font-medium">{trainer.name}</p>
                                <p className="text-sm text-gray-500">{trainer.email}</p>
                            </div>
                            <button
                                onClick={() => sendRequest(trainer.id)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
                            >
                                Send Request
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <h3 className="text-lg font-semibold mt-8 mb-2">📤 Sent Requests</h3>
            <div className="space-y-3">
                {sentRequests.length === 0 && <p>No requests sent yet.</p>}
                {sentRequests.map(req => (
                    <div
                        key={req.id}
                        className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                    >
                        <div>
                            <p>{req.trainer.name}</p>
                            <p className="text-sm text-gray-600">Status: <strong>{req.status}</strong></p>
                        </div>
                        <p className="text-sm text-gray-400">
                            {new Date(req.requestedAt).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
