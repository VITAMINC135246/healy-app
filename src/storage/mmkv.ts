import Constants from 'expo-constants';

type JSONStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

const inExpoGo = Constants?.appOwnership === 'expo';

function memoryStorage(): JSONStorage {
  const mem = new Map<string, string>();
  return {
    getItem: (k) => mem.get(k) ?? null,
    setItem: (k, v) => mem.set(k, v),
    removeItem: (k) => void mem.delete(k),
  };
}

let impl: JSONStorage;

if (inExpoGo) {
  console.warn('[storage] Expo Go detected → using in-memory storage');
  impl = memoryStorage();
} else {
  try {
    // 仅在 Dev Client/独立应用里加载 MMKV
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MMKV } = require('react-native-mmkv');
    const mmkv = new MMKV({ id: 'healy@store' });
    impl = {
      getItem: (k) => mmkv.getString(k) ?? null,
      setItem: (k, v) => mmkv.set(k, v),
      removeItem: (k) => mmkv.delete(k),
    };
  } catch (e) {
    console.warn('[storage] MMKV not available, fallback to memory.', e);
    impl = memoryStorage();
  }
}

export const mmkvPersist = impl;
