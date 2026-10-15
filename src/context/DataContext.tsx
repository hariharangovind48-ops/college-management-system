import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Adviser,
  AttendanceRecord,
  InternalMarkEntry,
  LeaveRequest,
  Announcement,
  Assignment,
  Message,
  SpecialEvent,
  Certificate,
  PlacementRecord,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_ADVISERS,
  INITIAL_ATTENDANCE,
  INITIAL_INTERNAL_MARKS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_MESSAGES,
  INITIAL_SPECIAL_EVENTS,
  INITIAL_CERTIFICATES,
  INITIAL_PLACEMENTS,
} from '../lib/mockData';

interface DataContextType {
  students: Student[];
  advisers: Adviser[];
  attendance: AttendanceRecord[];
  internalMarks: InternalMarkEntry[];
  leaveRequests: LeaveRequest[];
  announcements: Announcement[];
  assignments: Assignment[];
  messages: Message[];
  specialEvents: SpecialEvent[];
  certificates: Certificate[];
  placements: PlacementRecord[];

  // Mutations
  addStudent: (data: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  addAdviser: (data: Omit<Adviser, 'id'>) => void;
  saveAttendanceBatch: (records: Omit<AttendanceRecord, 'id' | 'markedAt'>[]) => void;
  saveInternalMark: (mark: Omit<InternalMarkEntry, 'id' | 'updatedAt'>) => void;
  submitLeaveRequest: (data: {
    studentId: string;
    studentName: string;
    rollNo: string;
    classId: string;
    startDate: string;
    endDate: string;
    leaveType: LeaveRequest['leaveType'];
    reason: string;
  }) => void;
  reviewLeaveRequest: (requestId: string, status: 'approved' | 'rejected', comment?: string, reviewerName?: string) => void;
  postAnnouncement: (data: Omit<Announcement, 'id' | 'createdAt'>) => void;
  createAssignment: (data: Omit<Assignment, 'id' | 'createdAt'>) => void;
  submitAssignment: (assignmentId: string) => void;
  sendMessage: (data: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
  toggleEventRegistration: (eventId: string, studentId: string) => void;
  issueCertificate: (cert: Omit<Certificate, 'id' | 'verified' | 'certificateNo'>) => Certificate;
  addPlacementRecord: (record: Omit<PlacementRecord, 'id'>) => void;
  payStudentFee: (studentId: string, amount: number) => void;
  resetToDefaultData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const s = localStorage.getItem('info_cms_students_v2');
    return s ? JSON.parse(s) : INITIAL_STUDENTS;
  });

  const [advisers, setAdvisers] = useState<Adviser[]>(() => {
    const s = localStorage.getItem('info_cms_advisers_v2');
    return s ? JSON.parse(s) : INITIAL_ADVISERS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const s = localStorage.getItem('info_cms_attendance_v2');
    return s ? JSON.parse(s) : INITIAL_ATTENDANCE;
  });

  const [internalMarks, setInternalMarks] = useState<InternalMarkEntry[]>(() => {
    const s = localStorage.getItem('info_cms_marks_v2');
    return s ? JSON.parse(s) : INITIAL_INTERNAL_MARKS;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const s = localStorage.getItem('info_cms_leaves_v2');
    return s ? JSON.parse(s) : INITIAL_LEAVE_REQUESTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const s = localStorage.getItem('info_cms_announcements_v2');
    return s ? JSON.parse(s) : INITIAL_ANNOUNCEMENTS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const s = localStorage.getItem('info_cms_assignments_v2');
    return s ? JSON.parse(s) : INITIAL_ASSIGNMENTS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const s = localStorage.getItem('info_cms_messages_v2');
    return s ? JSON.parse(s) : INITIAL_MESSAGES;
  });

  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>(() => {
    const s = localStorage.getItem('info_cms_events_v2');
    return s ? JSON.parse(s) : INITIAL_SPECIAL_EVENTS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const s = localStorage.getItem('info_cms_certificates_v2');
    return s ? JSON.parse(s) : INITIAL_CERTIFICATES;
  });

