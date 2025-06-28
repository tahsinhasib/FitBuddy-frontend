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
import {
    FaWeight,
    FaHeartbeat,
    FaFireAlt,
    FaTint,
    FaBalanceScale,
    FaFilePdf,
    FaTachometerAlt,
} from 'react-icons/fa';
import jsPDF from 'jspdf';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, BarElement);

interface Metric {
    weight: number;
    heartRate?: number;
    caloriesBurned?: number;
    bmi?: number;
    waterIntake?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    bodyFatPercentage?: number;
    muscleMass?: number;
    recordedAt: string;
}

const metricConfig = {
    weight: {
        label: 'Weight',
        color: '#6366f1', // Indigo
        bg: 'bg-indigo-600',
        hover: 'hover:bg-indigo-600',
        icon: <FaWeight />,
        chartType: 'line',
    },
    heartRate: {
        label: 'Heart Rate',
        color: '#ef4444',
        bg: 'bg-red-600',
        hover: 'hover:bg-red-600',
        icon: <FaHeartbeat />,
        chartType: 'line',
    },
    caloriesBurned: {
        label: 'Calories',
        color: '#22c55e',
        bg: 'bg-green-600',
        hover: 'hover:bg-green-600',
        icon: <FaFireAlt />,
        chartType: 'bar',
    },
    bmi: {
        label: 'BMI',
        color: '#a855f7',
        bg: 'bg-purple-600',
        hover: 'hover:bg-purple-600',
        icon: <FaBalanceScale />,
        chartType: 'line',
    },
    waterIntake: {
        label: 'Water Intake',
        color: '#3b82f6',
        bg: 'bg-blue-600',
        hover: 'hover:bg-blue-600',
        icon: <FaTint />,
        chartType: 'bar',
    },
    bloodPressureSystolic: {
        label: 'BP Systolic',
        color: '#facc15',
        bg: 'bg-yellow-500',
        hover: 'hover:bg-yellow-600',
        icon: <FaTachometerAlt />,
        chartType: 'line',
    },
    bloodPressureDiastolic: {
        label: 'BP Diastolic',
        color: '#eab308',
        bg: 'bg-amber-500',
        hover: 'hover:bg-amber-600',
        icon: <FaTachometerAlt />,
        chartType: 'line',
    },
    bodyFatPercentage: {
        label: 'Body Fat %',
        color: '#ec4899',
        bg: 'bg-pink-600',
        hover: 'hover:bg-pink-600',
        icon: <FaBalanceScale />,
        chartType: 'line',
    },
    muscleMass: {
        label: 'Muscle Mass',
        color: '#10b981',
        bg: 'bg-emerald-600',
        hover: 'hover:bg-emerald-600',
        icon: <FaBalanceScale />,
        chartType: 'line',
    },
} as const;

type MetricKey = keyof typeof metricConfig;

export default function MetricsChartTabs() {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [activeTab, setActiveTab] = useState<MetricKey>('weight');
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
            labels: orderedMetrics.map((m) => new Date(m.recordedAt).toLocaleDateString()),
            datasets: [
                {
                    label,
                    data: orderedMetrics.map((m) => m[field] ?? 0),
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
        const base64Image = chartRef.current.toBase64Image();
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (pdfWidth * chartRef.current.height) / chartRef.current.width;
        pdf.addImage(base64Image, 'PNG', 0, 20, pdfWidth, pdfHeight);
        pdf.save(`metrics-${activeTab}.pdf`);
    };

    const currentConfig = metricConfig[activeTab];

    return (
        <div className="bg-white shadow-md border border-gray-200 dark:bg-slate-900 dark:border-slate-700 rounded-xl p-6 w-full">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                Your Metrics Over Time
                <button
                    onClick={exportPdf}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                >
                    <FaFilePdf /> Export PDF
                </button>
            </h2>

            {/* Tab Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
                {Object.entries(metricConfig).map(([key, config]) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key as MetricKey)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === key
                                ? `${config.bg} text-white`
                                : `bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 ${config.hover}`
                            }`}
                    >
                        {config.icon}
                        {config.label}
                    </button>
                ))}
            </div>

            {/* Chart */}
            <div className="w-full bg-white dark:bg-slate-900 p-4  rounded-lg shadow-inner">
                {metrics.length > 0 &&
                    (() => {
                        const data = formatData(activeTab, currentConfig.label, currentConfig.color);
                        return currentConfig.chartType === 'line' ? (
                            <Line ref={chartRef} data={data} />
                        ) : (
                            <Bar ref={chartRef} data={data} />
                        );
                    })()}
            </div>
        </div>
    );
}
