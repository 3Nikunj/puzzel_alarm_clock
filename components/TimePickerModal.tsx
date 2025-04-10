import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTime: (time: string) => void;
  initialTime?: string;
}

const { width } = Dimensions.get('window');

export default function TimePickerModal({ 
  visible, 
  onClose, 
  onSelectTime,
  initialTime = '08:00'
}: TimePickerModalProps) {
  const [selectedHour, setSelectedHour] = useState('08');
  const [selectedMinute, setSelectedMinute] = useState('00');
  
  useEffect(() => {
    if (initialTime && initialTime.includes(':')) {
      const [hours, minutes] = initialTime.split(':');
      if (hours && minutes) {
        setSelectedHour(hours);
        setSelectedMinute(minutes);
      }
    }
  }, [initialTime]);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleConfirm = () => {
    onSelectTime(`${selectedHour}:${selectedMinute}`);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Time</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>{selectedHour}:{selectedMinute}</Text>
          </View>
          
          <View style={styles.pickerContainer}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Hour</Text>
              <ScrollView 
                style={styles.picker}
                showsVerticalScrollIndicator={false}
              >
                {hours.map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.pickerItem,
                      hour === selectedHour && styles.selectedPickerItem
                    ]}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <Text 
                      style={[
                        styles.pickerItemText,
                        hour === selectedHour && styles.selectedPickerItemText
                      ]}
                    >
                      {hour}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Minute</Text>
              <ScrollView 
                style={styles.picker}
                showsVerticalScrollIndicator={false}
              >
                {minutes.map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.pickerItem,
                      minute === selectedMinute && styles.selectedPickerItem
                    ]}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <Text 
                      style={[
                        styles.pickerItemText,
                        minute === selectedMinute && styles.selectedPickerItemText
                      ]}
                    >
                      {minute}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  timeDisplay: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  pickerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  pickerLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  picker: {
    height: 150,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  pickerItem: {
    padding: 12,
    alignItems: 'center',
  },
  selectedPickerItem: {
    backgroundColor: `${colors.primary}30`,
  },
  pickerItemText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  selectedPickerItemText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});