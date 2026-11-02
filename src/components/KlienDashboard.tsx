import React from 'react';
import {
  BrainCircuit,
  HeartPulse,
  Search,
  Calendar,
  MessageCircle,
  Phone,
  Video,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AssessmentResult, CounselingSchedule, UserProfile } from '../types';

interface KlienDashboardProps {
  onOpenAssessment: (type: 'mbti_personality' | 'mental_health') => void;
  assessments: AssessmentResult[];
  schedules: CounselingSchedule[];
  onNavigateToDirectory: () => void;
  onOpenChatWithCounselor: (counselor: UserProfile) => void;
  sampleCounselor: UserProfile;
}

export const KlienDashboard: React.FC<KlienDashboardProps> = ({
  onOpenAssessment,
  assessments,
  schedules,
  onNavigateToDirectory,
  onOpenChatWithCounselor,
  sampleCounselor,
}) => {
  const { userProfile } = useAuth();

  const mbtiResult = assessments.find((a) => a.testType === 'mbti_personality');
  const mentalHealthResult = assessments.find((a) => a.testType === 'mental_health');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FBF7F2] to-[#F5ECE3] border border-[#E4D8CC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EFE3D5] text-[#714E36] font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Portal Klien Umum • Naungan Aman
          </div>
          <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[#382A22]">
            Selamat Datang, {userProfile?.displayName}
          </h1>
          <p className="text-xs sm:text-sm text-[#736052] mt-1 max-w-xl leading-relaxed">
            KIRANA menyediakan ruang aman untuk mengeksplorasi kondisi kesehatan mental, tes kepribadian komprehensif 100 soal, serta direktori terbuka untuk berkonsultasi dengan konselor profesional pilihan Anda.
          </p>
        </div>

        <button
          onClick={onNavigateToDirectory}
          className="px-5 py-3 rounded-2xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Search className="w-4 h-4" />
          Jelajahi Direktori Konselor
        </button>
      </div>

      {/* 2 Modul Asesmen Psikologis: MBTI 100 Soal & Mental Health 100 Soal */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-['Outfit'] text-lg font-bold text-[#382A22]">
              Modul Asesmen Psikologis Klien Umum
            </h3>
            <p className="text-xs text-[#7A675B]">
              Ikuti tes komprehensif terkalibrasi untuk memetakan kepribadian dan kondisi psikologis Anda secara objektif.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: MBTI 100 Soal */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EFE3D5] text-[#714E36] flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                {mbtiResult ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F3EB] text-[#286337]">
                    Selesai Dikerjakan
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4EDE5] text-[#714E36]">
                    100 Soal Terkalibrasi
                  </span>
                )}
              </div>

              <h4 className="font-['Outfit'] font-bold text-lg text-[#382A22]">
                Tes Kepribadian (MBTI)
              </h4>
              <p className="text-xs text-[#736052] mt-1 leading-relaxed">
                100 soal mendalam mengevaluasi 4 dimensi utama: Ekstrovert/Introvert, Sensing/Intuisi, Thinking/Feeling, dan Judging/Perceiving dengan analisis karir & relasi.
              </p>

              {mbtiResult && (
                <div className="mt-4 p-3.5 rounded-2xl bg-[#FAF5EE] border border-[#EAE0D3]">
                  <span className="text-[10px] uppercase font-bold text-[#86593B] block">Hasil Analisis:</span>
                  <p className="font-bold text-sm text-[#382A22] mt-0.5">{mbtiResult.scoreSummary}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => onOpenAssessment('mbti_personality')}
              className="w-full mt-5 py-3 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-xs transition-colors shadow-xs"
            >
              {mbtiResult ? 'Lihat / Ulangi Tes MBTI' : 'Mulai Tes Kepribadian (100 Soal)'}
            </button>
          </div>

          {/* Card 2: Mental Health 100 Soal */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F8ECE8] text-[#A23824] flex items-center justify-center">
                  <HeartPulse className="w-6 h-6" />
                </div>
                {mentalHealthResult ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F3EB] text-[#286337]">
                    Selesai Dikerjakan
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F8ECE8] text-[#A23824]">
                    100 Soal Kesejahteraan
                  </span>
                )}
              </div>

              <h4 className="font-['Outfit'] font-bold text-lg text-[#382A22]">
                Mental Health & Wellbeing Assessment
              </h4>
              <p className="text-xs text-[#736052] mt-1 leading-relaxed">
                100 soal terkalibrasi mencakup 5 pilar penting: Manajemen Stres, Tingkat Kecemasan, Daya Lenting (Resiliensi), Keseimbangan Hidup/Mindfulness, dan Keberhargaan Diri.
              </p>

              {mentalHealthResult && (
                <div className="mt-4 p-3.5 rounded-2xl bg-[#FAF5EE] border border-[#EAE0D3]">
                  <span className="text-[10px] uppercase font-bold text-[#86593B] block">Hasil Indeks:</span>
                  <p className="font-bold text-sm text-[#382A22] mt-0.5">{mentalHealthResult.scoreSummary}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => onOpenAssessment('mental_health')}
              className="w-full mt-5 py-3 rounded-xl bg-[#A23824] hover:bg-[#852C1A] text-[#FAF7F2] font-bold text-xs transition-colors shadow-xs"
            >
              {mentalHealthResult ? 'Lihat / Ulangi Mental Health Test' : 'Mulai Mental Health Test (100 Soal)'}
            </button>
          </div>
        </div>
      </div>

      {/* Jadwal Konsultasi & Konselor Rekomendasi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jadwal Sesi Anda */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Outfit'] font-bold text-lg text-[#382A22]">
              Jadwal Sesi Konseling Terdaftar ({schedules.length})
            </h3>
            <button
              onClick={onNavigateToDirectory}
              className="text-xs font-bold text-[#86593B] hover:text-[#553C2B] flex items-center gap-1"
            >
              Cari Konselor Lain <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {schedules.length === 0 ? (
              <p className="text-xs text-[#867366] py-6 text-center">
                Belum ada jadwal sesi yang aktif. Silakan pilih konselor di direktori untuk membuat jadwal.
              </p>
            ) : (
              schedules.map((sc) => (
                <div
                  key={sc.id}
                  className="p-4 rounded-2xl bg-[#FAF6F1] border border-[#EADFD4] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F3EB] text-[#286337]">
                      Sesi Terkonfirmasi
                    </span>
                    <h4 className="font-bold text-sm text-[#382A22] mt-1">
                      Bersama: {sc.counselorName}
                    </h4>
                    <p className="text-xs font-semibold text-[#864F28] mt-0.5">{sc.topic}</p>
                    <p className="text-[11px] text-[#7A675B] mt-1">
                      📅 {sc.sessionDate} • 🕒 {sc.sessionTime} • 📍 {sc.location}
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenChatWithCounselor(sampleCounselor)}
                    className="px-3.5 py-2 rounded-xl bg-[#593E2B] text-[#FAF7F2] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#432E1F] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Buka Chat Konselor
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Konselor Rekomendasi Terverifikasi */}
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E3D6C9] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A24B20]" />
            <h3 className="font-['Outfit'] font-bold text-base text-[#382A22]">
              Konselor Pilihan Hari Ini
            </h3>
          </div>

          <div className="text-center p-4 rounded-2xl bg-[#FAF5EE] border border-[#E5DACD] space-y-3">
            <img
              src={sampleCounselor.avatarUrl}
              alt={sampleCounselor.displayName}
              className="w-16 h-16 rounded-2xl object-cover mx-auto ring-2 ring-[#7B543B]/30"
            />
            <div>
              <h4 className="font-bold text-sm text-[#382A22]">{sampleCounselor.displayName}</h4>
              <p className="text-[11px] text-[#7A675B] mt-0.5">Spesialis Kecemasan & Karir</p>
            </div>
            <div className="p-2 rounded-xl bg-[#FDF0EB] border border-[#F2D0C2] text-xs font-bold text-[#8B3512]">
              {sampleCounselor.redCardRate || 'Rp 175.000 / Sesi'}
            </div>
            <button
              onClick={() => onOpenChatWithCounselor(sampleCounselor)}
              className="w-full py-2.5 rounded-xl bg-[#593E2B] text-[#FAF7F2] font-bold text-xs hover:bg-[#432E1F] transition-colors"
            >
              Mulai Konsultasi Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
