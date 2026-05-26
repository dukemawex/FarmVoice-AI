'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getAdminDashboard } from '@/lib/api';

const daily = [
  { channel: 'web', value: 120 },
  { channel: 'whatsapp', value: 180 },
  { channel: 'ussd', value: 210 }
];

const topics = [
  { name: 'pest', value: 28 },
  { name: 'weather', value: 24 },
  { name: 'market', value: 21 },
  { name: 'loan', value: 18 },
  { name: 'planting', value: 15 }
];

const crops = [
  { crop: 'Maize', value: 65 },
  { crop: 'Rice', value: 52 },
  { crop: 'Tomato', value: 38 },
  { crop: 'Cassava', value: 31 },
  { crop: 'Yam', value: 24 }
];

const rating = [
  { day: 'Mon', rating: 4.3 },
  { day: 'Tue', rating: 4.4 },
  { day: 'Wed', rating: 4.5 },
  { day: 'Thu', rating: 4.6 },
  { day: 'Fri', rating: 4.5 },
  { day: 'Sat', rating: 4.7 },
  { day: 'Sun', rating: 4.6 }
];

const palette = ['#E07B39', '#2D6A4F', '#74C0FC', '#f59e0b', '#16a34a'];

export default function AdminPage() {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    getAdminDashboard().then(setDashboard).catch(() => setDashboard(null));
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-savanna-slate">Admin Analytics</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total farmers', value: dashboard?.totalFarmers ?? 0 },
          { label: 'Messages today', value: dashboard?.messagesToday ?? 0 },
          { label: 'Avg rating', value: dashboard?.averageRating ? dashboard.averageRating.toFixed(1) : '0.0' },
          { label: 'Conversations', value: dashboard?.conversations ?? 0 }
        ].map((item) => (
          <div key={item.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">{item.label}</div>
            <div className="mt-2 text-3xl font-bold text-savanna-slate">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 font-semibold text-savanna-green">Daily active farmers by channel</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="channel" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#2D6A4F" radius={[8, 8, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 font-semibold text-savanna-green">Question topic distribution</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topics} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={4}>
                  {topics.map((entry, index) => <Cell key={entry.name} fill={palette[index % palette.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 font-semibold text-savanna-green">Top crops being asked about</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={crops}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="crop" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#E07B39" radius={[8, 8, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 font-semibold text-savanna-green">Satisfaction trend</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rating}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis domain={[3.5, 5]} /><Tooltip /><Line type="monotone" dataKey="rating" stroke="#74C0FC" strokeWidth={3} dot={{ r: 4 }} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}