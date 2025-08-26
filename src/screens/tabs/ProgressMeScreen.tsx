import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export default function ProgressMeScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>进展·我</Text>
      <Text style={styles.sub}>统计 / 勋章 / 个人资料（占位）</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.colors.bg, padding: 24, justifyContent: 'center' },
  title: { color: theme.colors.text, fontSize: 24, fontWeight: '700', marginBottom: 8 },
  sub: { color: theme.colors.subtext, fontSize: 14 },
});
