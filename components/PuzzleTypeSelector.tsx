import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Brain, Calculator, ListOrdered } from 'lucide-react-native';
import { PuzzleType } from '@/types/alarm';
import { colors } from '@/constants/colors';

interface PuzzleTypeSelectorProps {
  selectedType: PuzzleType;
  onTypeSelect: (type: PuzzleType) => void;
}

export default function PuzzleTypeSelector({ 
  selectedType, 
  onTypeSelect 
}: PuzzleTypeSelectorProps) {
  const puzzleTypes = [
    { 
      type: PuzzleType.MATH, 
      label: 'Math', 
      icon: <Calculator size={24} color={selectedType === PuzzleType.MATH ? colors.text : colors.textSecondary} />,
      description: 'Solve math equations to turn off the alarm'
    },
    { 
      type: PuzzleType.MEMORY, 
      label: 'Memory', 
      icon: <Brain size={24} color={selectedType === PuzzleType.MEMORY ? colors.text : colors.textSecondary} />,
      description: 'Remember and repeat patterns to turn off the alarm'
    },
    { 
      type: PuzzleType.SEQUENCE, 
      label: 'Sequence', 
      icon: <ListOrdered size={24} color={selectedType === PuzzleType.SEQUENCE ? colors.text : colors.textSecondary} />,
      description: 'Find the missing number in a sequence'
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Puzzle Type</Text>
      <View style={styles.typesContainer}>
        {puzzleTypes.map((puzzle) => (
          <TouchableOpacity
            key={puzzle.type}
            style={[
              styles.typeButton,
              selectedType === puzzle.type && styles.selectedTypeButton,
            ]}
            onPress={() => onTypeSelect(puzzle.type)}
          >
            <View style={styles.typeIconContainer}>
              {puzzle.icon}
            </View>
            <Text
              style={[
                styles.typeLabel,
                selectedType === puzzle.type && styles.selectedTypeLabel,
              ]}
            >
              {puzzle.label}
            </Text>
            <Text style={styles.typeDescription}>
              {puzzle.description}
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
  typesContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  typeButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTypeButton: {
    backgroundColor: `${colors.primary}30`,
    borderColor: colors.primary,
  },
  typeIconContainer: {
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  selectedTypeLabel: {
    color: colors.text,
  },
  typeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});