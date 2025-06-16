'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface UserMetric {
  id: number;
  weight: number;
  heartRate?: number;
  caloriesBurned?: number;
  recordedAt: string;
}

export default function UserMetricsChart() {
  const [data, setData] = useState<UserMetric[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:3000/user-metrics', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = res.data.map((entry: UserMetric) => ({
          ...entry,
          recordedAt: new Date(entry.recordedAt).toLocaleDateString(),
        }));

        setData(formatted.reverse()); // Show oldest to latest
      } catch (err) {
        console.error('Error fetching metrics for chart:', err);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-indigo-700">Metric Trends Over Time</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="recordedAt" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="weight" stroke="#4f46e5" name="Weight (kg)" />
          <Line type="monotone" dataKey="heartRate" stroke="#ef4444" name="Heart Rate (bpm)" />
          <Line type="monotone" dataKey="caloriesBurned" stroke="#f59e0b" name="Calories Burned" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
