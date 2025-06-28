'use client';

import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays } from 'date-fns';
import axios from 'axios';
import { FcHeatMap } from 'react-icons/fc';

interface HeatmapEntry {
  date: string; // e.g., "2025-06-23"
  count: number;
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
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-md">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Left Panel */}
        <div className="w-full md:w-1/4 flex flex-col items-center md:items-start text-center md:text-left">
          <FcHeatMap size={80} className="mb-2" />
          <h2 className="text-xl font-bold text-black dark:text-white">Your Activity</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            This heatmap shows your recorded health metrics over the last 6 months. Stay consistent and track your journey!
          </p>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-3/4 overflow-x-auto">
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
    </div>
  );
}
