import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import { CSVLink } from 'react-csv';

interface ClientSummary {
  clientId: number;
  name: string;
  avgWeight: number;
  avgHeartRate: number;
  avgCaloriesBurned: number;
}

interface SummaryResponse {
  summary: ClientSummary[];
  topPerformer: ClientSummary;
}

export default function ClientMetricsComparison() {
  const [data, setData] = useState<ClientSummary[]>([]);
  const [topClient, setTopClient] = useState<ClientSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'radar' | 'bar' | 'scatter'>('radar');
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get<SummaryResponse>(
          'http://localhost:3000/trainer-requests/accepted-clients-metrics/summary',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data.summary);
        setTopClient(res.data.topPerformer);
      } catch (err) {
        console.error('Failed to fetch metrics summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading comparison...</p>;

  const formatRadarData = () => {
    const metrics = ['avgCaloriesBurned', 'avgHeartRate', 'avgWeight'];
    const formatted: any[] = [];

    metrics.forEach((metric) => {
      const entry: any = { metric };
      data.forEach((client) => {
        entry[client.name] = client[metric as keyof ClientSummary];
      });
      formatted.push(entry);
    });
    return formatted;
  };

  const csvData = data.map((client) => ({
    Name: client.name,
    'Average Calories Burned': client.avgCaloriesBurned,
    'Average Heart Rate': client.avgHeartRate,
    'Average Weight': client.avgWeight,
  }));

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgCaloriesBurned" fill="#3b82f6" />
            <Bar dataKey="avgHeartRate" fill="#f59e0b" />
            <Bar dataKey="avgWeight" fill="#10b981" />
          </BarChart>
        );
      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid />
            <XAxis dataKey="avgCaloriesBurned" name="Calories" />
            <YAxis dataKey="avgHeartRate" name="Heart Rate" />
            <ZAxis dataKey="avgWeight" range={[50, 200]} name="Weight" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Clients" data={data} fill="#8884d8" />
          </ScatterChart>
        );
      case 'radar':
      default:
        return (
          <RadarChart data={formatRadarData()}>
            <PolarGrid stroke="#ccc" />
            <PolarAngleAxis dataKey="metric" stroke="#4f46e5" />
            <PolarRadiusAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: 10, color: 'white' }} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#4c51bf' }} />
            {data.map((client, index) => (
              <Radar
                key={client.clientId}
                name={client.name}
                dataKey={client.name}
                stroke={["#3b82f6", "#f59e0b", "#10b981", "#ec4899"][index % 4]}
                fill={["#3b82f6", "#f59e0b", "#10b981", "#ec4899"][index % 4]}
                fillOpacity={0.4}
              />
            ))}
          </RadarChart>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border rounded-xl p-6 mt-10 shadow-md border-white dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Client Metrics Comparison</h2>
        <div className="flex items-center gap-3">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as any)}
            className="border rounded-lg px-3 py-1 bg-white dark:bg-slate-800 text-gray-700 dark:text-white"
          >
            <option value="radar">Radar</option>
            <option value="bar">Bar</option>
            <option value="scatter">Scatter</option>
          </select>
          <CSVLink
            data={csvData}
            filename="client-metrics-comparison.csv"
            className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export CSV
          </CSVLink>
        </div>
      </div>

      {topClient && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Top Performer</h3>
          <p>
            <span className="font-semibold">{topClient.name}</span> burned an average of{' '}
            <span className="font-bold">{topClient.avgCaloriesBurned}</span> calories.
          </p>
        </div>
      )}

      <div ref={chartRef} style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}