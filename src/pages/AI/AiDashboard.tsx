import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Stethoscope, 
  ShieldAlert, 
  Menu, 
  Plus, 
  // MessageSquare, 
  Send, 
  ChevronDown, 
  Sparkles,
  // Search,
  ArrowRight,
  Database,
  X,
  History,
  Settings,
  CalendarDays,
  TrendingUp,
  // AlertTriangle,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- TYPES ---

type ModelType = 'triage' | 'timeline' | 'safety';

interface Message {
  id: string;
  role: 'USER' | 'ai';
  content: string;
  timestamp: Date;
  widget?: ModelType | null;
  widgetData?: any;
}

interface ChatSession {
  id: string;
  title: string;
  model: ModelType;
  messages: Message[];
  updatedAt: Date;
}

// --- MOCK DATA ---

const MOCK_PATIENT = {
  name: "Alex Doe",
  initials: "AD",
  plan: "Pro Health"
};

// --- HELPER COMPONENTS ---

const TypingEffect = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let index = 0;
    if (!text) return;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(intervalId);
        onComplete && onComplete();
      }
    }, 8); // Fast typing speed
    return () => clearInterval(intervalId);
  }, [text]);
  return <div className="whitespace-pre-wrap leading-relaxed">{displayedText}</div>;
};

// --- WIDGETS ---

