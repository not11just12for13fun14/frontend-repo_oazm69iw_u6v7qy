import React from 'react';
import { LogOut, Hospital, User, Settings } from 'lucide-react';

const roleLabels = {
  admin: 'Admin',
  doctor: 'Doctor',
  patient: 'Patient',
};

export default function Navbar({ role, onLogout }) {
  return (
    <header className="sticky top-0 z-20 w-full bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Hospital className="text-sky-600" />
          <div>
            <p className="font-semibold text-slate-800 leading-none">HealthVeda</p>
            <p className="text-xs text-slate-500">Smart AI-Integrated Hospital</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {role && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
              <User size={18} />
              <span className="font-medium">{roleLabels[role] || 'Guest'}</span>
            </div>
          )}
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-3 py-1.5 text-sm hover:scale-[1.02] active:scale-[0.99] transition-transform shadow-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
          <button
            className="hidden sm:inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
