export type UserRole = 'hod' | 'adviser' | 'student';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
}

export interface Student {
  id: string;
  uid?: string;
  rollNo: string;
  registerNo: string;
  name: string;
  email: string;
  department: string;
  classId: string;
  className: string;
  section: string;
  semester: string;
  batch: string;
  cgpa: number;
  attendancePercent: number;
  adviserId: string;
  adviserName: string;
  phone: string;
  bloodGroup?: string;
  address?: string;
  placementStatus?: 'Placed' | 'In Process' | 'Higher Studies' | 'Seeking';
  highestPackage?: string; // e.g. "8.5 LPA"
  placedCompany?: string;
  // Fee and Hall ticket rules
  feesStatus: 'Cleared' | 'Pending';
  pendingFeeAmount: number; // in INR
  feeBreakdown?: {
    tuitionFee: number;
    specialLabFee: number;
    examFee: number;
    paidAmount: number;
  };
  hallTicketStatus?: 'Approved' | 'Withheld';
  hallTicketWithheldReason?: string;
}

export interface HallTicket {
  studentId: string;
  registerNo: string;
  rollNo: string;
  studentName: string;
  degreeBranch: string;
  semester: string;
  examCenter: string;
  centerCode: string;
  timetable: {
    subjectCode: string;
    subjectName: string;
    examDate: string;
    session: 'FN (09:30 AM - 12:30 PM)' | 'AN (02:00 PM - 05:00 PM)';
  }[];
}

export interface Adviser {
  id: string;
  uid?: string;
  facultyId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  assignedClassId: string;
  assignedClassName: string;
  cabin: string;
  phone: string;
  officeHours: string;
  studentsCount: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentRollNo: string;
  studentName: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'od' | 'leave';
  markedBy: string;
  markedAt: string;
  notes?: string;
}

export interface InternalMarkEntry {
  id: string;
  studentId: string;
  studentRollNo: string;
  studentName: string;
  classId: string;
  subjectCode: string;
  subjectName: string;
  examType: 'CIA-1' | 'CIA-2' | 'Model Exam' | 'Lab Assessment';
  maxMarks: number;
  scoredMarks: number;
  semester: string;
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  classId: string;
  startDate: string;
  endDate: string;
  leaveType: 'Medical' | 'Casual' | 'On-Duty' | 'Family Event';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  adviserComment?: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRole: 'all' | 'students' | 'advisers';
  classId?: string;
  authorName: string;
  authorRole: 'hod' | 'adviser';
  priority: 'urgent' | 'high' | 'normal';
  createdAt: string;
  department: string;
}

export interface Assignment {
  id: string;
  classId: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  createdAt: string;
  submissionStatus?: 'pending' | 'submitted' | 'graded';
  submittedDate?: string;
  obtainedScore?: number;
}

export interface Message {
  id: string;
  studentId: string;
  studentName: string;
  adviserId: string;
  adviserName: string;
  senderRole: 'adviser' | 'student';
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface SpecialEvent {
  id: string;
  title: string;
  code: string;
  description: string;
  category: 'Hackathon' | 'Symposium' | 'Workshop' | 'Technical Fest' | 'Ideathon';
  eventDate: string;
  venue: string;
  registrationDeadline: string;
  maxSeats: number;
  registeredCount: number;
  participants: string[]; // student ids or roll numbers
  coordinator: string;
  prizePool?: string;
}

export interface Certificate {
  id: string;
  certificateNo: string; // e.g. "IIE/CSE/HACK/2026/042"
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  eventName: string;
  eventCategory: string;
  achievement: 'Winner' | 'First Runner Up' | 'Second Runner Up' | 'Consolation' | 'Participation' | 'Merit';
  projectTitle: string;
  issueDate: string;
  verified: boolean;
  signatory: string;
  verificationUrl?: string;
}

export interface PlacementRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  companyName: string;
  companyLogo?: string;
  jobRole: string;
  salaryPackage: string; // e.g. "8.5 LPA"
  offerType: 'Dream Offer' | 'Super Dream' | 'Regular';
  offerDate: string;
  location: string;
  driveType: 'On-Campus' | 'Off-Campus';
  status: 'Offer Accepted' | 'Offer Issued' | 'Joined';
}
