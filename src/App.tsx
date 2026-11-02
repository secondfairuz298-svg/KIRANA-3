import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { GuruBKDashboard } from './components/GuruBKDashboard';
import { SiswaDashboard } from './components/SiswaDashboard';
import { KonselorDashboard } from './components/KonselorDashboard';
import { KlienDashboard } from './components/KlienDashboard';
import { CariKonselorDirectory } from './components/CariKonselorDirectory';
import { QRScannerModal } from './components/QRScannerModal';
import { AssessmentsModal } from './components/AssessmentsModal';
import { MeetingRoomModal } from './components/MeetingRoomModal';
import { DirectChatDrawer } from './components/DirectChatDrawer';
import { DirectCallModal } from './components/DirectCallModal';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { AuthModal } from './components/AuthModal';

import {
  UserProfile,
  SchoolClass,
  AssessmentResult,
  PointRecord,
  SocialQuest,
  CounselingSchedule,
  AssessmentType,
} from './types';

import {
  SEED_COUNSELORS,
  INITIAL_CLASSES,
  SAMPLE_POINT_RECORDS,
  SAMPLE_SOCIAL_QUESTS,
} from './data/mockSeedData';

import {
  HeartHandshake,
  ShieldCheck,
  Award,
  Users,
  Compass,
  Sparkles,
} from 'lucide-react';

