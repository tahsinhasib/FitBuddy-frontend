'use client';

import { useState } from 'react';
import WorkoutPlanProgress from './WorkoutPlanProgress';
import WorkoutPlanForm from './WorkoutPlanForm';
import WorkoutCalendar from './WorkoutCalendar';
import Clock from './Clock';
import ClientMetricsHeatmap from './ClientMetricsHeatmap';

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
  const isExpanded = showFormForClient === client.id;

  return (
    <div className="bg-white dark:bg-slate-900 text-black dark:text-white p-5 rounded-2xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-slate-700 transition-all">
      {/* Header with avatar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-lg shadow-sm">
            {getInitials(client.name)}
          </div>

          {/* Name & Email */}
          <div>
            <p className="font-semibold text-base text-gray-900 dark:text-white">{client.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition"
          onClick={() => setShowFormForClient(isExpanded ? null : client.id)}
        >
          {isExpanded ? 'Hide Plan Form' : 'Create Plan'}
        </button>
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="mt-4 flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
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

          {/* Right Column */}
          <div className="w-full lg:w-1/3 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Workout Calendar
              </h4>
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
