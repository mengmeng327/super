import React, { useState } from 'react';
import { TaskDefinition, TaskType, SubTask, TierOption } from '../types';
import { CheckCircle2, Circle, ChevronDown, Star, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';

interface TaskCardProps {
  task: TaskDefinition;
  onComplete: (points: number, description: string, subTaskId?: string) => void;
  onRevoke: (subTaskId: string) => void;
  isCompleted: boolean; // For simple/timed tasks
  completedSubTaskIds: string[]; // For multi/tiered tasks
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onRevoke, isCompleted, completedSubTaskIds }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [bonusChecked, setBonusChecked] = useState(false);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Helper to generate task background based on category
  const bgClass = task.category === 'SCHOOL' ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100';
  const textClass = task.category === 'SCHOOL' ? 'text-blue-700' : 'text-orange-700';
  const iconClass = task.category === 'SCHOOL' ? 'text-blue-500' : 'text-orange-500';

  const handleSimpleComplete = () => {
    if (!isCompleted) {
      onComplete(task.basePoints || 0, `完成 ${task.title}`, `${task.id}_daily`);
    } else {
      onRevoke(`${task.id}_daily`);
    }
  };

  const handleTimedComplete = () => {
    if (!isCompleted) {
      const points = (task.basePoints || 0) + (bonusChecked ? (task.bonusPoints || 0) : 0);
      const desc = `完成 ${task.title}${bonusChecked ? ' (额外奖励)' : ''}`;
      onComplete(points, desc, `${task.id}_daily`);
    } else {
      onRevoke(`${task.id}_daily`);
    }
  };

  const handleSubTaskClick = (sub: SubTask) => {
    const uniqueId = `${task.id}_${sub.id}`;
    if (!completedSubTaskIds.includes(uniqueId)) {
      onComplete(sub.points, `完成 ${task.title} - ${sub.label}`, uniqueId);
    } else {
      onRevoke(uniqueId);
    }
  };

  const handleTierClick = (tier: TierOption) => {
    const uniqueId = `${task.id}_daily`;
    const isAlreadyDone = completedSubTaskIds.includes(uniqueId);
    
    if (!isAlreadyDone) {
       onComplete(tier.points, `完成 ${task.title} (${tier.label})`, uniqueId);
    } else {
      // Only allow revoking if we click the "Revoke" button or if logic allows.
      // For tiered, we'll add a specific UI state to revoke.
      onRevoke(uniqueId);
    }
  };

  const renderContent = () => {
    switch (task.type) {
      case TaskType.TIMED_BONUS:
        return (
          <div className="mt-3 space-y-3">
            <div 
              onClick={() => !isCompleted && setBonusChecked(!bonusChecked)}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                bonusChecked ? "bg-yellow-100 border-yellow-300" : "bg-white border-gray-200",
                isCompleted && "opacity-50 cursor-not-allowed bg-gray-100"
              )}
            >
              <div className={cn("w-5 h-5 rounded border flex items-center justify-center", bonusChecked ? "bg-yellow-400 border-yellow-500" : "border-gray-300")}>
                 {bonusChecked && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <div className="flex-1">
                 <span className="text-sm font-medium text-gray-700">{task.bonusConditionLabel}</span>
                 <span className="ml-2 text-xs font-bold text-yellow-600">+{task.bonusPoints} 分</span>
              </div>
            </div>
            
            <button
              onClick={handleTimedComplete}
              className={cn(
                "w-full py-2 rounded-lg font-bold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2",
                isCompleted 
                  ? "bg-white border-2 border-red-200 text-red-500 hover:bg-red-50" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              )}
            >
              {isCompleted ? (
                <>
                  <RotateCcw className="w-4 h-4" /> 撤销今日打卡
                </>
              ) : (
                `领取 ${task.basePoints! + (bonusChecked ? task.bonusPoints! : 0)} 分`
              )}
            </button>
          </div>
        );

      case TaskType.MULTI_SUBTASK:
        return (
          <div className="mt-3 grid grid-cols-1 gap-2">
            {task.subTasks?.map((sub) => {
              const uniqueId = `${task.id}_${sub.id}`;
              const isDone = completedSubTaskIds.includes(uniqueId);
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSubTaskClick(sub)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-all active:scale-95",
                    isDone ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:border-indigo-300"
                  )}
                >
                  <span className={cn("text-sm font-medium", isDone ? "text-green-700" : "text-gray-700")}>
                    {sub.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {!isDone && <span className="text-xs font-bold text-indigo-600">+{sub.points}</span>}
                    {isDone ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                  </div>
                </button>
              );
            })}
          </div>
        );

      case TaskType.TIERED:
        const uniqueId = `${task.id}_daily`;
        const isTierDone = completedSubTaskIds.includes(uniqueId);
        return (
          <div className="mt-3 flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              {task.tiers?.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => handleTierClick(tier)}
                  disabled={isTierDone}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all active:scale-95",
                    isTierDone 
                      ? "bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed" 
                      : "bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  )}
                >
                  <span className="text-[10px] text-gray-500 font-medium mb-1">{tier.label}</span>
                  <span className="text-lg font-bold text-purple-600">+{tier.points}</span>
                </button>
              ))}
            </div>
            {isTierDone && (
              <button 
                onClick={() => onRevoke(uniqueId)}
                className="w-full py-2 text-xs font-bold text-red-500 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> 撤销今日打卡
              </button>
            )}
          </div>
        );

      case TaskType.SIMPLE:
      default:
        return (
           <button
              onClick={handleSimpleComplete}
              className={cn(
                "mt-3 w-full py-2 rounded-lg font-bold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2",
                isCompleted 
                  ? "bg-white border-2 border-red-200 text-red-500 hover:bg-red-50" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              )}
            >
              {isCompleted ? (
                <>
                  <RotateCcw className="w-4 h-4" /> 撤销今日打卡
                </>
              ) : (
                `完成任务 (+${task.basePoints})`
              )}
            </button>
        );
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn("rounded-xl border shadow-sm overflow-hidden transition-colors duration-300", bgClass, isCompleted && "bg-opacity-50 bg-gray-50 border-gray-200")}
    >
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-full transition-colors duration-300", isCompleted ? "bg-green-100 text-green-600" : "bg-white/60 " + iconClass)}>
            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Star className="w-6 h-6" />}
          </div>
          <div>
            <h3 className={cn("font-bold text-lg transition-colors", isCompleted ? "text-gray-500" : textClass)}>{task.title}</h3>
            {!isExpanded && (
               <p className={cn("text-xs font-medium", isCompleted ? "text-green-600" : "text-gray-400")}>
                 {isCompleted ? "今日已完成" : "点击记录"}
               </p>
            )}
          </div>
        </div>
        <div className={cn("transition-transform duration-300", isExpanded ? "rotate-180" : "")}>
           <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4"
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskCard;