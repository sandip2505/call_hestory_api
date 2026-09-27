import { useState, useEffect } from 'react';
import { callApi } from '../api/callApi';
import { Search, Filter, PhoneIncoming, PhoneOutgoing, PhoneMissed, PlayCircle, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function DeletedCalls() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    fetchCalls();
  }, [page, search, type]);

  const fetchCalls = async () => {
    setLoading(true);
    try {
      // Pass isDeleted: 'true' to fetch only deleted calls from the backend
      const res = await callApi.getCalls({ page, limit: 15, search, type, isDeleted: 'true' });
      setCalls(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch deleted calls');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'incoming': return <PhoneIncoming className="w-4 h-4 text-emerald-400" />;
      case 'outgoing': return <PhoneOutgoing className="w-4 h-4 text-blue-400" />;
      case 'missed': return <PhoneMissed className="w-4 h-4 text-rose-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between border border-red-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-medium text-lg">Deleted History</h3>
            <p className="text-gray-400 text-sm">Calls removed from the device</p>
          </div>
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-md ml-auto">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or phone..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select 
            className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none appearance-none cursor-pointer"
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
          >
            <option value="" className="bg-gray-900">All Types</option>
            <option value="incoming" className="bg-gray-900">Incoming</option>
            <option value="outgoing" className="bg-gray-900">Outgoing</option>
            <option value="missed" className="bg-gray-900">Missed</option>
            <option value="rejected" className="bg-gray-900">Rejected</option>
          </select>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-red-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-red-500/5 border-b border-white/10">
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Duration</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Recording</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">Loading deleted calls...</td>
                </tr>
              ) : calls.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">No deleted calls found.</td>
                </tr>
              ) : (
                calls.map((call: any) => (
                  <tr key={call._id} className="hover:bg-red-500/[0.05] transition-colors cursor-pointer group">
                    <td className="p-4">
                      <div className="flex justify-center w-8 h-8 rounded-full bg-white/5 items-center group-hover:bg-white/10 transition-colors">
                        {getTypeIcon(call.callType)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-white">{call.contactName || 'Unknown'}</span>
                        <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full border border-red-500/20 w-max flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> Deleted
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 font-mono text-sm">{call.phoneNumber}</td>
                    <td className="p-4 text-gray-400 text-sm">
                      {format(new Date(call.timestamp), 'dd MMM yyyy, hh:mm a')}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
                    </td>
                    <td className="p-4 text-center">
                      {call.recordingAvailable ? (
                        <PlayCircle className="w-5 h-5 text-indigo-400 mx-auto opacity-70 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-red-500/20 flex items-center justify-between bg-white/[0.01]">
          <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 text-sm font-medium transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 disabled:opacity-50 text-sm font-medium transition-colors border border-red-500/30"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