function KiranaAppContent() {
  const { userProfile, updateUserProfile, loading } = useAuth();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'asesmen' | 'direktori_konselor'>('dashboard');

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isQRScannerModalOpen, setIsQRScannerModalOpen] = useState(false);
  const [isAssessmentsModalOpen, setIsAssessmentsModalOpen] = useState(false);
  const [currentAssessmentType, setCurrentAssessmentType] = useState<AssessmentType>('mbti_personality');
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  // Direct Communication states
  const [directChatTarget, setDirectChatTarget] = useState<UserProfile | null>(null);
  const [directCallState, setDirectCallState] = useState<{
    isOpen: boolean;
    callType: 'voice' | 'video';
    targetName: string;
    targetRole: string;
    targetAvatar?: string;
  } | null>(null);

  // Application Data States (synced with localStorage & memory)
  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem('kirana_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [assessments, setAssessments] = useState<AssessmentResult[]>(() => {
    const saved = localStorage.getItem('kirana_assessments');
    return saved ? JSON.parse(saved) : [];
  });

  const [pointRecords, setPointRecords] = useState<PointRecord[]>(() => {
    const saved = localStorage.getItem('kirana_point_records');
    return saved ? JSON.parse(saved) : SAMPLE_POINT_RECORDS;
  });

  const [socialQuests, setSocialQuests] = useState<SocialQuest[]>(() => {
    const saved = localStorage.getItem('kirana_social_quests');
    return saved ? JSON.parse(saved) : SAMPLE_SOCIAL_QUESTS;
  });

  const [schedules, setSchedules] = useState<CounselingSchedule[]>(() => {
    const saved = localStorage.getItem('kirana_schedules');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'sch_1',
            counselorUid: 'counselor_1',
            counselorName: 'Dra. Anastasia Wardani, Psikolog',
            clientUid: 'user_active',
            clientName: 'Ahmad Raihan Pratama',
            clientRole: 'siswa',
            sessionDate: '2026-11-06',
            sessionTime: '10:00 - 11:00 WIB',
            location: 'Ruang BK Sekolah (Lt. 2)',
            topic: 'Bimbingan Gaya Belajar & Pemetaan Minat Karir',
            status: 'scheduled',
            createdAt: '2026-11-01T08:00:00Z',
          },
        ];
  });

  // Students directory
  const [studentsList, setStudentsList] = useState<UserProfile[]>([
    {
      uid: 'sample_student_1',
      email: 'ahmad.raihan@sekolah.sch.id',
      displayName: 'Ahmad Raihan Pratama',
      role: 'siswa',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      studentId: '1029384756',
      points: 95,
      joinedClassId: 'class_x_mipa_1',
      joinedClassName: 'X MIPA 1 (Ruang Utama)',
      createdAt: '2026-07-20T08:00:00Z',
      updatedAt: '2026-10-30T08:00:00Z',
    },
    {
      uid: 'sample_student_2',
      email: 'nadia.salsabila@sekolah.sch.id',
      displayName: 'Nadia Salsabila',
      role: 'siswa',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      studentId: '1029384757',
      points: 105,
      joinedClassId: 'class_x_mipa_1',
      joinedClassName: 'X MIPA 1 (Ruang Utama)',
      createdAt: '2026-07-20T08:00:00Z',
      updatedAt: '2026-10-29T08:00:00Z',
    },
    {
      uid: 'sample_student_3',
      email: 'kevin.arya@sekolah.sch.id',
      displayName: 'Kevin Arya Maulana',
      role: 'siswa',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      studentId: '1029384758',
      points: 80,
      joinedClassId: 'class_x_mipa_2',
      joinedClassName: 'X MIPA 2',
      createdAt: '2026-07-21T08:00:00Z',
      updatedAt: '2026-10-25T08:00:00Z',
    },
  ]);

  // Combine independent counselors with any Guru BK who enables dual-role
  const allDirectoryCounselors = [
    ...SEED_COUNSELORS,
    ...(userProfile?.role === 'guru_bk' && userProfile.isDualRoleCounselor ? [userProfile] : []),
  ];

  // URL join code detector
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('joinCode');
    if (joinCode && userProfile?.role === 'siswa') {
      const matched = classes.find((c) => c.code.toUpperCase() === joinCode.toUpperCase());
      if (matched) {
        handleJoinClass(matched);
      }
    }
  }, [userProfile]);

  // Save changes to localStorage for local persistence
  useEffect(() => {
    localStorage.setItem('kirana_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('kirana_assessments', JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem('kirana_point_records', JSON.stringify(pointRecords));
  }, [pointRecords]);

  useEffect(() => {
    localStorage.setItem('kirana_social_quests', JSON.stringify(socialQuests));
  }, [socialQuests]);

  useEffect(() => {
    localStorage.setItem('kirana_schedules', JSON.stringify(schedules));
  }, [schedules]);

  // Guru BK Action: Update Class Name
  const handleUpdateClassName = async (classId: string, newName: string) => {
    setClasses((prev) =>
      prev.map((cls) => (cls.id === classId ? { ...cls, name: newName } : cls))
    );
  };

  // Siswa Action: Join Class via Scanner or Link
  const handleJoinClass = async (schoolClass: SchoolClass) => {
    if (!userProfile) return;
    await updateUserProfile({
      joinedClassId: schoolClass.id,
      joinedClassName: schoolClass.name,
      teacherUid: schoolClass.teacherUid,
    });
  };

  // Save new Assessment Result
  const handleSaveAssessmentResult = async (result: AssessmentResult) => {
    setAssessments((prev) => [result, ...prev]);
  };

  // Guru BK Action: Add Point Record (With Written Reason & Alert)
  const handleAddPointRecord = async (record: Omit<PointRecord, 'id' | 'createdAt'>) => {
    const newRecord: PointRecord = {
      ...record,
      id: `pt_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setPointRecords((prev) => [newRecord, ...prev]);

    // Update target student's total points
    setStudentsList((prev) =>
      prev.map((s) => {
        if (s.uid === record.studentUid) {
          const updatedPts = Math.max(0, (s.points ?? 100) + record.amount);
          return { ...s, points: updatedPts };
        }
        return s;
      })
    );

    // If current user is that student, update their profile points too
    if (userProfile && userProfile.uid === record.studentUid) {
      await updateUserProfile({
        points: Math.max(0, (userProfile.points ?? 100) + record.amount),
      });
    }
  };

  // Siswa Action: Add Social Quest (+15 points)
  const handleAddSocialQuest = async (quest: Omit<SocialQuest, 'id' | 'createdAt'>) => {
    const newQuest: SocialQuest = {
      ...quest,
      id: `sq_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setSocialQuests((prev) => [newQuest, ...prev]);

    // Award +15 points
    if (userProfile) {
      const updatedPts = (userProfile.points ?? 100) + quest.pointsAwarded;
      await updateUserProfile({ points: updatedPts });

      const pointRec: PointRecord = {
        id: `pt_quest_${Date.now()}`,
        studentUid: userProfile.uid,
        studentName: userProfile.displayName,
        amount: quest.pointsAwarded,
        category: 'quest_sosial',
        reason: `Menyelesaikan Quest Berfoto bersama: ${quest.peerName}`,
        recordedBy: 'Sistem Gamifikasi Kirana',
        createdAt: new Date().toISOString(),
      };
      setPointRecords((prev) => [pointRec, ...prev]);
    }
  };

  // Create Counseling Schedule
  const handleCreateSchedule = async (sched: Omit<CounselingSchedule, 'id' | 'createdAt'>) => {
    const newSched: CounselingSchedule = {
      ...sched,
      id: `sch_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSchedules((prev) => [newSched, ...prev]);
  };

  // Get current student's class
  const studentCurrentClass = classes.find((c) => c.id === userProfile?.joinedClassId) || null;

  // Dedicated counselor for demo interactions
  const demoCounselor = SEED_COUNSELORS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] font-['Plus_Jakarta_Sans'] text-[#382A22]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as 'dashboard' | 'asesmen' | 'direktori_konselor')}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenQuickRoleSwitch={() => setIsAuthModalOpen(true)}
        onOpenMeetingModal={() => setIsMeetingModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!userProfile ? (
          /* Landing Screen when user not logged in */
          <div className="max-w-4xl mx-auto py-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#735138] to-[#422E22] mx-auto flex items-center justify-center text-[#FDFBF7] shadow-xl shadow-[#422E22]/20 ring-4 ring-[#C5A880]/30 animate-in zoom-in-95">
              <HeartHandshake className="w-12 h-12 text-[#F5E8D8]" />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#9E5728] px-3.5 py-1 rounded-full bg-[#EFE3D5] border border-[#DECBB9]">
                Platform Digital Bimbingan Konseling & Naungan Aman
              </span>
              <h1 className="font-['Outfit'] text-4xl sm:text-5xl font-extrabold text-[#382A22] tracking-tight">
                KIRANA
              </h1>
              <p className="text-base sm:text-lg text-[#6E594A] max-w-2xl mx-auto leading-relaxed">
                Konseling Interaktif, Rekapitulasi, Asesmen, & Naungan Aman.
                Menghubungkan layanan bimbingan konseling sekolah resmi (Guru BK & Siswa) serta direktori konseling profesional independen (Konselor & Klien Umum).
              </p>
            </div>

            {/* Quick 4 Role Entry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left pt-6">
              <div
                onClick={() => setIsAuthModalOpen(true)}
                className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs hover:shadow-md hover:border-[#86593B] cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#F2E8DC] text-[#714E36] flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-['Outfit'] font-bold text-base text-[#382A22]">
                    Guru BK
                  </h3>
                  <p className="text-xs text-[#736052] mt-1 leading-relaxed">
                    Kelola 5 kelas dengan QR Code, pantau asesmen siswa, otoritas poin & notif drastis, serta opsi konselor ganda.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#86593B] mt-4 inline-block">Masuk sebagai Guru BK →</span>
              </div>

              <div
                onClick={() => setIsAuthModalOpen(true)}
                className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs hover:shadow-md hover:border-[#86593B] cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#EBF3ED] text-[#286337] flex items-center justify-center mb-3">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-['Outfit'] font-bold text-base text-[#382A22]">
                    Siswa Sekolah
                  </h3>
                  <p className="text-xs text-[#736052] mt-1 leading-relaxed">
                    Scan QR code masuk room, selesaikan 3 asesmen (MBTI 100, Bakat 50, Belajar 50), dan jalankan quest sosial keaktifan.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#286337] mt-4 inline-block">Masuk sebagai Siswa →</span>
              </div>

              <div
                onClick={() => setIsAuthModalOpen(true)}
                className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs hover:shadow-md hover:border-[#86593B] cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#7E3B21] flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-['Outfit'] font-bold text-base text-[#382A22]">
                    Konselor Independen
                  </h3>
                  <p className="text-xs text-[#736052] mt-1 leading-relaxed">
                    Tampil di direktori terbuka, unggah portofolio sertifikat/jurnal, tetapkan Red Card tarif, dan bimbing klien.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#7E3B21] mt-4 inline-block">Masuk sebagai Konselor →</span>
              </div>

              <div
                onClick={() => setIsAuthModalOpen(true)}
                className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs hover:shadow-md hover:border-[#86593B] cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#EEEBF7] text-[#4F3C75] flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-['Outfit'] font-bold text-base text-[#382A22]">
                    Klien Umum
                  </h3>
                  <p className="text-xs text-[#736052] mt-1 leading-relaxed">
                    Ikuti Tes Kepribadian 100 soal & Mental Health 100 soal, serta cari konselor terbaik dengan konsultasi aman.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#4F3C75] mt-4 inline-block">Masuk sebagai Klien →</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-8 py-3.5 rounded-2xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-sm shadow-lg transition-all"
              >
                Mulai Masuk / Daftar Akun KIRANA
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div>
            {activeTab === 'direktori_konselor' ? (
              <CariKonselorDirectory
                counselors={allDirectoryCounselors}
                onOpenChat={(c) => setDirectChatTarget(c)}
                onOpenVoiceCall={(c) =>
                  setDirectCallState({
                    isOpen: true,
                    callType: 'voice',
                    targetName: c.displayName,
                    targetRole: c.role === 'guru_bk' ? 'Guru BK & Konselor Publik' : 'Konselor Profesional',
                    targetAvatar: c.avatarUrl,
                  })
                }
                onOpenVideoCall={(c) =>
                  setDirectCallState({
                    isOpen: true,
                    callType: 'video',
                    targetName: c.displayName,
                    targetRole: c.role === 'guru_bk' ? 'Guru BK & Konselor Publik' : 'Konselor Profesional',
                    targetAvatar: c.avatarUrl,
                  })
                }
                onBookSchedule={(c) => {
                  handleCreateSchedule({
                    counselorUid: c.uid,
                    counselorName: c.displayName,
                    clientUid: userProfile.uid,
                    clientName: userProfile.displayName,
                    clientRole: userProfile.role === 'siswa' ? 'siswa' : 'klien',
                    sessionDate: '2026-11-08',
                    sessionTime: '14:00 - 15:00 WIB',
                    location: 'In-App Video Meeting KIRANA',
                    topic: 'Konsultasi Perencanaan Karir & Pemulihan Kejenuhan',
                    status: 'scheduled',
                  });
                  alert(`Sesi bimbingan bersama ${c.displayName} berhasil dijadwalkan.`);
                }}
              />
            ) : activeTab === 'asesmen' ? (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E4D8CC] shadow-xs">
                  <h2 className="font-['Outfit'] text-2xl font-bold text-[#382A22]">
                    Asesmen Psikologis Terintegrasi
                  </h2>
                  <p className="text-xs sm:text-sm text-[#736052] mt-1 leading-relaxed">
                    Pilih salah satu tes di bawah untuk memetakan kepribadian, minat bakat, cara belajar, atau kesehatan mental.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4EDE5] text-[#714E36]">
                        100 Soal Lengkap
                      </span>
                      <h3 className="font-['Outfit'] font-bold text-lg text-[#382A22] mt-2">
                        Tes Kepribadian (MBTI)
                      </h3>
                      <p className="text-xs text-[#736052] mt-1 leading-relaxed">
                        Mengukur 4 dimensi psikologis (E/I, S/N, T/F, J/P) untuk menghasilkan 16 profil tipe kepribadian lengkap dengan analisis kekuatan, titik rawan, dan rekomendasi studi.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentAssessmentType('mbti_personality');
                        setIsAssessmentsModalOpen(true);
                      }}
                      className="w-full mt-4 py-2.5 rounded-xl bg-[#593E2B] text-[#FAF7F2] font-bold text-xs"
                    >
                      Buka Tes Kepribadian
                    </button>
                  </div>

                  {userProfile.role === 'siswa' && (
                    <>
                      <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4EDE5] text-[#714E36]">
                            50 Soal Minat
                          </span>
                          <h3 className="font-['Outfit'] font-bold text-lg text-[#382A22] mt-2">
                            Tes Bakat & Minat (RIASEC)
                          </h3>
                          <p className="text-xs text-[#736052] mt-1 leading-relaxed">
                            Menganalisis 6 domain minat Holland Code untuk menentukan rekomendasi jurusan perkuliahan dan rumpun profesi masa depan.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentAssessmentType('talents_interests');
                            setIsAssessmentsModalOpen(true);
                          }}
                          className="w-full mt-4 py-2.5 rounded-xl bg-[#593E2B] text-[#FAF7F2] font-bold text-xs"
                        >
                          Buka Tes Bakat & Minat
                        </button>
                      </div>

                      <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4EDE5] text-[#714E36]">
                            50 Soal Belajar
                          </span>
                          <h3 className="font-['Outfit'] font-bold text-lg text-[#382A22] mt-2">
                            Rekomendasi Cara Belajar (VARK)
                          </h3>
                          <p className="text-xs text-[#736052] mt-1 leading-relaxed">
                            Mengidentifikasi modalitas sensori belajar dominan (Visual, Auditori, Baca-Tulis, Kinestetik) beserta tips praktis di kelas.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentAssessmentType('learning_style');
                            setIsAssessmentsModalOpen(true);
                          }}
                          className="w-full mt-4 py-2.5 rounded-xl bg-[#593E2B] text-[#FAF7F2] font-bold text-xs"
                        >
                          Buka Tes Cara Belajar
                        </button>
                      </div>
                    </>
                  )}

                  {(userProfile.role === 'klien' || userProfile.role === 'siswa') && (
                    <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F8ECE8] text-[#A23824]">
                          100 Soal Kesejahteraan
                        </span>
                        <h3 className="font-['Outfit'] font-bold text-lg text-[#382A22] mt-2">
                          Mental Health & Wellbeing Assessment
                        </h3>
                        <p className="text-xs text-[#736052] mt-1 leading-relaxed">
                          Asesmen kesehatan psikologis 5 pilar: stres, kecemasan, resiliensi, keseimbangan hidup, dan hubungan sosial dengan arahan konsultasi naungan aman.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentAssessmentType('mental_health');
                          setIsAssessmentsModalOpen(true);
                        }}
                        className="w-full mt-4 py-2.5 rounded-xl bg-[#A23824] text-[#FAF7F2] font-bold text-xs"
                      >
                        Buka Mental Health Test
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Role Dashboard */
              <>
                {userProfile.role === 'guru_bk' && (
                  <GuruBKDashboard
                    classes={classes}
                    onUpdateClassName={handleUpdateClassName}
                    students={studentsList}
                    assessments={assessments}
                    pointRecords={pointRecords}
                    onAddPointRecord={handleAddPointRecord}
                    schedules={schedules}
                    onCreateSchedule={handleCreateSchedule}
                    onOpenChat={(st) => setDirectChatTarget(st)}
                    onOpenMeeting={() => setIsMeetingModalOpen(true)}
                  />
                )}

                {userProfile.role === 'siswa' && (
                  <SiswaDashboard
                    onOpenQRScanner={() => setIsQRScannerModalOpen(true)}
                    onOpenAssessment={(type) => {
                      setCurrentAssessmentType(type);
                      setIsAssessmentsModalOpen(true);
                    }}
                    assessments={assessments.filter((a) => a.userId === userProfile.uid)}
                    pointRecords={pointRecords.filter((r) => r.studentUid === userProfile.uid || r.studentUid === 'sample_student_1')}
                    socialQuests={socialQuests}
                    onAddSocialQuest={handleAddSocialQuest}
                    schedules={schedules}
                    currentClass={studentCurrentClass}
                    onOpenChatWithGuruBK={() =>
                      setDirectChatTarget({
                        uid: studentCurrentClass?.teacherUid || 'teacher_bk',
                        email: 'guru.bk@sekolah.sch.id',
                        displayName: studentCurrentClass?.teacherName || 'Guru BK Drs. Bambang Sudiro',
                        role: 'guru_bk',
                        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
                        createdAt: '',
                        updatedAt: '',
                      })
                    }
                  />
                )}

                {userProfile.role === 'konselor' && (
                  <KonselorDashboard
                    schedules={schedules}
                    onOpenMeeting={() => setIsMeetingModalOpen(true)}
                  />
                )}

                {userProfile.role === 'klien' && (
                  <KlienDashboard
                    onOpenAssessment={(type) => {
                      setCurrentAssessmentType(type);
                      setIsAssessmentsModalOpen(true);
                    }}
                    assessments={assessments.filter((a) => a.userId === userProfile.uid)}
                    schedules={schedules}
                    onNavigateToDirectory={() => setActiveTab('direktori_konselor')}
                    onOpenChatWithCounselor={(c) => setDirectChatTarget(c)}
                    sampleCounselor={demoCounselor}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8DFD5] bg-[#FAF7F2] py-8 mt-12 text-[#7A675B] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-['Outfit'] font-bold text-sm text-[#382A22]">KIRANA</span>
            <span>•</span>
            <span>Konseling Interaktif, Rekapitulasi, Asesmen & Naungan Aman</span>
          </div>
          <p className="text-[11px] text-[#867366]">
            Dirancang dengan tema Krim & Coklat yang hangat, menenangkan, dan menjamin keterbacaan optimal.
          </p>
        </div>
      </footer>

      {/* Interactive Modals & Drawers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <QRScannerModal
        isOpen={isQRScannerModalOpen}
        onClose={() => setIsQRScannerModalOpen(false)}
        availableClasses={classes}
        onJoinClass={handleJoinClass}
        currentClassId={userProfile?.joinedClassId}
      />

      <AssessmentsModal
        isOpen={isAssessmentsModalOpen}
        onClose={() => setIsAssessmentsModalOpen(false)}
        initialTestType={currentAssessmentType}
        userRole={userProfile?.role || 'siswa'}
        userName={userProfile?.displayName || 'Pengguna KIRANA'}
        userId={userProfile?.uid || 'user_anon'}
        classId={userProfile?.joinedClassId}
        onSaveResult={handleSaveAssessmentResult}
      />

      <MeetingRoomModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        defaultRoomTitle={
          userProfile?.role === 'guru_bk'
            ? 'Bimbingan Kelompok Kelas X MIPA 1'
            : 'Sesi Konseling Tematik Terbimbing KIRANA'
        }
      />

      {directChatTarget && (
        <DirectChatDrawer
          isOpen={Boolean(directChatTarget)}
          onClose={() => setDirectChatTarget(null)}
          targetUser={directChatTarget}
          onStartVoiceCall={() =>
            setDirectCallState({
              isOpen: true,
              callType: 'voice',
              targetName: directChatTarget.displayName,
              targetRole: directChatTarget.role === 'guru_bk' ? 'Guru BK' : 'Konselor Profesional',
              targetAvatar: directChatTarget.avatarUrl,
            })
          }
          onStartVideoCall={() =>
            setDirectCallState({
              isOpen: true,
              callType: 'video',
              targetName: directChatTarget.displayName,
              targetRole: directChatTarget.role === 'guru_bk' ? 'Guru BK' : 'Konselor Profesional',
              targetAvatar: directChatTarget.avatarUrl,
            })
          }
        />
      )}

      {directCallState && directCallState.isOpen && (
        <DirectCallModal
          isOpen={directCallState.isOpen}
          onClose={() => setDirectCallState(null)}
          callType={directCallState.callType}
          targetName={directCallState.targetName}
          targetRole={directCallState.targetRole}
          targetAvatar={directCallState.targetAvatar}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <KiranaAppContent />
    </AuthProvider>
  );
}
