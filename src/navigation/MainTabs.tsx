import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import NowScreen from '../screens/tabs/NowScreen';
import CommunityScreen from '../screens/tabs/CommunityScreen';
import PlanScreen from '../screens/tabs/PlanScreen';
import ProgressMeScreen from '../screens/tabs/ProgressMeScreen';
import { theme } from '../theme';

export type TabParamList = {
  Now: undefined;
  Community: undefined;
  Plan: undefined;
  ProgressMe: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.colors.card, borderTopWidth: 0, height: 64 },
        tabBarActiveTintColor: theme.colors.tabActive,
        tabBarInactiveTintColor: theme.colors.tabInactive,
        tabBarIcon: ({ focused, color, size }) => {
          const map: Record<string, [string, string]> = {
            Now: ['flash', 'flash-outline'],
            Community: ['people', 'people-outline'],
            Plan: ['calendar', 'calendar-outline'],
            ProgressMe: ['stats-chart', 'stats-chart-outline'],
          };
          const [f, d] = map[route.name] || ['ellipse', 'ellipse-outline'];
          return <Ionicons name={(focused ? f : d) as any} size={size} color={color} />;
        },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 6 },
      })}
    >
      <Tab.Screen name="Now" component={NowScreen} options={{ title: '现在' }} />
      <Tab.Screen name="Community" component={CommunityScreen} options={{ title: '社区' }} />
      <Tab.Screen name="Plan" component={PlanScreen} options={{ title: '计划' }} />
      <Tab.Screen name="ProgressMe" component={ProgressMeScreen} options={{ title: '进展·我' }} />
    </Tab.Navigator>
  );
}