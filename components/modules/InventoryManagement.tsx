'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { InventoryItem } from '@/lib/ims-data';
import { Package, Plus, CheckCircle, AlertTriangle, CheckCircle2, X } from 'lucide-react';

export function InventoryManagement() {
  const { inventoryItems, addInventoryItem, updateInventoryItem, addAuditLog } = useIMS();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Form State
  const [newItem, setNewItem] = useState({
    name: 'Dell OptiPlex Desktop i7',
    category: 'IT Hardware' as const,
    quantity: 25,
    unitPrice: 55000,
    location: 'Computer Lab 3',
    assetCode: 'AST-IT-9012',
    condition: 'Good' as const,
    lastInspected: new Date().toISOString().split('T')[0],
  });

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryItem({
      name: newItem.name,
      category: newItem.category,
      quantity: Number(newItem.quantity),
      unitPrice: Number(newItem.unitPrice),
      location: newItem.location,
      assetCode: newItem.assetCode,
      condition: newItem.condition,
      lastInspected: newItem.lastInspected,
    });
    setIsAddModalOpen(false);
    setNotification(`Asset "${newItem.name}" added to inventory catalog!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleUpdateStock = (id: string, delta: number) => {
    updateInventoryItem(id, delta);
    setNotification('Asset stock quantity updated!');
    setTimeout(() => setNotification(''), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Package className="h-5 w-5 text-indigo-400" /> Asset & Inventory Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Campus IT hardware tracking, lab equipment maintenance records, stationery stock levels, and purchase orders.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
        >
          <Plus className="h-4 w-4" /> Add Asset Item
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {notification}
        </div>
      )}

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {inventoryItems.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <span className="font-bold text-white text-sm">{item.name}</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300">
                {item.category}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1 font-mono">
              <p><strong>Asset Code:</strong> {item.assetCode}</p>
              <p><strong>Location:</strong> {item.location}</p>
              <p><strong>Quantity:</strong> <span className="font-bold text-white">{item.quantity} Units</span></p>
              <p><strong>Unit Cost:</strong> ₹{item.unitPrice.toLocaleString()}</p>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-emerald-400 font-bold">Condition: {item.condition}</span>
              <span className="text-[10px] text-slate-500">Inspected: {item.lastInspected}</span>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800">
              <button
                onClick={() => handleUpdateStock(item.id, 1)}
                className="flex-1 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-[10px] transition"
              >
                + Restock Stock
              </button>
              <button
                onClick={() => handleUpdateStock(item.id, -1)}
                className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] transition"
              >
                - Issue Asset
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Add New Asset / Inventory Item</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Asset Code</label>
                  <input
                    type="text"
                    required
                    value={newItem.assetCode}
                    onChange={(e) => setNewItem({ ...newItem, assetCode: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="IT Hardware">IT Hardware</option>
                    <option value="Lab Equipment">Lab Equipment</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Stationery">Stationery</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Location / Room</label>
                <input
                  type="text"
                  required
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
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
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
