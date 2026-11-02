import React, { useState } from 'react';
import {
  HeartHandshake,
  User,
  LogOut,
  Video,
  Search,
  Sparkles,
  Settings,
  ShieldCheck,
  Award,
  ChevronDown,
  Menu,
  X,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenQuickRoleSwitch: () => void;
  onOpenMeetingModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  onOpenQuickRoleSwitch,
  onOpenMeetingModal,
}) => {
  const { userProfile, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleLabel = (role?: UserRole) => {
    switch (role) {
      case 'guru_bk':
        return 'Guru BK (Sekolah)';
      case 'siswa':
        return 'Siswa';
      case 'konselor':
        return 'Konselor Profesional';
      case 'klien':
        return 'Klien Umum';
      default:
        return 'Tamu';
    }
  };

  const getRoleBadgeColor = (role?: UserRole) => {
    switch (role) {
      case 'guru_bk':
        return 'bg-[#F2E8DC] text-[#6A472E] border-[#DCC2AD]';
      case 'siswa':
        return 'bg-[#EBF3ED] text-[#2F583B] border-[#BED6C3]';
      case 'konselor':
        return 'bg-[#F5EBE6] text-[#7E3B21] border-[#E2BDB0]';
      case 'klien':
        return 'bg-[#EEEBF7] text-[#4F3C75] border-[#CEC6E7]';
      default:
        return 'bg-[#F0EDE8] text-[#554C46] border-[#DDD5CE]';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#735138] to-[#422E22] flex items-center justify-center text-[#FDFBF7] shadow-md shadow-[#422E22]/15 ring-2 ring-[#C5A880]/30">
              <HeartHandshake className="w-7 h-7 text-[#F5E8D8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Outfit'] font-bold text-2xl tracking-tight text-[#382A22]">
                  KIRANA
                </span>
                <span className="text-[10px] tracking-wider font-semibold uppercase px-2 py-0.5 rounded-md bg-[#EFE3D5] text-[#6E472D] border border-[#DFCBB9]">
                  Konseling & Asesmen
                </span>
              </div>
              <p className="text-[11px] text-[#7A675B] font-medium hidden sm:block">
                Konseling Interaktif, Rekapitulasi, Asesmen & Naungan Aman
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#F3ECE4]/80 p-1.5 rounded-xl border border-[#E4D8CC]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#FAF7F2] text-[#382A22] shadow-sm font-bold border border-[#DDD0C2]'
                  : 'text-[#6D594C] hover:text-[#382A22] hover:bg-[#FAF7F2]/60'
              }`}
            >
              Dashboard
            </button>

            {userProfile?.role === 'siswa' && (
              <button
                onClick={() => setActiveTab('asesmen')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'asesmen'
                    ? 'bg-[#FAF7F2] text-[#382A22] shadow-sm font-bold border border-[#DDD0C2]'
                    : 'text-[#6D594C] hover:text-[#382A22] hover:bg-[#FAF7F2]/60'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#B5672A]" />
                Asesmen Psikologis
              </button>
            )}

            {userProfile?.role === 'klien' && (
              <button
                onClick={() => setActiveTab('asesmen')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'asesmen'
                    ? 'bg-[#FAF7F2] text-[#382A22] shadow-sm font-bold border border-[#DDD0C2]'
                    : 'text-[#6D594C] hover:text-[#382A22] hover:bg-[#FAF7F2]/60'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#B5672A]" />
                Asesmen & Mental Health
              </button>
            )}

            <button
              onClick={() => setActiveTab('direktori_konselor')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'direktori_konselor'
                  ? 'bg-[#FAF7F2] text-[#382A22] shadow-sm font-bold border border-[#DDD0C2]'
                  : 'text-[#6D594C] hover:text-[#382A22] hover:bg-[#FAF7F2]/60'
              }`}
            >
              <Search className="w-4 h-4 text-[#7A5A43]" />
              Cari Konselor
            </button>

            <button
              onClick={onOpenMeetingModal}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 text-[#5C4535] hover:bg-[#FAF7F2]/70"
              title="Ruang Konferensi Video Meeting (Gaya Zoom)"
            >
              <Video className="w-4 h-4 text-[#8C4F2B]" />
              Rapat Daring
            </button>
          </nav>

          {/* User Profile & Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Siswa Points pill */}
            {userProfile?.role === 'siswa' && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF2EC] border border-[#BFD9C4] text-[#235832] font-semibold text-xs shadow-xs">
                <Award className="w-4 h-4 text-[#2E7D46]" />
                <span>{userProfile.points ?? 100} Poin Keaktifan</span>
              </div>
            )}

            {/* Quick Role Switcher Button for instant demo testing */}
            <button
              onClick={onOpenQuickRoleSwitch}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFE8DF] hover:bg-[#E7DED3] border border-[#DDD0C2] text-[#554032] text-xs font-semibold transition-colors"
              title="Ganti peran akun cepat untuk menguji alur Guru BK, Siswa, Konselor, atau Klien"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#86593B]" />
              <span>Ganti Akun Peran</span>
            </button>

            {/* User Dropdown */}
            {userProfile ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-[#F4EDE5] hover:bg-[#EDE3D8] border border-[#E2D5C7] transition-all"
                  aria-label="Menu Akun Pengguna"
                >
                  <img
                    src={userProfile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'}
                    alt={userProfile.displayName}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#CCA88C]/40"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-[#382A22] leading-tight max-w-[130px] truncate">
                      {userProfile.displayName}
                    </p>
                    <span
                      className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getRoleBadgeColor(
                        userProfile.role
                      )}`}
                    >
                      {getRoleLabel(userProfile.role)}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#7A675B]" />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FFFFFF] border border-[#E4D8CC] shadow-xl p-2 z-50 text-sm animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-3 py-2.5 border-b border-[#F0EAE2] bg-[#FAF7F2] rounded-xl mb-1">
                      <p className="font-bold text-[#382A22] truncate">{userProfile.displayName}</p>
                      <p className="text-xs text-[#7A675B] truncate">{userProfile.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getRoleBadgeColor(
                            userProfile.role
                          )}`}
                        >
                          {getRoleLabel(userProfile.role)}
                        </span>
                        {userProfile.role === 'guru_bk' && userProfile.isDualRoleCounselor && (
                          <span className="text-[10px] bg-[#FFF2EA] text-[#A64B20] border border-[#F6D0BC] px-1.5 py-0.5 rounded font-semibold">
                            + Konselor Publik
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-[#4C3B30] hover:bg-[#FAF4ED] font-medium transition-colors"
                    >
                      <Settings className="w-4 h-4 text-[#8A5B3D]" />
                      Pengaturan Profil & Portofolio
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenQuickRoleSwitch();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-[#4C3B30] hover:bg-[#FAF4ED] font-medium transition-colors lg:hidden"
                    >
                      <RefreshCw className="w-4 h-4 text-[#8A5B3D]" />
                      Ganti Peran Pengguna
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-[#9A3423] hover:bg-[#FDF2F0] font-medium transition-colors mt-1 border-t border-[#F5EFE9]"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar dari Akun
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenQuickRoleSwitch}
                className="px-4 py-2 rounded-xl bg-[#614532] hover:bg-[#4E3626] text-[#FAF7F2] font-semibold text-sm shadow-sm transition-all"
              >
                Masuk / Buat Akun
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#F3ECE4] text-[#4F3C31]"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#E8DFD5] space-y-1.5 pb-4">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm ${
                activeTab === 'dashboard' ? 'bg-[#EDE3D6] text-[#382A22]' : 'text-[#665448]'
              }`}
            >
              Dashboard
            </button>

            {(userProfile?.role === 'siswa' || userProfile?.role === 'klien') && (
              <button
                onClick={() => {
                  setActiveTab('asesmen');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 ${
                  activeTab === 'asesmen' ? 'bg-[#EDE3D6] text-[#382A22]' : 'text-[#665448]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#B5672A]" />
                Asesmen Psikologis
              </button>
            )}

            <button
              onClick={() => {
                setActiveTab('direktori_konselor');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 ${
                activeTab === 'direktori_konselor' ? 'bg-[#EDE3D6] text-[#382A22]' : 'text-[#665448]'
              }`}
            >
              <Search className="w-4 h-4 text-[#7A5A43]" />
              Cari Konselor
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMeetingModal();
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 text-[#7A5A43]"
            >
              <Video className="w-4 h-4 text-[#8C4F2B]" />
              Rapat Daring (Konferensi)
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
