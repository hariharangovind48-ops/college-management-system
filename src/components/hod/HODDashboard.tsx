import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Student, Adviser, Announcement, Certificate } from '../../types';
import {
  Users,
  Award,
  Briefcase,
  AlertTriangle,
  Search,
  Plus,
  BookOpen,
  Calendar,
  DollarSign,
  TrendingUp,
  Building,
  CheckCircle2,
  XCircle,
  FileText,
  UserPlus,
  Shield,
  Eye,
  CreditCard,
  Building2,
  Sparkles,
} from 'lucide-react';
import { CertificateModal } from '../common/CertificateModal';
import { HallTicketModal } from '../common/HallTicketModal';

export const HODDashboard: React.FC = () => {
  const {
    students,
    advisers,
    attendance,
    internalMarks,
    leaveRequests,
    announcements,
    specialEvents,
    certificates,
    placements,
    addStudent,
    addAdviser,
    postAnnouncement,
    issueCertificate,
    payStudentFee,
  } = useData();

  const [activeTab, setActiveTab] = useState<
    'students' | 'classes' | 'academics' | 'attendance' | 'announcements' | 'hackathons' | 'placements' | 'fees'
  >('students');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  // Modal states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddAdviserModal, setShowAddAdviserModal] = useState(false);
  const [showPostNoticeModal, setShowPostNoticeModal] = useState(false);
  const [showIssueCertModal, setShowIssueCertModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [selectedStudentForHallTicket, setSelectedStudentForHallTicket] = useState<Student | null>(null);

  // Forms
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    rollNo: '',
    registerNo: '',
    email: '',
    classId: 'CSE-III-A',
    className: 'III Year B.E. CSE - Section A',
    section: 'A',
    semester: '6',
    batch: '2022 - 2026',
    department: 'Computer Science and Engineering',
    adviserId: 'adv-001',
    adviserName: 'Prof. S. Meenakshi',
    phone: '',
    cgpa: 8.0,
    attendancePercent: 85,
    pendingFeeAmount: 0,
    feesStatus: 'Cleared' as const,
  });

  const [newAdviserForm, setNewAdviserForm] = useState({
    name: '',
    facultyId: '',
    email: '',
    department: 'Computer Science and Engineering',
    designation: 'Assistant Professor & Class Adviser',
    assignedClassId: 'CSE-III-B',
    assignedClassName: 'III Year B.E. CSE - Section B',
    cabin: 'Academic Block 2, Cabin 205',
    phone: '',
    officeHours: 'Mon - Fri: 3:00 PM - 5:00 PM',
    studentsCount: 50,
  });

  const [newNoticeForm, setNewNoticeForm] = useState({
    title: '',
    content: '',
    priority: 'normal' as 'urgent' | 'high' | 'normal',
    targetRole: 'all' as 'all' | 'students' | 'advisers',
  });

  const [newCertForm, setNewCertForm] = useState({
    studentId: students[0]?.id || '',
    studentName: students[0]?.name || '',
    rollNo: students[0]?.rollNo || '',
    department: 'Computer Science and Engineering',
    eventName: 'INFOKREST 2026 - National Hackathon',
    eventCategory: 'Hackathon',
    achievement: 'Winner' as const,
    projectTitle: 'AI-Driven Smart Grid Energy Optimization',
    issueDate: new Date().toISOString().split('T')[0],
    signatory: 'Dr. K. Radhakrishnan (HOD) & Principal',
  });

  // Analytics Metrics
  const totalStudents = students.length;
  const totalAdvisers = advisers.length;
  const avgAttendance =
    Math.round(
      (students.reduce((acc, s) => acc + (s.attendancePercent || 0), 0) / (totalStudents || 1)) * 10
    ) / 10;
  const placedStudentsCount = students.filter(s => s.placementStatus === 'Placed').length;
  const feePendingStudentsCount = students.filter(s => (s.pendingFeeAmount || 0) > 0).length;
  const attendanceShortageCount = students.filter(s => (s.attendancePercent || 0) < 75).length;

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registerNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === 'all' || s.classId === filterClass;
    return matchesSearch && matchesClass;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent({
      ...newStudentForm,
      feesStatus: newStudentForm.pendingFeeAmount > 0 ? 'Pending' : 'Cleared',
    });
    setShowAddStudentModal(false);
  };

  const handleCreateAdviser = (e: React.FormEvent) => {
    e.preventDefault();
    addAdviser(newAdviserForm);
    setShowAddAdviserModal(false);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    postAnnouncement({
      ...newNoticeForm,
      authorName: 'Dr. K. Radhakrishnan (HOD / CSE)',
      authorRole: 'hod',
      department: 'Computer Science and Engineering',
    });
    setShowPostNoticeModal(false);
    setNewNoticeForm({ title: '', content: '', priority: 'normal', targetRole: 'all' });
  };

  const handleIssueCert = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === newCertForm.studentId);
    const cert = issueCertificate({
      ...newCertForm,
      studentName: st?.name || newCertForm.studentName,
      rollNo: st?.rollNo || newCertForm.rollNo,
    });
    setShowIssueCertModal(false);
    setSelectedCert(cert);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Department Profile */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/80 to-slate-900 border border-slate-800 p-6 shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  HOD Administrative Portal
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Head of Department
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                Dr. K. Radhakrishnan, M.E., Ph.D. • Dept. of Computer Science and Engineering
              </p>
              <p className="text-[11px] text-slate-400">
                INFO Institute of Engineering, Coimbatore • Academic Control & Oversight
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll Student</span>
            </button>
            <button
              onClick={() => setShowAddAdviserModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Adviser</span>
            </button>
            <button
              onClick={() => setShowPostNoticeModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Post Circular</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Registered</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{totalStudents}</p>
          <p className="text-[10px] text-blue-400 font-medium">Active Students</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Faculty Advisers</span>
            <Building className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{totalAdvisers}</p>
          <p className="text-[10px] text-purple-400 font-medium">Class Counselors</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Dept. Attendance</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-emerald-400">{avgAttendance}%</p>
          <p className="text-[10px] text-slate-400">Target &gt;= 75%</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Hackathon Certs</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-extrabold text-amber-400">{certificates.length}</p>
          <p className="text-[10px] text-amber-300 font-medium">Verified Awards</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Campus Placed</span>
            <Briefcase className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xl font-extrabold text-cyan-300">{placedStudentsCount}</p>
          <p className="text-[10px] text-slate-400">Zoho, Kaar, TCS...</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Fees Pending</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-xl font-extrabold text-rose-400">{feePendingStudentsCount}</p>
          <p className="text-[10px] text-rose-300 font-medium">Hall Ticket Withheld</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto text-xs pb-1">
        {[
          { id: 'students', label: 'All Registered Students', icon: Users },
          { id: 'classes', label: 'Classes & Advisers', icon: Building },
          { id: 'hackathons', label: 'Hackathon Certificated Students', icon: Award },
          { id: 'placements', label: 'Placement Selected Students', icon: Briefcase },
          { id: 'fees', label: 'Fees & Hall Ticket Clearance', icon: DollarSign },
          { id: 'academics', label: 'Academic & Internal Marks', icon: BookOpen },
          { id: 'attendance', label: 'Attendance Shortage Alerts', icon: AlertTriangle },
          { id: 'announcements', label: 'Department Notices', icon: FileText },
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

      {/* TAB 1: ALL REGISTERED STUDENTS */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search student by name, roll no, or register no..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Class:</span>
              <select
                value={filterClass}
                onChange={e => setFilterClass(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Classes</option>
                <option value="CSE-III-A">III CSE - Section A</option>
                <option value="CSE-III-B">III CSE - Section B</option>
                <option value="CSE-IV-A">IV CSE - Section A</option>
              </select>
            </div>
          </div>

          {/* Student Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Roll & Reg No</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Class & Sec</th>
                    <th className="px-4 py-3">Attendance</th>
                    <th className="px-4 py-3">CGPA</th>
                    <th className="px-4 py-3">Fee Status</th>
                    <th className="px-4 py-3">Hall Ticket</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredStudents.map(student => {
                    const hasShortage = (student.attendancePercent || 0) < 75;
                    const hasFees = (student.pendingFeeAmount || 0) > 0;
                    const hallTicketBlocked = hasShortage || hasFees;

                    return (
                      <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-mono">
                          <span className="font-bold text-blue-400">{student.rollNo}</span>
                          <span className="block text-[10px] text-slate-500">{student.registerNo}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-100">{student.name}</p>
                          <p className="text-[11px] text-slate-400">{student.email}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {student.classId}
                          <span className="block text-[10px] text-slate-500">{student.adviserName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-semibold ${
                              hasShortage ? 'text-rose-400 font-bold' : 'text-emerald-400'
                            }`}
                          >
                            {student.attendancePercent}%
                          </span>
                          {hasShortage && (
                            <span className="block text-[9px] uppercase tracking-wide text-rose-400 font-bold">
                              Shortage
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-200">
                          {student.cgpa.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          {hasFees ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                              ₹{student.pendingFeeAmount.toLocaleString()} Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              Cleared
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {hallTicketBlocked ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              Withheld
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                              Eligible
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedStudentForHallTicket(student)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
                          >
                            <Eye className="w-3 h-3 text-blue-400" />
                            <span>Hall Ticket</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLASSES & ADVISERS */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {advisers.map(adv => (
              <div
                key={adv.id}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
                      {adv.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{adv.name}</h4>
                      <p className="text-[11px] text-purple-400 font-medium">{adv.facultyId}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Class:</span>
                    <span className="font-semibold text-blue-300">{adv.assignedClassName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class ID:</span>
                    <span className="font-mono text-slate-300">{adv.assignedClassId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Enrolled Students:</span>
                    <span className="font-semibold text-white">
                      {students.filter(s => s.classId === adv.assignedClassId).length} Students
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cabin / Office:</span>
                    <span className="text-slate-300">{adv.cabin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contact:</span>
                    <span className="text-slate-300">{adv.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HACKATHON CERTIFICATED STUDENTS */}
      {activeTab === 'hackathons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Hackathon Participated & Awarded Students Directory
              </h3>
              <p className="text-xs text-slate-400">
                Official records of national hackathons, Smart India Hackathons, and innovation symposiums
              </p>
            </div>
            <button
              onClick={() => setShowIssueCertModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Issue New E-Certificate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map(cert => (
              <div
                key={cert.id}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3 relative group"
              >
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {cert.achievement}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{cert.issueDate}</span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{cert.studentName}</h4>
                  <p className="text-[11px] font-mono text-blue-400">Roll No: {cert.rollNo}</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs space-y-1">
                  <p className="font-semibold text-slate-200">{cert.eventName}</p>
                  <p className="text-[11px] text-slate-400 italic">"{cert.projectTitle}"</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                    {cert.certificateNo}
                  </span>
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PLACEMENT SELECTED STUDENTS */}
      {activeTab === 'placements' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                Campus Placements Hall of Fame
              </h3>
              <p className="text-xs text-slate-400">
                Department of Computer Science & Engineering • Academic Batch 2022 - 2026
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Total Placed:</span>
              <p className="text-lg font-black text-cyan-300">{placements.length} Offers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {placements.map(plc => (
              <div
                key={plc.id}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{plc.companyName}</h4>
                      <span className="text-[10px] text-slate-400">{plc.location}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    {plc.salaryPackage}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Candidate:</span>
                    <span className="font-semibold text-slate-200">{plc.studentName}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Roll No:</span>
                    <span className="text-blue-400">{plc.rollNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Designation:</span>
                    <span className="text-slate-300 text-right">{plc.jobRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Drive Type:</span>
                    <span className="text-slate-400">{plc.driveType} ({plc.offerType})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Offered: {plc.offerDate}</span>
                  <span className="text-emerald-400 font-semibold">{plc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FEES PENDING & HALL TICKET CLEARANCE */}
      {activeTab === 'fees' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-rose-400" />
              Institutional Fee Dues & Hall Ticket Withheld Roster
            </h3>
            <p className="text-xs text-slate-400">
              Regulation rule: Students with pending fee balance or attendance &lt; 75% cannot get examination hall tickets.
            </p>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Roll & Reg No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Pending Dues</th>
                  <th className="px-4 py-3">Attendance</th>
                  <th className="px-4 py-3">Hall Ticket Eligibility</th>
                  <th className="px-4 py-3 text-right">Fee Clearance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {students.map(st => {
                  const hasFees = (st.pendingFeeAmount || 0) > 0;
                  const hasShortage = (st.attendancePercent || 0) < 75;
                  const isBlocked = hasFees || hasShortage;

                  return (
                    <tr key={st.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-mono">
                        <span className="font-bold text-blue-400">{st.rollNo}</span>
                        <span className="block text-[10px] text-slate-500">{st.registerNo}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-200">{st.name}</td>
                      <td className="px-4 py-3 text-slate-400">{st.classId}</td>
                      <td className="px-4 py-3 font-mono font-bold">
                        {hasFees ? (
                          <span className="text-rose-400">₹{st.pendingFeeAmount.toLocaleString()}</span>
                        ) : (
                          <span className="text-emerald-400">₹0 (Cleared)</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={hasShortage ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                          {st.attendancePercent}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isBlocked ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                            BLOCKED / WITHHELD
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            APPROVED
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {hasFees ? (
                          <button
                            onClick={() => payStudentFee(st.id, st.pendingFeeAmount)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition-colors"
                          >
                            Mark Fee Cleared
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedStudentForHallTicket(st)}
                            className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                          >
                            View Hall Ticket
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: ACADEMIC & INTERNAL MARKS */}
      {activeTab === 'academics' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <h3 className="font-bold text-white text-sm">Department CIA & Internal Marks Analytics</h3>
            <p className="text-xs text-slate-400">
              Anna University Continuous Internal Assessment (CIA-1 & CIA-2) performance metrics
            </p>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Subject Code & Title</th>
                  <th className="px-4 py-3">Exam Type</th>
                  <th className="px-4 py-3">Scored / Max</th>
                  <th className="px-4 py-3">Percentage</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {internalMarks.map(mark => {
                  const pct = Math.round((mark.scoredMarks / mark.maxMarks) * 100);
                  const isPass = pct >= 50;

                  return (
                    <tr key={mark.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-semibold text-slate-100">{mark.studentName}</td>
                      <td className="px-4 py-3 font-mono text-blue-400">{mark.studentRollNo}</td>
                      <td className="px-4 py-3 text-slate-200">
                        <span className="font-mono text-slate-400 mr-1.5">{mark.subjectCode}</span>
                        <span>{mark.subjectName}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-300">{mark.examType}</td>
                      <td className="px-4 py-3 font-mono font-bold text-white">
                        {mark.scoredMarks} / {mark.maxMarks}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold">
                        <span className={isPass ? 'text-emerald-400' : 'text-rose-400'}>
                          {pct}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isPass
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {isPass ? 'Pass' : 'Retest Required'}
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

      {/* TAB 7: ATTENDANCE SHORTAGE ALERTS */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Attendance Shortage & Red List (&lt; 75%)
            </h3>
            <p className="text-xs text-slate-400">
              Students identified below are at critical risk of exam debarment as per Anna University attendance norms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students
              .filter(s => (s.attendancePercent || 0) < 75)
              .map(student => (
                <div
                  key={student.id}
                  className="p-5 rounded-xl bg-slate-900 border border-rose-500/30 space-y-3 relative"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{student.name}</h4>
                      <p className="text-xs text-blue-400 font-mono">
                        {student.rollNo} • {student.registerNo}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">Class: {student.className}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-rose-400">
                        {student.attendancePercent}%
                      </span>
                      <span className="block text-[10px] text-rose-300 font-bold uppercase">
                        Shortage
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                    <p className="text-slate-300">
                      <span className="text-slate-500">Adviser:</span> {student.adviserName}
                    </p>
                    <p className="text-slate-300">
                      <span className="text-slate-500">Contact:</span> {student.phone}
                    </p>
                    <p className="text-rose-400 font-semibold pt-1">
                      Action Required: Issue attendance warning memo and summon guardian.
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 8: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div>
              <h3 className="font-bold text-white text-sm">Department Announcements & Circulars</h3>
              <p className="text-xs text-slate-400">Broadcast official notices to students and advisers</p>
            </div>
            <button
              onClick={() => setShowPostNoticeModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Broadcast Notice</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map(anc => (
              <div
                key={anc.id}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        anc.priority === 'urgent'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : anc.priority === 'high'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {anc.priority}
                    </span>
                    <h4 className="font-bold text-white text-sm">{anc.title}</h4>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap">
                    {anc.createdAt}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{anc.content}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>Issued By: {anc.authorName}</span>
                  <span className="capitalize">Target: {anc.targetRole}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ENROLL STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Enroll Authorized Student</h3>
            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Full Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sivakumar R"
                  value={newStudentForm.name}
                  onChange={e => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    placeholder="22CS120"
                    value={newStudentForm.rollNo}
                    onChange={e => setNewStudentForm({ ...newStudentForm, rollNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">AU Register Number</label>
                  <input
                    type="text"
                    required
                    placeholder="711522104120"
                    value={newStudentForm.registerNo}
                    onChange={e => setNewStudentForm({ ...newStudentForm, registerNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="siva.22cs120@infoengg.edu.in"
                    value={newStudentForm.email}
                    onChange={e => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Pending Fees (₹)</label>
                  <input
                    type="number"
                    value={newStudentForm.pendingFeeAmount}
                    onChange={e =>
                      setNewStudentForm({ ...newStudentForm, pendingFeeAmount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ADVISER MODAL */}
      {showAddAdviserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Appoint Faculty Class Adviser</h3>
            <form onSubmit={handleCreateAdviser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Faculty Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. A. Vigneshkumar"
                  value={newAdviserForm.name}
                  onChange={e => setNewAdviserForm({ ...newAdviserForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Faculty ID</label>
                  <input
                    type="text"
                    required
                    placeholder="FAC-CSE-033"
                    value={newAdviserForm.facultyId}
                    onChange={e => setNewAdviserForm({ ...newAdviserForm, facultyId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Assigned Class ID</label>
                  <input
                    type="text"
                    required
                    placeholder="CSE-IV-B"
                    value={newAdviserForm.assignedClassId}
                    onChange={e => setNewAdviserForm({ ...newAdviserForm, assignedClassId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="vignesh.cse@infoengg.edu.in"
                    value={newAdviserForm.email}
                    onChange={e => setNewAdviserForm({ ...newAdviserForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Cabin Location</label>
                  <input
                    type="text"
                    placeholder="Academic Block 2, Cabin 210"
                    value={newAdviserForm.cabin}
                    onChange={e => setNewAdviserForm({ ...newAdviserForm, cabin: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddAdviserModal(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold"
                >
                  Appoint Adviser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST CIRCULAR MODAL */}
      {showPostNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Broadcast Department Circular</h3>
            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Anna University Model Lab Examinations"
                  value={newNoticeForm.title}
                  onChange={e => setNewNoticeForm({ ...newNoticeForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Priority</label>
                  <select
                    value={newNoticeForm.priority}
                    onChange={e => setNewNoticeForm({ ...newNoticeForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  >
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Notice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Audience</label>
                  <select
                    value={newNoticeForm.targetRole}
                    onChange={e => setNewNoticeForm({ ...newNoticeForm, targetRole: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  >
                    <option value="all">Entire Department (All)</option>
                    <option value="students">Students Only</option>
                    <option value="advisers">Faculty Advisers Only</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Circular Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter detailed notice description..."
                  value={newNoticeForm.content}
                  onChange={e => setNewNoticeForm({ ...newNoticeForm, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPostNoticeModal(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE CERTIFICATE MODAL */}
      {showIssueCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Award Hackathon E-Certificate
            </h3>
            <form onSubmit={handleIssueCert} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Select Student</label>
                <select
                  value={newCertForm.studentId}
                  onChange={e => {
                    const st = students.find(s => s.id === e.target.value);
                    setNewCertForm({
                      ...newCertForm,
                      studentId: e.target.value,
                      studentName: st?.name || '',
                      rollNo: st?.rollNo || '',
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                >
                  {students.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.rollNo} - {st.classId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Event Name</label>
                  <input
                    type="text"
                    required
                    value={newCertForm.eventName}
                    onChange={e => setNewCertForm({ ...newCertForm, eventName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Achievement</label>
                  <select
                    value={newCertForm.achievement}
                    onChange={e => setNewCertForm({ ...newCertForm, achievement: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  >
                    <option value="Winner">Winner (First Place)</option>
                    <option value="First Runner Up">First Runner Up</option>
                    <option value="Second Runner Up">Second Runner Up</option>
                    <option value="Participation">Certificate of Participation</option>
                    <option value="Merit">Certificate of Merit</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Project Innovation Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drone Autonomous Navigation for Smart Agriculture"
                  value={newCertForm.projectTitle}
                  onChange={e => setNewCertForm({ ...newCertForm, projectTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowIssueCertModal(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold"
                >
                  Issue & Verify Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <CertificateModal certificate={selectedCert} onClose={() => setSelectedCert(null)} />
      )}

      {/* Hall Ticket Viewer Modal */}
      {selectedStudentForHallTicket && (
        <HallTicketModal
          student={selectedStudentForHallTicket}
          onClose={() => setSelectedStudentForHallTicket(null)}
        />
      )}
    </div>
  );
};
