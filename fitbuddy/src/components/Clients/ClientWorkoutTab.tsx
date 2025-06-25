'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import UserMetricsHeatmap from '../Dashboard/UserMetricsHeatmap';
import WorkoutCalendar from '../WorkoutPlan/WorkoutCalendar';
import WorkoutPlanListWithExercises from '../WorkoutPlan/WorkoutPlanListWithExercises';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
}

interface WorkoutPlan {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  exercises: Exercise[];
}

export default function ClientWorkoutTab() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/workout-plans/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlans(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load workout plans.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Fitness Dashboard</h2>

      {/* 🔲 Row: Heatmap + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-black">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3">Metric Activity Heatmap</h3>
          <UserMetricsHeatmap />
        </div>

        <div className="bg-white p-4 rounded shadow text-black">
          <h3 className="text-lg font-semibold mb-3">Workout Calendar</h3>
          <WorkoutCalendar plans={plans} />
        </div>
      </div>

      {/* ⬇️ Workout Plans */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Workout Plans</h3>
        {loading && <p>Loading plans...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && plans.length === 0 && (
          <p>No workout plans assigned yet.</p>
        )}
        {plans.length > 0 && <WorkoutPlanListWithExercises plans={plans} />}
      </div>
    </div>
  );
}
