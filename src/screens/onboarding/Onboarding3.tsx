import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding3'>;

export default function Onboarding3({ navigation }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>准备就绪！</Text>
      <Text style={styles.sub}>进入主页，开始你的自我疗愈之旅。</Text>

      <TouchableOpacity style={styles.primary} onPress={() => navigation.replace('MainTabs')}>
        <Text style={styles.btnText}>进入主界面</Text>
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
});