  const [placements, setPlacements] = useState<PlacementRecord[]>(() => {
    const s = localStorage.getItem('info_cms_placements_v2');
    return s ? JSON.parse(s) : INITIAL_PLACEMENTS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('info_cms_students_v2', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('info_cms_advisers_v2', JSON.stringify(advisers));
  }, [advisers]);

  useEffect(() => {
    localStorage.setItem('info_cms_attendance_v2', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('info_cms_marks_v2', JSON.stringify(internalMarks));
  }, [internalMarks]);

  useEffect(() => {
    localStorage.setItem('info_cms_leaves_v2', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('info_cms_announcements_v2', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('info_cms_assignments_v2', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('info_cms_messages_v2', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('info_cms_events_v2', JSON.stringify(specialEvents));
  }, [specialEvents]);

  useEffect(() => {
    localStorage.setItem('info_cms_certificates_v2', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('info_cms_placements_v2', JSON.stringify(placements));
  }, [placements]);

  const addStudent = (data: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...data,
      id: `stu-${Date.now().toString().slice(-4)}`,
      feesStatus: data.feesStatus || 'Cleared',
      pendingFeeAmount: data.pendingFeeAmount || 0,
      hallTicketStatus: (data.pendingFeeAmount || 0) === 0 && (data.attendancePercent || 85) >= 75 ? 'Approved' : 'Withheld',
    };
    setStudents(prev => [newStudent, ...prev]);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, ...data };
        // recalculate hall ticket eligibility based on fees and attendance
        const hasFeesPending = (updated.pendingFeeAmount || 0) > 0;
        const hasShortage = (updated.attendancePercent || 0) < 75;
        if (hasFeesPending || hasShortage) {
          updated.hallTicketStatus = 'Withheld';
          updated.hallTicketWithheldReason = hasFeesPending && hasShortage
            ? `Fee Dues Pending (₹${updated.pendingFeeAmount.toLocaleString()}) & Attendance Shortage (${updated.attendancePercent}% < 75%)`
            : hasFeesPending
            ? `Tuition/Institutional Fee Dues Pending (₹${updated.pendingFeeAmount.toLocaleString()})`
            : `Attendance Shortage (${updated.attendancePercent}% < 75%)`;
        } else {
          updated.hallTicketStatus = 'Approved';
          updated.hallTicketWithheldReason = undefined;
        }
        return updated;
      })
    );
  };

  const addAdviser = (data: Omit<Adviser, 'id'>) => {
    const newAdv: Adviser = {
      ...data,
      id: `adv-${Date.now().toString().slice(-4)}`,
    };
    setAdvisers(prev => [...prev, newAdv]);
  };

  const saveAttendanceBatch = (records: Omit<AttendanceRecord, 'id' | 'markedAt'>[]) => {
    const now = new Date().toLocaleString();
    const newRecords: AttendanceRecord[] = records.map((r, i) => ({
      ...r,
      id: `att-${Date.now()}-${i}`,
      markedAt: now,
    }));

    setAttendance(prev => {
      const filtered = prev.filter(
        p => !records.some(r => r.studentId === p.studentId && r.date === p.date)
      );
      return [...newRecords, ...filtered];
    });

    setStudents(prev => {
      return prev.map(student => {
        const studentRecs = [...newRecords, ...attendance].filter(a => a.studentId === student.id);
        if (studentRecs.length === 0) return student;
        const attended = studentRecs.filter(a => a.status === 'present' || a.status === 'od').length;
        const percent = Math.round((attended / studentRecs.length) * 1000) / 10;
        const hasFeesPending = (student.pendingFeeAmount || 0) > 0;
        const hasShortage = percent < 75;

        return {
          ...student,
          attendancePercent: percent,
          hallTicketStatus: !hasFeesPending && !hasShortage ? 'Approved' : 'Withheld',
          hallTicketWithheldReason: hasFeesPending && hasShortage
            ? `Fee Dues Pending (₹${student.pendingFeeAmount.toLocaleString()}) & Attendance Shortage (${percent}% < 75%)`
            : hasFeesPending
            ? `Tuition/Institutional Fee Dues Pending (₹${student.pendingFeeAmount.toLocaleString()})`
            : hasShortage
            ? `Attendance Shortage (${percent}% < 75%)`
            : undefined,
        };
      });
    });
  };

  const saveInternalMark = (mark: Omit<InternalMarkEntry, 'id' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    setInternalMarks(prev => {
      const existingIdx = prev.findIndex(
        m =>
          m.studentId === mark.studentId &&
          m.subjectCode === mark.subjectCode &&
          m.examType === mark.examType
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          ...mark,
          updatedAt: now,
        };
        return updated;
      } else {
        const newEntry: InternalMarkEntry = {
          ...mark,
          id: `m-${Date.now()}`,
          updatedAt: now,
        };
        return [newEntry, ...prev];
      }
    });
  };

  const submitLeaveRequest = (data: {
    studentId: string;
    studentName: string;
    rollNo: string;
    classId: string;
    startDate: string;
    endDate: string;
    leaveType: LeaveRequest['leaveType'];
    reason: string;
  }) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newRequest: LeaveRequest = {
      ...data,
      id: `lr-${Date.now()}`,
      status: 'pending',
      appliedAt: formattedDate,
    };
    setLeaveRequests(prev => [newRequest, ...prev]);
  };

