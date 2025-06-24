'use client';

import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays } from 'date-fns';
import axios from 'axios';

interface HeatmapEntry {
  date: string; // "YYYY-MM-DD"
  count: number; // e.g. 1
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
      .then((res) => {
        setHeatmapData(res.data);
      })
      .catch((err) => {
        setError('Failed to load heatmap data');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [clientId, token]);

  const startDate = subDays(new Date(), 180);
  const endDate = new Date();

  if (loading) return <p>Loading heatmap...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4 bg-white rounded shadow max-w-[700px] scale-[0.9] origin-top-left">
      <h3 className="text-lg font-semibold mb-4">Metric Activity for Client #{clientId}</h3>
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
        showWeekdayLabels
      />
    </div>
  );
}
