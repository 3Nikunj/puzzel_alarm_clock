import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Clock, Vibrate } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAlarmStore } from '@/store/alarm-store';
import { PuzzleType, PuzzleDifficulty } from '@/types/alarm';
import TimePickerModal from '@/components/TimePickerModal';
import DaySelector from '@/components/DaySelector';
import PuzzleTypeSelector from '@/components/PuzzleTypeSelector';
import DifficultySelector from '@/components/DifficultySelector';
import PuzzleCountSelector from '@/components/PuzzleCountSelector';

export default function EditAlarmScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { alarms, updateAlarm } = useAlarmStore();
  
  const alarm = alarms.find((a) => a.id === id);
  
  const [time, setTime] = useState(alarm?.time || '08:00');
  const [label, setLabel] = useState(alarm?.label || '');
  const [days, setDays] = useState<number[]>(alarm?.days || []);
  const [puzzleType, setPuzzleType] = useState<PuzzleType>(alarm?.puzzleType || PuzzleType.MATH);
  const [puzzleDifficulty, setPuzzleDifficulty] = useState<PuzzleDifficulty>(
    alarm?.puzzleDifficulty || PuzzleDifficulty.MEDIUM
  );
  const [puzzleCount, setPuzzleCount] = useState(alarm?.puzzleCount || 3);
  const [vibrate, setVibrate] = useState(alarm?.vibrate !== undefined ? alarm.vibrate : true);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (!alarm) {
      router.back();
    }
  }, [alarm, router]);

  const handleDayToggle = (day: number) => {
    if (days.includes(day)) {
      setDays(days.filter((d) => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const handleSave = () => {
    if (id) {
      updateAlarm(id as string, {
        time,
        label,
        days,
        puzzleType,
        puzzleDifficulty,
        puzzleCount,
        vibrate,
      });
      
      router.back();
    }
  };

  if (!alarm) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Alarm not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Edit Alarm',
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }} 
        />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.timeSelector}
            onPress={() => setShowTimePicker(true)}
          >
            <Clock size={24} color={colors.primary} style={styles.timeIcon} />
            <Text style={styles.timeText}>{time}</Text>
          </TouchableOpacity>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Label</Text>
            <TextInput
              style={styles.input}
              placeholder="Alarm label (optional)"
              placeholderTextColor={colors.textSecondary}
              value={label}
              onChangeText={setLabel}
              maxLength={30}
            />
          </View>
          
          <DaySelector selectedDays={days} onDayToggle={handleDayToggle} />
          
          <PuzzleTypeSelector 
            selectedType={puzzleType} 
            onTypeSelect={setPuzzleType} 
          />
          
          <DifficultySelector 
            selectedDifficulty={puzzleDifficulty} 
            onDifficultySelect={setPuzzleDifficulty} 
          />
          
          <PuzzleCountSelector 
            count={puzzleCount} 
            onCountChange={setPuzzleCount} 
          />
          
          <View style={styles.optionItem}>
            <View style={styles.optionInfo}>
              <Vibrate size={20} color={colors.text} style={styles.optionIcon} />
              <Text style={styles.optionLabel}>Vibration</Text>
            </View>
            <Switch
              value={vibrate}
              onValueChange={setVibrate}
              trackColor={{ false: colors.inactive, true: colors.primaryLight }}
              thumbColor={vibrate ? colors.primary : colors.textSecondary}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
        
        <TimePickerModal
          visible={showTimePicker}
          onClose={() => setShowTimePicker(false)}
          onSelectTime={setTime}
          initialTime={time}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  timeIcon: {
    marginRight: 12,
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  saveButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    textAlign: 'center',
    marginTop: 20,
  },
});