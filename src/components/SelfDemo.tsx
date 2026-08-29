import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, Square, User, MonitorPlay, ChevronLeft, ChevronRight, ListMusic } from 'lucide-react';
import { cn } from '../lib/utils';

declare global {
  interface Window {
    utterances: SpeechSynthesisUtterance[];
  }
}

const PITCHES = [
  {
    id: 'pitch1',
    name: 'Pitch 1: Collaborative Developer',
    script: [
      {
        title: "1. The AI-Human Team",
        text: "Welcome to Virtual Me. The future of software engineering isn't AI replacing humans, it's AI collaborating with humans as a unified team.",
        image: "/3 Human vs Virtual Me, Team.png"
      },
      {
        title: "2. Persistent Memory",
        text: "But to be a true team member, AI needs persistent memory. We provide a cheap, durable memory layer so your virtual assistant remembers your past decisions.",
        image: "/2 How to give AI persistent memory cheaply.png"
      },
      {
        title: "3. Autonomous Coding",
        text: "This changes the nature of coding. While you focus on high-level architecture, your Virtual Me acts autonomously in the background, writing and testing code.",
        image: "/15 How is really coding when AI acts autonomously.png"
      }
    ]
  },
  {
    id: 'pitch2',
    name: 'Pitch 2: Multi-Agent System',
    script: [
      {
        title: "1. Human Control",
        text: "Virtual Me gives you unlimited memory combined with complete human control over the AI's execution.",
        image: "/S1 Unlimited memory, but human control.png"
      },
      {
        title: "2. Long-Term Memory",
        text: "It archives long-term memory by automatically generating issues and discrete skills from your daily workflows.",
        image: "/S2  VME long-term memory via issues and skills.png"
      },
      {
        title: "3. Analysis & Planning",
        text: "When a new task arrives, the system analyzes the codebase, fetches relevant context, and drafts a comprehensive execution plan.",
        image: "/S3 Analyze, Ftech, Plan.png"
      },
      {
        title: "4. Execution & Logs",
        text: "You remain in the driver's seat. You approve the plan, and the agents generate code, streaming their execution logs directly to your workspace.",
        image: "/S4 Approve, Receive plan, generate code, stream logs.png"
      },
      {
        title: "5. Evolving Skills",
        text: "Our multi-agent system constantly evolves, breaking down complex tasks into steps and acquiring new skills to handle future challenges.",
        image: "/S5 multi-agent system, Steps, New Skills.png"
      }
    ]
  },
  {
    id: 'pitch3',
    name: 'Pitch 3: Smart Context & Scale',
    script: [
      {
        title: "1. Continuous Evaluation",
        text: "Every action is evaluated. The Evaluator agent monitors output quality and automatically refines the AI's strategies.",
        image: "/S6 Evaluator Outputs.png"
      },
      {
        title: "2. Massive Searchable Context",
        text: "This requires massive context. By converting 10 Gigabytes of storage into 2.5 Billion searchable tokens, we achieve unparalleled context retrieval.",
        image: "/S7 10GB storage, 2.5B searchable token.png"
      },
      {
        title: "3. Unlimited Smart Context",
        text: "The result is a virtually unlimited, highly cost-effective smart context engine that scales with your most ambitious projects.",
        image: "/S8 virtually unlimied, cost-effective smart context.png"
      },
      {
        title: "4. The Future",
        text: "The only question left is: What will your Virtual Me build next?",
        image: "/S9 What will your virtual me build next%3F.png"
      }
    ]
  }
];

window.utterances = [];

