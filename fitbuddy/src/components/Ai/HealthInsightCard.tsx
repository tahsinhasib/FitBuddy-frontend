'use client';

import { useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function HealthInsightCard({ latestMetrics }: { latestMetrics: any }) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    setInsight('');
    try {
      const res = await axios.post('http://localhost:3000/ai/generate-insight', latestMetrics);
      setInsight(res.data.insight);
    } catch (err) {
      console.error(err);
      setInsight('❌ Failed to generate insight.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4 space-y-4 border border-gray-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">AI-Based Health Insight</h3>

      <button
        onClick={generateInsight}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={16} />
            Generating...
          </span>
        ) : (
          'Generate Insight'
        )}
      </button>

      {insight && (
        <div className="bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-100 p-3 rounded-md whitespace-pre-wrap text-sm leading-relaxed">
          {insight}
        </div>
      )}
    </div>
  );
}
