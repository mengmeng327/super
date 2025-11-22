import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isSameDay, startOfDay } from 'date-fns';
import { PointLog } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTodayStr() {
  return format(new Date(), 'yyyy-MM-dd');
}

// Group logs by day and calculate total gained (ignoring spending)
export function getDailyGains(logs: PointLog[]) {
  const days: Record<string, number> = {};
  
  logs.forEach(log => {
    if (log.delta > 0) {
      const dayStr = format(new Date(log.timestamp), 'yyyy-MM-dd');
      days[dayStr] = (days[dayStr] || 0) + log.delta;
    }
  });
  
  return days;
}

export function isSameDayAsLog(logTimestamp: number, date: Date) {
  return isSameDay(new Date(logTimestamp), date);
}