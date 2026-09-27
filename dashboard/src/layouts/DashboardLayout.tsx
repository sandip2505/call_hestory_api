import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Phone, Smartphone, Settings, BarChart2, Trash2 } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Phone, label: 'Calls', path: '/calls' },
    { icon: Trash2, label: 'Deleted Calls', path: '/deleted-calls' },
    { icon: Smartphone, label: 'Devices', path: '/devices' },
    { icon: BarChart2, label: 'Statistics', path: '/statistics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 border-r border-white/10 glass-panel h-screen fixed top-0 left-0 flex flex-col pt-6 z-20">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center shadow-lg">
          <Phone className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-gradient">CallHistory</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg border border-white/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-6">
        <div className="rounded-xl p-4 bg-white/5 border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 premium-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-300 font-medium">System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardLayout() {
  const location = useLocation();
  const titleMap: Record<string, string> = {
    '/': 'Overview',
    '/calls': 'Call History',
    '/deleted-calls': 'Deleted Call History',
    '/devices': 'Registered Devices',
    '/statistics': 'Advanced Statistics',
    '/settings': 'System Settings'
  };

  const currentTitle = titleMap[location.pathname] || 'Dashboard';

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex">
      {/* Background gradients for premium feel */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col relative z-10">
        <header className="h-20 border-b border-white/5 flex items-center px-8 bg-black/20 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-2xl font-semibold text-white tracking-tight">{currentTitle}</h2>
          <div className="ml-auto flex items-center gap-4">
            <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
              <span className="text-xs text-gray-400">Time:</span>
              <span className="text-sm text-gray-200 font-medium">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </header>
        <main className="p-8 flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
