import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export default function NowScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>现在</Text>
      <Text style={styles.sub}>今日待办 / 呼吸练习 / 快速记录（占位）</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.colors.bg, padding: theme.spacing(3), justifyContent: 'center' },
  title: { color: theme.colors.text, fontSize: 24, fontWeight: '700', marginBottom: theme.spacing(1) },
  sub: { color: theme.colors.subtext, fontSize: 14 },
});
