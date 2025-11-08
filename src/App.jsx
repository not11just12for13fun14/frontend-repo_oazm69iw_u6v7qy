import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import { Card, Stat, Table, Modal } from './components/CommonUI.jsx';
import HeroSpline from './components/HeroSpline.jsx';

// Dummy auth users
const users = {
  admin: { email: 'admin@healthveda.com', password: 'admin123' },
  doctor: { email: 'doctor@healthveda.com', password: 'doctor123' },
  patient: { email: 'patient@healthveda.com', password: 'patient123' },
};

// LocalStorage helpers
const LS = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};

const defaultData = {
  patients: [
    { id: 'P-1001', name: 'Aarav Sharma', age: 45, condition: 'Hypertension', score: 76 },
    { id: 'P-1002', name: 'Neha Verma', age: 32, condition: 'Asthma', score: 82 },
    { id: 'P-1003', name: 'Rohit Mehta', age: 58, condition: 'Diabetes', score: 68 },
  ],
  staff: [
    { id: 'D-201', name: 'Dr. Meera Kapoor', role: 'Cardiologist', shift: 'Day' },
    { id: 'D-202', name: 'Dr. Arjun Rao', role: 'Pulmonologist', shift: 'Night' },
    { id: 'N-301', name: 'Nurse Priya', role: 'ICU Nurse', shift: 'Day' },
  ],
  vitals: [
    { id: 'P-1001', hr: 78, spo2: 97, bp: '128/82' },
    { id: 'P-1002', hr: 84, spo2: 98, bp: '116/76' },
    { id: 'P-1003', hr: 90, spo2: 95, bp: '138/88' },
  ],
  alerts: [
    { id: 'AL-01', text: 'Elevated BP detected for P-1003. Review medication.', severity: 'high' },
    { id: 'AL-02', text: 'Low activity trend for P-1001 in last 24h.', severity: 'medium' },
  ],
};

function useSession() {
  const [session, setSession] = useState(() => LS.get('hv_session', null));
  const login = (payload) => {
    setSession(payload);
    LS.set('hv_session', payload);
  };
  const logout = () => {
    setSession(null);
    LS.remove('hv_session');
  };
  return { session, login, logout };
}

