// src/storage/mmkv.ts
/* 统一持久化适配器：优先 MMKV；在 Expo Go（无原生模块）时自动降级到内存。
   仅提供 getItem / setItem / removeItem（Zustand createJSONStorage 需要的接口） */

type JSONStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

let impl: JSONStorage;

// 尝试动态加载 MMKV（在 Expo Go 环境可能不存在原生模块）
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { MMKV } = require('react-native-mmkv');
  const mmkv = new MMKV({ id: 'healy@store' });
  impl = {
    getItem: (key) => mmkv.getString(key) ?? null,
    setItem: (key, value) => mmkv.set(key, value),
    removeItem: (key) => mmkv.delete(key),
  };
  // console.log('[storage] MMKV ready');
} catch (e) {
  // 退化为内存（开发期/Expo Go 临时用；重启会丢）
  console.warn('[storage] MMKV not available, falling back to in-memory storage (dev only).');
  const mem = new Map<string, string>();
  impl = {
    getItem: (key) => mem.get(key) ?? null,
    setItem: (key, value) => mem.set(key, value),
    removeItem: (key) => void mem.delete(key),
  };
}

export const mmkvPersist = impl;
