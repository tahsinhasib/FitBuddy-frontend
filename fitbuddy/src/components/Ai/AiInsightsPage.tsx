'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HealthInsightCard from './HealthInsightCard';

export default function AiInsightsPage() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await axios.get('http://localhost:3000/user-metrics', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });


                setMetrics(res.data); // you may sort/get latest if needed
            } catch (err) {
                setError('Failed to load user metrics.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) return <p className="text-sm text-gray-500">Loading AI insights...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!metrics || metrics.length === 0) return <p>No metrics found to generate insights.</p>;

    const latest = metrics[metrics.length - 1];

    return (
        <div className="max-w-9xl mx-auto py-6">
            <h2 className="text-2xl font-bold mb-4">AI Health Insights</h2>
            <HealthInsightCard latestMetrics={latest} />
        </div>
    );
}
