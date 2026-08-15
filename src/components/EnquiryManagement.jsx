import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2
} from 'lucide-react';

export default function EnquiryManagement({ setView }) {
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEnquiry, setEditingEnquiry] = useState(null);

  // Fetch data from server
  useEffect(() => {
    fetch('http://localhost:5000/api/enquiries')
      .then((response) => response.json())
      .then((data) => setEnquiries(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Dashboard calculations
  const totalEnquiries = enquiries.length;
  const newLeads = enquiries.filter((enq) => enq.status === 'New').length;
  const contactedLeads = enquiries.filter((enq) => enq.status === 'Contacted').length;
  const followUpLeads = enquiries.filter((enq) => enq.status === 'Follow Up').length;

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      fetch(`http://localhost:5000/api/enquiries/${id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then(() => {
          setEnquiries(enquiries.filter((enq) => enq.id !== id));
          alert('Deleted successfully!');
        })
        .catch((error) => console.error('Error deleting:', error));
    }
  };

  const statusColors = {
    'New': 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    'Contacted': 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    'Interested': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    'Follow Up': 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Enquiry Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Dashboard &gt; Enquiry Management</p>
        </div>
        <button
          onClick={() => setView('add-enquiry')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm transition"
        >
          <UserPlus size={16} />
          Add New Enquiry
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-sm transition-colors">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Enquiries</p>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{totalEnquiries}</h3>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-sm transition-colors">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">New Leads</p>
          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{newLeads}</h3>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-sm transition-colors">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Contacted</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{contactedLeads}</h3>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-sm transition-colors">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Follow Ups</p>
          <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{followUpLeads}</h3>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm overflow-hidden transition-colors">

        {/* Filters Header Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/80">
          <div className="relative w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by name, email, mobile..."
              className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-600 dark:text-slate-300 focus:outline-none">
              <option>All Sources</option>
            </select>
            <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-600 dark:text-slate-300 focus:outline-none">
              <option>All Courses</option>
            </select>
            <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-600 dark:text-slate-300 focus:outline-none">
              <option>All Status</option>
            </select>
            <button className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <SlidersHorizontal size={14} />
              Filters
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="p-4 w-12">#</th>
                <th className="p-4">Enquiry ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Course Interest</th>
                <th className="p-4">Source</th>
                <th className="p-4">Enquiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-700 dark:text-slate-200 font-medium">
              {enquiries.map((enq, index) => (
                <tr key={enq.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/40 transition">
                  <td className="p-4 text-slate-400 dark:text-slate-500">{index + 1}</td>
                  <td className="p-4 font-semibold text-blue-600 dark:text-blue-400">{enq.id}</td>
                  <td className="p-4 text-slate-900 dark:text-slate-100">{enq.name}</td>
                  <td className="p-4">
                    <div>{enq.contact}</div>
                    <div className="text-slate-400 dark:text-slate-500 font-normal text-[11px]">{enq.email}</div>
                  </td>
                  <td className="p-4 text-slate-900 dark:text-slate-100">{enq.course}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{enq.source}</td>
                  <td className="p-4">
                    <div>{enq.enquiry_date}</div>
                    <div className="text-slate-400 dark:text-slate-500 font-normal text-[11px]">{enq.enquiry_time}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${statusColors[enq.status] || 'bg-slate-50 dark:bg-slate-800'}`}>
                      {enq.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        {enq.assigned_to ? enq.assigned_to.split(' ').map((n) => n[0]).join('') : ''}
                      </div>
                      <span>{enq.assigned_to}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setEditingEnquiry(enq)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(enq.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
          <span>Showing 1 to 6 of 245 entries</span>
          <div className="flex items-center gap-2">
            <button className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 disabled:opacity-50" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="px-3 py-1.5 border border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold rounded-lg">1</button>
            <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">2</button>
            <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">3</button>
            <span className="px-1">...</span>
            <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">25</button>
            <button className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* View Enquiry Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg w-full max-w-md p-6 relative border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Enquiry Details</h2>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p><strong className="text-slate-800 dark:text-slate-100">ID:</strong> {selectedEnquiry.id}</p>
              <p><strong className="text-slate-800 dark:text-slate-100">Name:</strong> {selectedEnquiry.name}</p>
              <p><strong className="text-slate-800 dark:text-slate-100">Contact:</strong> {selectedEnquiry.contact}</p>
              <p><strong className="text-slate-800 dark:text-slate-100">Email:</strong> {selectedEnquiry.email}</p>
              <p><strong className="text-slate-800 dark:text-slate-100">Course:</strong> {selectedEnquiry.course}</p>
              <p><strong className="text-slate-800 dark:text-slate-100">Source:</strong> {selectedEnquiry.source}</p>
              <p><strong className="text-slate-800 dark:text-slate-100">Date:</strong> {selectedEnquiry.enquiry_date} at {selectedEnquiry.enquiry_time}</p>
              <p><strong className="text-slate-800 dark:text-slate-100">Status:</strong> {selectedEnquiry.status}</p>
              <p><strong className="text-slate-800 dark:text-slate-100">Assigned To:</strong> {selectedEnquiry.assigned_to}</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Enquiry Modal */}
      {editingEnquiry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg w-full max-w-lg p-6 relative border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Edit Enquiry ({editingEnquiry.id})</h2>
              <button
                onClick={() => setEditingEnquiry(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-xl"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetch(`http://localhost:5000/api/enquiries/${editingEnquiry.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(editingEnquiry),
                })
                  .then((res) => res.json())
                  .then(() => {
                    alert('Updated successfully!');
                    setEnquiries(enquiries.map((enq) => (enq.id === editingEnquiry.id ? editingEnquiry : enq)));
                    setEditingEnquiry(null);
                  })
                  .catch((err) => console.error('Error updating:', err));
              }}
              className="space-y-4 text-xs text-slate-700 dark:text-slate-300"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200">Name</label>
                  <input
                    type="text"
                    value={editingEnquiry.name}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, name: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200">Contact</label>
                  <input
                    type="text"
                    value={editingEnquiry.contact}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, contact: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg p-2 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200">Email</label>
                  <input
                    type="email"
                    value={editingEnquiry.email}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, email: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200">Course</label>
                  <input
                    type="text"
                    value={editingEnquiry.course}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, course: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg p-2 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200">Source</label>
                  <input
                    type="text"
                    value={editingEnquiry.source}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, source: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200">Status</label>
                  <select
                    value={editingEnquiry.status}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, status: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg p-2 mt-1"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Follow Up">Follow Up</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200">Assigned To</label>
                  <input
                    type="text"
                    value={editingEnquiry.assigned_to}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, assigned_to: e.target.value })}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg p-2 mt-1"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEnquiry(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}