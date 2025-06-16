'use client';

import { JSX, useEffect, useState } from 'react';
import axios from 'axios';
import {
    FaWeight,
    FaHeartbeat,
    FaFireAlt,
    FaBalanceScale,
    FaTint,
    FaTachometerAlt,
} from 'react-icons/fa';

interface Metric {
    weight: number;
    heartRate?: number;
    caloriesBurned?: number;
    bmi?: number;
    waterIntake?: number;
    recordedAt: string;
}

interface MetricRowProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  change: string | null;
  unit: string;
  color: string;
}

const formatChange = (latest: number, previous: number | undefined) => {
    if (previous === undefined) return { value: latest, change: null };

    const diff = latest - previous;
    const percent = ((diff / previous) * 100).toFixed(1);

    return {
        value: latest,
        change: diff === 0 ? 'No change' : `${diff > 0 ? '▲' : '▼'} ${Math.abs(diff).toFixed(1)} (${percent}%)`,
        color: diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-500',
    };
};

// const MetricRow = ({
//     label,
//     icon,
//     value,
//     change,
//     unit,
//     color,
// }: {
//     label: string;
//     icon: JSX.Element;
//     value: number;
//     change: string | null;
//     unit: string;
//     color?: string;
// }) => (
//     <div className="flex items-center justify-between py-2 border-b last:border-b-0">
//         <div className="flex items-center gap-3">
//             {icon}
//             <div>
//                 <p className="text-sm text-gray-500">{label}</p>
//                 <p className="text-lg font-medium">{value} {unit}</p>
//             </div>
//         </div>
//         {change && <p className={`text-sm font-medium ${color}`}>{change}</p>}
//     </div>
// );


const MetricRow = ({ label, icon, value, change, unit, color }: MetricRowProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <span className="text-xl text-gray-700">{icon}</span>
        <div>
          <p className="font-medium text-gray-800">{label}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">{value} {unit}</p>
        {change && <p className={`text-sm ${color}`}>{change}</p>}
      </div>
    </div>
  );
};

export default function MetricChangesCard() {
    const [latest, setLatest] = useState<Metric | null>(null);
    const [previous, setPrevious] = useState<Metric | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get<Metric[]>('http://localhost:3000/user-metrics', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const sorted = res.data.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
            setLatest(sorted[0]);
            setPrevious(sorted[1]);
        };

        fetchData();
    }, []);

    if (!latest) return <div className="text-gray-500">No metric data available.</div>;

    const metrics = [
  {
    label: 'Weight',
    icon: <FaWeight className="text-indigo-600" />,
    field: 'weight',
    unit: 'kg',
  },
  {
    label: 'Heart Rate',
    icon: <FaHeartbeat className="text-red-600" />,
    field: 'heartRate',
    unit: 'bpm',
  },
  {
    label: 'Calories Burned',
    icon: <FaFireAlt className="text-orange-500" />,
    field: 'caloriesBurned',
    unit: '',
  },
  {
    label: 'Blood Pressure (Sys)',
    icon: <FaTachometerAlt className="text-yellow-600" />,
    field: 'bloodPressureSystolic',
    unit: 'mmHg',
  },
  {
    label: 'Blood Pressure (Dia)',
    icon: <FaTachometerAlt className="text-yellow-500" />,
    field: 'bloodPressureDiastolic',
    unit: 'mmHg',
  },
  {
    label: 'BMI',
    icon: <FaBalanceScale className="text-purple-600" />,
    field: 'bmi',
    unit: '',
  },
  {
    label: 'Body Fat %',
    icon: <FaBalanceScale className="text-pink-500" />,
    field: 'bodyFatPercentage',
    unit: '%',
  },
  {
    label: 'Muscle Mass',
    icon: <FaBalanceScale className="text-green-600" />,
    field: 'muscleMass',
    unit: 'kg',
  },
  {
    label: 'Water Intake',
    icon: <FaTint className="text-blue-600" />,
    field: 'waterIntake',
    unit: 'L',
  },
];


    return (
        <div className="bg-white shadow rounded-xl p-6 w-full">
            <h2 className="text-xl text-black font-semibold mb-4">Metric Changes</h2>
            {metrics.map(({ label, icon, field, unit }) => {
  const latestVal = Number(latest?.[field as keyof Metric] ?? 0);
  const prevVal = previous?.[field as keyof Metric];
  const prevNum = prevVal !== undefined ? Number(prevVal) : undefined;

  const { value, change, color } = formatChange(latestVal, prevNum);

  return (
    <MetricRow
      key={label}
      label={label}
      icon={icon}
      value={value}
      change={change}
      unit={unit}
      color={color ?? 'text-gray-500'}
    />
  );
})}


        </div>
    );
}
