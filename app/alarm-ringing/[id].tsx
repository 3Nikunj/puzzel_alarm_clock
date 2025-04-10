import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  Platform
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAlarmStore } from '@/store/alarm-store';
import { formatTime } from '@/utils/time';
import { 
  generateMathPuzzle, 
  generateMemoryPuzzle, 
  generateSequencePuzzle 
} from '@/utils/puzzle-generator';
import MathPuzzle from '@/components/puzzles/MathPuzzle';
import MemoryPuzzle from '@/components/puzzles/MemoryPuzzle';
import SequencePuzzle from '@/components/puzzles/SequencePuzzle';
import { PuzzleType } from '@/types/alarm';
import * as Haptics from 'expo-haptics';
import { playAlarmSound, stopAlarmSound } from '@/utils/sound';

export default function AlarmRingingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { alarms, setActiveAlarm } = useAlarmStore();
  
  const alarm = alarms.find((a) => a.id === id);
  
  const [currentPuzzle, setCurrentPuzzle] = useState<any>(null);
  const [solvedPuzzles, setSolvedPuzzles] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [puzzleKey, setPuzzleKey] = useState(0);
  
  const isMounted = useRef(true);
  
  // Generate a new puzzle based on the alarm type
  const generatePuzzle = () => {
    if (!alarm) return null;
    
    switch (alarm.puzzleType) {
      case PuzzleType.MATH:
        return generateMathPuzzle(alarm.puzzleDifficulty);
      case PuzzleType.MEMORY:
        return generateMemoryPuzzle(alarm.puzzleDifficulty);
      case PuzzleType.SEQUENCE:
        return generateSequencePuzzle(alarm.puzzleDifficulty);
      default:
        return generateMathPuzzle(alarm.puzzleDifficulty);
    }
  };
  
  // Generate first puzzle when component mounts
  useEffect(() => {
    if (!alarm) return;
    
    console.log(`Starting alarm with ${alarm.puzzleCount} puzzles of type ${alarm.puzzleType}`);
    setCurrentPuzzle(generatePuzzle());
    setIsLoading(false);
    
    return () => {
      isMounted.current = false;
    };
  }, [alarm]);
  
  // Handle sound and vibration
  useEffect(() => {
    const setupAlarm = async () => {
      try {
        await playAlarmSound();
      } catch (error) {
        console.error('Failed to play alarm sound:', error);
      }
    };
    
    setupAlarm();
    
    let vibrateInterval: NodeJS.Timeout | null = null;
    if (alarm?.vibrate && Platform.OS !== 'web') {
      vibrateInterval = setInterval(() => {
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } catch (error) {
          console.error('Haptics error:', error);
        }
      }, 1000);
    }
    
    return () => {
      stopAlarmSound();
      if (vibrateInterval) clearInterval(vibrateInterval);
    };
  }, [alarm]);
  
  // Handle puzzle solving
  const handlePuzzleSolved = async (correct: boolean) => {
    if (!isMounted.current || !alarm) return;
    
    if (correct) {
      const newSolvedCount = solvedPuzzles + 1;
      console.log(`Puzzle solved correctly. Progress: ${newSolvedCount}/${alarm.puzzleCount}`);
      
      if (newSolvedCount >= alarm.puzzleCount) {
        console.log('All puzzles completed, dismissing alarm');
        await dismissAlarm();
        return;
      }
      
      // Update state and generate next puzzle
      setSolvedPuzzles(newSolvedCount);
      setTimeout(() => {
        if (isMounted.current) {
          setCurrentPuzzle(generatePuzzle());
          setPuzzleKey(prev => prev + 1);
        }
      }, 500);
    } else {
      // On incorrect answer, just generate a new puzzle without incrementing solved count
      console.log('Incorrect answer, retrying same puzzle number');
      setTimeout(() => {
        if (isMounted.current) {
          setCurrentPuzzle(generatePuzzle());
          setPuzzleKey(prev => prev + 1);
        }
      }, 500);
    }
  };
  
  const dismissAlarm = async () => {
    try {
      await stopAlarmSound();
      if (isMounted.current) {
        setActiveAlarm(null);
        router.replace('/');
      }
    } catch (error) {
      console.error('Error dismissing alarm:', error);
      if (isMounted.current) {
        setActiveAlarm(null);
        router.replace('/');
      }
    }
  };
  
  // Emergency dismiss for development
  const emergencyDismiss = () => {
    console.log('Emergency dismiss triggered');
    dismissAlarm();
  };
  
  if (!alarm) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Alarm not found</Text>
        <TouchableOpacity style={styles.dismissButton} onPress={() => router.replace('/')}>
          <Text style={styles.dismissButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  if (isLoading || !currentPuzzle) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading alarm...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Bell size={32} color={colors.primary} style={styles.bellIcon} />
        <Text style={styles.time}>{formatTime(alarm.time)}</Text>
        {alarm.label && <Text style={styles.label}>{alarm.label}</Text>}
      </View>
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Puzzle {solvedPuzzles + 1} of {alarm.puzzleCount}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(solvedPuzzles / alarm.puzzleCount) * 100}%` }
            ]} 
          />
        </View>
      </View>
      
      <View style={styles.puzzleContainer}>
        {alarm.puzzleType === PuzzleType.MATH && (
          <MathPuzzle 
            puzzle={currentPuzzle} 
            onSolve={handlePuzzleSolved}
            puzzleIndex={puzzleKey}
          />
        )}
        
        {alarm.puzzleType === PuzzleType.MEMORY && (
          <MemoryPuzzle 
            puzzle={currentPuzzle} 
            onSolve={handlePuzzleSolved}
            puzzleIndex={puzzleKey}
          />
        )}
        
        {alarm.puzzleType === PuzzleType.SEQUENCE && (
          <SequencePuzzle 
            puzzle={currentPuzzle} 
            onSolve={handlePuzzleSolved}
            puzzleIndex={puzzleKey}
          />
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Solve {alarm.puzzleCount} puzzles to dismiss the alarm
        </Text>
        
        {__DEV__ && (
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={emergencyDismiss}
          >
            <Text style={styles.emergencyButtonText}>Emergency Dismiss (Dev Only)</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    marginTop: 24,
  },
  bellIcon: {
    marginBottom: 16,
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  progressContainer: {
    padding: 16,
    marginBottom: 16,
  },
  progressText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.cardBackground,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  puzzleContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    textAlign: 'center',
    marginTop: 40,
  },
  dismissButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignSelf: 'center',
  },
  dismissButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emergencyButton: {
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  emergencyButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
});