export enum VisualizationType {
  NONE = 'NONE',
  VARIABLE = 'VARIABLE',
  POINTER = 'POINTER',
  SLICE = 'SLICE',
  CHANNEL = 'CHANNEL',
  GOROUTINE = 'GOROUTINE',
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown/Text content
  initialCode: string;
  visualizationType: VisualizationType;
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  lessons: Lesson[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface CodeExecutionResult {
  output: string;
  error?: string;
}

// For visualizer
export interface MemoryBlock {
  address: string;
  value: string | number;
  label?: string;
  color?: string;
  isPointer?: boolean;
  targetAddress?: string;
}
