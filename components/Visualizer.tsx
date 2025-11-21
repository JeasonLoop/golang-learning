import React, { useEffect, useState, useRef } from 'react';
import { VisualizationType } from '../types';
import { GO_COLOR_PRIMARY, GO_COLOR_SECONDARY } from '../constants';

interface VisualizerProps {
  type: VisualizationType;
  isRunning: boolean; // Trigger animations
}

export const Visualizer: React.FC<VisualizerProps> = ({ type, isRunning }) => {
  const [tick, setTick] = useState(0);
  const requestRef = useRef<number>(0);

  // Animation loop
  useEffect(() => {
    const animate = (time: number) => {
      setTick(time);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  const renderContent = () => {
    switch (type) {
      case VisualizationType.VARIABLE:
        return <VariableViz />;
      case VisualizationType.POINTER:
        return <PointerViz />;
      case VisualizationType.SLICE:
        return <SliceViz />;
      case VisualizationType.CHANNEL:
        return <ChannelViz tick={tick} isRunning={isRunning} />;
      case VisualizationType.GOROUTINE:
        return <GoroutineViz tick={tick} isRunning={isRunning} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <div className="text-4xl mb-4">🧐</div>
            <p>该主题暂无可视化演示</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full w-full bg-slate-50 rounded-lg border border-slate-200 overflow-hidden relative select-none">
      <div className="absolute top-2 left-3 text-xs font-bold text-slate-400 uppercase tracking-wider bg-white px-2 py-1 rounded border shadow-sm z-10">
        演示: {type}
      </div>
      <div className="w-full h-full flex items-center justify-center p-4 bg-grid-pattern">
        {renderContent()}
      </div>
    </div>
  );
};

// --- Sub-components for specific visualizers ---

const VariableViz = () => (
  <svg width="350" height="180" viewBox="0 0 350 180" className="max-w-full">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.1" />
      </filter>
    </defs>

    {/* Memory Block 1 */}
    <g transform="translate(30, 50)">
      <rect x="0" y="0" width="130" height="90" rx="8" fill="white" stroke={GO_COLOR_PRIMARY} strokeWidth="2" filter="url(#shadow)" />
      <path d="M 0 30 L 130 30" stroke={GO_COLOR_PRIMARY} strokeWidth="1" strokeOpacity="0.3" />
      <text x="10" y="20" className="text-xs font-mono fill-slate-500 font-bold">age (int)</text>
      <text x="65" y="70" textAnchor="middle" className="text-3xl font-bold font-mono fill-slate-700">10</text>
      <text x="125" y="105" textAnchor="end" className="text-[10px] font-mono fill-slate-400">0x1400012c</text>
    </g>

    {/* Memory Block 2 */}
    <g transform="translate(190, 50)">
      <rect x="0" y="0" width="130" height="90" rx="8" fill="white" stroke={GO_COLOR_SECONDARY} strokeWidth="2" filter="url(#shadow)" />
      <path d="M 0 30 L 130 30" stroke={GO_COLOR_SECONDARY} strokeWidth="1" strokeOpacity="0.3" />
      <text x="10" y="20" className="text-xs font-mono fill-slate-500 font-bold">name (string)</text>
      <text x="65" y="70" textAnchor="middle" className="text-xl font-bold font-mono fill-slate-700">"Gopher"</text>
      <text x="125" y="105" textAnchor="end" className="text-[10px] font-mono fill-slate-400">0x14000130</text>
    </g>
  </svg>
);

const PointerViz = () => (
  <svg width="400" height="220" viewBox="0 0 400 220" className="max-w-full">
    {/* Value Variable */}
    <g transform="translate(250, 70)">
      <rect x="0" y="0" width="120" height="90" rx="6" fill="#eff6ff" stroke={GO_COLOR_PRIMARY} strokeWidth="2" />
      <text x="60" y="55" textAnchor="middle" className="text-3xl font-bold fill-slate-700">42</text>
      <text x="115" y="85" textAnchor="end" className="text-xs font-mono fill-slate-400">地址: 0xC001</text>
      <text x="0" y="-10" className="text-sm font-bold fill-slate-600">x (int)</text>
    </g>

    {/* Pointer Variable */}
    <g transform="translate(30, 70)">
      <rect x="0" y="0" width="120" height="90" rx="6" fill="#fdf2f8" stroke={GO_COLOR_SECONDARY} strokeWidth="2" />
      <text x="60" y="55" textAnchor="middle" className="text-lg font-mono font-bold fill-slate-700">0xC001</text>
      <text x="115" y="85" textAnchor="end" className="text-xs font-mono fill-slate-400">地址: 0xA004</text>
      <text x="0" y="-10" className="text-sm font-bold fill-slate-600">p (*int)</text>
    </g>

    {/* Arrow */}
    <path d="M 150 115 L 240 115" stroke={GO_COLOR_SECONDARY} strokeWidth="3" markerEnd="url(#arrowhead)" strokeDasharray="5,5" />
    <text x="195" y="105" textAnchor="middle" className="text-xs fill-slate-500 bg-white">指向</text>

    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill={GO_COLOR_SECONDARY} />
      </marker>
    </defs>
  </svg>
);

const SliceViz = () => (
  <svg width="500" height="280" viewBox="0 0 500 280" className="max-w-full">
    {/* Underlying Array */}
    <text x="20" y="30" className="text-sm font-bold fill-slate-500">底层数组 (Underlying Array)</text>
    <g transform="translate(20, 45)">
      {[2, 3, 5, 7, 11, 13].map((val, i) => {
        const isSlicePart = i >= 1 && i <= 3;
        const isCapacityPart = i >= 1 && i <= 5;

        let fillColor = "#f1f5f9"; // default gray
        if (isSlicePart) fillColor = "#dbeafe"; // active blue
        else if (isCapacityPart) fillColor = "#f8fafc"; // capacity light gray

        let strokeColor = "#cbd5e1";
        if (isSlicePart) strokeColor = GO_COLOR_PRIMARY;
        else if (isCapacityPart) strokeColor = "#94a3b8";

        return (
          <g key={i} transform={`translate(${i * 70}, 0)`}>
            <rect width="65" height="65" rx="4" fill={fillColor} stroke={strokeColor} strokeWidth={isSlicePart ? 2 : 1} />
            <text x="32.5" y="40" textAnchor="middle" className={`font-mono text-lg ${isSlicePart ? 'font-bold fill-slate-800' : 'fill-slate-400'}`}>{val}</text>
            <text x="32.5" y="82" textAnchor="middle" className="text-xs fill-slate-400">idx:{i}</text>
          </g>
        );
      })}
    </g>

    {/* Brackets indicating slice range */}
    <path d="M 90 115 L 90 125 L 275 125 L 275 115" fill="none" stroke={GO_COLOR_PRIMARY} strokeWidth="2" />
    <text x="182" y="140" textAnchor="middle" className="text-xs font-bold fill-cyan-600">切片视图 s [1:4]</text>

    {/* Slice Struct */}
    <g transform="translate(100, 170)">
      <text x="0" y="-15" className="text-sm font-bold fill-slate-700">切片头部结构 (Slice Header)</text>

      <g transform="translate(0, 0)">
        <rect width="200" height="60" rx="8" fill="white" stroke={GO_COLOR_PRIMARY} strokeWidth="2" filter="url(#shadow)" />

        {/* Pointer Field */}
        <g transform="translate(20, 10)">
          <text className="text-[10px] uppercase fill-slate-400 font-bold">Ptr</text>
          <text y="30" className="font-mono text-sm font-bold fill-slate-700">0xArr[1]</text>
        </g>
        <line x1="90" y1="10" x2="90" y2="50" stroke="#e2e8f0" />

        {/* Len Field */}
        <g transform="translate(105, 10)">
          <text className="text-[10px] uppercase fill-slate-400 font-bold">Len</text>
          <text y="30" className="font-mono text-xl font-bold fill-slate-700">3</text>
        </g>
        <line x1="145" y1="10" x2="145" y2="50" stroke="#e2e8f0" />

        {/* Cap Field */}
        <g transform="translate(160, 10)">
          <text className="text-[10px] uppercase fill-slate-400 font-bold">Cap</text>
          <text y="30" className="font-mono text-xl font-bold fill-slate-700">5</text>
        </g>
      </g>

      {/* Pointer Arrow connection */}
      <path d="M 40 0 L 40 -20 L 50 -20 L 90 40" fill="none" stroke={GO_COLOR_PRIMARY} strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
    </g>
  </svg>
);

const ChannelViz = ({ tick, isRunning }: { tick: number, isRunning: boolean }) => {
  // Animate items only if running or just loop slowly
  const speed = isRunning ? 3 : 0.5;
  const offset = (tick * speed / 10) % 300;

  return (
    <svg width="450" height="200" viewBox="0 0 450 200" className="max-w-full">
      {/* Pipe */}
      <defs>
        <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>

      {/* Main Channel Tube */}
      <rect x="70" y="70" width="310" height="60" fill="url(#pipeGrad)" stroke="#94a3b8" strokeWidth="2" rx="8" />
      <text x="225" y="150" textAnchor="middle" className="text-xs fill-slate-500 font-mono">chan int (缓冲区)</text>

      {/* Gopher Sender */}
      <g transform="translate(20, 80)">
        <circle cx="20" cy="20" r="25" fill={GO_COLOR_PRIMARY} />
        <text x="20" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">G1</text>
        <text x="20" y="60" textAnchor="middle" fill={GO_COLOR_PRIMARY} fontSize="10" fontWeight="bold">发送方</text>
      </g>

      {/* Data Items Moving */}
      <g clipPath="url(#clipPipe)">
        <clipPath id="clipPipe">
          <rect x="75" y="70" width="300" height="60" />
        </clipPath>

        {[0, 1, 2].map(i => (
          <g key={i} transform={`translate(${70 + ((offset + i * 100) % 300)}, 100)`}>
            <circle cx="0" cy="0" r="18" fill={GO_COLOR_SECONDARY} stroke="white" strokeWidth="2" />
            <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{[7, 2, 8][i]}</text>
          </g>
        ))}
      </g>

      {/* Gopher Receiver */}
      <g transform="translate(390, 80)">
        <circle cx="20" cy="20" r="25" fill={GO_COLOR_PRIMARY} />
        <text x="20" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">G2</text>
        <text x="20" y="60" textAnchor="middle" fill={GO_COLOR_PRIMARY} fontSize="10" fontWeight="bold">接收方</text>
      </g>

      {/* Direction Arrow */}
      <path d="M 180 50 L 270 50" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow-gray)" />
      <defs>
        <marker id="arrow-gray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
        </marker>
      </defs>
    </svg>
  );
};

const GoroutineViz = ({ tick, isRunning }: { tick: number, isRunning: boolean }) => {
  const cx = 200;
  const cy = 100;
  const r = 70;

  const speed = isRunning ? 1 : 0.2;
  const angle1 = (tick * speed / 300) % (2 * Math.PI);
  const angle2 = ((tick * speed + 1500) / 400) % (2 * Math.PI);
  const angle3 = ((tick * speed + 3000) / 350) % (2 * Math.PI);

  return (
    <svg width="400" height="200" viewBox="0 0 400 200">
      {/* Scheduler/Runtime Context */}
      <circle cx={cx} cy={cy} r={r + 30} fill="none" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

      {/* Main Thread */}
      <line x1="40" y1="100" x2="360" y2="100" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />

      {/* Main Gopher */}
      <g transform={`translate(${cx}, ${cy})`}>
        <circle r="25" fill={GO_COLOR_PRIMARY} stroke="white" strokeWidth="3" />
        <text y="5" textAnchor="middle" className="text-xs font-bold fill-white">Main</text>
      </g>

      {/* Worker Goroutines */}
      {[angle1, angle2, angle3].map((ang, i) => (
        <g key={i} transform={`translate(${cx + r * Math.cos(ang)}, ${cy + r * Math.sin(ang)})`}>
          <circle r="18" fill={GO_COLOR_SECONDARY} className="drop-shadow-md" />
          <text y="4" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">go #{i + 1}</text>
          {/* Connection Line */}
          <line x1={-r * Math.cos(ang) + (25 * Math.cos(ang))} y1={-r * Math.sin(ang) + (25 * Math.sin(ang))} x2="0" y2="0" stroke={GO_COLOR_SECONDARY} strokeWidth="1" opacity="0.5" />
        </g>
      ))}

      <text x="200" y="20" textAnchor="middle" className="fill-slate-400 text-xs font-bold tracking-widest">GO RUNTIME SCHEDULER</text>
    </svg>
  )
}