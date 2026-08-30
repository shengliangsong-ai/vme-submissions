import React, { useState } from 'react';
import { Bot, Plus, Trash2, Cpu, Zap, Activity } from 'lucide-react';

const INITIAL_AGENTS = [
  { id: '1', name: 'vme-planner-agent', role: 'Planner', status: 'idle', description: 'Analyzes user input and codebase to generate step-by-step execution plans.' },
  { id: '2', name: 'vme-executor-agent', role: 'Executor', status: 'idle', description: 'Writes code, implements steps, and runs standard tasks.' },
  { id: '3', name: 'vme-qa-agent', role: 'QA Reviewer', status: 'active', description: 'Reviews code execution, runs validation tests, and suggests fixes.' },
  { id: '4', name: 'vme-evaluator-agent', role: 'Evaluator (Self-Improve)', status: 'sleeping', description: 'During idle time (Day-Dream state), reviews lessons learned and creates reusable skills.' }
];

export function VirtualTeams() {
  const [agents, setAgents] = useState(INITIAL_AGENTS);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto h-full flex flex-col gap-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a] flex items-center gap-2">
            <Cpu className="text-blue-600" /> Virtual Teams
          </h1>
          <p className="text-[#666] text-sm mt-1">Manage and instantiate specialized agent teams with distinct cognitive contexts.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Instantiate New Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white border border-[#eeeeee] p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${agent.status === 'active' ? 'bg-green-100 text-green-600' : agent.status === 'sleeping' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a1a]">{agent.name}</h3>
                  <p className="text-xs font-medium uppercase tracking-wider text-blue-600">{agent.role}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                agent.status === 'active' ? 'bg-green-50 text-green-600 border border-green-200' :
                agent.status === 'sleeping' ? 'bg-purple-50 text-purple-600 border border-purple-200' :
                'bg-gray-50 text-gray-600 border border-gray-200'
              }`}>
                {agent.status}
              </div>
            </div>
            
            <p className="text-sm text-[#555] mb-4 min-h-[40px]">
              {agent.description}
            </p>

            <div className="flex gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-100 rounded p-2 flex items-center gap-2">
                <Activity size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500">Context Window: {Math.floor(Math.random() * 50 + 20)}K tokens</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Decommission Agent">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mt-auto shrink-0 flex items-start gap-3">
        <Zap className="text-blue-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-semibold text-blue-800">Time-Travel Context Isolation</h4>
          <p className="text-xs text-blue-600/80 mt-1">
            Agents operate with isolated context frames. If an execution path fails, you can roll back the entire team's memory to a previous state using the Time-Travel debugger below.
          </p>
        </div>
      </div>
    </div>
  );
}
