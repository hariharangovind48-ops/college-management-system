import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Student, Certificate } from '../../types';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Award,
  Send,
  AlertTriangle,
  Briefcase,
  DollarSign,
  User,
  GraduationCap,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Check,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { CertificateModal } from '../common/CertificateModal';
import { HallTicketModal } from '../common/HallTicketModal';

export const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    students,
    attendance,
    internalMarks,
    leaveRequests,
    announcements,
    assignments,
    messages,
    specialEvents,
    certificates,
    placements,
    submitLeaveRequest,
    submitAssignment,
    sendMessage,
    toggleEventRegistration,
  } = useData();

  // Active student profile (Harish V - 22CS042 by default in demo mode)
  const currentStudent: Student =
    students.find(s => s.email === currentUser?.email || s.id === 'stu-042') ||
    students[0];

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'attendance'
    | 'marks'
    | 'leaves'
    | 'hallticket'
    | 'hackathons'
    | 'placements'
    | 'assignments'
    | 'events'
    | 'adviser'
  >('overview');

  // Leave application form
  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    leaveType: 'Medical' as 'Medical' | 'Casual' | 'On-Duty' | 'Family Event',
    reason: '',
  });
  const [leaveSubmittedMsg, setLeaveSubmittedMsg] = useState(false);

  // Message to adviser
  const [studentMessage, setStudentMessage] = useState('');

  // Modals
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [showHallTicketModal, setShowHallTicketModal] = useState(false);

  // Student specific datasets
  const myAttendance = attendance.filter(a => a.studentId === currentStudent.id);
  const myMarks = internalMarks.filter(m => m.studentId === currentStudent.id);
  const myLeaves = leaveRequests.filter(l => l.studentId === currentStudent.id);
  const myAssignments = assignments.filter(a => a.classId === currentStudent.classId);
  const myMessages = messages.filter(m => m.studentId === currentStudent.id);
  const myCertificates = certificates.filter(c => c.studentId === currentStudent.id);
  const myPlacement = placements.find(p => p.studentId === currentStudent.id);

  const hasShortage = (currentStudent.attendancePercent || 0) < 75;
  const hasPendingFees = (currentStudent.pendingFeeAmount || 0) > 0;
  const hallTicketBlocked = hasShortage || hasPendingFees;

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason.trim()) return;

    submitLeaveRequest({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      rollNo: currentStudent.rollNo,
      classId: currentStudent.classId,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      leaveType: leaveForm.leaveType,
      reason: leaveForm.reason.trim(),
    });

    setLeaveForm({ startDate: '', endDate: '', leaveType: 'Medical', reason: '' });
    setLeaveSubmittedMsg(true);
    setTimeout(() => setLeaveSubmittedMsg(false), 3500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentMessage.trim()) return;

    sendMessage({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      adviserId: currentStudent.adviserId,
      adviserName: currentStudent.adviserName,
      senderRole: 'student',
      senderName: currentStudent.name,
      message: studentMessage.trim(),
    });

    setStudentMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Student Profile Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/80 to-slate-900 border border-slate-800 p-6 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 border border-blue-400/30 flex items-center justify-center text-white font-extrabold text-xl shadow-lg ring-2 ring-blue-500/20">
              {currentStudent.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  {currentStudent.name}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {currentStudent.rollNo}
                </span>
                {myPlacement && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Placed: {myPlacement.companyName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                AU Reg No: <span className="font-mono text-blue-300">{currentStudent.registerNo}</span> • Semester {currentStudent.semester} (B.E. CSE)
              </p>
              <p className="text-[11px] text-slate-400">
                Class Adviser: <span className="text-slate-200">{currentStudent.adviserName}</span> • INFO Institute of Engineering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHallTicketModal(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                hallTicketBlocked
                  ? 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{hallTicketBlocked ? 'Hall Ticket (Withheld)' : 'View AU Hall Ticket'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Attendance card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Overall Attendance</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <p
            className={`text-2xl font-black ${
              hasShortage ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {currentStudent.attendancePercent}%
          </p>
          <span className="text-[10px] font-medium text-slate-400">
            {hasShortage ? 'Warning: < 75% Shortage' : 'Eligible for AU Exams'}
          </span>
        </div>

        {/* CGPA card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cumulative GPA</span>
            <GraduationCap className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{currentStudent.cgpa.toFixed(2)}</p>
          <span className="text-[10px] text-purple-300 font-medium">First Class with Distinction</span>
        </div>

        {/* Hackathons Awarded */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Hackathon Certs</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">{myCertificates.length}</p>
          <span className="text-[10px] text-amber-300 font-medium">Verified Awards</span>
        </div>

        {/* Fee status */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Institutional Fees</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p
            className={`text-xl font-black ${
              hasPendingFees ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {hasPendingFees ? `₹${currentStudent.pendingFeeAmount.toLocaleString()}` : 'Cleared'}
          </p>
          <span className="text-[10px] text-slate-400">
            {hasPendingFees ? 'Dues Pending • Ticket Blocked' : 'Exam Clearance Approved'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto text-xs pb-1">
        {[
          { id: 'overview', label: 'Academic Overview', icon: BookOpen },
          { id: 'marks', label: 'Internal Marks (CIA 1 & 2)', icon: FileText },
          { id: 'attendance', label: 'Attendance History', icon: Calendar },
          { id: 'leaves', label: `Leave Applications (${myLeaves.length})`, icon: Clock },
          { id: 'hallticket', label: 'AU Hall Ticket', icon: FileText },
          { id: 'hackathons', label: `Hackathon Awards (${myCertificates.length})`, icon: Award },
          { id: 'placements', label: 'Placement Offers', icon: Briefcase },
          { id: 'assignments', label: `Course Assignments (${myAssignments.length})`, icon: CheckCircle },
          { id: 'events', label: 'Special Events / Symposium', icon: Sparkles },
          { id: 'adviser', label: 'Class Adviser & Chat', icon: MessageSquare },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Student Profile Card */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                Personal & Academic Profile
              </h3>
              <div className="space-y-2 text-xs divide-y divide-slate-800/80">
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Department:</span>
                  <span className="text-slate-200 font-semibold">{currentStudent.department}</span>
                </div>
                <div className="flex justify-between pt-1 font-mono">
                  <span className="text-slate-400">AU Register No:</span>
                  <span className="text-blue-400 font-bold">{currentStudent.registerNo}</span>
                </div>
                <div className="flex justify-between pt-1 font-mono">
                  <span className="text-slate-400">Class Roll No:</span>
                  <span className="text-slate-200">{currentStudent.rollNo}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Batch / Year:</span>
                  <span className="text-slate-200">{currentStudent.batch} (III Year)</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Blood Group:</span>
                  <span className="text-slate-200">{currentStudent.bloodGroup || 'B +ve'}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Contact:</span>
                  <span className="text-slate-200 font-mono">{currentStudent.phone}</span>
                </div>
              </div>
            </div>

            {/* Class Adviser Card */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400" />
                Assigned Class Adviser
              </h3>
              <div className="p-3 bg-slate-950 rounded-lg space-y-2 text-xs">
                <p className="font-bold text-white text-sm">{currentStudent.adviserName}</p>
                <p className="text-slate-400">Assistant Professor (Sr. Gr) & Faculty Mentor</p>
                <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>Academic Block 2, Cabin 204</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>meenakshi.cse@infoengg.edu.in</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    <span>+91 94432 10987</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('adviser')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-lg text-xs font-semibold transition-colors"
              >
                Send Message / Consultation
              </button>
            </div>

            {/* Fee Dues Clearance Status */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                Fee Payment & Hall Ticket Status
              </h3>
              <div className="p-3 bg-slate-950 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Institutional Dues:</span>
                  <span
                    className={`font-mono font-bold ${
                      hasPendingFees ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {hasPendingFees
                      ? `₹${currentStudent.pendingFeeAmount.toLocaleString()}`
                      : '₹0 (All Cleared)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Hall Ticket:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      hallTicketBlocked
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {hallTicketBlocked ? 'Withheld' : 'Approved'}
                  </span>
                </div>
                {hallTicketBlocked && (
                  <p className="text-[11px] text-amber-300 bg-amber-950/20 p-2 rounded border border-amber-900/30">
                    {currentStudent.hallTicketWithheldReason ||
                      'Clear tuition fees or attendance shortage to release examination hall ticket.'}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowHallTicketModal(true)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Open Hall Ticket Portal
              </button>
            </div>
          </div>

          {/* Department Announcements Feed */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Latest College & Department Notices
            </h3>
            <div className="space-y-2.5">
              {announcements.slice(0, 3).map(anc => (
                <div
                  key={anc.id}
                  className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{anc.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{anc.createdAt}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{anc.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERNAL MARKS */}
      {activeTab === 'marks' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <h3 className="font-bold text-white text-sm">Continuous Internal Assessment (CIA) Report</h3>
            <p className="text-xs text-slate-400">
              Anna University Regulations 2021/2026 • Semester VI Internal Scores
            </p>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Subject Code</th>
                  <th className="px-4 py-3">Subject Name</th>
                  <th className="px-4 py-3">Exam Type</th>
                  <th className="px-4 py-3">Scored Marks</th>
                  <th className="px-4 py-3">Max Marks</th>
                  <th className="px-4 py-3">Percentage</th>
                  <th className="px-4 py-3">Grade Point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {myMarks.map(mark => {
                  const pct = Math.round((mark.scoredMarks / mark.maxMarks) * 100);
                  let grade = 'B+';
                  if (pct >= 90) grade = 'O (Outstanding)';
                  else if (pct >= 80) grade = 'A+ (Excellent)';
                  else if (pct >= 70) grade = 'A (Very Good)';
                  else if (pct >= 60) grade = 'B+ (Good)';
                  else grade = 'RA (Re-Appear)';

                  return (
                    <tr key={mark.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-mono text-blue-400 font-bold">{mark.subjectCode}</td>
                      <td className="px-4 py-3 text-slate-100 font-medium">{mark.subjectName}</td>
                      <td className="px-4 py-3 text-slate-300">{mark.examType}</td>
                      <td className="px-4 py-3 font-mono font-bold text-white text-sm">
                        {mark.scoredMarks}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400">{mark.maxMarks}</td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400">{pct}%</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                          {grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE HISTORY */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Daily Attendance Roster & History
            </h3>
            <p className="text-xs text-slate-400">
              Aggregate attendance: <span className="font-bold text-white">{currentStudent.attendancePercent}%</span>{' '}
              (Minimum 75% required for Anna University Examination Hall Ticket)
            </p>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Recorded By</th>
                  <th className="px-4 py-3">Notes / Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {myAttendance.map(att => (
                  <tr key={att.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono text-slate-200">{att.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          att.status === 'present'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : att.status === 'absent'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : att.status === 'od'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            : 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {att.status === 'od' ? 'On-Duty' : att.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{att.markedBy}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{att.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LEAVE APPLICATIONS */}
      {activeTab === 'leaves' && (
        <div className="space-y-6">
          {/* Apply Form */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <h3 className="font-bold text-white text-sm">Submit New Leave / On-Duty Request</h3>
            {leaveSubmittedMsg && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Leave application submitted to {currentStudent.adviserName} for approval!</span>
              </div>
            )}
            <form onSubmit={handleSubmitLeave} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Leave Type</label>
                  <select
                    value={leaveForm.leaveType}
                    onChange={e => setLeaveForm({ ...leaveForm, leaveType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  >
                    <option value="Medical">Medical Leave</option>
                    <option value="On-Duty">On-Duty (Symposium / Hackathon)</option>
                    <option value="Casual">Casual Leave</option>
                    <option value="Family Event">Family Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Detailed Reason & Event Info</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain reason for absence or provide details of the symposium/event..."
                  value={leaveForm.reason}
                  onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
              >
                Submit Leave Application
              </button>
            </form>
          </div>

          {/* Past Leaves */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Application History & Adviser Status
            </h4>
            {myLeaves.map(req => (
              <div
                key={req.id}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-white text-sm mr-2">{req.leaveType} Leave</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {req.startDate} to {req.endDate}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      req.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : req.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800/80">
                  {req.reason}
                </p>
                {req.adviserComment && (
                  <p className="text-blue-300 bg-blue-950/20 p-2 rounded text-[11px] border border-blue-900/30">
                    <span className="font-semibold text-slate-400">Adviser Feedback:</span> {req.adviserComment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AU HALL TICKET */}
      {activeTab === 'hallticket' && (
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Anna University Semester Examination Hall Ticket Portal
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  End Semester Examinations • November / December 2026
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  hallTicketBlocked
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {hallTicketBlocked ? 'Status: Withheld' : 'Status: Approved & Released'}
              </span>
            </div>

            {hallTicketBlocked ? (
              <div className="p-5 bg-rose-950/30 border border-rose-500/30 rounded-xl space-y-3 text-xs text-rose-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Your Hall Ticket is Currently Withheld</h4>
                    <p className="text-slate-300 mt-1">
                      {currentStudent.hallTicketWithheldReason ||
                        'Institutional regulation requires complete fee dues clearance and >=75% attendance.'}
                    </p>
                    {hasPendingFees && (
                      <p className="mt-2 text-rose-300 font-semibold">
                        Outstanding Institutional Balance: ₹{currentStudent.pendingFeeAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowHallTicketModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  Open Fee Clearance & Ticket Review
                </button>
              </div>
            ) : (
              <div className="p-5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-3 text-xs text-emerald-200">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Congratulations! All institutional requirements satisfied.</span>
                </div>
                <p className="text-slate-300">
                  Your official Anna University Theory Examination Hall ticket is ready for viewing and printing.
                </p>
                <button
                  onClick={() => setShowHallTicketModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                >
                  View & Print Official Hall Ticket
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: HACKATHONS */}
      {activeTab === 'hackathons' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                My Hackathon & Innovation Certificates
              </h3>
              <p className="text-xs text-slate-400">
                Official verified certificates of excellence, participation, and hackathon victories
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {myCertificates.length} Certificates
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCertificates.map(cert => (
              <div
                key={cert.id}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 relative group"
              >
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {cert.achievement}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{cert.issueDate}</span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{cert.eventName}</h4>
                  <p className="text-xs text-slate-400 italic mt-0.5">"{cert.projectTitle}"</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-500">{cert.certificateNo}</span>
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold transition-colors"
                  >
                    View E-Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: PLACEMENT OFFERS */}
      {activeTab === 'placements' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              Campus Recruitment & Placement Cell
            </h3>
            <p className="text-xs text-slate-400">
              Department of Computer Science & Engineering • Career Development Center
            </p>
          </div>

          {myPlacement ? (
            <div className="p-6 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    {myPlacement.offerType} Confirmed
                  </span>
                  <h4 className="text-xl font-black text-white mt-0.5">{myPlacement.companyName}</h4>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">
                    {myPlacement.salaryPackage}
                  </span>
                  <span className="block text-[10px] text-slate-400">Annual CTC Package</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">Role:</span>
                  <span className="font-semibold text-slate-200">{myPlacement.jobRole}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Location:</span>
                  <span className="text-slate-200">{myPlacement.location}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Offer Status:</span>
                  <span className="text-emerald-400 font-bold">{myPlacement.status}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
              Placement drives currently active for your semester. Register for upcoming mock interviews.
            </div>
          )}
        </div>
      )}

      {/* TAB 8: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <h3 className="font-bold text-white text-sm">Coursework & Lab Assignments</h3>
            <p className="text-xs text-slate-400">
              Submit solutions and track grading criteria from course instructors
            </p>
          </div>

          <div className="space-y-3">
            {myAssignments.map(asg => (
              <div
                key={asg.id}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-blue-400 font-bold mr-2">{asg.subjectCode}</span>
                    <h4 className="font-bold text-white text-sm inline">{asg.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">{asg.subjectName}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      asg.submissionStatus === 'submitted'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {asg.submissionStatus || 'pending'}
                  </span>
                </div>

                <p className="text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                  {asg.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-slate-400 font-mono text-[11px]">Due: {asg.dueDate}</span>
                  {asg.submissionStatus !== 'submitted' ? (
                    <button
                      onClick={() => submitAssignment(asg.id)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold"
                    >
                      Turn In / Submit Assignment
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Submitted (Score: {asg.obtainedScore || 92}/100)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: SPECIAL EVENTS / SYMPOSIUM */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Special Events & INFOKREST '26 Symposium Participation
            </h3>
            <p className="text-xs text-slate-400">
              National hackathons, paper presentations, and tech workshops. Register to represent INFO Engineering!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialEvents.map(evt => {
              const isRegistered = evt.participants.includes(currentStudent.id);

              return (
                <div
                  key={evt.id}
                  className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/30">
                        {evt.category}
                      </span>
                      <h4 className="font-bold text-white text-sm mt-1">{evt.title}</h4>
                    </div>
                    {evt.prizePool && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {evt.prizePool}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>

                  <div className="p-3 bg-slate-950 rounded-lg text-xs space-y-1 text-slate-400 font-sans">
                    <p>
                      <span className="text-slate-500">Date:</span> {evt.eventDate} • {evt.venue}
                    </p>
                    <p>
                      <span className="text-slate-500">Registered:</span> {evt.registeredCount} / {evt.maxSeats} Participants
                    </p>
                  </div>

                  <button
                    onClick={() => toggleEventRegistration(evt.id, currentStudent.id)}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                      isRegistered
                        ? 'bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:bg-rose-950'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                    }`}
                  >
                    {isRegistered ? 'Withdraw Registration' : 'Register for Event'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 10: ADVISER CONSULTATION & CHAT */}
      {activeTab === 'adviser' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm">Class Adviser Contact</h4>
            <div className="p-3 bg-slate-950 rounded-lg space-y-2">
              <p className="font-bold text-white text-sm">{currentStudent.adviserName}</p>
              <p className="text-slate-400">Assistant Professor (Sr. Gr) & Faculty Mentor</p>
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                <p>📍 Academic Block 2, Cabin 204</p>
                <p>🕒 Office Hours: Mon - Fri (3:30 PM - 5:00 PM)</p>
                <p>📞 +91 94432 10987</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Use this direct messaging channel to submit doubts, request OD recommendations, or discuss academic performance.
            </p>
          </div>

          <div className="md:col-span-2 p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[400px]">
            <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2 mb-3">
              Direct Consultation with {currentStudent.adviserName}
            </h4>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {myMessages.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-10">
                  No previous consultation messages. Send your question below.
                </p>
              ) : (
                myMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.senderRole === 'student' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-xl text-xs ${
                        msg.senderRole === 'student'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">{msg.timestamp}</span>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Write message to Class Adviser..."
                value={studentMessage}
                onChange={e => setStudentMessage(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <CertificateModal certificate={selectedCert} onClose={() => setSelectedCert(null)} />
      )}

      {/* Hall Ticket Viewer Modal */}
      {showHallTicketModal && (
        <HallTicketModal
          student={currentStudent}
          onClose={() => setShowHallTicketModal(false)}
        />
      )}
    </div>
  );
};
