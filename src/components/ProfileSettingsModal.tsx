import React, { useState } from 'react';
import {
  User,
  Camera,
  Trash2,
  Save,
  X,
  AlertTriangle,
  Award,
  BookOpen,
  Plus,
  Shield,
  CheckCircle,
} from 'lucide-react';
import { useAuth, AVATAR_PRESETS, DEFAULT_AVATAR } from '../context/AuthContext';
import { PortfolioItem } from '../types';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateUserProfile, deleteUserAccount } = useAuth();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || DEFAULT_AVATAR);
  const [studentId, setStudentId] = useState(userProfile?.studentId || '');
  const [schoolName, setSchoolName] = useState(userProfile?.schoolName || '');
  const [counselorBio, setCounselorBio] = useState(userProfile?.counselorBio || '');
  const [redCardRate, setRedCardRate] = useState(userProfile?.redCardRate || '');

  // Delete account confirmation flow
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Custom image file upload simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen || !userProfile) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      displayName,
      avatarUrl,
      studentId: userProfile.role === 'siswa' ? studentId : undefined,
      schoolName,
      counselorBio,
      redCardRate,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteUserAccount();
      onClose();
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211711]/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#FAF7F2] border border-[#DFCFC1] shadow-2xl p-6 sm:p-8 text-[#382A22] max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#7E695D] hover:bg-[#EFE8DF] transition-colors"
          aria-label="Tutup Pengaturan Profil"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-['Outfit'] text-xl font-bold text-[#382A22] mb-1">
          Pengaturan Akun & Profil
        </h3>
        <p className="text-xs text-[#7A675B] mb-6">
          Akun Anda terhubung secara persisten dengan email <strong>{userProfile.email}</strong>.
        </p>

        {saveSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-[#EAF2EC] border border-[#BEDEC6] text-[#245D35] text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Profil berhasil disimpan secara permanen!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Foto Profil Selection & Upload */}
          <div>
            <label className="block text-xs font-bold text-[#4F3C31] mb-2">
              Foto Profil Pengguna:
            </label>
            <div className="flex items-center gap-4 mb-3">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#7B543B]/40 shadow-xs"
              />
              <div className="flex-1">
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#D5C6B7] hover:bg-[#F2ECE5] text-xs font-bold text-[#554032] cursor-pointer transition-colors shadow-xs">
                  <Camera className="w-4 h-4 text-[#86593B]" />
                  <span>Unggah Foto dari Perangkat</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-[#7A675B] mt-1">
                  Format JPG, PNG, atau WEBP. Avatar bawaan akan digunakan jika tidak diunggah.
                </p>
              </div>
            </div>

            {/* Avatar Presets Selection */}
            <div>
              <span className="text-[11px] font-semibold text-[#7A675B] block mb-1.5">
                Atau pilih ilustrasi avatar ramah KIRANA:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {AVATAR_PRESETS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-10 h-10 rounded-xl overflow-hidden shrink-0 border-2 transition-transform ${
                      avatarUrl === url
                        ? 'border-[#86593B] scale-105 shadow-xs'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-xs font-bold text-[#4F3C31] mb-1">
              Nama Lengkap beserta Gelar:
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C9BB] bg-[#FFFFFF] text-xs sm:text-sm text-[#382A22] focus:outline-hidden focus:ring-2 focus:ring-[#834E2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4F3C31] mb-1">
              Alamat Email (Permanen):
            </label>
            <input
              type="email"
              disabled
              value={userProfile.email}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3D8CC] bg-[#EFE8DF] text-xs text-[#7A695D] cursor-not-allowed font-mono"
            />
            <p className="text-[10px] text-[#867366] mt-0.5">
              Akun Anda terkunci aman ke email ini. Anda tidak perlu menginput ulang data diri saat berganti perangkat.
            </p>
          </div>

          {userProfile.role === 'siswa' && (
            <div>
              <label className="block text-xs font-bold text-[#4F3C31] mb-1">
                Nomor Induk Siswa (NISN/NIM):
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Contoh: 1029384756"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C9BB] bg-[#FFFFFF] text-xs text-[#382A22] focus:outline-hidden"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#4F3C31] mb-1">
              Nama Asal Sekolah / Instansi:
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Contoh: SMA Negeri 1 Edukasi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C9BB] bg-[#FFFFFF] text-xs text-[#382A22] focus:outline-hidden"
            />
          </div>

          {(userProfile.role === 'konselor' || (userProfile.role === 'guru_bk' && userProfile.isDualRoleCounselor)) && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#4F3C31] mb-1">
                  Deskripsi Pendekatan Konseling (Bio Publik):
                </label>
                <textarea
                  rows={3}
                  value={counselorBio}
                  onChange={(e) => setCounselorBio(e.target.value)}
                  placeholder="Gaya bimbingan konseling dan suasana naungan aman..."
                  className="w-full p-3 rounded-xl border border-[#D8C9BB] bg-[#FFFFFF] text-xs text-[#382A22] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4F3C31] mb-1">
                  Tarif Jasa Red Card:
                </label>
                <input
                  type="text"
                  value={redCardRate}
                  onChange={(e) => setRedCardRate(e.target.value)}
                  placeholder="Contoh: Rp 150.000 / Sesi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C9BB] bg-[#FFFFFF] text-xs text-[#382A22] focus:outline-hidden"
                />
              </div>
            </>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-[#EFE8DF] hover:bg-[#E4DAD0] text-[#554032] font-semibold text-xs transition-colors"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Simpan Profil
            </button>
          </div>
        </form>

        {/* Section Penghapusan & Pendaftaran Ulang Akun */}
        <div className="mt-8 pt-6 border-t border-[#E8DDD0]">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#9E3924] mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Penghapusan & Pendaftaran Ulang Akun
          </h4>
          <p className="text-xs text-[#7A675B] leading-relaxed mb-3">
            Pengguna dapat menghapus akun yang telah dibuat sewaktu-waktu. Sistem kami mengizinkan Anda mendaftar ulang kapan saja menggunakan nama atau email yang sama tanpa adanya batasan atau pemblokiran.
          </p>

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2.5 rounded-xl border border-[#EAA597] bg-[#FDF0ED] hover:bg-[#FBE4DF] text-[#A23824] text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Akun Saya Permanen
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-[#FBEBE8] border border-[#F1B3A6] space-y-3">
              <p className="text-xs font-bold text-[#862917]">
                Konfirmasi: Yakin ingin menghapus akun? Anda dapat mendaftar ulang sewaktu-waktu dengan email yang sama.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-xl bg-[#EFE6DC] text-xs font-semibold text-[#554032]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="px-4 py-1.5 rounded-xl bg-[#9E2B1B] text-[#FAF7F2] text-xs font-bold hover:bg-[#832214] transition-colors"
                >
                  {deleteLoading ? 'Menghapus...' : 'Ya, Hapus Akun Sekarang'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
