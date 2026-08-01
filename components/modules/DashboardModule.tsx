'use client';

import React from 'react';
import { useIMS } from '@/context/IMSContext';

// Specialized Role Dashboard Components
import { ExecutiveDashboard } from '@/components/dashboards/ExecutiveDashboard';
import { AcademicAdminDashboard } from '@/components/dashboards/AcademicAdminDashboard';
import { FacultyDashboard } from '@/components/dashboards/FacultyDashboard';
import { StudentDashboard } from '@/components/dashboards/StudentDashboard';
import { ParentDashboard } from '@/components/dashboards/ParentDashboard';
import { AccountantDashboard } from '@/components/dashboards/AccountantDashboard';
import { HRDashboard } from '@/components/dashboards/HRDashboard';
import { ReceptionistDashboard } from '@/components/dashboards/ReceptionistDashboard';
import { LibraryDashboard } from '@/components/dashboards/LibraryDashboard';
import { TransportDashboard } from '@/components/dashboards/TransportDashboard';
import { HostelDashboard } from '@/components/dashboards/HostelDashboard';

export function DashboardModule() {
  const { currentRole } = useIMS();

  const renderRoleDashboard = () => {
    switch (currentRole) {
      case 'Super Admin':
      case 'Director':
      case 'Principal':
        return <ExecutiveDashboard />;

      case 'Branch Head':
      case 'Academic Coordinator':
        return <AcademicAdminDashboard />;

      case 'Teacher':
        return <FacultyDashboard />;

      case 'Student':
        return <StudentDashboard />;

      case 'Parent':
        return <ParentDashboard />;

      case 'Accountant':
        return <AccountantDashboard />;

      case 'HR':
        return <HRDashboard />;

      case 'Receptionist':
        return <ReceptionistDashboard />;

      case 'Library Staff':
        return <LibraryDashboard />;

      case 'Transport Manager':
        return <TransportDashboard />;

      case 'Hostel Warden':
        return <HostelDashboard />;

      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Render Dynamic Role-Tailored Dashboard for Authenticated User */}
      {renderRoleDashboard()}
    </div>
  );
}
