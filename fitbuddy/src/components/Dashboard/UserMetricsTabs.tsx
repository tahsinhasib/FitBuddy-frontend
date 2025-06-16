'use client';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const metricsList = [
  { key: 'weight', label: 'Weight (kg)', color: '#4f46e5' },
  { key: 'heartRate', label: 'Heart Rate (bpm)', color: '#ef4444' },
  { key: 'caloriesBurned', label: 'Calories Burned', color: '#f59e0b' },
  { key: 'bmi', label: 'BMI', color: '#10b981' },
  { key: 'waterIntake', label: 'Water Intake (L)', color: '#06b6d4' },
];

interface UserMetric {
  id: number;
  recordedAt: string;
  [key: string]: any;
}

export default function UserMetricsTabs() {
  const [metrics, setMetrics] = useState<UserMetric[]>([]);
  const [activeMetric, setActiveMetric] = useState('weight');
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:3000/user-metrics', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = res.data
          .map((m: UserMetric) => ({
            ...m,
            recordedAt: new Date(m.recordedAt).toLocaleDateString(),
          }))
          .reverse();

        setMetrics(formatted);
      } catch (err) {
        console.error('Failed to fetch user metrics:', err);
      }
    };

    fetchData();
  }, []);

  const selectedMetric = metricsList.find((m) => m.key === activeMetric);

  const handleDownloadPDF = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 20);
    pdf.save(`${selectedMetric?.label || 'metric'}-chart.pdf`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-indigo-700">Your Metrics Over Time</h2>

      <div className="flex flex-wrap gap-2">
        {metricsList.map((metric) => (
          <button
            key={metric.key}
            onClick={() => setActiveMetric(metric.key)}
            className={`px-4 py-2 text-sm rounded-lg shadow font-medium ${
              activeMetric === metric.key
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'
            }`}
          >
            {metric.label}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm shadow"
        >
          Download PDF
        </button>
      </div>

      <div
        className="w-full h-80 bg-white rounded-xl shadow p-4"
        ref={chartRef}
      >
        {selectedMetric ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="recordedAt" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={selectedMetric.key}
                stroke={selectedMetric.color}
                name={selectedMetric.label}
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No data available</p>
        )}
      </div>
    </div>
  );
}
