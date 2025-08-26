import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding2'>;

export default function Onboarding2({ navigation }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>建立你的基础安全感</Text>
      <Text style={styles.sub}>产品关键功能和价值点（占位）</Text>

      <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('Onboarding3')}>
        <Text style={styles.btnText}>下一步</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('MainTabs')}>
        <Text style={styles.skip}>跳过，直接进入</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.colors.bg, padding: theme.spacing(3), justifyContent: 'center' },
  title: { color: theme.colors.text, fontSize: 28, fontWeight: '700', marginBottom: theme.spacing(1) },
  sub: { color: theme.colors.subtext, fontSize: 16, marginBottom: theme.spacing(4) },
  primary: { backgroundColor: theme.colors.buttonBg, padding: theme.spacing(2), borderRadius: theme.radius.xl, alignItems: 'center' },
  btnText: { color: theme.colors.buttonText, fontSize: 16, fontWeight: '600' },
  skip: { color: theme.colors.subtext, textAlign: 'center', marginTop: theme.spacing(2) },
});
