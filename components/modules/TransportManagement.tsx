'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { TransportRoute } from '@/lib/ims-data';
import { Bus, MapPin, PhoneCall, Plus, Radio, Users, CheckCircle2, X } from 'lucide-react';

export function TransportManagement() {
  const { transportRoutes, addAuditLog } = useIMS();
  const [routesList, setRoutesList] = useState<TransportRoute[]>(transportRoutes);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Form State
  const [newRoute, setNewRoute] = useState({
    routeName: 'Connaught Place - South Ex Route',
    busNumber: 'DL-01-AB-9012',
    driverName: 'Mr. Ramesh Singh',
    driverPhone: '+91 98765 11111',
    capacity: 40,
    studentsAssigned: 32,
    stops: ['Connaught Place', 'Lajpat Nagar', 'South Ex', 'Campus Gate 1'],
  });

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    const created: TransportRoute = {
      id: `TR-${Math.floor(100 + Math.random() * 900)}`,
      routeName: newRoute.routeName,
      busNumber: newRoute.busNumber,
      driverName: newRoute.driverName,
      driverPhone: newRoute.driverPhone,
      capacity: Number(newRoute.capacity),
      studentsAssigned: Number(newRoute.studentsAssigned),
      stops: newRoute.stops,
      currentLocationLatLong: { lat: 28.6139, lng: 77.209 },
      status: 'In Transit',
    };
    setRoutesList((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    addAuditLog('TRANSPORT_ADD', `Added bus route ${newRoute.routeName} (${newRoute.busNumber})`);
    setNotification(`New bus route "${newRoute.routeName}" added to GPS fleet!`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Bus className="h-5 w-5 text-yellow-400" /> Transport & Live GPS Tracking
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time GPS vehicle tracking, driver contact list, route coverage, and student bus boarding status.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold transition shadow-lg shadow-yellow-600/30"
        >
          <Plus className="h-4 w-4" /> Add Bus Route
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {notification}
        </div>
      )}

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routesList.map((r) => (
          <div key={r.id} className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-yellow-500/40 transition space-y-3">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-300 font-mono font-bold text-xs flex items-center gap-1">
                <Bus className="h-3.5 w-3.5" /> {r.busNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Radio className="h-3 w-3 animate-pulse text-emerald-400" /> {r.status}
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-white text-base">{r.routeName}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Driver: {r.driverName}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-300">
                <span>Assigned Passengers:</span>
                <span className="font-bold text-white">{r.studentsAssigned} / {r.capacity} Seats</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-yellow-400" />
                <span className="truncate">{r.stops.join(' → ')}</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-800">
              <button
                onClick={() => alert(`Dialing Driver ${r.driverName} at ${r.driverPhone}...`)}
                className="flex-1 py-1.5 rounded-lg bg-yellow-600/20 hover:bg-yellow-600 text-yellow-300 hover:text-white font-bold text-[10px] transition flex items-center justify-center gap-1"
              >
                <PhoneCall className="h-3 w-3" /> Driver Phone
              </button>
              <button
                onClick={() => alert(`Live GPS Tracking for Bus ${r.busNumber}: Lat ${r.currentLocationLatLong.lat}, Lng ${r.currentLocationLatLong.lng}`)}
                className="flex-1 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-[10px] transition flex items-center justify-center gap-1"
              >
                <MapPin className="h-3 w-3" /> Live GPS Ping
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Bus Route Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Add New Bus Route to Fleet</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoute} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Route Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Connaught Place - South Ex Route"
                  value={newRoute.routeName}
                  onChange={(e) => setNewRoute({ ...newRoute, routeName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Bus Vehicle Number</label>
                  <input
                    type="text"
                    required
                    placeholder="DL-01-AB-9012"
                    value={newRoute.busNumber}
                    onChange={(e) => setNewRoute({ ...newRoute, busNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    required
                    value={newRoute.capacity}
                    onChange={(e) => setNewRoute({ ...newRoute, capacity: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={newRoute.driverName}
                    onChange={(e) => setNewRoute({ ...newRoute, driverName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Driver Phone</label>
                  <input
                    type="text"
                    required
                    value={newRoute.driverPhone}
                    onChange={(e) => setNewRoute({ ...newRoute, driverPhone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-bold shadow-lg shadow-yellow-600/30"
                >
                  Add Route to Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
