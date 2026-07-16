import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { apiClient } from '../utils/api';
import useAuthStore from '../store/useAuthStore';

interface UnitData {
  theory_bites: string[];
  vocabulary_list: { word: string; translation: string }[];
  interactive_quiz: {
    question: string;
    options: string[];
    correct_answer_index: number;
  }[];
}

const UnitScreen = () => {
  const { colors, mode } = useTheme();
  const navigation = useNavigation();
  const { language, level } = useAuthStore();
  
  const [unitData, setUnitData] = useState<UnitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await apiClient.get('/unit/next', {
          params: { language: language || 'Spanish', level: level || 'Beginner', topic: 'Basics' }
        });
        setUnitData(response.data.unit);
      } catch (error) {
        console.error('Failed to fetch unit data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Generating your personalized lesson...
        </Text>
      </View>
    );
  }

  if (!unitData) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Failed to load lesson.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Lesson 1: Basics</Text>
      
      {/* Theory Bites */}
      {unitData.theory_bites.map((bite, idx) => (
        <View key={idx} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.primary }]}>
          <Text style={[styles.content, { color: colors.text }]}>{bite}</Text>
        </View>
      ))}

      {/* Vocabulary List */}
      {unitData.vocabulary_list.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.subHeader, { color: colors.text }]}>Vocabulary</Text>
          {unitData.vocabulary_list.map((vocab, idx) => (
            <Text key={idx} style={{ color: colors.text, fontSize: 18, marginVertical: 5 }}>
              • {vocab.word} = {vocab.translation}
            </Text>
          ))}
        </View>
      )}

      {/* Quiz */}
      {unitData.interactive_quiz.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.subHeader, { color: colors.text }]}>Quiz Time!</Text>
          <Text style={{ color: colors.text, fontSize: 18, marginBottom: 15 }}>
            {unitData.interactive_quiz[0].question}
          </Text>
          {unitData.interactive_quiz[0].options.map((opt, idx) => (
            <TouchableOpacity key={idx} style={[styles.quizOption, { borderColor: colors.primary }]}>
              <Text style={{ color: colors.text }}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: completed ? '#4CAF50' : colors.primary }]}
        onPress={() => {
          setCompleted(true);
          // In a real flow, you'd post completion to backend here
          setTimeout(() => navigation.goBack(), 1000);
        }}
      >
        <Text style={styles.buttonText}>{completed ? 'Great Job!' : 'Complete'}</Text>
      </TouchableOpacity>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 20, fontSize: 16, fontWeight: '600' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', paddingTop: 20 },
  subHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  content: { fontSize: 18, lineHeight: 26 },
  quizOption: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});

export default UnitScreen;
