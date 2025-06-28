'use client';

import { useState } from 'react';
import WorkoutPlanProgress from './WorkoutPlanProgress';
import WorkoutPlanForm from './WorkoutPlanForm';
import WorkoutCalendar from './WorkoutCalendar';
import Clock from './Clock';
import ClientMetricsHeatmap from './ClientMetricsHeatmap';
import { id } from 'date-fns/locale';

interface Client {
    id: number;
    name: string;
    email: string;
}

interface Props {
    client: Client;
    token: string;
    clientPlans: any[];
    refreshPlans: () => void;
    showFormForClient: number | null;
    setShowFormForClient: (id: number | null) => void;
}

function getInitials(name: string): string {
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
}

export default function ClientWorkoutCard({
    client,
    token,
    clientPlans,
    refreshPlans,
    showFormForClient,
    setShowFormForClient,
}: Props) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-lg text-black border border-gray-200">
            {/* Header with avatar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg shadow">
                        {getInitials(client.name)}
                    </div>
                    {/* Name & Email */}
                    <div>
                        <p className="font-semibold text-base">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                </div>

                {/* Toggle Button */}
                <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => setShowFormForClient(showFormForClient === client.id ? null : client.id)}
                >
                    {showFormForClient === client.id ? 'Hide Plan Form' : 'Create Plan'}
                </button>
            </div>

            {/* Expanded Section */}
            {showFormForClient === client.id && (
                <div className="mt-4 flex flex-col lg:flex-row gap-6">
                    {/* Left: Plans + Form */}
                    <div className="flex-1 space-y-4">
                        {clientPlans.length > 0 && (
                            <WorkoutPlanProgress plans={clientPlans} />
                        )}
                        <WorkoutPlanForm
                            clientId={client.id}
                            token={token}
                            refreshPlans={refreshPlans}
                            setShowFormForClient={setShowFormForClient}
                        />
                    </div>

                    {/* Right: Calendar + Clock */}
                    <div className="w-full lg:w-1/4 space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Workout Calendar</h4>
                            <WorkoutCalendar plans={clientPlans} />
                        </div>
                        <Clock />
                        <ClientMetricsHeatmap clientId={client.id} token={token} />
                    </div>
                </div>
            )}
        </div>
    );
}
