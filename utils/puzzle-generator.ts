import { MathPuzzle, MemoryPuzzle, PuzzleDifficulty, SequencePuzzle } from '@/types/alarm';

// Generate a random number between min and max (inclusive)
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Shuffle an array using Fisher-Yates algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Generate math puzzles based on difficulty
export const generateMathPuzzle = (difficulty: PuzzleDifficulty): MathPuzzle => {
  let num1: number, num2: number, operator: string, answer: number;
  const operators = ['+', '-', '*'];
  
  switch (difficulty) {
    case PuzzleDifficulty.EASY:
      num1 = getRandomNumber(1, 10);
      num2 = getRandomNumber(1, 10);
      operator = operators[getRandomNumber(0, 1)]; // Only + and -
      break;
    case PuzzleDifficulty.MEDIUM:
      num1 = getRandomNumber(5, 20);
      num2 = getRandomNumber(5, 20);
      operator = operators[getRandomNumber(0, 2)]; // All operators
      break;
    case PuzzleDifficulty.HARD:
      num1 = getRandomNumber(10, 50);
      num2 = getRandomNumber(10, 30);
      operator = operators[getRandomNumber(0, 2)]; // All operators
      
      // For hard difficulty, sometimes add a third number
      if (getRandomNumber(0, 1) === 1) {
        const num3 = getRandomNumber(1, 10);
        const operator2 = operators[getRandomNumber(0, 1)];
        
        // Calculate the answer for the complex expression
        let tempAnswer;
        if (operator === '+') tempAnswer = num1 + num2;
        else if (operator === '-') tempAnswer = num1 - num2;
        else tempAnswer = num1 * num2;
        
        if (operator2 === '+') answer = tempAnswer + num3;
        else if (operator2 === '-') answer = tempAnswer - num3;
        else answer = tempAnswer * num3;
        
        // Return the complex puzzle
        return {
          question: `(${num1} ${operator} ${num2}) ${operator2} ${num3} = ?`,
          answer,
          options: generateOptions(answer, difficulty),
        };
      }
      break;
    default:
      num1 = getRandomNumber(1, 10);
      num2 = getRandomNumber(1, 10);
      operator = operators[0]; // Default to addition
      break;
  }
  
  // Calculate the answer
  if (operator === '+') answer = num1 + num2;
  else if (operator === '-') answer = num1 - num2;
  else answer = num1 * num2;
  
  return {
    question: `${num1} ${operator} ${num2} = ?`,
    answer,
    options: generateOptions(answer, difficulty),
  };
};

// Generate options for multiple choice
const generateOptions = (answer: number, difficulty: PuzzleDifficulty): number[] => {
  const options = [answer];
  const count = difficulty === PuzzleDifficulty.EASY ? 3 : 4;
  const range = difficulty === PuzzleDifficulty.EASY ? 5 : 
                difficulty === PuzzleDifficulty.MEDIUM ? 10 : 20;
  
  while (options.length < count) {
    const option = answer + getRandomNumber(-range, range);
    if (option !== answer && !options.includes(option)) {
      options.push(option);
    }
  }
  
  return shuffleArray(options);
};

// Generate memory puzzles
export const generateMemoryPuzzle = (difficulty: PuzzleDifficulty): MemoryPuzzle => {
  let gridSize: number;
  let sequenceLength: number;
  
  switch (difficulty) {
    case PuzzleDifficulty.EASY:
      gridSize = 3;
      sequenceLength = 3;
      break;
    case PuzzleDifficulty.MEDIUM:
      gridSize = 4;
      sequenceLength = 4;
      break;
    case PuzzleDifficulty.HARD:
      gridSize = 5;
      sequenceLength = 5;
      break;
    default:
      gridSize = 3;
      sequenceLength = 3;
      break;
  }
  
  const sequence: number[] = [];
  const totalCells = gridSize * gridSize;
  
  while (sequence.length < sequenceLength) {
    const cell = getRandomNumber(0, totalCells - 1);
    if (!sequence.includes(cell)) {
      sequence.push(cell);
    }
  }
  
  return {
    sequence,
    gridSize,
  };
};

// Generate sequence puzzles
export const generateSequencePuzzle = (difficulty: PuzzleDifficulty): SequencePuzzle => {
  let sequence: number[] = [];
  let step: number;
  
  switch (difficulty) {
    case PuzzleDifficulty.EASY:
      // Simple arithmetic sequence (e.g., 2, 4, 6, 8, ...)
      const start = getRandomNumber(1, 5);
      step = getRandomNumber(1, 3);
      sequence = Array.from({ length: 5 }, (_, i) => start + i * step);
      break;
    case PuzzleDifficulty.MEDIUM:
      // Fibonacci-like sequence or alternating step sequence
      if (getRandomNumber(0, 1) === 0) {
        // Fibonacci-like
        sequence = [getRandomNumber(1, 3), getRandomNumber(2, 5)];
        for (let i = 2; i < 5; i++) {
          sequence.push(sequence[i - 1] + sequence[i - 2]);
        }
      } else {
        // Alternating steps
        const start = getRandomNumber(1, 10);
        const step1 = getRandomNumber(1, 3);
        const step2 = getRandomNumber(4, 6);
        sequence = [start];
        for (let i = 1; i < 5; i++) {
          sequence.push(sequence[i - 1] + (i % 2 === 0 ? step1 : step2));
        }
      }
      break;
    case PuzzleDifficulty.HARD:
      // Quadratic sequence or complex pattern
      const a = getRandomNumber(1, 2);
      sequence = Array.from({ length: 5 }, (_, i) => a * i * i + getRandomNumber(1, 3) * i + getRandomNumber(0, 2));
      break;
    default:
      // Default simple sequence
      sequence = Array.from({ length: 5 }, (_, i) => i * 2 + 1);
      break;
  }
  
  // Choose a random position to hide
  const missingIndex = getRandomNumber(1, 3); // Don't hide first or last for easier solving
  const correctAnswer = sequence[missingIndex];
  
  // Generate options
  const options = [correctAnswer];
  const range = difficulty === PuzzleDifficulty.EASY ? 3 : 
                difficulty === PuzzleDifficulty.MEDIUM ? 5 : 10;
  
  while (options.length < 4) {
    const option = correctAnswer + getRandomNumber(-range, range);
    if (option !== correctAnswer && !options.includes(option)) {
      options.push(option);
    }
  }
  
  return {
    sequence,
    missingIndex,
    options: shuffleArray(options),
  };
};