const TriageWidget = ({ data }: { data: any }) => (
  <div className="mt-4 mb-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm max-w-md animate-in fade-in slide-in-from-bottom-3">
    <div className={`p-3 ${
      data.urgency === 'High' ? 'bg-red-50 border-b border-red-100' : 
      data.urgency === 'Medium' ? 'bg-amber-50 border-b border-amber-100' : 
      'bg-emerald-50 border-b border-emerald-100'
    } flex justify-between items-center`}>
      <span className="font-semibold text-slate-700 flex items-center gap-2">
        <Activity className="w-4 h-4" /> Triage Assessment
      </span>
      <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${
        data.urgency === 'High' ? 'bg-red-200 text-red-800' : 
        data.urgency === 'Medium' ? 'bg-amber-200 text-amber-800' : 
        'bg-emerald-200 text-emerald-800'
      }`}>
        {data.urgency} Priority
      </span>
    </div>
    <div className="p-4 space-y-3">
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Recommendation</div>
        <p className="text-slate-800 text-sm">{data.recommendation}</p>
      </div>
      <button className="w-full bg-slate-900 text-white text-xs py-2 rounded-lg hover:bg-slate-800 transition-colors">
        Find Specialist Nearby
      </button>
    </div>
  </div>
);

const TimelineWidget = () => (
  <div className="mt-4 mb-4 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-500">
    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
        <CalendarDays className="w-4 h-4 text-indigo-600" />
        6-Month Health Summary
      </h4>
      <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">
        Jul - Dec 2024
      </span>
    </div>
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-600">Blood Pressure Trend</span>
          <span className="text-xs text-green-600 font-medium flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" /> Stabilizing
          </span>
        </div>
        <div className="flex items-end justify-between h-24 gap-2">
          {[40, 65, 55, 80, 45, 60].map((h, i) => (
            <div key={i} className="flex flex-col items-center w-full group">
              <div style={{ height: `${h}%` }} className={`w-full max-w-[24px] rounded-t-sm ${i === 5 ? 'bg-indigo-600' : 'bg-indigo-200'}`}></div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex justify-between items-center">
        <div>
          <div className="text-xs text-blue-600 uppercase font-bold">Medication Adherence</div>
          <div className="text-sm text-slate-600">96% Consistency</div>
        </div>
        <div className="text-xl font-bold text-slate-800">A+</div>
      </div>
    </div>
  </div>
);

const SafetyWidget = ({ items }: { items: any[] }) => (
  <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-3">
    {items.map((item, idx) => (
      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex gap-3">
        <div className={`flex-shrink-0 mt-1 ${item.level === 'High' ? 'text-red-500' : 'text-amber-500'}`}>
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h5 className="text-sm font-semibold text-slate-900">{item.title}</h5>
          <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

// --- MAIN APP COMPONENT ---

export default function AiDashboard() {
  // State
  const [activeModel, setActiveModel] = useState<ModelType>('triage');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Chest pain inquiry',
      model: 'triage',
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      messages: [
        { id: 'm1', role: 'user', content: 'I have a sharp pain in my chest', timestamp: new Date() },
        { id: 'm2', role: 'ai', content: 'I have analyzed your symptoms...', timestamp: new Date(), widget: 'triage', widgetData: { urgency: 'High', recommendation: 'Immediate evaluation recommended.' } }
      ]
    },
    {
      id: '2',
      title: 'Grapefruit interaction',
      model: 'safety',
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      messages: [
        { id: 'm3', role: 'user', content: 'Can I eat grapefruit with atorvastatin?', timestamp: new Date() },
        { id: 'm4', role: 'ai', content: 'There is a known interaction...', timestamp: new Date(), widget: 'safety', widgetData: [{ level: 'Medium', title: 'Interaction Detected', desc: 'Grapefruit increases drug absorption.' }] }
      ]
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Derived State: Current Messages
  const currentMessages = activeSessionId 
    ? sessions.find(s => s.id === activeSessionId)?.messages || []
    : [];

  // Effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isThinking]);

  // Model Configs
  const MODELS: Record<ModelType, { name: string; icon: any; color: string; description: string; prompts: string[] }> = {
    triage: {
      name: "Symptom Triage",
      icon: Stethoscope,
      color: "text-blue-600",
      description: "Analyzes symptoms & suggests urgency.",
      prompts: ["I have a sharp pain in my chest.", "My child has a fever of 102.", "Persistent headache for 3 days."]
    },
    timeline: {
      name: "Health Timeline",
      icon: Activity,
      color: "text-indigo-600",
      description: "Generates 6-month health reports.",
      prompts: []
    },
    safety: {
      name: "Interaction Guard",
      icon: ShieldAlert,
      color: "text-emerald-600",
      description: "Checks diet & drug interactions.",
      prompts: ["Can I eat grapefruit with my meds?", "Is Ibuprofen safe with my heart meds?"]
    }
  };

  // --- LOGIC: CHAT HISTORY & MESSAGING ---

  const createNewSession = (modelOverride?: ModelType) => {
    setActiveSessionId(null);
    setActiveModel(modelOverride || 'triage');
    setInput('');
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) setActiveSessionId(null);
  };

  const handleSendMessage = (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    let sessionId = activeSessionId;
    let newSessions = [...sessions];

    // If no active session, create one
    if (!sessionId) {
      sessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: sessionId,
        title: text.length > 30 ? text.substring(0, 30) + '...' : text,
        model: activeModel,
        messages: [userMsg],
        updatedAt: new Date()
      };
      newSessions = [newSession, ...sessions];
      setActiveSessionId(sessionId);
    } else {
      // Update existing session
      newSessions = newSessions.map(s => 
        s.id === sessionId 
          ? { ...s, messages: [...s.messages, userMsg], updatedAt: new Date() }
          : s
      );
    }
    
    setSessions(newSessions);
    setInput('');
    setIsThinking(true);

    // Simulate AI Response
    setTimeout(() => {
      let aiContent = "";
      let widgetType: ModelType | null = null;
      let widgetData = null;

      if (activeModel === 'triage') {
        aiContent = "Based on your symptoms, I've run a triage assessment.";
        widgetType = 'triage';
        widgetData = { urgency: 'Medium', recommendation: 'Monitor symptoms. If pain increases, seek care.' };
      } else if (activeModel === 'safety') {
        aiContent = "I've checked your medication list against typical interactions.";
        widgetType = 'safety';
        widgetData = [{ level: 'Low', title: 'No Major Interactions', desc: 'This combination is generally considered safe.' }];
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiContent,
        timestamp: new Date(),
        widget: widgetType,
        widgetData: widgetData
      };

      setSessions(prev => prev.map(s => 
        s.id === sessionId 
          ? { ...s, messages: [...s.messages, aiMsg] }
          : s
      ));
      setIsThinking(false);
    }, 1500);
  };

  const handleGenerateReport = () => {
    setIsThinking(true);
    // Create specific session for Report
    const sessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: sessionId,
      title: `Health Report - ${new Date().toLocaleDateString()}`,
      model: 'timeline',
      messages: [],
      updatedAt: new Date()
    };
    
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(sessionId);

    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now().toString(),
        role: 'ai',
        content: "I've consolidated your medical records from the last 6 months. Here is your summary:",
        timestamp: new Date(),
        widget: 'timeline'
      };
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [aiMsg] } : s));
      setIsThinking(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-white font-sans text-slate-900 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <div className={`${sidebarOpen ? 'w-[280px]' : 'w-0'} bg-slate-50 border-r border-slate-200 transition-all duration-300 flex flex-col overflow-hidden`}>
        <div className="p-4">
          <button 
            onClick={() => createNewSession()} 
            className="w-full flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm group"
          >
            <Plus className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-6">
          {/* Group: Today (Mock logic for grouping could be added here) */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 mb-2 px-3 uppercase tracking-wider">Recent Activity</div>
            <div className="space-y-1">
              {sessions.length === 0 && (
                <div className="px-3 py-4 text-xs text-slate-400 text-center italic">No history yet</div>
              )}
              {sessions.map((session) => {
                const ModelIcon = MODELS[session.model].icon;
                return (
                  <div 
                    key={session.id}
                    onClick={() => {
                      setActiveSessionId(session.id);
                      setActiveModel(session.model);
                      // On mobile close sidebar
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    className={`group relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm cursor-pointer transition-colors ${
                      activeSessionId === session.id 
                        ? 'bg-white shadow-sm border border-slate-200 text-slate-900' 
                        : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                    }`}
                  >
                    <ModelIcon className={`w-4 h-4 flex-shrink-0 ${
                       activeSessionId === session.id ? MODELS[session.model].color : 'text-slate-400'
                    }`} />
                    <span className="truncate flex-1 font-medium">{session.title}</span>
                    
                    {/* Delete Action (visible on hover) */}
                    <button 
                      onClick={(e) => deleteSession(e, session.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-500 rounded transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer transition-all border border-transparent hover:border-slate-200">
            <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-xs shadow-sm">
              {MOCK_PATIENT.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-800 truncate">{MOCK_PATIENT.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{MOCK_PATIENT.plan}</div>
            </div>
            <Settings className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* --- MAIN AREA --- */}
      <div className="flex-1 flex flex-col h-full relative bg-white">
        
        {/* Top Navigation */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
               {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="group relative">
              <button className="flex items-center gap-2 text-lg font-bold text-slate-800 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors">
                {MODELS[activeModel].name} 
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              
              {/* Model Switcher Dropdown */}
              <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-100 rounded-xl shadow-xl p-2 hidden group-hover:block ring-1 ring-slate-900/5">
                {(Object.keys(MODELS) as ModelType[]).map((key) => {
                  const ModelIcon = MODELS[key].icon;
                  return (
                    <button 
                      key={key}
                      onClick={() => createNewSession(key)}
                      className={`w-full text-left px-3 py-3 rounded-lg flex items-start gap-3 hover:bg-slate-50 transition-colors ${activeModel === key ? 'bg-slate-50' : ''}`}
                    >
                      <div className={`p-2 rounded-lg ${activeModel === key ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                        <ModelIcon className={`w-4 h-4 ${MODELS[key].color}`} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{MODELS[key].name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{MODELS[key].description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Chat Content */}
        <main className="flex-1 overflow-y-auto">
          {(!activeSessionId && activeModel !== 'timeline') || (activeModel === 'timeline' && currentMessages.length === 0) ? (
            // --- EMPTY STATE ---
            <div className="h-full flex flex-col items-center justify-center px-4 pb-20 animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm mb-8 border border-slate-100 ring-4 ring-slate-50">
                {React.createElement(MODELS[activeModel].icon, { className: `w-12 h-12 ${MODELS[activeModel].color}` })}
              </div>
              
              {activeModel === 'timeline' ? (
                 <div className="text-center">
                   <h2 className="text-2xl font-bold text-slate-900 mb-3">Health Timeline Analysis</h2>
                   <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
                     Generate a comprehensive 6-month report from your medical history, vitals, and prescriptions.
                   </p>
                   <button 
                    onClick={handleGenerateReport}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-indigo-200 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
                   >
                     <Sparkles className="w-5 h-5" />
                     Generate 6-Month Report
                   </button>
                 </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">How can I help you today?</h2>
                  <div className="grid gap-3 w-full max-w-2xl sm:grid-cols-2">
                    {MODELS[activeModel].prompts.map((prompt, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSendMessage(prompt)}
                        className="text-left p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md hover:bg-white bg-white/50 transition-all text-sm text-slate-600 flex items-center justify-between group"
                      >
                        <span className="font-medium">{prompt}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-blue-500 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            // --- MESSAGE STREAM ---
            <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
              {currentMessages.map((msg) => (
                <div key={msg.id} className="group">
                  {msg.role === 'user' ? (
                    <div className="flex justify-end mb-8">
                       <div className="bg-slate-100 text-slate-900 px-5 py-3.5 rounded-[1.3rem] rounded-tr-none max-w-[85%] text-[15px] leading-relaxed shadow-sm">
                         {msg.content}
                       </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border shadow-sm ${
                         msg.widget === 'triage' ? 'bg-blue-50 border-blue-100' :
                         msg.widget === 'timeline' ? 'bg-indigo-50 border-indigo-100' :
                         msg.widget === 'safety' ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'
                      }`}>
                         <Sparkles className={`w-4 h-4 ${
                           msg.widget === 'triage' ? 'text-blue-600' : 
                           msg.widget === 'timeline' ? 'text-indigo-600' : 
                           msg.widget === 'safety' ? 'text-emerald-600' : 'text-slate-400'
                         }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Source Header */}
                        <div className="flex items-center gap-2 mb-2 opacity-100 transition-opacity">
                          <span className="text-xs font-bold text-slate-700">MedCare AI</span>
                          <div className="flex gap-1 ml-2">
                             <div className="h-4 px-1.5 bg-slate-100 rounded text-[10px] font-medium text-slate-500 flex items-center gap-1 border border-slate-200">
                               <Database className="w-2.5 h-2.5" /> Context
                             </div>
                          </div>
                        </div>

                        {/* Text Content */}
                        <div className="text-slate-800 text-[15px] leading-7">
                           <TypingEffect text={msg.content} />
                        </div>

                        {/* Interactive Widgets */}
                        <div className="mt-2">
                          {msg.widget === 'triage' && msg.widgetData && <TriageWidget data={msg.widgetData} />}
                          {msg.widget === 'timeline' && <TimelineWidget />}
                          {msg.widget === 'safety' && msg.widgetData && <SafetyWidget items={msg.widgetData} />}
                        </div>

                        {/* Action Footer */}
                        <div className="mt-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                            <History className="w-3.5 h-3.5" /> View Sources
                          </button>
                          <button className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                            <Database className="w-3.5 h-3.5" /> JSON Data
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Thinking State */}
              {isThinking && (
                <div className="flex gap-4 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="flex flex-col gap-2 pt-1.5">
                    <div className="h-2 w-24 bg-slate-100 rounded-full"></div>
                    <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </main>

        {/* Input Footer (Hidden for Timeline unless chat is active, but we keep it hidden for timeline generally based on request) */}
        {activeModel !== 'timeline' && (
          <div className="p-4 bg-white/80 backdrop-blur-sm relative z-20 pb-6">
            <div className="max-w-3xl mx-auto relative">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  activeModel === 'triage' ? "Describe your symptoms..." : 
                  "Ask about food or drug interactions..." 
                }
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white shadow-sm transition-all placeholder:text-slate-400"
              />
              <Button 
                onClick={() => handleSendMessage()}
                disabled={!input.trim()}
                className="absolute right-2.5 top-2.5 p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Send className="w-5 h-5" />
              </Button>
              <div className="text-center mt-3">
                <p className="text-[11px] text-slate-400 font-medium">
                  MedCare AI can make mistakes. Consider checking important information.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Special Footer for Timeline Mode if report generated */}
        {activeModel === 'timeline' && activeSessionId && (
           <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-slate-100 text-center">
             <button onClick={() => setMessages([]) /* Reset Logic needed properly but for now visual */} className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
               Start New Analysis
             </button>
           </div>
        )}
      </div>
    </div>
  );
}