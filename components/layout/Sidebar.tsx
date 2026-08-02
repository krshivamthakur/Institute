'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { UserRole } from '@/lib/ims-data';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle2,
  CreditCard,
  Award,
  Video,
  Library,
  Home,
  Bus,
  MessageSquare,
  UserCheck,
  User,
  Briefcase,
  UserPlus,
  FileCheck,
  Package,
  DollarSign,
  UserPlus2,
  PhoneCall,
  BarChart3,
  BellRing,
  ShieldAlert,
  Sparkles,
  Smartphone,
  Lock,
  Link,
  GitFork,
  ChevronRight,
  Shield,
  Eye,
  Layers,
  Settings,
  X,
} from 'lucide-react';

interface ModuleNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  category: 'Main' | 'Academics & LMS' | 'Operations' | 'Finance & HR' | 'Portals' | 'AI & System';
}

const MASTER_MODULE_ITEMS: ModuleNavItem[] = [
  // Main
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Main' },
  { id: 'students', label: 'Student Management', icon: Users, category: 'Main' },
  { id: 'teachers', label: 'Teacher & Staff', icon: GraduationCap, category: 'Main' },
  { id: 'admissions', label: 'Admission Mgmt', icon: UserPlus, category: 'Main', badge: 'Hot' },
  { id: 'crm', label: 'CRM & Leads', icon: PhoneCall, category: 'Main' },

  // Academics & LMS
  { id: 'courses', label: 'Course Management', icon: BookOpen, category: 'Academics & LMS' },
  { id: 'classes', label: 'Class & Timetable', icon: Calendar, category: 'Academics & LMS' },
  { id: 'attendance', label: 'Attendance Mgmt', icon: CheckCircle2, category: 'Academics & LMS' },
  { id: 'exams', label: 'Exam & Marksheet', icon: Award, category: 'Academics & LMS' },
  { id: 'lms', label: 'LMS & E-Learning', icon: Video, category: 'Academics & LMS', badge: 'Live' },

  // Operations
  { id: 'fees', label: 'Fee Management', icon: CreditCard, category: 'Operations' },
  { id: 'library', label: 'Library Mgmt', icon: Library, category: 'Operations' },
  { id: 'hostel', label: 'Hostel Mgmt', icon: Home, category: 'Operations' },
  { id: 'transport', label: 'Transport & GPS', icon: Bus, category: 'Operations' },
  { id: 'communication', label: 'Communication', icon: MessageSquare, category: 'Operations' },
  { id: 'certificates', label: 'Certificate Mgmt', icon: FileCheck, category: 'Operations' },
  { id: 'inventory', label: 'Inventory Mgmt', icon: Package, category: 'Operations' },

  // Finance & HR
  { id: 'finance', label: 'Accounts & Finance', icon: DollarSign, category: 'Finance & HR' },
  { id: 'hr', label: 'HR & Onboarding', icon: UserPlus2, category: 'Finance & HR' },

  // Portals
  { id: 'student-portal', label: 'Student Portal', icon: User, category: 'Portals' },
  { id: 'faculty-portal', label: 'Faculty Portal', icon: Briefcase, category: 'Portals' },
  { id: 'parent-portal', label: 'Parent Portal', icon: UserCheck, category: 'Portals' },

  // AI & System
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, category: 'AI & System' },
  { id: 'notifications', label: 'Notifications', icon: BellRing, category: 'AI & System' },
  { id: 'rbac', label: 'Role Access (RBAC)', icon: ShieldAlert, category: 'AI & System' },
  { id: 'ai-features', label: 'AI Features Suite', icon: Sparkles, category: 'AI & System', badge: 'AI' },
  { id: 'security', label: 'Security & Logs', icon: Lock, category: 'AI & System' },
  { id: 'integrations', label: 'API & Integrations', icon: Link, category: 'AI & System' },
  { id: 'multi-branch', label: 'Multi-Branch Admin', icon: GitFork, category: 'AI & System' },
  { id: 'settings', label: 'System Settings', icon: Settings, category: 'AI & System', badge: 'Admin' },
];

// Mapping of Allowed Module IDs for each UserRole
const ROLE_ALLOWED_MODULES: Record<UserRole, string[]> = {
  Student: ['dashboard', 'student-portal', 'lms', 'attendance', 'classes', 'exams', 'fees', 'library', 'certificates', 'notifications'],
  Teacher: ['dashboard', 'faculty-portal', 'classes', 'attendance', 'exams', 'lms', 'students', 'courses', 'communication', 'notifications'],
  Parent: ['dashboard', 'parent-portal', 'fees', 'attendance', 'exams', 'communication', 'notifications'],
  Accountant: ['dashboard', 'finance', 'fees', 'hr', 'inventory', 'reports', 'notifications'],
  HR: ['dashboard', 'hr', 'teachers', 'attendance', 'finance', 'notifications'],
  Receptionist: ['dashboard', 'crm', 'admissions', 'students', 'communication', 'notifications'],
  'Library Staff': ['dashboard', 'library', 'students', 'inventory', 'communication', 'notifications'],
  'Transport Manager': ['dashboard', 'transport', 'students', 'communication', 'notifications'],
  'Hostel Warden': ['dashboard', 'hostel', 'students', 'communication', 'notifications'],
  'Branch Head': ['dashboard', 'students', 'teachers', 'courses', 'classes', 'attendance', 'exams', 'lms', 'admissions', 'reports', 'notifications'],
  'Academic Coordinator': ['dashboard', 'students', 'teachers', 'courses', 'classes', 'attendance', 'exams', 'lms', 'reports', 'notifications'],
  'Super Admin': MASTER_MODULE_ITEMS.map((m) => m.id),
  Director: MASTER_MODULE_ITEMS.filter((m) => m.id !== 'settings').map((m) => m.id),
  Principal: MASTER_MODULE_ITEMS.filter((m) => m.id !== 'settings').map((m) => m.id),
};

export function Sidebar() {
  const { currentRole, activeModule, setActiveModule, isMobileMenuOpen, setIsMobileMenuOpen } = useIMS();

  // Filter modules strictly based on current authenticated user role
  const allowedModuleIds = ROLE_ALLOWED_MODULES[currentRole] || MASTER_MODULE_ITEMS.map((m) => m.id);
  const activeModuleItems = MASTER_MODULE_ITEMS.filter((item) => allowedModuleIds.includes(item.id));

  const categories = ['Main', 'Academics & LMS', 'Operations', 'Finance & HR', 'Portals', 'AI & System'] as const;

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId);
    setIsMobileMenuOpen(false);
  };

  const navContent = (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
      {categories.map((cat) => {
        const items = activeModuleItems.filter((item) => item.category === cat);
        if (items.length === 0) return null;

        return (
          <div key={cat} className="space-y-1">
            <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span>{cat}</span>
              <span className="text-[9px] text-slate-400 font-normal">({items.length})</span>
            </h3>
            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleModuleClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition duration-150 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 font-semibold ring-1 ring-white/20'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight
                        className={`h-3 w-3 text-slate-600 transition ${
                          isActive ? 'text-white opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex w-64 glass-panel border-r border-slate-800/80 flex-col h-[calc(100vh-65px)] sticky top-[65px] z-30 text-slate-200 select-none">
        {navContent}
      </aside>

      {/* Mobile Off-Canvas Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Mobile Slide-Over Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] glass-panel-glow border-r border-slate-700 shadow-2xl flex flex-col text-slate-200 select-none transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Navigation Menu</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
              {currentRole}
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {navContent}
      </aside>
    </>
  );
}
