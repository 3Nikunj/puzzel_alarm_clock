import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAlarmStore } from '@/store/alarm-store';
import AlarmItem from '@/components/AlarmItem';
import { getCurrentTime } from '@/utils/time';

export default function AlarmsScreen() {
  const router = useRouter();
  const { alarms } = useAlarmStore();
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleAddAlarm = () => {
    router.push('/add-alarm');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.currentTimeContainer}>
          <Clock size={20} color={colors.primary} style={styles.clockIcon} />
          <Text style={styles.currentTime}>{currentTime}</Text>
        </View>
      </View>
      
      {alarms.length > 0 ? (
        <FlatList
          data={alarms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AlarmItem alarm={item} />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No alarms set</Text>
          <Text style={styles.emptyDescription}>
            Tap the + button to add your first alarm
          </Text>
        </View>
      )}
      
      <TouchableOpacity style={styles.addButton} onPress={handleAddAlarm}>
        <Plus size={24} color={colors.text} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  currentTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: 8,
  },
  currentTime: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});