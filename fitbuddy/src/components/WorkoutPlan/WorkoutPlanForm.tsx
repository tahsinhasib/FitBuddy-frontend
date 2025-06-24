'use client';

import { useState } from 'react';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest?: string;
}

interface WorkoutForm {
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  exercises?: Exercise[];
}

interface Props {
  clientId: number;
  token: string;
  refreshPlans: () => void;
  setShowFormForClient: (id: number | null) => void;
}

export default function WorkoutPlanForm({
  clientId,
  token,
  refreshPlans,
  setShowFormForClient,
}: Props) {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<WorkoutForm>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    exercises: [],
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExerciseChange = (index: number, field: string, value: any) => {
    const updated = [...(formData.exercises || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, exercises: updated }));
  };

  const addExercise = () => {
    setFormData((prev) => ({
      ...prev,
      exercises: [...(prev.exercises || []), { name: '', sets: 0, reps: 0, rest: '' }],
    }));
  };

  const removeExercise = (index: number) => {
    const updated = [...(formData.exercises || [])];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, exercises: updated }));
  };

  const handleSubmit = async () => {
    const { title, description, startDate, endDate, exercises } = formData;

    if (!title || !description || !startDate || !endDate || !exercises?.length) {
      alert('Fill all fields and at least one exercise.');
      return;
    }

    try {
      await fetch(`http://localhost:3000/workout-plans/${clientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      alert('Plan submitted!');
      refreshPlans();
      setShowFormForClient(null);
      setFormData({ title: '', description: '', startDate: '', endDate: '', exercises: [] });
      setShowForm(false);
    } catch (err) {
      alert('Failed to submit plan');
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {!showForm ? (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowForm(true)}
        >
          New
        </button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Plan Title"
            className="w-full p-2 border rounded"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
          <div className="flex gap-4">
            <input
              type="date"
              className="p-2 border rounded w-full"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
            <input
              type="date"
              className="p-2 border rounded w-full"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <p className="font-medium">Exercises:</p>
            {(formData.exercises || []).map((ex, idx) => (
              <div key={idx} className="grid grid-cols-2 md:grid-cols-5 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Name"
                  className="p-2 border rounded"
                  value={ex.name}
                  onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Sets"
                  className="p-2 border rounded"
                  value={ex.sets}
                  onChange={(e) => handleExerciseChange(idx, 'sets', parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Reps"
                  className="p-2 border rounded"
                  value={ex.reps}
                  onChange={(e) => handleExerciseChange(idx, 'reps', parseInt(e.target.value))}
                />
                <input
                  type="text"
                  placeholder="Rest"
                  className="p-2 border rounded"
                  value={ex.rest || ''}
                  onChange={(e) => handleExerciseChange(idx, 'rest', e.target.value)}
                />
                <button
                  className="text-red-600 text-sm hover:underline"
                  type="button"
                  onClick={() => removeExercise(idx)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={addExercise}
            >
              + Add Exercise
            </button>
          </div>

          <div className="flex gap-3">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handleSubmit}
            >
              Submit Plan
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={() => {
                setShowForm(false);
                setFormData({ title: '', description: '', startDate: '', endDate: '', exercises: [] });
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
