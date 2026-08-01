'use client';

import React, { useState } from 'react';
import { useIMS } from '@/context/IMSContext';
import { Bot, Send, Sparkles, X, User, CheckCircle, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export function AiBotDrawer() {
  const { isAiBotOpen, setIsAiBotOpen, students, feeTransactions, currentRole } = useIMS();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: `Hello! I am EduBot AI, your intelligent Institute assistant. How can I help you today? Ask me about fee dues, student attendance, timetables, or exam schedules!`,
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isAiBotOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = input.toLowerCase();
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botReply = "I'm analyzing the institute database for your query...";

      if (query.includes('fee') || query.includes('due') || query.includes('payment')) {
        const totalDue = students.reduce((acc, s) => acc + s.feeDue, 0);
        botReply = `📊 **Fee Overview**: Total fee due across active batches is ₹${totalDue.toLocaleString()}. Student Rohan Gupta has an overdue amount of ₹45,000. Would you like me to dispatch WhatsApp payment reminders?`;
      } else if (query.includes('attendance') || query.includes('absent')) {
        botReply = `📈 **Attendance Insight**: Average institute attendance today is 88.2%. 2 students (Rohan Gupta, Kabir Singh) require low-attendance review.`;
      } else if (query.includes('exam') || query.includes('result')) {
        botReply = `📝 **Exam Status**: Mid-Term Examinations 2026 results are 100% published for B.Tech CS. Highest GPA in batch is 3.98 (Priya Patel).`;
      } else if (query.includes('student') || query.includes('count')) {
        botReply = `🎓 **Enrolment Stats**: There are currently ${students.length} active demo student records registered across 3 campuses.`;
      } else {
        botReply = `🤖 **EduBot Intelligence**: I have recorded your query "${userMsg.text}". I can auto-generate custom reports, optimize room allocations, or forecast fee collections for you anytime!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 glass-panel-glow border-l border-slate-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              EduBot AI Assistant <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            </h3>
            <p className="text-[10px] text-purple-300">Online • Active for {currentRole}</p>
          </div>
        </div>
        <button
          onClick={() => setIsAiBotOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-purple-600/30 border border-purple-500/40 text-purple-300'
              }`}
            >
              {m.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
              }`}
            >
              <p>{m.text}</p>
              <span className="block text-[9px] opacity-60 text-right mt-1">{m.time}</span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span>EduBot is analyzing database...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask AI: e.g. 'Show pending fees'..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white hover:opacity-90 transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
