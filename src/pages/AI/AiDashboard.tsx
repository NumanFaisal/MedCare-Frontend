import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  Activity, Stethoscope, Menu, Plus, Send, 
  Sparkles, ArrowRight, CalendarDays, 
  Download, Loader2, Search, Globe, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- TYPES ---
type ModelType = 'triage' | 'timeline';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  widget?: ModelType | null;
  widgetData?: any; 
  // Add field for Google Search Metadata
  searchMetadata?: {
    webSearchQueries?: string[];
    searchEntryPoint?: { renderedContent?: string };
  } | null;
}

// --- API FUNCTIONS ---

// 1. Triage API
const sendSymptomTriage = async (text: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.post("http://localhost:4000/api/ai/triage", 
    { symptoms: text }, // Matches Joi Schema
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data; // Returns { success: true, data: { answer, searchSources } }
};

// 2. Timeline API
const generateTimeline = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:4000/api/ai/timeline", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data; // Returns { success: true, data: { report, searchSources } }
};

// 3. PDF API
const downloadTimelinePDF = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:4000/api/ai/timeline/pdf", {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });
  return response.data;
};

// --- WIDGET COMPONENTS ---

// New Component: Displays Google Search Attribution
const SourceWidget = ({ metadata }: { metadata: any }) => {
  if (!metadata || !metadata.webSearchQueries || metadata.webSearchQueries.length === 0) return null;

  return (
    <div className="mt-3 text-xs">
      <div className="flex items-center gap-1.5 text-slate-500 mb-2">
        <Globe className="w-3 h-3" />
        <span className="font-semibold uppercase tracking-wider">Sources Verified via Google</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {metadata.webSearchQueries.map((query: string, idx: number) => (
          <div key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100 flex items-center gap-1">
            <Search className="w-3 h-3 opacity-50" />
            <span className="truncate max-w-[200px]">"{query}"</span>
          </div>
        ))}
      </div>
      {/* Optional: Render Google's official dynamic HTML if provided by Gemini */}
      {metadata.searchEntryPoint?.renderedContent && (
        <div 
          className="mt-2 text-slate-400 html-attribution"
          dangerouslySetInnerHTML={{ __html: metadata.searchEntryPoint.renderedContent }}
        />
      )}
    </div>
  );
};

const TriageWidget = ({ data }: { data: any }) => (
  <div className="mt-4 mb-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm max-w-md animate-in fade-in slide-in-from-bottom-3">
    <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
      <span className="font-semibold text-slate-700 flex items-center gap-2">
        <Activity className="w-4 h-4" /> Assessment
      </span>
      {/* If your AI response includes explicit urgency fields, use them here. 
          Currently assuming the 'text' response contains the logic, 
          but we keep the widget shell for styling consistency. */}
      <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700 uppercase">
        AI Analysis
      </span>
    </div>
    <div className="p-4">
      {/* We allow the AI's markdown text to drive the content, 
          but wrapping it here makes it look like a formal card */}
      <p className="text-slate-800 text-sm leading-relaxed">
        Please review the guidance above carefully.
      </p>
      <Button variant="outline" className="w-full mt-3 h-8 text-xs">
        Find Specialist
      </Button>
    </div>
  </div>
);

