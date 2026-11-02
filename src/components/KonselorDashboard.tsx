import React, { useState } from 'react';
import {
  Award,
  DollarSign,
  Calendar,
  BookOpen,
  Plus,
  Trash2,
  Save,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Video,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PortfolioItem, CounselingSchedule } from '../types';

interface KonselorDashboardProps {
  schedules: CounselingSchedule[];
  onOpenMeeting: () => void;
}

export const KonselorDashboard: React.FC<KonselorDashboardProps> = ({
  schedules,
  onOpenMeeting,
}) => {
  const { userProfile, updateUserProfile } = useAuth();

  const [bioInput, setBioInput] = useState(
    userProfile?.counselorBio ||
      'Pendekatan konseling berakar pada empati mendalam, kerahasiaan penuh (naungan aman), serta teknik kognitif-perilaku (CBT) dan mindfulness untuk membantu Anda mengurai benang kusut kecemasan dan tujuan hidup.'
  );
  const [rateInput, setRateInput] = useState(userProfile?.redCardRate || 'Rp 175.000 / Sesi (60 Menit)');
  const [rateDetailsInput, setRateDetailsInput] = useState(
    userProfile?.redCardDetails || 'Sesi 1-on-1 In-App Video Call / Chat Interaktif + Lembar Rencana Aksi Pribadi'
  );
  const [specialtiesInput, setSpecialtiesInput] = useState(
    (userProfile?.counselingSpecialties || ['Kecemasan & Overthinking', 'Manajemen Stres', 'Perencanaan Karir']).join(', ')
  );

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(
    userProfile?.portfolioItems || [
      {
        id: 'port_1',
        title: 'Sertifikasi Psikolog Klinis & Konselor Remaja (HIMPSI)',
        type: 'sertifikat',
        issuerOrPublisher: 'Himpunan Psikologi Indonesia',
        year: '2023',
      },
      {
        id: 'port_2',
        title: 'Jurnal: Peran Safe Space (Naungan Aman) dalam Reduksi Burnout Mahasiswa & Pekerja Muda',
        type: 'jurnal',
        issuerOrPublisher: 'Jurnal Psikologi Terapan Indonesia',
        year: '2024',
      },
    ]
  );

  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'sertifikat' | 'jurnal' | 'artikel' | 'penghargaan'>('sertifikat');
  const [newIssuer, setNewIssuer] = useState('');
  const [newYear, setNewYear] = useState('2025');
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = async () => {
    const specs = specialtiesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await updateUserProfile({
      counselorBio: bioInput,
      redCardRate: rateInput,
      redCardDetails: rateDetailsInput,
      counselingSpecialties: specs,
      portfolioItems: portfolio,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddPortfolio = () => {
    if (!newTitle.trim()) return;
    const item: PortfolioItem = {
      id: `p_${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      issuerOrPublisher: newIssuer.trim() || 'Lembaga / Penerbit Resmi',
      year: newYear.trim() || '2025',
    };
    setPortfolio([...portfolio, item]);
    setNewTitle('');
    setNewIssuer('');
    setShowAddPortfolio(false);
  };

  const handleDeletePortfolio = (id: string) => {
    setPortfolio(portfolio.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E4D8CC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F5EBE6] text-[#7E3B21] font-bold text-xs uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            Portal Konselor Profesional Independen
          </div>
          <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[#382A22]">
            Selamat Datang, {userProfile?.displayName}
          </h1>
          <p className="text-xs sm:text-sm text-[#736052] mt-1 max-w-xl leading-relaxed">
            Kelola profil publik Anda di direktori KIRANA, tetapkan tarif jasa Red Card secara transparan, unggah portofolio sertifikat/artikel ilmiah, dan penuhi konsultasi klien.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onOpenMeeting}
            className="px-4 py-2.5 rounded-xl bg-[#7A4B2E] hover:bg-[#633B23] text-[#FAF7F2] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <Video className="w-4 h-4" />
            Mulai Konferensi Rapat
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-[#EAF2EC] border border-[#B9DEC1] text-[#235832] text-xs font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Profil publik, portofolio, dan tarif Red Card Anda berhasil diperbarui di direktori!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Pengaturan Profil Publik & Red Card (2 Kolom) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Bio & Pendekatan */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs space-y-4">
            <h3 className="font-['Outfit'] font-bold text-lg text-[#382A22]">
              Deskripsi Gaya & Pendekatan Konseling
            </h3>
            <p className="text-xs text-[#7A675B]">
              Jelaskan kebiasaan bimbingan Anda, metode ilmiah yang digunakan, dan suasana naungan aman yang Anda tawarkan kepada klien.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#4F3C31] mb-1.5">
                Bio Pendekatan Konseling (Tampil di Direktori):
              </label>
              <textarea
                rows={4}
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-[#D8C9BB] text-xs sm:text-sm text-[#382A22] focus:outline-hidden focus:ring-2 focus:ring-[#834E2F] leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4F3C31] mb-1.5">
                Keahlian & Spesialisasi (Pisahkan dengan koma):
              </label>
              <input
                type="text"
                value={specialtiesInput}
                onChange={(e) => setSpecialtiesInput(e.target.value)}
                placeholder="Contoh: Kecemasan, Karir, Hubungan Asmara, Burnout"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C9BB] text-xs text-[#382A22] focus:outline-hidden"
              />
            </div>

            {/* Red Card: Tarif Jasa Layanan */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FDF0EB] to-[#FFF5F0] border border-[#F2D0C2] space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D44A18]"></span>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#A24218]">
                  Pengaturan Kartu Tarif Jasa (Red Card):
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#7E4631] mb-1">
                    Tarif Layanan Sesi:
                  </label>
                  <input
                    type="text"
                    value={rateInput}
                    onChange={(e) => setRateInput(e.target.value)}
                    placeholder="Contoh: Rp 175.000 / Sesi"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8BFAD] bg-[#FFFFFF] text-xs font-bold text-[#8B3512] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#7E4631] mb-1">
                    Rincian Paket & Durasi:
                  </label>
                  <input
                    type="text"
                    value={rateDetailsInput}
                    onChange={(e) => setRateDetailsInput(e.target.value)}
                    placeholder="Contoh: Sesi 60 menit via In-App Video Call"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8BFAD] bg-[#FFFFFF] text-xs text-[#523223] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              className="py-3 px-6 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan Profil & Red Card
            </button>
          </div>

          {/* Card 2: Portofolio Lanjutan (Sertifikat / Jurnal / Artikel) */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-['Outfit'] font-bold text-lg text-[#382A22]">
                  Portofolio Lanjutan (Unjuk Kemampuan)
                </h3>
                <p className="text-xs text-[#7A675B]">
                  Unggah sertifikat pendukung, jurnal penelitian, atau artikel ilmiah untuk membangun kepercayaan klien.
                </p>
              </div>
              <button
                onClick={() => setShowAddPortfolio(true)}
                className="px-3 py-1.5 rounded-xl bg-[#EFE3D5] text-[#714E36] font-bold text-xs flex items-center gap-1 hover:bg-[#E5D4C3] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Berkas
              </button>
            </div>

            {/* List Berkas Portofolio */}
            <div className="space-y-2.5">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-[#FAF6F1] border border-[#E5DACD] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#EFE3D5] text-[#714E36] flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#382A22]">{item.title}</p>
                      <p className="text-[11px] text-[#78665A]">
                        {item.issuerOrPublisher} • Tahun {item.year} • Tipe:{' '}
                        <span className="uppercase font-semibold">{item.type}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePortfolio(item.id)}
                    className="p-2 text-[#A23824] hover:bg-[#FBEBE8] rounded-xl transition-colors"
                    title="Hapus berkas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Modal Tambah Portofolio */}
            {showAddPortfolio && (
              <div className="p-4 rounded-2xl bg-[#F6EFE8] border border-[#DECFC1] space-y-3">
                <h4 className="text-xs font-bold text-[#382A22]">Input Berkas Portofolio Baru</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Judul Sertifikat / Jurnal / Artikel"
                    className="px-3 py-2 rounded-xl border border-[#D8C9BB] bg-[#FFFFFF] text-xs text-[#382A22]"
                  />
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-[#D8C9BB] bg-[#FFFFFF] text-xs text-[#382A22]"
                  >
                    <option value="sertifikat">Sertifikat Penghargaan / Lisensi</option>
                    <option value="jurnal">Jurnal Ilmiah</option>
                    <option value="artikel">Artikel Reflektif / Populer</option>
                    <option value="penghargaan">Penghargaan Profesi</option>
                  </select>
                  <input
                    type="text"
                    value={newIssuer}
                    onChange={(e) => setNewIssuer(e.target.value)}
                    placeholder="Lembaga Penerbit / Jurnal"
                    className="px-3 py-2 rounded-xl border border-[#D8C9BB] bg-[#FFFFFF] text-xs text-[#382A22]"
                  />
                  <input
                    type="text"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="Tahun Penerbitan (misal 2025)"
                    className="px-3 py-2 rounded-xl border border-[#D8C9BB] bg-[#FFFFFF] text-xs text-[#382A22]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddPortfolio(false)}
                    className="px-3 py-1.5 rounded-xl bg-[#E8DFD5] text-xs font-semibold text-[#554032]"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddPortfolio}
                    className="px-4 py-1.5 rounded-xl bg-[#593E2B] text-[#FAF7F2] text-xs font-bold"
                  >
                    Tambahkan ke Daftar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Jadwal Konsultasi Klien Masuk & Proteksi Privasi */}
        <div className="space-y-6">
          {/* Privacy Guarantee Box */}
          <div className="p-5 rounded-3xl bg-[#EBF3ED] border border-[#BEDEC6] text-[#245D35] space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2E7A45]" />
              <h4 className="font-bold text-xs uppercase tracking-wider">
                Batasan Privasi Terjaga
              </h4>
            </div>
            <p className="text-xs leading-relaxed">
              KIRANA secara ketat menyembunyikan nomor ponsel pribadi, email pribadi, dan data sensitif konselor dari hadapan publik. Klien hanya dapat berinteraksi melalui kanal komunikasi terenkripsi di dalam aplikasi.
            </p>
          </div>

          {/* Incoming Bookings / Schedules */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs space-y-4">
            <h3 className="font-['Outfit'] font-bold text-base text-[#382A22]">
              Jadwal Sesi Konseling Masuk ({schedules.length})
            </h3>

            <div className="space-y-3">
              {schedules.map((sc) => (
                <div
                  key={sc.id}
                  className="p-3.5 rounded-2xl bg-[#FAF6F1] border border-[#EADFD4] space-y-1.5"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#382A22]">{sc.clientName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F2E8DC] text-[#714E36]">
                      {sc.sessionDate}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#864F28]">{sc.topic}</p>
                  <p className="text-[11px] text-[#7A675B]">🕒 {sc.sessionTime} • 📍 {sc.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
