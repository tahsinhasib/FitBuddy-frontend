'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import ClientWorkoutCard from './ClientWorkoutCard';

interface Client {
    id: number;
    name: string;
    email: string;
}

export default function TrainerWorkoutPlans() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [clientPlans, setClientPlans] = useState<Record<number, any[]>>({});
    const [showFormForClient, setShowFormForClient] = useState<number | null>(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    const fetchClientPlans = async (clientId: number) => {
        try {
            const res = await axios.get(
                `http://localhost:3000/workout-plans/client/${clientId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setClientPlans((prev) => ({ ...prev, [clientId]: res.data }));
        } catch (err) {
            console.error(`Failed to fetch plans for client ${clientId}:`, err);
        }
    };

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    'http://localhost:3000/workout-plans/accepted-clients',
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const simplified = res.data
                    .filter((item: any) => item.client)
                    .map((item: any) => ({
                        id: item.client.id,
                        name: item.client.name,
                        email: item.client.email,
                    }));

                setClients(simplified);
                for (const client of simplified) {
                    await fetchClientPlans(client.id);
                }
            } catch (err) {
                console.error('Failed to fetch clients:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    return (
        <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm dark:shadow-lg w-full transition-all">
            <h2 className="text-2xl font-bold mb-5 text-gray-900 dark:text-white tracking-tight">
                Your Clients
            </h2>

            {loading ? (
                <div className="text-gray-600 dark:text-gray-400 text-sm italic">
                    Loading client data...
                </div>
            ) : clients.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400 text-sm italic">
                    No accepted clients found.
                </div>
            ) : (
                <div className="space-y-6">
                    {clients.map((client) => (
                        <ClientWorkoutCard
                            key={client.id}
                            client={client}
                            token={token || ''}
                            clientPlans={clientPlans[client.id] || []}
                            refreshPlans={() => fetchClientPlans(client.id)}
                            showFormForClient={showFormForClient}
                            setShowFormForClient={setShowFormForClient}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
