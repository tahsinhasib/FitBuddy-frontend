'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import ClientMetricsChartTabs from './ClientMetricsChartTabs';

interface UserMetric {
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

interface AcceptedClient {
  clientId: number;
  clientName: string;
  metrics: UserMetric[];
}

export default function AcceptedClientsMetrics() {
  const [clients, setClients] = useState<AcceptedClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMetricsForClientId, setShowMetricsForClientId] = useState<number | null>(null);

  const pageSize = 2;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchClientsMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<AcceptedClient[]>(
        'http://localhost:3000/trainer-requests/accepted-clients-metrics',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClients(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load accepted clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientsMetrics();
  }, []);

  const filteredClients = clients.filter((c) =>
    c.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow w-full text-gray-900 dark:text-gray-100">
      <h2 className="text-xl font-bold mb-4">Your Clients Metrics</h2>

      <input
        type="text"
        placeholder="Search clients..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
      />

      {loading ? (
        <p>Loading clients metrics...</p>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
      ) : paginatedClients.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No clients found.</p>
      ) : (
        <div className="space-y-6">
          {paginatedClients.map((client) => {
            const isOpen = showMetricsForClientId === client.clientId;
            const initials = client.clientName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase();

            return (
              <div
                key={client.clientId}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-full font-semibold text-lg">
                      {initials}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {client.clientName}
                    </h3>
                  </div>
                  <button
                    className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded"
                    onClick={() =>
                      setShowMetricsForClientId(isOpen ? null : client.clientId)
                    }
                  >
                    {isOpen ? 'Hide Metrics' : 'Show Metrics'}
                  </button>
                </div>

                {isOpen && (
                  <>
                    {client.metrics.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400">No metrics recorded yet.</p>
                    ) : (
                      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-200">
                          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr>
                              <th className="px-4 py-2">Date</th>
                              <th className="px-4 py-2">Weight</th>
                              <th className="px-4 py-2">Height</th>
                              <th className="px-4 py-2">BMI</th>
                              <th className="px-4 py-2">Fat %</th>
                              <th className="px-4 py-2">Muscle</th>
                              <th className="px-4 py-2">Heart Rate</th>
                              <th className="px-4 py-2">BP</th>
                              <th className="px-4 py-2">Calories</th>
                              <th className="px-4 py-2">Water (L)</th>
                              <th className="px-4 py-2">Note</th>
                            </tr>
                          </thead>
                          <tbody>
                            {client.metrics.map((metric, idx) => {
                              const bmi = metric.bmi ?? 0;
                              const heartRate = metric.heartRate ?? 0;
                              const systolic = metric.bloodPressureSystolic ?? 0;
                              const diastolic = metric.bloodPressureDiastolic ?? 0;

                              const bmiClass =
                                bmi > 30
                                  ? 'text-red-500'
                                  : bmi < 18.5
                                  ? 'text-yellow-500'
                                  : 'text-green-600';

                              const heartRateClass =
                                heartRate > 100 || heartRate < 60
                                  ? 'text-red-500'
                                  : 'text-green-600';

                              const bpClass =
                                systolic > 140 || diastolic > 90
                                  ? 'text-red-500'
                                  : 'text-green-600';

                              return (
                                <tr
                                  key={idx}
                                  className={`${idx % 2 === 0
                                    ? 'bg-white dark:bg-gray-800'
                                    : 'bg-gray-50 dark:bg-gray-700'
                                    }`}
                                >
                                  <td className="px-4 py-2">{new Date(metric.recordedAt).toLocaleDateString()}</td>
                                  <td className="px-4 py-2">{metric.weight.toFixed(1)}</td>
                                  <td className="px-4 py-2">{metric.height?.toFixed(1) ?? '-'}</td>
                                  <td className={`px-4 py-2 ${bmiClass}`}>
                                    {bmi ? bmi.toFixed(1) : '-'}
                                  </td>
                                  <td className="px-4 py-2">{metric.bodyFatPercentage?.toFixed(1) ?? '-'}</td>
                                  <td className="px-4 py-2">{metric.muscleMass?.toFixed(1) ?? '-'}</td>
                                  <td className={`px-4 py-2 ${heartRateClass}`}>{metric.heartRate ?? '-'}</td>
                                  <td className={`px-4 py-2 ${bpClass}`}>
                                    {systolic && diastolic ? `${systolic}/${diastolic}` : '-'}
                                  </td>
                                  <td className="px-4 py-2">{metric.caloriesBurned ?? '-'}</td>
                                  <td className="px-4 py-2">{metric.waterIntake?.toFixed(1) ?? '-'}</td>
                                  <td className="px-4 py-2">{metric.note || '-'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <ClientMetricsChartTabs metrics={client.metrics} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {filteredClients.length > pageSize && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.ceil(filteredClients.length / pageSize) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
