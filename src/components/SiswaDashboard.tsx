import React, { useState } from 'react';
import {
  QrCode,
  Award,
  Sparkles,
  Camera,
  AlertTriangle,
  Calendar,
  CheckCircle,
  BrainCircuit,
  Compass,
  BookOpen,
  MessageCircle,
  Plus,
  HeartHandshake,
  UserCheck,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AssessmentResult, PointRecord, SocialQuest, CounselingSchedule, SchoolClass } from '../types';

interface SiswaDashboardProps {
  onOpenQRScanner: () => void;
  onOpenAssessment: (type: 'mbti_personality' | 'talents_interests' | 'learning_style') => void;
  assessments: AssessmentResult[];
  pointRecords: PointRecord[];
  socialQuests: SocialQuest[];
  onAddSocialQuest: (quest: Omit<SocialQuest, 'id' | 'createdAt'>) => Promise<void>;
  schedules: CounselingSchedule[];
  currentClass: SchoolClass | null;
  onOpenChatWithGuruBK: () => void;
}

export const SiswaDashboard: React.FC<SiswaDashboardProps> = ({
  onOpenQRScanner,
  onOpenAssessment,
  assessments,
  pointRecords,
  socialQuests,
  onAddSocialQuest,
  schedules,
  currentClass,
  onOpenChatWithGuruBK,
}) => {
  const { userProfile } = useAuth();
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [peerName, setPeerName] = useState('');
  const [peerGrade, setPeerGrade] = useState('Teman Sebaya (Satu Kelas)');
  const [questNote, setQuestNote] = useState('');
  const [submittingQuest, setSubmittingQuest] = useState(false);

  // Check if there are drastic drop alerts in point records
  const recentAlerts = pointRecords.filter((r) => r.isAlert);
  const currentPoints = userProfile?.points ?? 100;

  // Filter student's assessments
  const mbtiResult = assessments.find((a) => a.testType === 'mbti_personality');
  const talentsResult = assessments.find((a) => a.testType === 'talents_interests');
  const learningResult = assessments.find((a) => a.testType === 'learning_style');

  const handleQuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!peerName.trim() || !userProfile) return;

    setSubmittingQuest(true);
    try {
      await onAddSocialQuest({
        studentUid: userProfile.uid,
        studentName: userProfile.displayName,
        peerName: peerName.trim(),
        peerGrade,
        photoUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80',
        note: questNote.trim() || 'Berinteraksi positif dan berfoto bersama sahabat sekolah.',
        pointsAwarded: 15,
      });

      setShowQuestModal(false);
      setPeerName('');
      setQuestNote('');
    } finally {
      setSubmittingQuest(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drastic Drop Alert Notification Banner (Automatic BK Alert) */}
      {recentAlerts.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-[#FDF0EC] border-2 border-[#F3B8AA] shadow-sm flex items-start gap-3.5 animate-in slide-in-from-top-2">
          <div className="w-10 h-10 rounded-2xl bg-[#E85B43] text-[#FAF7F2] flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-['Outfit'] font-bold text-sm sm:text-base text-[#8F2C1A]">
              Peringatan Perhatian Khusus Bimbingan Konseling (BK)
            </h3>
            <p className="text-xs text-[#6F291C] mt-1 leading-relaxed">
              Catatan Guru BK: "{recentAlerts[0].reason}". Terjadi perubahan akumulasi poin Anda. Silakan hubungi Guru BK Anda atau manfaatkan fitur konsultasi chat untuk mendapatkan pendampingan yang bersahabat.
            </p>
            <button
              onClick={onOpenChatWithGuruBK}
              className="mt-2.5 px-3.5 py-1.5 rounded-xl bg-[#8F2C1A] text-[#FAF7F2] text-xs font-bold hover:bg-[#722113] transition-colors inline-flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Konsultasi dengan Guru BK
            </button>
          </div>
        </div>
      )}

      {/* Top Banner: Class membership & Points */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E4D8CC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EBF3ED] text-[#296D3D] font-bold text-xs uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            Portal Siswa • NISN/NIM: {userProfile?.studentId || '1029384756'}
          </div>
          <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[#382A22]">
            Halo, {userProfile?.displayName}
          </h1>
          <p className="text-xs sm:text-sm text-[#736052] mt-1 max-w-xl leading-relaxed">
            Selamat datang di naungan aman KIRANA. Ikuti asesmen psikologis untuk mengenal diri lebih dalam, jalankan quest sosial berfoto bersama teman, dan pantau poin keaktifan Anda.
          </p>
        </div>

        {/* Room Status & Join Button */}
        <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#E4D5C5] shrink-0 min-w-[280px]">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-xs font-bold text-[#382A22]">Status Ruang BK:</span>
            {currentClass ? (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#E8F3EB] text-[#286337]">
                Tergabung
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FCECE7] text-[#9E3924]">
                Belum Tergabung
              </span>
            )}
          </div>

          {currentClass ? (
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#382A22]">{currentClass.name}</p>
              <p className="text-xs text-[#7A675B]">Guru BK: {currentClass.teacherName}</p>
              <p className="text-[10px] text-[#A69486] font-mono">Kode: {currentClass.code}</p>
            </div>
          ) : (
            <p className="text-xs text-[#7A675B] mb-2">
              Scan QR Code dari Guru BK untuk otomatis bergabung ke dalam kelas.
            </p>
          )}

          <button
            onClick={onOpenQRScanner}
            className="w-full mt-3 py-2.5 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <QrCode className="w-4 h-4" />
            {currentClass ? 'Pindai Ulang / Ganti Kelas' : 'Pindai QR Code Guru BK'}
          </button>
        </div>
      </div>

      {/* Points & Gamifikasi Highlight Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Points Card */}
        <div className="p-5 rounded-3xl bg-[#FAF6F0] border border-[#E6DACD] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#7A675B] uppercase tracking-wider block">
              Akumulasi Poin Siswa
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-['Outfit'] text-3xl font-extrabold text-[#382A22]">
                {currentPoints}
              </span>
              <span className="text-xs font-semibold text-[#86593B]">Poin</span>
            </div>
            <span className="text-[11px] font-bold text-[#2B6F3E] mt-1 block">
              {currentPoints >= 80 ? 'Kategori: Sangat Baik' : currentPoints >= 60 ? 'Kategori: Baik' : 'Kategori: Perlu Pembinaan'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#EFE3D5] text-[#714E36] flex items-center justify-center border border-[#DFCBB9]">
            <Award className="w-7 h-7" />
          </div>
        </div>

        {/* Quest Teman Sebaya Trigger */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-[#FFF5ED] to-[#FDF0E6] border border-[#F2D7C5] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#A24B20] uppercase tracking-wider block">
              Gamifikasi Keaktifan
            </span>
            <h4 className="font-bold text-sm text-[#382A22] mt-0.5">
              Quest Teman Sebaya
            </h4>
            <p className="text-[11px] text-[#785945] mt-1">
              Foto bareng rekan sekolah dapatkan <strong className="text-[#A24B20]">+15 Poin</strong>
            </p>
          </div>
          <button
            onClick={() => setShowQuestModal(true)}
            className="p-3 rounded-2xl bg-[#A24B20] hover:bg-[#863C16] text-[#FAF7F2] shadow-sm transition-all shrink-0"
            title="Klaim Poin Quest Berfoto"
          >
            <Camera className="w-6 h-6" />
          </button>
        </div>

        {/* Konseling Tatap Muka Card */}
        <div className="p-5 rounded-3xl bg-[#FAF6F0] border border-[#E6DACD] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#7A675B] uppercase tracking-wider block">
              Jadwal Sesi Tatap Muka
            </span>
            <h4 className="font-bold text-sm text-[#382A22] mt-0.5">
              {schedules.length > 0 ? schedules[0].sessionDate : 'Belum Ada Jadwal'}
            </h4>
            <p className="text-[11px] text-[#736052] mt-1">
              {schedules.length > 0 ? schedules[0].location : 'Konsultasikan sesi dengan Guru BK'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0EA] text-[#296D3D] flex items-center justify-center border border-[#BEDEC6]">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3 Asesmen Psikologis Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-['Outfit'] text-lg font-bold text-[#382A22]">
              3 Modul Asesmen Psikologis Siswa
            </h3>
            <p className="text-xs text-[#7A675B]">
              Hasil tes tersimpan rapi dan dapat dipantau oleh Guru BK Anda untuk pembinaan masa depan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Asesmen 1: MBTI 100 Soal */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFE3D5] text-[#714E36] flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                {mbtiResult ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F3EB] text-[#286337]">
                    Selesai
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4EDE5] text-[#714E36]">
                    100 Soal
                  </span>
                )}
              </div>

              <h4 className="font-['Outfit'] font-bold text-base text-[#382A22]">
                Tes Kepribadian (MBTI)
              </h4>
              <p className="text-xs text-[#736052] mt-1 leading-relaxed">
                Pemetaan 16 tipe kepribadian (E/I, S/N, T/F, J/P) lengkap dengan kekuatan, area pengembangan, dan gaya interaksi.
              </p>

              {mbtiResult && (
                <div className="mt-3 p-3 rounded-xl bg-[#FAF5EE] border border-[#EAE0D3]">
                  <span className="text-[10px] uppercase font-bold text-[#86593B] block">Hasil Anda:</span>
                  <p className="font-bold text-xs text-[#382A22] mt-0.5">{mbtiResult.scoreSummary}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => onOpenAssessment('mbti_personality')}
              className="w-full mt-4 py-2.5 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-xs transition-colors shadow-xs"
            >
              {mbtiResult ? 'Lihat / Ulangi Tes MBTI' : 'Mulai Tes Kepribadian (100 Soal)'}
            </button>
          </div>

          {/* Asesmen 2: Bakat Minat 50 Soal */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFE3D5] text-[#714E36] flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                {talentsResult ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F3EB] text-[#286337]">
                    Selesai
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4EDE5] text-[#714E36]">
                    50 Soal
                  </span>
                )}
              </div>

              <h4 className="font-['Outfit'] font-bold text-base text-[#382A22]">
                Tes Bakat & Minat (RIASEC)
              </h4>
              <p className="text-xs text-[#736052] mt-1 leading-relaxed">
                Eksplorasi Holland Code untuk rekomendasi jurusan kuliah, prospek karir masa depan, dan kecenderungan keahlian.
              </p>

              {talentsResult && (
                <div className="mt-3 p-3 rounded-xl bg-[#FAF5EE] border border-[#EAE0D3]">
                  <span className="text-[10px] uppercase font-bold text-[#86593B] block">Hasil Anda:</span>
                  <p className="font-bold text-xs text-[#382A22] mt-0.5">{talentsResult.scoreSummary}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => onOpenAssessment('talents_interests')}
              className="w-full mt-4 py-2.5 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-xs transition-colors shadow-xs"
            >
              {talentsResult ? 'Lihat / Ulangi Tes Bakat' : 'Mulai Tes Bakat-Minat (50 Soal)'}
            </button>
          </div>

          {/* Asesmen 3: Cara Belajar 50 Soal */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFE3D5] text-[#714E36] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                {learningResult ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F3EB] text-[#286337]">
                    Selesai
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4EDE5] text-[#714E36]">
                    50 Soal
                  </span>
                )}
              </div>

              <h4 className="font-['Outfit'] font-bold text-base text-[#382A22]">
                Rekomendasi Cara Belajar (VARK)
              </h4>
              <p className="text-xs text-[#736052] mt-1 leading-relaxed">
                Menemukan modalitas belajar terbaik (Visual, Auditori, Baca-Tulis, Kinestetik) dan tips belajar efektif di kelas.
              </p>

              {learningResult && (
                <div className="mt-3 p-3 rounded-xl bg-[#FAF5EE] border border-[#EAE0D3]">
                  <span className="text-[10px] uppercase font-bold text-[#86593B] block">Hasil Anda:</span>
                  <p className="font-bold text-xs text-[#382A22] mt-0.5">{learningResult.scoreSummary}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => onOpenAssessment('learning_style')}
              className="w-full mt-4 py-2.5 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-xs transition-colors shadow-xs"
            >
              {learningResult ? 'Lihat / Ulangi Tes Belajar' : 'Mulai Cara Belajar (50 Soal)'}
            </button>
          </div>
        </div>
      </div>

      {/* Rekapitulasi Jurnal Poin & Riwayat Alasan dari Guru BK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri: Riwayat Poin Transparan */}
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-['Outfit'] font-bold text-lg text-[#382A22]">
                Rekapitulasi Riwayat Poin & Catatan BK
              </h3>
              <p className="text-xs text-[#7A675B]">
                Catatan resmi alasan kenaikan/penurunan poin dari Guru BK.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {pointRecords.length === 0 ? (
              <p className="text-xs text-[#867366] py-6 text-center">
                Belum ada catatan perubahan poin. Poin awal Anda adalah 100.
              </p>
            ) : (
              pointRecords.map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-2xl bg-[#FAF6F1] border border-[#EADFD4] flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        r.amount > 0 ? 'bg-[#E5F1E8] text-[#296D3D]' : 'bg-[#FBECE8] text-[#A63622]'
                      }`}
                    >
                      {r.amount > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#382A22]">{r.reason}</p>
                      <p className="text-[10px] text-[#7A675B] mt-0.5">
                        Oleh: {r.recordedBy} •{' '}
                        {new Date(r.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      {r.isAlert && (
                        <span className="text-[10px] font-bold text-[#A63622] bg-[#FCEBE7] px-2 py-0.5 rounded-md mt-1 inline-block">
                          ⚠️ Peringatan Perhatian BK
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-sm font-black shrink-0 ${
                      r.amount > 0 ? 'text-[#296D3D]' : 'text-[#A63622]'
                    }`}
                  >
                    {r.amount > 0 ? `+${r.amount}` : r.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Kolom Kanan: Galeri Quest Sosial Berfoto */}
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-['Outfit'] font-bold text-lg text-[#382A22]">
                Momen Pertemanan Sehat (Quest Sosial)
              </h3>
              <p className="text-xs text-[#7A675B]">
                Bukti keakraban bersama rekan sebaya / kakak / adik kelas.
              </p>
            </div>
            <button
              onClick={() => setShowQuestModal(true)}
              className="px-3 py-1.5 rounded-xl bg-[#A24B20] text-[#FAF7F2] font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Upload Foto
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {socialQuests.map((sq) => (
              <div
                key={sq.id}
                className="rounded-2xl overflow-hidden bg-[#FAF6F1] border border-[#E8DDCE] shadow-xs flex flex-col justify-between"
              >
                <div className="aspect-[4/3] bg-[#E2D6CA] overflow-hidden">
                  <img
                    src={sq.photoUrl}
                    alt={sq.peerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-center text-[10px] mb-1">
                    <span className="font-bold text-[#A24B20]">+{sq.pointsAwarded} Poin</span>
                    <span className="text-[#867366]">{sq.peerGrade}</span>
                  </div>
                  <p className="text-xs font-bold text-[#382A22] leading-tight">
                    Bersama: {sq.peerName}
                  </p>
                  <p className="text-[11px] text-[#695447] mt-1 line-clamp-2">"{sq.note}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quest Submission Modal */}
      {showQuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231711]/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#FAF7F2] border border-[#E0D2C3] shadow-2xl p-6 sm:p-7 text-[#382A22]">
            <button
              onClick={() => setShowQuestModal(false)}
              className="absolute top-4 right-4 p-2 text-[#7E695D]"
            >
              ✕
            </button>
            <div className="w-12 h-12 rounded-2xl bg-[#FFF2E8] text-[#A24B20] flex items-center justify-center border border-[#F4D1BD] mb-3">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="font-['Outfit'] font-bold text-lg text-[#382A22]">
              Klaim Poin Quest Berfoto Bersama Teman
            </h4>
            <p className="text-xs text-[#7A675B] mt-1 mb-4 leading-relaxed">
              Jalin silaturahmi positif dengan berfoto bersama teman sebaya, kakak kelas, atau adik kelas dan dapatkan bonus <strong>+15 Poin Keaktifan</strong>!
            </p>

            <form onSubmit={handleQuestSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#4F3C31] mb-1">
                  Nama Teman yang Difoto:
                </label>
                <input
                  type="text"
                  value={peerName}
                  onChange={(e) => setPeerName(e.target.value)}
                  placeholder="Contoh: Farhan & Rina (Siswa X MIPA 1)"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C9BB] text-xs text-[#382A22] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4F3C31] mb-1">
                  Hubungan / Jenjang:
                </label>
                <select
                  value={peerGrade}
                  onChange={(e) => setPeerGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C9BB] text-xs text-[#382A22] focus:outline-hidden"
                >
                  <option value="Teman Sebaya (Satu Kelas)">Teman Sebaya (Satu Kelas)</option>
                  <option value="Kakak Kelas (Tingkat Atas)">Kakak Kelas (Tingkat Atas)</option>
                  <option value="Adik Kelas (Tingkat Bawah)">Adik Kelas (Tingkat Bawah)</option>
                  <option value="Rekan Ekstrakurikuler/OSIS">Rekan Ekstrakurikuler/OSIS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4F3C31] mb-1">
                  Catatan Interaksi Positif:
                </label>
                <textarea
                  rows={2}
                  value={questNote}
                  onChange={(e) => setQuestNote(e.target.value)}
                  placeholder="Contoh: Belajar bersama persiapan asesmen gaya belajar..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8C9BB] text-xs text-[#382A22] focus:outline-hidden"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FAF0E6] border border-[#ECD1BE] text-[11px] text-[#864C28] flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-[#A24B20]" />
                <span>Simulasi foto kamera akan otomatis dilampirkan & diverifikasi sistem (+15 Poin).</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuestModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#EEE6DC] text-[#554032] font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingQuest}
                  className="flex-1 py-2.5 rounded-xl bg-[#A24B20] text-[#FAF7F2] font-bold text-xs shadow-md transition-all disabled:opacity-40"
                >
                  {submittingQuest ? 'Memproses...' : 'Klaim +15 Poin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
