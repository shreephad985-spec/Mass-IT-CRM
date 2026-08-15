import React, { useState } from 'react';
import { Menu } from 'lucide-react'; // Added missing Menu import
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import EnquiryManagement from './components/EnquiryManagement';
import RegistrationAndEnquiryForms from './components/RegistrationAndEnquiryForms';
import ReportsPage from './components/report';

export default function App() {
  // Sets the initial dashboard view panel state
  const [currentView, setView] = useState('enquiry');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-900">
      {/* 1. Sidebar with mobile state props */}
      <Sidebar
        currentView={currentView}
        setView={setView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. Main content container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <Header />
        </div>

        {/* Mobile Header Bar (Only visible on small screens) */}
        <header className="flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800 lg:hidden shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>
          <span className="text-white font-bold tracking-wide text-sm">MASS IT SOLUTIONS</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}