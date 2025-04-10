export interface Alarm {
  id: string;
  time: string; // Format: HH:MM
  days: number[]; // 0-6 (Sunday-Saturday)
  label: string;
  isActive: boolean;
  puzzleType: PuzzleType;
  puzzleDifficulty: PuzzleDifficulty;
  puzzleCount: number; // Number of puzzles to solve
  vibrate: boolean;
  sound: string;
}

export enum PuzzleType {
  MATH = 'math',
  MEMORY = 'memory',
  SEQUENCE = 'sequence',
}

export enum PuzzleDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface MathPuzzle {
  question: string;
  answer: number;
  options?: number[];
}

export interface MemoryPuzzle {
  sequence: number[];
  gridSize: number;
}

export interface SequencePuzzle {
  sequence: number[];
  missingIndex: number;
  options: number[];
}