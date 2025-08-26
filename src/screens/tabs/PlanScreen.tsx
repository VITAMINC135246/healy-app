import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export default function PlanScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>计划</Text>
      <Text style={styles.sub}>每周计划 / 课程 / 练习（占位）</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.colors.bg, padding: 24, justifyContent: 'center' },
  title: { color: theme.colors.text, fontSize: 24, fontWeight: '700', marginBottom: 8 },
  sub: { color: theme.colors.subtext, fontSize: 14 },
});
