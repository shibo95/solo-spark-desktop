/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Settings, 
  Plus, 
  Bell, 
  ChevronRight, 
  ArrowLeft, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  Zap, 
  BrainCircuit, 
  FileCode, 
  FolderOpen, 
  Share2, 
  Download, 
  Search, 
  Filter, 
  User, 
  ShieldCheck, 
  Network, 
  Database,
  Sparkles,
  Mic,
  Video,
  PenTool,
  History,
  LayoutGrid,
  Check,
  X,
  Pause,
  ArrowUp,
  Image
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

// --- Components ---

const BottomNav = ({ active, onChange }: { active: string, onChange: (p: Page) => void }) => {
  const items = [
    { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
    { id: 'task-flow', label: '任务流', icon: Zap },
    { id: 'comm-center', label: '沟通', icon: MessageSquare },
    { id: 'today-report', label: '报告', icon: FileText },
    { id: 'settings', label: '设置', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-2xl border-t border-slate-100 px-6 pt-3 pb-8 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {items.map((item) => (
        <motion.button
          key={item.id}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(item.id as Page)}
          className={cn(
            "flex flex-col items-center gap-1.5 transition-all relative",
            active === item.id ? "text-primary" : "text-slate-400"
          )}
        >
          <item.icon size={22} strokeWidth={active === item.id ? 2.5 : 2} />
          <span className={cn("text-[10px] font-black tracking-tight", active === item.id ? "opacity-100" : "opacity-60")}>{item.label}</span>
          {active === item.id && (
            <motion.div 
              layoutId="nav-indicator"
              className="absolute -top-3 size-1 bg-primary rounded-full shadow-[0_0_8px_rgba(238,173,43,0.5)]"
            />
          )}
        </motion.button>
      ))}
    </nav>
  );
};

const Header = ({ title, subtitle, rightElement }: { 
  title: string, 
  subtitle?: string, 
  rightElement?: React.ReactNode
}) => (
  <header className="sticky top-0 z-40 bg-bg-light/80 backdrop-blur-md px-6 pt-12 pb-4 flex items-center justify-between border-b border-primary/5">
    <div>
      <h1 className="text-2xl font-black tracking-tight text-slate-900">{title}</h1>
      {subtitle && <p className="text-xs font-bold text-slate-400 mt-1">{subtitle}</p>}
    </div>
    {rightElement || (
      <button className="size-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-primary/10">
        <Bell size={20} className="text-slate-600" />
      </button>
    )}
  </header>
);

const SecondaryHeader = ({ title, source, onBack, rightIcon: RightIcon = MoreHorizontal, onRightClick }: { 
  title: string, 
  source?: string,
  onBack: () => void,
  rightIcon?: any,
  onRightClick?: () => void
}) => (
  <header className="sticky top-0 z-40 bg-bg-light/80 backdrop-blur-md px-6 pt-14 pb-4 flex items-center justify-between border-b border-primary/5">
    <motion.button 
      whileTap={{ scale: 0.9 }}
      onClick={onBack} 
      className="size-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100"
    >
      <ArrowLeft size={20} className="text-slate-600" />
    </motion.button>
    
    <div className="text-center">
      <h1 className="text-base font-black tracking-tight text-slate-900">{title}</h1>
      {source && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">来源：{source}</p>}
    </div>
    
    <motion.button 
      whileTap={{ scale: 0.9 }}
      onClick={onRightClick}
      className="size-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100"
    >
      <RightIcon size={20} className="text-slate-600" />
    </motion.button>
  </header>
);

// --- Page Views ---

const DashboardView = ({ onNavigate }: { onNavigate: (p: Page, item?: any) => void }) => {
  const agents = [
    { id: 'feifei', name: '菲菲', role: '文案专家', status: '执行中', detail: '正在生成社交媒体文案...', progress: 65, color: 'primary', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop' },
    { id: 'content', name: '内容助手', role: '内容策划', status: '待命', detail: '准备就绪', progress: 0, color: 'slate', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=100&auto=format&fit=crop' },
    { id: 'voice', name: '声音助手', role: '音频剪辑', status: '执行中', detail: '音频降噪处理中...', progress: 30, color: 'primary', img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=100&auto=format&fit=crop' },
    { id: 'video', name: '视频助手', role: '视频后期', status: '等待确认', detail: '4K 视频渲染已完成', progress: 100, color: 'orange', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop' },
  ];

  return (
    <div className="flex flex-col gap-8 pb-40">
      <Header 
        title="仪表盘" 
        subtitle="您的 AI 团队已就绪" 
      />

      <section className="px-6">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-lg font-black tracking-tight">团队看板</h2>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">实时状态</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {agents.map(agent => (
            <motion.div 
              key={agent.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate(agent.id === 'feifei' ? 'assistant-execution' : 'assistant-detail', agent)}
              className="glass-card premium-shadow rounded-[28px] p-5 flex flex-col items-center text-center cursor-pointer border border-white/60 relative overflow-hidden"
            >
              <div className="relative mb-4">
                <div className="size-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                  <img src={agent.img} alt={agent.name} className="w-full h-full object-cover" />
                </div>
                {agent.status === '执行中' && (
                  <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 rounded-full border-4 border-white animate-pulse shadow-sm" />
                )}
                {agent.status === '等待确认' && (
                  <div className="absolute -bottom-1 -right-1 size-4 bg-orange-500 rounded-full border-4 border-white shadow-sm" />
                )}
              </div>
              <p className="text-base font-black tracking-tight">{agent.name}</p>
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 uppercase tracking-widest">{agent.role}</span>
                <span className={cn(
                  "text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em] shadow-sm",
                  agent.status === '执行中' ? "bg-primary text-white" : 
                  agent.status === '等待确认' ? "bg-orange-500 text-white" : 
                  agent.status === '待命' ? "bg-slate-100 text-slate-400" :
                  "bg-green-500 text-white"
                )}>
                  {agent.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-3 line-clamp-1 font-medium px-2">{agent.detail}</p>
              {agent.progress > 0 && agent.progress < 100 && (
                <div className="w-full mt-4 px-2">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.progress}%` }}
                      className="bg-primary h-full rounded-full" 
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black tracking-tight">最新动态</h2>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('today-report')} 
            className="text-[10px] font-black text-primary uppercase tracking-widest"
          >
            查看全部
          </motion.button>
        </div>
        <div className="space-y-4">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('today-report')} 
            className="flex gap-4 p-5 rounded-[28px] bg-white border border-primary/5 premium-shadow cursor-pointer relative overflow-hidden"
          >
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles size={24} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-800 truncate">项目 "Apollo" 进度更新</p>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">菲菲已完成初步品牌视觉方案，等待您的审阅。</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="size-1.5 rounded-full bg-primary"></span>
                <p className="text-[9px] font-black text-primary uppercase tracking-widest">2分钟前</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300 self-center" />
          </motion.div>
        </div>
      </section>

      <section className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black tracking-tight">快捷入口</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: Database, label: '资产库', target: 'asset-library', color: 'blue' },
            { icon: LayoutGrid, label: '组织结构', target: 'org-structure', color: 'indigo' },
            { icon: BrainCircuit, label: '技能包', target: 'skill-packs', color: 'amber' },
            { icon: CheckCircle2, label: '审核中枢', target: 'approval-hub', color: 'orange' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate(item.target as Page)}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className={cn(
                "size-14 rounded-2xl flex items-center justify-center shadow-sm border border-slate-50",
                `bg-${item.color}-50 text-${item.color}-500`
              )}>
                <item.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="px-6 fixed bottom-28 left-0 right-0 max-w-md mx-auto z-40">
        <motion.div 
          className="relative group"
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-accent-gold/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <input 
            type="text" 
            placeholder="发布新任务..." 
            onClick={() => onNavigate('task-flow')}
            readOnly
            className="w-full pl-6 pr-16 py-5 rounded-full bg-white border-none shadow-2xl premium-shadow focus:ring-2 focus:ring-primary/20 text-sm cursor-pointer font-bold placeholder:text-slate-300"
          />
          <button 
            onClick={() => onNavigate('task-flow')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 size-11 bg-gradient-to-tr from-primary to-accent-gold text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

const TaskFlowView = ({ onNavigate }: { onNavigate: (p: Page, item?: any) => void }) => {
  const [activeTab, setActiveTab] = useState('全部');
  const tasks = [
    { title: '首页 Hero 文案优化', person: '菲菲', progress: 100, icon: BrainCircuit, color: 'orange', status: '等待确认', priority: '重点关注', time: '10:30' },
    { title: 'Q4 财务数据自动化同步', person: '数据助手 Alpha', progress: 40, icon: FileText, color: 'blue', status: '执行中', time: '12:30' },
    { title: '品牌社交媒体推广方案', person: '内容助手', progress: 15, icon: Share2, color: 'purple', status: '执行中', time: '14:20' },
    { title: '竞品分析周报生成', person: '智选助手', progress: 0, icon: Search, color: 'slate', status: '待整理', time: '15:00' },
    { title: '昨日运营数据复盘', person: '系统', progress: 100, icon: History, color: 'green', status: '已完成', time: '09:00' },
  ];

  const filteredTasks = activeTab === '全部' ? tasks : tasks.filter(t => t.status === activeTab);

  return (
    <div className="flex flex-col gap-6 pb-40">
      <Header 
        title="任务流" 
        subtitle="今天有 8 项任务正在推进"
        rightElement={
          <div className="flex gap-2">
            <button className="size-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100">
              <Search size={18} className="text-slate-400" />
            </button>
            <button className="size-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100">
              <Filter size={18} className="text-slate-400" />
            </button>
          </div>
        }
      />

      <nav className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 px-6">
        {['全部', '待整理', '执行中', '等待确认', '已完成'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-black transition-all",
              activeTab === tab ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-500 border border-slate-100"
            )}
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className="space-y-6 px-6">
        {filteredTasks.map((task, i) => (
          <div key={i}>
            {task.priority && (
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">重点关注</h3>
                <span className="h-[1px] flex-1 bg-slate-100 ml-4"></span>
              </div>
            )}
            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (task.status === '等待确认') onNavigate('approval-hub', task);
                else if (task.status === '已完成') onNavigate('asset-library', task);
                else onNavigate('assistant-execution', task);
              }}
              className={cn(
                "relative bg-white rounded-[32px] p-6 premium-shadow border border-slate-50 cursor-pointer overflow-hidden transition-all",
                task.status === '等待确认' && "border-2 border-orange-200 ring-4 ring-orange-50"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                {task.priority ? (
                  <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black rounded-full uppercase tracking-widest">{task.priority}</span>
                ) : (
                  <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">{task.time}</span>
                )}
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "size-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]",
                      task.status === '执行中' ? "bg-primary animate-pulse" : 
                      task.status === '等待确认' ? "bg-orange-500 animate-pulse" : 
                      task.status === '已完成' ? "bg-green-500" : "bg-slate-300"
                    )}></span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      task.status === '执行中' ? "text-primary" : 
                      task.status === '等待确认' ? "text-orange-500" : 
                      task.status === '已完成' ? "text-green-500" : "text-slate-400"
                    )}>{task.status}</span>
                  </div>
              </div>
              
              <div className="flex gap-4 mb-6">
                <div className={cn("size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", 
                  task.status === '执行中' ? "bg-primary/10 text-primary" :
                  task.status === '等待确认' ? "bg-orange-50 text-orange-500" :
                  task.status === '已完成' ? "bg-green-50 text-green-500" : "bg-slate-50 text-slate-400"
                )}>
                  <task.icon size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-black leading-tight mb-1 truncate">{task.title}</h2>
                  <p className="text-xs text-slate-400 font-medium">执行人: {task.person}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">当前进度</span>
                  <span className={cn(
                    task.status === '执行中' ? "text-primary" : 
                    task.status === '等待确认' ? "text-orange-500" : 
                    task.status === '已完成' ? "text-green-500" : "text-slate-300"
                  )}>{task.progress}%</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    className={cn("h-full rounded-full", 
                      task.status === '执行中' ? "bg-primary" : 
                      task.status === '等待确认' ? "bg-orange-500" : 
                      task.status === '已完成' ? "bg-green-500" : "bg-slate-200"
                    )}
                  />
                </div>
              </div>

              {task.status === '等待确认' && (
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 py-3.5 bg-orange-500 text-white text-xs font-black rounded-2xl shadow-lg shadow-orange-200 uppercase tracking-widest">去审核</button>
                  <button className="px-6 py-3.5 bg-slate-50 text-slate-400 text-xs font-black rounded-2xl border border-slate-100 uppercase tracking-widest">稍后</button>
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </section>
    </div>
  );
};

const AssistantExecutionView = ({ onBack, onNavigate, source, item }: { onBack: () => void, onNavigate: (p: Page, item?: any) => void, source?: string, item?: any }) => {
  const [messages, setMessages] = useState([
    { time: '08:23', icon: FileText, text: `${item?.name || '菲菲'} 接到任务：${item?.title || '写7天营宣发文案'}`, color: 'slate' },
    { time: '08:24', icon: BrainCircuit, text: `${item?.name || '菲菲'} 正在构思框架...`, progress: 65, color: 'blue' },
    { time: '08:25', icon: Zap, text: `${item?.name || '菲菲'} 调用 Gemini 生成初稿...`, color: 'amber' },
    { time: '08:26', icon: CheckCircle2, text: `${item?.name || '菲菲'} 初稿完成，已存入资产库`, file: `${item?.title || '7天营宣发文案'}_初稿.docx`, color: 'green' },
    { time: '08:27', icon: History, text: `${item?.name || '菲菲'} 将相关参考资料存入归档`, color: 'purple' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessage = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: User,
      text: `我：${inputValue}`,
      color: 'primary'
    };
    setMessages([...messages, newMessage]);
    setInputValue('');
    
    // Simulate AI response
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
    <div className="flex flex-col h-screen bg-bg-light">
      <SecondaryHeader 
        title={item?.title || "单个助手执行页"} 
        source={source}
        onBack={onBack}
        rightIcon={MoreHorizontal}
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
        {messages.map((step, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="flex gap-4 items-start group"
          >
            <div className={cn(
              "mt-1 flex-shrink-0 size-10 rounded-2xl flex items-center justify-center shadow-md border border-white",
              `bg-${step.color}-50 text-${step.color}-500`
            )}>
              <step.icon size={20} />
            </div>
            <div className="flex-1 bg-white p-5 rounded-[24px] border border-slate-50 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{step.time}</span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed font-medium">
                {step.text}
              </p>
              {'progress' in step && step.progress && (
                <div className="mt-4 w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
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
                  className="mt-4 flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 cursor-pointer hover:bg-slate-100 transition-all group/file"
                >
                  <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover/file:scale-110 transition-transform">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="font-black truncate text-slate-800">{step.file}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">点击查看资产详情</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </main>
      <footer className="p-6 bg-white border-t border-slate-100 pb-10 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input 
              className="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/30 placeholder:text-slate-300" 
              placeholder="给菲菲发送指令..." 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors">
              <Mic size={20} />
            </button>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className="size-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/30"
          >
            <ArrowUp size={24} strokeWidth={3} />
          </motion.button>
        </div>
      </footer>
    </div>
  );
};

const TodayReportView = ({ onNavigate }: { onNavigate: (p: Page, item?: any) => void }) => {
  return (
    <div className="flex flex-col gap-6 pb-32">
      <Header title="报告" subtitle="AI 团队正在为你总结今日推进成果" />
      
      <div className="px-6 space-y-6">
        <motion.section 
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('assistant-detail', { id: 'feifei', name: '菲菲' })}
          className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl border border-primary/5 cursor-pointer"
        >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={60} className="text-primary" />
        </div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary animate-pulse"></span>
          核心摘要
        </h2>
        <p className="text-lg leading-relaxed font-medium text-slate-800">
          菲菲今天完成了 <span className="text-primary text-2xl font-bold">3</span> 项任务，沉淀了 <span className="text-primary text-2xl font-bold">2</span> 份资产，仍有 <span className="text-primary text-2xl font-bold">1</span> 项等待确认。
        </p>
      </motion.section>

      <section className="grid grid-cols-2 gap-4">
        {[
          { icon: CheckCircle2, val: '3', label: '今日完成任务', color: 'green', onClick: () => onNavigate('task-flow') },
          { icon: Clock, val: '1', label: '当前阻塞事项', color: 'orange', onClick: () => onNavigate('approval-hub') },
          { icon: Database, val: '2', label: '新增沉淀资产', color: 'primary', onClick: () => onNavigate('asset-library') },
          { icon: BrainCircuit, val: 'AI', label: '观察总结', color: 'primary', sub: '效率提升 15%' },
        ].map((item, i) => (
          <motion.div 
            key={i} 
            whileTap={item.onClick ? { scale: 0.95 } : {}}
            onClick={item.onClick}
            className={cn(
              "bg-white p-4 rounded-2xl shadow-sm border border-slate-50 transition-all",
              item.onClick && "cursor-pointer hover:border-primary/20"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <item.icon size={20} className={cn(`text-${item.color}-500`, `bg-${item.color}-50`, "p-1 rounded-lg")} />
              <span className="text-2xl font-bold">{item.val}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.label}</p>
            {item.sub && <p className="text-[8px] text-slate-400 mt-1">{item.sub}</p>}
          </motion.div>
        ))}
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <User size={16} /> 助手表现
        </h3>
        {[
          { name: '内容助手', status: '已完成', task: '完成 7 天文案初稿', icon: PenTool },
          { name: '视频助手', status: '进行中', task: '脚本已生成，等待素材', icon: Video },
        ].map((as, i) => (
          <motion.div 
            key={i} 
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('assistant-detail')}
            className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-50 cursor-pointer"
          >
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <as.icon size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-sm">{as.name}</h4>
                <span className={cn("text-[8px] px-2 py-0.5 rounded-full font-bold", as.status === '已完成' ? "bg-green-50 text-green-500" : "bg-primary/10 text-primary")}>
                  {as.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{as.task}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Database size={16} /> 最近沉淀资产
        </h3>
        {[
          { name: '7天营宣发文案_初稿.docx', type: 'DOCX', size: '24KB', time: '10:26' },
          { name: '品牌视觉规范_V1.pdf', type: 'PDF', size: '1.2MB', time: '09:45' },
        ].map((file, i) => (
          <motion.div 
            key={i} 
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('file-detail')}
            className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-50 cursor-pointer"
          >
            <div className="size-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
              <FileText size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm truncate">{file.name}</h4>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">{file.type} · {file.size} · {file.time}</p>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </motion.div>
        ))}
      </section>

      <motion.button
        whileTap={{ scale: 0.95 }}
        className="w-full mt-4 py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
      >
        <Download size={20} />
        下载完整 PDF 报告
      </motion.button>
      </div>
    </div>
  );
};

const ApprovalHubView = ({ onBack, onNavigate, source }: { onBack: () => void, onNavigate: (p: Page, item?: any) => void, source?: string }) => {
  const [items, setItems] = useState([
    { id: 1, title: '首页 Hero 标题方案', from: '菲菲', time: '10:30', status: '等待确认', type: 'suggestion', content: '方案二转化率预估提升 15%，更符合目标女性创业者语境。' },
    { id: 2, title: '7天营宣发文案初稿', from: '菲菲', time: '昨天 18:45', status: '等待确认', type: 'draft', content: '“在这个充满不确定性的时代，每一位女性都是自己生活的微光。Solo Spark 助你点亮这份火花...”' },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAction = (id: number, action: string) => {
    if (action === '通过') {
      if (items.length === 1) {
        setShowSuccess(true);
      }
    }
    setItems(items.filter(item => item.id !== id));
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-white">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="size-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-2xl shadow-green-200"
        >
          <Check size={48} strokeWidth={4} />
        </motion.div>
        <h2 className="text-3xl font-black mb-4 tracking-tight">审核发布成功</h2>
        <p className="text-slate-500 mb-12 leading-relaxed">您的决策已同步至 AI 团队，任务将继续推进。</p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('task-flow')}
          className="w-full bg-primary text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30"
        >
          返回任务流
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-32">
      <SecondaryHeader 
        title="审核中枢" 
        source={source}
        onBack={onBack}
        rightIcon={Search}
      />
      
      <div className="px-6 space-y-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{items.length} 项内容等待 Serena 拍板</p>
        <AnimatePresence mode="popLayout">
        {items.map(item => (
          <motion.div 
            key={item.id} 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: 50 }}
            onClick={() => onNavigate('approval-detail', item)}
            className="bg-white rounded-[32px] p-6 premium-shadow border border-primary/5 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={cn("text-[10px] font-bold px-3 py-1 rounded-full", item.status === '等待确认' ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600")}>
                {item.status}
              </span>
              <span className="text-slate-400 text-[10px] font-medium">{item.time}</span>
            </div>
            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
            <div className="flex items-center gap-2 mb-6">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={16} className="text-primary" />
              </div>
              <span className="text-slate-500 text-xs font-medium">来自 {item.from} 的提交</span>
            </div>
            
            {item.type === 'suggestion' ? (
              <div className="bg-bg-light p-4 rounded-2xl mb-6 border-l-4 border-primary">
                <p className="text-[10px] text-primary font-bold mb-2 flex items-center gap-1 uppercase tracking-widest">
                  <Zap size={12} /> AI 建议
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">{item.content}</p>
              </div>
            ) : (
              <div className="space-y-3 mb-8">
                <div className="bg-bg-light rounded-2xl p-5 italic text-sm text-slate-500 relative leading-relaxed">
                  {item.content}
                  <div className="absolute bottom-2 right-4 text-[9px] text-primary font-bold uppercase tracking-widest">点击查看全文</div>
                </div>
              </div>
            )}

            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction(item.id, '通过')} 
                className="flex-1 bg-primary text-white py-4 rounded-2xl text-sm font-black shadow-lg shadow-primary/20 uppercase tracking-widest"
              >
                通过
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction(item.id, '修改')} 
                className="flex-1 border border-slate-200 text-slate-500 py-4 rounded-2xl text-sm font-black uppercase tracking-widest"
              >
                修改
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction(item.id, '暂停')} 
                className="px-4 border border-slate-200 text-slate-400 py-4 rounded-2xl text-sm font-black uppercase tracking-widest"
              >
                <Pause size={18} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {items.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-slate-400"
        >
          <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="opacity-20" />
          </div>
          <p className="font-medium">暂无待审核事项</p>
          <p className="text-xs mt-2 opacity-60">你的团队运行非常高效</p>
        </motion.div>
      )}
      </div>
    </div>
  );
};

const ApprovalDetailView = ({ onBack, onNavigate, source, item }: { onBack: () => void, onNavigate: (p: Page, item?: any) => void, source?: string, item?: any }) => {
  return (
    <div className="flex flex-col gap-8 pb-32">
      <SecondaryHeader title={item?.title || "审核详情"} source={source} onBack={onBack} />
      
      <div className="px-6 space-y-8">
        <div className="bg-white p-8 rounded-[40px] premium-shadow border border-primary/10">
        <div className="flex justify-between items-start mb-6">
          <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{item?.status || '等待确认'}</span>
          <span className="text-slate-400 text-[10px] font-medium">{item?.time || '10:30'}</span>
        </div>
        
        <h2 className="text-2xl font-black mb-6 leading-tight">{item?.title || '首页 Hero 标题方案'}</h2>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-800">{item?.from || '菲菲'}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI 助手</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">提交内容</p>
            <p className="text-base text-slate-700 leading-relaxed font-medium">
              {item?.content || '内容加载中...'}
            </p>
          </div>

          <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <Zap size={14} /> AI 推荐理由
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              方案二转化率预估提升 15%，更符合目标女性创业者语境，情感共鸣更强。
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => onBack()} 
          className="flex-1 bg-primary text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30"
        >
          通过并发布
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="flex-1 border-2 border-slate-100 text-slate-500 py-5 rounded-3xl font-black text-sm uppercase tracking-widest"
        >
          要求修改
        </motion.button>
      </div>
      </div>
    </div>
  );
};

const AssetLibraryView = ({ onBack, onNavigate, source }: { onBack: () => void, onNavigate: (p: Page, item?: any) => void, source?: string }) => {
  return (
    <div className="flex flex-col gap-6 pb-40">
      <SecondaryHeader title="资产库" source={source} onBack={onBack} rightIcon={Search} />

      <div className="px-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
        {[
          { title: '文案模板', icon: FileText, sub: '助手: 菲菲' },
          { title: '知识归档', icon: BrainCircuit, sub: '助手: 智选' },
          { title: '脚本草稿', icon: Video, sub: '助手: 菲菲' },
          { title: '复盘总结', icon: History, sub: '助手: 系统' },
        ].map((cat, i) => (
          <motion.div 
            key={i} 
            whileTap={{ scale: 0.95 }}
            className="bg-white p-6 rounded-[28px] shadow-sm border border-primary/5 flex flex-col gap-4 cursor-pointer hover:border-primary/20 transition-colors"
          >
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
              <cat.icon size={24} />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-800">{cat.title}</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">{cat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-xl font-black tracking-tight">近期重点资产</h2>
        <motion.button whileTap={{ scale: 0.95 }} className="text-[10px] text-primary font-black uppercase tracking-widest">查看全部</motion.button>
      </div>

      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('file-detail')}
        className="bg-white p-6 rounded-[32px] shadow-md border border-primary/10 relative overflow-hidden cursor-pointer group"
      >
        <div className="flex items-start gap-5">
          <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
            <FileText size={32} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-black text-base leading-tight truncate text-slate-800">7天营宣发文案_初稿.docx</h3>
              <span className="bg-green-50 text-green-600 text-[8px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ml-2 shrink-0">已归档</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2.5 flex items-center gap-2 font-bold uppercase tracking-widest">
              <History size={14} /> 版本 V2.4 | 3小时前更新
            </p>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                  <img src="https://i.pravatar.cc/100?img=5" alt="avatar" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">来源：菲菲助手</span>
              </div>
              <MoreHorizontal size={20} className="text-slate-300" />
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

const FileDetailView = ({ onBack, source, item }: { onBack: () => void, source?: string, item?: any }) => {
  return (
    <div className="flex flex-col gap-8 pb-32">
      <SecondaryHeader title={item?.name || "文件详情"} source={source} onBack={onBack} />
      
      <div className="px-6 space-y-8">
        <div className="bg-white p-8 rounded-[40px] premium-shadow border border-primary/10 flex flex-col items-center text-center">
        <div className="size-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 shadow-sm">
          <FileText size={48} />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-800 mb-2">{item?.name || '7天营宣发文案_初稿.docx'}</h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Word 文档 · {item?.size || '24 KB'}</p>
        
        <div className="w-full space-y-4 text-left">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">内容预览</p>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              “在这个充满不确定性的时代，每一位女性都是自己生活的微光。Solo Spark 助你点亮这份火花...”
            </p>
          </div>
          
          <div className="space-y-1">
            {[
              { label: '创建时间', val: item?.time || '2024-03-18 10:30' },
              { label: '归档助手', val: '菲菲' },
              { label: '版本号', val: 'V2.4' },
              { label: '权限范围', val: '仅限管理员' },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center py-4 border-b border-slate-50">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{row.label}</span>
                <span className="text-sm font-black text-slate-800">{row.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.button whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-3 bg-primary text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30">
          <Download size={22} strokeWidth={3} />
          下载
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-3 border-2 border-slate-100 text-slate-600 py-5 rounded-3xl font-black text-sm uppercase tracking-widest">
          <Share2 size={22} strokeWidth={3} />
          分享
        </motion.button>
      </div>
      </div>
    </div>
  );
};

const SettingView = ({ onNavigate }: { onNavigate: (p: Page) => void }) => {
  return (
    <div className="flex flex-col gap-6 px-6 pb-32">
      <Header title="设置" subtitle="Solo Spark 实验室" />
      
      <motion.div 
        whileTap={{ scale: 0.98 }}
        className="bg-gradient-to-tr from-primary to-accent-gold p-6 rounded-[32px] text-white shadow-xl shadow-primary/20 relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 opacity-20">
          <Sparkles size={120} />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="size-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <User size={32} />
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

      <div className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2 mb-2">核心管理</h3>
        {[
          { label: '组织结构', icon: Network, target: 'org-structure' },
          { label: '行业技能包', icon: Zap, target: 'skill-packs' },
          { label: '资产库', icon: FolderOpen, target: 'asset-library' },
          { label: '审核中枢', icon: ShieldCheck, target: 'approval-hub' },
        ].map((item, i) => (
          <motion.button 
            key={i} 
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(item.target as Page)}
            className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-50 shadow-sm hover:border-primary/20 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                <item.icon size={20} />
              </div>
              <span className="text-sm font-bold text-slate-700">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </motion.button>
        ))}
      </div>

      <div className="space-y-3 mt-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2 mb-2">品牌与视觉</h3>
        {[
          { label: '品牌调性', icon: Sparkles },
          { label: '视觉资产', icon: Image },
        ].map((item, i) => (
          <motion.button 
            key={i} 
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-50 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <item.icon size={20} />
              </div>
              <span className="text-sm font-bold text-slate-700">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </motion.button>
        ))}
      </div>

      <div className="space-y-3 mt-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2 mb-2">系统与偏好</h3>
        {[
          { label: '通知提醒', icon: Bell },
          { label: '主题设置', icon: Settings },
          { label: '多语言', icon: MessageSquare },
        ].map((item, i) => (
          <motion.button 
            key={i} 
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-50 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <item.icon size={20} />
              </div>
              <span className="text-sm font-bold text-slate-700">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const OrgStructureView = ({ onBack, source }: { onBack: () => void, source?: string }) => {
  const [selectedHub, setSelectedHub] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-8 pb-32">
      <SecondaryHeader title="组织结构" source={source} onBack={onBack} />
      
      <div className="px-6 space-y-8">
        <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 bg-primary rounded-full"></div>
          <h2 className="text-lg font-bold">Spark 流程飞轮</h2>
        </div>
        <div className="relative flex justify-between items-center py-8">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary/10 -translate-y-1/2 z-0"></div>
          {['S', 'P', 'A', 'R', 'K'].map((l, i) => (
            <motion.div 
              key={i} 
              whileTap={{ scale: 0.9 }}
              className="z-10 flex flex-col items-center gap-3"
            >
              <div className={cn(
                "size-14 rounded-full flex items-center justify-center border-2 transition-all shadow-md",
                l === 'A' ? "bg-primary border-primary text-white scale-110" : "bg-white border-primary/10 text-primary"
              )}>
                <span className="font-black text-lg">{l}</span>
              </div>
              <span className={cn("text-[10px] font-bold uppercase tracking-tighter", l === 'A' ? "text-primary" : "text-slate-400")}>
                {['感知', '策划', '执行', '审核', '沉淀'][i]}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-primary rounded-full"></div>
          <h2 className="text-lg font-bold">核心三中枢</h2>
        </div>
        {[
          { name: '策划中枢', desc: '负责任务拆解与资源分配', icon: BrainCircuit },
          { name: '审核中枢', desc: '质量把控与最终决策建议', icon: ShieldCheck },
          { name: '调度中枢', desc: 'AI 算力分配与流转效率优化', icon: Zap }
        ].map((hub, i) => (
          <motion.div 
            key={i} 
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedHub(hub.name)}
            className="bg-white rounded-3xl p-6 premium-shadow border-l-[6px] border-primary flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-5">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <hub.icon size={28} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base">{hub.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{hub.desc}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </motion.div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-primary rounded-full"></div>
          <h2 className="text-lg font-bold">六专项部</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {['内容部', '技术部', '视觉部', '运营部', '财务部', '客服部'].map((dept, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm flex items-center gap-3">
              <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <Plus size={16} />
              </div>
              <span className="text-xs font-bold text-slate-700">{dept}</span>
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedHub && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedHub(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[40px] p-10 text-center shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="size-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
                <BrainCircuit size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{selectedHub}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-10">
                这是 Solo Spark 的核心大脑之一。负责协调所有 AI 助手的任务分配、优先级排序以及最终成果的质量把控。
              </p>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedHub(null)}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20"
              >
                了解更多
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

const SkillPacksView = ({ onBack, onNavigate, source }: { onBack: () => void, onNavigate: (p: Page, item?: any) => void, source?: string }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex flex-col gap-6 pb-32">
      <SecondaryHeader title="行业技能包" source={source} onBack={onBack} rightIcon={Plus} />
      
      <div className="px-6 space-y-6">
        <motion.div 
          layout
          className="bg-white rounded-3xl p-6 border border-primary/20 premium-shadow"
        >
        <div 
          onClick={() => setExpanded(!expanded)}
          className="flex gap-5 items-start mb-4 cursor-pointer"
        >
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <BrainCircuit size={36} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl">教育技能包</h3>
              <span className="text-[10px] font-bold bg-primary/20 text-primary px-3 py-1 rounded-full uppercase tracking-widest">已开启</span>
            </div>
            <p className="text-slate-500 text-sm mt-1">针对女性教育创业者的全套 AI 方案</p>
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
              <div className="border-t border-slate-50 pt-6 mt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">包含子能力</p>
                <div className="grid grid-cols-1 gap-3">
                  {['课程结构设计', '家长沟通脚本', '学习路径规划'].map((skill, i) => (
                    <motion.div 
                      key={i} 
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavigate('assistant-execution')}
                      className="px-4 py-3 bg-bg-light rounded-xl text-xs font-bold text-slate-700 border border-slate-100 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles size={16} className="text-primary" />
                        {skill}
                      </div>
                      <ChevronRight size={14} className="text-slate-300" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">待解锁</h3>
        {['跨境技能包', '内容 IP 技能包', '自动化技能包'].map((pack, i) => (
          <motion.div 
            key={i} 
            whileTap={{ scale: 0.98 }}
            className="bg-white/60 rounded-3xl p-6 border border-slate-100 flex gap-5 items-start opacity-60 cursor-not-allowed"
          >
            <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
              <Settings size={36} className="text-slate-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-400">{pack}</h3>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest">未开启</span>
              </div>
              <p className="text-slate-300 text-xs mt-1">全球电商文案优化与多语种客服支持</p>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </div>
  );
};

const CommCenterView = ({ onNavigate }: { onNavigate: (p: Page, item?: any) => void }) => {
  return (
    <div className="flex flex-col gap-6 px-6 pb-32">
      <Header title="沟通中心" subtitle="AI 团队协作入口" />
      
      <nav className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="whitespace-nowrap px-6 py-2.5 rounded-full bg-primary text-white text-sm font-black shadow-lg shadow-primary/20"
        >
          全部
        </motion.button>
        {['指挥官', '内容', '视频'].map((t, i) => (
          <motion.button 
            key={i} 
            whileTap={{ scale: 0.95 }}
            className="whitespace-nowrap px-6 py-2.5 rounded-full bg-white text-slate-500 text-sm font-bold border border-slate-100 shadow-sm"
          >
            {t}
          </motion.button>
        ))}
      </nav>

      <div className="space-y-4">
        {[
          { id: 'feifei', name: '菲菲', role: '指挥官', msg: '7天营宣发文案初稿已准备好，请查阅', time: '10:30', unread: true, target: 'assistant-execution', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop' },
          { id: 'content', name: '内容助手', role: '协作', msg: '已根据您的要求完成了产品深度分析报告...', time: '09:15', target: 'assistant-detail', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=100&auto=format&fit=crop' },
          { id: 'video', name: '视频助手', role: '制作', msg: '脚本分镜预览已生成，包含 12 个关键镜头', time: '昨天', unread: true, target: 'assistant-detail', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop' },
        ].map((chat, i) => (
          <motion.div 
            key={i} 
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(chat.target as Page, chat)}
            className="bg-white rounded-[32px] p-5 flex gap-5 shadow-sm border border-slate-50 cursor-pointer hover:border-primary/20 transition-all group"
          >
            <div className="relative shrink-0">
              <div className="size-16 rounded-[24px] bg-slate-100 overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                <img src={chat.img} alt="avatar" className="w-full h-full object-cover" />
              </div>
              {chat.unread && (
                <div className="absolute -top-1 -right-1 size-5 bg-primary rounded-full border-4 border-white shadow-lg" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base truncate text-slate-800">{chat.name}</h3>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-widest">{chat.role}</span>
                </div>
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{chat.time}</span>
              </div>
              <p className={cn(
                "text-xs line-clamp-2 leading-relaxed",
                chat.unread ? "text-slate-900 font-bold" : "text-slate-400 font-medium"
              )}>
                {chat.msg}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AssistantDetailView = ({ onBack, onNavigate, source, item }: { onBack: () => void, onNavigate: (p: Page, item?: any) => void, source?: string, item?: any }) => {
  return (
    <div className="flex flex-col pb-32">
      <SecondaryHeader title={item?.name || "AI 助手详情"} source={source} onBack={onBack} />

      <header className="pt-8 pb-12 px-6 text-center bg-white border-b border-slate-50">
        <div className="relative inline-block mb-6">
          <div className="size-36 rounded-[40px] border-4 border-white premium-shadow overflow-hidden bg-primary/10 rotate-3">
            <img src={item?.img || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"} className="w-full h-full object-cover -rotate-3" alt="feifei" />
          </div>
          <div className="absolute -bottom-2 -right-2 size-8 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
        </div>
        <h2 className="text-3xl font-black mb-2 tracking-tight">{item?.name || '菲菲'}</h2>
        <div className="flex flex-col items-center gap-3">
          <span className="px-5 py-1.5 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-[0.15em] shadow-lg shadow-primary/20">{item?.role || '文案专家'} / 指挥官</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-[10px] text-primary font-black uppercase tracking-widest">正在执行任务</p>
          </div>
        </div>
      </header>

      <section className="px-6 grid grid-cols-2 gap-4 -mt-6 mb-10">
        {[
          { icon: CheckCircle2, val: '128', label: '已完成任务' },
          { icon: FolderOpen, val: '42', label: '沉淀资产' },
          { icon: ShieldCheck, val: '99%', label: '好评率' },
          { icon: Clock, val: '15天', label: '协作时长' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileTap={{ scale: 0.95 }}
            className="bg-white p-6 rounded-3xl premium-shadow border border-primary/5 flex flex-col gap-3"
          >
            <div className="size-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight">{stat.val}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="px-6 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-primary rounded-full"></div>
          <h2 className="text-lg font-bold">核心技能</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {['品牌文案', '社交媒体策划', '多语言翻译', 'SEO 优化', '情感化表达'].map((skill, i) => (
            <span key={i} className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-slate-600 border border-slate-100 shadow-sm">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="px-6 mb-10">
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('assistant-execution')}
          className="bg-white p-8 rounded-[40px] premium-shadow border border-primary/10 relative overflow-hidden cursor-pointer"
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">当前任务</h3>
            <span className="text-[9px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">进行中</span>
          </div>
          <p className="text-base text-slate-800 mb-8 leading-relaxed font-medium">
            正在构思：<span className="text-primary font-bold">7天营宣发文案框架</span>
          </p>
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-primary">进度 65%</span>
              <span className="text-slate-300">预计 15:00 完成</span>
            </div>
            <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="px-6 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-primary rounded-full"></div>
          <h2 className="text-lg font-bold">历史成就</h2>
        </div>
        <div className="space-y-4">
          {[
            { title: '完成 Q1 品牌手册', date: '2024.02.15', icon: CheckCircle2 },
            { title: '优化 12 篇公众号推文', date: '2024.01.20', icon: Zap },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-50 shadow-sm">
              <div className="size-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                <item.icon size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{item.title}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [history, setHistory] = useState<Page[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const getPageLabel = (page: Page): string => {
    switch (page) {
      case 'dashboard': return '仪表盘';
      case 'task-flow': return '任务流';
      case 'comm-center': return '沟通中心';
      case 'today-report': return '报告';
      case 'approval-hub': return '审核中枢';
      case 'settings': return '设置';
      case 'asset-library': return '资产库';
      case 'org-structure': return '组织结构';
      case 'skill-packs': return '行业技能包';
      default: return '';
    }
  };

  const getSourceLabel = () => {
    if (history.length === 0) return '';
    const lastPage = history[history.length - 1];
    return getPageLabel(lastPage);
  };

  const navigate = (page: Page, item?: any) => {
    if (page === currentPage && !item) return;
    setHistory(prev => [...prev, currentPage]);
    if (item) setSelectedItem(item);
    else setSelectedItem(null);
    setCurrentPage(page);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentPage(prev);
    } else {
      setCurrentPage('dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-bg-light min-h-screen relative shadow-2xl overflow-x-hidden font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="min-h-screen"
        >
          {currentPage === 'dashboard' && <DashboardView onNavigate={navigate} />}
          {currentPage === 'task-flow' && <TaskFlowView onNavigate={navigate} />}
          {currentPage === 'assistant-execution' && <AssistantExecutionView onBack={goBack} onNavigate={navigate} source={getSourceLabel()} item={selectedItem} />}
          {currentPage === 'today-report' && <TodayReportView onNavigate={navigate} />}
          {currentPage === 'comm-center' && <CommCenterView onNavigate={navigate} />}
          {currentPage === 'settings' && <SettingView onNavigate={navigate} />}
          {currentPage === 'approval-hub' && <ApprovalHubView onBack={goBack} onNavigate={navigate} source={getSourceLabel()} />}
          {currentPage === 'approval-detail' && <ApprovalDetailView onBack={goBack} onNavigate={navigate} source={getSourceLabel()} item={selectedItem} />}
          {currentPage === 'asset-library' && <AssetLibraryView onBack={goBack} onNavigate={navigate} source={getSourceLabel()} />}
          {currentPage === 'file-detail' && <FileDetailView onBack={goBack} source={getSourceLabel()} item={selectedItem} />}
          {currentPage === 'org-structure' && <OrgStructureView onBack={goBack} source={getSourceLabel()} />}
          {currentPage === 'skill-packs' && <SkillPacksView onBack={goBack} onNavigate={navigate} source={getSourceLabel()} />}
          {currentPage === 'assistant-detail' && <AssistantDetailView onBack={goBack} onNavigate={navigate} source={getSourceLabel()} item={selectedItem} />}
        </motion.div>
      </AnimatePresence>

      {['dashboard', 'task-flow', 'today-report', 'comm-center', 'settings'].includes(currentPage) && (
        <BottomNav active={currentPage} onChange={navigate} />
      )}
    </div>
  );
}
