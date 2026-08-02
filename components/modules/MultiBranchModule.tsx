'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { MOCK_BRANCHES } from '@/lib/ims-data';
import { GitFork, Building2, Users, CreditCard, Plus, X, CheckCircle2, Edit2, Save } from 'lucide-react';

export function MultiBranchModule() {
  const { currentRole, currentBranch, setCurrentBranch, addAuditLog } = useIMS();
  const canManageBranch = ['Super Admin', 'Director', 'Principal', 'Branch Head', 'Academic Coordinator', 'HR'].includes(currentRole);

  const [branchesList, setBranchesList] = useState(MOCK_BRANCHES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  type BranchType = (typeof MOCK_BRANCHES)[number];
  const [selectedBranchForEdit, setSelectedBranchForEdit] = useState<BranchType | null>(null);

  const [notification, setNotification] = useState('');

  // Form State
  const [newBranch, setNewBranch] = useState({
    name: '',
    code: '',
    address: '',
  });

  const [editBranchForm, setEditBranchForm] = useState({
    name: '',
    code: '',
    address: '',
  });

  const handleOpenAddModal = () => {
    setNewBranch({
      name: '',
      code: '',
      address: '',
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (branch: BranchType) => {
    setSelectedBranchForEdit(branch);
    setEditBranchForm({
      name: branch.name,
      code: branch.code,
      address: branch.address,
    });
    setIsEditModalOpen(true);
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `b${branchesList.length + 1}`,
      name: newBranch.name,
      code: newBranch.code,
      address: newBranch.address,
    };
    setBranchesList((prev) => [...prev, created]);
    setCurrentBranch(created.name);
    setIsAddModalOpen(false);
    addAuditLog('BRANCH_ADD', `Provisioned new campus branch: ${newBranch.name} (${newBranch.code})`);
    setNotification(`New campus branch "${newBranch.name}" provisioned successfully!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSaveEditBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranchForEdit || !canManageBranch) return;

    const oldName = selectedBranchForEdit.name;
    const updatedList = branchesList.map((b) =>
      b.id === selectedBranchForEdit.id
        ? { ...b, name: editBranchForm.name, code: editBranchForm.code, address: editBranchForm.address }
        : b
    );

    setBranchesList(updatedList);
    if (currentBranch === oldName) {
      setCurrentBranch(editBranchForm.name);
    }

    setIsEditModalOpen(false);
    addAuditLog('BRANCH_EDIT', `Updated campus details for ${editBranchForm.name} (${editBranchForm.code})`);
    setNotification(`Campus branch "${editBranchForm.name}" updated successfully!`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <GitFork className="h-5 w-5 text-blue-400" /> Multi-Branch & Multi-Campus Administration
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Centralized administration across campuses with branch-wise metrics and data scoping.
          </p>
        </div>

        {canManageBranch && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30"
          >
            <Plus className="h-4 w-4" /> Provision New Campus Branch
          </button>
        )}
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {notification}
        </div>
      )}

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branchesList.map((b) => {
          const isCurrent = currentBranch === b.name;
          return (
            <div
              key={b.id}
              onClick={() => setCurrentBranch(b.name)}
              className={`p-5 rounded-2xl border text-xs cursor-pointer transition space-y-3 ${
                isCurrent ? 'bg-blue-950/60 border-blue-500 shadow-xl ring-1 ring-blue-500/50' : 'glass-panel border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-extrabold text-white text-base block">{b.name}</span>
                  <p className="text-slate-400 text-xs mt-0.5">{b.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300">
                    {b.code}
                  </span>
                  {canManageBranch && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(b);
                      }}
                      className="p-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white transition"
                      title="Edit Campus Details"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 block">Enrolled Students</span>
                  <span className="font-extrabold text-sm text-white">340</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Active Faculty</span>
                  <span className="font-extrabold text-sm text-purple-300">42</span>
                </div>
              </div>

              {isCurrent && (
                <div className="p-2 rounded-xl bg-blue-600 text-white font-bold text-[10px] text-center">
                  ● ACTIVE SELECTED BRANCH
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Provision Branch Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">Provision New Campus Branch</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Campus Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Campus - Hyderabad"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Branch Code</label>
                  <input
                    type="text"
                    required
                    placeholder="HYD"
                    value={newBranch.code}
                    onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">City / Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hitech City, Hyderabad"
                    value={newBranch.address}
                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
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
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30"
                >
                  Provision Campus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Branch Modal */}
      {isEditModalOpen && selectedBranchForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-amber-400" /> Edit Campus Branch Details
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBranch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Campus Name</label>
                <input
                  type="text"
                  required
                  value={editBranchForm.name}
                  onChange={(e) => setEditBranchForm({ ...editBranchForm, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Branch Code</label>
                  <input
                    type="text"
                    required
                    value={editBranchForm.code}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, code: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">City / Location</label>
                  <input
                    type="text"
                    required
                    value={editBranchForm.address}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, address: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
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
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Campus Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
