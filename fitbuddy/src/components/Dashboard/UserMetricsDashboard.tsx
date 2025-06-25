'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    FaWeight,
    FaTint,
    FaFireAlt,
} from 'react-icons/fa';
import {
    GiBodyHeight,
    GiMuscleUp,
    GiWaterBottle,
} from 'react-icons/gi';
import {
    MdBloodtype,
    MdOutlineFitnessCenter,
} from 'react-icons/md';
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
        return <p className="text-gray-500 dark:text-gray-300">No metrics data available.</p>;
    }

    const metricCards = [
        {
            label: 'Weight (kg)',
            value: metrics.weight,
            icon: <FaWeight className="text-indigo-500 dark:text-indigo-500 group-hover:text-white transition-colors" />,
            cardClass: 'bg-white dark:bg-slate-900 hover:bg-indigo-500 dark:hover:bg-indigo-600 group transition duration-300',
        },
        {
            label: 'Height (cm)',
            value: metrics.height,
            icon: <GiBodyHeight className="text-green-500 dark:text-green-700 group-hover:text-white transition-colors" />,
            cardClass: 'bg-white dark:bg-slate-900 hover:bg-green-500 dark:hover:bg-green-600 group transition duration-300',
        },
        {
            label: 'BMI',
            value: metrics.bmi,
            icon: <MdOutlineFitnessCenter className="text-yellow-500 dark:text-yellow-700 group-hover:text-white transition-colors" />,
            cardClass: 'bg-white dark:bg-slate-900 hover:bg-yellow-500 dark:hover:bg-yellow-600 group transition duration-300',
        },
        {
            label: 'Body Fat (%)',
            value: metrics.bodyFatPercentage,
            icon: <FaTint className="text-pink-500 dark:text-pink-700 group-hover:text-white transition-colors" />,
            cardClass: 'bg-white dark:bg-slate-900 hover:bg-pink-500 dark:hover:bg-pink-600 group transition duration-300',
        },
        {
            label: 'Muscle Mass (kg)',
            value: metrics.muscleMass,
            icon: <GiMuscleUp className="text-orange-500 dark:text-orange-700 group-hover:text-white transition-colors" />,
            cardClass: 'bg-white dark:bg-slate-900 hover:bg-orange-500 dark:hover:bg-orange-600 group transition duration-300',
        },
        {
            label: 'Heart Rate (bpm)',
            value: metrics.heartRate,
            icon: <RiHeartPulseFill className="text-red-500 dark:text-red-700 group-hover:text-white transition-colors" />,
            cardClass: 'bg-white dark:bg-slate-900 hover:bg-red-500 dark:hover:bg-red-600 group transition duration-300',
        },
        {
            label: 'Blood Pressure',
            value:
                metrics.bloodPressureSystolic && metrics.bloodPressureDiastolic
                    ? `${metrics.bloodPressureSystolic}/${metrics.bloodPressureDiastolic}`
                    : undefined,
            icon: <MdBloodtype className="text-red-500 dark:text-red-700 group-hover:text-white transition-colors" />,
            cardClass: 'bg-white dark:bg-slate-900 hover:bg-rose-500 dark:hover:bg-rose-600 group transition duration-300',
        },
        {
            label: 'Calories Burned',
            value: metrics.caloriesBurned,
            icon: <FaFireAlt className="text-orange-500 dark:text-orange-700 group-hover:text-white transition-colors" />,
            cardClass: 'bg-white dark:bg-slate-900 hover:bg-orange-500 dark:hover:bg-orange-600 group transition duration-300',
        },
        {
            label: 'Water Intake (L)',
            value: metrics.waterIntake,
            icon: <GiWaterBottle className="text-blue-500 dark:text-blue-700 group-hover:text-white transition-colors" />,
            cardClass: 'bg-white dark:bg-slate-900 hover:bg-blue-500 dark:hover:bg-blue-600 group transition duration-300',
        },

    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-sky-50">Your Latest Health Metrics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-9 gap-6">
                {metricCards.map(
                    (item) =>
                        item.value !== undefined &&
                        item.value !== null && (
                            <div
                                key={item.label}
                                className={`p-4 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition duration-300 ${item.cardClass}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`text-2xl ${item.icon}`}>{item.icon}</div>
                                    <div>
                                        <p className="text-sm text-slate-900 dark:text-sky-50">{item.label}</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-sky-50">{item.value}</p>
                                    </div>
                                </div>
                            </div>
                        )
                )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Last recorded at: {new Date(metrics.recordedAt).toLocaleString()}
            </p>
        </div>
    );
}
