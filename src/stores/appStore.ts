// src/stores/appStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvPersist } from '../storage/mmkv';
import { isoDate } from '../utils/date';

export type Persona = 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'Mixed'|undefined;

export type Step = {
  id: string;
  title: string;
  done: boolean;
};

type State = {
  persona?: Persona;
  todaySteps: Step[];
  relief: number;          // 今日“舒服一些”计数
  evidences: string[];     // 证据墙（先用纯文本）
  lastDate: string;        // 'YYYY-MM-DD'，用于跨天重置
};

type Actions = {
  // 本周只需要这些：其他动作先占位（下周再填充逻辑）
  resetDailyIfNeeded: () => void;

  setPersona: (p?: Persona) => void;
  setTodaySteps: (steps: Step[]) => void;
  toggleStep: (id: string) => void;
  incrementRelief: () => void;
  addEvidence: (text: string) => void;

  clearAll: () => void;    // 调试用：一键清库
};

const initialState: State = {
  persona: undefined,
  todaySteps: [],
  relief: 0,
  evidences: [],
  lastDate: isoDate(new Date()),
};

export const useAppStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      resetDailyIfNeeded: () => {
        const today = isoDate(new Date());
        const { lastDate } = get();
        if (lastDate !== today) {
          // 新的一天：重置与日相关的字段
          set({
            lastDate: today,
            todaySteps: [],
            relief: 0,
            // evidences 是否日清？先保留历史（不清）
          });
        }
      },

      setPersona: (p) => set({ persona: p }),

      setTodaySteps: (steps) => set({ todaySteps: steps }),

      toggleStep: (id) => {
        const next = get().todaySteps.map(s => s.id === id ? { ...s, done: !s.done } : s);
        set({ todaySteps: next });
      },

      incrementRelief: () => set({ relief: get().relief + 1 }),

      addEvidence: (text) => set({ evidences: [...get().evidences, text] }),

      clearAll: () => set({ ...initialState, lastDate: isoDate(new Date()) }),
    }),
    {
      name: 'healy@store/v1',
      version: 1,
      storage: createJSONStorage(() => mmkvPersist),
      // 需要的话可以限制持久化字段：
      // partialize: (s) => ({ persona: s.persona, todaySteps: s.todaySteps, relief: s.relief, evidences: s.evidences, lastDate: s.lastDate }),
    }
  )
);

export default useAppStore;

