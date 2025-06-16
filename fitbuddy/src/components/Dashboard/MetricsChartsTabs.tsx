'use client';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaWeight, FaHeartbeat, FaFireAlt, FaTint, FaBalanceScale, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  BarElement
);

interface Metric {
  weight: number;
  heartRate?: number;
  caloriesBurned?: number;
  bmi?: number;
  waterIntake?: number;
  recordedAt: string;
}

export default function MetricsChartTabs() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [activeTab, setActiveTab] = useState<
    'weight' | 'heartRate' | 'caloriesBurned' | 'bmi' | 'waterIntake'
  >('weight');

  // Ref to the chart instance
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/user-metrics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMetrics(res.data);
    };
    fetchMetrics();
  }, []);

  const formatData = (field: keyof Metric, label: string, color: string) => {
    const orderedMetrics = [...metrics].reverse();

    return {
      labels: orderedMetrics.map(m => new Date(m.recordedAt).toLocaleDateString()),
      datasets: [
        {
          label,
          data: orderedMetrics.map(m => m[field] ?? 0),
          borderColor: color,
          backgroundColor: color + '33',
          fill: true,
        },
      ],
    };
  };

  const exportPdf = () => {
    if (!chartRef.current) {
      alert('Chart not loaded yet!');
      return;
    }
    // get the base64 image string of the chart canvas
    const base64Image = chartRef.current.toBase64Image();

    // create pdf with jsPDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });

    // add image to pdf - scale image to fit page width
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (pdfWidth * chartRef.current.height) / chartRef.current.width;

    pdf.addImage(base64Image, 'PNG', 0, 20, pdfWidth, pdfHeight);
    pdf.save(`metrics-${activeTab}.pdf`);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full">
      <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
        Your Metrics Over Time
        <button
          onClick={exportPdf}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
          aria-label="Export chart as PDF"
        >
          <FaFilePdf /> Export PDF
        </button>
      </h2>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('weight')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
            activeTab === 'weight'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaWeight /> Weight
        </button>
        <button
          onClick={() => setActiveTab('heartRate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
            activeTab === 'heartRate'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaHeartbeat /> Heart Rate
        </button>
        <button
          onClick={() => setActiveTab('caloriesBurned')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
            activeTab === 'caloriesBurned'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaFireAlt /> Calories
        </button>
        <button
          onClick={() => setActiveTab('bmi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
            activeTab === 'bmi'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaBalanceScale /> BMI
        </button>
        <button
          onClick={() => setActiveTab('waterIntake')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
            activeTab === 'waterIntake'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaTint /> Water Intake (L)
        </button>
      </div>

      <div className="w-full">
        {activeTab === 'weight' && (
          <Line ref={chartRef} data={formatData('weight', 'Weight (kg)', '#4f46e5')} />
        )}
        {activeTab === 'heartRate' && (
          <Line ref={chartRef} data={formatData('heartRate', 'Heart Rate (bpm)', '#dc2626')} />
        )}
        {activeTab === 'caloriesBurned' && (
          <Bar ref={chartRef} data={formatData('caloriesBurned', 'Calories Burned', '#16a34a')} />
        )}
        {activeTab === 'bmi' && (
          <Line ref={chartRef} data={formatData('bmi', 'BMI', '#7c3aed')} />
        )}
        {activeTab === 'waterIntake' && (
          <Bar ref={chartRef} data={formatData('waterIntake', 'Water Intake (liters)', '#2563eb')} />
        )}
      </div>
    </div>
  );
}
