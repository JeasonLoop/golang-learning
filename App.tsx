import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Visualizer } from './components/Visualizer';
import { ChatAssistant } from './components/ChatAssistant';
import { CURRICULUM } from './constants';
import { Lesson, CodeExecutionResult } from './types';
import { explainCode, simulateRun } from './services/geminiService';
import { Play, MessageSquare, Lightbulb, HelpCircle, Terminal, RotateCcw, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState<Lesson>(CURRICULUM[0].lessons[0]);
  const [code, setCode] = useState<string>(currentLesson.initialCode);
  const [output, setOutput] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [visualizationActive, setVisualizationActive] = useState<boolean>(false);

  // Update code when lesson changes
  useEffect(() => {
    setCode(currentLesson.initialCode);
    setOutput("");
    setExplanation("");
    setVisualizationActive(false);
  }, [currentLesson]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("正在编译并运行代码...");
    setVisualizationActive(true); // Start animation

    const result: CodeExecutionResult = await simulateRun(code);
    
    if (result.error) {
        setOutput(`错误: ${result.error}`);
        setVisualizationActive(false);
    } else {
        setOutput(result.output);
        if (!completedLessons.includes(currentLesson.id)) {
            setCompletedLessons(prev => [...prev, currentLesson.id]);
        }
    }
    
    setIsRunning(false);
  };

  const handleExplain = async () => {
    setIsExplaining(true);
    const text = await explainCode(code, currentLesson.title);
    setExplanation(text);
    setIsExplaining(false);
  };

  const handleReset = () => {
      setCode(currentLesson.initialCode);
      setOutput("");
      setExplanation("");
      setVisualizationActive(false);
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        currentLessonId={currentLesson.id} 
        onSelectLesson={setCurrentLesson} 
        completedLessons={completedLessons}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
            <div>
                <h1 className="text-lg font-bold text-slate-800">{currentLesson.title}</h1>
                <p className="text-xs text-slate-500">{currentLesson.description}</p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200"
                >
                    <MessageSquare size={16} />
                    AI 助教
                </button>
            </div>
        </header>

        {/* Workspace Grid */}
        <div className="flex-1 flex overflow-hidden p-4 gap-4">
            
            {/* Left Column: Code & Explanation */}
            <div className="flex-1 flex flex-col min-w-0 gap-4">
                
                {/* Editor Section */}
                <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            <span className="ml-2 text-xs font-mono text-slate-500">main.go</span>
                        </div>
                        <div className="flex gap-2">
                             <button 
                                onClick={handleReset}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded transition-colors"
                                title="重置代码"
                            >
                                <RotateCcw size={12} />
                                重置
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 relative group">
                        <textarea 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-full p-4 font-mono text-sm text-slate-800 resize-none focus:outline-none custom-scrollbar leading-6 bg-white selection:bg-cyan-100"
                            spellCheck={false}
                        />
                    </div>
                    
                    <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                        <button 
                            onClick={handleExplain}
                            disabled={isExplaining}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            {isExplaining ? <span className="animate-pulse">思考中...</span> : <><Lightbulb size={14} className="text-amber-500" /> 解释代码</>}
                        </button>

                        <button 
                            onClick={handleRunCode}
                            disabled={isRunning}
                            className="flex items-center gap-2 px-6 py-1.5 text-sm font-bold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isRunning ? <span className="animate-spin">⏳</span> : <Play size={16} fill="currentColor" />}
                            运行代码
                        </button>
                    </div>
                </div>

                {/* Output Console */}
                <div className="h-40 bg-slate-900 rounded-xl shadow-sm border border-slate-800 flex flex-col overflow-hidden shrink-0">
                    <div className="px-4 py-1.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
                        <Terminal size={12} className="text-slate-400"/>
                        <span className="text-xs font-mono text-slate-400">终端输出 (Terminal)</span>
                    </div>
                    <pre className="flex-1 p-4 font-mono text-sm text-green-400 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                        {output || <span className="text-slate-600 italic">// 点击 "运行代码" 查看输出...</span>}
                    </pre>
                </div>
            </div>

            {/* Right Column: Visualization & Guide */}
            <div className="w-[450px] flex flex-col gap-4 min-w-0">
                
                {/* Visualizer */}
                <div className="h-[320px] shrink-0 bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex flex-col relative">
                     {visualizationActive && (
                        <div className="absolute top-2 right-3 flex items-center gap-1 text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-full z-20 animate-pulse">
                            <Zap size={10} fill="currentColor"/> 运行中
                        </div>
                     )}
                     <Visualizer type={currentLesson.visualizationType} isRunning={visualizationActive || isRunning} />
                </div>

                {/* Content/Guide */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                            <HelpCircle size={16} className="text-cyan-500"/>
                            课程指南
                        </h3>
                    </div>
                    <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
                        <div className="prose prose-sm prose-slate max-w-none">
                            <div className="whitespace-pre-wrap text-slate-600 leading-relaxed">
                                {currentLesson.content}
                            </div>
                        </div>
                        
                        {explanation && (
                            <div className="mt-6 bg-amber-50 border border-amber-100 rounded-lg p-4 animate-fade-in">
                                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Lightbulb size={12}/> AI 代码详解
                                </h4>
                                <p className="text-sm text-amber-900 leading-relaxed">{explanation}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
};

export default App;