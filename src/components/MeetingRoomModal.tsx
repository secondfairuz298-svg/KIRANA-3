import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  ScreenShare,
  MessageSquare,
  Users,
  PhoneOff,
  Lock,
  Sparkles,
  Send,
  X,
  Maximize2,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MeetingRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRoomTitle?: string;
}

export const MeetingRoomModal: React.FC<MeetingRoomModalProps> = ({
  isOpen,
  onClose,
  defaultRoomTitle = 'Konseling Kelompok Terbimbing KIRANA',
}) => {
  const { userProfile } = useAuth();
  const [joined, setJoined] = useState(false);
  const [roomTitle, setRoomTitle] = useState(defaultRoomTitle);
  const [passcode, setPasscode] = useState('kirana2026');
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [passError, setPassError] = useState('');

  // In-room states
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Sistem KIRANA', text: 'Selamat datang di Ruang Konseling Daring yang aman & terenkripsi.', time: '09:00' },
    { sender: 'Dra. Anastasia, Psikolog', text: 'Halo semuanya, selamat bergabung di sesi bimbingan tematik hari ini.', time: '09:01' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  if (!isOpen) return null;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPasscode.trim().toLowerCase() !== passcode.toLowerCase()) {
      setPassError('Kata sandi ruang rapat salah. Silakan periksa kembali (Default: kirana2026)');
      return;
    }
    setJoined(true);
    setPassError('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: userProfile?.displayName || 'Saya',
        text: newMessage.trim(),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewMessage('');
  };

  const PARTICIPANTS = [
    {
      name: `${userProfile?.displayName || 'Pengguna'} (Anda)`,
      role: userProfile?.role || 'siswa',
      avatar: userProfile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      isMe: true,
      mic: micOn,
      cam: camOn,
    },
    {
      name: 'Dra. Anastasia Wardani, Psikolog',
      role: 'Konselor Pemateri',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      isMe: false,
      mic: true,
      cam: true,
    },
    {
      name: 'Rizky Fauzan Pratama, M.Pd.',
      role: 'Guru BK',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      isMe: false,
      mic: false,
      cam: true,
    },
    {
      name: 'Nadia Salsabila',
      role: 'Siswa X MIPA 1',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      isMe: false,
      mic: false,
      cam: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#1A120D]/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-5xl h-[88vh] rounded-3xl bg-[#211712] border border-[#483327] shadow-2xl flex flex-col overflow-hidden text-[#FAF7F2]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#2A1E17] border-b border-[#3D2C22]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#593E2B] flex items-center justify-center text-[#F5EFE8] border border-[#78543B]">
              <Lock className="w-4 h-4 text-[#C9824F]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Outfit'] font-bold text-base text-[#FAF7F2] truncate max-w-sm sm:max-w-md">
                  {roomTitle}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#3F754E] text-[#E8F5EC]">
                  AMAN & TERENKRIPSI
                </span>
              </div>
              <p className="text-xs text-[#A89485]">Passcode: {passcode} • In-App Conference KIRANA</p>
            </div>
          </div>

          <button
            onClick={() => {
              setJoined(false);
              onClose();
            }}
            className="p-2 rounded-xl text-[#B3A093] hover:bg-[#3D2A1F] hover:text-[#FAF7F2] transition-colors"
            aria-label="Tutup Rapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!joined ? (
          /* Join Screen with Passcode */
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full p-8 rounded-3xl bg-[#2D2019] border border-[#483327] shadow-xl text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-[#573C29] text-[#E08D51] mx-auto flex items-center justify-center border border-[#714E36]">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-['Outfit'] text-2xl font-bold text-[#FAF7F2]">
                  Masuk Ruang Konferensi
                </h4>
                <p className="text-xs text-[#BFAFA2] mt-1">
                  Masukkan kata sandi pertemuan untuk memastikan privasi konseling terjaga
                </p>
              </div>

              <form onSubmit={handleJoin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-[#BFAFA2] mb-1.5">
                    Nama Ruang Pertemuan:
                  </label>
                  <input
                    type="text"
                    value={roomTitle}
                    onChange={(e) => setRoomTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1C130E] border border-[#483327] text-sm text-[#FAF7F2] focus:ring-2 focus:ring-[#C9824F] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#BFAFA2] mb-1.5">
                    Kata Sandi Ruang (Passcode):
                  </label>
                  <input
                    type="password"
                    value={enteredPasscode}
                    onChange={(e) => setEnteredPasscode(e.target.value)}
                    placeholder="Masukkan sandi (default: kirana2026)"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1C130E] border border-[#483327] text-sm text-[#FAF7F2] focus:ring-2 focus:ring-[#C9824F] focus:outline-hidden"
                  />
                </div>

                {passError && (
                  <p className="text-xs text-[#E87361] bg-[#421D18] p-2.5 rounded-xl border border-[#6B2E26]">
                    {passError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#834E2F] hover:bg-[#6D3F25] text-[#FAF7F2] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Gabung ke Sesi Pertemuan
                </button>
              </form>

              <p className="text-[11px] text-[#938174]">
                Petunjuk Cepat: Kata sandi bawaan sesi adalah <span className="text-[#C9824F] font-bold">kirana2026</span>
              </p>
            </div>
          </div>
        ) : (
          /* Live Conference Room */
          <div className="flex-1 flex overflow-hidden">
            {/* Main Stage Grid */}
            <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
              {/* Screen Share simulation view */}
              {screenSharing && (
                <div className="w-full h-56 sm:h-72 rounded-2xl bg-[#150F0B] border border-[#523B2D] p-4 flex flex-col justify-between relative shadow-2xl">
                  <div className="flex justify-between items-center text-xs text-[#E08D51] font-bold">
                    <span className="flex items-center gap-1.5">
                      <ScreenShare className="w-4 h-4" />
                      Berbagi Layar: Whiteboard & Rangkuman Materi Konseling Terbimbing
                    </span>
                    <span className="bg-[#483327] px-2 py-0.5 rounded text-[11px] text-[#F3EBE3]">
                      Resolusi HD 1080p
                    </span>
                  </div>
                  <div className="my-auto text-center space-y-2">
                    <h5 className="text-lg font-bold text-[#FAF7F2]">
                      Prinsip 4 Pilar: Regulasi Emosi, Resiliensi & Saling Mengayomi
                    </h5>
                    <p className="text-xs text-[#BFAFA2] max-w-lg mx-auto">
                      "Di dalam ruang ini, setiap suara didengarkan tanpa penghakiman. Naungan aman KIRANA adalah tempat kita tumbuh bersama."
                    </p>
                  </div>
                  <div className="text-[11px] text-[#867366] text-right">
                    Dipresentasikan oleh Dra. Anastasia Wardani, Psikolog
                  </div>
                </div>
              )}

              {/* Video Grid of Participants */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[260px]">
                {PARTICIPANTS.map((p, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl overflow-hidden bg-[#2C1F18] border border-[#483327] flex items-center justify-center shadow-lg group"
                  >
                    {p.cam ? (
                      <div className="relative w-full h-full min-h-[140px] flex items-center justify-center bg-gradient-to-t from-[#150E0B] via-[#2A1D16] to-[#38271E]">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-20 h-20 rounded-full object-cover ring-2 ring-[#7B543B]"
                        />
                        {/* Audio wave indicator when mic is on */}
                        {p.mic && (
                          <div className="absolute top-3 right-3 flex items-center gap-0.5 px-2 py-1 rounded-md bg-[#234A30] text-[#71D68C] text-[10px] font-bold">
                            <span className="w-1 h-3 bg-[#71D68C] animate-pulse"></span>
                            <span className="w-1 h-4 bg-[#71D68C] animate-pulse delay-75"></span>
                            <span className="w-1 h-2 bg-[#71D68C] animate-pulse delay-150"></span>
                            <span className="ml-1">Bicara</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-[#412E23] text-[#BFAFA2] flex items-center justify-center font-bold text-xl border border-[#5A3F30] mb-2">
                          {p.name.charAt(0)}
                        </div>
                        <span className="text-xs text-[#8A776A]">Kamera Dinonaktifkan</span>
                      </div>
                    )}

                    {/* Participant overlay tag */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs px-3 py-1.5 rounded-xl bg-[#1A120D]/80 backdrop-blur-xs border border-[#453125]">
                      <div className="truncate">
                        <span className="font-bold text-[#FAF7F2]">{p.name}</span>
                        <span className="text-[10px] text-[#A69485] ml-1.5">({p.role})</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {p.mic ? (
                          <Mic className="w-3.5 h-3.5 text-[#5BB374]" />
                        ) : (
                          <MicOff className="w-3.5 h-3.5 text-[#E06753]" />
                        )}
                        {p.cam ? (
                          <VideoIcon className="w-3.5 h-3.5 text-[#5BB374]" />
                        ) : (
                          <VideoOff className="w-3.5 h-3.5 text-[#E06753]" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Meeting Chat Sidebar */}
            {chatOpen && (
              <div className="w-80 border-l border-[#3D2C22] bg-[#281D16] flex flex-col animate-in slide-in-from-right duration-200">
                <div className="p-3.5 border-b border-[#3D2C22] flex justify-between items-center text-xs font-bold text-[#E5D7CC]">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#C9824F]" />
                    Obrolan Rapat Langsung
                  </span>
                  <button onClick={() => setChatOpen(false)} className="text-[#8F7D70] hover:text-[#FAF7F2]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 p-3 overflow-y-auto space-y-3">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className="text-xs bg-[#1F1611] p-2.5 rounded-xl border border-[#3A2A20]">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-[#D68852]">{msg.sender}</span>
                        <span className="text-[10px] text-[#817064]">{msg.time}</span>
                      </div>
                      <p className="text-[#E8DDD4] leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="p-3 border-t border-[#3D2C22] flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tulis pesan..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#1C130E] border border-[#483327] text-xs text-[#FAF7F2] focus:outline-hidden"
                  />
                  <button type="submit" className="p-2 rounded-xl bg-[#834E2F] hover:bg-[#6D3F25] text-[#FAF7F2]">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* Participants Sidebar */}
            {participantsOpen && (
              <div className="w-72 border-l border-[#3D2C22] bg-[#281D16] flex flex-col animate-in slide-in-from-right duration-200">
                <div className="p-3.5 border-b border-[#3D2C22] flex justify-between items-center text-xs font-bold text-[#E5D7CC]">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#C9824F]" />
                    Peserta Pertemuan ({PARTICIPANTS.length})
                  </span>
                  <button onClick={() => setParticipantsOpen(false)} className="text-[#8F7D70] hover:text-[#FAF7F2]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3 space-y-2 overflow-y-auto">
                  {PARTICIPANTS.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[#1E1510] border border-[#3D2B20]">
                      <div className="flex items-center gap-2 truncate">
                        <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-lg object-cover" />
                        <div className="truncate">
                          <p className="text-xs font-semibold text-[#FAF7F2] truncate">{p.name}</p>
                          <p className="text-[10px] text-[#867467]">{p.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {p.mic ? <Mic className="w-3.5 h-3.5 text-[#5BB374]" /> : <MicOff className="w-3.5 h-3.5 text-[#E06753]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Meeting Controls Bar (Only when joined) */}
        {joined && (
          <div className="px-6 py-4 bg-[#2A1E17] border-t border-[#3D2C22] flex items-center justify-between">
            {/* Left audio / video toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`p-3 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition-all ${
                  micOn
                    ? 'bg-[#3A281E] hover:bg-[#4E372A] text-[#FAF7F2] border border-[#523A2B]'
                    : 'bg-[#6B2418] text-[#FAF7F2] border border-[#8C3122]'
                }`}
              >
                {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{micOn ? 'Mute' : 'Unmute'}</span>
              </button>

              <button
                onClick={() => setCamOn(!camOn)}
                className={`p-3 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition-all ${
                  camOn
                    ? 'bg-[#3A281E] hover:bg-[#4E372A] text-[#FAF7F2] border border-[#523A2B]'
                    : 'bg-[#6B2418] text-[#FAF7F2] border border-[#8C3122]'
                }`}
              >
                {camOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{camOn ? 'Stop Video' : 'Start Video'}</span>
              </button>
            </div>

            {/* Center Share & Collab actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScreenSharing(!screenSharing)}
                className={`p-3 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition-all ${
                  screenSharing
                    ? 'bg-[#8F522C] text-[#FAF7F2] border border-[#B3683A]'
                    : 'bg-[#3A281E] hover:bg-[#4E372A] text-[#FAF7F2] border border-[#523A2B]'
                }`}
              >
                <ScreenShare className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {screenSharing ? 'Tutup Whiteboard' : 'Bagi Layar'}
                </span>
              </button>

              <button
                onClick={() => {
                  setChatOpen(!chatOpen);
                  if (participantsOpen) setParticipantsOpen(false);
                }}
                className={`p-3 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition-all ${
                  chatOpen ? 'bg-[#8F522C] text-[#FAF7F2]' : 'bg-[#3A281E] hover:bg-[#4E372A] text-[#FAF7F2]'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Chat</span>
              </button>

              <button
                onClick={() => {
                  setParticipantsOpen(!participantsOpen);
                  if (chatOpen) setChatOpen(false);
                }}
                className={`p-3 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition-all ${
                  participantsOpen ? 'bg-[#8F522C] text-[#FAF7F2]' : 'bg-[#3A281E] hover:bg-[#4E372A] text-[#FAF7F2]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Peserta ({PARTICIPANTS.length})</span>
              </button>
            </div>

            {/* Right Leave Button */}
            <button
              onClick={() => {
                setJoined(false);
                onClose();
              }}
              className="px-4 py-3 rounded-2xl bg-[#9E2B1B] hover:bg-[#852315] text-[#FAF7F2] text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              <span className="hidden sm:inline">Tinggalkan Sesi</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
