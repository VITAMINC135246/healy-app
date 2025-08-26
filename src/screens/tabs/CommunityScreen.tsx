import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export default function CommunityScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>社区</Text>
      <Text style={styles.sub}>内容流 / 打卡 / 互动（占位）</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.colors.bg, padding: 24, justifyContent: 'center' },
  title: { color: theme.colors.text, fontSize: 24, fontWeight: '700', marginBottom: 8 },
  sub: { color: theme.colors.subtext, fontSize: 14 },
});
