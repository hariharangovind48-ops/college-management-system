import React, { useState } from 'react';
import { Student } from '../../types';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  X,
  Printer,
  CreditCard,
  Building2,
  Calendar,
  Clock,
  User,
  ShieldAlert,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface HallTicketModalProps {
  student: Student;
  onClose: () => void;
}

export const HallTicketModal: React.FC<HallTicketModalProps> = ({ student, onClose }) => {
  const { payStudentFee } = useData();
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const hasFeesPending = (student.pendingFeeAmount || 0) > 0;
  const hasAttendanceShortage = (student.attendancePercent || 0) < 75;
  const isBlocked = hasFeesPending || hasAttendanceShortage;

  const handleSimulatePayment = () => {
    setPaying(true);
    setTimeout(() => {
      payStudentFee(student.id, student.pendingFeeAmount || 0);
      setPaying(false);
      setPaymentSuccess(true);
    }, 600);
  };

  const timetable = [
    { code: 'CS3401', name: 'Algorithms & Advanced Data Structures', date: '04-12-2026', session: 'FN (09:30 AM - 12:30 PM)' },
    { code: 'CS3491', name: 'Artificial Intelligence & Machine Learning', date: '08-12-2026', session: 'FN (09:30 AM - 12:30 PM)' },
    { code: 'CS3492', name: 'Database Management Systems', date: '12-12-2026', session: 'FN (09:30 AM - 12:30 PM)' },
    { code: 'CS3451', name: 'Operating Systems & System Architecture', date: '16-12-2026', session: 'FN (09:30 AM - 12:30 PM)' },
    { code: 'GE3451', name: 'Environmental Sciences and Sustainability', date: '21-12-2026', session: 'FN (09:30 AM - 12:30 PM)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-slate-100">
              Anna University Semester Examination Hall Ticket
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isBlocked && (
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Hall Ticket</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto">
          {/* WITHHELD NOTICE IF FEES ARE PENDING OR SHORTAGE */}
          {isBlocked ? (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-rose-950/40 border border-rose-500/40 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-900/60 text-rose-400 border border-rose-500/50">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-rose-200">
                    HALL TICKET WITHHELD / BLOCKED
                  </h3>
                  <p className="text-xs text-rose-300/80 mt-1">
                    In accordance with Anna University Regulation & College Examination Bye-Laws
                  </p>
                </div>

                <div className="max-w-md mx-auto p-4 bg-slate-950/80 rounded-lg border border-rose-500/20 text-left text-xs space-y-2">
                  <p className="font-semibold text-slate-200">Disqualification Reasons:</p>
                  {hasFeesPending && (
                    <div className="flex items-start gap-2 text-rose-300">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                      <div>
                        <span className="font-semibold">Institutional / Tuition Fee Dues:</span> Pending balance of{' '}
                        <span className="font-bold text-rose-200">₹{student.pendingFeeAmount?.toLocaleString()}</span>.
                      </div>
                    </div>
                  )}
                  {hasAttendanceShortage && (
                    <div className="flex items-start gap-2 text-amber-300">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                      <div>
                        <span className="font-semibold">Attendance Shortage:</span> Current aggregate is{' '}
                        <span className="font-bold">{student.attendancePercent}%</span> (Minimum mandatory is 75.0%).
                      </div>
                    </div>
                  )}
                </div>

                {hasFeesPending && (
                  <div className="pt-2 max-w-sm mx-auto">
                    <p className="text-xs text-slate-400 mb-3">
                      Students must clear institutional dues at Accounts Section (Administrative Block) before hall tickets are released.
                    </p>
                    <button
                      onClick={handleSimulatePayment}
                      disabled={paying}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-950/40 transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      {paying ? 'Processing Fee Clearance...' : `Clear Dues ₹${student.pendingFeeAmount?.toLocaleString()} (Simulate Clearance)`}
                    </button>
                    <p className="text-[10px] text-slate-500 mt-1">
                      (Demo mode feature to test the transition from Withheld to Approved)
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* APPROVED OFFICIAL HALL TICKET */
            <div className="space-y-6">
              {paymentSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dues cleared successfully! Hall ticket has been unlocked and verified.</span>
                </div>
              )}

              {/* Printable Hall Ticket Document */}
              <div className="border border-slate-700 rounded-xl p-6 bg-slate-950 space-y-6 shadow-inner font-sans">
                {/* College Top Banner */}
                <div className="text-center pb-4 border-b border-slate-800 space-y-1">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <span className="text-lg font-black tracking-wide text-white">
                      INFO INSTITUTE OF ENGINEERING, COIMBATORE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Affiliated to Anna University, Chennai • Approved by AICTE, New Delhi
                  </p>
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest pt-1">
                    END SEMESTER THEORY EXAMINATIONS - NOV / DEC 2026
                  </p>
                  <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    HALL TICKET - ELIGIBLE & VERIFIED
                  </span>
                </div>

                {/* Candidate & Center Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-900/80 rounded-lg border border-slate-800 text-xs">
                  {/* Photo Placeholder */}
                  <div className="flex flex-col items-center justify-center border border-dashed border-slate-700 rounded-lg p-2 bg-slate-950">
                    <div className="w-20 h-24 bg-slate-800 rounded flex items-center justify-center text-slate-500 mb-1">
                      <User className="w-10 h-10 text-slate-400" />
                    </div>
                    <span className="text-[10px] text-slate-400">Candidate Photo</span>
                  </div>

                  {/* Info Column 1 */}
                  <div className="space-y-2 md:col-span-2">
                    <div>
                      <span className="text-slate-400 text-[11px]">Candidate Name:</span>
                      <p className="font-bold text-white text-sm">{student.name}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px]">Register Number (AU):</span>
                      <p className="font-mono font-bold text-blue-400">{student.registerNo}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px]">Roll Number:</span>
                      <p className="font-mono text-slate-200">{student.rollNo}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px]">Degree & Branch:</span>
                      <p className="text-slate-200">B.E. Computer Science and Engineering</p>
                    </div>
                  </div>

                  {/* Info Column 2 */}
                  <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-800 md:pl-4">
                    <div>
                      <span className="text-slate-400 text-[11px]">Semester:</span>
                      <p className="font-bold text-white">06 (Sixth Semester)</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px]">Exam Center Code:</span>
                      <p className="font-mono text-slate-200">7115</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px]">Exam Center:</span>
                      <p className="text-slate-300">INFO Institute of Engineering, Kovilpalayam</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px]">Fee Status:</span>
                      <span className="text-[11px] font-semibold text-emerald-400">Fully Cleared</span>
                    </div>
                  </div>
                </div>

                {/* Exam Timetable Table */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    Registered Subjects & Examination Schedule
                  </h4>
                  <div className="overflow-x-auto border border-slate-800 rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="px-3 py-2">Subject Code</th>
                          <th className="px-3 py-2">Subject Title</th>
                          <th className="px-3 py-2">Date</th>
                          <th className="px-3 py-2">Session</th>
                          <th className="px-3 py-2 text-center">Invigilator Sign</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-sans">
                        {timetable.map((sub, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/40">
                            <td className="px-3 py-2.5 font-mono text-blue-400 font-semibold">{sub.code}</td>
                            <td className="px-3 py-2.5 text-slate-200">{sub.name}</td>
                            <td className="px-3 py-2.5 text-slate-300 font-mono">{sub.date}</td>
                            <td className="px-3 py-2.5 text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{sub.session}</span>
                            </td>
                            <td className="px-3 py-2.5 text-center text-slate-600 font-mono text-[10px]">
                              [ Signature ]
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Important Instructions */}
                <div className="p-3 bg-blue-950/20 border border-blue-900/30 rounded-lg text-[11px] text-slate-400 space-y-1">
                  <p className="font-semibold text-blue-300">Important Candidate Instructions:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                    <li>Candidates must bring College ID card and this original Hall Ticket to all exams.</li>
                    <li>Entry into exam hall is strictly prohibited after 09:45 AM (FN) / 02:15 PM (AN).</li>
                    <li>Electronic gadgets, smartwatches, and programmable calculators are strictly banned.</li>
                  </ul>
                </div>

                {/* Signatures */}
                <div className="pt-6 border-t border-slate-800 flex justify-between items-end text-xs">
                  <div className="text-center">
                    <div className="w-32 h-0.5 bg-slate-700 mb-1" />
                    <p className="text-slate-400 text-[11px]">Signature of Candidate</p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-0.5 bg-slate-700 mb-1" />
                    <p className="text-slate-400 text-[11px]">Controller of Examinations</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
