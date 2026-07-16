import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import useAuthStore from '../store/useAuthStore';
import { useTheme } from '../theme/ThemeContext';
import BentoCard from '../components/BentoCard';
import AnimatedProgress from '../components/AnimatedProgress';
import { Ionicons } from '@expo/vector-icons';

const DashboardScreen = () => {
  const { logout } = useAuthStore();
  const { colors, mode, setMode } = useTheme();
  const navigation = useNavigation<any>();

  const isBrutal = mode === 'coding';

  const toggleTheme = () => {
    setMode(isBrutal ? 'language' : 'coding');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text, fontFamily: isBrutal ? 'monospace' : undefined }]}>
            Welcome back,
          </Text>
          <Text style={[styles.title, { color: colors.primary, fontFamily: isBrutal ? 'monospace' : undefined }]}>
            Explorer
          </Text>
        </View>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Ionicons name={isBrutal ? 'code-slash' : 'earth'} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.progressSection}>
        <Text style={[styles.progressText, { color: colors.text, fontFamily: isBrutal ? 'monospace' : undefined }]}>
          Daily Goal: 3/5 Lessons
        </Text>
        <AnimatedProgress progress={0.6} />
      </Animated.View>

      <View style={styles.grid}>
        {/* Full width feature card */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.fullRow}>
          <BentoCard 
            size="large"
            title="Continue Learning"
            subtitle="Unit 1: Basics"
            iconName="play-circle"
            onPress={() => navigation.navigate('Unit')}
          />
        </Animated.View>

        {/* Half width cards row */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.halfRow}>
          <BentoCard 
            size="small"
            title="7 Day"
            subtitle="Streak!"
            iconName="flame"
            colorOverride={isBrutal ? '#FF0055' : '#FFE4E1'}
          />
          <BentoCard 
            size="small"
            title="Top 10"
            subtitle="Leaderboard"
            iconName="trophy"
            colorOverride={isBrutal ? '#FFD700' : '#FFFACD'}
          />
        </Animated.View>

        {/* Another full width */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.fullRow}>
          <BentoCard 
            size="large"
            title="Pronunciation Practice"
            subtitle="Unlock at Level 5"
            iconName="mic"
            style={{ opacity: 0.6 }}
          />
        </Animated.View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={{ color: '#FF0000', fontWeight: 'bold' }}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    marginBottom: 30,
  },
  themeToggle: {
    padding: 10,
  },
  greeting: { fontSize: 18, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '900', marginTop: 4 },
  progressSection: {
    paddingHorizontal: 28,
    marginBottom: 30,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  grid: {
    paddingHorizontal: 12,
  },
  fullRow: {
    width: '100%',
  },
  halfRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  logoutBtn: { 
    padding: 20, 
    alignItems: 'center',
    marginTop: 40,
  }
});

export default DashboardScreen;
