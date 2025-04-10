export const formatTime = (time: string): string => {
  if (!time || !time.includes(':')) return '';
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);
  
  if (isNaN(hour) || isNaN(minute)) return '';
  
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  const formattedMinute = minute < 10 ? `0${minute}` : minute;
  
  return `${formattedHour}:${formattedMinute} ${period}`;
};

export const getCurrentTime = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const getDayName = (day: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[day] || '';
};

export const getTimeUntilAlarm = (alarmTime: string): string => {
  if (!alarmTime || !alarmTime.includes(':')) return '';
  
  const now = new Date();
  const [hours, minutes] = alarmTime.split(':');
  const alarmDate = new Date();
  
  const hour = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);
  
  if (isNaN(hour) || isNaN(minute)) return '';
  
  alarmDate.setHours(hour);
  alarmDate.setMinutes(minute);
  alarmDate.setSeconds(0);
  
  // If alarm time is earlier than current time, set it for tomorrow
  if (alarmDate < now) {
    alarmDate.setDate(alarmDate.getDate() + 1);
  }
  
  const diffMs = alarmDate.getTime() - now.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHrs === 0) {
    return `${diffMins} min`;
  }
  
  return `${diffHrs} hr ${diffMins} min`;
};