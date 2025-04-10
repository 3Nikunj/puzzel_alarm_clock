import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';

interface DaySelectorProps {
  selectedDays: number[];
  onDayToggle: (day: number) => void;
}

export default function DaySelector({ selectedDays, onDayToggle }: DaySelectorProps) {
  const days = [
    { id: 0, name: 'S', fullName: 'Sunday' },
    { id: 1, name: 'M', fullName: 'Monday' },
    { id: 2, name: 'T', fullName: 'Tuesday' },
    { id: 3, name: 'W', fullName: 'Wednesday' },
    { id: 4, name: 'T', fullName: 'Thursday' },
    { id: 5, name: 'F', fullName: 'Friday' },
    { id: 6, name: 'S', fullName: 'Saturday' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Repeat</Text>
      <View style={styles.daysContainer}>
        {days.map((day) => (
          <TouchableOpacity
            key={day.id}
            style={[
              styles.dayButton,
              selectedDays.includes(day.id) && styles.selectedDayButton,
            ]}
            onPress={() => onDayToggle(day.id)}
            accessibilityLabel={day.fullName}
          >
            <Text
              style={[
                styles.dayText,
                selectedDays.includes(day.id) && styles.selectedDayText,
              ]}
            >
              {day.name}
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
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedDayButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  selectedDayText: {
    color: colors.text,
  },
});