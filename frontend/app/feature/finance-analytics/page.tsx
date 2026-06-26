import { Activity } from 'lucide-react';

export default function FinanceAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-12 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
          <Activity size={40} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Revenue Analytics</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Advanced analytics and revenue forecasting will be implemented in the next iteration. 
          The data aggregation pipeline is currently collecting metrics.
        </p>
      </div>
    </div>
  );
}
