import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <div 
    className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 transition-transform duration-500 group-hover:scale-150 ${color}`} />
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-white/5 ${color.replace('bg-', 'text-')}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg border border-white/10 shadow-xl">
        <p className="text-gray-300 mb-1">{label}</p>
        <p className="text-white font-bold text-lg">
          {payload[0].value} <span className="text-sm font-normal text-gray-400">calls</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, dailyRes] = await Promise.all([
          dashboardApi.getSummary(),
          dashboardApi.getDailyCalls(30)
        ]);
        setSummary(sumRes.summary);
        setDailyData(dailyRes.dailyCalls);
      } catch (error) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const formatDuration = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const pieData = [
    { name: 'Incoming', value: summary?.incoming || 0, color: '#34d399' },
    { name: 'Outgoing', value: summary?.outgoing || 0, color: '#60a5fa' },
    { name: 'Missed', value: summary?.missed || 0, color: '#f87171' },
    { name: 'Rejected', value: summary?.rejected || 0, color: '#fbbf24' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Calls" value={summary?.totalCalls || 0} icon={Phone} color="bg-indigo-500" delay={100} />
        <StatCard title="Incoming" value={summary?.incoming || 0} icon={PhoneIncoming} color="bg-emerald-500" delay={200} />
        <StatCard title="Outgoing" value={summary?.outgoing || 0} icon={PhoneOutgoing} color="bg-blue-500" delay={300} />
        <StatCard title="Missed" value={summary?.missed || 0} icon={PhoneMissed} color="bg-rose-500" delay={400} />
        <StatCard title="Total Duration" value={formatDuration(summary?.totalDuration || 0)} icon={Clock} color="bg-cyan-500" delay={600} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Calls Over Time
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="_id" 
                  stroke="#ffffff50" 
                  tick={{fill: '#ffffff50', fontSize: 12}}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#ffffff50"
                  tick={{fill: '#ffffff50', fontSize: 12}}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: '#1e1e2d' }}
                  activeDot={{ r: 6, fill: '#818cf8', stroke: '#fff', strokeWidth: 2 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Call Types
          </h3>
          <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.05)" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e2d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-white">{summary?.totalCalls}</span>
              <span className="text-xs text-gray-400">Total</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-sm text-gray-400">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
