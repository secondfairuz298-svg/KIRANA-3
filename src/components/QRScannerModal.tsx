import React, { useState, useEffect } from 'react';
import { QrCode, Camera, CheckCircle2, ArrowRight, X, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { SchoolClass } from '../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableClasses: SchoolClass[];
  onJoinClass: (schoolClass: SchoolClass) => Promise<void>;
  currentClassId?: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  availableClasses,
  onJoinClass,
  currentClassId,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successClass, setSuccessClass] = useState<SchoolClass | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSuccessClass(null);
      setErrorMsg('');
      setIsScanning(true);
      setManualCode('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProcessCode = async (codeToJoin: string) => {
    setErrorMsg('');
    const cleaned = codeToJoin.trim().toUpperCase();
    if (!cleaned) {
      setErrorMsg('Silakan masukkan atau scan kode kelas Guru BK.');
      return;
    }

    const matched = availableClasses.find(
      (c) => c.code.toUpperCase() === cleaned || c.id.toUpperCase() === cleaned
    );

    if (!matched) {
      setErrorMsg(`Kode "${codeToJoin}" tidak ditemukan. Pastikan kode kelas sesuai dengan QR Code Guru BK Anda.`);
      return;
    }

    setJoining(true);
    try {
      await onJoinClass(matched);
      setSuccessClass(matched);
      setIsScanning(false);
    } catch (err) {
      setErrorMsg('Gagal bergabung ke kelas. Silakan coba kembali.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231812]/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FAF7F2] border border-[#E0D4C5] shadow-2xl p-6 sm:p-8 text-[#382A22]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#7E695D] hover:bg-[#EFE8DF] hover:text-[#382A22] transition-colors"
          aria-label="Tutup Scanner"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#EFE3D5] text-[#714E36] flex items-center justify-center border border-[#DFCBB9]">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-['Outfit'] text-xl font-bold text-[#382A22]">
              Scanner QR Code Room BK
            </h3>
            <p className="text-xs text-[#7A675B]">
              Pindai QR Code dari Guru BK atau masukkan tautan kelas untuk bergabung
            </p>
          </div>
        </div>

        {successClass ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EAF2EC] text-[#256839] mx-auto flex items-center justify-center border border-[#BEDEC6] animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-[#256839]">Berhasil Tergabung ke Kelas!</h4>
              <p className="text-sm font-semibold text-[#382A22] mt-1">{successClass.name}</p>
              <p className="text-xs text-[#6F5D51]">Guru Pengampu: {successClass.teacherName}</p>
            </div>
            <p className="text-xs bg-[#F3EDE5] p-3 rounded-2xl text-[#6D5A4E] border border-[#E5DACD]">
              Semua hasil tes asesmen Anda sekarang dapat dipantau langsung oleh Guru BK Anda untuk bimbingan berkala.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#593E2B] hover:bg-[#432E1F] text-[#FAF7F2] font-bold text-sm shadow-md transition-all"
            >
              Kembali ke Dashboard Siswa
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Camera Viewport Simulation */}
            <div className="relative rounded-2xl overflow-hidden bg-[#2D211A] aspect-[4/3] flex flex-col items-center justify-center border-2 border-[#D9C8B6] shadow-inner">
              <div className="absolute inset-8 border-2 border-dashed border-[#F3E3D3]/70 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-5 h-5 border-t-4 border-l-4 border-[#C88452] rounded-tl-md"></div>
                  <div className="w-5 h-5 border-t-4 border-r-4 border-[#C88452] rounded-tr-md"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-5 h-5 border-b-4 border-l-4 border-[#C88452] rounded-bl-md"></div>
                  <div className="w-5 h-5 border-b-4 border-r-4 border-[#C88452] rounded-br-md"></div>
                </div>
              </div>

              {/* Scanning Red Laser Line */}
              <div className="absolute left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-[#E0653B] to-transparent shadow-[0_0_10px_#E0653B] animate-pulse"></div>

              <div className="text-center z-10 px-4">
                <Camera className="w-8 h-8 text-[#E2D2C3] mx-auto mb-2 opacity-80" />
                <p className="text-xs text-[#E8DDD2] font-medium">
                  Arahkan kamera ke QR Code kelas Guru BK
                </p>
                <p className="text-[11px] text-[#B8A392] mt-1">
                  Atau klik salah satu kelas Guru BK yang tersedia di bawah untuk simulasi scan instan
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FDF0ED] border border-[#F5C7BD] text-[#A23722] text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Available Room Buttons (Simulasi Pindai) */}
            <div>
              <label className="block text-xs font-bold text-[#554234] mb-2">
                Pilih Kelas Guru BK (Simulasi QR Code Terdeteksi):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableClasses.slice(0, 4).map((c) => {
                  const isCurrent = c.id === currentClassId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleProcessCode(c.code)}
                      disabled={joining || isCurrent}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'bg-[#EBF2EC] border-[#B7D6BE] text-[#255E36] opacity-80 cursor-default'
                          : 'bg-[#FFFFFF] border-[#E3D6C9] hover:border-[#86593B] hover:bg-[#FAF4ED] text-[#3D2D23]'
                      }`}
                    >
                      <div>
                        <p className="font-bold">{c.name}</p>
                        <p className="text-[10px] text-[#7A675B]">{c.code}</p>
                      </div>
                      {isCurrent ? (
                        <span className="text-[10px] font-bold text-[#2A663A]">Aktif</span>
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-[#86593B]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual Code or Link Input */}
            <div className="pt-2 border-t border-[#E8DFD5]">
              <label className="block text-xs font-bold text-[#554234] mb-1.5 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-[#7A5B45]" />
                Atau Masukkan Tautan / Kode Kelas Manual:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Contoh: KIRANA-MIPA1-2026"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D8C9BB] text-sm text-[#382A22] placeholder:text-[#9F8F83] focus:outline-hidden focus:ring-2 focus:ring-[#86593B]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleProcessCode(manualCode);
                  }}
                />
                <button
                  onClick={() => handleProcessCode(manualCode)}
                  disabled={joining}
                  className="px-4 py-2.5 rounded-xl bg-[#5E422F] hover:bg-[#483222] text-[#FAF7F2] font-bold text-xs shadow-xs transition-all disabled:opacity-50"
                >
                  {joining ? 'Memproses...' : 'Gabung'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
