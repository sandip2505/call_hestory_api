import { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { deviceApi } from '../api/deviceApi';

export default function Devices() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await deviceApi.getDevices({ limit: 50 });
      setDevices(res.data || []);
    } catch (error) {
      console.error('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center">
        <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
        <h3 className="text-xl font-medium text-white mb-2">No Devices Found</h3>
        <p className="text-gray-400">Sync your mobile app to register a device.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {devices.map((device) => (
        <div key={device._id} className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="w-16 h-16 rounded-2xl premium-gradient flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{device.deviceName || 'Unknown Device'}</h2>
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mt-1">
                <CheckCircle className="w-4 h-4" />
                Active & Synced
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <p className="text-gray-400 text-sm mb-1">Manufacturer</p>
              <p className="text-lg font-medium text-white capitalize">{device.manufacturer || 'Unknown'}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <p className="text-gray-400 text-sm mb-1">Model</p>
              <p className="text-lg font-medium text-white">{device.model || 'Unknown'}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <p className="text-gray-400 text-sm mb-1">Android Version</p>
              <p className="text-lg font-medium text-white">{device.androidVersion || 'N/A'}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <p className="text-gray-400 text-sm mb-1">App Version</p>
              <p className="text-lg font-medium text-white">{device.appVersion || 'N/A'}</p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-2 text-sm text-gray-400 relative z-10">
            <Clock className="w-4 h-4" />
            Last seen {formatDistanceToNow(new Date(device.lastSeenAt || device.updatedAt), { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  );
}
