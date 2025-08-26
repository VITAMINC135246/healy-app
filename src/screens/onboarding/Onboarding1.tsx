import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding1'>;

export default function Onboarding1({ navigation }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>疗愈旅程，从这里开始</Text>
      <Text style={styles.sub}>简要卖点/愿景文案占位</Text>

      <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('Onboarding2')}>
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