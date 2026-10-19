import React, { useEffect, useState } from 'react';
import { checkHealth, HealthStatus } from '../services/api.service';
import { Activity, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await checkHealth();
      if (response.success && response.data) {
        setHealth(response.data);
      } else {
        setError(response.message || 'Failed to connect to API');
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'Backend API connection failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Foundation setup & API verification panel</p>
        </div>
        <button
          onClick={fetchHealth}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Test API Connection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Backend Service Status
            </h3>
            {loading ? (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                Connecting...
              </span>
            ) : error ? (
              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> Disconnected
              </span>
            ) : (
              <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded flex items-center gap-1 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Connected
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              Testing GET /api/v1/health...
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-700 text-sm border border-red-100">
              <p className="font-semibold">API Connection Failure</p>
              <p className="mt-1">{error}</p>
            </div>
          ) : health ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500 uppercase font-semibold">Service Name</span>
                <p className="font-medium text-gray-800 mt-0.5">{health.service}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500 uppercase font-semibold">Server Status</span>
                <p className="font-medium text-emerald-600 mt-0.5">{health.status}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500 uppercase font-semibold">Uptime</span>
                <p className="font-medium text-gray-800 mt-0.5">{health.uptimeSeconds} seconds</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500 uppercase font-semibold">Timestamp</span>
                <p className="font-medium text-gray-800 mt-0.5">
                  {new Date(health.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="bg-slate-900 text-slate-100 p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
              Current Scope
            </span>
            <h4 className="text-xl font-bold mt-1 text-white">Phase 1 Foundation</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Monorepo setup, Yarn workspaces, Express API bootstrap, Vite React shell, Tailwind
              styling, standard response contracts, and TypeScript strict checks complete.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
            Awaiting Phase 2 Approval for Prisma Schema & PostgreSQL setup.
          </div>
        </div>
      </div>
    </div>
  );
};