  const reviewLeaveRequest = (
    requestId: string,
    status: 'approved' | 'rejected',
    comment?: string,
    reviewerName?: string
  ) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setLeaveRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? {
              ...req,
              status,
              adviserComment: comment || (status === 'approved' ? 'Approved by Class Adviser.' : 'Declined.'),
              reviewedAt: formattedDate,
              reviewedBy: reviewerName || 'Class Adviser',
            }
          : req
      )
    );
  };

  const postAnnouncement = (data: Omit<Announcement, 'id' | 'createdAt'>) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newAnn: Announcement = {
      ...data,
      id: `anc-${Date.now()}`,
      createdAt: formattedDate,
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const createAssignment = (data: Omit<Assignment, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    const newAsg: Assignment = {
      ...data,
      id: `asg-${Date.now()}`,
      createdAt: now,
      submissionStatus: 'pending',
    };
    setAssignments(prev => [newAsg, ...prev]);
  };

  const submitAssignment = (assignmentId: string) => {
    const now = new Date().toISOString().split('T')[0];
    setAssignments(prev =>
      prev.map(asg =>
        asg.id === assignmentId
          ? {
              ...asg,
              submissionStatus: 'submitted',
              submittedDate: now,
            }
          : asg
      )
    );
  };

  const sendMessage = (data: Omit<Message, 'id' | 'timestamp' | 'read'>) => {
    const now = new Date();
    const formattedTime = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newMsg: Message = {
      ...data,
      id: `msg-${Date.now()}`,
      timestamp: formattedTime,
      read: true,
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const toggleEventRegistration = (eventId: string, studentId: string) => {
    setSpecialEvents(prev =>
      prev.map(evt => {
        if (evt.id !== eventId) return evt;
        const isRegistered = evt.participants.includes(studentId);
        const updatedParticipants = isRegistered
          ? evt.participants.filter(id => id !== studentId)
          : [...evt.participants, studentId];
        return {
          ...evt,
          participants: updatedParticipants,
          registeredCount: updatedParticipants.length,
        };
      })
    );
  };

  const issueCertificate = (certData: Omit<Certificate, 'id' | 'verified' | 'certificateNo'>): Certificate => {
    const code = `IIE/CSE/HACK/2026/${Math.floor(100 + Math.random() * 900)}`;
    const newCert: Certificate = {
      ...certData,
      id: `cert-${Date.now()}`,
      certificateNo: code,
      verified: true,
      verificationUrl: `https://infoengg.edu.in/verify/${code.replace(/\//g, '-')}`,
    };
    setCertificates(prev => [newCert, ...prev]);
    return newCert;
  };

  const addPlacementRecord = (data: Omit<PlacementRecord, 'id'>) => {
    const newRecord: PlacementRecord = {
      ...data,
      id: `plc-${Date.now()}`,
    };
    setPlacements(prev => [newRecord, ...prev]);

    // Also update student's placement status
    updateStudent(data.studentId, {
      placementStatus: 'Placed',
      highestPackage: data.salaryPackage,
      placedCompany: data.companyName,
    });
  };

  const payStudentFee = (studentId: string, amount: number) => {
    setStudents(prev =>
      prev.map(st => {
        if (st.id !== studentId) return st;
        const newPending = Math.max(0, (st.pendingFeeAmount || 0) - amount);
        const newStatus = newPending === 0 ? 'Cleared' : 'Pending';
        const hasShortage = (st.attendancePercent || 0) < 75;
        const canGetHallTicket = newPending === 0 && !hasShortage;

        return {
          ...st,
          pendingFeeAmount: newPending,
          feesStatus: newStatus,
          hallTicketStatus: canGetHallTicket ? 'Approved' : 'Withheld',
          hallTicketWithheldReason: canGetHallTicket
            ? undefined
            : newPending > 0 && hasShortage
            ? `Fee Dues Pending (₹${newPending.toLocaleString()}) & Attendance Shortage (${st.attendancePercent}% < 75%)`
            : newPending > 0
            ? `Tuition/Institutional Fee Dues Pending (₹${newPending.toLocaleString()})`
            : `Attendance Shortage (${st.attendancePercent}% < 75%)`,
          feeBreakdown: st.feeBreakdown
            ? {
                ...st.feeBreakdown,
                paidAmount: st.feeBreakdown.paidAmount + amount,
              }
            : undefined,
        };
      })
    );
  };

  const resetToDefaultData = () => {
    setStudents(INITIAL_STUDENTS);
    setAdvisers(INITIAL_ADVISERS);
    setAttendance(INITIAL_ATTENDANCE);
    setInternalMarks(INITIAL_INTERNAL_MARKS);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setMessages(INITIAL_MESSAGES);
    setSpecialEvents(INITIAL_SPECIAL_EVENTS);
    setCertificates(INITIAL_CERTIFICATES);
    setPlacements(INITIAL_PLACEMENTS);
    localStorage.clear();
  };

  return (
    <DataContext.Provider
      value={{
        students,
        advisers,
        attendance,
        internalMarks,
        leaveRequests,
        announcements,
        assignments,
        messages,
        specialEvents,
        certificates,
        placements,
        addStudent,
        updateStudent,
        addAdviser,
        saveAttendanceBatch,
        saveInternalMark,
        submitLeaveRequest,
        reviewLeaveRequest,
        postAnnouncement,
        createAssignment,
        submitAssignment,
        sendMessage,
        toggleEventRegistration,
        issueCertificate,
        addPlacementRecord,
        payStudentFee,
        resetToDefaultData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
