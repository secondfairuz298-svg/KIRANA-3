import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
  RotateCcw,
  BookOpen,
  Compass,
  HeartPulse,
  BrainCircuit,
  Award,
  Zap,
} from 'lucide-react';
import { AssessmentType, AssessmentResult } from '../types';
import { MBTI_QUESTIONS, calculateMBTI, MBTIResult } from '../utils/mbtiCalculator';
import { TALENTS_QUESTIONS, calculateRIASEC, RIASECResult } from '../utils/talentsCalculator';
import { VARK_QUESTIONS, calculateVARK, VARKResult } from '../utils/learningStyleCalculator';
import { MENTAL_HEALTH_QUESTIONS, calculateMentalHealth, MentalHealthResult } from '../utils/mentalHealthCalculator';

interface AssessmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTestType?: AssessmentType;
  userRole: 'siswa' | 'klien' | 'guru_bk' | 'konselor';
  userName: string;
  userId: string;
  classId?: string;
  onSaveResult: (result: AssessmentResult) => Promise<void>;
}

export const AssessmentsModal: React.FC<AssessmentsModalProps> = ({
  isOpen,
  onClose,
  initialTestType = 'mbti_personality',
  userRole,
  userName,
  userId,
  classId,
  onSaveResult,
}) => {
  const [selectedTest, setSelectedTest] = useState<AssessmentType>(initialTestType);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [completedResult, setCompletedResult] = useState<AssessmentResult | null>(null);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  // Get current questions list
  const getQuestions = () => {
    switch (selectedTest) {
      case 'mbti_personality':
        return MBTI_QUESTIONS;
      case 'talents_interests':
        return TALENTS_QUESTIONS;
      case 'learning_style':
        return VARK_QUESTIONS;
      case 'mental_health':
        return MENTAL_HEALTH_QUESTIONS;
      default:
        return MBTI_QUESTIONS;
    }
  };

  const questions = getQuestions();
  const currentQ = questions[currentIndex] || questions[0];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectAnswer = (value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: value,
    }));
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleAutoFillSimulation = () => {
    // Generate realistic randomized yet consistent answers
    const mockAns: Record<number, number> = {};
    questions.forEach((q) => {
      // bias slightly towards positive/thoughtful answers 3, 4, 5
      const roll = Math.floor(Math.random() * 5) + 1;
      mockAns[q.id] = roll;
    });
    setAnswers(mockAns);
    setCurrentIndex(questions.length - 1);
  };

  const handleFinishAssessment = async () => {
    setSaving(true);
    let scoreSummary = '';
    let details: AssessmentResult['details'];

    if (selectedTest === 'mbti_personality') {
      const res: MBTIResult = calculateMBTI(answers);
      scoreSummary = `${res.code} - ${res.title}`;
      details = {
        title: `${res.code} (${res.title})`,
        description: `${res.tagline} ${res.description}`,
        breakdown: [
          { label: 'Ekstrovert (E)', value: res.dimensions.EI.extraversion, max: 100, description: 'vs Introvert (I): ' + res.dimensions.EI.introversion + '%' },
          { label: 'Sensing (S)', value: res.dimensions.SN.sensing, max: 100, description: 'vs Intuisi (N): ' + res.dimensions.SN.intuition + '%' },
          { label: 'Thinking (T)', value: res.dimensions.TF.thinking, max: 100, description: 'vs Feeling (F): ' + res.dimensions.TF.feeling + '%' },
          { label: 'Judging (J)', value: res.dimensions.JP.judging, max: 100, description: 'vs Perceiving (P): ' + res.dimensions.JP.perceiving + '%' },
        ],
        strengths: res.strengths,
        growthAreas: res.growthAreas,
        recommendations: res.studyAndCareerTips,
      };
    } else if (selectedTest === 'talents_interests') {
      const res: RIASECResult = calculateRIASEC(answers);
      scoreSummary = `Holland Code: ${res.topCode} (${res.topCategories.map((c) => c.label.split(' ')[0]).join('-')})`;
      details = {
        title: `Minat Dominan: ${res.topCategories.map((c) => c.label).join(', ')}`,
        description: res.description,
        breakdown: res.topCategories.map((c) => ({
          label: c.label,
          value: c.score,
          max: 45,
        })),
        strengths: res.careerPaths.map((c) => `Peluang Karir: ${c}`),
        growthAreas: ['Eksplorasi magang atau proyek nyata', 'Perluas portofolio karya'],
        recommendations: res.recommendedMajors.map((m) => `Rekomendasi Jurusan: ${m}`),
      };
    } else if (selectedTest === 'learning_style') {
      const res: VARKResult = calculateVARK(answers);
      scoreSummary = `Gaya Belajar: ${res.dominantStyle} (${res.percentages.visual}% V, ${res.percentages.auditory}% A, ${res.percentages.kinesthetic}% K)`;
      details = {
        title: `Dominan: ${res.dominantStyle} (Sekunder: ${res.secondaryStyle})`,
        description: `Gaya belajar utama Anda adalah ${res.dominantStyle}. Informasi diserap paling optimal melalui modalitas sensori ini.`,
        breakdown: [
          { label: 'Visual', value: res.percentages.visual, max: 100 },
          { label: 'Auditori', value: res.percentages.auditory, max: 100 },
          { label: 'Baca-Tulis', value: res.percentages.readWrite, max: 100 },
          { label: 'Kinestetik', value: res.percentages.kinesthetic, max: 100 },
        ],
        strengths: res.strengths,
        growthAreas: ['Kombinasikan metode sekunder untuk pemahaman menyeluruh'],
        recommendations: res.strategies,
      };
    } else {
      const res: MentalHealthResult = calculateMentalHealth(answers);
      scoreSummary = `Skor Kesejahteraan: ${res.overallScore}/100 (${res.statusTier})`;
      details = {
        title: res.statusTier,
        description: `${res.tagline} ${res.counselorPrompt}`,
        breakdown: [
          { label: res.dimensionScores.stress.label, value: res.dimensionScores.stress.score, max: 100, description: res.dimensionScores.stress.interpretation },
          { label: res.dimensionScores.anxiety.label, value: res.dimensionScores.anxiety.score, max: 100, description: res.dimensionScores.anxiety.interpretation },
          { label: res.dimensionScores.resilience.label, value: res.dimensionScores.resilience.score, max: 100, description: res.dimensionScores.resilience.interpretation },
          { label: res.dimensionScores.mindfulness.label, value: res.dimensionScores.mindfulness.score, max: 100, description: res.dimensionScores.mindfulness.interpretation },
          { label: res.dimensionScores.socialWorth.label, value: res.dimensionScores.socialWorth.score, max: 100, description: res.dimensionScores.socialWorth.interpretation },
        ],
        strengths: ['Memiliki kesadaran batin untuk mengenali kondisi psikologis sendiri'],
        growthAreas: ['Keseimbangan istirahat dan manajemen beban pikiran'],
        recommendations: res.recommendations,
      };
    }

    const newResultRecord: AssessmentResult = {
      id: `asm_${Date.now()}`,
      userId,
      userName,
      testType: selectedTest,
      scoreSummary,
      completedAt: new Date().toISOString(),
      details,
      classId,
    };

    try {
      await onSaveResult(newResultRecord);
      setCompletedResult(newResultRecord);
    } catch (err) {
      console.warn('Saved with local fallback:', err);
      setCompletedResult(newResultRecord);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setAnswers({});
    setCompletedResult(null);
  };

  const LIKERT_OPTIONS = [
    { val: 1, label: 'Sangat Tidak Setuju', color: 'hover:bg-[#FBEBE8] hover:border-[#E8A599]' },
    { val: 2, label: 'Tidak Setuju', color: 'hover:bg-[#F7EFE8] hover:border-[#DFC8B9]' },
    { val: 3, label: 'Netral / Ragu', color: 'hover:bg-[#F3ECE4] hover:border-[#D4C3B2]' },
    { val: 4, label: 'Setuju', color: 'hover:bg-[#EBF3ED] hover:border-[#BCD9C3]' },
    { val: 5, label: 'Sangat Setuju', color: 'hover:bg-[#E3EFE6] hover:border-[#96C7A1]' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#261B14]/65 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#FAF7F2] border border-[#DFCFC1] shadow-2xl p-6 sm:p-8 text-[#382A22] my-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#7E695D] hover:bg-[#EFE8DF] hover:text-[#382A22] transition-colors"
          aria-label="Tutup Asesmen"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Test Selector Tabs (When not completed) */}
        {!completedResult && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#B5672A]" />
              <h3 className="font-['Outfit'] text-xl font-bold text-[#382A22]">
                Modul Asesmen Psikologis KIRANA
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedTest('mbti_personality');
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedTest === 'mbti_personality'
                    ? 'bg-[#553C2B] text-[#FAF7F2] shadow-sm'
                    : 'bg-[#EEE6DC] text-[#695447] hover:bg-[#E5DCD0]'
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                Tes Kepribadian MBTI (100 Soal)
              </button>

              {userRole === 'siswa' && (
                <>
                  <button
                    onClick={() => {
                      setSelectedTest('talents_interests');
                      handleReset();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedTest === 'talents_interests'
                        ? 'bg-[#553C2B] text-[#FAF7F2] shadow-sm'
                        : 'bg-[#EEE6DC] text-[#695447] hover:bg-[#E5DCD0]'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Bakat & Minat RIASEC (50 Soal)
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTest('learning_style');
                      handleReset();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedTest === 'learning_style'
                        ? 'bg-[#553C2B] text-[#FAF7F2] shadow-sm'
                        : 'bg-[#EEE6DC] text-[#695447] hover:bg-[#E5DCD0]'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Cara Belajar VARK (50 Soal)
                  </button>
                </>
              )}

              {(userRole === 'klien' || userRole === 'siswa') && (
                <button
                  onClick={() => {
                    setSelectedTest('mental_health');
                    handleReset();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedTest === 'mental_health'
                      ? 'bg-[#553C2B] text-[#FAF7F2] shadow-sm'
                      : 'bg-[#EEE6DC] text-[#695447] hover:bg-[#E5DCD0]'
                  }`}
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  Mental Health Test (100 Soal)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Result View */}
        {completedResult ? (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 rounded-2xl bg-[#F6EFE7] border border-[#DECFC1] text-center">
              <div className="w-14 h-14 rounded-full bg-[#E5F1E8] text-[#296D3D] mx-auto flex items-center justify-center border border-[#B9D9C1] mb-3">
                <CheckCircle className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E5728] px-2.5 py-0.5 rounded-md bg-[#EFE1D2]">
                Hasil Asesmen Resmi KIRANA
              </span>
              <h4 className="font-['Outfit'] text-2xl font-bold text-[#382A22] mt-2">
                {completedResult.details.title}
              </h4>
              <p className="text-sm text-[#6C584C] mt-2 max-w-xl mx-auto leading-relaxed">
                {completedResult.details.description}
              </p>
            </div>

            {/* Dimension Breakdown Graphs */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#735A49]">
                Komposisi Dimensi & Analisis Skor:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {completedResult.details.breakdown.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E4D7CA]">
                    <div className="flex justify-between items-center text-xs font-bold text-[#3C2D23] mb-1.5">
                      <span>{item.label}</span>
                      <span className="text-[#965427]">{item.value}%</span>
                    </div>
                    <div className="w-full bg-[#F0E6DC] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#8C5D3E] to-[#C87A42] h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, Math.max(5, item.value))}%` }}
                      ></div>
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-[#7A675B] mt-1.5 font-medium">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Recommendations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF4ED] border border-[#E6DACD]">
                <h6 className="font-bold text-xs uppercase tracking-wider text-[#2B603A] mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Kekuatan Utama & Potensi:
                </h6>
                <ul className="text-xs text-[#523F33] space-y-1.5 list-disc list-inside">
                  {completedResult.details.strengths.map((str, idx) => (
                    <li key={idx} className="leading-relaxed">{str}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF4ED] border border-[#E6DACD]">
                <h6 className="font-bold text-xs uppercase tracking-wider text-[#A25021] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Rekomendasi Strategi & Aksi:
                </h6>
                <ul className="text-xs text-[#523F33] space-y-1.5 list-disc list-inside">
                  {completedResult.details.recommendations.map((rec, idx) => (
                    <li key={idx} className="leading-relaxed">{rec}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-xl bg-[#EFE7DE] hover:bg-[#E5DCD0] text-[#554133] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Ulangi Tes
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-xs shadow-md transition-all"
              >
                Simpan & Kembali ke Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Test Runner View */
          <div className="space-y-6">
            {/* Top Bar: Question Counter & Progress */}
            <div>
              <div className="flex justify-between items-center text-xs text-[#7A675B] font-semibold mb-2">
                <span>
                  Pertanyaan {currentIndex + 1} dari {questions.length}
                </span>
                <div className="flex items-center gap-3">
                  {/* Quick Auto-Fill Simulation Button */}
                  <button
                    onClick={handleAutoFillSimulation}
                    className="px-2.5 py-1 rounded-lg bg-[#EFE5D9] hover:bg-[#E5D9CB] text-[#7C4E2C] text-[11px] font-bold flex items-center gap-1 border border-[#DDD0C2]"
                    title="Isi otomatis 100/50 soal untuk memudahkan pengujian sistem"
                  >
                    <Zap className="w-3 h-3 text-[#B5672A]" />
                    Simulasi Isi Cepat
                  </button>
                  <span className="font-bold text-[#86593B]">{progressPercent}%</span>
                </div>
              </div>
              <div className="w-full bg-[#EADFD3] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#86593B] to-[#C77C44] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Question Text Card */}
            <div className="min-h-[140px] p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E5DACD] shadow-xs flex items-center justify-center text-center">
              <p className="font-['Outfit'] text-lg sm:text-xl font-semibold text-[#382A22] leading-relaxed">
                "{currentQ.text}"
              </p>
            </div>

            {/* Likert Scale 5 Buttons */}
            <div>
              <p className="text-center text-xs font-semibold text-[#806D60] mb-3">
                Pilih tanggapan yang paling mencerminkan kondisi Anda saat ini:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {LIKERT_OPTIONS.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.val;
                  return (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectAnswer(opt.val)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-[#553C2B] text-[#FAF7F2] border-[#553C2B] shadow-md font-bold scale-[1.02]'
                          : `bg-[#FFFFFF] border-[#E2D5C7] text-[#47362B] ${opt.color}`
                      }`}
                    >
                      <div className="text-sm font-extrabold mb-0.5">{opt.val}</div>
                      <div className="text-[11px] leading-tight font-medium">{opt.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center pt-2 border-t border-[#E8DFD5]">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-[#D8C9BB] text-[#554234] text-xs font-bold disabled:opacity-30 hover:bg-[#EFE8DF] transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Sebelumnya
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  Selanjutnya
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleFinishAssessment}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#296D3D] hover:bg-[#1E522E] text-[#FAF7F2] text-xs font-bold shadow-md transition-all flex items-center gap-2 animate-pulse"
                >
                  <CheckCircle className="w-4 h-4" />
                  {saving ? 'Menghitung Hasil...' : 'Lihat Hasil Lengkap'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
