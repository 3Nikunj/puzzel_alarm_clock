import React from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Bell, Moon, Vibrate, Volume2, Info, HelpCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = React.useState(true);
  const [vibrate, setVibrate] = React.useState(true);
  const [sound, setSound] = React.useState(true);
  const [snooze, setSnooze] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Moon size={20} color={colors.text} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.inactive, true: colors.primaryLight }}
              thumbColor={darkMode ? colors.primary : colors.textSecondary}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Vibrate size={20} color={colors.text} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Vibration</Text>
            </View>
            <Switch
              value={vibrate}
              onValueChange={setVibrate}
              trackColor={{ false: colors.inactive, true: colors.primaryLight }}
              thumbColor={vibrate ? colors.primary : colors.textSecondary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Volume2 size={20} color={colors.text} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Sound</Text>
            </View>
            <Switch
              value={sound}
              onValueChange={setSound}
              trackColor={{ false: colors.inactive, true: colors.primaryLight }}
              thumbColor={sound ? colors.primary : colors.textSecondary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={colors.text} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Snooze</Text>
            </View>
            <Switch
              value={snooze}
              onValueChange={setSnooze}
              trackColor={{ false: colors.inactive, true: colors.primaryLight }}
              thumbColor={snooze ? colors.primary : colors.textSecondary}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Info size={20} color={colors.text} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>App Version</Text>
            </View>
            <Text style={styles.settingValue}>1.0.0</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <HelpCircle size={20} color={colors.text} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  section: {
    marginBottom: 24,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});