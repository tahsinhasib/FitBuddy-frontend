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
import { useState, useRef, JSX } from 'react';
import jsPDF from 'jspdf';
import {
  FaWeight,
  FaHeartbeat,
  FaFireAlt,
  FaTint,
  FaBalanceScale,
  FaFilePdf,
  FaTachometerAlt,
} from 'react-icons/fa';

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

export default function ClientMetricsChartTabs({ metrics }: { metrics: Metric[] }) {
  const [activeTab, setActiveTab] = useState<
    | 'weight'
    | 'heartRate'
    | 'caloriesBurned'
    | 'bmi'
    | 'waterIntake'
    | 'bloodPressureSystolic'
    | 'bloodPressureDiastolic'
    | 'bodyFatPercentage'
    | 'muscleMass'
  >('weight');

  const chartRef = useRef<any>(null);

  const formatData = (field: keyof Metric, label: string, color: string) => {
    const ordered = [...metrics].sort(
      (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
    );

    return {
      labels: ordered.map(m => new Date(m.recordedAt).toLocaleDateString()),
      datasets: [
        {
          label,
          data: ordered.map(m => m[field] ?? 0),
          borderColor: color,
          backgroundColor: color + '33',
          fill: true,
        },
      ],
    };
  };

  const exportPdf = () => {
    if (!chartRef.current) return;
    const img = chartRef.current.toBase64Image();
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const width = pdf.internal.pageSize.getWidth();
    const height = (width * chartRef.current.height) / chartRef.current.width;
    pdf.addImage(img, 'PNG', 0, 20, width, height);
    pdf.save(`metrics-${activeTab}.pdf`);
  };

  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-black">Metrics Chart</h4>
        <button
          onClick={exportPdf}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          <FaFilePdf /> Export PDF
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {([
          ['weight', 'Weight', <FaWeight />, '#4f46e5'],
          ['heartRate', 'Heart Rate', <FaHeartbeat />, '#dc2626'],
          ['caloriesBurned', 'Calories', <FaFireAlt />, '#16a34a'],
          ['bmi', 'BMI', <FaBalanceScale />, '#7c3aed'],
          ['waterIntake', 'Water', <FaTint />, '#2563eb'],
          ['bloodPressureSystolic', 'BP Systolic', <FaTachometerAlt />, '#facc15'],
          ['bloodPressureDiastolic', 'BP Diastolic', <FaTachometerAlt />, '#eab308'],
          ['bodyFatPercentage', 'Fat %', <FaBalanceScale />, '#db2777'],
          ['muscleMass', 'Muscle', <FaBalanceScale />, '#15803d'],
        ] as [string, string, JSX.Element, string][]).map(([key, label, icon, color]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
              activeTab === key ? 'text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            style={activeTab === key ? { backgroundColor: color } : {}}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'weight' && <Line ref={chartRef} data={formatData('weight', 'Weight (kg)', '#4f46e5')} />}
        {activeTab === 'heartRate' && <Line ref={chartRef} data={formatData('heartRate', 'Heart Rate', '#dc2626')} />}
        {activeTab === 'caloriesBurned' && (
          <Bar ref={chartRef} data={formatData('caloriesBurned', 'Calories', '#16a34a')} />
        )}
        {activeTab === 'bmi' && <Line ref={chartRef} data={formatData('bmi', 'BMI', '#7c3aed')} />}
        {activeTab === 'waterIntake' && <Bar ref={chartRef} data={formatData('waterIntake', 'Water', '#2563eb')} />}
        {activeTab === 'bloodPressureSystolic' && (
          <Line ref={chartRef} data={formatData('bloodPressureSystolic', 'Systolic BP', '#facc15')} />
        )}
        {activeTab === 'bloodPressureDiastolic' && (
          <Line ref={chartRef} data={formatData('bloodPressureDiastolic', 'Diastolic BP', '#eab308')} />
        )}
        {activeTab === 'bodyFatPercentage' && (
          <Line ref={chartRef} data={formatData('bodyFatPercentage', 'Body Fat %', '#db2777')} />
        )}
        {activeTab === 'muscleMass' && (
          <Line ref={chartRef} data={formatData('muscleMass', 'Muscle Mass', '#15803d')} />
        )}
      </div>
    </div>
  );
}
