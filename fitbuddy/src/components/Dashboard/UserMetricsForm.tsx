'use client';

import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const initialForm = {
  weight: '',
  height: '',
  bmi: '',
  bodyFatPercentage: '',
  muscleMass: '',
  heartRate: '',
  bloodPressureSystolic: '',
  bloodPressureDiastolic: '',
  caloriesBurned: '',
  waterIntake: '',
  note: '',
};

export default function UserMetricsForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const sanitize = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');

    const payload = {
      weight: sanitize(form.weight),
      height: sanitize(form.height),
      bmi: sanitize(form.bmi),
      bodyFatPercentage: sanitize(form.bodyFatPercentage),
      muscleMass: sanitize(form.muscleMass),
      heartRate: sanitize(form.heartRate),
      bloodPressureSystolic: sanitize(form.bloodPressureSystolic),
      bloodPressureDiastolic: sanitize(form.bloodPressureDiastolic),
      caloriesBurned: sanitize(form.caloriesBurned),
      waterIntake: sanitize(form.waterIntake),
      note: form.note || undefined,
    };

    try {
      await axios.post('http://localhost:3000/user-metrics', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Metrics submitted!');
      setForm(initialForm);
    } catch (err) {
      toast.error('Failed to submit metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 rounded-xl shadow bg-white dark:bg-zinc-900">
      <Toaster />
      <h2 className="text-xl font-semibold mb-4">Submit Your Metrics</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {([
          ['weight', 'Weight (kg)', true],
          ['height', 'Height (cm)'],
          ['bmi', 'BMI'],
          ['bodyFatPercentage', 'Body Fat %'],
          ['muscleMass', 'Muscle Mass (kg)'],
          ['heartRate', 'Heart Rate'],
          ['bloodPressureSystolic', 'Systolic BP'],
          ['bloodPressureDiastolic', 'Diastolic BP'],
          ['caloriesBurned', 'Calories Burned'],
          ['waterIntake', 'Water Intake (L)'],
        ] as [string, string, boolean?][]).map(([key, label, required]) => (
          <div key={key}>
            <label className="block text-sm font-medium">{label}</label>
            <input
              type="number"
              step="any"
              name={key}
              required={!!required}
              value={form[key as keyof typeof form]}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium">Note</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
