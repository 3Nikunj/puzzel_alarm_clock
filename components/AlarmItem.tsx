import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, Edit, Trash2 } from 'lucide-react-native';
import { Alarm } from '@/types/alarm';
import { colors } from '@/constants/colors';
import { formatTime, getDayName } from '@/utils/time';
import { useAlarmStore } from '@/store/alarm-store';

interface AlarmItemProps {
  alarm: Alarm;
}

export default function AlarmItem({ alarm }: AlarmItemProps) {
  const router = useRouter();
  const { toggleAlarm, deleteAlarm } = useAlarmStore();

  const handleEdit = () => {
    router.push(`/edit-alarm/${alarm.id}`);
  };

  const handleToggle = () => {
    toggleAlarm(alarm.id);
  };

  const handleDelete = () => {
    deleteAlarm(alarm.id);
  };

  return (
    <View style={[styles.container, !alarm.isActive && styles.inactiveContainer]}>
      <View style={styles.timeContainer}>
        <Clock 
          size={20} 
          color={alarm.isActive ? colors.primary : colors.inactive} 
          style={styles.icon} 
        />
        <Text style={[styles.time, !alarm.isActive && styles.inactiveText]}>
          {formatTime(alarm.time)}
        </Text>
      </View>
      
      <View style={styles.detailsContainer}>
        {alarm.label ? (
          <Text style={[styles.label, !alarm.isActive && styles.inactiveText]}>
            {alarm.label}
          </Text>
        ) : null}
        
        <View style={styles.daysContainer}>
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <Text
              key={day}
              style={[
                styles.day,
                alarm.days.includes(day) ? styles.activeDay : styles.inactiveDay,
                !alarm.isActive && styles.disabledDay,
              ]}
            >
              {getDayName(day)}
            </Text>
          ))}
        </View>
        
        <Text style={[styles.puzzleInfo, !alarm.isActive && styles.inactiveText]}>
          {alarm.puzzleType.charAt(0).toUpperCase() + alarm.puzzleType.slice(1)} puzzles ({alarm.puzzleCount}) - {alarm.puzzleDifficulty}
        </Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
          <Edit size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
          <Trash2 size={20} color={colors.error} />
        </TouchableOpacity>
        
        <Switch
          value={alarm.isActive}
          onValueChange={handleToggle}
          trackColor={{ false: colors.inactive, true: colors.primaryLight }}
          thumbColor={alarm.isActive ? colors.primary : colors.textSecondary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'column',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  inactiveContainer: {
    borderLeftColor: colors.inactive,
    opacity: 0.8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  time: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  inactiveText: {
    color: colors.textSecondary,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  day: {
    fontSize: 12,
    marginRight: 8,
    fontWeight: '500',
  },
  activeDay: {
    color: colors.primary,
  },
  inactiveDay: {
    color: colors.textSecondary,
  },
  disabledDay: {
    opacity: 0.6,
  },
  puzzleInfo: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 12,
  },
});