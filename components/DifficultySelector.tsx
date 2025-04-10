import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { PuzzleDifficulty } from '@/types/alarm';
import { colors } from '@/constants/colors';

interface DifficultySelectorProps {
  selectedDifficulty: PuzzleDifficulty;
  onDifficultySelect: (difficulty: PuzzleDifficulty) => void;
}

export default function DifficultySelector({ 
  selectedDifficulty, 
  onDifficultySelect 
}: DifficultySelectorProps) {
  const difficulties = [
    { 
      level: PuzzleDifficulty.EASY, 
      label: 'Easy',
      color: colors.success,
    },
    { 
      level: PuzzleDifficulty.MEDIUM, 
      label: 'Medium',
      color: colors.warning,
    },
    { 
      level: PuzzleDifficulty.HARD, 
      label: 'Hard',
      color: colors.error,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Difficulty Level</Text>
      <View style={styles.difficultyContainer}>
        {difficulties.map((difficulty) => (
          <TouchableOpacity
            key={difficulty.level}
            style={[
              styles.difficultyButton,
              selectedDifficulty === difficulty.level && {
                backgroundColor: `${difficulty.color}30`,
                borderColor: difficulty.color,
              },
            ]}
            onPress={() => onDifficultySelect(difficulty.level)}
          >
            <View 
              style={[
                styles.difficultyIndicator, 
                { backgroundColor: difficulty.color }
              ]} 
            />
            <Text
              style={[
                styles.difficultyLabel,
                selectedDifficulty === difficulty.level && {
                  color: difficulty.color,
                  fontWeight: 'bold',
                },
              ]}
            >
              {difficulty.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  difficultyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  difficultyLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});