export function SelfDemo() {
  const [activePitchIndex, setActivePitchIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(-1);
  
  const isPlayingRef = useRef(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const keepAliveInterval = useRef<any>(null);
  
  const currentPitch = PITCHES[activePitchIndex];
  const DEMO_SCRIPT = currentPitch.script;

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    keepAliveInterval.current = setInterval(() => {
      if (synthRef.current?.speaking && !synthRef.current?.paused) {
        synthRef.current.resume();
      }
    }, 10000);
    
    return () => {
      if (keepAliveInterval.current) clearInterval(keepAliveInterval.current);
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const playSegment = (index: number) => {
    if (!synthRef.current) return;
    
    if (utteranceRef.current) {
      utteranceRef.current.onend = null;
      utteranceRef.current.onboundary = null;
    }
    synthRef.current.cancel();
    setCharIndex(-1);
    
    if (index >= DEMO_SCRIPT.length || index < 0) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCurrentIndex(0);
      return;
    }
    
    setCurrentIndex(index);
    const text = DEMO_SCRIPT[index].text;
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en-US') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en-'));
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }
    
    utterance.rate = 1.05;
    
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCharIndex(event.charIndex);
      }
    };

    utterance.onend = () => {
      setCharIndex(-1);
      if (isPlayingRef.current) {
        playSegment(index + 1);
      }
    };
    
    utteranceRef.current = utterance;
    window.utterances.push(utterance); // Prevent GC
    synthRef.current.speak(utterance);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (utteranceRef.current) {
        utteranceRef.current.onend = null;
        utteranceRef.current.onboundary = null;
      }
      synthRef.current?.cancel();
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCharIndex(-1);
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      playSegment(currentIndex);
    }
  };

  const nextSlide = () => {
    playSegment(currentIndex + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      playSegment(currentIndex - 1);
    }
  };

  const changePitch = (index: number) => {
    if (isPlaying) {
      togglePlay();
    }
    setActivePitchIndex(index);
    setCurrentIndex(0);
    setCharIndex(-1);
  };

  const currentSegment = DEMO_SCRIPT[currentIndex];

  const renderHighlightedText = () => {
    const text = currentSegment.text;
    if (charIndex === -1 || !isPlaying) return text;
    
    // Find the end of the current word
    let nextSpace = text.indexOf(' ', charIndex);
    if (nextSpace === -1) nextSpace = text.length;
    
    // Include any trailing punctuation in the word for smoother highlighting
    while (nextSpace < text.length && /[^a-zA-Z0-9\s]/.test(text[nextSpace])) {
        nextSpace++;
    }

    const before = text.substring(0, charIndex);
    const word = text.substring(charIndex, nextSpace);
    const after = text.substring(nextSpace);

    return (
      <>
        <span className="text-gray-400">{before}</span>
        <span className="bg-yellow-200 text-gray-900 rounded px-1 transition-all shadow-sm">{word}</span>
        <span className="text-gray-400">{after}</span>
      </>
    );
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto h-[90vh] flex flex-col gap-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <ListMusic size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Auto-Pitch Player</h2>
            <div className="flex gap-2 mt-1">
              {PITCHES.map((pitch, idx) => (
                <button
                  key={pitch.id}
                  onClick={() => changePitch(idx)}
                  className={cn(
                    "text-xs px-3 py-1 rounded-full font-medium transition-colors border",
                    activePitchIndex === idx 
                      ? "bg-slate-900 text-white border-slate-900" 
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                  )}
                >
                  {pitch.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-full border border-gray-200">
          <button 
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="p-3 rounded-full hover:bg-white hover:shadow-sm disabled:opacity-50 text-gray-700 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={togglePlay}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold transition-all shadow-md w-[160px] justify-center",
              isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {isPlaying ? (
              <>
                <Square size={20} fill="currentColor" /> Stop
              </>
            ) : (
              <>
                <PlayCircle size={20} /> Play Pitch
              </>
            )}
          </button>
          
          <button 
            onClick={nextSlide}
            disabled={currentIndex === DEMO_SCRIPT.length - 1}
            className="p-3 rounded-full hover:bg-white hover:shadow-sm disabled:opacity-50 text-gray-700 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Main Presentation Area */}
      <div className="flex-1 bg-black rounded-2xl shadow-xl overflow-hidden flex flex-col relative min-h-0">
        
        {/* Slide Image - Maximized */}
        <div className="flex-1 w-full h-full p-4 md:p-8 flex items-center justify-center relative z-10 overflow-hidden">
          {isPlaying && (
            <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-black animate-pulse"></div>
            </div>
          )}
          
          {currentSegment.image ? (
            <img 
              src={currentSegment.image} 
              alt={currentSegment.title} 
              className="w-full h-full object-contain rounded-lg shadow-2xl z-10"
            />
          ) : (
            <div className="flex flex-col items-center justify-center z-10">
              <MonitorPlay size={64} className={cn("text-slate-700 mb-6 transition-transform", isPlaying && "scale-110 text-blue-500")} />
              <h3 className="text-4xl font-bold text-white mb-4">{currentSegment.title}</h3>
            </div>
          )}
        </div>

        {/* Teleprompter Subtitles Overlay */}
        <div className="bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-6 md:p-8 shrink-0 z-20">
          <div className="max-w-4xl mx-auto flex items-start gap-6">
            <div className="bg-blue-500/20 text-blue-400 p-3 rounded-full shrink-0">
              <User size={28} />
            </div>
            <div>
              <div className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-3 flex items-center gap-2">
                <span>Auto-Transcript</span>
                {isPlaying && (
                  <span className="flex gap-1 h-3 items-end">
                    <span className="w-1 h-1/3 bg-blue-400 rounded-full animate-[bounce_1s_infinite]"></span>
                    <span className="w-1 h-full bg-blue-400 rounded-full animate-[bounce_1s_infinite_100ms]"></span>
                    <span className="w-1 h-2/3 bg-blue-400 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
                  </span>
                )}
              </div>
              <p className={cn(
                "text-2xl md:text-3xl font-medium leading-relaxed transition-all",
                isPlaying ? "text-gray-200" : "text-gray-500"
              )}>
                {isPlaying ? renderHighlightedText() : `"${currentSegment.text}"`}
              </p>
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Progress Indicators */}
      <div className="flex gap-2 shrink-0">
        {DEMO_SCRIPT.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => playSegment(idx)}
            className={cn(
              "flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer border border-transparent",
              idx === currentIndex && isPlaying ? "bg-blue-500 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]" : 
              idx === currentIndex ? "bg-blue-400" :
              idx < currentIndex ? "bg-blue-200" : "bg-gray-200 hover:bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  );
}
