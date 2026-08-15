import React from 'react';
import { RefreshCw, Save, CheckCircle } from 'lucide-react';

export default function RegistrationAndEnquiryForms() {

  // ==========================================
  // 1. FUNCTION FOR THE LEFT SIDE (STUDENTS)
  // ==========================================
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    if (form.password.value !== form.confirmPassword.value) {
      alert("Passwords do not match!");
      return;
    }

    const studentData = {
      fullName: form.fullName.value,
      dob: form.dob.value,
      gender: form.gender.value,
      mobile: form.mobile.value,
      email: form.email.value,
      alternateMobile: form.alternateMobile.value,
      address: form.address.value,
      city: form.city.value,
      state: form.state.value,
      pincode: form.pincode.value,
      qualification: form.qualification.value,
      stream: form.stream.value,
      passingYear: form.passingYear.value,
      percentage: form.percentage.value,
      course: form.course.value,
      batch: form.batch.value,
      courseMode: form.courseMode.value,
      expectedStartDate: form.expectedStartDate.value,
      password: form.password.value
    };

    fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    })
      .then(res => res.json())
      .then(() => {
        alert('Student registered successfully!');
        form.reset();
      })
      .catch(err => console.error('Error:', err));
  };


  // ==========================================
  // 2. FUNCTION FOR THE RIGHT SIDE (ENQUIRIES)
  // ==========================================
  const handleEnquirySubmit = (e) => {
    e.preventDefault();

    const newEnquiryData = {
      id: "ENQ" + Math.floor(Math.random() * 10000),
      name: e.target.leadName.value,
      contact: e.target.mobile.value,
      email: e.target.email.value,
      course: e.target.course.value,
      source: e.target.source.value,
      enquiry_date: e.target.enqDate.value,
      enquiry_time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: e.target.status.value,
      assigned_to: e.target.assigned.value
    };

    fetch('http://localhost:5000/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEnquiryData),
    })
      .then(response => response.json())
      .then(data => {
        alert('Enquiry added successfully!');
        e.target.reset();
      })
      .catch((error) => console.error('Error:', error));
  };


  // ==========================================
  // 3. THE VISUAL SCREEN (UI)
  // ==========================================
  return (
    <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen font-sans transition-colors">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Student & Enquiry Registration</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Dashboard &gt; Unified Form Hub</p>
        </div>
        <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition shadow-sm text-center">
          View All Records
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ======================================= */}
        {/* LEFT COLUMN: Student Registration Form  */}
        {/* ======================================= */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 sm:p-5 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
            <h2 className="text-base font-bold text-slate-800 dark:text-white">Student Registration Form</h2>
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">Enter credentials and details to register a brand new student account.</p>
          </div>

          <form onSubmit={handleStudentSubmit} className="space-y-5 text-xs text-slate-700 dark:text-slate-200">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name <span className="text-red-500">*</span></label>
                  <input name="fullName" type="text" required placeholder="Enter full name" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:border-blue-500 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Date of Birth <span className="text-red-500">*</span></label>
                  <input name="dob" type="date" required className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:border-blue-500 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Gender <span className="text-red-500">*</span></label>
                  <select name="gender" required className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:border-blue-500 text-xs">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Mobile Number <span className="text-red-500">*</span></label>
                  <input name="mobile" type="tel" required placeholder="Enter mobile number" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:border-blue-500 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address <span className="text-red-500">*</span></label>
                  <input name="email" type="email" required placeholder="Enter email address" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:border-blue-500 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Alternate Mobile</label>
                  <input name="alternateMobile" type="tel" placeholder="Enter alternate number" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:border-blue-500 text-xs" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Address <span className="text-red-500">*</span></label>
                <textarea name="address" required rows="2" placeholder="Enter full permanent/current address" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:border-blue-500 text-xs"></textarea>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">City <span className="text-red-500">*</span></label>
                  <input name="city" type="text" required placeholder="Enter city" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:border-blue-500 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">State <span className="text-red-500">*</span></label>
                  <input name="state" type="text" required placeholder="Enter state" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:border-blue-500 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Pincode <span className="text-red-500">*</span></label>
                  <input name="pincode" type="text" required placeholder="Enter pincode" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:border-blue-500 text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">Academic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Qualification <span className="text-red-500">*</span></label>
                  <select name="qualification" required className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs">
                    <option value="">Select</option>
                    <option value="12th Pass">12th Pass</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Stream / Branch</label>
                  <input name="stream" type="text" placeholder="e.g. CSE" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Passing Year <span className="text-red-500">*</span></label>
                  <input name="passingYear" type="text" placeholder="e.g. 2024" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Percentage / CGPA</label>
                  <input name="percentage" type="text" placeholder="e.g. 84%" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">Course Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Select Course <span className="text-red-500">*</span></label>
                  <select name="course" required className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs">
                    <option value="">Select course</option>
                    <option value="Full Stack Development">Full Stack</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Select Batch <span className="text-red-500">*</span></label>
                  <select name="batch" required className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs">
                    <option value="">Select batch</option>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Course Mode <span className="text-red-500">*</span></label>
                  <select name="courseMode" required className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs">
                    <option value="">Select mode</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Expected Start Date</label>
                  <input name="expectedStartDate" type="date" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">Login Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Password <span className="text-red-500">*</span></label>
                  <input name="password" type="password" required placeholder="Enter password" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Confirm Password <span className="text-red-500">*</span></label>
                  <input name="confirmPassword" type="password" required placeholder="Confirm password" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs" />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button type="reset" className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition">
                <RefreshCw size={14} />
                Reset
              </button>
              <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition">
                <CheckCircle size={14} />
                Register Student
              </button>
            </div>
          </form>
        </div>


        {/* ======================================= */}
        {/* RIGHT COLUMN: Enquiry Form Capture      */}
        {/* ======================================= */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 sm:p-5 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
            <h2 className="text-base font-bold text-slate-800 dark:text-white">Quick Enquiry Capture</h2>
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">Quickly log prospecting enquiries directly from leads or visits.</p>
          </div>

          <form onSubmit={handleEnquirySubmit} className="space-y-4 text-xs text-slate-700 dark:text-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Enquiry Source <span className="text-red-500">*</span></label>
                <select name="source" required className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs">
                  <option value="">Select source</option>
                  <option value="Website">Website</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Social Media">Social Media</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Enquiry Date <span className="text-red-500">*</span></label>
                <input name="enqDate" type="date" required className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name <span className="text-red-500">*</span></label>
              <input name="leadName" type="text" required placeholder="Enter lead name" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Mobile Number <span className="text-red-500">*</span></label>
                <input name="mobile" type="tel" required placeholder="Enter contact" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input name="email" type="email" placeholder="Enter email" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Course Interested <span className="text-red-500">*</span></label>
                <select name="course" required className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-1.5 text-xs">
                  <option value="">Select course</option>
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Preferred Batch</label>
                <select name="batch" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-1.5 text-xs">
                  <option value="">Select batch</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Mode of Learning</label>
                <select name="mode" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-1.5 text-xs">
                  <option value="">Select mode</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Requirements / Comments</label>
              <textarea name="comments" rows="3" placeholder="Enter specialized demands or status notes" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-2 text-xs"></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Enquiry Status</label>
                <select name="status" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-1.5 text-xs">
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Follow Up">Follow Up</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Assigned To</label>
                <select name="assigned" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-1.5 text-xs">
                  <option value="Admin User">Admin User</option>
                  <option value="Sales Rep 1">Sales Rep 1</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Priority</label>
                <select name="priority" className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-1.5 text-xs">
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button type="reset" className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition">
                Reset
              </button>
              <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm transition">
                <Save size={14} />
                Save Enquiry
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}