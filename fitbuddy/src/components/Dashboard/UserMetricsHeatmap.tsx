'use client';

import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays } from 'date-fns';
import axios from 'axios';

interface HeatmapEntry {
    date: string;  // e.g., "2025-06-23"
    count: number; // typically 1
}

export default function UserMetricsHeatmap() {
    const [heatmapData, setHeatmapData] = useState<HeatmapEntry[]>([]);

    useEffect(() => {
        const fetchHeatmap = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await axios.get('http://localhost:3000/user-metrics/heatmap', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setHeatmapData(response.data);
            } catch (error) {
                console.error('Failed to fetch heatmap data:', error);
            }
        };

        fetchHeatmap();
    }, []);

    const startDate = subDays(new Date(), 180);
    const endDate = new Date();

    return (
        <div className="bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Your Metric Activity</h2>
            <div className="overflow-x-auto">
                <div className="max-w-[1200px] scale-[0.95] origin-top-left">
                    <CalendarHeatmap
                        startDate={startDate}
                        endDate={endDate}
                        values={heatmapData}
                        classForValue={(value) => {
                            if (!value) return 'color-empty';
                            return `color-github-${Math.min(value.count, 4)}`;
                        }}
                        tooltipDataAttrs={(value): { [key: string]: string } => ({
                            'data-tip': value?.date ? `Metric recorded on ${value.date}` : '',
                        })}
                        showWeekdayLabels={true}
                    />
                </div>
            </div>
        </div>
    );
}
