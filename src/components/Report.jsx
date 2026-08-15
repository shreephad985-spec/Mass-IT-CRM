import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Filter,
  Users,
  GraduationCap,
  BookOpen,
  IndianRupee,
  Percent,
  Eye,
  Download,
  ChevronRight,
  ChevronLeft,
  FileText,
  BarChart2,
  TrendingUp,
  X,
  Search,
  RefreshCw,
  Phone,
  Mail
} from 'lucide-react';

export default function ReportsPage() {
  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const [activeTab, setActiveTab] = useState('All Reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Date Filter State
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Dynamic Database Data
  const [records, setRecords] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalEnquiries: 0,
    totalStudents: 0,
    totalCourses: 0,
    totalRevenue: 0,
  });

  // ==========================================
  // 2. FETCH REAL MYSQL FORM REGISTRATIONS
  // ==========================================
  const fetchLiveDatabaseData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch Summary Metrics
      const summaryRes = await fetch('http://localhost:5000/api/reports/summary');
      if (summaryRes.ok) {
        const sumJson = await summaryRes.json();
        setSummaryData(sumJson);
      }

      // 2. Fetch Real Enquiries and Real Student Registrations from MySQL
      const [enquiriesRes, studentsRes] = await Promise.all([
        fetch('http://localhost:5000/api/enquiries').catch(() => null),
        fetch('http://localhost:5000/api/students').catch(() => null)
      ]);

      let formattedEnquiries = [];
      let formattedStudents = [];

      if (enquiriesRes && enquiriesRes.ok) {
        const enqData = await enquiriesRes.json();
        formattedEnquiries = enqData.map(item => ({
          id: `ENQ-${item.id}`,
          rawId: item.id,
          name: item.name || item.student_name || 'Anonymous Enquiry',
          email: item.email || 'N/A',
          phone: item.phone || item.mobile || 'N/A',
          course: item.course || item.course_name || 'General Enquiry',
          category: 'Enquiry',
          categoryStyle: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
          icon: Users,
          iconBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
          date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB') : 'Recent',
          time: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          rawDate: item.created_at ? new Date(item.created_at) : new Date(),
          status: item.status || 'Pending',
          source: item.source || 'Enquiry Form'
        }));
      }

      if (studentsRes && studentsRes.ok) {
        const stuData = await studentsRes.json();
        formattedStudents = stuData.map(item => ({
          id: `STU-${item.id}`,
          rawId: item.id,
          name: item.name || item.student_name || 'Registered Student',
          email: item.email || 'N/A',
          phone: item.phone || item.mobile || 'N/A',
          course: item.course || item.course_name || 'Enrolled Course',
          category: 'Student',
          categoryStyle: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
          icon: GraduationCap,
          iconBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
          date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB') : 'Recent',
          time: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          rawDate: item.created_at ? new Date(item.created_at) : new Date(),
          status: item.status || 'Active',
          source: 'Admission Form'
        }));
      }

      // Combine both real datasets and sort by most recent date
      const combinedRecords = [...formattedEnquiries, ...formattedStudents].sort(
        (a, b) => b.rawDate - a.rawDate
      );

      setRecords(combinedRecords);

      // Update total counts dynamically if summary API wasn't configured
      if (!summaryRes || !summaryRes.ok) {
        setSummaryData(prev => ({
          ...prev,
          totalEnquiries: formattedEnquiries.length,
          totalStudents: formattedStudents.length
        }));
      }

    } catch (err) {
      console.error('Error fetching MySQL registration records:', err);
      setError('Could not connect to database. Make sure your local server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveDatabaseData();
    // Auto-refresh data every 5 seconds to catch new form entries live
    const interval = setInterval(fetchLiveDatabaseData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, itemsPerPage, dateRange]);

  // Dynamic Metric Cards
  const statsCards = useMemo(() => {
    const totalEnq = summaryData.totalEnquiries || records.filter(r => r.category === 'Enquiry').length;
    const totalStu = summaryData.totalStudents || records.filter(r => r.category === 'Student').length;
    const convRate = totalEnq > 0 ? ((totalStu / totalEnq) * 100).toFixed(1) + '%' : '0%';

    return [
      {
        title: 'Total Enquiries',
        value: totalEnq.toString(),
        change: 'Live DB',
        period: 'records',
        icon: Users,
        iconBg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
        sparklineColor: '#8b5cf6',
        path: 'M0 25 Q 15 10, 30 20 T 60 15 T 90 22 T 120 5'
      },
      {
        title: 'Registered Students',
        value: totalStu.toString(),
        change: 'Live DB',
        period: 'records',
        icon: GraduationCap,
        iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
        sparklineColor: '#10b981',
        path: 'M0 25 Q 15 20, 30 15 T 60 22 T 90 10 T 120 5'
      },
      {
        title: 'Active Courses',
        value: (summaryData.totalCourses || 12).toString(),
        change: '+ 2',
        period: 'this month',
        icon: BookOpen,
        iconBg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
        sparklineColor: '#3b82f6',
        path: 'M0 22 Q 15 25, 30 18 T 60 12 T 90 15 T 120 8'
      },
      {
        title: 'Conversion Rate',
        value: convRate,
        change: 'Enquiry → Student',
        period: 'ratio',
        icon: Percent,
        iconBg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
        sparklineColor: '#f43f5e',
        path: 'M0 20 Q 15 22, 30 15 T 60 18 T 90 8 T 120 4'
      }
    ];
  }, [summaryData, records]);

  // ==========================================
  // 3. SEARCH, TABS & DATE FILTERING
  // ==========================================
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Tab Filtering
      const matchesTab =
        activeTab === 'All Reports' ||
        (activeTab === 'Enquiry Reports' && rec.category === 'Enquiry') ||
        (activeTab === 'Student Reports' && rec.category === 'Student');

      // Search Term Filtering
      const matchesSearch =
        rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.phone.includes(searchTerm) ||
        rec.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.id.toLowerCase().includes(searchTerm.toLowerCase());

      // Date Range Filtering
      let matchesDate = true;
      if (dateRange.startDate && dateRange.endDate) {
        const recTime = new Date(rec.rawDate).getTime();
        const startTime = new Date(dateRange.startDate).getTime();
        const endTime = new Date(dateRange.endDate).setHours(23, 59, 59, 999);
        matchesDate = recTime >= startTime && recTime <= endTime;
      }

      return matchesTab && matchesSearch && matchesDate;
    });
  }, [records, activeTab, searchTerm, dateRange]);

  // Pagination Math
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  // ==========================================
  // 4. EXPORT TO CSV
  // ==========================================
  const handleDownloadCSV = (recordToExport = null) => {
    const exportList = recordToExport ? [recordToExport] : filteredRecords;

    if (exportList.length === 0) {
      alert('No data available to export.');
      return;
    }

    const headers = ['Record ID,Type,Name,Email,Phone,Course,Status,Registration Date'];
    const rows = exportList.map(r =>
      `"${r.id}","${r.category}","${r.name}","${r.email}","${r.phone}","${r.course}","${r.status}","${r.date} ${r.time}"`
    );

    const csvString = [headers, ...rows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MySQL_Registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = ["All Reports", "Enquiry Reports", "Student Reports"];

  // ==========================================
  // 5. UI RENDERING
  // ==========================================
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors">
      <main className="p-6 max-w-[1600px] mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Form Registrations & Live Reports</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Live MySQL submissions from student and enquiry forms
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {error && (
              <span className="text-xs bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                {error}
              </span>
            )}

            <button
              onClick={() => setIsDateModalOpen(true)}
              className="flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Calendar className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span className="font-medium">
                {dateRange.startDate ? `${dateRange.startDate} to ${dateRange.endDate}` : 'Filter Date Range'}
              </span>
            </button>

            <button
              onClick={() => fetchLiveDatabaseData()}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh DB</span>
            </button>

            <button
              onClick={() => handleDownloadCSV()}
              className="flex items-center space-x-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white px-3.5 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {stat.title}
                    </span>
                    <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="flex items-center space-x-1.5 mt-1 text-xs">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stat.change}</span>
                    <span className="text-slate-400 dark:text-slate-500">{stat.period}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2">
                  <svg className="w-full h-8 overflow-visible" viewBox="0 0 120 30">
                    <path
                      d={stat.path}
                      fill="none"
                      stroke={stat.sparklineColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Records Table Section */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            {/* Filter Tabs & Live Search */}
            <div className="border-b border-slate-200 dark:border-slate-700 px-4 pt-3 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex space-x-4 overflow-x-auto scrollbar-none">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${activeTab === tab
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Live Search Bar */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, phone, course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/70 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Candidate Name</th>
                    <th className="py-3 px-4 font-semibold">Contact Info</th>
                    <th className="py-3 px-4 font-semibold">Course / Subject</th>
                    <th className="py-3 px-4 font-semibold">Form Category</th>
                    <th className="py-3 px-4 font-semibold">Registered On</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
                        Fetching live entries from MySQL...
                      </td>
                    </tr>
                  ) : paginatedRecords.length > 0 ? (
                    paginatedRecords.map((row) => {
                      const IconComp = row.icon;
                      return (
                        <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${row.iconBg}`}>
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800 dark:text-slate-100 block">{row.name}</span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500">{row.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{row.email}</span>
                            </div>
                            <div className="flex items-center space-x-1 mt-0.5 text-slate-400 dark:text-slate-500">
                              <Phone className="w-3 h-3" />
                              <span>{row.phone}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200 font-medium text-xs">
                            {row.course}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.categoryStyle}`}>
                              {row.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 text-xs">
                            <div className="font-medium text-slate-700 dark:text-slate-200">{row.date}</div>
                            <div className="text-slate-400 dark:text-slate-500">{row.time}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => setSelectedRecord(row)}
                                className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => handleDownloadCSV(row)}
                                className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
                        No registrations found matching your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
            <div>
              Showing{' '}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {filteredRecords.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {Math.min(currentPage * itemsPerPage, filteredRecords.length)}
              </span>{' '}
              of <span className="font-medium text-slate-700 dark:text-slate-200">{filteredRecords.length}</span> live entries
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded font-medium flex items-center justify-center transition-colors ${currentPage === page
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span>per page</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* ==========================================
          MODALS
          ========================================== */}

      {/* Record View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-100 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {selectedRecord.category} Details
              </h3>
              <button onClick={() => setSelectedRecord(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Reference ID</div>
                  <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">{selectedRecord.id}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedRecord.categoryStyle}`}>
                  {selectedRecord.category}
                </span>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">Candidate Full Name</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{selectedRecord.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">Email Address</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRecord.email}</p>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">Phone Number</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRecord.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">Enquired / Enrolled Course</span>
                  <p className="text-slate-800 dark:text-slate-100 font-semibold">{selectedRecord.course}</p>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">Registration Date</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRecord.date} ({selectedRecord.time})</p>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownloadCSV(selectedRecord);
                  setSelectedRecord(null);
                }}
                className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Range Modal */}
      {isDateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-100 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Filter Registrations By Date</h3>
              <button onClick={() => setIsDateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">From Date</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">To Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:outline-none"
                />
              </div>
            </div>
            <div className="pt-2 flex justify-between space-x-2">
              <button
                onClick={() => {
                  setDateRange({ startDate: '', endDate: '' });
                  setIsDateModalOpen(false);
                }}
                className="px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-xs"
              >
                Clear Filter
              </button>
              <button
                onClick={() => setIsDateModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-xs font-medium"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}