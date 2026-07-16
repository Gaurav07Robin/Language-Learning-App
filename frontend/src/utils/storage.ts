import { Platform } from 'react-native';

export const storage = Platform.OS === 'web' 
  ? {
      getString: (key: string) => localStorage.getItem(key),
      getBoolean: (key: string) => localStorage.getItem(key) === 'true',
      set: (key: string, value: string | boolean) => localStorage.setItem(key, String(value)),
      delete: (key: string) => localStorage.removeItem(key)
    }
  : (() => {
      // Require dynamically so web doesn't crash trying to load native modules
      const { MMKV } = require('react-native-mmkv');
      return new MMKV();
    })();
