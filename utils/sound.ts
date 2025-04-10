import { Audio } from 'expo-av';
import { Platform } from 'react-native';

// Keep a reference to the sound object
let sound: Audio.Sound | null = null;

// Function to load and play the alarm sound
export const playAlarmSound = async (): Promise<void> => {
  try {
    // Unload any existing sound first
    if (sound !== null) {
      await sound.unloadAsync();
    }
    
    // Create a new sound object
    sound = new Audio.Sound();
    
    // For web, we'll use a URL to an MP3 file
    if (Platform.OS === 'web') {
      await sound.loadAsync({
        uri: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3'
      });
    } else {
      // For native platforms, we'll use a local asset
      // This is a fallback in case the require doesn't work
      try {
        await sound.loadAsync(require('@/assets/sounds/alarm.mp3'));
      } catch (error) {
        console.log('Failed to load local sound, using fallback URL');
        await sound.loadAsync({
          uri: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3'
        });
      }
    }
    
    // Configure sound
    await sound.setIsLoopingAsync(true);
    await sound.setVolumeAsync(1.0);
    
    // Play the sound
    await sound.playAsync();
    console.log('Alarm sound playing successfully');
    
  } catch (error) {
    console.error('Error playing alarm sound:', error);
  }
};

// Function to stop the alarm sound
export const stopAlarmSound = async (): Promise<void> => {
  try {
    if (sound !== null) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      sound = null;
    }
  } catch (error) {
    console.error('Error stopping alarm sound:', error);
    // Reset sound reference even if there was an error
    sound = null;
  }
};