'use client';

import React from 'react';
import { IMSProvider, useIMS } from '@/context/IMSContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { AiBotDrawer } from '@/components/layout/AiBotDrawer';
import { MobilePreviewModal } from '@/components/layout/MobilePreviewModal';
import { LoginScreen } from '@/components/auth/LoginScreen';

// Module Components
import { DashboardModule } from '@/components/modules/DashboardModule';
import { StudentManagement } from '@/components/modules/StudentManagement';
import { TeacherManagement } from '@/components/modules/TeacherManagement';
import { CourseManagement } from '@/components/modules/CourseManagement';
import { ClassManagement } from '@/components/modules/ClassManagement';
import { AttendanceManagement } from '@/components/modules/AttendanceManagement';
import { FeeManagement } from '@/components/modules/FeeManagement';
import { ExamManagement } from '@/components/modules/ExamManagement';
import { LMSModule } from '@/components/modules/LMSModule';
import { LibraryManagement } from '@/components/modules/LibraryManagement';
import { HostelManagement } from '@/components/modules/HostelManagement';
import { TransportManagement } from '@/components/modules/TransportManagement';
import { CommunicationModule } from '@/components/modules/CommunicationModule';
import { ParentPortal } from '@/components/modules/ParentPortal';
import { StudentPortal } from '@/components/modules/StudentPortal';
import { FacultyPortal } from '@/components/modules/FacultyPortal';
import { AdmissionManagement } from '@/components/modules/AdmissionManagement';
import { CertificateManagement } from '@/components/modules/CertificateManagement';
import { InventoryManagement } from '@/components/modules/InventoryManagement';
import { FinanceModule } from '@/components/modules/FinanceModule';
import { HRManagement } from '@/components/modules/HRManagement';
import { CRMModule } from '@/components/modules/CRMModule';
import { ReportsModule } from '@/components/modules/ReportsModule';
import { NotificationsModule } from '@/components/modules/NotificationsModule';
import { RBACModule } from '@/components/modules/RBACModule';
import { AIFeaturesModule } from '@/components/modules/AIFeaturesModule';
import { MobileAppPreviewModule } from '@/components/modules/MobileAppPreviewModule';
import { SecurityModule } from '@/components/modules/SecurityModule';
import { IntegrationsModule } from '@/components/modules/IntegrationsModule';
import { MultiBranchModule } from '@/components/modules/MultiBranchModule';
import { SettingsModule } from '@/components/modules/SettingsModule';

function MainContent() {
  const { activeModule } = useIMS();

  const renderModuleView = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule />;
      case 'students':
        return <StudentManagement />;
      case 'teachers':
        return <TeacherManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'classes':
        return <ClassManagement />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'fees':
        return <FeeManagement />;
      case 'exams':
        return <ExamManagement />;
      case 'lms':
        return <LMSModule />;
      case 'library':
        return <LibraryManagement />;
      case 'hostel':
        return <HostelManagement />;
      case 'transport':
        return <TransportManagement />;
      case 'communication':
        return <CommunicationModule />;
      case 'parent-portal':
        return <ParentPortal />;
      case 'student-portal':
        return <StudentPortal />;
      case 'faculty-portal':
        return <FacultyPortal />;
      case 'admissions':
        return <AdmissionManagement />;
      case 'certificates':
        return <CertificateManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'finance':
        return <FinanceModule />;
      case 'hr':
        return <HRManagement />;
      case 'crm':
        return <CRMModule />;
      case 'reports':
        return <ReportsModule />;
      case 'notifications':
        return <NotificationsModule />;
      case 'rbac':
        return <RBACModule />;
      case 'ai-features':
        return <AIFeaturesModule />;
      case 'mobile-preview':
        return <MobileAppPreviewModule />;
      case 'security':
        return <SecurityModule />;
      case 'integrations':
        return <IntegrationsModule />;
      case 'multi-branch':
        return <MultiBranchModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
      {renderModuleView()}
    </div>
  );
}

function AppLayout() {
  const { authUser } = useIMS();

  if (!authUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <Header />
      <div className="flex flex-1 relative">
        <Sidebar />
        <MainContent />
      </div>
      <AiBotDrawer />
      <MobilePreviewModal />
    </div>
  );
}

export default function Home() {
  return (
    <IMSProvider>
      <AppLayout />
    </IMSProvider>
  );
}
