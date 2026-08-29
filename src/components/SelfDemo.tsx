import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, Square, User, MonitorPlay } from 'lucide-react';
import { cn } from '../lib/utils';

const DEMO_SCRIPT = [
  {
    title: "1. Introduction",
    action: "Action: Start on the Dashboard tab.",
    text: "Welcome to Virtual Me (VME), an AI-powered personal developer workspace. VME is designed to act as your autonomous coding assistant, managing issues, tracking standups, and running background jobs. It uses a robust Multi-Agent architecture powered by Gemini to automate complex tasks while keeping you in complete control."
  },
  {
    title: "2. Context & Issues",
    action: "Action: Click on the Workspace (Issues) tab. Show the current issues or create a quick mock issue. Click on the Skills tab briefly to show existing knowledge.",
    text: "Standard AI models have limited context windows. VME solves this by maintaining long-term memory through Issues, Skills, and persistent logs. This provides our agents with the rich, deep context they need to make intelligent decisions that align perfectly with our specific project's history."
  },
  {
    title: "3. Multi-Agent Orchestration: The Planner",
    action: "Action: Go to the Queue (qsub) tab. Click the \"Demo: Orchestrate\" button.",
    text: "Let's see the multi-agent system in action. I'm submitting an orchestration job to redesign our database schema. Instead of just blind execution, VME routes this to our Planner Agent. The Planner analyzes the request, fetches deep context from our workspace, and formulates a step-by-step execution plan."
  },
  {
    title: "3. Multi-Agent Orchestration: Human-in-the-Loop",
    action: "Action: Wait for the plan to stream in. Point out the 'Awaiting Approval' status.",
    text: "Notice that the job is now 'Awaiting Approval'. This is our Human-in-the-Loop safety mechanism. As developers, we review the agent's proposed plan before any destructive actions or complex code generation takes place."
  },
  {
    title: "4. Execution",
    action: "Action: Click the green \"Approve\" button on the job.",
    text: "Once I approve the plan, the job is handed off to the Executor Agent. The Executor takes the exact approved plan and begins generating the code and performing the necessary steps. You can see the logs streaming back in real-time as the agent works autonomously."
  },
  {
    title: "5. Self-Improvement & Personalized Skills",
    action: "Action: Once the execution is complete, click the \"Run Self-Improvement\" button.",
    text: "What makes VME truly agentic is its ability to learn and fine-tune itself to you as an individual. Every day, the Evaluator Agent reviews your daily activity and execution logs, identifies what went right or wrong, and builds personalized skills."
  },
  {
    title: "5. Self-Improvement (Cont.)",
    action: "Action: Watch the Evaluator generate the JSON. Then navigate to the Skills tab.",
    text: "The Evaluator automatically saves these learned skills and memories to the database. Through this continuous self-evaluation, your Virtual Me gets smarter and better over time—creating a highly personalized, fine-tuned context for future execution."
  },
  {
    title: "6. Conclusion & Future Vision",
    action: "Action: Switch to the Blog & Lessons Learned tab, explicitly highlighting the 'Welcome Judges' post.",
    text: "In summary, Virtual Me automates development safely and continuously improves itself. But our long-term vision is much bigger. Virtual Me is designed to become the global standard for 'Smart Context'—an integral extension to top-tier AI models. Using a 2 Million token window is expensive. Virtual Me cuts costs by dynamically routing only relevant history into a cheaper 200K 'hot token' window. And because 1 Million tokens is just 4 Megabytes of data, attaching a simple 10-Gigabyte database gives our model 2.5 Billion tokens of persistent memory. We aren't just scaling up 1000x—we are providing virtually unlimited, cost-effective smart context. Thank you for watching!"
  }
];

export function SelfDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isPlayingRef = useRef(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const playSegment = (index: number) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    
    if (index >= DEMO_SCRIPT.length) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex(index);
    const text = DEMO_SCRIPT[index].text;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a good English voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en-US') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en-'));
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }
    
    utterance.rate = 1.05;
    utteranceRef.current = utterance;

    utterance.onend = () => {
      if (isPlayingRef.current) {
        playSegment(index + 1);
      }
    };

    synthRef.current.speak(utterance);
  };

  const togglePlay = () => {
    if (isPlaying) {
      synthRef.current?.cancel();
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCurrentIndex(0);
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      playSegment(0);
    }
  };

  const currentSegment = DEMO_SCRIPT[currentIndex];

  return (
    <div className="p-8 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold mb-2">Automated Pitch Demo</h2>
          <p className="text-gray-600">
            Sit back and watch/listen to the 4-minute hackathon pitch script.
          </p>
        </div>
        <button 
          onClick={togglePlay}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold transition-all shadow-md",
            isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
          )}
        >
          {isPlaying ? (
            <>
              <Square size={20} fill="currentColor" /> Stop Demo
            </>
          ) : (
            <>
              <PlayCircle size={20} /> Start Auto-Demo
            </>
          )}
        </button>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Visual Simulated Stage */}
        <div className="bg-slate-900 h-64 flex flex-col items-center justify-center p-8 text-center border-b border-gray-800 relative overflow-hidden">
          {isPlaying && (
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/40 via-slate-900 to-slate-900 animate-pulse"></div>
            </div>
          )}
          
          <MonitorPlay size={48} className={cn("text-slate-400 mb-4 transition-transform", isPlaying && "scale-110 text-blue-400")} />
          <h3 className="text-2xl font-semibold text-white mb-2">{currentSegment.title}</h3>
          <p className="text-blue-300 max-w-2xl text-lg font-mono">{currentSegment.action}</p>
        </div>

        {/* Script & Voiceover Readout */}
        <div className="flex-1 p-8 bg-gray-50 flex flex-col items-center justify-center">
           <div className="w-full max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                  <User size={24} />
                </div>
                <div className="font-bold text-gray-500 tracking-wider text-sm uppercase">Voiceover Transcript</div>
              </div>
              <p className={cn(
                  "text-3xl font-medium leading-relaxed transition-all duration-500",
                  isPlaying ? "text-gray-900" : "text-gray-400"
              )}>
                "{currentSegment.text}"
              </p>
           </div>
        </div>
      </div>
      
      {/* Progress Indicators */}
      <div className="flex gap-2 mt-6">
        {DEMO_SCRIPT.map((_, idx) => (
          <div 
            key={idx} 
            className={cn(
              "flex-1 h-2 rounded-full transition-all duration-300",
              idx === currentIndex && isPlaying ? "bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" : 
              idx < currentIndex ? "bg-blue-400" : "bg-gray-200"
            )}
          />
        ))}
      </div>
    </div>
  );
}
