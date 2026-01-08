import { generateText } from '@rork-ai/toolkit-sdk';
import { Send } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Message {
  id: string;
  role: 'patient' | 'arzt';
  text: string;
  timestamp: Date;
}

export default function FSPTextScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'patient',
      text: 'Guten Tag, Herr Doktor.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const arztMessage: Message = {
      id: Date.now().toString(),
      role: 'arzt',
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, arztMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages
        .map((m) => `${m.role === 'patient' ? 'Patient' : 'Arzt'}: ${m.text}`)
        .join('\n');

      const systemPrompt = `Sie sind ein Patient bei einer Fachsprachprüfung für ausländische Ärzte in Deutschland.

Wichtig:
- Antworten Sie IMMER auf Deutsch
- Bleiben Sie in Ihrer Rolle als Patient
- Geben Sie realistische medizinische Symptome an
- Seien Sie kooperativ aber realistisch
- Verwenden Sie alltägliche Sprache mit gelegentlichen Fachbegriffen

Bisheriger Gesprächsverlauf:
${conversationHistory}

Arzt: ${arztMessage.text}

Antworten Sie als Patient (auf Deutsch, 2-3 Sätze):`;

      const patientResponse = await generateText(systemPrompt);

      if (!patientResponse || patientResponse.trim().length === 0) {
        throw new Error('Empty response from AI');
      }

      const patientMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'patient',
        text: patientResponse.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, patientMessage]);
    } catch (error) {
      console.error('Failed to generate patient response:', error);
      
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'patient',
        text: 'Könnten Sie das bitte wiederholen?',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.messagesContainer}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageCard,
                message.role === 'arzt' && styles.messageCardArzt,
              ]}
            >
              <Text style={styles.messageRole}>
                {message.role === 'patient' ? 'Patient' : 'Arzt (Sie)'}
              </Text>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text style={styles.loadingText}>Patient antwortet...</Text>
            </View>
          )}
        </View>

        <View style={styles.hint}>
          <Text style={styles.hintText}>
            Führen Sie das Anamnesegespräch auf Deutsch durch.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ihre Nachricht auf Deutsch..."
          placeholderTextColor="#64748B"
          multiline
          maxLength={500}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          activeOpacity={0.7}
          disabled={!input.trim() || isLoading}
        >
          <Send size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 16,
    paddingTop: 16,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  messageCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    borderLeftWidth: 4,
    borderLeftColor: '#60A5FA',
  },
  messageCardArzt: {
    borderLeftColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  messageRole: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  hint: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  hintText: {
    fontSize: 13,
    color: '#93C5FD',
    textAlign: 'center',
    lineHeight: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#FFFFFF',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#475569',
  },
});
