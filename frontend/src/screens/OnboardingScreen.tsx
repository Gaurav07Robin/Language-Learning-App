import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import useAuthStore from '../store/useAuthStore';
import { useTheme } from '../theme/ThemeContext';
import { apiClient } from '../utils/api';

const OnboardingScreen = () => {
  const { login } = useAuthStore();
  const { colors, setMode } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleSelection = async (mode: 'language' | 'coding', track: string) => {
    setMode(mode);
    setLoading(true);
    
    try {
      const response = await apiClient.post('/onboarding', { track });
      // The backend handles the diagnostic and sets initial level
      login(response.data.level || 'Beginner');
    } catch (error) {
      console.error('Onboarding failed', error);
      // Fallback if backend is down during testing
      login('Beginner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>What do you want to learn?</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <>
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.card, borderColor: '#FF7F50' }]} 
            onPress={() => handleSelection('language', 'spanish')}>
            <Text style={[styles.cardText, { color: colors.text }]}>🇪🇸 Spanish</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.card, borderColor: '#39FF14' }]} 
            onPress={() => handleSelection('coding', 'golang')}>
            <Text style={[styles.cardText, { color: colors.text }]}>💻 Go (Golang)</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40 },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: { fontSize: 18, fontWeight: '600' }
});

export default OnboardingScreen;