function SimpleBars({ data = [] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2 h-32 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / max) * 100}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            className="w-full rounded-t-md bg-gradient-to-t from-sky-500 to-emerald-400"
            style={{ minHeight: 4 }}
            title={`${d.label}: ${d.value}`}
          />
          <div className="mt-1 text-[10px] text-slate-600 text-center truncate">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function Login({ onAuth }) {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState(users.admin.email);
  const [password, setPassword] = useState(users.admin.password);
  const [error, setError] = useState('');

  useEffect(() => {
    setEmail(users[role].email);
    setPassword(users[role].password);
  }, [role]);

  const submit = (e) => {
    e.preventDefault();
    const creds = users[role];
    if (email === creds.email && password === creds.password) {
      onAuth({ role, email });
    } else {
      setError('Invalid credentials. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <HeroSpline />
        <div className="mx-auto max-w-md mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900">Sign in to HealthVeda</h2>
            <p className="text-sm text-slate-600 mt-1">Choose your role to continue.</p>
            <form onSubmit={submit} className="mt-5 space-y-3">
              <div>
                <label className="text-sm text-slate-700">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-700">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-md bg-slate-900 text-white py-2 text-sm font-medium hover:scale-[1.01] active:scale-[0.99] transition-transform"
              >
                Continue
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { session, login, logout } = useSession();
  const [active, setActive] = useState('overview');

  // Initialize dummy data once
  useEffect(() => {
    if (!LS.get('hv_patients')) LS.set('hv_patients', defaultData.patients);
    if (!LS.get('hv_staff')) LS.set('hv_staff', defaultData.staff);
    if (!LS.get('hv_vitals')) LS.set('hv_vitals', defaultData.vitals);
    if (!LS.get('hv_alerts')) LS.set('hv_alerts', defaultData.alerts);
  }, []);

  const patients = LS.get('hv_patients', []);
  const staff = LS.get('hv_staff', []);
  const vitals = LS.get('hv_vitals', []);
  const alerts = LS.get('hv_alerts', []);

  const [showAddPatient, setShowAddPatient] = useState(false);

  const handleAddPatient = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newP = {
      id: form.get('id') || `P-${Math.floor(Math.random() * 9000) + 1000}`,
      name: form.get('name'),
      age: Number(form.get('age')) || 30,
      condition: form.get('condition') || 'Observation',
      score: Number(form.get('score')) || 70,
    };
    const updated = [newP, ...patients];
    LS.set('hv_patients', updated);
    setShowAddPatient(false);
  };

  const contentByRole = useMemo(() => ({
    admin: (
      <div className="space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Total Patients" value={patients.length} hint="+3 today" />
          <Stat label="Total Staff" value={staff.length} hint="Stable" />
          <Stat label="Active Alerts" value={alerts.length} hint="-1 vs yesterday" />
          <Stat label="Avg Health Score" value={Math.round(patients.reduce((a, c) => a + c.score, 0) / Math.max(1, patients.length))} hint="Improving" />
        </section>

        {active === 'overview' && (
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800">Hospital Activity (Last 7 days)</h3>
            <div className="mt-4">
              <SimpleBars
                data={[
                  { label: 'Mon', value: 12 },
                  { label: 'Tue', value: 18 },
                  { label: 'Wed', value: 9 },
                  { label: 'Thu', value: 22 },
                  { label: 'Fri', value: 17 },
                  { label: 'Sat', value: 11 },
                  { label: 'Sun', value: 14 },
                ]}
              />
            </div>
          </Card>
        )}

        {active === 'patients' && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Manage Patients</h3>
              <button onClick={() => setShowAddPatient(true)} className="rounded-md bg-sky-600 text-white text-sm px-3 py-1.5 hover:opacity-95">Add New</button>
            </div>
            <div className="mt-4">
              <Table
                columns={[ 'id', 'name', 'age', 'condition', 'score' ]}
                data={patients}
              />
            </div>
          </Card>
        )}

        {active === 'staff' && (
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800">Manage Staff</h3>
            <div className="mt-4">
              <Table columns={[ 'id', 'name', 'role', 'shift' ]} data={staff} />
            </div>
          </Card>
        )}

        {active === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold text-slate-800">Patient Intake</h3>
              <div className="mt-4">
                <SimpleBars data={[{label:'Week 1', value: 30},{label:'Week 2', value: 24},{label:'Week 3', value: 33},{label:'Week 4', value: 28}]} />
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-slate-800">Alerts Trend</h3>
              <div className="mt-4">
                <SimpleBars data={[{label:'High', value: 6},{label:'Medium', value: 10},{label:'Low', value: 15}]} />
              </div>
            </Card>
          </div>
        )}
      </div>
    ),
    doctor: (
      <div className="space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Assigned Patients" value={patients.length} />
          <Stat label="Critical Alerts" value={alerts.filter(a=>a.severity==='high').length} />
          <Stat label="Avg Score" value={Math.round(patients.reduce((a,c)=>a+c.score,0)/Math.max(1,patients.length))} />
          <Stat label="Pending Reports" value={3} />
        </section>

        {active === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold text-slate-800">Assigned Patients</h3>
              <div className="mt-4">
                <Table columns={[ 'id', 'name', 'condition', 'score' ]} data={patients} />
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-slate-800">Live Alerts</h3>
              <ul className="mt-4 space-y-2">
                {alerts.map((a) => (
                  <li key={a.id} className={`rounded-md px-3 py-2 text-sm border ${a.severity==='high'?'bg-red-50 border-red-200 text-red-700': a.severity==='medium'?'bg-amber-50 border-amber-200 text-amber-700':'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>{a.text}</li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {active === 'patients' && (
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800">Vitals Snapshot</h3>
            <div className="mt-4">
              <Table columns={[ 'id', 'hr', 'spo2', 'bp' ]} data={vitals} />
            </div>
          </Card>
        )}

        {active === 'alerts' && (
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800">AI Predictions</h3>
            <ul className="mt-4 list-disc list-inside text-slate-700 text-sm space-y-1">
              <li>Possible risk of high BP for P-1003 in next 7 days. Recommend lifestyle counseling.</li>
              <li>Reduced nocturnal SpO₂ variance for P-1002. Monitor sleep quality.</li>
              <li>Improving heart-rate recovery trend for P-1001. Continue current plan.</li>
            </ul>
          </Card>
        )}

        {active === 'reports' && (
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800">Patient Report Generator</h3>
            <div className="mt-3 text-sm text-slate-700">
              <p className="font-medium">Report: Weekly Clinical Summary</p>
              <p className="mt-2">Summary auto-generated using AI signals and clinician notes. Download disabled in demo.</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {patients.slice(0,3).map((p)=> (
                  <Card key={p.id} className="p-3">
                    <p className="font-medium text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-600">Score: {p.score}</p>
                    <p className="text-xs text-slate-600">Focus: {p.condition}</p>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    ),
    patient: (
      <div className="space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Health Score" value={82} hint="Good" />
          <Stat label="Heart Rate" value={`78 bpm`} />
          <Stat label="SpO₂" value={`97%`} />
          <Stat label="BP" value={`122/80`} />
        </section>

        {active === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold text-slate-800">Your Weekly Activity</h3>
              <div className="mt-4">
                <SimpleBars data={[{label:'Mon', value: 7},{label:'Tue', value: 5},{label:'Wed', value: 8},{label:'Thu', value: 6},{label:'Fri', value: 7},{label:'Sat', value: 4},{label:'Sun', value: 5}]} />
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-slate-800">AI Recommendations</h3>
              <ul className="mt-4 list-disc list-inside text-sm text-slate-700 space-y-1">
                <li>30-minute brisk walk daily to maintain score.</li>
                <li>Hydration target: 2.5L per day.</li>
                <li>Reduce sodium intake to lower BP risk.</li>
              </ul>
            </Card>
          </div>
        )}

        {active === 'prescriptions' && (
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800">Doctor Prescriptions</h3>
            <div className="mt-4">
              <Table columns={[ 'Medicine', 'Dose', 'Frequency' ]} data={[
                { 'Medicine': 'Atorvastatin 10mg', 'Dose': '1 tab', 'Frequency': 'HS' },
                { 'Medicine': 'Metformin 500mg', 'Dose': '1 tab', 'Frequency': 'BD' },
                { 'Medicine': 'Amlodipine 5mg', 'Dose': '1 tab', 'Frequency': 'OD' },
              ]} />
            </div>
          </Card>
        )}

        {active === 'vitals' && (
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800">Recent Vitals</h3>
            <div className="mt-4">
              <Table columns={[ 'Date', 'HR', 'SpO₂', 'BP' ]} data={[
                { 'Date': '2025-11-01', 'HR': 76, 'SpO₂': '98%', 'BP': '120/78' },
                { 'Date': '2025-11-02', 'HR': 79, 'SpO₂': '97%', 'BP': '122/80' },
                { 'Date': '2025-11-03', 'HR': 78, 'SpO₂': '97%', 'BP': '122/80' },
              ]} />
            </div>
          </Card>
        )}

        {active === 'profile' && (
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800">Personal Profile</h3>
            <div className="mt-2 text-sm text-slate-700 space-y-1">
              <p>Name: Demo Patient</p>
              <p>Email: patient@healthveda.com</p>
              <p>Primary Doctor: Dr. Meera Kapoor</p>
            </div>
          </Card>
        )}
      </div>
    ),
  }), [active, patients, staff, alerts, vitals]);

  if (!session) return <Login onAuth={login} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role={session.role} onLogout={logout} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4">
          <Sidebar role={session.role} active={active} setActive={setActive} />
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${session.role}-${active}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {contentByRole[session.role]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Modal
        open={showAddPatient}
        onClose={() => setShowAddPatient(false)}
        title="Add New Patient"
        footer={(
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowAddPatient(false)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm">Cancel</button>
            <button form="add-patient" type="submit" className="rounded-md bg-sky-600 text-white px-3 py-1.5 text-sm">Save</button>
          </div>
        )}
      >
        <form id="add-patient" onSubmit={handleAddPatient} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-700">Patient ID</label>
              <input name="id" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="P-1234" />
            </div>
            <div>
              <label className="text-sm text-slate-700">Name</label>
              <input name="name" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Full name" />
            </div>
            <div>
              <label className="text-sm text-slate-700">Age</label>
              <input name="age" type="number" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="45" />
            </div>
            <div>
              <label className="text-sm text-slate-700">Condition</label>
              <input name="condition" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Hypertension" />
            </div>
            <div>
              <label className="text-sm text-slate-700">Health Score</label>
              <input name="score" type="number" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="76" />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
