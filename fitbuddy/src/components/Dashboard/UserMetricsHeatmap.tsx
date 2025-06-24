'use client';

import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays, format } from 'date-fns';
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
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Your Metric Activity</h2>
            <div className="max-w-[1200px] scale-[0.9] origin-top-left">
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
    );
}
