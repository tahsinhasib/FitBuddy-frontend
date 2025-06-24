'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Client {
    id: number;
    name: string;
    email: string;
}

interface WorkoutForm {
    title: string;
    description: string;
    startDate?: string;
    endDate?: string;
    exercises?: { name: string; sets: number; reps: number; rest?: string }[];
}

export default function TrainerWorkoutPlans() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [showFormForClient, setShowFormForClient] = useState<number | null>(null);
    const [formData, setFormData] = useState<Record<number, WorkoutForm>>({});
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    const [clientPlans, setClientPlans] = useState<Record<number, any[]>>({});




    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:3000/workout-plans/accepted-clients', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const simplified = res.data
                    .filter((item: any) => item.client)
                    .map((item: any) => ({
                        id: item.client.id,
                        name: item.client.name,
                        email: item.client.email,
                    }));

                setClients(simplified);
                for (const client of simplified) {
                    await fetchClientPlans(client.id);
                }

            } catch (err) {
                console.error('Failed to fetch clients:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const handleInputChange = (clientId: number, field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [clientId]: {
                ...prev[clientId],
                [field]: value,
            },
        }));
    };

    const fetchClientPlans = async (clientId: number) => {
        try {
            const res = await axios.get(`http://localhost:3000/workout-plans/client/${clientId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClientPlans((prev) => ({ ...prev, [clientId]: res.data }));
        } catch (err) {
            console.error(`Failed to fetch plans for client ${clientId}:`, err);
        }
    };


    const handleExerciseChange = (clientId: number, index: number, field: string, value: any) => {
        const exercises = [...(formData[clientId]?.exercises || [])];
        exercises[index] = { ...exercises[index], [field]: value };
        setFormData((prev) => ({
            ...prev,
            [clientId]: { ...prev[clientId], exercises },
        }));
    };

    const addExercise = (clientId: number) => {
        const exercises = [...(formData[clientId]?.exercises || [])];
        exercises.push({ name: '', sets: 0, reps: 0, rest: '' });
        setFormData((prev) => ({
            ...prev,
            [clientId]: { ...prev[clientId], exercises },
        }));
    };

    const removeExercise = (clientId: number, index: number) => {
        const exercises = [...(formData[clientId]?.exercises || [])];
        exercises.splice(index, 1); // Remove exercise at index
        setFormData((prev) => ({
            ...prev,
            [clientId]: { ...prev[clientId], exercises },
        }));
    };

    const submitPlan = async (clientId: number) => {
        const payload = formData[clientId];

        if (!payload) {
            alert('Please fill in the workout plan details before submitting.');
            return;
        }

        if (!payload.title || !payload.description || !payload.startDate || !payload.endDate) {
            alert('Please fill out all required fields: title, description, start and end date.');
            return;
        }

        if (!payload.exercises || payload.exercises.length === 0) {
            alert('Please add at least one exercise.');
            return;
        }

        try {
            await axios.post(`http://localhost:3000/workout-plans/${clientId}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Workout plan created!');
            setShowFormForClient(null);
            setFormData((prev) => ({
                ...prev,
                [clientId]: { title: '', description: '', startDate: '', endDate: '', exercises: [] },
            }));
        } catch (err: any) {
            console.error('Error creating plan:', err);
            alert(err.response?.data?.message || 'Failed to create plan.');
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow w-full">
            <h2 className="text-xl font-bold mb-4 text-black">Your Clients</h2>

            {loading ? (
                <p>Loading...</p>
            ) : clients.length === 0 ? (
                <p>No accepted clients found.</p>
            ) : (
                <div className="space-y-6">
                    {clients.map((client) => (
                        <div key={client.id} className="bg-gray-100 p-4 rounded-xl shadow text-black">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{client.name}</p>
                                    <p className="text-sm text-gray-600">{client.email}</p>
                                </div>
                                <button
                                    className="text-sm text-blue-600 hover:underline"
                                    onClick={() =>
                                        setShowFormForClient((prev) => (prev === client.id ? null : client.id))
                                    }
                                >
                                    {showFormForClient === client.id ? 'Hide Plan Form' : 'Create Plan'}
                                </button>
                            </div>

                            {showFormForClient === client.id && (
                                <div className="mt-4 flex flex-col lg:flex-row gap-6">
                                    {/* Left side: Plan form */}
                                    <div className="flex-1 space-y-3">
                                        {clientPlans[client.id]?.length > 0 && (
                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-sm text-gray-700">Workout Plans & Progress:</h4>
                                                {clientPlans[client.id].map((plan, idx) => {
                                                    const start = new Date(plan.startDate);
                                                    const end = new Date(plan.endDate);
                                                    const today = new Date();

                                                    const total = end.getTime() - start.getTime();
                                                    const elapsed = today.getTime() - start.getTime();
                                                    const progressPercent = Math.min(
                                                        100,
                                                        Math.max(0, Math.round((elapsed / total) * 100))
                                                    );

                                                    const status =
                                                        today < start
                                                            ? 'Upcoming'
                                                            : today > end
                                                                ? 'Completed'
                                                                : 'In Progress';

                                                    const colorClass =
                                                        status === 'Upcoming'
                                                            ? 'bg-yellow-400'
                                                            : status === 'In Progress'
                                                                ? 'bg-blue-500'
                                                                : 'bg-green-500';

                                                    return (
                                                        <div key={idx} className="space-y-1 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                                                            <p className="font-semibold text-black">{plan.title}</p>
                                                            <p className="text-sm text-gray-600">{plan.description}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {plan.startDate.slice(0, 10)} → {plan.endDate.slice(0, 10)} | <span className="italic">{status}</span>
                                                            </p>
                                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                                <div
                                                                    className={`${colorClass} h-full`}
                                                                    style={{ width: `${progressPercent}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-right text-gray-600">{progressPercent}% completed</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}


                                        <input
                                            type="text"
                                            placeholder="Plan Title"
                                            className="w-full p-2 border rounded"
                                            value={formData[client.id]?.title || ''}
                                            onChange={(e) => handleInputChange(client.id, 'title', e.target.value)}
                                        />
                                        <textarea
                                            placeholder="Description"
                                            className="w-full p-2 border rounded"
                                            value={formData[client.id]?.description || ''}
                                            onChange={(e) => handleInputChange(client.id, 'description', e.target.value)}
                                        />
                                        <div className="flex gap-4">
                                            <input
                                                type="date"
                                                className="p-2 border rounded w-full"
                                                value={formData[client.id]?.startDate || ''}
                                                onChange={(e) => handleInputChange(client.id, 'startDate', e.target.value)}
                                            />
                                            <input
                                                type="date"
                                                className="p-2 border rounded w-full"
                                                value={formData[client.id]?.endDate || ''}
                                                onChange={(e) => handleInputChange(client.id, 'endDate', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <p className="font-medium">Exercises:</p>
                                            {(formData[client.id]?.exercises || []).map((exercise, idx) => (
                                                <div key={idx} className="grid grid-cols-2 md:grid-cols-5 gap-2 items-center">
                                                    <input
                                                        type="text"
                                                        placeholder="Exercise name"
                                                        className="p-2 border rounded"
                                                        value={exercise.name}
                                                        onChange={(e) => handleExerciseChange(client.id, idx, 'name', e.target.value)}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Sets"
                                                        className="p-2 border rounded"
                                                        value={exercise.sets}
                                                        onChange={(e) => handleExerciseChange(client.id, idx, 'sets', parseInt(e.target.value))}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Reps"
                                                        className="p-2 border rounded"
                                                        value={exercise.reps}
                                                        onChange={(e) => handleExerciseChange(client.id, idx, 'reps', parseInt(e.target.value))}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Rest"
                                                        className="p-2 border rounded"
                                                        value={exercise.rest || ''}
                                                        onChange={(e) => handleExerciseChange(client.id, idx, 'rest', e.target.value)}
                                                    />
                                                    <button
                                                        className="text-red-600 text-sm hover:underline"
                                                        type="button"
                                                        onClick={() => removeExercise(client.id, idx)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="text-sm text-blue-600 hover:underline"
                                                onClick={() => addExercise(client.id)}
                                            >
                                                + Add Exercise
                                            </button>
                                        </div>

                                        <button
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                            onClick={() => submitPlan(client.id)}
                                        >
                                            Submit Plan
                                        </button>
                                    </div>

                                    {/* Right side: Calendar */}
                                    <div className="w-full lg:w-1/4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Workout Calendar</h4>
                                        <Calendar
                                            tileClassName={({ date }) => {
                                                const dateStr = date.toISOString().split('T')[0];
                                                const plans = clientPlans[client.id] || [];
                                                const isPlanned = plans.some(
                                                    (plan) =>
                                                        dateStr >= plan.startDate.slice(0, 10) &&
                                                        dateStr <= plan.endDate.slice(0, 10)
                                                );
                                                return isPlanned ? 'bg-blue-500 text-white rounded-full' : '';
                                            }}
                                            className="border rounded-xl shadow-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                    ))}
                </div>
            )}
        </div>
    );
}
