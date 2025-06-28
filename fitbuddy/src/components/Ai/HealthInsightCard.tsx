'use client';

import { useState } from 'react';
import axios from 'axios';
import { Loader2, Sparkles } from 'lucide-react';

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
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="text-blue-600 dark:text-blue-400" size={24} />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          AI-Based Health Insight
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        Get a personalized summary and recommendations based on your latest health metrics.
      </p>

      <button
        onClick={generateInsight}
        disabled={loading}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 disabled:opacity-60 transition"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Generating...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Generate Insight
          </>
        )}
      </button>

      {insight && (
        <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 p-4 rounded-md text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-relaxed shadow-inner">
          {insight}
        </div>
      )}
    </div>
  );
}
