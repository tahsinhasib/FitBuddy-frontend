'use client';

import { useState } from 'react';
import { FaCheckCircle, FaHourglassHalf, FaClock, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Props {
    plans: any[];
}

export default function WorkoutPlanListWithExercises({ plans }: Props) {
    const today = new Date();
    const itemsPerPage = 6;

    const [filter, setFilter] = useState<'All' | 'Upcoming' | 'In Progress' | 'Completed'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [expanded, setExpanded] = useState<number | null>(null);

    const getStatusAndColor = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const total = end.getTime() - start.getTime();
        const elapsed = today.getTime() - start.getTime();
        const progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));

        const status = today < start ? 'Upcoming' : today > end ? 'Completed' : 'In Progress';
        const colorClass =
            status === 'Upcoming' ? 'bg-yellow-400' : status === 'In Progress' ? 'bg-blue-500' : 'bg-green-500';

        return { status, colorClass, progressPercent };
    };

    const filteredPlans = plans.filter((plan) => {
        const { status } = getStatusAndColor(plan.startDate, plan.endDate);
        return filter === 'All' || status === filter;
    });

    const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visiblePlans = filteredPlans.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (newFilter: typeof filter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Header + Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h4 className="font-semibold text-base text-gray-700 dark:text-gray-300">Workout Plans & Progress</h4>
                <div className="flex flex-wrap gap-2">
                    {['All', 'Upcoming', 'In Progress', 'Completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => handleFilterChange(status as any)}
                            className={`px-3 py-1 text-xs rounded ${filter === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* No Plans */}
            {visiblePlans.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">No plans in this category.</p>
            ) : (
                <>
                    {/* Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {visiblePlans.map((plan, idx) => {
                            const { status, colorClass, progressPercent } = getStatusAndColor(plan.startDate, plan.endDate);
                            const Icon =
                                status === 'Upcoming' ? FaClock : status === 'In Progress' ? FaHourglassHalf : FaCheckCircle;

                            const isExpanded = expanded === idx;

                            return (
                                <div
                                    key={idx}
                                    className="relative bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col justify-between"
                                >
                                    {/* Header */}
                                    <div
                                        className="flex items-center justify-between sm:block cursor-pointer sm:cursor-default"
                                        onClick={() => {
                                            if (window.innerWidth < 640) setExpanded((prev) => (prev === idx ? null : idx));
                                        }}
                                    >
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                            <Icon className="text-xl" />
                                            <p className="font-semibold text-black dark:text-white text-sm sm:text-base">{plan.title}</p>
                                        </div>
                                        <div className="sm:hidden text-gray-600 dark:text-gray-400">
                                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                        </div>
                                    </div>

                                    {/* Accordion content without animation */}
                                    {(isExpanded || window.innerWidth >= 640) && (
                                        <div className="mt-2 overflow-visible">
                                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{plan.description}</p>
                                            <p
                                                className="text-xs text-gray-500 dark:text-gray-400 mt-2 cursor-help"
                                                title={`From ${plan.startDate.slice(0, 10)} to ${plan.endDate.slice(0, 10)}`}
                                            >
                                                {plan.startDate.slice(0, 10)} → {plan.endDate.slice(0, 10)} |{' '}
                                                <span className="italic">{status}</span>
                                            </p>

                                            {/* Progress Bar */}
                                            <div className="space-y-1 mt-4">
                                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                                                    <div className={`${colorClass} h-full`} style={{ width: `${progressPercent}%` }} />
                                                </div>
                                                <p className="text-xs text-right text-gray-600 dark:text-gray-400">{progressPercent}% completed</p>
                                            </div>

                                            {/* Exercises */}
                                            {plan.exercises && plan.exercises.length > 0 ? (
                                                <div className="mt-4">
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exercises:</p>
                                                    <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-200 space-y-1">
                                                        {plan.exercises.map((ex: any, i: number) => (
                                                            <li
                                                                key={`${ex.name}-${ex.sets}-${ex.reps}-${i}`}
                                                                className="hover:text-blue-600 dark:hover:text-blue-400 cursor-default"
                                                            >
                                                                {ex.name} — {ex.sets} sets × {ex.reps} reps
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <p className="mt-4 text-sm italic text-gray-400 dark:text-gray-500">No exercises added for this plan.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination Buttons */}
                    <div className="flex flex-wrap justify-center items-center gap-2 pt-4 flex-col sm:flex-row">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm rounded bg-gray-300 dark:bg-slate-700 hover:bg-gray-400 dark:hover:bg-slate-600 disabled:opacity-50"
                        >
                            ← Prev
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                onClick={() => handlePageChange(num)}
                                className={`px-3 py-1 text-sm rounded ${num === currentPage
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {num}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm rounded bg-gray-300 dark:bg-slate-700 hover:bg-gray-400 dark:hover:bg-slate-600 disabled:opacity-50"
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
