import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface PuzzleCountSelectorProps {
  count: number;
  onCountChange: (count: number) => void;
  min?: number;
  max?: number;
}

export default function PuzzleCountSelector({ 
  count, 
  onCountChange,
  min = 1,
  max = 5
}: PuzzleCountSelectorProps) {
  const handleDecrement = () => {
    if (count > min) {
      onCountChange(count - 1);
    }
  };

  const handleIncrement = () => {
    if (count < max) {
      onCountChange(count + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Number of Puzzles</Text>
      <Text style={styles.description}>
        How many puzzles you need to solve to turn off the alarm
      </Text>
      
      <View style={styles.counterContainer}>
        <TouchableOpacity 
          style={[styles.counterButton, count <= min && styles.disabledButton]} 
          onPress={handleDecrement}
          disabled={count <= min}
        >
          <Minus size={20} color={count <= min ? colors.inactive : colors.text} />
        </TouchableOpacity>
        
        <View style={styles.countDisplay}>
          <Text style={styles.countText}>{count}</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.counterButton, count >= max && styles.disabledButton]} 
          onPress={handleIncrement}
          disabled={count >= max}
        >
          <Plus size={20} color={count >= max ? colors.inactive : colors.text} />
        </TouchableOpacity>
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
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabledButton: {
    backgroundColor: colors.background,
    borderColor: colors.inactive,
    opacity: 0.5,
  },
  countDisplay: {
    width: 80,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  countText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
});