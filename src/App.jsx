import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import EnquiryManagement from './components/EnquiryManagement';
import RegistrationAndEnquiryForms from './components/RegistrationAndEnquiryForms';
import ReportsPage from './components/report';

export default function App() {
  // Sets the initial dashboard view panel state
  const [currentView, setView] = useState('enquiry');

  // Handles smooth template switching across modules
  const renderView = () => {
    switch (currentView) {
      case 'enquiry':
        return <EnquiryManagement setView={setView} />;
      case 'add-enquiry':
      case 'registration':
        return <RegistrationAndEnquiryForms />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <EnquiryManagement setView={setView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Structural Module Routing Navigation */}
      <Sidebar currentView={currentView} setView={setView} />

      {/* Primary Content Grid Block Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
