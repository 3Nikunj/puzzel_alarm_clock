import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SequencePuzzle as SequencePuzzleType } from '@/types/alarm';
import { colors } from '@/constants/colors';

interface SequencePuzzleProps {
  puzzle: SequencePuzzleType;
  onSolve: (correct: boolean) => void;
  puzzleIndex: number; // Add puzzle index to force re-render
}

export default function SequencePuzzle({ puzzle, onSolve, puzzleIndex }: SequencePuzzleProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Reset state when puzzle changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setHasSubmitted(false);
  }, [puzzle, puzzleIndex]);

  const handleSelectAnswer = (answer: number) => {
    if (hasSubmitted) return; // Prevent multiple submissions
    
    setSelectedAnswer(answer);
    const correctAnswer = puzzle.sequence[puzzle.missingIndex];
    const correct = answer === correctAnswer;
    setIsCorrect(correct);
    setHasSubmitted(true);
    
    // Delay the onSolve callback to show feedback
    setTimeout(() => {
      onSolve(correct);
    }, 1000);
  };

  // Create a display sequence with a question mark for the missing number
  const displaySequence = [...puzzle.sequence];
  displaySequence[puzzle.missingIndex] = -1; // Use -1 to represent the missing number

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find the missing number</Text>
      
      <View style={styles.sequenceContainer}>
        {displaySequence.map((number, index) => (
          <View 
            key={`${puzzleIndex}-${index}`}
            style={[
              styles.sequenceItem,
              number === -1 && styles.missingItem,
            ]}
          >
            <Text style={[
              styles.sequenceNumber,
              number === -1 && styles.missingNumber,
            ]}>
              {number === -1 ? '?' : number.toString()}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.optionsContainer}>
        {puzzle.options.map((option, index) => (
          <TouchableOpacity
            key={`${puzzleIndex}-option-${index}`}
            style={[
              styles.optionButton,
              selectedAnswer === option && (
                isCorrect ? styles.correctOption : styles.incorrectOption
              ),
            ]}
            onPress={() => handleSelectAnswer(option)}
            disabled={hasSubmitted}
          >
            <Text 
              style={[
                styles.optionText,
                selectedAnswer === option && (
                  isCorrect ? styles.correctOptionText : styles.incorrectOptionText
                ),
              ]}
            >
              {option.toString()}
            </Text>
          </TouchableOpacity>
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
    marginBottom: 24,
  },
  sequenceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 12,
  },
  sequenceItem: {
    width: 50,
    height: 50,
    backgroundColor: colors.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  missingItem: {
    backgroundColor: `${colors.primary}30`,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  sequenceNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  missingNumber: {
    color: colors.primary,
    fontSize: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  optionButton: {
    width: '48%',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  correctOption: {
    backgroundColor: `${colors.success}30`,
    borderColor: colors.success,
  },
  incorrectOption: {
    backgroundColor: `${colors.error}30`,
    borderColor: colors.error,
  },
  optionText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  correctOptionText: {
    color: colors.success,
  },
  incorrectOptionText: {
    color: colors.error,
  },
});