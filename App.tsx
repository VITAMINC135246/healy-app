import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { useAppStore } from './src/stores/appStore';

export default function App() {
  const resetDailyIfNeeded = useAppStore(s => s.resetDailyIfNeeded);

  useEffect(() => {
    resetDailyIfNeeded();
  }, [resetDailyIfNeeded]);

  return <RootNavigator />;
}
