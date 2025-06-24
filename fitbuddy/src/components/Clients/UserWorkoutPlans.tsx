'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface WorkoutPlan {
  id: number;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  trainer: {
    name: string;
    email: string;
  };
}

export default function UserWorkoutPlans() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:3000/workout-plans/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlans(res.data);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow w-full">
      <h2 className="text-xl font-bold mb-4 text-black">My Workout Plans</h2>
      {loading ? (
        <p>Loading...</p>
      ) : plans.length === 0 ? (
        <p>No workout plans found.</p>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-gray-100 p-4 rounded-lg text-black shadow">
              <h3 className="text-lg font-semibold">{plan.title}</h3>
              <p className="text-sm text-gray-700">{plan.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                From: {plan.startDate} — To: {plan.endDate}
              </p>
              <p className="text-xs text-gray-500">
                Assigned by: {plan.trainer?.name} ({plan.trainer?.email})
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
