import React from 'react';
import { Home, Users, Activity, BarChart3, FileText } from 'lucide-react';

const menuByRole = {
  admin: [
    { key: 'overview', label: 'Overview', icon: Home },
    { key: 'patients', label: 'Manage Patients', icon: Users },
    { key: 'staff', label: 'Manage Staff', icon: Activity },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  ],
  doctor: [
    { key: 'overview', label: 'Dashboard', icon: Home },
    { key: 'patients', label: 'Assigned Patients', icon: Users },
    { key: 'alerts', label: 'Alerts', icon: Activity },
    { key: 'reports', label: 'Reports', icon: FileText },
  ],
  patient: [
    { key: 'overview', label: 'Overview', icon: Home },
    { key: 'vitals', label: 'Vitals', icon: Activity },
    { key: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { key: 'profile', label: 'Profile', icon: Users },
  ],
};

export default function Sidebar({ role, active, setActive }) {
  const menu = menuByRole[role] || [];
  return (
    <aside className="w-full sm:w-60 shrink-0 border-r border-slate-200 bg-white/60 backdrop-blur px-3 py-4">
      <nav className="space-y-1">
        {menu.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sky-50 hover:text-sky-700 ${
              active === key ? 'bg-sky-100 text-sky-700' : 'text-slate-700'
            }`}
          >
            <Icon size={18} />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
