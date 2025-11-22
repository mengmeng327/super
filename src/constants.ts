import { TaskDefinition, TaskType } from './types';

export const SCHOOL_TASKS: TaskDefinition[] = [
  {
    id: 'chinese',
    title: '语文作业',
    category: 'SCHOOL',
    type: TaskType.TIMED_BONUS,
    basePoints: 3,
    bonusPoints: 2,
    bonusConditionLabel: '20:00 前完成',
  },
  {
    id: 'math',
    title: '数学作业',
    category: 'SCHOOL',
    type: TaskType.TIMED_BONUS,
    basePoints: 3,
    bonusPoints: 2,
    bonusConditionLabel: '20:00 前完成',
  },
  {
    id: 'read_check',
    title: '阅读打卡',
    category: 'SCHOOL',
    type: TaskType.SIMPLE,
    basePoints: 5, // Reading > 30mins
  },
  {
    id: 'oral_math',
    title: '口算',
    category: 'SCHOOL',
    type: TaskType.TIMED_BONUS,
    basePoints: 3,
    bonusPoints: 2,
    bonusConditionLabel: '20:00 前完成',
  },
];

export const HOME_TASKS: TaskDefinition[] = [
  {
    id: 'english_check',
    title: '英语打卡',
    category: 'HOME',
    type: TaskType.SIMPLE,
    basePoints: 3,
  },
  {
    id: 'writing',
    title: '写字',
    category: 'HOME',
    type: TaskType.SIMPLE,
    basePoints: 3,
  },
  {
    id: 'literacy_5min',
    title: '5分钟语文素养',
    category: 'HOME',
    type: TaskType.SIMPLE,
    basePoints: 3, 
  },
  {
    id: 'raz',
    title: '单词 / RAZ',
    category: 'HOME',
    type: TaskType.MULTI_SUBTASK,
    subTasks: [
      { id: 'raz_video', label: '看视频', points: 2 },
      { id: 'raz_hw', label: '课后作业', points: 3 },
    ],
  },
  {
    id: 'xueersi',
    title: '学而思',
    category: 'HOME',
    type: TaskType.SIMPLE,
    basePoints: 5,
  },
  {
    id: 'quanling',
    title: '泉灵',
    category: 'HOME',
    type: TaskType.MULTI_SUBTASK,
    subTasks: [
      { id: 'ql_video', label: '看视频', points: 5 },
      { id: 'ql_hw', label: '课后作业', points: 5 },
    ],
  },
  {
    id: 'piano',
    title: '钢琴练习',
    category: 'HOME',
    type: TaskType.TIERED,
    tiers: [
      { id: 'piano_low', label: '< 10分钟', points: 2 },
      { id: 'piano_mid', label: '10-20 分钟', points: 4 },
      { id: 'piano_high', label: '20-30 分钟', points: 6 },
    ],
  },
];