const TimelineWidget = ({ data, onDownload, downloading }: { data: string, onDownload: () => void, downloading: boolean }) => (
  <div className="mt-4 mb-4 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-500 w-full max-w-2xl">
    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
        <CalendarDays className="w-4 h-4 text-indigo-600" />
        Health History Report
      </h4>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onDownload} 
        disabled={downloading}
        className="h-8 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50"
      >
        {downloading ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Download className="w-3 h-3 mr-1" />}
        Download PDF
      </Button>
    </div>
    <div className="p-6 bg-slate-50/50 max-h-[400px] overflow-y-auto">
      {/* Display the raw report text nicely */}
      <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap text-slate-700">
        {data}
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export default function AiDashboard() {
  const [activeModel, setActiveModel] = useState<ModelType>('triage');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Timeline data is just a string report in your new controller
  const [timelineReport, setTimelineReport] = useState<string | null>(null); 
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- MUTATIONS ---

  // 1. Triage Mutation
  const triageMutation = useMutation({
    mutationFn: sendSymptomTriage,
    onSuccess: (resp) => {
      // API returns: { success: true, data: { answer: "...", searchSources: ... } }
      const aiResponseText = resp.data.answer;
      const searchMetadata = resp.data.searchSources;

      const aiMsg: Message = {
        id: Date.now().toString(),
        role: 'ai',
        content: aiResponseText,
        timestamp: new Date(),
        widget: 'triage',
        searchMetadata: searchMetadata // Store metadata
      };
      setMessages(prev => [...prev, aiMsg]);
    },
    onError: (error: any) => {
      console.error("Triage Error:", error);
      const errorMessage = error.response?.data?.error || "Failed to connect to Triage AI";
      toast.error(errorMessage);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: "Error: " + errorMessage, timestamp: new Date() }]);
    }
  });

  // 2. Timeline Mutation
  const timelineMutation = useMutation({
    mutationFn: generateTimeline,
    onSuccess: (resp) => {
      // API returns: { success: true, data: { report: "...", searchSources: ... } }
      setTimelineReport(resp.data.report); 
      // Optionally handle searchSources for timeline if you want to show them
    },
    onError: (error: any) => {
        const errorMessage = error.response?.data?.error || "Failed to generate timeline";
        toast.error(errorMessage);
    }
  });

  // 3. PDF Mutation
  const pdfMutation = useMutation({
    mutationFn: downloadTimelinePDF,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Health_Timeline_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Timeline PDF Downloaded");
    },
    onError: () => toast.error("Download failed")
  });

  // --- HANDLERS ---

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    if (activeModel === 'triage') {
      triageMutation.mutate(input);
    }
  };

  const handleGenerateReport = () => {
    timelineMutation.mutate();
  };

  const resetSession = (model: ModelType) => {
    setActiveModel(model);
    setMessages([]);
    setTimelineReport(null);
    setInput('');
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, timelineReport]);

  // Model Configurations
  const MODELS: Record<ModelType, { name: string; icon: any; color: string; description: string; prompts: string[] }> = {
    triage: {
      name: "Symptom Triage",
      icon: Stethoscope,
      color: "text-blue-600",
      description: "Analyzes symptoms & suggests urgency.",
      prompts: ["I have a sharp pain in my chest.", "My child has a high fever.", "Persistent headache for 3 days."]
    },
    timeline: {
      name: "Health Timeline",
      icon: Activity,
      color: "text-indigo-600",
      description: "Generates medical history reports.",
      prompts: []
    }
  };

  const isThinking = triageMutation.isPending || timelineMutation.isPending;

  return (
    <div className="flex h-[calc(100vh-2rem)] bg-white font-sans text-slate-900 overflow-hidden rounded-2xl border border-slate-200 shadow-xl">
      
      {/* --- SIDEBAR --- */}
      <div className={`${sidebarOpen ? 'w-[260px]' : 'w-0'} bg-slate-50 border-r border-slate-200 transition-all duration-300 flex flex-col overflow-hidden`}>
        <div className="p-4">
          <button 
            onClick={() => resetSession(activeModel)} 
            className="w-full flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm group"
          >
            <Plus className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
            <span>New Session</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="text-[11px] font-bold text-slate-400 mb-2 px-3 uppercase tracking-wider">Available Models</div>
          <div className="space-y-1">
            {(Object.keys(MODELS) as ModelType[]).map((key) => {
              const ModelIcon = MODELS[key].icon;
              return (
                <button 
                  key={key}
                  onClick={() => resetSession(key)}
                  className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                    activeModel === key ? 'bg-white shadow-sm border border-slate-200' : 'hover:bg-slate-200/50'
                  }`}
                >
                  <ModelIcon className={`w-4 h-4 ${MODELS[key].color}`} />
                  <span className={`text-sm font-medium ${activeModel === key ? 'text-slate-900' : 'text-slate-600'}`}>
                    {MODELS[key].name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* --- MAIN AREA --- */}
      <div className="flex-1 flex flex-col h-full relative bg-white">
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-100 z-10 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
               {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
               {React.createElement(MODELS[activeModel].icon, { className: `w-5 h-5 ${MODELS[activeModel].color}` })}
               {MODELS[activeModel].name}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          
          {/* MODE 1: TIMELINE */}
          {activeModel === 'timeline' ? (
             <div className="h-full flex flex-col items-center justify-center px-4 pb-20 animate-in fade-in zoom-in-95 duration-500">
               {!timelineReport ? (
                 <div className="text-center">
                   <div className="bg-indigo-50 p-6 rounded-[2rem] shadow-sm mb-8 border border-indigo-100 inline-block">
                     <Activity className="w-12 h-12 text-indigo-600" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 mb-3">Health Timeline Analysis</h2>
                   <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
                     Generate a comprehensive report from your medical history, vitals, and prescriptions.
                   </p>
                   <button 
                    onClick={handleGenerateReport}
                    disabled={timelineMutation.isPending}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-indigo-200 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto disabled:opacity-70"
                   >
                     {timelineMutation.isPending ? <Loader2 className="animate-spin w-5 h-5"/> : <Sparkles className="w-5 h-5" />}
                     {timelineMutation.isPending ? "Generating..." : "Generate Report"}
                   </button>
                 </div>
               ) : (
                 <div className="w-full flex flex-col items-center">
                    <TimelineWidget 
                      data={timelineReport} 
                      onDownload={() => pdfMutation.mutate()} 
                      downloading={pdfMutation.isPending} 
                    />
                    <Button variant="ghost" onClick={() => setTimelineReport(null)} className="mt-4 text-slate-400">
                      Start Over
                    </Button>
                 </div>
               )}
             </div>
          ) : (
            // MODE 2: TRIAGE CHAT
            <>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center px-4 pb-20 opacity-0 animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards">
                  <div className="bg-slate-50 p-6 rounded-[2rem] mb-6">
                    {React.createElement(MODELS[activeModel].icon, { className: `w-10 h-10 ${MODELS[activeModel].color}` })}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">How can I help you today?</h2>
                  <div className="grid gap-3 w-full max-w-lg sm:grid-cols-2">
                    {MODELS[activeModel].prompts.map((prompt, i) => (
                      <button 
                        key={i} 
                        onClick={() => { setInput(prompt); }}
                        className="text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm bg-white transition-all text-sm text-slate-600 flex items-center justify-between group"
                      >
                        <span className="line-clamp-2">{prompt}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-blue-500 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
                  {messages.map((msg) => (
                    <div key={msg.id} className="group">
                      {msg.role === 'user' ? (
                        <div className="flex justify-end">
                           <div className="bg-slate-900 text-white px-5 py-3 rounded-[1.3rem] rounded-tr-none max-w-[85%] text-[15px] shadow-md">
                             {msg.content}
                           </div>
                        </div>
                      ) : (
                        <div className="flex gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border shadow-sm bg-white`}>
                             <Sparkles className={`w-4 h-4 ${MODELS[activeModel].color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-slate-800 text-[15px] leading-7 bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 whitespace-pre-wrap">
                               {msg.content}
                            </div>
                            
                            {/* Render Google Search Sources if available */}
                            {msg.searchMetadata && <SourceWidget metadata={msg.searchMetadata} />}

                            {/* Render Dynamic Widgets */}
                            {msg.widget === 'triage' && <TriageWidget data={{}} />}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isThinking && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center"><Sparkles className="w-4 h-4 text-slate-300"/></div>
                      <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </>
          )}
        </main>

        {/* Input Area (Only for Triage) */}
        {activeModel !== 'timeline' && (
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="max-w-3xl mx-auto relative">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Describe your symptoms..."
                disabled={isThinking}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all shadow-sm"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!input.trim() || isThinking}
                className="absolute right-2 top-2 p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 h-10 w-10"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}