import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="p-4 bg-amber-50 rounded-full text-amber-600 mb-4 border border-amber-200">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900">Module Under Construction</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        This route is reserved for upcoming development phases. Business logic and views will be
        populated step-by-step.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
};
