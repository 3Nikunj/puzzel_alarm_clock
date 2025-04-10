import React, { useEffect, useState, useRef } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAlarmStore } from '@/store/alarm-store';
import { playAlarmSound, stopAlarmSound } from '@/utils/sound';
import * as Haptics from 'expo-haptics';

export default function AlarmChecker() {
  const router = useRouter();
  const { alarms, activeAlarmId, setActiveAlarm } = useAlarmStore();
  const [appState, setAppState] = useState(AppState.currentState);
  
  // Use a ref to track if component is mounted
  const isMounted = useRef(true);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Check for alarms every minute
  useEffect(() => {
    const checkAlarms = () => {
      // Don't check if an alarm is already active
      if (activeAlarmId) {
        console.log('Alarm already active:', activeAlarmId);
        return;
      }
      
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      const currentDay = now.getDay();
      
      console.log(`Checking alarms at ${currentTime} on day ${currentDay}`);
      
      // Find alarms that should trigger now
      const triggeredAlarms = alarms.filter(alarm => {
        if (!alarm.isActive) return false;
        
        // Check if the time matches
        if (alarm.time !== currentTime) return false;
        
        // If no days are selected, treat as a one-time alarm
        if (alarm.days.length === 0) return true;
        
        // Check if today is one of the selected days
        return alarm.days.includes(currentDay);
      });
      
      if (triggeredAlarms.length > 0 && isMounted.current) {
        const alarmToTrigger = triggeredAlarms[0];
        console.log('Triggering alarm:', alarmToTrigger.id);
        
        setActiveAlarm(alarmToTrigger.id);
        
        // Play sound
        playAlarmSound().catch(err => console.error('Failed to play alarm sound:', err));
        
        // Vibrate if enabled
        if (alarmToTrigger.vibrate && Platform.OS !== 'web') {
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // Start a continuous vibration pattern
            const vibrateInterval = setInterval(() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }, 1000);
            
            // Clear the interval after 10 seconds to prevent battery drain
            setTimeout(() => clearInterval(vibrateInterval), 10000);
          } catch (error) {
            console.error('Haptics error:', error);
          }
        }
        
        // Navigate to alarm screen
        router.push(`/alarm-ringing/${alarmToTrigger.id}`);
      }
    };
    
    // Check immediately on mount
    checkAlarms();
    
    // Set up interval to check every 15 seconds for more reliable triggering
    const interval = setInterval(() => {
      checkAlarms();
    }, 15000);
    
    return () => clearInterval(interval);
  }, [alarms, activeAlarmId, setActiveAlarm, router]);
  
  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // When app comes to foreground, check alarms
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App came to foreground, checking active alarm');
        
        // If there's an active alarm, navigate to it
        if (activeAlarmId && isMounted.current) {
          console.log('Resuming active alarm:', activeAlarmId);
          router.push(`/alarm-ringing/${activeAlarmId}`);
          playAlarmSound().catch(err => console.error('Failed to play alarm sound:', err));
        }
      }
      
      setAppState(nextAppState);
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [appState, activeAlarmId, router]);
  
  // Clean up sound when component unmounts
  useEffect(() => {
    return () => {
      stopAlarmSound().catch(err => console.error('Failed to stop alarm sound:', err));
    };
  }, []);
  
  // This component doesn't render anything
  return null;
}