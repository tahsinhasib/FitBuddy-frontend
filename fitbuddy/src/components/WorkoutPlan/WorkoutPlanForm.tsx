'use client';

import { useState, Fragment } from 'react';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<WorkoutForm>({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        exercises: [],
    });

    const addExercise = () => {
        setFormData((prev) => ({
            ...prev,
            exercises: [...(prev.exercises || []), { name: '', sets: 0, reps: 0 }],
        }));
    };

    const removeExercise = (index: number) => {
        const updated = [...(formData.exercises || [])];
        updated.splice(index, 1);
        setFormData((prev) => ({ ...prev, exercises: updated }));
    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleExerciseChange = (index: number, field: string, value: any) => {
        const updated = [...(formData.exercises || [])];
        updated[index] = { ...updated[index], [field]: value };
        setFormData((prev) => ({ ...prev, exercises: updated }));
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;
        const items = Array.from(formData.exercises || []);
        const [reordered] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reordered);
        setFormData((prev) => ({ ...prev, exercises: items }));
    };

    const handleSubmit = async () => {
        const { title, description, startDate, endDate, exercises } = formData;
        if (!title || !description || !startDate || !endDate || !exercises?.length) {
            toast.error('Please fill in all fields and at least one exercise.');
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

            toast.success('Workout plan submitted!');
            refreshPlans();
            setShowFormForClient(null);
            setFormData({ title: '', description: '', startDate: '', endDate: '', exercises: [] });
            setOpen(false);
        } catch (err) {
            toast.error('Failed to submit workout plan.');
            console.error(err);
        }
    };

    return (
        <>
            <button
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                onClick={() => setOpen(true)}
            >
                New Workout Plan
            </button>

            <Transition show={open} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        leave="ease-in duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gradient-to-br from-white/60 to-gray-100/80 dark:from-black/40 dark:to-zinc-900/70 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto p-4 flex items-center justify-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            leave="ease-in duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl transition-all border border-gray-200 dark:border-zinc-700">
                                <div className="flex items-center justify-between mb-6 border-b pb-4 border-gray-200 dark:border-zinc-700">
                                    <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
                                        Create Workout Plan
                                    </Dialog.Title>
                                    <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-red-500 transition">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Plan Title"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        value={formData.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                    />
                                    <textarea
                                        placeholder="Description"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                    />
                                    <div className="flex gap-4">
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            value={formData.startDate}
                                            onChange={(e) => handleChange('startDate', e.target.value)}
                                        />
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            value={formData.endDate}
                                            onChange={(e) => handleChange('endDate', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-gray-700 dark:text-gray-100 mb-2">Exercises</p>
                                        <DragDropContext onDragEnd={handleDragEnd}>
                                            <Droppable droppableId="exercises">
                                                {(provided) => (
                                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                                        {(formData.exercises || []).map((ex, idx) => (
                                                            <Draggable key={idx} draggableId={`ex-${idx}`} index={idx}>
                                                                {(provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className="flex flex-wrap gap-2 items-center p-4 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 shadow-sm"
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Exercise Name"
                                                                            className="flex-1 px-3 py-2 border rounded bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                                                                            value={ex.name}
                                                                            onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                                                                        />
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Sets"
                                                                            className="w-20 px-3 py-2 border rounded bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                                                                            value={ex.sets}
                                                                            onChange={(e) => handleExerciseChange(idx, 'sets', parseInt(e.target.value))}
                                                                        />
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Reps"
                                                                            className="w-20 px-3 py-2 border rounded bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                                                                            value={ex.reps}
                                                                            onChange={(e) => handleExerciseChange(idx, 'reps', parseInt(e.target.value))}
                                                                        />
                                                                        <button
                                                                            onClick={() => removeExercise(idx)}
                                                                            className="text-red-600 hover:underline text-sm"
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                        <button
                                            onClick={addExercise}
                                            className="mt-3 text-sm text-indigo-600 hover:underline"
                                        >
                                            + Add Exercise
                                        </button>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-zinc-700">
                                        <button
                                            onClick={handleSubmit}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                        >
                                            Submit Plan
                                        </button>
                                        <button
                                            onClick={() => setOpen(false)}
                                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
