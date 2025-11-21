import React from 'react';
import { CURRICULUM } from '../constants';
import { Lesson, Module } from '../types';
import { BookOpen, Cpu, Zap, ChevronRight, CheckCircle } from 'lucide-react';

interface SidebarProps {
  currentLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
  completedLessons: string[];
}

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Cpu,
  Zap
};

export const Sidebar: React.FC<SidebarProps> = ({ currentLessonId, onSelectLesson, completedLessons }) => {
  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 overflow-y-auto">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xl">
          <span className="text-2xl">ʕ·ᴥ·ʔ</span>
          <span>GoViz</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">交互式 Go 语言学院</p>
      </div>

      <div className="flex-1 py-4">
        {CURRICULUM.map((module: Module) => {
          const Icon = iconMap[module.icon] || BookOpen;
          return (
            <div key={module.id} className="mb-6">
              <div className="px-6 mb-2 flex items-center gap-2 text-slate-100 font-semibold uppercase text-xs tracking-wider">
                <Icon size={14} className="text-cyan-500" />
                {module.title}
              </div>
              <ul>
                {module.lessons.map((lesson) => {
                  const isActive = lesson.id === currentLessonId;
                  const isCompleted = completedLessons.includes(lesson.id);
                  
                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() => onSelectLesson(lesson)}
                        className={`w-full text-left px-6 py-2 text-sm flex items-center justify-between transition-colors
                          ${isActive 
                            ? 'bg-cyan-500/10 text-cyan-400 border-r-2 border-cyan-500' 
                            : 'hover:bg-slate-800 hover:text-slate-100'
                          }`}
                      >
                        <span className="truncate mr-2">{lesson.title}</span>
                        {isCompleted && <CheckCircle size={14} className="text-green-500 flex-shrink-0" />}
                        {isActive && !isCompleted && <ChevronRight size={14} />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 text-xs text-slate-600 text-center border-t border-slate-800">
        Powered by Gemini 2.5 Flash
      </div>
    </div>
  );
};