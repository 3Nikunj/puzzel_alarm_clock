import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MemoryPuzzle as MemoryPuzzleType } from '@/types/alarm';
import { colors } from '@/constants/colors';

interface MemoryPuzzleProps {
  puzzle: MemoryPuzzleType;
  onSolve: (correct: boolean) => void;
  puzzleIndex: number; // Add puzzle index to force re-render
}

const { width } = Dimensions.get('window');
const MAX_GRID_WIDTH = 300;
const GRID_WIDTH = Math.min(width - 40, MAX_GRID_WIDTH);

export default function MemoryPuzzle({ puzzle, onSolve, puzzleIndex }: MemoryPuzzleProps) {
  const [phase, setPhase] = useState<'showing' | 'input' | 'feedback'>('showing');
  const [highlightedCells, setHighlightedCells] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Calculate cell size based on grid size
  const cellSize = (GRID_WIDTH - (puzzle.gridSize - 1) * 8) / puzzle.gridSize;

  // Reset state when puzzle changes
  useEffect(() => {
    setPhase('showing');
    setHighlightedCells([]);
    setUserSequence([]);
    setIsCorrect(null);
    setHasSubmitted(false);
    
    // Show the sequence
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < puzzle.sequence.length) {
        setHighlightedCells([puzzle.sequence[currentIndex]]);
        currentIndex++;
      } else {
        setHighlightedCells([]);
        clearInterval(interval);
        setPhase('input');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [puzzle, puzzleIndex]);

  const handleCellPress = (cellIndex: number) => {
    if (phase !== 'input' || hasSubmitted) return;

    const newUserSequence = [...userSequence, cellIndex];
    setUserSequence(newUserSequence);
    setHighlightedCells([cellIndex]);

    // Clear highlight after a short delay
    setTimeout(() => {
      setHighlightedCells([]);
    }, 300);

    // Check if the user has completed the sequence
    if (newUserSequence.length === puzzle.sequence.length) {
      // Check if the sequence is correct
      const correct = newUserSequence.every(
        (cell, index) => cell === puzzle.sequence[index]
      );
      
      setIsCorrect(correct);
      setPhase('feedback');
      setHasSubmitted(true);
      
      // Delay the onSolve callback to show feedback
      setTimeout(() => {
        onSolve(correct);
      }, 1500);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {phase === 'showing' 
          ? 'Remember the sequence' 
          : phase === 'input' 
            ? 'Repeat the sequence' 
            : isCorrect 
              ? 'Correct!' 
              : 'Incorrect!'}
      </Text>
      
      <Text style={styles.subtitle}>
        {phase === 'showing' 
          ? 'Watch carefully...' 
          : phase === 'input' 
            ? `${userSequence.length}/${puzzle.sequence.length} cells` 
            : isCorrect 
              ? 'Well done!' 
              : 'Try again!'}
      </Text>
      
      <View 
        style={[
          styles.grid, 
          { 
            width: GRID_WIDTH,
            height: GRID_WIDTH,
          }
        ]}
      >
        {Array.from({ length: puzzle.gridSize * puzzle.gridSize }).map((_, index) => (
          <TouchableOpacity
            key={`${puzzleIndex}-${index}`}
            style={[
              styles.cell,
              { 
                width: cellSize, 
                height: cellSize,
              },
              highlightedCells.includes(index) && styles.highlightedCell,
              phase === 'feedback' && isCorrect && userSequence.includes(index) && styles.correctCell,
              phase === 'feedback' && !isCorrect && userSequence.includes(index) && styles.incorrectCell,
            ]}
            onPress={() => handleCellPress(index)}
            disabled={phase !== 'input' || hasSubmitted}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  cell: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightedCell: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  correctCell: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  incorrectCell: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
});