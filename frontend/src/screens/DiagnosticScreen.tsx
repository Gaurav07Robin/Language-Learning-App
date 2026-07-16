import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import useAuthStore from '../store/useAuthStore';
import { useTheme } from '../theme/ThemeContext';
import { apiClient } from '../utils/api';

interface Question {
  question: string;
  options: string[];
  correct_answer_index: number;
  difficulty: string;
}

const DiagnosticScreen = () => {
  const route = useRoute<any>();
  const { language } = route.params;
  const { login } = useAuthStore();
  const { colors } = useTheme();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await apiClient.get('/diagnostic', {
          params: { language }
        });
        setQuestions(response.data.quiz.questions);
      } catch (error) {
        console.error('Failed to fetch diagnostic quiz', error);
        // Fallback gracefully if API fails
        login('Beginner', language);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [language]);

  const handleAnswer = (selectedIndex: number) => {
    const isCorrect = selectedIndex === questions[currentIndex].correct_answer_index;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Evaluate Tier
      let evaluatedTier = 'Beginner';
      if (newScore === 3) evaluatedTier = 'Advanced';
      else if (newScore === 2) evaluatedTier = 'Intermediate';

      login(evaluatedTier, language);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Generating placement test for {language}...
        </Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return null; // Fallback handled in catch
  }

  const currentQ = questions[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Placement Test</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Question {currentIndex + 1} of {questions.length} ({currentQ.difficulty})
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.questionText, { color: colors.text }]}>{currentQ.question}</Text>
      </View>

      {currentQ.options.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.optionButton, { borderColor: colors.primary, backgroundColor: colors.card }]}
          onPress={() => handleAnswer(idx)}
        >
          <Text style={[styles.optionText, { color: colors.text }]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 20, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 30, opacity: 0.8 },
  card: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  questionText: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  optionButton: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
  },
  optionText: { fontSize: 18, fontWeight: '500' },
});

export default DiagnosticScreen;
