import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';

const LANGUAGES = [
  "Mandarin Chinese", "Spanish", "English", "Hindi", "Bengali", "Portuguese", "Russian", "Japanese", "Western Punjabi", "Marathi",
  "Telugu", "Wu Chinese", "Turkish", "Korean", "French", "German", "Vietnamese", "Tamil", "Yue Chinese", "Urdu",
  "Javanese", "Italian", "Egyptian Arabic", "Gujarati", "Iranian Persian", "Bhojpuri", "Min Nan Chinese", "Hakka Chinese", "Jin Chinese", "Hausa",
  "Kannada", "Indonesian", "Polish", "Yoruba", "Xiang Chinese", "Malayalam", "Odia", "Maithili", "Burmese", "Eastern Punjabi",
  "Sunda", "Sudanese Arabic", "Algerian Arabic", "Moroccan Arabic", "Ukrainian", "Igbo", "Northern Uzbek", "Sindhi", "North Levantine Arabic", "Romanian"
];

const OnboardingScreen = () => {
  const { colors, setMode } = useTheme();
  const navigation = useNavigation<any>();

  const handleSelection = (language: string) => {
    setMode('language');
    navigation.navigate('Diagnostic', { language });
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.primary }]} 
      onPress={() => handleSelection(item)}>
      <Text style={[styles.cardText, { color: colors.text }]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>What do you want to learn?</Text>
      
      <FlatList
        data={LANGUAGES}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardText: { fontSize: 18, fontWeight: '600' }
});

export default OnboardingScreen;
