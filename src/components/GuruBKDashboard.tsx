import React, { useState } from 'react';
import {
  Users,
  QrCode,
  Edit2,
  Copy,
  Check,
  Award,
  AlertTriangle,
  Calendar,
  Sparkles,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  BookOpen,
  MessageCircle,
  Video,
} from 'lucide-react';
import { SchoolClass, UserProfile, AssessmentResult, PointRecord, CounselingSchedule } from '../types';
import { useAuth } from '../context/AuthContext';
import { calculateStudentPoints } from '../utils/pointsManager';

interface GuruBKDashboardProps {
  classes: SchoolClass[];
  onUpdateClassName: (classId: string, newName: string) => Promise<void>;
  students: UserProfile[];
  assessments: AssessmentResult[];
  pointRecords: PointRecord[];
  onAddPointRecord: (record: Omit<PointRecord, 'id' | 'createdAt'>) => Promise<void>;
  schedules: CounselingSchedule[];
  onCreateSchedule: (schedule: Omit<CounselingSchedule, 'id' | 'createdAt'>) => Promise<void>;
  onOpenChat: (student: UserProfile) => void;
  onOpenMeeting: () => void;
}

export const GuruBKDashboard: React.FC<GuruBKDashboardProps> = ({
  classes,
  onUpdateClassName,
  students,
  assessments,
  pointRecords,
  onAddPointRecord,
  schedules,
  onCreateSchedule,
  onOpenChat,
  onOpenMeeting,
}) => {
  const { userProfile, updateUserProfile } = useAuth();

  // Active sub-tab in Guru BK dashboard
  const [subTab, setSubTab] = useState<'ruang_kelas' | 'asesmen_siswa' | 'kelola_poin' | 'jadwal_temu'>('ruang_kelas');

  // Room modal state
  const [activeQRClass, setActiveQRClass] = useState<SchoolClass | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editClassNameInput, setEditClassNameInput] = useState('');

  // Point management state
  const [selectedStudentForPoint, setSelectedStudentForPoint] = useState<UserProfile | null>(null);
  const [pointDelta, setPointDelta] = useState<number>(10);
  const [pointReason, setPointReason] = useState<string>('');
  const [pointCategory, setPointCategory] = useState<'prestasi' | 'pelanggaran'>('prestasi');
  const [isSubmittingPoint, setIsSubmittingPoint] = useState(false);
  const [pointSuccessNotice, setPointSuccessNotice] = useState<string | null>(null);

  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedStudent, setSchedStudent] = useState<string>('');
  const [schedDate, setSchedDate] = useState<string>('2026-11-05');
  const [schedTime, setSchedTime] = useState<string>('09:30 - 10:30 WIB');
  const [schedLocation, setSchedLocation] = useState<string>('Ruang Konseling BK Lt. 2');
  const [schedTopic, setSchedTopic] = useState<string>('Bimbingan Karir & Evaluasi Cara Belajar');

  // Dual role counselor toggle
  const handleToggleDualRole = async () => {
    if (!userProfile) return;
    const nextState = !userProfile.isDualRoleCounselor;
    await updateUserProfile({
      isDualRoleCounselor: nextState,
      redCardRate: nextState ? (userProfile.redCardRate || 'Rp 150.000 / Sesi') : undefined,
      counselorBio: nextState
        ? (userProfile.counselorBio ||
            'Guru BK berlisensi dengan pendekatan naungan aman, melayani konseling remaja dan umum berbayar di luar jam sekolah.')
        : undefined,
    });
  };

  const handleSaveClassName = async (classId: string) => {
    if (!editClassNameInput.trim()) return;
    await onUpdateClassName(classId, editClassNameInput.trim());
    setEditingClassId(null);
  };

  const handleCopyClassLink = (classCode: string) => {
    const fullUrl = `${window.location.origin}/?joinCode=${classCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmitPoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPoint || !pointReason.trim()) return;

    setIsSubmittingPoint(true);
    try {
      const deltaNumber = pointCategory === 'prestasi' ? Math.abs(pointDelta) : -Math.abs(pointDelta);
      const calc = calculateStudentPoints({
        currentPoints: selectedStudentForPoint.points ?? 100,
        delta: deltaNumber,
        reason: pointReason.trim(),
      });

      await onAddPointRecord({
        studentUid: selectedStudentForPoint.uid,
        studentName: selectedStudentForPoint.displayName,
        classId: selectedStudentForPoint.joinedClassId,
        amount: deltaNumber,
        category: pointCategory,
        reason: pointReason.trim(),
        isAlert: calc.isAlert,
        recordedBy: userProfile?.displayName || 'Guru BK',
      });

      setPointSuccessNotice(
        `Berhasil memperbarui poin ${selectedStudentForPoint.displayName} (${deltaNumber > 0 ? `+${deltaNumber}` : deltaNumber} poin). ${
          calc.isAlert ? '⚠️ Notifikasi penurunan poin otomatis telah dikirimkan ke siswa.' : ''
        }`
      );
      setPointReason('');
      setTimeout(() => setPointSuccessNotice(null), 5000);
    } finally {
      setIsSubmittingPoint(false);
    }
  };

  const handleCreateNewSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.uid === schedStudent) || students[0];
    if (!student) return;

    await onCreateSchedule({
      counselorUid: userProfile?.uid || 'teacher',
      counselorName: userProfile?.displayName || 'Guru BK',
      clientUid: student.uid,
      clientName: student.displayName,
      clientRole: 'siswa',
      sessionDate: schedDate,
      sessionTime: schedTime,
      location: schedLocation,
      topic: schedTopic,
      status: 'scheduled',
    });

    setShowScheduleModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Dual Role Switch Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E4D8CC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EFE3D5] text-[#714E36] font-bold text-xs uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            Portal Resmi Guru Bimbingan Konseling (BK)
          </div>
          <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[#382A22]">
            Selamat Bertugas, {userProfile?.displayName}
          </h1>
          <p className="text-xs sm:text-sm text-[#736052] mt-1 max-w-2xl leading-relaxed">
            Kelola ruang kelas, pantau hasil asesmen psikologis siswa (MBTI, Bakat Minat, Cara Belajar), kelola poin pembinaan dengan alasan tertulis, dan atur sesi tatap muka.
          </p>
        </div>

        {/* Dual Role Toggle Card */}
        <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#E4D5C5] shrink-0 max-w-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#382A22] block">
                Opsi Peran Ganda Konselor
              </span>
              <p className="text-[11px] text-[#7A675B]">
                Buka konseling berbayar (Red Card) di direktori publik
              </p>
            </div>
            <button
              onClick={handleToggleDualRole}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                userProfile?.isDualRoleCounselor ? 'bg-[#8F522C]' : 'bg-[#D6C6B6]'
              }`}
              aria-label="Toggle Peran Ganda"
            >
              <span
                className={`block w-5 h-5 rounded-full bg-[#FFFFFF] shadow-sm transform transition-transform ${
                  userProfile?.isDualRoleCounselor ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          {userProfile?.isDualRoleCounselor && (
            <div className="mt-2.5 pt-2 border-t border-[#E8DDCE] flex items-center justify-between text-[11px] font-semibold text-[#8F522C]">
              <span>Tarif Red Card Aktif:</span>
              <span className="font-bold">{userProfile.redCardRate || 'Rp 150.000 / Sesi'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sub navigation tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E5DACD] pb-3">
        <button
          onClick={() => setSubTab('ruang_kelas')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === 'ruang_kelas'
              ? 'bg-[#553C2B] text-[#FAF7F2] shadow-sm'
              : 'bg-[#EEE6DC] text-[#695447] hover:bg-[#E5DCD0]'
          }`}
        >
          <Users className="w-4 h-4" />
          Manajemen Ruang Kelas ({classes.length}/5)
        </button>

        <button
          onClick={() => setSubTab('asesmen_siswa')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === 'asesmen_siswa'
              ? 'bg-[#553C2B] text-[#FAF7F2] shadow-sm'
              : 'bg-[#EEE6DC] text-[#695447] hover:bg-[#E5DCD0]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Pantau Asesmen Siswa ({assessments.length})
        </button>

        <button
          onClick={() => setSubTab('kelola_poin')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === 'kelola_poin'
              ? 'bg-[#553C2B] text-[#FAF7F2] shadow-sm'
              : 'bg-[#EEE6DC] text-[#695447] hover:bg-[#E5DCD0]'
          }`}
        >
          <Award className="w-4 h-4" />
          Otoritas & Pengelolaan Poin Siswa
        </button>

        <button
          onClick={() => setSubTab('jadwal_temu')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === 'jadwal_temu'
              ? 'bg-[#553C2B] text-[#FAF7F2] shadow-sm'
              : 'bg-[#EEE6DC] text-[#695447] hover:bg-[#E5DCD0]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Jadwal Sesi Tatap Muka ({schedules.length})
        </button>

        <button
          onClick={onOpenMeeting}
          className="ml-auto px-4 py-2.5 rounded-xl bg-[#7A4B2E] hover:bg-[#633B23] text-[#FAF7F2] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
        >
          <Video className="w-4 h-4" />
          Buka Konferensi Daring Kelas
        </button>
      </div>

      {/* SUB-TAB 1: MANAJEMEN RUANG KELAS & QR CODE */}
      {subTab === 'ruang_kelas' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-['Outfit'] text-lg font-bold text-[#382A22]">
                Daftar Ruang Kelas Bimbingan Konseling
              </h3>
              <p className="text-xs text-[#7A675B]">
                Standar kapasitas adalah 5 kelas terpisah agar data tidak tercampur. Anda dapat mengubah nama kelas sewaktu-waktu.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#F2E8DC] text-[#714E36] border border-[#E2D2C3]">
                      Room Aktif
                    </span>
                    <button
                      onClick={() => {
                        setEditingClassId(cls.id);
                        setEditClassNameInput(cls.name);
                      }}
                      className="p-1.5 rounded-lg text-[#7A675B] hover:bg-[#F3ECE4] hover:text-[#382A22] transition-colors"
                      title="Edit Nama Kelas"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {editingClassId === cls.id ? (
                    <div className="space-y-2 mb-3">
                      <input
                        type="text"
                        value={editClassNameInput}
                        onChange={(e) => setEditClassNameInput(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-[#C5A88E] text-sm font-bold text-[#382A22] focus:outline-hidden"
                      />
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleSaveClassName(cls.id)}
                          className="px-3 py-1 rounded-lg bg-[#553C2B] text-[#FAF7F2] text-xs font-bold"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setEditingClassId(null)}
                          className="px-2.5 py-1 rounded-lg bg-[#EAE2D8] text-[#554032] text-xs"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <h4 className="font-['Outfit'] font-bold text-lg text-[#382A22] mb-1">
                      {cls.name}
                    </h4>
                  )}

                  <p className="text-xs text-[#736052] mb-3">{cls.description}</p>
                  <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EFE5DB] text-xs text-[#523F33] flex items-center justify-between font-mono font-semibold">
                    <span>Kode: {cls.code}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#EFE6DC] flex gap-2">
                  <button
                    onClick={() => setActiveQRClass(cls)}
                    className="flex-1 py-2.5 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    Tampilkan QR Code
                  </button>
                  <button
                    onClick={() => handleCopyClassLink(cls.code)}
                    className="p-2.5 rounded-xl bg-[#FAF5EE] hover:bg-[#EFE5DB] border border-[#DFCBB9] text-[#714E36] transition-colors"
                    title="Salin Tautan Room Kelas"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* QR Code Presentation Modal */}
          {activeQRClass && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231711]/70 backdrop-blur-xs animate-in fade-in">
              <div className="relative w-full max-w-sm rounded-3xl bg-[#FAF7F2] border border-[#E0D2C3] shadow-2xl p-6 text-center text-[#382A22]">
                <button
                  onClick={() => setActiveQRClass(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl text-[#7E695D] hover:bg-[#EFE8DF]"
                >
                  ✕
                </button>

                <h4 className="font-['Outfit'] font-bold text-lg text-[#382A22]">
                  QR Code Kelas {activeQRClass.name}
                </h4>
                <p className="text-xs text-[#7A675B] mt-0.5">
                  Minta siswa membuka scanner di akun Kirana untuk bergabung otomatis
                </p>

                {/* Simulated SVG High-Res QR Code */}
                <div className="my-5 p-4 rounded-2xl bg-[#FFFFFF] border-2 border-[#D8C9BB] inline-block shadow-inner">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-48 h-48 mx-auto"
                    fill="#382A22"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Corner Position Detection Squares */}
                    <rect x="5" y="5" width="28" height="28" fill="#382A22" rx="3" />
                    <rect x="9" y="9" width="20" height="20" fill="#FFFFFF" rx="2" />
                    <rect x="13" y="13" width="12" height="12" fill="#382A22" rx="1.5" />

                    <rect x="67" y="5" width="28" height="28" fill="#382A22" rx="3" />
                    <rect x="71" y="9" width="20" height="20" fill="#FFFFFF" rx="2" />
                    <rect x="75" y="13" width="12" height="12" fill="#382A22" rx="1.5" />

                    <rect x="5" y="67" width="28" height="28" fill="#382A22" rx="3" />
                    <rect x="9" y="71" width="20" height="20" fill="#FFFFFF" rx="2" />
                    <rect x="13" y="75" width="12" height="12" fill="#382A22" rx="1.5" />

                    {/* QR Code Pixel Matrix representation */}
                    <rect x="38" y="10" width="5" height="5" />
                    <rect x="48" y="10" width="5" height="5" />
                    <rect x="58" y="10" width="5" height="5" />
                    <rect x="38" y="20" width="5" height="5" />
                    <rect x="48" y="25" width="5" height="5" />
                    <rect x="58" y="20" width="5" height="5" />
                    <rect x="38" y="30" width="5" height="5" />
                    <rect x="50" y="35" width="5" height="5" />

                    <rect x="10" y="42" width="5" height="5" />
                    <rect x="20" y="42" width="5" height="5" />
                    <rect x="30" y="42" width="5" height="5" />
                    <rect x="42" y="42" width="16" height="16" rx="3" fill="#8F522C" />
                    <rect x="65" y="42" width="5" height="5" />
                    <rect x="75" y="42" width="5" height="5" />
                    <rect x="85" y="42" width="5" height="5" />

                    <rect x="38" y="65" width="5" height="5" />
                    <rect x="48" y="65" width="5" height="5" />
                    <rect x="58" y="70" width="5" height="5" />
                    <rect x="38" y="78" width="5" height="5" />
                    <rect x="48" y="80" width="5" height="5" />
                    <rect x="65" y="75" width="5" height="5" />
                    <rect x="75" y="85" width="5" height="5" />
                    <rect x="85" y="70" width="5" height="5" />
                  </svg>
                  <p className="text-[11px] font-mono font-bold text-[#86593B] mt-2">
                    {activeQRClass.code}
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleCopyClassLink(activeQRClass.code)}
                    className="w-full py-2.5 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedLink ? 'Tautan Berhasil Disalin!' : 'Salin Tautan Room Kelas'}
                  </button>
                  <button
                    onClick={() => setActiveQRClass(null)}
                    className="w-full py-2 rounded-xl bg-[#EEE6DC] text-[#554032] font-semibold text-xs"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: PANTAU ASESMEN SISWA */}
      {subTab === 'asesmen_siswa' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-['Outfit'] text-lg font-bold text-[#382A22]">
                Hasil Asesmen Psikologis Siswa
              </h3>
              <p className="text-xs text-[#7A675B]">
                Memantau hasil Tes Kepribadian (MBTI), Tes Bakat & Minat (RIASEC), serta Cara Belajar (VARK) untuk bimbingan efektif.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#E3D6C9] bg-[#FFFFFF] shadow-xs">
            <table className="w-full text-left text-xs text-[#382A22]">
              <thead className="bg-[#F6EFE8] border-b border-[#E3D6C9] text-[11px] font-bold uppercase tracking-wider text-[#735D4E]">
                <tr>
                  <th className="py-3.5 px-4">Nama Siswa</th>
                  <th className="py-3.5 px-4">Jenis Tes</th>
                  <th className="py-3.5 px-4">Output / Ringkasan Skor</th>
                  <th className="py-3.5 px-4">Tanggal Tes</th>
                  <th className="py-3.5 px-4">Aksi Konseling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE5DB]">
                {assessments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-[#867366]">
                      Belum ada hasil asesmen siswa yang masuk. Bagikan tautan kelas agar siswa menyelesaikan asesmen.
                    </td>
                  </tr>
                ) : (
                  assessments.map((a) => (
                    <tr key={a.id} className="hover:bg-[#FAF6F1] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#382A22]">{a.userName}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#EDE4D9] text-[#695140] font-semibold text-[10px]">
                          {a.testType === 'mbti_personality'
                            ? 'Kepribadian (MBTI)'
                            : a.testType === 'talents_interests'
                            ? 'Bakat-Minat (RIASEC)'
                            : a.testType === 'learning_style'
                            ? 'Cara Belajar (VARK)'
                            : 'Mental Health'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#864F28]">{a.scoreSummary}</td>
                      <td className="py-3.5 px-4 text-[#7A675B]">
                        {new Date(a.completedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => {
                            const found = students.find((s) => s.uid === a.userId) || {
                              uid: a.userId,
                              displayName: a.userName,
                              role: 'siswa' as const,
                              email: 'siswa@kirana.id',
                              createdAt: '',
                              updatedAt: '',
                            };
                            onOpenChat(found);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#593E2B] text-[#FAF7F2] font-bold text-[11px] flex items-center gap-1 hover:bg-[#432E1F] transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          Bimbingan Chat
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: OTORITAS & PENGELOLAAN POIN SISWA */}
      {subTab === 'kelola_poin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Form Tambah/Kurangi Poin */}
          <div className="lg:col-span-1 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs">
            <h3 className="font-['Outfit'] font-bold text-lg text-[#382A22] mb-1">
              Input Pembinaan Poin Siswa
            </h3>
            <p className="text-xs text-[#7A675B] mb-5">
              Guru BK berwenang menaikkan (prestasi) atau menurunkan poin disertai catatan alasan tertulis yang wajib diisi.
            </p>

            {pointSuccessNotice && (
              <div className="p-3 mb-4 rounded-xl bg-[#EAF2EC] border border-[#B9DEC1] text-[#235832] text-xs leading-relaxed">
                {pointSuccessNotice}
              </div>
            )}

            <form onSubmit={handleSubmitPoint} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4F3C31] mb-1">
                  Pilih Siswa:
                </label>
                <select
                  value={selectedStudentForPoint?.uid || ''}
                  onChange={(e) => {
                    const st = students.find((s) => s.uid === e.target.value) || null;
                    setSelectedStudentForPoint(st);
                  }}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C9BB] text-xs font-semibold text-[#382A22] focus:outline-hidden"
                >
                  <option value="">-- Pilih Siswa Kelas --</option>
                  {students.map((st) => (
                    <option key={st.uid} value={st.uid}>
                      {st.displayName} (Saat ini: {st.points ?? 100} poin)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4F3C31] mb-1">
                  Kategori Aksi Poin:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPointCategory('prestasi')}
                    className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      pointCategory === 'prestasi'
                        ? 'bg-[#296D3D] text-[#FAF7F2] shadow-sm'
                        : 'bg-[#F2EDE6] text-[#554032]'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Prestasi (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPointCategory('pelanggaran')}
                    className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      pointCategory === 'pelanggaran'
                        ? 'bg-[#A23824] text-[#FAF7F2] shadow-sm'
                        : 'bg-[#F2EDE6] text-[#554032]'
                    }`}
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    Pelanggaran (-)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4F3C31] mb-1">
                  Jumlah Poin ({pointCategory === 'prestasi' ? '+' : '-'}):
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  step="5"
                  value={pointDelta}
                  onChange={(e) => setPointDelta(Number(e.target.value))}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8C9BB] text-sm font-bold text-[#382A22] focus:outline-hidden"
                />
                <span className="text-[10px] text-[#867366] mt-0.5 block">
                  *Penurunan ≥ 20 poin akan memicu notifikasi peringatan drastis otomatis ke siswa.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4F3C31] mb-1">
                  Catatan Alasan Tertulis (Wajib):
                </label>
                <textarea
                  rows={3}
                  value={pointReason}
                  onChange={(e) => setPointReason(e.target.value)}
                  placeholder="Tuliskan keterangan detail alasan kenaikan atau penurunan poin..."
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8C9BB] text-xs text-[#382A22] placeholder:text-[#A19184] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingPoint || !selectedStudentForPoint}
                className="w-full py-3 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-xs shadow-md transition-all disabled:opacity-40"
              >
                {isSubmittingPoint ? 'Menyimpan...' : 'Simpan Pembinaan Poin'}
              </button>
            </form>
          </div>

          {/* Tabel Riwayat Poin Siswa */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs">
            <h3 className="font-['Outfit'] font-bold text-lg text-[#382A22] mb-1">
              Rekapitulasi Jurnal Poin Siswa
            </h3>
            <p className="text-xs text-[#7A675B] mb-4">
              Seluruh riwayat kenaikan dan pemotongan poin tersimpan transparan dan dapat dibaca oleh siswa terkait.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5EF] text-[10px] font-bold uppercase tracking-wider text-[#735D4E] border-b border-[#E3D6C9]">
                  <tr>
                    <th className="py-2.5 px-3">Nama Siswa</th>
                    <th className="py-2.5 px-3">Delta</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3">Alasan Tertulis</th>
                    <th className="py-2.5 px-3">Status Notifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE5DB]">
                  {pointRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#FAF6F1]">
                      <td className="py-3 px-3 font-bold text-[#382A22]">{rec.studentName}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-black ${
                            rec.amount > 0 ? 'text-[#236E39]' : 'text-[#A23824]'
                          }`}
                        >
                          {rec.amount > 0 ? `+${rec.amount}` : rec.amount}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#EDE4D9] text-[#695140]">
                          {rec.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#523F33] max-w-xs">{rec.reason}</td>
                      <td className="py-3 px-3">
                        {rec.isAlert ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FCEBE7] text-[#A63622] flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" />
                            Peringatan Drastis Terkirim
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#78665A]">Normal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: JADWAL KELAS & TATAP MUKA */}
      {subTab === 'jadwal_temu' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-['Outfit'] text-lg font-bold text-[#382A22]">
                Jadwal Sesi Konseling Tatap Muka
              </h3>
              <p className="text-xs text-[#7A675B]">
                Agenda temu tatap muka di ruang BK sekolah bersama siswa terdaftar.
              </p>
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Buat Jadwal Temu Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((sc) => (
              <div key={sc.id} className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F3EB] text-[#286337]">
                    Tatap Muka BK
                  </span>
                  <span className="text-xs font-mono font-bold text-[#86593B]">{sc.sessionDate}</span>
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#382A22]">{sc.clientName}</h4>
                  <p className="text-xs font-semibold text-[#864F28] mt-0.5">{sc.topic}</p>
                </div>
                <div className="text-[11px] text-[#715D4F] space-y-1 bg-[#FAF6F0] p-2.5 rounded-xl border border-[#EFE5DB]">
                  <p>🕒 Jam: {sc.sessionTime}</p>
                  <p>📍 Lokasi: {sc.location}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Buat Jadwal Temu */}
          {showScheduleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231711]/70 backdrop-blur-xs animate-in fade-in">
              <div className="relative w-full max-w-md rounded-3xl bg-[#FAF7F2] border border-[#E0D2C3] shadow-2xl p-6 text-[#382A22]">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="absolute top-4 right-4 p-2 text-[#7A675B]"
                >
                  ✕
                </button>
                <h4 className="font-['Outfit'] font-bold text-lg text-[#382A22] mb-1">
                  Atur Jadwal Konseling Tatap Muka
                </h4>
                <p className="text-xs text-[#7A675B] mb-4">
                  Tentukan tanggal, jam, dan lokasi ruang BK untuk siswa terkait.
                </p>

                <form onSubmit={handleCreateNewSchedule} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#4F3C31] mb-1">Siswa:</label>
                    <select
                      value={schedStudent}
                      onChange={(e) => setSchedStudent(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#D8C9BB] text-xs"
                    >
                      <option value="">-- Pilih Siswa --</option>
                      {students.map((s) => (
                        <option key={s.uid} value={s.uid}>
                          {s.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4F3C31] mb-1">Tanggal Pertemuan:</label>
                    <input
                      type="date"
                      value={schedDate}
                      onChange={(e) => setSchedDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#D8C9BB] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4F3C31] mb-1">Waktu Sesi:</label>
                    <input
                      type="text"
                      value={schedTime}
                      onChange={(e) => setSchedTime(e.target.value)}
                      placeholder="Contoh: 09:30 - 10:30 WIB"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#D8C9BB] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4F3C31] mb-1">Ruang / Lokasi:</label>
                    <input
                      type="text"
                      value={schedLocation}
                      onChange={(e) => setSchedLocation(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#D8C9BB] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4F3C31] mb-1">Topik Bimbingan:</label>
                    <input
                      type="text"
                      value={schedTopic}
                      onChange={(e) => setSchedTopic(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#D8C9BB] text-xs"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowScheduleModal(false)}
                      className="flex-1 py-2.5 rounded-xl bg-[#EEE6DC] text-[#554032] font-semibold text-xs"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#593E2B] text-[#FAF7F2] font-bold text-xs"
                    >
                      Jadwalkan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
