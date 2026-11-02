import React, { useState } from 'react';
import {
  HeartHandshake,
  User,
  Mail,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Sparkles,
  RefreshCw,
  X,
  ArrowRight,
} from 'lucide-react';
import { useAuth, DEFAULT_AVATAR } from '../context/AuthContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    signInWithGoogle,
    signInWithEmailDemo,
    completeRegistration,
    isNewUserRegistration,
    userProfile,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('guru_bk');
  const [inputEmail, setInputEmail] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputStudentId, setInputStudentId] = useState('');
  const [inputSchool, setInputSchool] = useState('SMA Negeri 1 Edukasi');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen && !isNewUserRegistration) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signInWithGoogle();
      if (!isNewUserRegistration) {
        onClose();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal masuk dengan Google. Anda dapat menggunakan opsi Akun Cepat di bawah.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleDemo = async (role: UserRole) => {
    setLoading(true);
    setErrorMsg('');
    try {
      let email = '';
      let name = '';
      let studentId: string | undefined = undefined;

      switch (role) {
        case 'guru_bk':
          email = 'drs.bambang.bk@sekolah.sch.id';
          name = 'Drs. Bambang Sudiro, M.Pd.';
          break;
        case 'siswa':
          email = 'ahmad.raihan.siswa@sekolah.sch.id';
          name = 'Ahmad Raihan Pratama';
          studentId = '1029384756';
          break;
        case 'konselor':
          email = 'dra.anastasia.psi@kirana.id';
          name = 'Dra. Anastasia Wardani, M.Psi., Psikolog';
          break;
        case 'klien':
          email = 'maya.anggraini@gmail.com';
          name = 'Maya Anggraini, S.T.';
          break;
      }

      await signInWithEmailDemo(email, role, name, studentId);
      onClose();
    } catch (err) {
      setErrorMsg('Gagal mengalihkan akun demo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim() || !inputName.trim()) {
      setErrorMsg('Harap lengkapi nama dan email Anda.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await signInWithEmailDemo(
        inputEmail.trim(),
        selectedRole,
        inputName.trim(),
        selectedRole === 'siswa' ? inputStudentId.trim() || '1029384756' : undefined
      );
      onClose();
    } catch (err) {
      setErrorMsg('Gagal memproses akun.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishNewRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) {
      setErrorMsg('Nama lengkap dan gelar wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      await completeRegistration({
        role: selectedRole,
        displayName: inputName.trim(),
        studentId: selectedRole === 'siswa' ? inputStudentId.trim() || '1029384756' : undefined,
        schoolName: inputSchool.trim(),
      });
      onClose();
    } catch (err) {
      setErrorMsg('Gagal menyelesaikan registrasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231711]/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FAF7F2] border border-[#E0D2C3] shadow-2xl p-6 sm:p-8 text-[#382A22] my-auto">
        {!isNewUserRegistration && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-[#7E695D] hover:bg-[#EFE8DF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#735138] to-[#422E22] mx-auto flex items-center justify-center text-[#FAF7F2] shadow-md shadow-[#422E22]/20 mb-3 ring-2 ring-[#C5A880]/30">
            <HeartHandshake className="w-8 h-8 text-[#F5E8D8]" />
          </div>
          <h2 className="font-['Outfit'] text-2xl font-bold text-[#382A22]">
            {isNewUserRegistration ? 'Lengkapi Profil Akun KIRANA' : 'Masuk ke Platform KIRANA'}
          </h2>
          <p className="text-xs text-[#7A675B] mt-1 max-w-sm mx-auto leading-relaxed">
            Konseling Interaktif, Rekapitulasi, Asesmen & Naungan Aman
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#FDF0ED] border border-[#F5C7BD] text-[#A23722] text-xs">
            {errorMsg}
          </div>
        )}

        {/* Flow 1: New User Registration (After Google Sign In or First Sign Up) */}
        {isNewUserRegistration ? (
          <form onSubmit={handleFinishNewRegistration} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#4F3C31] mb-1.5">
                Pilih Peran Utama Pengguna:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { role: 'guru_bk' as const, label: 'Guru BK (Sekolah)', desc: 'Manajemen kelas & otoritas poin' },
                  { role: 'siswa' as const, label: 'Siswa', desc: 'Scan QR kelas & asesmen' },
                  { role: 'konselor' as const, label: 'Konselor Independen', desc: 'Direktori publik & Red Card' },
                  { role: 'klien' as const, label: 'Klien Umum', desc: 'Mental Health & cari konselor' },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setSelectedRole(item.role)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedRole === item.role
                        ? 'bg-[#553C2B] text-[#FAF7F2] border-[#553C2B] shadow-xs'
                        : 'bg-[#FFFFFF] border-[#E3D6C9] text-[#3D2C20] hover:bg-[#FAF6F1]'
                    }`}
                  >
                    <div className="font-bold text-xs">{item.label}</div>
                    <div className={`text-[10px] mt-0.5 ${selectedRole === item.role ? 'text-[#DECFC3]' : 'text-[#7D6B5F]'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4F3C31] mb-1">
                Nama Lengkap beserta Gelar:
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Contoh: Dra. Anastasia Wardani, M.Psi., Psikolog"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C9BB] text-xs sm:text-sm text-[#382A22] focus:outline-hidden"
              />
            </div>

            {selectedRole === 'siswa' && (
              <div>
                <label className="block text-xs font-bold text-[#4F3C31] mb-1">
                  Nomor Induk Siswa (NISN/NIM):
                </label>
                <input
                  type="text"
                  value={inputStudentId}
                  onChange={(e) => setInputStudentId(e.target.value)}
                  placeholder="Contoh: 1029384756"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C9BB] text-xs sm:text-sm text-[#382A22] focus:outline-hidden"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#4F3C31] mb-1">
                Asal Sekolah / Lembaga:
              </label>
              <input
                type="text"
                value={inputSchool}
                onChange={(e) => setInputSchool(e.target.value)}
                placeholder="Contoh: SMA Negeri 1 Edukasi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C9BB] text-xs sm:text-sm text-[#382A22] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {loading ? 'Menyimpan...' : 'Selesaikan Pendaftaran & Masuk'}
            </button>
          </form>
        ) : (
          /* Flow 2: Standard Login & Quick Persona Switcher */
          <div className="space-y-5">
            {/* Google Firebase Login Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#F7F2EB] border border-[#D8C8B8] text-xs sm:text-sm font-bold text-[#382A22] shadow-xs flex items-center justify-center gap-3 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Lanjutkan dengan Akun Google</span>
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-[#E2D5C7]"></div>
              <span className="text-[11px] font-bold text-[#867366] uppercase tracking-wider">
                Atau Pilih Peran Cepat (Pengujian)
              </span>
              <div className="flex-1 h-px bg-[#E2D5C7]"></div>
            </div>

            {/* Quick 4 Roles Selector Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRoleDemo('guru_bk')}
                className="p-3 rounded-2xl bg-[#FFFFFF] hover:bg-[#FAF4ED] border border-[#DECFC1] text-left transition-all group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-[#382A22]">Guru BK</span>
                  <span className="text-[10px] font-semibold text-[#8F522C] bg-[#F2E8DC] px-1.5 py-0.5 rounded">Sekolah</span>
                </div>
                <p className="text-[11px] text-[#78665A] line-clamp-1">Drs. Bambang Sudiro, M.Pd.</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleDemo('siswa')}
                className="p-3 rounded-2xl bg-[#FFFFFF] hover:bg-[#FAF4ED] border border-[#DECFC1] text-left transition-all group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-[#382A22]">Siswa</span>
                  <span className="text-[10px] font-semibold text-[#296D3D] bg-[#E8F3EB] px-1.5 py-0.5 rounded">Kelas X</span>
                </div>
                <p className="text-[11px] text-[#78665A] line-clamp-1">Ahmad Raihan Pratama</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleDemo('konselor')}
                className="p-3 rounded-2xl bg-[#FFFFFF] hover:bg-[#FAF4ED] border border-[#DECFC1] text-left transition-all group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-[#382A22]">Konselor</span>
                  <span className="text-[10px] font-semibold text-[#7E3B21] bg-[#F5EBE6] px-1.5 py-0.5 rounded">Red Card</span>
                </div>
                <p className="text-[11px] text-[#78665A] line-clamp-1">Dra. Anastasia, Psikolog</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleDemo('klien')}
                className="p-3 rounded-2xl bg-[#FFFFFF] hover:bg-[#FAF4ED] border border-[#DECFC1] text-left transition-all group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-[#382A22]">Klien Umum</span>
                  <span className="text-[10px] font-semibold text-[#4F3C75] bg-[#EEEBF7] px-1.5 py-0.5 rounded">Publik</span>
                </div>
                <p className="text-[11px] text-[#78665A] line-clamp-1">Maya Anggraini, S.T.</p>
              </button>
            </div>

            {/* Custom Email Multi-Akun Form */}
            <div className="pt-3 border-t border-[#E8DDD0]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#4F3C31]">Daftar Akun Baru (Email Berbeda):</span>
                <span className="text-[10px] text-[#867366]">Multi-akun didukung</span>
              </div>
              <form onSubmit={handleCustomSubmit} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Nama Lengkap & Gelar"
                    required
                    className="px-3 py-2 rounded-xl border border-[#D8C9BB] bg-[#FFFFFF] text-xs text-[#382A22]"
                  />
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="px-3 py-2 rounded-xl border border-[#D8C9BB] bg-[#FFFFFF] text-xs text-[#382A22]"
                  >
                    <option value="guru_bk">Guru BK</option>
                    <option value="siswa">Siswa</option>
                    <option value="konselor">Konselor Independen</option>
                    <option value="klien">Klien Umum</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="Alamat Email (misal: user@kirana.id)"
                    required
                    className="flex-1 px-3 py-2 rounded-xl border border-[#D8C9BB] bg-[#FFFFFF] text-xs text-[#382A22]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-[#5E422F] hover:bg-[#483222] text-[#FAF7F2] text-xs font-bold transition-all disabled:opacity-40"
                  >
                    Masuk
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
