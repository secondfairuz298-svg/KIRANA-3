import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  VolumeX,
  ShieldCheck,
  Maximize2,
  Sparkles,
} from 'lucide-react';

interface DirectCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callType: 'voice' | 'video';
  targetName: string;
  targetRole: string;
  targetAvatar?: string;
}

export const DirectCallModal: React.FC<DirectCallModalProps> = ({
  isOpen,
  onClose,
  callType,
  targetName,
  targetRole,
  targetAvatar,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(callType === 'voice');
  const [speakerMuted, setSpeakerMuted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isOpen) {
      setSeconds(0);
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B120D]/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#2A1D16] border border-[#483327] shadow-2xl overflow-hidden text-[#FAF7F2] flex flex-col">
        {/* Top Header */}
        <div className="p-4 bg-[#231711] border-b border-[#3B291F] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#5BB374] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#5BB374] animate-ping"></span>
            <span>Panggilan Langsung Terhubung ({callType === 'video' ? 'Video Call' : 'Voice Call'})</span>
          </div>
          <span className="font-mono text-[#D68852] font-bold text-sm bg-[#1A110C] px-2.5 py-0.5 rounded-lg border border-[#3A281E]">
            {formatTimer(seconds)}
          </span>
        </div>

        {/* Call Center Visual Area */}
        <div className="p-8 flex flex-col items-center justify-center text-center min-h-[300px] relative bg-gradient-to-b from-[#2A1D16] to-[#1E140F]">
          {callType === 'video' && !camOff ? (
            /* Video Call Simulator View */
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#180E09] border border-[#523A2B] flex items-center justify-center shadow-inner">
              <img
                src={targetAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                alt={targetName}
                className="w-full h-full object-cover"
              />
              {/* Self view preview picture-in-picture */}
              <div className="absolute top-3 right-3 w-24 h-16 rounded-xl overflow-hidden border-2 border-[#FAF7F2] shadow-lg bg-[#2A1D16]">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80"
                  alt="Self Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-3 left-3 bg-[#1A120D]/80 backdrop-blur-xs px-3 py-1 rounded-lg text-xs font-bold text-[#FAF7F2] border border-[#483327]">
                {targetName}
              </div>
            </div>
          ) : (
            /* Voice Call & Audio Visualizer View */
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-[#834E2F] shadow-2xl">
                  <img
                    src={targetAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                    alt={targetName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {!micMuted && (
                  <div className="absolute -bottom-2 -right-2 bg-[#2E6B3F] text-[#FAF7F2] p-1.5 rounded-full border-2 border-[#2A1D16]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </div>

              <h4 className="font-['Outfit'] text-xl font-bold text-[#FAF7F2] mb-0.5">
                {targetName}
              </h4>
              <p className="text-xs text-[#BFAFA2] mb-6">{targetRole}</p>

              {/* Simulated Audio Waveform Visualizer */}
              <div className="flex items-center gap-1.5 h-10 px-4 py-2 rounded-2xl bg-[#1C130E] border border-[#3A281E]">
                {[4, 8, 14, 22, 10, 16, 26, 12, 18, 24, 14, 8, 12, 6].map((h, i) => (
                  <span
                    key={i}
                    className="w-1.5 bg-gradient-to-t from-[#86593B] to-[#E08D51] rounded-full transition-all duration-150 animate-pulse"
                    style={{
                      height: micMuted ? '4px' : `${h + (i % 3) * 4}px`,
                      animationDelay: `${i * 60}ms`,
                    }}
                  ></span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Security & Naungan Aman Notice */}
        <div className="px-6 py-2 bg-[#221610] text-center border-t border-[#3B291F]">
          <p className="text-[11px] text-[#A69485] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5BB374]" />
            Ruang komunikasi pribadi ini terlindungi oleh etika kerahasiaan konseling KIRANA.
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="p-6 bg-[#231711] border-t border-[#3B291F] flex items-center justify-center gap-4">
          <button
            onClick={() => setMicMuted(!micMuted)}
            className={`p-4 rounded-2xl transition-all ${
              micMuted
                ? 'bg-[#6B2418] text-[#FAF7F2] border border-[#8C3122]'
                : 'bg-[#3A281E] hover:bg-[#4E372A] text-[#FAF7F2] border border-[#523A2B]'
            }`}
            title={micMuted ? 'Buka Mikrofon' : 'Bisukan Mikrofon'}
          >
            {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {callType === 'video' && (
            <button
              onClick={() => setCamOff(!camOff)}
              className={`p-4 rounded-2xl transition-all ${
                camOff
                  ? 'bg-[#6B2418] text-[#FAF7F2] border border-[#8C3122]'
                  : 'bg-[#3A281E] hover:bg-[#4E372A] text-[#FAF7F2] border border-[#523A2B]'
              }`}
              title={camOff ? 'Nyalakan Kamera' : 'Matikan Kamera'}
            >
              {camOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={() => setSpeakerMuted(!speakerMuted)}
            className={`p-4 rounded-2xl transition-all ${
              speakerMuted
                ? 'bg-[#6B2418] text-[#FAF7F2] border border-[#8C3122]'
                : 'bg-[#3A281E] hover:bg-[#4E372A] text-[#FAF7F2] border border-[#523A2B]'
            }`}
            title={speakerMuted ? 'Suara Speaker Mati' : 'Speaker Aktif'}
          >
            {speakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="p-4 rounded-2xl bg-[#9E2B1B] hover:bg-[#852315] text-[#FAF7F2] shadow-lg transition-all scale-105"
            title="Akhiri Panggilan"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
