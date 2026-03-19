/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, MessageSquare, FileText, Settings, Plus, Bell, ChevronRight,
  ArrowLeft, MoreHorizontal, CheckCircle2, Clock, Zap, BrainCircuit,
  FolderOpen, Share2, Download, Search, Filter, User, ShieldCheck, Network,
  Database, Sparkles, Mic, Video, PenTool, History, LayoutGrid, Check,
  Pause, ArrowUp, Image
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Page =
  | 'dashboard'
  | 'assistant-execution'
  | 'task-flow'
  | 'asset-library'
  | 'file-detail'
  | 'today-report'
  | 'approval-hub'
  | 'approval-detail'
  | 'skill-packs'
  | 'assistant-detail'
  | 'org-structure'
  | 'comm-center'
  | 'settings';

type LogType = 'thinking' | 'tool' | 'done' | 'archive';

interface ActivityLog {
  id: number;
  time: string;
  type: LogType;
  text: string;
  agent: string;
}

// --- Activity Log Config ---
const logTypeConfig: Record<LogType, { emoji: string; label: string; color: string; bg: string; border: string }> = {
  thinking: { emoji: '🤔', label: '思考中', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  tool:     { emoji: '⚡', label: '工具调用', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  done:     { emoji: '✅', label: '完成', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  archive:  { emoji: '📚', label: '存档', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
};

const mockLogPool: Array<{ type: LogType; text: string; agent: string }> = [
  { type: 'thinking', text: 'Alan 正在设计Day2场景：机场问路对话', agent: 'Alan' },
  { type: 'tool',     text: '调用 Gemini 生成英语对话脚本 ⚡', agent: 'Alan' },
  { type: 'done',     text: 'Alan 完成轩轩 Day1 口语对话，得分 88 ✅', agent: 'Alan' },
  { type: 'archive',  text: '7天营家长手册已归档至资产库 📚', agent: '系统' },
  { type: 'thinking', text: '菲菲正在整理今日直播要点...', agent: '菲菲' },
  { type: 'tool',     text: '内容助手调用 Gemini 优化招募文案', agent: '内容助手' },
  { type: 'done',     text: '声音助手完成招募视频旁白配音 ✅', agent: '声音助手' },
  { type: 'archive',  text: 'Solo Spark 创始人故事已存入 Obsidian 📚', agent: '系统' },
  { type: 'done',     text: '透明办公室桌面版已部署上线 ✅', agent: '系统' },
  { type: 'thinking', text: '菲菲正在分析7天营用户反馈数据...', agent: '菲菲' },
];

function getTime() {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const initialLogs: ActivityLog[] = [
  { id: 1,  time: '06:00:00', type: 'done',     text: '透明办公室桌面版部署完成 office.solospark.org ✅', agent: '系统' },
  { id: 2,  time: '07:00:00', type: 'done',     text: '招募视频旁白音频生成完成 ✅', agent: '声音助手' },
  { id: 3,  time: '08:00:00', type: 'thinking', text: '菲菲发布今日计划，7天英语营项目启动 🌅', agent: '菲菲' },
  { id: 4,  time: '08:15:22', type: 'done',     text: 'Day1课程方案生成：主题"Hello, World!" ✅', agent: '内容助手' },
  { id: 5,  time: '08:20:10', type: 'archive',  text: '7天营家长手册存入资产库 📚', agent: '系统' },
  { id: 6,  time: '08:25:33', type: 'thinking', text: 'Alan 开始与轩轩进行Day1口语对话练习', agent: 'Alan' },
  { id: 7,  time: '08:28:44', type: 'tool',     text: '调用 Gemini 生成个性化对话反馈报告', agent: 'Alan' },
  { id: 8,  time: '08:30:01', type: 'done',     text: 'Alan 完成轩轩 Day1 对话，得分 88分 ✅', agent: 'Alan' },
  { id: 9,  time: '08:31:15', type: 'archive',  text: '轩轩学习记录已归档，进度已更新 📚', agent: '系统' },
  { id: 10, time: '08:32:00', type: 'thinking', text: '菲菲正在整理今日直播逐字稿...', agent: '菲菲' },
];

// --- Left Sidebar ---
const LeftSidebar = ({ active, onChange }: { active: string; onChange: (p: Page) => void }) => {
  const navItems = [
    { id: 'dashboard',    label: '仪表盘',   icon: LayoutDashboard },
    { id: 'task-flow',    label: '任务流',   icon: Zap },
    { id: 'comm-center',  label: '沟通中心', icon: MessageSquare },
    { id: 'today-report', label: '报告',     icon: FileText },
    { id: 'settings',     label: '设置',     icon: Settings },
  ];
  const quickItems = [
    { id: 'asset-library',  label: '资产库',   icon: Database },
    { id: 'org-structure',  label: '组织结构', icon: Network },
    { id: 'skill-packs',    label: '技能包',   icon: BrainCircuit },
    { id: 'approval-hub',   label: '审核中枢', icon: ShieldCheck },
  ];

  return (
    <aside className="hidden lg:flex w-56 shrink-0 bg-[#141414] flex-col border-r border-white/5 h-screen overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-[18px] border-b border-white/5 flex items-center gap-3">
        <div className="size-8 bg-gradient-to-tr from-[#eead2b] to-[#d4af37] rounded-xl flex items-center justify-center shadow-lg shadow-[#eead2b]/30 shrink-0">
          <Sparkles size={15} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-black text-white text-[15px] tracking-tight">Solo Spark</span>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto hide-scrollbar">
        <p className="text-white/20 text-[9px] font-black uppercase tracking-widest px-3 pb-1.5">主导航</p>
        <div className="space-y-0.5">
          {navItems.map(item => (
            <motion.button
              key={item.id}
              whileHover={{ x: 1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(item.id as Page)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-left",
                active === item.id
                  ? "bg-[#eead2b]/15 text-[#eead2b] border border-[#eead2b]/20"
                  : "text-white/45 hover:text-white/75 hover:bg-white/5"
              )}
            >
              <item.icon size={16} strokeWidth={active === item.id ? 2.5 : 2} className="shrink-0" />
              {item.label}
              {active === item.id && <div className="ml-auto size-1.5 rounded-full bg-[#eead2b]" />}
            </motion.button>
          ))}
        </div>

        <p className="text-white/20 text-[9px] font-black uppercase tracking-widest px-3 pb-1.5 mt-5">快捷入口</p>
        <div className="space-y-0.5">
          {quickItems.map(item => (
            <motion.button
              key={item.id}
              whileHover={{ x: 1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(item.id as Page)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-left",
                active === item.id
                  ? "bg-[#eead2b]/15 text-[#eead2b] border border-[#eead2b]/20"
                  : "text-white/35 hover:text-white/65 hover:bg-white/5"
              )}
            >
              <item.icon size={15} strokeWidth={1.5} className="shrink-0" />
              {item.label}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Bottom: AI status + Serena CEO */}
      <div className="px-4 py-3 border-t border-white/5 space-y-2">
        <div className="flex items-center gap-2 px-2">
          <div className="size-1.5 rounded-full bg-[#eead2b] animate-pulse" />
          <span className="text-white/25 text-[9px] font-bold uppercase tracking-widest">AI 算力充足</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/5 border border-white/5">
          <div className="size-9 rounded-xl bg-gradient-to-tr from-[#eead2b]/30 to-[#d4af37]/20 flex items-center justify-center border border-[#eead2b]/20 shrink-0">
            <User size={16} className="text-[#eead2b]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-black truncate leading-tight">Serena Mitchell</p>
            <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest truncate">CEO · Solo Spark</p>
          </div>
          <div className="size-2 rounded-full bg-green-400 animate-pulse shrink-0" />
        </div>
      </div>
    </aside>
  );
};

// --- Right Activity Log ---
const RightActivityLog = ({ logs }: { logs: ActivityLog[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <aside className="hidden lg:flex w-80 shrink-0 bg-[#141414] flex-col border-l border-white/5 h-screen overflow-hidden">
      <div className="px-5 py-[18px] border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-white text-sm font-black">实时动态</h3>
          <p className="text-white/25 text-[9px] font-bold uppercase tracking-widest mt-0.5">AI 团队故事线</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/30 text-[10px] font-bold">直播中</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 hide-scrollbar">
        {logs.map(log => {
          const cfg = logTypeConfig[log.type];
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className={cn('flex gap-2.5 p-3 rounded-2xl border', cfg.bg, cfg.border)}
            >
              <span className="text-sm shrink-0 mt-0.5">{cfg.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={cn('text-[9px] font-black uppercase tracking-widest truncate', cfg.color)}>{log.agent}</span>
                  <span className="text-white/20 text-[9px] font-bold shrink-0">{log.time}</span>
                </div>
                <p className="text-white/60 text-[11px] leading-relaxed">{log.text}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="px-4 py-3 border-t border-white/5 grid grid-cols-2 gap-x-2 gap-y-1.5">
        {(Object.entries(logTypeConfig) as [LogType, typeof logTypeConfig[LogType]][]).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="text-[11px]">{cfg.emoji}</span>
            <span className={cn('text-[9px] font-bold', cfg.color)}>{cfg.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

// --- Shared Header Components (Dark Mode) ---
const Header = ({ title, subtitle, rightElement }: {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}) => (
  <header className="sticky top-0 z-40 bg-[#111111]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-white/5">
    <div>
      <h1 className="text-2xl font-black tracking-tight text-white">{title}</h1>
      {subtitle && <p className="text-xs font-bold text-white/35 mt-1">{subtitle}</p>}
    </div>
    {rightElement || (
      <button className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/8">
        <Bell size={19} className="text-white/45" />
      </button>
    )}
  </header>
);

const SecondaryHeader = ({ title, source, onBack, rightIcon: RightIcon = MoreHorizontal, onRightClick }: {
  title: string;
  source?: string;
  onBack: () => void;
  rightIcon?: React.ComponentType<{ size?: number; className?: string }>;
  onRightClick?: () => void;
}) => (
  <header className="sticky top-0 z-40 bg-[#111111]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-white/5">
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onBack}
      className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10"
    >
      <ArrowLeft size={19} className="text-white/60" />
    </motion.button>
    <div className="text-center">
      <h1 className="text-base font-black tracking-tight text-white">{title}</h1>
      {source && <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">来源：{source}</p>}
    </div>
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onRightClick}
      className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10"
    >
      <RightIcon size={19} className="text-white/60" />
    </motion.button>
  </header>
);

// --- Page Views ---

const ChatInputBox = () => {
  const [msg, setMsg] = React.useState('');
  const [messages, setMessages] = React.useState([
    { role: 'feifei', text: '早上好 Serena 🌸 今日7天英语营Day1准备就绪，Alan已上线，随时可以发布任务！' },
  ]);
  const [loading, setLoading] = React.useState(false);
  const send = async () => {
    if (!msg.trim() || loading) return;
    const userMsg = msg.trim();
    setMessages(prev => [...prev, { role: 'serena', text: userMsg }]);
    setMsg('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'feifei', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'feifei', text: '网络波动，稍后再试 🌸' }]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="rounded-2xl overflow-hidden" style={{background:'#1a1a2a', border:'1px solid rgba(238,173,43,0.15)'}}>
      {/* 标题栏 */}
      <div className="px-4 py-2.5 flex items-center gap-2" style={{background:'#1e1e30', borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <span className="text-base">🌸</span>
        <span className="text-xs font-black text-white tracking-wide">菲菲</span>
        <span className="size-1.5 rounded-full bg-green-400 animate-pulse ml-0.5" />
        <span className="text-[10px] text-green-400/80 font-bold">在线</span>
      </div>
      {/* 消息区 */}
      <div className="px-4 py-3 flex flex-col gap-2 max-h-32 overflow-y-auto hide-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={cn('flex gap-2 items-end', m.role === 'serena' ? 'flex-row-reverse' : '')}>
            <span className="text-sm shrink-0 mb-0.5">{m.role === 'feifei' ? '🌸' : '👤'}</span>
            <div className={cn(
              'text-sm px-3 py-2 rounded-2xl max-w-[78%] leading-relaxed',
              m.role === 'feifei'
                ? 'text-[#f5e6a8] rounded-bl-sm'
                : 'text-white rounded-br-sm'
            )} style={{
              background: m.role === 'feifei' ? 'rgba(238,173,43,0.12)' : 'rgba(139,92,246,0.25)',
              border: m.role === 'feifei' ? '1px solid rgba(238,173,43,0.2)' : '1px solid rgba(139,92,246,0.3)'
            }}>{m.text}</div>
          </div>
        ))}
      </div>
      {/* 输入区 */}
      <div className="px-3 py-2.5 flex gap-2 items-center" style={{background:'#16162a', borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={loading ? '菲菲思考中...' : '跟菲菲说点什么...'}
          disabled={loading}
          className="flex-1 rounded-xl px-3.5 py-2 text-sm placeholder:text-white/30 focus:outline-none disabled:opacity-50"
          style={{background:'#252540', border:'1px solid rgba(139,92,246,0.25)', color:'#ffffff'}}
        />
        <button onClick={send} disabled={loading} className="px-4 py-2.5 bg-[#eead2b] text-[#0f0f0f] text-sm font-black rounded-xl hover:bg-[#f5c242] transition-colors disabled:opacity-50">
          {loading ? '...' : '发送'}
        </button>
      </div>
    </div>
  );
};

const DashboardChat = () => {
  const [msg, setMsg] = React.useState('');
  const [messages, setMessages] = React.useState([
    { role: 'feifei', text: '早上好 Serena 🌸 今日7天英语营Day1准备就绪，Alan已上线，随时可以发布任务！' },
  ]);
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 50);
  };
  React.useEffect(() => { scrollToBottom(); }, [messages]);
  React.useEffect(() => { inputRef.current?.focus(); }, []);
  const send = async () => {
    if (!msg.trim() || loading) return;
    const userMsg = msg.trim();
    setMessages(prev => [...prev, { role: 'serena', text: userMsg }]);
    setMsg('');
    scrollToBottom();
    inputRef.current?.focus();
    setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userMsg }) });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'feifei', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'feifei', text: '网络波动，稍后再试 🌸' }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };
  return (
    <>
      {/* 消息滚动区 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2 hide-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={cn('flex gap-2 items-end', m.role === 'serena' ? 'flex-row-reverse' : '')}>
            <span className="text-sm shrink-0">{m.role === 'feifei' ? '🌸' : '👤'}</span>
            <div className="text-sm px-3 py-2 max-w-[78%] leading-relaxed" style={{
              background: m.role === 'feifei' ? 'rgba(238,173,43,0.12)' : '#1a3050',
              border: m.role === 'feifei' ? '1px solid rgba(238,173,43,0.2)' : '1px solid rgba(30,100,180,0.4)',
              color: '#eead2b',
              borderRadius: m.role === 'feifei' ? '16px 16px 16px 4px' : '16px 16px 4px 16px'
            }}>{m.text}</div>
          </div>
        ))}
        {loading && <div className="flex gap-2"><span className="text-sm">🌸</span><div className="text-xs text-white/30 px-3 py-2" style={{background:'rgba(238,173,43,0.08)', borderRadius:'16px 16px 16px 4px'}}>思考中...</div></div>}
      </div>
      {/* 输入框（固定不动） */}
      <div className="shrink-0 px-3 py-2.5 flex gap-2 items-center" style={{background:'#16162a', borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={loading ? '菲菲思考中...' : '跟菲菲说点什么...'}
          disabled={loading}
          ref={inputRef}
          autoFocus
          className="flex-1 rounded-xl px-3.5 py-2 text-sm focus:outline-none disabled:opacity-50"
          style={{background:'#f0eefc', border:'1px solid rgba(139,92,246,0.3)', color:'#1a1a2a', colorScheme:'light'}}
        />
        <button onClick={send} disabled={loading} className="px-4 py-2 text-sm font-black rounded-xl disabled:opacity-50 transition-colors" style={{background:'#eead2b', color:'#0f0f0f'}}>
          {loading ? '...' : '发送'}
        </button>
      </div>
    </>
  );
};

const DashboardView = ({ onNavigate }: { onNavigate: (p: Page, item?: any) => void }) => {
  const agents = [
    { id: 'feifei',  name: '菲菲',   role: '指挥官',   status: '执行中',   detail: '正在整理直播逐字稿...',       progress: 78,  emoji: '🌸' },
    { id: 'alan',    name: 'Alan',   role: '英语教练', status: '执行中',   detail: '与轩轩进行Day1口语练习中',    progress: 60,  emoji: '🎤' },
    { id: 'content', name: '内容助手', role: '内容策划', status: '等待确认', detail: '7天营Day1课程方案已生成',     progress: 100, emoji: '✍️' },
    { id: 'voice',   name: '声音助手', role: '声音制作', status: '已完成',   detail: '招募视频旁白配音完成',        progress: 100, emoji: '🔊' },
  ];

  return (
    <div className="flex flex-col h-full gap-3 p-0">
      <Header title="仪表盘" subtitle="您的 AI 团队已就绪" />

      {/* Agent Cards - 4 in a row */}
      <section className="px-6">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-base font-black text-white tracking-tight">团队看板</h2>
          <span className="text-[9px] font-black text-white/25 uppercase tracking-widest">实时状态</span>
        </div>
        <div className="grid grid-cols-4 gap-3 px-4">
          {agents.map(agent => (
            <motion.div
              key={agent.id}
              whileHover={{ y: -2, borderColor: 'rgba(238,173,43,0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate(agent.id === 'feifei' ? 'assistant-execution' : 'assistant-detail', agent)}
              className="bg-[#1c1c1c] border border-white/8 rounded-xl p-2.5 flex flex-col items-center text-center cursor-pointer transition-all"
            >
              <div className="relative mb-2">
                <div className="size-10 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                  <span className="text-2xl">{(agent as any).emoji || '🤖'}</span>
                </div>
                {agent.status === '执行中' && (
                  <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-green-500 rounded-full border border-[#1c1c1c] animate-pulse" />
                )}
                {agent.status === '等待确认' && (
                  <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-orange-500 rounded-full border border-[#1c1c1c]" />
                )}
              </div>
              <p className="text-white text-xs font-black tracking-tight">{agent.name}</p>
              <span className="text-white/35 text-[8px] font-bold mt-0.5 uppercase tracking-widest">{agent.role}</span>
              <span className={cn(
                'mt-1.5 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-[0.15em]',
                agent.status === '执行中'   ? 'bg-[#eead2b]/15 text-[#eead2b]' :
                agent.status === '等待确认' ? 'bg-orange-500/15 text-orange-400' :
                'bg-white/5 text-white/30'
              )}>
                {agent.status}
              </span>
              {agent.progress > 0 && agent.progress < 100 && (
                <div className="w-full mt-3 bg-white/5 h-1 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.progress}%` }}
                    className="bg-[#eead2b] h-full rounded-full"
                  />
                </div>
              )}
              <p className="text-white/25 text-[9px] mt-2 line-clamp-1">{agent.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest News */}
      <section className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black text-white tracking-tight">最新动态</h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('today-report')}
            className="text-[10px] font-black text-[#eead2b] uppercase tracking-widest"
          >
            查看全部
          </motion.button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('today-report')}
            className="flex gap-4 p-5 rounded-[20px] bg-[#1c1c1c] border border-white/8 cursor-pointer hover:border-[#eead2b]/20 transition-all"
          >
            <div className="size-11 rounded-xl bg-[#eead2b]/10 flex items-center justify-center shrink-0">
              <Sparkles size={22} className="text-[#eead2b]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">7天英语营 · Day1课程就绪</p>
              <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">Alan已上线，轩轩等8位学员今日开始口语练习。</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="size-1.5 rounded-full bg-[#eead2b]" />
                <p className="text-[9px] font-black text-[#eead2b] uppercase tracking-widest">2分钟前</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('approval-hub')}
            className="flex gap-4 p-5 rounded-[20px] bg-[#1c1c1c] border border-orange-500/20 cursor-pointer hover:border-orange-500/40 transition-all"
          >
            <div className="size-11 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={22} className="text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">1 项内容待您审核</p>
              <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">AI调色盘创始人文章已完成，等待Serena审阅发布。</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="size-1.5 rounded-full bg-orange-400 animate-pulse" />
                <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest">需要关注</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 手机：快捷入口 */}
      {/* 手机快捷入口 */}
      <section className="px-6 lg:hidden">
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: Database,   label: '资产库',   target: 'asset-library',  colorClass: 'bg-blue-500/10 text-blue-400' },
            { icon: LayoutGrid, label: '组织结构', target: 'org-structure',  colorClass: 'bg-indigo-500/10 text-indigo-400' },
            { icon: BrainCircuit, label: '技能包', target: 'skill-packs',   colorClass: 'bg-[#eead2b]/10 text-[#eead2b]' },
            { icon: CheckCircle2, label: '审核中枢', target: 'approval-hub', colorClass: 'bg-orange-500/10 text-orange-400' },
          ].map((item, i) => (
            <motion.div key={i} whileTap={{ scale: 0.93 }} onClick={() => onNavigate(item.target as Page)} className="flex flex-col items-center gap-2.5 cursor-pointer group">
              <div className={cn('size-14 rounded-2xl flex items-center justify-center border border-white/5', item.colorClass)}><item.icon size={24} /></div>
              <span className="text-[10px] font-bold text-white/40">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 桌面：对话框（填充剩余空间，消息滚动，输入框固定） */}
      <section className="hidden lg:flex flex-col flex-1 mx-4 mb-4 rounded-2xl overflow-hidden min-h-0" style={{background:'#1a1a2a', border:'1px solid rgba(238,173,43,0.15)'}}>
        {/* 标题栏 */}
        <div className="px-4 py-2.5 flex items-center gap-2 shrink-0" style={{background:'#1e1e30', borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
          <span className="text-base">🌸</span>
          <span className="text-xs font-black text-white tracking-wide">菲菲</span>
          <span className="size-1.5 rounded-full bg-green-400 animate-pulse ml-0.5" />
          <span className="text-[10px] text-green-400/80 font-bold">在线</span>
        </div>
        {/* 消息区（内部滚动） */}
        <DashboardChat />
      </section>
    </div>
  );
};

const TaskFlowView = ({ onNavigate }: { onNavigate: (p: Page, item?: any) => void }) => {
  const [activeTab, setActiveTab] = useState('全部');
  const tasks = [
    { title: '首页 Hero 文案优化',      person: '菲菲',        progress: 100, icon: BrainCircuit, status: '等待确认', priority: '重点关注', time: '10:30' },
    { title: 'Q4 财务数据自动化同步',  person: '数据助手 Alpha', progress: 40, icon: FileText,      status: '执行中',   time: '12:30' },
    { title: '品牌社交媒体推广方案',   person: '内容助手',     progress: 15,  icon: Share2,        status: '执行中',   time: '14:20' },
    { title: '竞品分析周报生成',       person: '智选助手',     progress: 0,   icon: Search,        status: '待整理',   time: '15:00' },
    { title: '昨日运营数据复盘',       person: '系统',         progress: 100, icon: History,       status: '已完成',   time: '09:00' },
  ];
  const filteredTasks = activeTab === '全部' ? tasks : tasks.filter(t => t.status === activeTab);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <Header
        title="任务流"
        subtitle="今天有 8 项任务正在推进"
        rightElement={
          <div className="flex gap-2">
            <button className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
              <Search size={17} className="text-white/40" />
            </button>
            <button className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
              <Filter size={17} className="text-white/40" />
            </button>
          </div>
        }
      />
      <nav className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 px-8">
        {['全部', '待整理', '执行中', '等待确认', '已完成'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'whitespace-nowrap px-5 py-2 rounded-full text-sm font-black transition-all',
              activeTab === tab
                ? 'bg-[#eead2b] text-white shadow-lg shadow-[#eead2b]/20'
                : 'bg-white/5 text-white/40 border border-white/8 hover:bg-white/8'
            )}
          >
            {tab}
          </button>
        ))}
      </nav>
      <section className="space-y-4 px-8">
        {filteredTasks.map((task, i) => (
          <div key={i}>
            {task.priority && (
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">重点关注</h3>
                <span className="h-[1px] flex-1 bg-white/5 ml-4" />
              </div>
            )}
            <motion.div
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                if (task.status === '等待确认') onNavigate('approval-hub', task);
                else if (task.status === '已完成') onNavigate('asset-library', task);
                else onNavigate('assistant-execution', task);
              }}
              className={cn(
                'relative bg-[#1c1c1c] rounded-[24px] p-6 border cursor-pointer overflow-hidden transition-all hover:border-white/15',
                task.status === '等待确认' ? 'border-orange-500/30 ring-1 ring-orange-500/10' : 'border-white/8'
              )}
            >
              <div className="flex justify-between items-start mb-4">
                {task.priority ? (
                  <span className="px-3 py-1 bg-orange-500/15 text-orange-400 text-[10px] font-black rounded-full uppercase tracking-widest">{task.priority}</span>
                ) : (
                  <span className="text-white/25 text-[10px] font-black uppercase tracking-widest">{task.time}</span>
                )}
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'size-2 rounded-full',
                    task.status === '执行中'   ? 'bg-[#eead2b] animate-pulse' :
                    task.status === '等待确认' ? 'bg-orange-500 animate-pulse' :
                    task.status === '已完成'   ? 'bg-green-500' : 'bg-white/20'
                  )} />
                  <span className={cn(
                    'text-[10px] font-black uppercase tracking-widest',
                    task.status === '执行中'   ? 'text-[#eead2b]' :
                    task.status === '等待确认' ? 'text-orange-400' :
                    task.status === '已完成'   ? 'text-green-400' : 'text-white/30'
                  )}>{task.status}</span>
                </div>
              </div>
              <div className="flex gap-4 mb-5">
                <div className={cn(
                  'size-12 rounded-2xl flex items-center justify-center shrink-0',
                  task.status === '执行中'   ? 'bg-[#eead2b]/10 text-[#eead2b]' :
                  task.status === '等待确认' ? 'bg-orange-500/10 text-orange-400' :
                  task.status === '已完成'   ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/25'
                )}>
                  <task.icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-black leading-tight mb-1 truncate text-white">{task.title}</h2>
                  <p className="text-xs text-white/35 font-medium">执行人: {task.person}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/30">当前进度</span>
                  <span className={cn(
                    task.status === '执行中'   ? 'text-[#eead2b]' :
                    task.status === '等待确认' ? 'text-orange-400' :
                    task.status === '已完成'   ? 'text-green-400' : 'text-white/20'
                  )}>{task.progress}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    className={cn('h-full rounded-full',
                      task.status === '执行中'   ? 'bg-[#eead2b]' :
                      task.status === '等待确认' ? 'bg-orange-500' :
                      task.status === '已完成'   ? 'bg-green-500' : 'bg-white/15'
                    )}
                  />
                </div>
              </div>
              {task.status === '等待确认' && (
                <div className="mt-5 flex gap-3">
                  <button className="flex-1 py-3 bg-orange-500 text-white text-xs font-black rounded-xl shadow-lg shadow-orange-500/20 uppercase tracking-widest">去审核</button>
                  <button className="px-5 py-3 bg-white/5 text-white/30 text-xs font-black rounded-xl border border-white/8 uppercase tracking-widest">稍后</button>
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </section>
    </div>
  );
};

const AssistantExecutionView = ({ onBack, onNavigate, source, item }: { onBack: () => void; onNavigate: (p: Page, item?: any) => void; source?: string; item?: any }) => {
  const [messages, setMessages] = useState([
    { time: '08:23', icon: FileText,      text: `${item?.name || '菲菲'} 接到任务：${item?.title || '写7天营宣发文案'}`,   color: 'slate' },
    { time: '08:24', icon: BrainCircuit,  text: `${item?.name || '菲菲'} 正在构思框架...`,                                  progress: 65, color: 'blue' },
    { time: '08:25', icon: Zap,           text: `${item?.name || '菲菲'} 调用 Gemini 生成初稿...`,                          color: 'amber' },
    { time: '08:26', icon: CheckCircle2,  text: `${item?.name || '菲菲'} 初稿完成，已存入资产库`,                           file: `${item?.title || '7天营宣发文案'}_初稿.docx`, color: 'green' },
    { time: '08:27', icon: History,       text: `${item?.name || '菲菲'} 将相关参考资料存入归档`,                           color: 'purple' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: User,
      text: `我：${inputValue}`,
      color: 'primary'
    }]);
    setInputValue('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: Sparkles,
        text: `${item?.name || '菲菲'}：收到指令，正在为您处理...`,
        color: 'primary'
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#111111]">
      <SecondaryHeader
        title={item?.title || '单个助手执行页'}
        source={source}
        onBack={onBack}
        rightIcon={MoreHorizontal}
      />
      <main className="flex-1 overflow-y-auto p-8 space-y-5 hide-scrollbar">
        {messages.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="flex gap-4 items-start"
          >
            <div className={cn(
              'mt-1 flex-shrink-0 size-9 rounded-xl flex items-center justify-center border border-white/10',
              step.color === 'blue'    ? 'bg-blue-500/10 text-blue-400' :
              step.color === 'amber'   ? 'bg-[#eead2b]/10 text-[#eead2b]' :
              step.color === 'green'   ? 'bg-green-500/10 text-green-400' :
              step.color === 'purple'  ? 'bg-purple-500/10 text-purple-400' :
              step.color === 'primary' ? 'bg-[#eead2b]/10 text-[#eead2b]' :
              'bg-white/5 text-white/40'
            )}>
              <step.icon size={17} />
            </div>
            <div className="flex-1 bg-[#1c1c1c] p-5 rounded-2xl border border-white/8">
              <span className="text-[10px] font-black text-white/25 uppercase tracking-widest">{step.time}</span>
              <p className="text-white/75 text-sm leading-relaxed font-medium mt-1.5">{step.text}</p>
              {'progress' in step && step.progress && (
                <div className="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${step.progress}%` }}
                    className="bg-blue-400 h-full rounded-full"
                  />
                </div>
              )}
              {'file' in step && step.file && (
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('asset-library')}
                  className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8 text-[11px] cursor-pointer hover:bg-white/8 transition-all"
                >
                  <div className="size-9 rounded-xl bg-[#1c1c1c] flex items-center justify-center border border-white/10">
                    <FileText size={18} className="text-[#eead2b]" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="font-black truncate text-white/80">{step.file}</p>
                    <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">点击查看资产详情</p>
                  </div>
                  <ChevronRight size={16} className="text-white/20" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </main>
      <footer className="p-6 bg-[#141414] border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              className="w-full pl-5 pr-11 py-3.5 bg-[#1c1c1c] border border-white/8 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#eead2b]/30 placeholder:text-white/20 text-white/80"
              placeholder="给菲菲发送指令..."
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#eead2b] transition-colors">
              <Mic size={18} />
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className="size-12 rounded-xl bg-[#eead2b] text-white flex items-center justify-center shadow-xl shadow-[#eead2b]/25"
          >
            <ArrowUp size={20} strokeWidth={3} />
          </motion.button>
        </div>
      </footer>
    </div>
  );
};

const TodayReportView = ({ onNavigate }: { onNavigate: (p: Page, item?: any) => void }) => {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <Header title="报告" subtitle="AI 团队正在为你总结今日推进成果" />
      <div className="px-8 space-y-6">
        <motion.section
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('assistant-detail', { id: 'feifei', name: '菲菲' })}
          className="relative overflow-hidden rounded-2xl bg-[#1c1c1c] p-6 border border-[#eead2b]/15 cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sparkles size={80} className="text-[#eead2b]" />
          </div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#eead2b] mb-4 flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#eead2b] animate-pulse" />
            核心摘要
          </h2>
          <p className="text-base leading-relaxed font-medium text-white/80">
            菲菲今天完成了 <span className="text-[#eead2b] text-2xl font-bold">3</span> 项任务，沉淀了 <span className="text-[#eead2b] text-2xl font-bold">2</span> 份资产，仍有 <span className="text-[#eead2b] text-2xl font-bold">1</span> 项等待确认。
          </p>
        </motion.section>

        <section className="grid grid-cols-4 gap-4">
          {[
            { icon: CheckCircle2, val: '3', label: '今日完成任务', colorClass: 'text-green-400 bg-green-500/10',  onClick: () => onNavigate('task-flow') },
            { icon: Clock,        val: '1', label: '当前阻塞事项', colorClass: 'text-orange-400 bg-orange-500/10', onClick: () => onNavigate('approval-hub') },
            { icon: Database,     val: '2', label: '新增沉淀资产', colorClass: 'text-[#eead2b] bg-[#eead2b]/10',   onClick: () => onNavigate('asset-library') },
            { icon: BrainCircuit, val: 'AI', label: '效率提升 15%', colorClass: 'text-[#eead2b] bg-[#eead2b]/10', onClick: undefined },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileTap={item.onClick ? { scale: 0.96 } : {}}
              onClick={item.onClick}
              className={cn('bg-[#1c1c1c] p-5 rounded-2xl border border-white/8 transition-all', item.onClick && 'cursor-pointer hover:border-white/15')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn('size-9 rounded-xl flex items-center justify-center', item.colorClass)}>
                  <item.icon size={18} />
                </div>
                <span className="text-2xl font-bold text-white">{item.val}</span>
              </div>
              <p className="text-[10px] text-white/35 font-bold uppercase tracking-wider">{item.label}</p>
            </motion.div>
          ))}
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-bold text-white/60 flex items-center gap-2">
            <User size={15} /> 助手表现
          </h3>
          {[
            { name: '内容助手', status: '已完成', task: '完成 7 天文案初稿', icon: PenTool },
            { name: '视频助手', status: '进行中', task: '脚本已生成，等待素材', icon: Video },
          ].map((as, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('assistant-detail')}
              className="flex items-center gap-4 bg-[#1c1c1c] p-4 rounded-2xl border border-white/8 cursor-pointer hover:border-white/12 transition-all"
            >
              <div className="size-11 rounded-full bg-[#eead2b]/10 flex items-center justify-center">
                <as.icon size={19} className="text-[#eead2b]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-white">{as.name}</h4>
                  <span className={cn('text-[8px] px-2 py-0.5 rounded-full font-bold', as.status === '已完成' ? 'bg-green-500/10 text-green-400' : 'bg-[#eead2b]/10 text-[#eead2b]')}>
                    {as.status}
                  </span>
                </div>
                <p className="text-xs text-white/35 mt-1">{as.task}</p>
              </div>
            </motion.div>
          ))}
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-bold text-white/60 flex items-center gap-2">
            <Database size={15} /> 最近沉淀资产
          </h3>
          {[
            { name: '7天营宣发文案_初稿.docx', type: 'DOCX', size: '24KB', time: '10:26' },
            { name: '品牌视觉规范_V1.pdf',     type: 'PDF',  size: '1.2MB', time: '09:45' },
          ].map((file, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('file-detail')}
              className="flex items-center gap-4 bg-[#1c1c1c] p-4 rounded-2xl border border-white/8 cursor-pointer hover:border-white/12 transition-all"
            >
              <div className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-[#eead2b]">
                <FileText size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm truncate text-white">{file.name}</h4>
                <p className="text-[10px] text-white/30 mt-1 uppercase font-bold tracking-widest">{file.type} · {file.size} · {file.time}</p>
              </div>
              <ChevronRight size={15} className="text-white/20" />
            </motion.div>
          ))}
        </section>

        <motion.button
          whileTap={{ scale: 0.96 }}
          className="w-full mt-2 py-4 bg-white/5 text-white/60 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-white/8 hover:bg-white/8 transition-all"
        >
          <Download size={19} />
          下载完整 PDF 报告
        </motion.button>
      </div>
    </div>
  );
};

const ApprovalHubView = ({ onBack, onNavigate, source }: { onBack: () => void; onNavigate: (p: Page, item?: any) => void; source?: string }) => {
  const [items, setItems] = useState([
    { id: 1, title: '首页 Hero 标题方案',   from: '菲菲', time: '10:30', status: '等待确认', type: 'suggestion', content: '方案二转化率预估提升 15%，更符合目标女性创业者语境。' },
    { id: 2, title: '7天营宣发文案初稿',   from: '菲菲', time: '昨天 18:45', status: '等待确认', type: 'draft',      content: '"在这个充满不确定性的时代，每一位女性都是自己生活的微光。Solo Spark 助你点亮这份火花..."' },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAction = (id: number, action: string) => {
    if (action === '通过' && items.length === 1) setShowSuccess(true);
    setItems(items.filter(item => item.id !== id));
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-8 text-center bg-[#111111] py-24">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="size-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-2xl shadow-green-500/20"
        >
          <Check size={48} strokeWidth={4} />
        </motion.div>
        <h2 className="text-3xl font-black mb-4 tracking-tight text-white">审核发布成功</h2>
        <p className="text-white/40 mb-12 leading-relaxed">您的决策已同步至 AI 团队，任务将继续推进。</p>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onNavigate('task-flow')}
          className="px-12 bg-[#eead2b] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#eead2b]/25"
        >
          返回任务流
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <SecondaryHeader title="审核中枢" source={source} onBack={onBack} rightIcon={Search} />
      <div className="px-8 space-y-5">
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest">{items.length} 项内容等待 Serena 拍板</p>
        <AnimatePresence mode="popLayout">
          {items.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 50 }}
              onClick={() => onNavigate('approval-detail', item)}
              className="bg-[#1c1c1c] rounded-2xl p-6 border border-orange-500/20 cursor-pointer hover:border-orange-500/35 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-orange-500/15 text-orange-400">{item.status}</span>
                <span className="text-white/25 text-[10px] font-medium">{item.time}</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
              <div className="flex items-center gap-2 mb-5">
                <div className="size-8 rounded-full bg-[#eead2b]/10 flex items-center justify-center">
                  <User size={15} className="text-[#eead2b]" />
                </div>
                <span className="text-white/40 text-xs font-medium">来自 {item.from} 的提交</span>
              </div>
              {item.type === 'suggestion' ? (
                <div className="bg-[#eead2b]/5 p-4 rounded-xl mb-5 border-l-4 border-[#eead2b]/40">
                  <p className="text-[10px] text-[#eead2b] font-bold mb-2 flex items-center gap-1 uppercase tracking-widest">
                    <Zap size={11} /> AI 建议
                  </p>
                  <p className="text-sm text-white/55 leading-relaxed">{item.content}</p>
                </div>
              ) : (
                <div className="bg-white/5 rounded-xl p-4 italic text-sm text-white/45 mb-5 leading-relaxed border border-white/8">
                  {item.content}
                </div>
              )}
              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleAction(item.id, '通过')}
                  className="flex-1 bg-[#eead2b] text-white py-3 rounded-xl text-sm font-black shadow-lg shadow-[#eead2b]/20 uppercase tracking-widest"
                >通过</motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleAction(item.id, '修改')}
                  className="flex-1 border border-white/10 text-white/40 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                >修改</motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleAction(item.id, '暂停')}
                  className="px-4 border border-white/10 text-white/30 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                ><Pause size={17} /></motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && !showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-white/20"
          >
            <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="opacity-30" />
            </div>
            <p className="font-medium text-white/30">暂无待审核事项</p>
            <p className="text-xs mt-2 opacity-60">你的团队运行非常高效</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const ApprovalDetailView = ({ onBack, onNavigate, source, item }: { onBack: () => void; onNavigate: (p: Page, item?: any) => void; source?: string; item?: any }) => (
  <div className="flex flex-col gap-7 pb-10">
    <SecondaryHeader title={item?.title || '审核详情'} source={source} onBack={onBack} />
    <div className="px-8 space-y-6">
      <div className="bg-[#1c1c1c] p-7 rounded-2xl border border-[#eead2b]/15">
        <div className="flex justify-between items-start mb-5">
          <span className="bg-orange-500/15 text-orange-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{item?.status || '等待确认'}</span>
          <span className="text-white/25 text-[10px] font-medium">{item?.time || '10:30'}</span>
        </div>
        <h2 className="text-2xl font-black mb-5 leading-tight text-white">{item?.title || '首页 Hero 标题方案'}</h2>
        <div className="flex items-center gap-3 mb-7">
          <div className="size-10 rounded-xl bg-[#eead2b]/10 flex items-center justify-center">
            <User size={19} className="text-[#eead2b]" />
          </div>
          <div>
            <p className="text-sm font-black text-white">{item?.from || '菲菲'}</p>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">AI 助手</p>
          </div>
        </div>
        <div className="space-y-5">
          <div className="p-5 bg-white/5 rounded-2xl border border-white/8">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">提交内容</p>
            <p className="text-base text-white/70 leading-relaxed font-medium">{item?.content || '内容加载中...'}</p>
          </div>
          <div className="p-5 bg-[#eead2b]/5 rounded-2xl border border-[#eead2b]/15">
            <p className="text-[10px] font-black text-[#eead2b] uppercase tracking-widest mb-2 flex items-center gap-2">
              <Zap size={13} /> AI 推荐理由
            </p>
            <p className="text-sm text-white/55 leading-relaxed">方案二转化率预估提升 15%，更符合目标女性创业者语境，情感共鸣更强。</p>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onBack()}
          className="flex-1 bg-[#eead2b] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#eead2b]/20"
        >通过并发布</motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          className="flex-1 border-2 border-white/8 text-white/40 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-all"
        >要求修改</motion.button>
      </div>
    </div>
  </div>
);

const AssetLibraryView = ({ onBack, onNavigate, source }: { onBack: () => void; onNavigate: (p: Page, item?: any) => void; source?: string }) => (
  <div className="flex flex-col gap-6 pb-10">
    <SecondaryHeader title="资产库" source={source} onBack={onBack} rightIcon={Search} />
    <div className="px-8 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { title: '文案模板', icon: FileText,    sub: '助手: 菲菲' },
          { title: '知识归档', icon: BrainCircuit, sub: '助手: 智选' },
          { title: '脚本草稿', icon: Video,        sub: '助手: 菲菲' },
          { title: '复盘总结', icon: History,      sub: '助手: 系统' },
        ].map((cat, i) => (
          <motion.div
            key={i}
            whileTap={{ scale: 0.95 }}
            className="bg-[#1c1c1c] p-5 rounded-2xl border border-white/8 flex flex-col gap-3 cursor-pointer hover:border-[#eead2b]/20 transition-all"
          >
            <div className="size-11 rounded-xl bg-[#eead2b]/10 flex items-center justify-center text-[#eead2b]">
              <cat.icon size={22} />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">{cat.title}</h3>
              <p className="text-[10px] text-white/30 mt-0.5 font-bold uppercase tracking-widest">{cat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-black tracking-tight text-white">近期重点资产</h2>
        <motion.button whileTap={{ scale: 0.95 }} className="text-[10px] text-[#eead2b] font-black uppercase tracking-widest">查看全部</motion.button>
      </div>
      <motion.div
        whileTap={{ scale: 0.99 }}
        onClick={() => onNavigate('file-detail')}
        className="bg-[#1c1c1c] p-6 rounded-2xl border border-[#eead2b]/15 cursor-pointer hover:border-[#eead2b]/30 transition-all group"
      >
        <div className="flex items-start gap-5">
          <div className="size-14 bg-[#eead2b]/10 rounded-2xl flex items-center justify-center text-[#eead2b] group-hover:scale-105 transition-transform">
            <FileText size={30} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-black text-base leading-tight truncate text-white">7天营宣发文案_初稿.docx</h3>
              <span className="bg-green-500/10 text-green-400 text-[8px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ml-2 shrink-0">已归档</span>
            </div>
            <p className="text-[10px] text-white/30 mt-2 flex items-center gap-2 font-bold uppercase tracking-widest">
              <History size={13} /> 版本 V2.4 | 3小时前更新
            </p>
            <div className="mt-4 flex items-center gap-2.5">
              <div className="size-7 rounded-full bg-white/10 overflow-hidden border-2 border-white/10">
                <img src="https://i.pravatar.cc/100?img=5" alt="avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] text-white/35 font-black uppercase tracking-widest">来源：菲菲助手</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

const FileDetailView = ({ onBack, source, item }: { onBack: () => void; source?: string; item?: any }) => (
  <div className="flex flex-col gap-7 pb-10">
    <SecondaryHeader title={item?.name || '文件详情'} source={source} onBack={onBack} />
    <div className="px-8 space-y-6">
      <div className="bg-[#1c1c1c] p-8 rounded-2xl border border-white/8 flex flex-col items-center text-center">
        <div className="size-20 bg-[#eead2b]/10 rounded-3xl flex items-center justify-center text-[#eead2b] mb-5">
          <FileText size={44} />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white mb-1">{item?.name || '7天营宣发文案_初稿.docx'}</h2>
        <p className="text-xs text-white/30 font-bold uppercase tracking-widest mb-7">Word 文档 · {item?.size || '24 KB'}</p>
        <div className="w-full space-y-4 text-left">
          <div className="p-5 bg-white/5 rounded-2xl border border-white/8">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">内容预览</p>
            <p className="text-sm text-white/55 leading-relaxed italic">
              "在这个充满不确定性的时代，每一位女性都是自己生活的微光。Solo Spark 助你点亮这份火花..."
            </p>
          </div>
          <div className="space-y-0.5">
            {[
              { label: '创建时间', val: item?.time || '2024-03-18 10:30' },
              { label: '归档助手', val: '菲菲' },
              { label: '版本号',   val: 'V2.4' },
              { label: '权限范围', val: '仅限管理员' },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center py-3.5 border-b border-white/5 last:border-0">
                <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">{row.label}</span>
                <span className="text-sm font-black text-white/75">{row.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <motion.button whileTap={{ scale: 0.96 }} className="flex items-center justify-center gap-3 bg-[#eead2b] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#eead2b]/20">
          <Download size={20} strokeWidth={3} /> 下载
        </motion.button>
        <motion.button whileTap={{ scale: 0.96 }} className="flex items-center justify-center gap-3 border-2 border-white/8 text-white/50 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-all">
          <Share2 size={20} strokeWidth={3} /> 分享
        </motion.button>
      </div>
    </div>
  </div>
);

const SettingView = ({ onNavigate }: { onNavigate: (p: Page) => void }) => {
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.body.classList.toggle('light-mode', !next);
  };
  return (
  <div className="flex flex-col gap-6 px-8 pb-10">
    <Header title="设置" subtitle="Solo Spark 实验室" />
    <motion.div
      whileTap={{ scale: 0.99 }}
      className="bg-gradient-to-tr from-[#eead2b] to-[#d4af37] p-6 rounded-2xl text-white shadow-xl shadow-[#eead2b]/20 relative overflow-hidden"
    >
      <div className="absolute -right-4 -top-4 opacity-10">
        <Sparkles size={100} />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
          <User size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Serena Mitchell</h2>
          <p className="text-xs opacity-80 font-medium">Solo Spark 创始人</p>
        </div>
      </div>
      <div className="flex gap-2">
        <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">Premium 会员</span>
        <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">AI 算力充足</span>
      </div>
    </motion.div>
    {[
      { heading: '核心管理', items: [
        { label: '组织结构', icon: Network,    target: 'org-structure' },
        { label: '行业技能包', icon: Zap,     target: 'skill-packs' },
        { label: '资产库',   icon: FolderOpen, target: 'asset-library' },
        { label: '审核中枢', icon: ShieldCheck, target: 'approval-hub' },
      ]},
      { heading: '品牌与视觉', items: [
        { label: '品牌调性', icon: Sparkles, target: null },
        { label: '视觉资产', icon: Image,    target: null },
      ]},
      { heading: '系统与偏好', items: [
        { label: '通知提醒', icon: Bell,        target: null },
        { label: '多语言',   icon: MessageSquare, target: null },
      ]},
    ].map(group => (
      <div key={group.heading} className="space-y-2">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/25 ml-1 mb-2">{group.heading}</h3>
        {group.items.map((item, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.98 }}
            onClick={() => item.target && onNavigate(item.target as Page)}
            className="w-full flex items-center justify-between p-4 bg-[#1c1c1c] rounded-xl border border-white/8 hover:border-white/12 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-[#eead2b]">
                <item.icon size={18} />
              </div>
              <span className="text-sm font-bold text-white/70">{item.label}</span>
            </div>
            <ChevronRight size={16} className="text-white/20" />
          </motion.button>
        ))}
      </div>
    ))}

    {/* 背景颜色切换 */}
    <div className="space-y-2">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/25 ml-1 mb-2">外观主题</h3>
      <div className="w-full flex items-center justify-between p-4 bg-[#1c1c1c] rounded-xl border border-white/8">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-[#eead2b]">
            <span className="text-base">{isDark ? '🌙' : '☀️'}</span>
          </div>
          <div>
            <span className="text-sm font-bold text-white/70">背景颜色</span>
            <p className="text-[10px] text-white/30 mt-0.5">{isDark ? '当前：黑色模式' : '当前：白色模式'}</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-white/10' : 'bg-[#eead2b]'}`}
        >
          <span className={`absolute top-1 size-4 rounded-full bg-white transition-transform shadow ${isDark ? 'left-1' : 'left-7'}`} />
        </button>
      </div>
    </div>

  </div>
  );
};

const OrgStructureView = ({ onBack, source }: { onBack: () => void; source?: string }) => {
  const [selectedHub, setSelectedHub] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-7 pb-10">
      <SecondaryHeader title="组织结构" source={source} onBack={onBack} />
      <div className="px-8 space-y-7">
        <section>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 bg-[#eead2b] rounded-full" />
            <h2 className="text-base font-bold text-white">Spark 流程飞轮</h2>
          </div>
          <div className="relative flex justify-between items-center py-7">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#eead2b]/10 -translate-y-1/2 z-0" />
            {['S', 'P', 'A', 'R', 'K'].map((l, i) => (
              <motion.div key={i} whileTap={{ scale: 0.9 }} className="z-10 flex flex-col items-center gap-2.5">
                <div className={cn(
                  'size-12 rounded-full flex items-center justify-center border-2 transition-all shadow-md',
                  l === 'A' ? 'bg-[#eead2b] border-[#eead2b] text-white scale-110' : 'bg-[#1c1c1c] border-[#eead2b]/15 text-[#eead2b]'
                )}>
                  <span className="font-black text-base">{l}</span>
                </div>
                <span className={cn('text-[10px] font-bold uppercase tracking-tighter', l === 'A' ? 'text-[#eead2b]' : 'text-white/30')}>
                  {['感知', '策划', '执行', '审核', '沉淀'][i]}
                </span>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-[#eead2b] rounded-full" />
            <h2 className="text-base font-bold text-white">核心三中枢</h2>
          </div>
          {[
            { name: '策划中枢', desc: '负责任务拆解与资源分配',          icon: BrainCircuit },
            { name: '审核中枢', desc: '质量把控与最终决策建议',          icon: ShieldCheck },
            { name: '调度中枢', desc: 'AI 算力分配与流转效率优化',       icon: Zap },
          ].map((hub, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedHub(hub.name)}
              className="bg-[#1c1c1c] rounded-2xl p-5 border-l-4 border-[#eead2b] flex items-center justify-between cursor-pointer border border-white/8 hover:border-[#eead2b]/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-[#eead2b]/10 flex items-center justify-center">
                  <hub.icon size={24} className="text-[#eead2b]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{hub.name}</h3>
                  <p className="text-[11px] text-white/35 mt-0.5">{hub.desc}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/20" />
            </motion.div>
          ))}
        </section>
        <section className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-[#eead2b] rounded-full" />
            <h2 className="text-base font-bold text-white">六专项部</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['内容部', '技术部', '视觉部', '运营部', '财务部', '客服部'].map((dept, i) => (
              <div key={i} className="bg-[#1c1c1c] p-4 rounded-xl border border-white/8 flex items-center gap-2.5">
                <div className="size-7 rounded-lg bg-white/5 flex items-center justify-center text-white/25">
                  <span className="text-xs font-black">{dept[0]}</span>
                </div>
                <span className="text-xs font-bold text-white/55">{dept}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <AnimatePresence>
        {selectedHub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-8"
            onClick={() => setSelectedHub(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#1c1c1c] w-full max-w-md rounded-3xl p-10 text-center border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="size-20 bg-[#eead2b]/10 rounded-3xl flex items-center justify-center text-[#eead2b] mx-auto mb-7">
                <BrainCircuit size={42} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">{selectedHub}</h3>
              <p className="text-white/45 text-sm leading-relaxed mb-8">
                这是 Solo Spark 的核心大脑之一。负责协调所有 AI 助手的任务分配、优先级排序以及最终成果的质量把控。
              </p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedHub(null)}
                className="w-full bg-[#eead2b] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#eead2b]/20"
              >了解更多</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SkillPacksView = ({ onBack, onNavigate, source }: { onBack: () => void; onNavigate: (p: Page, item?: any) => void; source?: string }) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="flex flex-col gap-6 pb-10">
      <SecondaryHeader title="行业技能包" source={source} onBack={onBack} rightIcon={Plus} />
      <div className="px-8 space-y-5">
        <motion.div layout className="bg-[#1c1c1c] rounded-2xl p-6 border border-[#eead2b]/20">
          <div onClick={() => setExpanded(!expanded)} className="flex gap-4 items-start mb-3 cursor-pointer">
            <div className="size-14 rounded-2xl bg-[#eead2b]/10 flex items-center justify-center shrink-0">
              <BrainCircuit size={32} className="text-[#eead2b]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-white">教育技能包</h3>
                <span className="text-[10px] font-bold bg-[#eead2b]/15 text-[#eead2b] px-3 py-1 rounded-full uppercase tracking-widest">已开启</span>
              </div>
              <p className="text-white/40 text-sm mt-1">针对女性教育创业者的全套 AI 方案</p>
            </div>
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="border-t border-white/8 pt-5 mt-3">
                  <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-3">包含子能力</p>
                  <div className="space-y-2">
                    {['课程结构设计', '家长沟通脚本', '学习路径规划'].map((skill, i) => (
                      <motion.div
                        key={i}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate('assistant-execution')}
                        className="px-4 py-3 bg-white/5 rounded-xl text-xs font-bold text-white/60 border border-white/8 flex items-center justify-between cursor-pointer hover:bg-white/8 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Sparkles size={14} className="text-[#eead2b]" />
                          {skill}
                        </div>
                        <ChevronRight size={13} className="text-white/20" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/25 ml-1">待解锁</h3>
          {['跨境技能包', '内容 IP 技能包', '自动化技能包'].map((pack, i) => (
            <motion.div
              key={i}
              className="bg-[#1c1c1c]/60 rounded-2xl p-5 border border-white/5 flex gap-4 items-start opacity-40 cursor-not-allowed"
            >
              <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                <Settings size={32} className="text-white/20" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white/40">{pack}</h3>
                  <span className="text-[10px] font-bold bg-white/5 text-white/25 px-3 py-1 rounded-full uppercase tracking-widest">未开启</span>
                </div>
                <p className="text-white/20 text-xs mt-1">全球电商文案优化与多语种客服支持</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CommCenterView = ({ onNavigate }: { onNavigate: (p: Page, item?: any) => void }) => (
  <div className="flex flex-col gap-6 pb-10">
    <Header title="沟通中心" subtitle="AI 团队协作入口" />
    <div className="px-8 space-y-5">
      <nav className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        <motion.button whileTap={{ scale: 0.95 }} className="whitespace-nowrap px-5 py-2 rounded-full bg-[#eead2b] text-white text-sm font-black shadow-lg shadow-[#eead2b]/20">全部</motion.button>
        {['指挥官', '内容', '视频'].map((t, i) => (
          <motion.button key={i} whileTap={{ scale: 0.95 }} className="whitespace-nowrap px-5 py-2 rounded-full bg-white/5 text-white/40 text-sm font-bold border border-white/8 hover:bg-white/8 transition-all">{t}</motion.button>
        ))}
      </nav>
      <div className="space-y-3">
        {[
          { id: 'feifei',  name: '菲菲',   role: '指挥官', msg: '7天营宣发文案初稿已准备好，请查阅', time: '10:30', unread: true,  target: 'assistant-execution', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop' },
          { id: 'content', name: '内容助手', role: '协作',   msg: '已根据您的要求完成了产品深度分析报告...',   time: '09:15', unread: false, target: 'assistant-detail',     img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=100&auto=format&fit=crop' },
          { id: 'video',   name: '视频助手', role: '制作',   msg: '脚本分镜预览已生成，包含 12 个关键镜头',   time: '昨天',   unread: true,  target: 'assistant-detail',     img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop' },
        ].map((chat, i) => (
          <motion.div
            key={i}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(chat.target as Page, chat)}
            className="bg-[#1c1c1c] rounded-2xl p-4 flex gap-4 border border-white/8 cursor-pointer hover:border-white/12 transition-all"
          >
            <div className="relative shrink-0">
              <div className="size-14 rounded-2xl bg-white/5 overflow-hidden">
                <img src={chat.img} alt="avatar" className="w-full h-full object-cover" />
              </div>
              {chat.unread && <div className="absolute -top-1 -right-1 size-4 bg-[#eead2b] rounded-full border-2 border-[#1c1c1c] shadow-lg" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm truncate text-white">{chat.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/30 text-[8px] font-black uppercase tracking-widest">{chat.role}</span>
                </div>
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{chat.time}</span>
              </div>
              <p className={cn('text-xs line-clamp-2 leading-relaxed', chat.unread ? 'text-white/75 font-bold' : 'text-white/35 font-medium')}>
                {chat.msg}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const AssistantDetailView = ({ onBack, onNavigate, source, item }: { onBack: () => void; onNavigate: (p: Page, item?: any) => void; source?: string; item?: any }) => (
  <div className="flex flex-col pb-10">
    <SecondaryHeader title={item?.name || 'AI 助手详情'} source={source} onBack={onBack} />
    <header className="pt-8 pb-10 px-8 text-center bg-[#1c1c1c] border-b border-white/5">
      <div className="relative inline-block mb-5">
        <div className="size-28 rounded-[32px] border-4 border-white/10 overflow-hidden bg-[#eead2b]/10">
          <img src={item?.img || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop'} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="absolute -bottom-2 -right-2 size-7 bg-green-500 border-3 border-[#1c1c1c] rounded-full shadow-lg" />
      </div>
      <h2 className="text-3xl font-black mb-2 tracking-tight text-white">{item?.name || '菲菲'}</h2>
      <span className="px-5 py-1.5 bg-[#eead2b] text-white text-[10px] font-black rounded-full uppercase tracking-[0.15em] shadow-lg shadow-[#eead2b]/20">
        {item?.role || '文案专家'} / 指挥官
      </span>
    </header>
    <section className="px-8 grid grid-cols-4 gap-4 mt-6 mb-8">
      {[
        { icon: CheckCircle2, val: '128', label: '已完成任务' },
        { icon: FolderOpen,   val: '42',  label: '沉淀资产' },
        { icon: ShieldCheck,  val: '99%', label: '好评率' },
        { icon: Clock,        val: '15天', label: '协作时长' },
      ].map((stat, i) => (
        <motion.div key={i} whileTap={{ scale: 0.95 }} className="bg-[#1c1c1c] p-5 rounded-2xl border border-white/8 flex flex-col gap-2">
          <div className="size-9 rounded-xl bg-[#eead2b]/10 flex items-center justify-center text-[#eead2b]">
            <stat.icon size={18} />
          </div>
          <div>
            <p className="text-2xl font-black tracking-tight text-white">{stat.val}</p>
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </section>
    <section className="px-8 mb-7">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 bg-[#eead2b] rounded-full" />
        <h2 className="text-base font-bold text-white">核心技能</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {['品牌文案', '社交媒体策划', '多语言翻译', 'SEO 优化', '情感化表达'].map((skill, i) => (
          <span key={i} className="px-4 py-2 bg-[#1c1c1c] rounded-xl text-xs font-bold text-white/55 border border-white/8">
            {skill}
          </span>
        ))}
      </div>
    </section>
    <section className="px-8 mb-7">
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('assistant-execution')}
        className="bg-[#1c1c1c] p-7 rounded-2xl border border-[#eead2b]/15 cursor-pointer hover:border-[#eead2b]/30 transition-all"
      >
        <div className="flex justify-between items-start mb-5">
          <h3 className="font-black text-sm uppercase tracking-widest text-white/30">当前任务</h3>
          <span className="text-[9px] font-black text-[#eead2b] bg-[#eead2b]/10 px-3 py-1 rounded-full uppercase tracking-widest">进行中</span>
        </div>
        <p className="text-base text-white/70 mb-7 leading-relaxed font-medium">
          正在构思：<span className="text-[#eead2b] font-bold">7天营宣发文案框架</span>
        </p>
        <div className="space-y-2.5">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-[#eead2b]">进度 65%</span>
            <span className="text-white/20">预计 15:00 完成</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#eead2b] h-full rounded-full" style={{ width: '65%' }} />
          </div>
        </div>
      </motion.div>
    </section>
  </div>
);

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [history, setHistory] = useState<Page[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialLogs);
  const logIdRef = useRef(initialLogs.length + 1);
  const logIndexRef = useRef(0);

  // 5-second mock activity log (cycle through preset list)
  useEffect(() => {
    const interval = setInterval(() => {
      const entry = mockLogPool[logIndexRef.current % mockLogPool.length];
      logIndexRef.current++;
      setActivityLogs(prev => [...prev, {
        id: logIdRef.current++,
        time: getTime(),
        type: entry.type,
        text: entry.text,
        agent: entry.agent,
      }]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getPageLabel = (page: Page): string => {
    const labels: Partial<Record<Page, string>> = {
      dashboard: '仪表盘', 'task-flow': '任务流', 'comm-center': '沟通中心',
      'today-report': '报告', 'approval-hub': '审核中枢', settings: '设置',
      'asset-library': '资产库', 'org-structure': '组织结构', 'skill-packs': '行业技能包',
    };
    return labels[page] || '';
  };

  const getSourceLabel = () => {
    if (history.length === 0) return '';
    return getPageLabel(history[history.length - 1]);
  };

  const navigate = (page: Page, item?: any) => {
    if (page === currentPage && !item) return;
    setHistory(prev => [...prev, currentPage]);
    setSelectedItem(item || null);
    setCurrentPage(page);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setCurrentPage(prev);
    } else {
      setCurrentPage('dashboard');
    }
  };

  const isChat = currentPage === 'assistant-execution';

  const mobileNavItems = [
    { id: 'dashboard',    label: '仪表盘', icon: LayoutDashboard },
    { id: 'task-flow',    label: '任务流', icon: Zap },
    { id: 'comm-center',  label: '沟通',   icon: MessageSquare },
    { id: 'today-report', label: '报告',   icon: FileText },
    { id: 'settings',     label: '设置',   icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#120820] font-sans overflow-hidden">
      <LeftSidebar active={currentPage} onChange={navigate} />

      <main className={cn(
        'flex-1 bg-[#120820] lg:pb-0 pb-16',
        currentPage === 'dashboard' ? 'flex flex-col overflow-hidden' : 'overflow-y-auto hide-scrollbar'
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className={currentPage === 'dashboard' ? 'flex flex-col flex-1 h-full overflow-hidden' : 'min-h-full'}
          >
            {currentPage === 'dashboard'            && <DashboardView onNavigate={navigate} />}
            {currentPage === 'task-flow'            && <TaskFlowView onNavigate={navigate} />}
            {currentPage === 'assistant-execution'  && <AssistantExecutionView onBack={goBack} onNavigate={navigate} source={getSourceLabel()} item={selectedItem} />}
            {currentPage === 'today-report'         && <TodayReportView onNavigate={navigate} />}
            {currentPage === 'comm-center'          && <CommCenterView onNavigate={navigate} />}
            {currentPage === 'settings'             && <SettingView onNavigate={navigate} />}
            {currentPage === 'approval-hub'         && <ApprovalHubView onBack={goBack} onNavigate={navigate} source={getSourceLabel()} />}
            {currentPage === 'approval-detail'      && <ApprovalDetailView onBack={goBack} onNavigate={navigate} source={getSourceLabel()} item={selectedItem} />}
            {currentPage === 'asset-library'        && <AssetLibraryView onBack={goBack} onNavigate={navigate} source={getSourceLabel()} />}
            {currentPage === 'file-detail'          && <FileDetailView onBack={goBack} source={getSourceLabel()} item={selectedItem} />}
            {currentPage === 'org-structure'        && <OrgStructureView onBack={goBack} source={getSourceLabel()} />}
            {currentPage === 'skill-packs'          && <SkillPacksView onBack={goBack} onNavigate={navigate} source={getSourceLabel()} />}
            {currentPage === 'assistant-detail'     && <AssistantDetailView onBack={goBack} onNavigate={navigate} source={getSourceLabel()} item={selectedItem} />}
          </motion.div>
        </AnimatePresence>


      </main>

      <RightActivityLog logs={activityLogs} />

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#141414] border-t border-white/8 flex">
        {mobileNavItems.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.id as Page)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors',
              currentPage === item.id ? 'text-[#eead2b]' : 'text-white/30'
            )}
          >
            <item.icon size={20} strokeWidth={currentPage === item.id ? 2.5 : 1.8} />
            <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
