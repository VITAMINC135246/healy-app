// src/screens/tabs/NowScreen.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import useAppStore from '../../stores/appStore';
const personaExplain = require('../../content/strings/persona_explain.json') as any;

function PersonaHeaderCard() {
  const persona = useAppStore(s => s.persona);
  const key = personaExplain[persona || 'Mixed'] ? (persona || 'Mixed') : 'Mixed';
  const box = personaExplain[key];

  return (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      marginBottom: 12
    }}>
      <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>
        当前原型：{persona ?? '未设置'}
      </Text>
      <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
        （用于推荐练习，不是诊断；会随你的状态更新）
      </Text>

      <View style={{ height: 8 }} />
      <Text style={{ fontSize: 13, fontWeight: '600', color: '#111827' }}>
        {box?.title ?? '混合 · 过渡期'}
      </Text>
      {(box?.bullets ?? []).slice(0, 3).map((t: string, i: number) => (
        <Text key={i} style={{ fontSize: 12, color: '#374151', marginTop: 4 }}>
          • {t}
        </Text>
      ))}
      {!persona && (
        <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 8 }}>
          提示：还没有画像。完成 Onboarding（或在 Onboarding3 用 Demo 按钮）生成画像。
        </Text>
      )}
    </View>
  );
}

export default function NowScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <PersonaHeaderCard />
      {/* TODO: 这里后续放 舒缓指针 / 证据墙 / 今日三件事 / 快速场景 */}
      <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' }}>
        <Text style={{ fontWeight: '600' }}>占位卡片</Text>
        <Text style={{ color: '#6b7280', marginTop: 6 }}>这里会是你的 Home 内容。</Text>
      </View>
    </ScrollView>
  );
}
