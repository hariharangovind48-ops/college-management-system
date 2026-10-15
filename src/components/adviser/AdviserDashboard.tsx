import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Student, AttendanceRecord, LeaveRequest, Certificate } from '../../types';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  FileText,
  Calendar,
  Save,
  Send,
  MessageSquare,
  AlertTriangle,
  Award,
  DollarSign,
  Eye,
  Check,
  UserCheck,
} from 'lucide-react';
import { CertificateModal } from '../common/CertificateModal';
import { HallTicketModal } from '../common/HallTicketModal';

export const AdviserDashboard: React.FC = () => {
  const {
    students,
    attendance,
    internalMarks,
    leaveRequests,
    announcements,
    messages,
    certificates,
    saveAttendanceBatch,
    saveInternalMark,
    reviewLeaveRequest,
    postAnnouncement,
    sendMessage,
    payStudentFee,
  } = useData();

  // Adviser's assigned class
  const assignedClassId = 'CSE-III-A';
  const assignedClassName = 'III Year B.E. CSE - Section A';
  const adviserName = 'Prof. S. Meenakshi';

  // Filter students strictly belonging to this assigned class!
  const classStudents = students.filter(s => s.classId === assignedClassId);

  const [activeTab, setActiveTab] = useState<
    'roster' | 'attendance' | 'marks' | 'leaves' | 'announcements' | 'messages' | 'fees' | 'hackathons'
  >('roster');

  // Attendance recording state
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [dailyRoster, setDailyRoster] = useState<
    Record<string, { status: 'present' | 'absent' | 'od' | 'leave'; notes?: string }>
  >(() => {
    const initial: Record<string, { status: 'present' | 'absent' | 'od' | 'leave' }> = {};
    classStudents.forEach(st => {
      initial[st.id] = { status: 'present' };
    });
    return initial;
  });
  const [attendanceSavedMessage, setAttendanceSavedMessage] = useState(false);

  // Internal Marks Entry state
  const [selectedSubject, setSelectedSubject] = useState('CS3401');
  const [selectedExam, setSelectedExam] = useState<'CIA-1' | 'CIA-2' | 'Model Exam'>('CIA-1');
  const [marksBatch, setMarksBatch] = useState<Record<string, number>>({});
  const [marksSavedMessage, setMarksSavedMessage] = useState(false);

  // Leave review comment
  const [leaveComment, setLeaveComment] = useState<Record<string, string>>({});

  // Class Announcement form
  const [classNotice, setClassNotice] = useState({
    title: '',
    content: '',
    priority: 'normal' as 'urgent' | 'high' | 'normal',
  });
  const [noticeSuccess, setNoticeSuccess] = useState(false);

  // Messaging reply state
  const [selectedStudentForChat, setSelectedStudentForChat] = useState<string>(
    classStudents[0]?.id || ''
  );
  const [replyText, setReplyText] = useState('');

  // Modals
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [selectedStudentForHallTicket, setSelectedStudentForHallTicket] = useState<Student | null>(null);

  // KPI calculations
  const classStrength = classStudents.length;
  const classAvgAttendance =
    Math.round(
      (classStudents.reduce((acc, s) => acc + (s.attendancePercent || 0), 0) / (classStrength || 1)) * 10
    ) / 10;
  const pendingLeaves = leaveRequests.filter(
    l => l.classId === assignedClassId && l.status === 'pending'
  ).length;
  const shortageStudents = classStudents.filter(s => (s.attendancePercent || 0) < 75);

  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: 'present' }> = {};
    classStudents.forEach(st => {
      updated[st.id] = { status: 'present' };
    });
    setDailyRoster(updated);
  };

  const handleStatusChange = (
    studentId: string,
    status: 'present' | 'absent' | 'od' | 'leave'
  ) => {
    setDailyRoster(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const handleSaveAttendance = () => {
    const records = classStudents.map(st => ({
      studentId: st.id,
      studentRollNo: st.rollNo,
      studentName: st.name,
      classId: assignedClassId,
      date: attendanceDate,
      status: dailyRoster[st.id]?.status || 'present',
      markedBy: adviserName,
      notes: dailyRoster[st.id]?.notes,
    }));

    saveAttendanceBatch(records);
    setAttendanceSavedMessage(true);
    setTimeout(() => setAttendanceSavedMessage(false), 3000);
  };

  const subjectsList = [
    { code: 'CS3401', name: 'Algorithms & Advanced Data Structures', max: 50 },
    { code: 'CS3491', name: 'Artificial Intelligence and Machine Learning', max: 50 },
    { code: 'CS3492', name: 'Database Management Systems', max: 50 },
    { code: 'CS3451', name: 'Operating Systems & System Architecture', max: 50 },
  ];

  const currentSubjectObj =
    subjectsList.find(s => s.code === selectedSubject) || subjectsList[0];

  const handleSaveMarksBatch = () => {
    classStudents.forEach(st => {
      const score = marksBatch[st.id];
      if (score !== undefined) {
        saveInternalMark({
          studentId: st.id,
          studentRollNo: st.rollNo,
          studentName: st.name,
          classId: assignedClassId,
          subjectCode: currentSubjectObj.code,
          subjectName: currentSubjectObj.name,
          examType: selectedExam,
          maxMarks: currentSubjectObj.max,
          scoredMarks: Number(score),
          semester: '6',
        });
      }
    });
    setMarksSavedMessage(true);
    setTimeout(() => setMarksSavedMessage(false), 3000);
  };

  const handlePostClassNotice = (e: React.FormEvent) => {
    e.preventDefault();
    postAnnouncement({
      title: classNotice.title,
      content: classNotice.content,
      priority: classNotice.priority,
      targetRole: 'students',
      classId: assignedClassId,
      authorName: adviserName,
      authorRole: 'adviser',
      department: 'Computer Science and Engineering',
    });
    setClassNotice({ title: '', content: '', priority: 'normal' });
    setNoticeSuccess(true);
    setTimeout(() => setNoticeSuccess(false), 3000);
  };

  const handleSendMessageToStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const student = classStudents.find(s => s.id === selectedStudentForChat);
    sendMessage({
      studentId: selectedStudentForChat,
      studentName: student?.name || 'Student',
      adviserId: 'adv-001',
      adviserName: adviserName,
      senderRole: 'adviser',
      senderName: adviserName,
      message: replyText.trim(),
    });
    setReplyText('');
  };

  // Messages with currently selected student
  const chatThread = messages.filter(
    m => m.studentId === selectedStudentForChat && m.adviserId === 'adv-001'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/70 to-slate-900 border border-slate-800 p-6 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shadow-lg">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  Class Adviser Portal
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {assignedClassId}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                {adviserName} • Assistant Professor (Sr. Gr)
              </p>
              <p className="text-[11px] text-emerald-400 font-mono">
                Assigned Class: {assignedClassName} (Coimbatore Campus)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Academic Term:</span>
              <span className="font-semibold text-slate-200">Semester VI (2022-26)</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[10px]">Adviser Cabin:</span>
              <span className="font-semibold text-blue-300">Block 2, Cabin 204</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs">Class Strength</span>
          <p className="text-2xl font-black text-white">{classStrength}</p>
          <span className="text-[10px] text-slate-500 font-mono">Section A Students</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs">Average Attendance</span>
          <p className="text-2xl font-black text-emerald-400">{classAvgAttendance}%</p>
          <span className="text-[10px] text-slate-400">Class Cumulative</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs">Pending Leaves</span>
          <p className="text-2xl font-black text-amber-400">{pendingLeaves}</p>
          <span className="text-[10px] text-amber-300 font-medium">Action Required</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs">Attendance Shortage (&lt;75%)</span>
          <p className="text-2xl font-black text-rose-400">{shortageStudents.length}</p>
          <span className="text-[10px] text-rose-300 font-medium">Debarred Risk</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto text-xs pb-1">
        {[
          { id: 'roster', label: 'My Class Roster', icon: Users },
          { id: 'attendance', label: 'Record Daily Attendance', icon: Calendar },
          { id: 'marks', label: 'Enter Internal Marks', icon: BookOpen },
          { id: 'leaves', label: `Leave Applications (${pendingLeaves})`, icon: Clock },
          { id: 'fees', label: 'Fees & Hall Ticket Status', icon: DollarSign },
          { id: 'hackathons', label: 'Class Hackathon Awards', icon: Award },
          { id: 'messages', label: 'Student Messages', icon: MessageSquare },
          { id: 'announcements', label: 'Class Announcements', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ROSTER */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">
              Displaying all {classStudents.length} students enrolled in {assignedClassName}
            </span>
            <span className="text-emerald-400 font-mono font-medium">
              Class Adviser: {adviserName}
            </span>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Roll & Reg No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Attendance %</th>
                  <th className="px-4 py-3">CGPA</th>
                  <th className="px-4 py-3">Fee Status</th>
                  <th className="px-4 py-3">Hall Ticket</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3 text-right">Hall Ticket View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {classStudents.map(student => {
                  const hasShortage = (student.attendancePercent || 0) < 75;
                  const hasFees = (student.pendingFeeAmount || 0) > 0;
                  const isBlocked = hasShortage || hasFees;

                  return (
                    <tr key={student.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-mono">
                        <span className="font-bold text-blue-400">{student.rollNo}</span>
                        <span className="block text-[10px] text-slate-500">{student.registerNo}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-100">{student.name}</td>
                      <td className="px-4 py-3 font-bold">
                        <span className={hasShortage ? 'text-rose-400' : 'text-emerald-400'}>
                          {student.attendancePercent}%
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-200">
                        {student.cgpa.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        {hasFees ? (
                          <span className="text-rose-400 font-mono font-bold">
                            ₹{student.pendingFeeAmount.toLocaleString()} Pending
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">Cleared</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isBlocked ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            Withheld
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Granted
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{student.phone}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedStudentForHallTicket(student)}
                          className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                        >
                          Check Hall Ticket
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RECORD DAILY ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <label className="text-slate-300 font-semibold">Attendance Date:</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={e => setAttendanceDate(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllPresent}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium border border-slate-700 transition-colors"
              >
                Mark All Present
              </button>
              <button
                onClick={handleSaveAttendance}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-md transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Class Attendance</span>
              </button>
            </div>
          </div>

          {attendanceSavedMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Attendance for {attendanceDate} has been recorded and student averages recalculated!</span>
            </div>
          )}

          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3">Adviser Notes / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {classStudents.map(st => {
                  const currentStatus = dailyRoster[st.id]?.status || 'present';

                  return (
                    <tr key={st.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-mono text-blue-400 font-bold">{st.rollNo}</td>
                      <td className="px-4 py-3 font-semibold text-slate-100">{st.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleStatusChange(st.id, 'present')}
                            className={`px-2.5 py-1 text-[11px] rounded font-semibold transition-colors ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleStatusChange(st.id, 'absent')}
                            className={`px-2.5 py-1 text-[11px] rounded font-semibold transition-colors ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            onClick={() => handleStatusChange(st.id, 'od')}
                            className={`px-2.5 py-1 text-[11px] rounded font-semibold transition-colors ${
                              currentStatus === 'od'
                                ? 'bg-amber-600 text-white shadow'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            On-Duty (OD)
                          </button>
                          <button
                            onClick={() => handleStatusChange(st.id, 'leave')}
                            className={`px-2.5 py-1 text-[11px] rounded font-semibold transition-colors ${
                              currentStatus === 'leave'
                                ? 'bg-purple-600 text-white shadow'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            Leave
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Optional remarks (e.g. Symposium OD CIT)"
                          value={dailyRoster[st.id]?.notes || ''}
                          onChange={e =>
                            setDailyRoster(prev => ({
                              ...prev,
                              [st.id]: { ...prev[st.id], notes: e.target.value },
                            }))
                          }
                          className="w-full px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INTERNAL MARKS ENTRY */}
      {activeTab === 'marks' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <span className="text-slate-400 mr-2">Subject:</span>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-semibold"
                >
                  {subjectsList.map(sub => (
                    <option key={sub.code} value={sub.code}>
                      {sub.code}: {sub.name} (Max {sub.max})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-slate-400 mr-2">Exam:</span>
                <select
                  value={selectedExam}
                  onChange={e => setSelectedExam(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-semibold"
                >
                  <option value="CIA-1">CIA - 1 (Continuous Assessment 1)</option>
                  <option value="CIA-2">CIA - 2 (Continuous Assessment 2)</option>
                  <option value="Model Exam">Model Examination</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveMarksBatch}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Update Scores</span>
            </button>
          </div>

          {marksSavedMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Internal marks for {currentSubjectObj.code} ({selectedExam}) have been updated!</span>
            </div>
          )}

          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Existing Score</th>
                  <th className="px-4 py-3">New Score (Max {currentSubjectObj.max})</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {classStudents.map(st => {
                  const existingRecord = internalMarks.find(
                    m =>
                      m.studentId === st.id &&
                      m.subjectCode === currentSubjectObj.code &&
                      m.examType === selectedExam
                  );

                  const currentValue =
                    marksBatch[st.id] !== undefined
                      ? marksBatch[st.id]
                      : existingRecord?.scoredMarks ?? '';

                  const scoreNum = Number(currentValue);
                  const isPass = !isNaN(scoreNum) && scoreNum >= currentSubjectObj.max / 2;

                  return (
                    <tr key={st.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-mono text-blue-400 font-bold">{st.rollNo}</td>
                      <td className="px-4 py-3 font-semibold text-slate-100">{st.name}</td>
                      <td className="px-4 py-3 font-mono text-slate-300">
                        {existingRecord ? `${existingRecord.scoredMarks} / ${existingRecord.maxMarks}` : 'Not entered'}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          max={currentSubjectObj.max}
                          min={0}
                          placeholder="Score"
                          value={currentValue}
                          onChange={e =>
                            setMarksBatch({
                              ...marksBatch,
                              [st.id]: Number(e.target.value),
                            })
                          }
                          className="w-24 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono text-xs focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {currentValue !== '' && (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isPass
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {isPass ? 'Pass' : 'Fail / Retest'}
                          </span>
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

      {/* TAB 4: LEAVE REQUESTS */}
      {activeTab === 'leaves' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <h3 className="font-bold text-white text-sm">Class Student Leave & On-Duty Requests</h3>
            <p className="text-xs text-slate-400">
              Review and approve student medical leaves, casual leaves, and symposium OD forms
            </p>
          </div>

          <div className="space-y-3">
            {leaveRequests
              .filter(l => l.classId === assignedClassId)
              .map(req => (
                <div
                  key={req.id}
                  className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{req.studentName}</h4>
                        <span className="font-mono text-xs text-blue-400">({req.rollNo})</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-300 border border-blue-500/30">
                          {req.leaveType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        <span className="text-slate-500">Duration:</span> {req.startDate} to {req.endDate}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
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

                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                    <span className="text-slate-500 block text-[10px] font-bold uppercase mb-0.5">
                      Reason for absence:
                    </span>
                    {req.reason}
                  </p>

                  {req.adviserComment && (
                    <p className="text-xs text-blue-300 bg-blue-950/20 p-2.5 rounded border border-blue-900/30">
                      <span className="font-semibold text-slate-400">Adviser Feedback:</span> {req.adviserComment}
                    </p>
                  )}

                  {req.status === 'pending' && (
                    <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <input
                        type="text"
                        placeholder="Optional remarks (e.g. Approved. Submit certificate upon return)"
                        value={leaveComment[req.id] || ''}
                        onChange={e =>
                          setLeaveComment({ ...leaveComment, [req.id]: e.target.value })
                        }
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            reviewLeaveRequest(
                              req.id,
                              'approved',
                              leaveComment[req.id],
                              adviserName
                            )
                          }
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                        >
                          Approve Leave
                        </button>
                        <button
                          onClick={() =>
                            reviewLeaveRequest(
                              req.id,
                              'rejected',
                              leaveComment[req.id] || 'Rejected by Class Adviser',
                              adviserName
                            )
                          }
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 5: FEES & HALL TICKET STATUS */}
      {activeTab === 'fees' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-rose-400" />
              Class Fees & Examination Hall Ticket Clearance
            </h3>
            <p className="text-xs text-slate-400">
              Students with pending fees or attendance &lt;75% cannot get their examination hall tickets.
            </p>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Pending Fee Dues</th>
                  <th className="px-4 py-3">Attendance %</th>
                  <th className="px-4 py-3">Hall Ticket Clearance</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {classStudents.map(st => {
                  const hasFees = (st.pendingFeeAmount || 0) > 0;
                  const hasShortage = (st.attendancePercent || 0) < 75;
                  const isBlocked = hasFees || hasShortage;

                  return (
                    <tr key={st.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-mono text-blue-400 font-bold">{st.rollNo}</td>
                      <td className="px-4 py-3 font-semibold text-slate-100">{st.name}</td>
                      <td className="px-4 py-3 font-mono">
                        {hasFees ? (
                          <span className="text-rose-400 font-bold">
                            ₹{st.pendingFeeAmount.toLocaleString()} Pending
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">Cleared (₹0)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-bold">
                        <span className={hasShortage ? 'text-rose-400' : 'text-slate-200'}>
                          {st.attendancePercent}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isBlocked ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                            WITHHELD ({hasFees ? 'Fee Due' : 'Shortage'})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            GRANTED
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {hasFees ? (
                          <button
                            onClick={() => payStudentFee(st.id, st.pendingFeeAmount)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedStudentForHallTicket(st)}
                            className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                          >
                            Preview Ticket
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

      {/* TAB 6: HACKATHONS */}
      {activeTab === 'hackathons' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Class Hackathon Awards & Certified Students
            </h3>
            <p className="text-xs text-slate-400">
              Students in {assignedClassId} holding verified e-certificates for national coding events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates
              .filter(c => classStudents.some(cs => cs.id === c.studentId))
              .map(cert => (
                <div
                  key={cert.id}
                  className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{cert.studentName}</h4>
                      <p className="text-xs text-blue-400 font-mono">Roll: {cert.rollNo}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {cert.achievement}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg text-xs space-y-1">
                    <p className="font-semibold text-slate-200">{cert.eventName}</p>
                    <p className="text-[11px] text-slate-400 italic">"{cert.projectTitle}"</p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-slate-500">{cert.certificateNo}</span>
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
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

      {/* TAB 7: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Student to Consult:
            </h4>
            <div className="space-y-1">
              {classStudents.map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStudentForChat(st.id)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedStudentForChat === st.id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span>{st.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">{st.rollNo}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[400px]">
            <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2 mb-3">
              Consultation with {classStudents.find(s => s.id === selectedStudentForChat)?.name}
            </h4>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {chatThread.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-10">
                  No previous consultation messages with this student. Send a message below.
                </p>
              ) : (
                chatThread.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.senderRole === 'adviser' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-xl text-xs ${
                        msg.senderRole === 'adviser'
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

            <form onSubmit={handleSendMessageToStudent} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Type reply to student..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 8: CLASS ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <h3 className="font-bold text-white text-sm">Post Class Notice to {assignedClassName}</h3>
            {noticeSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-xs text-emerald-300">
                Notice broadcast to {assignedClassId} students successfully!
              </div>
            )}
            <form onSubmit={handlePostClassNotice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CIA-2 Answer Script Distribution & Signature"
                  value={classNotice.title}
                  onChange={e => setClassNotice({ ...classNotice, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Priority</label>
                <select
                  value={classNotice.priority}
                  onChange={e => setClassNotice({ ...classNotice, priority: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Message Body</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter details..."
                  value={classNotice.content}
                  onChange={e => setClassNotice({ ...classNotice, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
              >
                Send to {assignedClassId}
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
      {selectedStudentForHallTicket && (
        <HallTicketModal
          student={selectedStudentForHallTicket}
          onClose={() => setSelectedStudentForHallTicket(null)}
        />
      )}
    </div>
  );
};
