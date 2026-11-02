import React, { useState } from 'react';
import {
  Search,
  Filter,
  Award,
  BookOpen,
  DollarSign,
  MessageCircle,
  Phone,
  Video,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { UserProfile, PortfolioItem } from '../types';

interface CariKonselorDirectoryProps {
  counselors: UserProfile[];
  onOpenChat: (counselor: UserProfile) => void;
  onOpenVoiceCall: (counselor: UserProfile) => void;
  onOpenVideoCall: (counselor: UserProfile) => void;
  onBookSchedule: (counselor: UserProfile) => void;
}

export const CariKonselorDirectory: React.FC<CariKonselorDirectoryProps> = ({
  counselors,
  onOpenChat,
  onOpenVoiceCall,
  onOpenVideoCall,
  onBookSchedule,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Semua');
  const [detailModalCounselor, setDetailModalCounselor] = useState<UserProfile | null>(null);

  // Extract distinct specialties
  const allSpecialties = Array.from(
    new Set(
      counselors.flatMap((c) => c.counselingSpecialties || ['Konseling Umum', 'Pengembangan Diri'])
    )
  );

  const filteredCounselors = counselors.filter((c) => {
    const matchesSearch =
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.counselorBio && c.counselorBio.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty =
      selectedSpecialty === 'Semua' ||
      (c.counselingSpecialties && c.counselingSpecialties.includes(selectedSpecialty));
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#EFE5DB] to-[#F7EFE8] border border-[#E0D2C4] shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E2D0BE] text-[#6E4930] font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Direktori Konseling Profesional Terbuka
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[#382A22]">
            Temukan Konselor Profesional & Naungan Aman Anda
          </h2>
          <p className="text-sm text-[#6F5B4D] mt-2 leading-relaxed">
            Jelajahi profil konselor independen bersertifikat serta Guru BK berlisensi peran ganda. Konsultasikan kecemasan, karir, motivasi studi, dan kesehatan mental Anda dengan aman, rahasia, dan transparan.
          </p>
        </div>

        {/* Search & Specialty Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C7B70] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama konselor, pendekatan, atau keahlian..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#D8C9BB] text-sm text-[#382A22] placeholder:text-[#99897D] focus:outline-hidden focus:ring-2 focus:ring-[#834E2F]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-[#7A6353] shrink-0" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#D8C9BB] text-xs font-semibold text-[#48362B] focus:outline-hidden focus:ring-2 focus:ring-[#834E2F]"
            >
              <option value="Semua">Semua Spesialisasi</option>
              {allSpecialties.map((s, idx) => (
                <option key={idx} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Counselor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCounselors.map((counselor) => {
          const isDual = counselor.role === 'guru_bk' && counselor.isDualRoleCounselor;

          return (
            <div
              key={counselor.uid}
              className="rounded-3xl bg-[#FFFFFF] border border-[#E5DACD] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6">
                {/* Top Profile Card Header */}
                <div className="flex items-start gap-4">
                  <img
                    src={counselor.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'}
                    alt={counselor.displayName}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#D9C4B3]/50 shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4EDE5] text-[#714E36] border border-[#E0D2C3]">
                        {isDual ? 'Guru BK + Konselor Publik' : 'Konselor Profesional'}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#E8F3EB] text-[#286337]">
                        Terverifikasi
                      </span>
                    </div>

                    <h3 className="font-['Outfit'] font-bold text-base text-[#382A22] mt-1 leading-snug">
                      {counselor.displayName}
                    </h3>
                    {counselor.schoolName && (
                      <p className="text-[11px] text-[#7E6A5C] truncate">{counselor.schoolName}</p>
                    )}
                  </div>
                </div>

                {/* Bio & Approach snippet */}
                <p className="text-xs text-[#5D4B3E] mt-4 line-clamp-3 leading-relaxed">
                  {counselor.counselorBio ||
                    'Konselor berdedikasi dengan pendekatan humanistik dan solutif untuk membantu klien menemukan ketenangan batin serta arah hidup yang bermakna.'}
                </p>

                {/* Specialties Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(counselor.counselingSpecialties || ['Konseling Remaja', 'Mindfulness']).map((spec, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#FAF4ED] text-[#7A5A43] border border-[#E9DDD0]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Red Card: Tarif Jasa Layanan */}
                <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-[#FDF0EB] to-[#FFF5F0] border border-[#F2D0C2]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#A24218] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#D44A18]"></span>
                      Red Card Tarif Jasa
                    </span>
                    <span className="text-xs font-black text-[#8B3512]">
                      {counselor.redCardRate || 'Rp 150.000 / Sesi'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#86513A] mt-1 truncate">
                    {counselor.redCardDetails || 'Sesi privat 60 menit via In-App Video Call / Chat Interaktif'}
                  </p>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="p-4 bg-[#FAF7F2] border-t border-[#EAE0D4] space-y-2">
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => onOpenChat(counselor)}
                    className="py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F3EBE1] border border-[#DDD0C2] text-xs font-bold text-[#554032] flex items-center justify-center gap-1 transition-colors"
                    title="Mulai Chat Teks"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#86593B]" />
                    <span>Chat</span>
                  </button>
                  <button
                    onClick={() => onOpenVoiceCall(counselor)}
                    className="py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F3EBE1] border border-[#DDD0C2] text-xs font-bold text-[#554032] flex items-center justify-center gap-1 transition-colors"
                    title="Panggilan Suara"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#86593B]" />
                    <span>Suara</span>
                  </button>
                  <button
                    onClick={() => onOpenVideoCall(counselor)}
                    className="py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F3EBE1] border border-[#DDD0C2] text-xs font-bold text-[#554032] flex items-center justify-center gap-1 transition-colors"
                    title="Panggilan Video"
                  >
                    <Video className="w-3.5 h-3.5 text-[#86593B]" />
                    <span>Video</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setDetailModalCounselor(counselor)}
                    className="flex-1 py-2 rounded-xl bg-[#EDE4D9] hover:bg-[#E3D9CC] text-[#554032] text-xs font-bold transition-colors"
                  >
                    Lihat Portofolio
                  </button>
                  <button
                    onClick={() => onBookSchedule(counselor)}
                    className="flex-1 py-2 rounded-xl bg-[#5E422F] hover:bg-[#483222] text-[#FAF7F2] text-xs font-bold shadow-xs transition-colors"
                  >
                    Jadwalkan Temu
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Counselor Detail & Portfolio Modal (with Privacy Protection) */}
      {detailModalCounselor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231711]/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#FAF7F2] border border-[#E0D2C3] shadow-2xl p-6 sm:p-8 text-[#382A22] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailModalCounselor(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#7E695D] hover:bg-[#EFE8DF] hover:text-[#382A22] transition-colors"
              aria-label="Tutup Detail"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={detailModalCounselor.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'}
                alt={detailModalCounselor.displayName}
                className="w-18 h-18 rounded-2xl object-cover ring-2 ring-[#86593B]/30"
              />
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4EDE5] text-[#714E36] border border-[#E0D2C3]">
                  Profil Publik Konselor Terdaftar
                </span>
                <h3 className="font-['Outfit'] font-bold text-xl text-[#382A22] mt-1">
                  {detailModalCounselor.displayName}
                </h3>
                <p className="text-xs text-[#7A675B]">{detailModalCounselor.schoolName || 'Konselor Independen KIRANA'}</p>
              </div>
            </div>

            {/* Privacy Protection Banner */}
            <div className="p-3.5 rounded-2xl bg-[#EAF2EC] border border-[#BEDEC6] text-[#245D35] text-xs flex items-center gap-2.5 mb-5">
              <ShieldCheck className="w-5 h-5 shrink-0 text-[#2E7A45]" />
              <span>
                <strong>Privasi Data Konselor Terlindungi:</strong> Informasi pribadi sensitif (Nomor HP pribadi, NIK, alamat rumah) otomatis disembunyikan oleh sistem KIRANA untuk menjaga batas profesional.
              </span>
            </div>

            {/* Approach Description */}
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#735A49] mb-1.5">
                Pendekatan & Gaya Konseling:
              </h4>
              <p className="text-sm text-[#4E3D31] leading-relaxed bg-[#FFFFFF] p-4 rounded-2xl border border-[#E4D7CA]">
                {detailModalCounselor.counselorBio ||
                  'Pendekatan konseling berfokus pada empati mendalam, rasa aman tanpa penghakiman, dan pemecahan masalah kolaboratif untuk membantu individu menemukan potensi terbaiknya.'}
              </p>
            </div>

            {/* Red Card Details */}
            <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-[#FDF0EB] to-[#FFF5F0] border border-[#F2D0C2]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A24218]">
                  Informasi Tarif Jasa (Red Card):
                </span>
                <span className="text-sm font-extrabold text-[#8B3512]">
                  {detailModalCounselor.redCardRate || 'Rp 150.000 / Sesi'}
                </span>
              </div>
              <p className="text-xs text-[#7A4B36]">
                {detailModalCounselor.redCardDetails || 'Termasuk sesi bimbingan 1-on-1 berdurasi 60-75 menit, asesmen pendukung, dan evaluasi berkala.'}
              </p>
            </div>

            {/* Portfolio Documents / Certificates */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#735A49] mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#A25021]" />
                Portofolio Sertifikat & Artikel Ilmiah:
              </h4>
              <div className="space-y-2">
                {(detailModalCounselor.portfolioItems && detailModalCounselor.portfolioItems.length > 0
                  ? detailModalCounselor.portfolioItems
                  : [
                      {
                        id: 'df_1',
                        title: 'Sertifikat Kompetensi Konseling Psikologis dan Kesehatan Mental',
                        type: 'sertifikat',
                        issuerOrPublisher: 'Asosiasi Bimbingan Konseling Indonesia',
                        year: '2023',
                      },
                      {
                        id: 'df_2',
                        title: 'Artikel: Transformasi Digital dalam Pelayanan Bimbingan Konseling Ramah Remaja',
                        type: 'artikel',
                        issuerOrPublisher: 'Jurnal Edukasi Karakter',
                        year: '2024',
                      },
                    ]
                ).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2D5C7] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F5ECE3] text-[#714E36] flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#382A22]">{item.title}</p>
                        <p className="text-[11px] text-[#78665A]">
                          {item.issuerOrPublisher} • Tahun {item.year}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#EDE4D9] text-[#695140]">
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDetailModalCounselor(null);
                  onOpenChat(detailModalCounselor);
                }}
                className="flex-1 py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#EFE8DF] border border-[#D5C6B7] text-[#4F3B2E] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-[#86593B]" />
                Mulai Konsultasi Chat
              </button>
              <button
                onClick={() => {
                  setDetailModalCounselor(null);
                  onBookSchedule(detailModalCounselor);
                }}
                className="flex-1 py-3 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                Jadwalkan Sesi Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
