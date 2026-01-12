import { generateText } from '@rork-ai/toolkit-sdk';
import { Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Message {
  id: string;
  role: 'patient' | 'arzt';
  text: string;
  timestamp: Date;
}

type RecordingState = 'idle' | 'recording' | 'processing';

export default function FSPVoiceSessionScreen() {
  const params = useLocalSearchParams();
  const personality = (params.personality as string) || 'brief';
  const difficulty = (params.difficulty as string) || 'B2';
  const examinerInterruptions = params.examinerInterruptions === '1';

  const [messages, setMessages] = useState<Message[]>([]);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, [currentSound]);

  const requestMicrophonePermission = async () => {
    try {
      if (Platform.OS === 'web') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        setPermissionGranted(true);
        return;
      }

      const { status } = await Audio.requestPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      } else {
        Alert.alert(
          'Microphone Permission Required',
          'Please enable microphone access in your device settings to use voice features.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Failed to request microphone permission:', error);
    }
  };

  const playPatientMessage = useCallback(
    async (text: string) => {
      try {
        if (currentSound) {
          await currentSound.unloadAsync();
        }

        const ttsUrl = `https://toolkit.rork.com/tts/generate/?text=${encodeURIComponent(text)}&voice=nova&language=de`;

        const { sound } = await Audio.Sound.createAsync(
          { uri: ttsUrl },
          { shouldPlay: true }
        );

        setCurrentSound(sound);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
            setCurrentSound(null);
          }
        });
      } catch (error) {
        console.error('TTS playback failed:', error);
      }
    },
    [currentSound]
  );

  const startSession = useCallback(async () => {
    const initialMessage: Message = {
      id: Date.now().toString(),
      role: 'patient',
      text: 'Guten Tag, Herr Doktor. Wie geht es dir heute?',
      timestamp: new Date(),
    };

    setMessages([initialMessage]);
    await playPatientMessage(initialMessage.text);
  }, [playPatientMessage]);

  useEffect(() => {
    requestMicrophonePermission();
    startSession();
  }, [startSession]);

  const handleMicrophonePress = async () => {
    if (recordingState === 'recording') {
      await stopRecording();
    } else if (recordingState === 'idle' && permissionGranted) {
      await startRecording();
    }
  };

  const startRecording = async () => {
    if (!permissionGranted) {
      Alert.alert(
        'Permission Required',
        'Microphone permission is required for voice recording.'
      );
      return;
    }

    try {
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync({
          android: {
            extension: '.m4a',
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: '.wav',
            outputFormat: Audio.IOSOutputFormat.LINEARPCM,
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {
            mimeType: 'audio/webm',
            bitsPerSecond: 128000,
          },
        });

        setRecording(newRecording);
        setRecordingState('recording');
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setRecordingState('processing');

      await recording.stopAndUnloadAsync();

      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
      }

      const uri = recording.getURI();

      if (uri) {
        await transcribeAndRespond(uri);
      }

      setRecording(null);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setRecordingState('idle');
      Alert.alert('Error', 'Failed to process recording. Please try again.');
    }
  };

  const transcribeAndRespond = async (audioUri: string) => {
    try {
      const formData = new FormData();

      if (Platform.OS === 'web') {
        const response = await fetch(audioUri);
        const blob = await response.blob();
        formData.append('audio', blob, 'recording.webm');
      } else {
        const uriParts = audioUri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        const audioFile = {
          uri: audioUri,
          name: `recording.${fileType}`,
          type: `audio/${fileType}`,
        } as any;
        formData.append('audio', audioFile);
      }

      formData.append('language', 'de');

      const sttResponse = await fetch('https://toolkit.rork.com/stt/transcribe/', {
        method: 'POST',
        body: formData,
      });

      if (!sttResponse.ok) {
        throw new Error('Transcription failed');
      }

      const { text: transcribedText } = await sttResponse.json();

      const arztMessage: Message = {
        id: Date.now().toString(),
        role: 'arzt',
        text: transcribedText || 'Ich höre Sie.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, arztMessage]);

      await generatePatientResponse(transcribedText || 'Ich höre Sie.');
    } catch (error) {
      console.error('Transcription error:', error);
      setRecordingState('idle');
      Alert.alert(
        'Processing Error',
        'Failed to process your response. Please try again.'
      );
    }
  };

  const generatePatientResponse = async (arztInput: string) => {
    try {
      const conversationHistory = messages
        .map((m) => `${m.role === 'patient' ? 'Patient' : 'Arzt'}: ${m.text}`)
        .join('\n');

      const systemPrompt = `Sie sind ein Patient bei einer Fachsprachprüfung für ausländische Ärzte in Deutschland.

Personality: ${personality === 'anxious' ? 'Sie sind nervös und unsicher' : personality === 'talkative' ? 'Sie geben ausführliche Antworten' : 'Sie geben kurze, direkte Antworten'}.
Difficulty Level: ${difficulty}
Language: Exclusively German

IMPORTANT:
- ALWAYS respond in German only
- Be natural and realistic
- ${difficulty === 'C1' ? 'Use medical terminology' : 'Use everyday language'}
- Response: 1-3 sentences

Conversation:
${conversationHistory}

Arzt: ${arztInput}

Patient response (German only):`;

      const patientResponse = await generateText(systemPrompt);

      if (!patientResponse || patientResponse.trim().length === 0) {
        throw new Error('Empty response');
      }

      const finalMessage: Message = {
        id: Date.now().toString(),
        role: 'patient',
        text: patientResponse.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, finalMessage]);

      await playPatientMessage(patientResponse.trim());
      setRecordingState('idle');
    } catch (error) {
      console.error('Failed to generate response:', error);

      const fallbackMessage: Message = {
        id: Date.now().toString(),
        role: 'patient',
        text: 'Könnten Sie das bitte wiederholen?',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
      await playPatientMessage(fallbackMessage.text);
      setRecordingState('idle');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        <Text style={styles.title}>🎤 FSP Voice Practice</Text>

        <View style={styles.messagesContainer}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.role === 'arzt' && styles.messageBubbleArzt,
              ]}
            >
              <Text style={styles.roleLabel}>
                {message.role === 'patient' ? 'Patient' : 'You (Arzt)'}
              </Text>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </View>

        {recordingState === 'processing' && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.micButton,
            recordingState === 'recording' && styles.micButtonActive,
          ]}
          onPress={handleMicrophonePress}
          disabled={!permissionGranted}
        >
          <Text style={styles.micButtonText}>
            {recordingState === 'recording' ? '⏹️ Stop' : '🎤 Record'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1F2937',
  },
  messagesContainer: {
    gap: 12,
  },
  messageBubble: {
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  messageBubbleArzt: {
    backgroundColor: '#DBEAFE',
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 20,
  },
  processingContainer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  processingText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  micButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  micButtonActive: {
    backgroundColor: '#EF4444',
  },
  micButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
