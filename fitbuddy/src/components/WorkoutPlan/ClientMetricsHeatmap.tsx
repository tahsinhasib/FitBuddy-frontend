'use client';

import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays } from 'date-fns';
import axios from 'axios';

interface HeatmapEntry {
    date: string;
    count: number;
}

interface Props {
    clientId: number;
    token: string;
}

export default function ClientMetricsHeatmap({ clientId, token }: Props) {
    const [heatmapData, setHeatmapData] = useState<HeatmapEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!clientId) return;

        setLoading(true);
        setError(null);

        axios
            .get(`http://localhost:3000/user-metrics/heatmap/${clientId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setHeatmapData(res.data))
            .catch((err) => {
                setError('Failed to load heatmap data');
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [clientId, token]);

    const startDate = subDays(new Date(), 180);
    const endDate = new Date();

    if (loading) return <p className="text-sm text-gray-600 dark:text-gray-300">Loading heatmap...</p>;
    if (error) return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;

    return (
        <div className="p-5 rounded-2xl shadow border border-gray-200 dark:border-slate-700 bg-white text-black dark:bg-slate-900 dark:text-white overflow-x-auto max-w-full transition">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-yellow-400">
                Metric Activity for Client #{clientId}
            </h3>

            <div className="scale-95 origin-top-left">
                <CalendarHeatmap
                    startDate={startDate}
                    endDate={endDate}
                    values={heatmapData}
                    classForValue={(value) => {
                        if (!value) return 'color-github-0';
                        return `color-github-${Math.min(value.count, 4)}`;
                    }}
                    tooltipDataAttrs={(value) => {
                        return {
                            'data-tip': value && value.date ? `Metric recorded on ${value.date}` : '',
                        } as { [key: string]: string };
                    }}
                    showWeekdayLabels
                />
            </div>
        </div>
    );
}
