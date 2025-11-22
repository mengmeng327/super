import React, { useState, useEffect } from 'react';
import { SCHOOL_TASKS, HOME_TASKS } from './constants';
import { PointLog } from './types';
import Header from './components/Header';
import TaskCard from './components/TaskCard';
import SpendingModal from './components/SpendingModal';
import CalendarView from './components/CalendarView';
import { getTodayStr, cn, isSameDayAsLog } from './utils';
import { History, ShoppingCart, BookOpen, Home, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  // State initialization
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('star_achiever_points');
    return saved ? parseInt(saved) : 0;
  });

  const [logs, setLogs] = useState<PointLog[]>(() => {
    const saved = localStorage.getItem('star_achiever_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('star_achiever_daily_tasks');
    const savedDate = localStorage.getItem('star_achiever_last_date');
    // Reset daily tasks if it's a new day
    if (savedDate !== getTodayStr()) {
      return [];
    }
    return saved ? JSON.parse(saved) : [];
  });

  const [isSpendingOpen, setIsSpendingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'TASKS' | 'HISTORY'>('TASKS');
  
  // Persistence
  useEffect(() => {
    localStorage.setItem('star_achiever_points', points.toString());
    localStorage.setItem('star_achiever_logs', JSON.stringify(logs));
    localStorage.setItem('star_achiever_daily_tasks', JSON.stringify(completedTaskIds));
    localStorage.setItem('star_achiever_last_date', getTodayStr());
  }, [points, logs, completedTaskIds]);

  // Handlers
  const handleAddPoints = (amount: number, description: string, uniqueTaskId?: string) => {
    const newLog: PointLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      description,
      delta: amount,
      taskId: uniqueTaskId, 
    };

    setPoints(prev => prev + amount);
    setLogs(prev => [...prev, newLog]);
    
    if (uniqueTaskId) {
      setCompletedTaskIds(prev => [...prev, uniqueTaskId]);
    }
  };

  const handleSpendPoints = (amount: number, item: string) => {
    const newLog: PointLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      description: `消耗: ${item}`,
      delta: -amount,
    };
    setPoints(prev => prev - amount);
    setLogs(prev => [...prev, newLog]);
  };

  const handleRevokeTask = (uniqueTaskId: string) => {
    const today = new Date();
    // Find the latest log entry for this task created today
    const logEntry = [...logs].reverse().find(l => 
      l.taskId === uniqueTaskId && 
      isSameDayAsLog(l.timestamp, today)
    );

    if (!logEntry) return;

    // Remove log, revert points, remove from completed IDs
    setPoints(prev => prev - logEntry.delta);
    setLogs(prev => prev.filter(l => l.id !== logEntry.id));
    setCompletedTaskIds(prev => prev.filter(id => id !== uniqueTaskId));
  };

  const handleDeleteLog = (logId: string, delta: number, taskId?: string) => {
    setPoints(prev => prev - delta);
    setLogs(prev => prev.filter(l => l.id !== logId));
    if (taskId) {
      setCompletedTaskIds(prev => prev.filter(id => id !== taskId));
    }
  };

  // Helper to determine if a task is complete
  const isTaskComplete = (taskId: string) => {
    return completedTaskIds.includes(`${taskId}_daily`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
      <Header points={points} />

      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Tab Switcher */}
        <div className="flex p-1 bg-gray-200 rounded-xl mb-6">
           <button 
             onClick={() => setActiveTab('TASKS')}
             className={cn("flex-1 py-2 rounded-lg font-medium text-sm transition-all", activeTab === 'TASKS' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500")}
           >
             今日任务
           </button>
           <button 
             onClick={() => setActiveTab('HISTORY')}
             className={cn("flex-1 py-2 rounded-lg font-medium text-sm transition-all", activeTab === 'HISTORY' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500")}
           >
             历史记录
           </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'TASKS' ? (
            <motion.div 
              key="tasks"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              {/* School Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-800">学校作业</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {SCHOOL_TASKS.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleAddPoints}
                      onRevoke={handleRevokeTask}
                      isCompleted={isTaskComplete(task.id)}
                      completedSubTaskIds={completedTaskIds}
                    />
                  ))}
                </div>
              </section>

              {/* Home Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Home className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-bold text-gray-800">家庭作业</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {HOME_TASKS.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleAddPoints}
                      onRevoke={handleRevokeTask}
                      isCompleted={isTaskComplete(task.id)}
                      completedSubTaskIds={completedTaskIds}
                    />
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <CalendarView logs={logs} />
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                 <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                       <History className="w-4 h-4" /> 积分明细
                    </h3>
                 </div>
                 <div className="max-h-[400px] overflow-y-auto">
                    {logs.slice().reverse().map((log) => (
                       <div key={log.id} className="p-4 border-b border-gray-50 flex justify-between items-center last:border-0 group">
                          <div className="flex-1">
                             <p className="font-medium text-gray-800 text-sm">{log.description}</p>
                             <p className="text-xs text-gray-400 mt-0.5">{new Date(log.timestamp).toLocaleString('zh-CN')}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={cn("font-bold text-sm", log.delta > 0 ? "text-green-600" : "text-red-500")}>
                               {log.delta > 0 ? '+' : ''}{log.delta}
                            </span>
                            {/* Allow deleting logs from today */}
                            {isSameDayAsLog(log.timestamp, new Date()) && (
                              <button 
                                onClick={() => handleDeleteLog(log.id, log.delta, log.taskId)}
                                className="p-1.5 rounded-md bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                                title="删除此记录"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                       </div>
                    ))}
                    {logs.length === 0 && (
                       <div className="p-8 text-center text-gray-400 text-sm">暂无记录</div>
                    )}
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button for Spending */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setIsSpendingOpen(true)}
          className="bg-pink-500 hover:bg-pink-600 text-white rounded-full p-4 shadow-lg shadow-pink-500/30 transition-all active:scale-90 flex items-center gap-2 font-bold"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="pr-1">消耗积分</span>
        </button>
      </div>

      <SpendingModal 
        isOpen={isSpendingOpen} 
        onClose={() => setIsSpendingOpen(false)} 
        onSpend={handleSpendPoints}
        maxPoints={points}
      />
    </div>
  );
};

export default App;