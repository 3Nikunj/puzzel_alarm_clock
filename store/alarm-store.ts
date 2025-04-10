import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alarm, PuzzleDifficulty, PuzzleType } from '@/types/alarm';

interface AlarmState {
  alarms: Alarm[];
  activeAlarmId: string | null;
  addAlarm: (alarm: Omit<Alarm, 'id'>) => void;
  updateAlarm: (id: string, alarm: Partial<Alarm>) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  setActiveAlarm: (id: string | null) => void;
  getNextAlarm: () => Alarm | null;
}

export const useAlarmStore = create<AlarmState>()(
  persist(
    (set, get) => ({
      alarms: [],
      activeAlarmId: null,
      addAlarm: (alarm) => 
        set((state) => ({
          alarms: [...state.alarms, { ...alarm, id: Date.now().toString() }],
        })),
      updateAlarm: (id, updatedAlarm) =>
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, ...updatedAlarm } : alarm
          ),
        })),
      deleteAlarm: (id) =>
        set((state) => ({
          alarms: state.alarms.filter((alarm) => alarm.id !== id),
          activeAlarmId: state.activeAlarmId === id ? null : state.activeAlarmId,
        })),
      toggleAlarm: (id) =>
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
          ),
        })),
      setActiveAlarm: (id) => set({ activeAlarmId: id }),
      getNextAlarm: () => {
        const { alarms } = get();
        const now = new Date();
        const today = now.getDay();
        
        // Filter active alarms
        const activeAlarms = alarms.filter(alarm => alarm.isActive);
        
        if (activeAlarms.length === 0) return null;
        
        // Find the next alarm to trigger
        let nextAlarm: Alarm | null = null;
        let minTimeDiff = Infinity;
        
        for (const alarm of activeAlarms) {
          // If no days are selected, treat as a one-time alarm
          const alarmDays = alarm.days.length > 0 ? alarm.days : [today];
          
          for (const day of alarmDays) {
            const [hours, minutes] = alarm.time.split(':').map(Number);
            const alarmDate = new Date();
            
            // Set the alarm date to the specified day
            const dayDiff = (day - today + 7) % 7;
            alarmDate.setDate(now.getDate() + dayDiff);
            alarmDate.setHours(hours, minutes, 0, 0);
            
            // If the alarm time is in the past for today, move to next week
            if (dayDiff === 0 && alarmDate < now) {
              alarmDate.setDate(alarmDate.getDate() + 7);
            }
            
            const timeDiff = alarmDate.getTime() - now.getTime();
            
            if (timeDiff > 0 && timeDiff < minTimeDiff) {
              minTimeDiff = timeDiff;
              nextAlarm = alarm;
            }
          }
        }
        
        return nextAlarm;
      },
    }),
    {
      name: 'alarm-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);