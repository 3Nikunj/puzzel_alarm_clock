import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MathPuzzle as MathPuzzleType } from '@/types/alarm';
import { colors } from '@/constants/colors';

interface MathPuzzleProps {
  puzzle: MathPuzzleType;
  onSolve: (correct: boolean) => void;
  puzzleIndex: number; // Add puzzle index to force re-render
}

export default function MathPuzzle({ puzzle, onSolve, puzzleIndex }: MathPuzzleProps) {
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
    const correct = answer === puzzle.answer;
    setIsCorrect(correct);
    setHasSubmitted(true);
    
    // Delay the onSolve callback to show feedback
    setTimeout(() => {
      onSolve(correct);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solve the equation</Text>
      
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{puzzle.question}</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        {puzzle.options?.map((option, index) => (
          <TouchableOpacity
            key={`${puzzleIndex}-${index}-${option}`}
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
    marginBottom: 20,
  },
  questionContainer: {
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  question: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
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