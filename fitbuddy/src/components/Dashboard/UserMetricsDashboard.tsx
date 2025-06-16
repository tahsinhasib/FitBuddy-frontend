'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaWeight,
  FaRulerVertical,
  FaHeartbeat,
  FaTint,
  FaFireAlt,
  FaRegStickyNote,
} from 'react-icons/fa';
import {
  GiBodyHeight,
  GiMuscleUp,
  GiWaterBottle,
  GiWeightLiftingUp,
} from 'react-icons/gi';
import { MdBloodtype, MdOutlineFitnessCenter } from 'react-icons/md';
import { RiHeartPulseFill } from 'react-icons/ri';

interface UserMetric {
  id: number;
  weight: number;
  height?: number;
  bmi?: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  heartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  caloriesBurned?: number;
  waterIntake?: number;
  note?: string;
  recordedAt: string;
}

export default function UserMetricsDashboard() {
  const [metrics, setMetrics] = useState<UserMetric | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:3000/user-metrics/latest', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(res.data);
      } catch (err) {
        console.error('Error fetching metrics:', err);
      }
    };

    fetchMetrics();
  }, []);

  if (!metrics) {
    return <p className="text-gray-500">No metrics data available.</p>;
  }

  const metricCards = [
    { label: 'Weight (kg)', value: metrics.weight, icon: <FaWeight className="text-indigo-500" /> },
    { label: 'Height (cm)', value: metrics.height, icon: <GiBodyHeight className="text-green-500" /> },
    { label: 'BMI', value: metrics.bmi, icon: <MdOutlineFitnessCenter className="text-yellow-500" /> },
    { label: 'Body Fat (%)', value: metrics.bodyFatPercentage, icon: <FaTint className="text-pink-500" /> },
    { label: 'Muscle Mass (kg)', value: metrics.muscleMass, icon: <GiMuscleUp className="text-orange-500" /> },
    { label: 'Heart Rate (bpm)', value: metrics.heartRate, icon: <RiHeartPulseFill className="text-red-500" /> },
    {
      label: 'Blood Pressure',
      value:
        metrics.bloodPressureSystolic && metrics.bloodPressureDiastolic
          ? `${metrics.bloodPressureSystolic}/${metrics.bloodPressureDiastolic}`
          : undefined,
      icon: <MdBloodtype className="text-red-700" />,
    },
    { label: 'Calories Burned', value: metrics.caloriesBurned, icon: <FaFireAlt className="text-orange-400" /> },
    { label: 'Water Intake (L)', value: metrics.waterIntake, icon: <GiWaterBottle className="text-blue-400" /> },
    { label: 'Note', value: metrics.note, icon: <FaRegStickyNote className="text-gray-500" /> },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-indigo-600">Your Latest Health Metrics</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-10 gap-6">
        {metricCards.map(
          (item) =>
            item.value !== undefined &&
            item.value !== null && (
              <div
                key={item.label}
                className="p-4 bg-white rounded-lg shadow-md border flex items-center gap-4"
              >
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-lg font-semibold text-gray-800">{item.value}</p>
                </div>
              </div>
            )
        )}
      </div>
      <p className="text-sm text-gray-400">
        Recorded At: {new Date(metrics.recordedAt).toLocaleString()}
      </p>
    </div>
  );
}
