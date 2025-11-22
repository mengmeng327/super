import React from 'react';
import { PointLog } from '../types';
import { getDailyGains, cn } from '../utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface CalendarViewProps {
  logs: PointLog[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ logs }) => {
  const dailyGains = getDailyGains(logs);
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Padding for start of month (0 = Sunday, 1 = Monday...)
  const startDayOfWeek = getDay(monthStart); 
  const emptyDays = Array(startDayOfWeek).fill(null);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        📅 {format(today, 'yyyy年 M月', { locale: zhCN })} 积分记录
      </h2>
      
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
          <div key={d} className="text-xs text-gray-400 font-medium">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {daysInMonth.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const points = dailyGains[dateStr] || 0;
          const isCurrentDay = isToday(day);
          
          return (
            <div 
              key={dateStr} 
              className={cn(
                "aspect-square rounded-lg flex flex-col items-center justify-center relative border",
                isCurrentDay ? "border-indigo-500 bg-indigo-50" : "border-gray-100 bg-white"
              )}
            >
              <span className={cn("text-xs font-medium mb-1", isCurrentDay ? "text-indigo-700" : "text-gray-500")}>
                {format(day, 'd')}
              </span>
              {points > 0 ? (
                <div className="w-full flex justify-center">
                   <span className="bg-green-100 text-green-700 text-[10px] px-1.5 rounded-full font-bold">
                     +{points}
                   </span>
                </div>
              ) : (
                <span className="text-[10px] text-gray-300">-</span>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>本月累计获得: <span className="font-bold text-indigo-600">{Object.values(dailyGains).reduce((a, b) => a + b, 0)}</span> 分</span>
      </div>
    </div>
  );
};

export default CalendarView;