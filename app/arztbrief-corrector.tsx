import { generateText } from '@rork-ai/toolkit-sdk';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ArztbriefCorrectorScreen() {
  const [inputText, setInputText] = useState<string>('');
  const [correctedText, setCorrectedText] = useState<string>('');
  const [feedback, setFeedback] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleCorrect = async () => {
    if (!inputText.trim()) {
      Alert.alert('Eingabe erforderlich', 'Bitte fügen Sie einen Arztbrief ein.');
      return;
    }

    setIsProcessing(true);
    setCorrectedText('');
    setFeedback([]);

    try {
      const systemPrompt = `Sie sind ein Experte für deutsche medizinische Fachsprache und korrigieren Arztbriefe für die Fachsprachprüfung.

Aufgabe:
1. Korrigieren Sie Grammatik, Rechtschreibung und medizinisches Deutsch
2. Strukturieren Sie den Brief nach FSP-Standards:
   - Anamnese
   - Befund
   - Diagnose
   - Therapie
   - Empfehlung

3. Erfinden Sie KEINE medizinischen Daten
4. Behalten Sie alle vorhandenen medizinischen Informationen bei

Eingabe Arztbrief:
${inputText}

Erstellen Sie:
1. Den korrigierten Arztbrief
2. Eine Liste von Verbesserungsvorschlägen als Prüfer-Feedback

Format:
[KORRIGIERT]
<korrigierter Brief hier>

[FEEDBACK]
• <Punkt 1>
• <Punkt 2>
• <Punkt 3>

Generated via Roadmap to Germany`;

      const response = await generateText(systemPrompt);

      if (!response) {
        throw new Error('No response from AI');
      }

      const correctedSection = response.match(/\[KORRIGIERT\]([\s\S]*?)\[FEEDBACK\]/);
      const feedbackSection = response.match(/\[FEEDBACK\]([\s\S]*)/);

      if (correctedSection && correctedSection[1]) {
        setCorrectedText(correctedSection[1].trim());
      } else {
        setCorrectedText(response);
      }

      if (feedbackSection && feedbackSection[1]) {
        const feedbackItems = feedbackSection[1]
          .split('•')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
        setFeedback(feedbackItems);
      } else {
        setFeedback(['Der Arztbrief wurde korrigiert.']);
      }
    } catch (error) {
      console.error('Correction error:', error);
      Alert.alert(
        'Fehler',
        'Die Korrektur ist fehlgeschlagen. Bitte versuchen Sie es erneut.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setCorrectedText('');
    setFeedback([]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Arztbrief Auto-Korrektur</Text>
          <Text style={styles.headerSubtitle}>
            Fügen Sie Ihren Arztbrief ein und erhalten Sie professionelle
            Korrekturen
          </Text>
        </View>

        {!correctedText ? (
          <View style={styles.inputSection}>
            <Text style={styles.sectionLabel}>Ihr Arztbrief</Text>
            <TextInput
              style={styles.textArea}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Fügen Sie hier Ihren Arztbrief ein..."
              placeholderTextColor="#64748B"
              multiline
              textAlignVertical="top"
              editable={!isProcessing}
            />

            <TouchableOpacity
              style={[styles.correctButton, isProcessing && styles.correctButtonDisabled]}
              onPress={handleCorrect}
              activeOpacity={0.8}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.correctButtonText}>Wird geprüft...</Text>
                </>
              ) : (
                <Text style={styles.correctButtonText}>Auto-Korrigieren</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultsSection}>
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Korrigierter Arztbrief</Text>
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultText}>{correctedText}</Text>
              </View>
            </View>

            {feedback.length > 0 && (
              <View style={styles.feedbackCard}>
                <Text style={styles.resultLabel}>Prüfer-Feedback</Text>
                <View style={styles.feedbackList}>
                  {feedback.map((item, index) => (
                    <View key={index} style={styles.feedbackItem}>
                      <Text style={styles.feedbackBullet}>•</Text>
                      <Text style={styles.feedbackText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <Text style={styles.resetButtonText}>Neuen Brief korrigieren</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  inputSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#FFFFFF',
    minHeight: 300,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  correctButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  correctButtonDisabled: {
    backgroundColor: '#475569',
  },
  correctButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  resultsSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 20,
  },
  resultCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#60A5FA',
    marginBottom: 12,
  },
  resultTextContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 16,
  },
  resultText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  feedbackCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  feedbackList: {
    gap: 12,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  feedbackBullet: {
    fontSize: 16,
    color: '#60A5FA',
    marginRight: 8,
    marginTop: 2,
  },
  feedbackText: {
    flex: 1,
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
