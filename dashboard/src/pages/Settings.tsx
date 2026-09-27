import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { dashboardApi } from '../api/dashboardApi';

export default function Settings() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleWipeData = async () => {
    setIsDeleting(true);
    try {
      await dashboardApi.wipeAllData();
      alert('All data wiped successfully!');
      setShowConfirm(false);
    } catch (error) {
      console.error('Failed to wipe data:', error);
      alert('Failed to wipe data. See console for details.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-8 border-red-500/20">
        <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="text-red-500 w-6 h-6" />
          Danger Zone
        </h3>
        <p className="text-gray-400 mb-6">
          Be careful. These actions are irreversible and will permanently delete data from the database.
        </p>

        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-red-400 font-medium text-lg">Wipe All Data</h4>
            <p className="text-red-400/70 text-sm mt-1">
              Permanently delete all Calls and Registered Devices.
            </p>
          </div>
          
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Trash2 className="w-5 h-5" />
              Delete All Data
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 border border-gray-500/50 px-4 py-2 rounded-lg font-medium transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleWipeData}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
