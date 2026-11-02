export type UserRole = 'guru_bk' | 'siswa' | 'konselor' | 'klien';

export interface PortfolioItem {
  id: string;
  title: string;
  type: 'sertifikat' | 'jurnal' | 'artikel' | 'penghargaan';
  issuerOrPublisher: string;
  year: string;
  fileOrUrl?: string;
  description?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  // Specific fields
  studentId?: string; // NISN or NIM
  schoolName?: string;
  // Guru BK Dual Role
  isDualRoleCounselor?: boolean;
  // Counselor specific
  counselorBio?: string;
  counselingSpecialties?: string[];
  redCardRate?: string; // Tarif jasa konseling
  redCardDetails?: string; // Rincian paket
  portfolioItems?: PortfolioItem[];
  // Student points & class
  points?: number;
  joinedClassId?: string;
  joinedClassName?: string;
  teacherUid?: string;
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface SchoolClass {
  id: string;
  teacherUid: string;
  teacherName: string;
  name: string; // e.g. "X MIPA 1"
  code: string; // e.g. "KIRANA-MIPA1"
  description?: string;
  createdAt: string;
}

export type AssessmentType = 'mbti_personality' | 'talents_interests' | 'learning_style' | 'mental_health';

export interface AssessmentResult {
  id: string;
  userId: string;
  userName: string;
  testType: AssessmentType;
  scoreSummary: string; // e.g. "INFJ", "Artistik-Sosial", "Visual-Kinestetik", "Skor 88/100 (Sejahtera Optimal)"
  completedAt: string;
  details: {
    title: string;
    description: string;
    breakdown: { label: string; value: number; max?: number; description?: string }[];
    strengths: string[];
    growthAreas: string[];
    recommendations: string[];
  };
  classId?: string;
}

export interface PointRecord {
  id: string;
  studentUid: string;
  studentName: string;
  classId?: string;
  amount: number; // +15 or -10
  category: 'prestasi' | 'pelanggaran' | 'quest_sosial';
  reason: string;
  isAlert?: boolean; // True if sudden drop
  recordedBy: string; // Name of Guru BK or system
  createdAt: string;
}

export interface SocialQuest {
  id: string;
  studentUid: string;
  studentName: string;
  peerName: string;
  peerGrade: string; // e.g., "Teman Sekelas X MIPA 1", "Kakak Kelas XI IPS 2"
  photoUrl: string;
  note: string;
  pointsAwarded: number;
  createdAt: string;
}

export interface CounselingSchedule {
  id: string;
  counselorUid: string;
  counselorName: string;
  clientUid: string;
  clientName: string;
  clientRole: 'siswa' | 'klien';
  sessionDate: string;
  sessionTime: string;
  location: string; // e.g., "Ruang BK Gedung Utama Lt. 2" or "Video Call Kirana"
  topic: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderUid: string;
  senderName: string;
  senderRole: UserRole;
  recipientUid: string;
  text: string;
  timestamp: string;
}

export interface MeetingRoom {
  id: string;
  hostUid: string;
  hostName: string;
  title: string;
  passcode: string;
  category: 'Kelas' | 'Konseling Kelompok' | 'Tematik';
  description?: string;
  createdAt: string;
}
