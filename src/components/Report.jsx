import React from 'react';
import {
  LayoutDashboard, UserCheck, Users, BookOpen, Layers,
  FileText, BarChart2, MessageSquare, Settings, Crown, X
} from 'lucide-react';

export default function Sidebar({ currentView, setView, isOpen = false, onClose }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, section: 'MAIN' },
    { id: 'enquiry', name: 'Enquiry Management', icon: UserCheck, section: 'ENQUIRY' },
    { id: 'add-enquiry', name: 'Add New Enquiry', icon: UserCheck, section: 'ENQUIRY' },
    { id: 'registration', name: 'Student Registration', icon: Users, section: 'STUDENT' },
    { id: 'students', name: 'Students', icon: Users, section: 'STUDENT' },
    { id: 'courses', name: 'Courses', icon: BookOpen, section: 'COURSE' },
    { id: 'batches', name: 'Batches', icon: Layers, section: 'COURSE' },
    { id: 'reports', name: 'Reports', icon: FileText, section: 'ANALYTICS' },
    { id: 'insights', name: 'AI Insights', icon: BarChart2, section: 'ANALYTICS', badge: 'New' },
    { id: 'messages', name: 'Messages', icon: MessageSquare, section: 'COMMUNICATION', badge: '5' },
    { id: 'settings', name: 'Settings', icon: Settings, section: 'SETTINGS' },
  ];

  const sections = ['ENQUIRY', 'STUDENT', 'COURSE', 'ANALYTICS', 'COMMUNICATION', 'SETTINGS'];

  const handleItemClick = (id) => {
    setView(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-400 h-screen p-4 flex flex-col justify-between font-sans transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header & Close Button */}
          <div className="flex items-center justify-between mb-6 px-2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-[#0b0f5a] to-[#b10019] text-white font-bold p-2 rounded text-xl italic tracking-wider">
                MASS
              </div>
              <span className="text-white text-xs font-semibold tracking-widest">
                IT SOLUTIONS
              </span>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Navigation */}
          <nav className="space-y-4 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-slate-700">
            <button
              onClick={() => handleItemClick('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition ${currentView === 'dashboard'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
                }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            {sections.map((section) => (
              <div key={section} className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 tracking-wider px-3 uppercase">
                  {section}
                </span>
                {menuItems
                  .filter((item) => item.section === section)
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition ${currentView === item.id
                          ? 'bg-[#121783] text-white'
                          : 'hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${item.badge === 'New'
                              ? 'bg-blue-600 text-white'
                              : 'bg-red-600 text-white'
                            }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            ))}
          </nav>

          {/* Fixed Footer Upgrade Card */}
          <div className="bg-gradient-to-r from-blue-900 to-zinc-950 p-4 rounded-xl border border-blue-800 mt-4 shrink-0">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1">
              <Crown size={16} className="text-yellow-400" />
              Upgrade to Pro
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Unlock all smart analytical tools and premium automation features.
            </p>
            <button className="w-full bg-blue-600 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}