import React, { useState } from 'react';
import {
  Send,
  X,
  Phone,
  Video,
  Shield,
  Smile,
  Paperclip,
  CheckCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ChatMessage, UserRole } from '../types';

interface DirectChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    uid: string;
    displayName: string;
    role: UserRole;
    avatarUrl?: string;
  };
  onStartVoiceCall: () => void;
  onStartVideoCall: () => void;
}

export const DirectChatDrawer: React.FC<DirectChatDrawerProps> = ({
  isOpen,
  onClose,
  targetUser,
  onStartVoiceCall,
  onStartVideoCall,
}) => {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      conversationId: 'conv_default',
      senderUid: targetUser.uid,
      senderName: targetUser.displayName,
      senderRole: targetUser.role,
      recipientUid: userProfile?.uid || 'me',
      text: `Halo ${userProfile?.displayName || ''}! Saya siap mendampingi dan mendengarkan apa pun yang sedang Anda rasakan saat ini. Silakan bercerita dengan nyaman di ruang aman ini.`,
      timestamp: '10:00 WIB',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !userProfile) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: `conv_${userProfile.uid}_${targetUser.uid}`,
      senderUid: userProfile.uid,
      senderName: userProfile.displayName,
      senderRole: userProfile.role,
      recipientUid: targetUser.uid,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulated empathetic counselor/teacher auto-reply after 1.5s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_reply_${Date.now()}`,
          conversationId: `conv_${userProfile.uid}_${targetUser.uid}`,
          senderUid: targetUser.uid,
          senderName: targetUser.displayName,
          senderRole: targetUser.role,
          recipientUid: userProfile.uid,
          text: `Terima kasih telah berbagi dengan jujur. Saya memahami situasi tersebut tentu tidak mudah. Mari kita urai bersama-sama langkah terbaiknya.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        },
      ]);
    }, 1500);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#FAF7F2] border-l border-[#E2D5C7] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-[#382A22]">
      {/* Top Header */}
      <div className="p-4 bg-[#F5EFE8] border-b border-[#E2D5C7] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={targetUser.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'}
            alt={targetUser.displayName}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#7B543B]/20"
          />
          <div>
            <h4 className="font-bold text-sm text-[#382A22] leading-tight truncate max-w-[170px]">
              {targetUser.displayName}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#3EA05B]"></span>
              <span className="text-[11px] text-[#78665A] font-medium">Aktif di Ruang Konseling</span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onStartVoiceCall}
            className="p-2 rounded-xl text-[#6D5341] hover:bg-[#EAE1D6] hover:text-[#382A22] transition-colors"
            title="Panggilan Suara Langsung"
          >
            <Phone className="w-4 h-4 text-[#8C4F2B]" />
          </button>
          <button
            onClick={onStartVideoCall}
            className="p-2 rounded-xl text-[#6D5341] hover:bg-[#EAE1D6] hover:text-[#382A22] transition-colors"
            title="Panggilan Video Langsung"
          >
            <Video className="w-4 h-4 text-[#8C4F2B]" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A695E] hover:bg-[#EAE1D6] hover:text-[#382A22] transition-colors ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Safety & Confidentiality Badge */}
      <div className="px-4 py-2 bg-[#EFE6DC] border-b border-[#E2D5C7] flex items-center justify-center gap-1.5 text-[11px] text-[#715948]">
        <Shield className="w-3.5 h-3.5 text-[#5C8567]" />
        <span>Naungan Aman: Riwayat percakapan ini bersifat rahasia profesional.</span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {messages.map((m) => {
          const isMe = m.senderUid === userProfile?.uid;
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-[#867366] mb-1 px-1 font-medium">
                {isMe ? 'Anda' : m.senderName}
              </span>
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isMe
                    ? 'bg-[#553C2B] text-[#FAF7F2] rounded-tr-xs'
                    : 'bg-[#FFFFFF] text-[#382A22] border border-[#E2D5C7] rounded-tl-xs'
                }`}
              >
                <p>{m.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 text-[10px] mt-1.5 ${
                    isMe ? 'text-[#D9C4B3]' : 'text-[#8E7E73]'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#E0B594]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-[#F5EFE8] border-t border-[#E2D5C7]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tuliskan cerita, keluh kesah, atau pertanyaan..."
            className="flex-1 px-4 py-3 rounded-2xl bg-[#FFFFFF] border border-[#D8C9BB] text-xs sm:text-sm text-[#382A22] placeholder:text-[#998A7F] focus:outline-hidden focus:ring-2 focus:ring-[#834E2F]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-[#5E422F] hover:bg-[#483222] text-[#FAF7F2] shadow-sm transition-all disabled:opacity-40"
            aria-label="Kirim Pesan"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
