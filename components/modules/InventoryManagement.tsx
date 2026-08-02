'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { InventoryItem } from '@/lib/ims-data';
import {
  Package,
  Plus,
  CheckCircle2,
  X,
  Edit,
  Trash2,
  Search,
  Filter,
  Shield,
  Wrench,
  AlertTriangle,
  Boxes,
} from 'lucide-react';

export function InventoryManagement() {
  const {
    currentRole,
    inventoryItems,
    addInventoryItem,
    updateInventoryItem,
    editInventoryItem,
    deleteInventoryItem,
  } = useIMS();

  const canManageInventory = ['Super Admin', 'Director', 'Principal', 'Accountant', 'HR', 'Teacher'].includes(currentRole);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAssetForEdit, setSelectedAssetForEdit] = useState<InventoryItem | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [notification, setNotification] = useState('');

  // Add Asset Form State
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

  // Edit Asset Form State
  const [editItemForm, setEditItemForm] = useState<{
    name: string;
    category: InventoryItem['category'];
    quantity: number;
    unitPrice: number;
    location: string;
    assetCode: string;
    condition: InventoryItem['condition'];
    lastInspected: string;
  }>({
    name: '',
    category: 'IT Hardware',
    quantity: 0,
    unitPrice: 0,
    location: '',
    assetCode: '',
    condition: 'Good',
    lastInspected: '',
  });

  const filteredAssets = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenEditModal = (item: InventoryItem) => {
    setSelectedAssetForEdit(item);
    setEditItemForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      location: item.location,
      assetCode: item.assetCode,
      condition: item.condition,
      lastInspected: item.lastInspected,
    });
    setIsEditModalOpen(true);
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageInventory) return;

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
    setTimeout(() => setNotification(''), 3500);
  };

  const handleSaveEditAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageInventory || !selectedAssetForEdit) return;

    editInventoryItem(selectedAssetForEdit.id, {
      name: editItemForm.name,
      category: editItemForm.category,
      quantity: Number(editItemForm.quantity),
      unitPrice: Number(editItemForm.unitPrice),
      location: editItemForm.location,
      assetCode: editItemForm.assetCode,
      condition: editItemForm.condition,
      lastInspected: editItemForm.lastInspected,
    });

    setIsEditModalOpen(false);
    setSelectedAssetForEdit(null);
    setNotification(`Inventory asset "${editItemForm.name}" updated!`);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleDeleteAsset = (item: InventoryItem) => {
    if (!canManageInventory) return;
    if (window.confirm(`Are you sure you want to delete asset "${item.name}" (${item.assetCode}) from inventory?`)) {
      deleteInventoryItem(item.id);
      setNotification(`Asset ${item.name} removed from catalog.`);
      setTimeout(() => setNotification(''), 3500);
    }
  };

  const handleUpdateStock = (id: string, delta: number) => {
    if (!canManageInventory) return;
    updateInventoryItem(id, delta);
    setNotification('Asset stock quantity updated!');
    setTimeout(() => setNotification(''), 2500);
  };

  const totalAssetsCount = inventoryItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalValuation = inventoryItems.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Shield className="h-3 w-3 text-indigo-400" /> Super Admin & Concern Manager Active
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Package className="h-5 w-5 text-indigo-400" /> Asset & Inventory Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Campus IT hardware tracking, lab equipment maintenance records, stationery stock levels, and asset condition monitoring.
          </p>
        </div>

        {canManageInventory && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
          >
            <Plus className="h-4 w-4" /> Add Asset Item
          </button>
        )}
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> {notification}
        </div>
      )}

      {/* Overview KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <span className="text-slate-400 text-xs font-semibold">Total Asset SKUs</span>
          <p className="text-xl font-extrabold text-white mt-1">{inventoryItems.length}</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <span className="text-slate-400 text-xs font-semibold">Total Unit Stock</span>
          <p className="text-xl font-extrabold text-indigo-400 mt-1">{totalAssetsCount} Units</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <span className="text-slate-400 text-xs font-semibold">Inventory Valuation</span>
          <p className="text-xl font-extrabold text-emerald-400 mt-1">₹{totalValuation.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <span className="text-slate-400 text-xs font-semibold">Needs Repair / Maintenance</span>
          <p className="text-xl font-extrabold text-amber-400 mt-1">
            {inventoryItems.filter((i) => i.condition !== 'Good').length} Items
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search asset name, code, or lab location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Categories</option>
            <option value="IT Hardware">IT Hardware</option>
            <option value="Lab Equipment">Lab Equipment</option>
            <option value="Furniture">Furniture</option>
            <option value="Stationery">Stationery</option>
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredAssets.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3 relative group">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-white text-sm block leading-snug">{item.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">ID: {item.id}</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300">
                  {item.category}
                </span>

                {canManageInventory && (
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1 text-slate-400 hover:text-white transition"
                    title="Edit Asset"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                )}

                {canManageInventory && (
                  <button
                    onClick={() => handleDeleteAsset(item)}
                    className="p-1 text-rose-400 hover:text-rose-300 transition"
                    title="Delete Asset"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1 font-mono">
              <p><strong>Asset Code:</strong> {item.assetCode}</p>
              <p><strong>Location:</strong> {item.location}</p>
              <p><strong>Quantity:</strong> <span className="font-bold text-white">{item.quantity} Units</span></p>
              <p><strong>Unit Cost:</strong> ₹{item.unitPrice.toLocaleString()}</p>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className={`font-bold flex items-center gap-1 ${
                item.condition === 'Good' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {item.condition === 'Good' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Wrench className="h-3.5 w-3.5" />}
                Condition: {item.condition}
              </span>
              <span className="text-[10px] text-slate-500">Inspected: {item.lastInspected}</span>
            </div>

            {canManageInventory && (
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
            )}
          </div>
        ))}
      </div>

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-indigo-400" /> Add New Asset / Inventory Item
              </h3>
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Location / Lab</label>
                  <input
                    type="text"
                    required
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Asset Condition</label>
                  <select
                    value={newItem.condition}
                    onChange={(e) => setNewItem({ ...newItem, condition: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="Good">Good</option>
                    <option value="Needs Repair">Needs Repair</option>
                    <option value="Scrapped">Scrapped</option>
                  </select>
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
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Create Asset Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {isEditModalOpen && selectedAssetForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Edit className="h-4 w-4 text-indigo-400" /> Edit Inventory Asset Item
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditAsset} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={editItemForm.name}
                  onChange={(e) => setEditItemForm({ ...editItemForm, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Asset Code</label>
                  <input
                    type="text"
                    required
                    value={editItemForm.assetCode}
                    onChange={(e) => setEditItemForm({ ...editItemForm, assetCode: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={editItemForm.category}
                    onChange={(e) => setEditItemForm({ ...editItemForm, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
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
                  <label className="block text-slate-400 font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={editItemForm.quantity}
                    onChange={(e) => setEditItemForm({ ...editItemForm, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editItemForm.unitPrice}
                    onChange={(e) => setEditItemForm({ ...editItemForm, unitPrice: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Location / Lab</label>
                  <input
                    type="text"
                    required
                    value={editItemForm.location}
                    onChange={(e) => setEditItemForm({ ...editItemForm, location: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Asset Condition</label>
                  <select
                    value={editItemForm.condition}
                    onChange={(e) => setEditItemForm({ ...editItemForm, condition: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="Good">Good</option>
                    <option value="Needs Repair">Needs Repair</option>
                    <option value="Scrapped">Scrapped</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save Asset Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
