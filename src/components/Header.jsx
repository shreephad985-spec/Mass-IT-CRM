import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function Header({ currentUser, onSearchSubmit, onLogout }) {
  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Theme Toggle (Dark / Light)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Dropdown Visibility States
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Live Notifications Data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Enquiry Submitted',
      message: 'Rahul Sharma enquired for Full Stack Web Dev.',
      time: '5m ago',
      read: false,
      type: 'info'
    },
    {
      id: 2,
      title: 'Fee Payment Received',
      message: 'Received ₹25,000 from Priya Patel.',
      time: '1h ago',
      read: false,
      type: 'success'
    },
    {
      id: 3,
      title: 'Follow-up Reminder',
      message: '3 student follow-ups scheduled for today.',
      time: '3h ago',
      read: true,
      type: 'warning'
    }
  ]);

  // Active user details with defaults
  const user = currentUser || {
    name: 'Admin User',
    role: 'Super Admin',
    email: 'admin@institute.com',
    initials: 'AU'
  };

  // Refs for click outside handling & shortcut focus
  const searchInputRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // ==========================================
  // 2. KEYBOARD SHORTCUT (Ctrl + K / Cmd + K)
  // ==========================================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ==========================================
  // 3. THEME TOGGLE HANDLER
  // ==========================================
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // ==========================================
  // 4. LIVE SEARCH DEBOUNCE
  // ==========================================
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    setIsSearching(true);
    setIsSearchOpen(true);

    const timer = setTimeout(async () => {
      try {
        // Query backend database for enquiries and students
        const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          // Fallback search preview if endpoint isn't mounted yet
          setSearchResults([
            { id: 1, title: `Search for "${searchQuery}" in Students`, type: 'Student' },
            { id: 2, title: `Search for "${searchQuery}" in Enquiries`, type: 'Enquiry' }
          ]);
        }
      } catch (err) {
        setSearchResults([
          { id: 1, title: `Find "${searchQuery}" in Enquiries`, type: 'Enquiry' },
          { id: 2, title: `Find "${searchQuery}" in Students`, type: 'Student' }
        ]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ==========================================
  // 5. NOTIFICATION ACTIONS
  // ==========================================
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ==========================================
  // 6. UI RENDERING
  // ==========================================
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">

      {/* Search Bar Container */}
      <div className="relative w-72 sm:w-96">
        <div className="relative flex items-center">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search size={18} />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
            placeholder="Search students, enquiries, updates..."
            className="w-full pl-10 pr-16 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 transition"
          />
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={16} />
            </button>
          ) : (
            <span className="absolute inset-y-0 right-3 flex items-center text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 my-2 shadow-xs pointer-events-none">
              Ctrl + K
            </span>
          )}
        </div>

        {/* Search Results Dropdown Popover */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-xs text-slate-400">Searching database...</div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Results
                </div>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => {
                      if (onSearchSubmit) onSearchSubmit(result);
                      setIsSearchOpen(false);
                    }}
                    className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center justify-between transition"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {result.title || result.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-semibold">
                      {result.type || 'Record'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">No matching records found.</div>
            )}
          </div>
        )}
      </div>

      {/* Right Navigation Controls */}
      <div className="flex items-center gap-3">

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition"
        >
          {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>

        {/* Notifications Button & Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="relative text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 flex items-start justify-between gap-3 transition ${!item.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                        }`}
                    >
                      <div className="flex gap-2.5 items-start">
                        {item.type === 'success' ? (
                          <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                        ) : (
                          <AlertCircle size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{item.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{item.time}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => clearNotification(item.id)}
                        className="text-slate-300 hover:text-slate-500 dark:hover:text-slate-300 p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">No notifications available</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu Dropdown */}
        <div className="relative border-l pl-4 border-slate-200 dark:border-slate-700" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-3 hover:opacity-80 transition focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-800">
              {user.initials || user.name?.slice(0, 2).toUpperCase()}
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 py-1">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>

              <a
                href="#profile"
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
              >
                <User size={14} className="text-slate-400" />
                <span>My Profile</span>
              </a>

              <a
                href="#settings"
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
              >
                <Settings size={14} className="text-slate-400" />
                <span>Account Settings</span>
              </a>

              <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  else alert('Logging out...');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}