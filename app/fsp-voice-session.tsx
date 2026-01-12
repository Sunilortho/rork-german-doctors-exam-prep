import { generateText } from '@rork-ai/toolkit-sdk';
import { Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { Mic, Volume2, Loader } from 'lucide-react-native';
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
  Animated,
} from 'react-native';

interface Message {
  id: string;
  role: 'patient' | 'arzt';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Pulsing animation for recording indicator
  useEffect(() => {
    if (recordingState === 'recording') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [recordingState, pulseAnim]);

  // Recording timer
  useEffect(() => {
    if (recordingState === 'recording') {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      setRecordingTime(0);
    }

    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [recordingState]);

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

        setIsSpeaking(true);

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
            setIsSpeaking(false);
          }
        });
      } catch (error) {
        console.error('TTS playback failed:', error);
        setIsSpeaking(false);
      }
    },
    [currentSound]
  );

  const startSession = useCallback(async () => {
    const initialMessage: Message = {
      id: Date.now().toString(),
      role: 'patient',
      text: 'Guten Tag, Herr Doktor. Wie kann ich dir heute helfen?',
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

IMPORTANT RULES:
- ALWAYS respond in German
- Stay in character as a patient
- Provide realistic medical symptoms
- Be cooperative but realistic
- ${difficulty === 'C1' ? 'Use medical terminology' : difficulty === 'B2' ? 'Use everyday language with occasional medical terms' : 'Use simple, everyday language'}
- Response length: ${personality === 'brief' ? '1-2 sentences' : personality === 'anxious' ? '2-3 sentences, showing nervousness' : '3-4 sentences, detailed'}

Conversation history:
${conversationHistory}

Doctor (Arzt): ${arztInput}

Respond naturally as the patient (auf Deutsch):`;

      // Add streaming message placeholder
      const streamingMessageId = Date.now().toString();
      const streamingMessage: Message = {
        id: streamingMessageId,
        role: 'patient',
        text: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, streamingMessage]);
      scrollViewRef.current?.scrollToEnd({ animated: true });

      const patientResponse = await generateText(systemPrompt);

      if (!patientResponse || patientResponse.trim().length === 0) {
        throw new Error('Empty response from AI');
      }

      // Update with final message
      const finalMessage: Message = {
        id: streamingMessageId,
        role: 'patient',
        text: patientResponse.trim(),
        timestamp: new Date(),
        isStreaming: false,
      };

      setMessages((prev) =>
        prev.map((m) => (m.id === streamingMessageId ? finalMessage : m))
      );

      await playPatientMessage(patientResponse.trim());
      setRecordingState('idle');
    } catch (error) {
      console.error('Failed to generate patient response:', error);

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

  const replayLastPatientMessage = async () => {
    if (isSpeaking) return; // Prevent multiple concurrent playbacks

    const lastPatientMessage = [...messages]
      .reverse()
      .find((m) => m.role === 'patient');

    if (lastPatientMessage) {
      await playPatientMessage(lastPatientMessage.text);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
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
                {message.role === 'patient' ? '👤 Patient' : '👨‍⚕️ You'}
              </Text>
              <Text style={styles.messageText}>{message.text}</Text>
              {message.isStreaming && (
                <View style={styles.streamingIndicator}>
                  <ActivityIndicator size="small" color="#3B82F6" />
                  <Text style={styles.streamingText}>Listening...</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {!permissionGranted && (
          <View style={styles.permissionWarning}>
            <Text style={styles.permissionWarningText}>
              🎤 Microphone permission required for voice recording
            </Text>
          </View>
        )}

        {recordingState !== 'idle' && (
          <View style={styles.stateIndicator}>
            {recordingState === 'recording' && (
              <>
                <Animated.View
                  style={[
                    styles.recordingPulse,
                    { transform: [{ scale: pulseScale }] },
                  ]}
                />
                <Text style={styles.stateText}>
                  Recording {formatTime(recordingTime)}
                </Text>
              </>
            )}
            {recordingState === 'processing' && (
              <>
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text style={styles.stateText}>Processing...</Text>
              </>
            )}
          </View>
        )}

        {isSpeaking && (
          <View style={styles.speakingIndicator}>
            <Loader size={16} color="#60A5FA" />
            <Text style={styles.speakingText}>Patient speaking...</Text>
          </View>
        )}

        <View style={styles.hint}>
          <Text style={styles.hintText}>
            🎤 Speak naturally in German, like in the real exam. Press and hold
            the microphone to record.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={[
            styles.replayButton,
            isSpeaking && styles.replayButtonActive,
          ]}
          onPress={replayLastPatientMessage}
          activeOpacity={0.7}
          disabled={isSpeaking}
        >
          <Volume2 size={24} color={isSpeaking ? '#999' : '#60A5FA'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.micButton,
            recordingState === 'recording' && styles.micButtonActive,
            !permissionGranted && styles.micButtonDisabled,
            recordingState === 'processing' && styles.micButtonProcessing,
          ]}
          onPress={handleMicrophonePress}
          activeOpacity={0.8}
          disabled={!permissionGranted || isSpeaking}
        >
          {recordingState === 'processing' ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <Mic
              size={32}
              color="#FFFFFF"
              strokeWidth={2.5}
            />
          )}
        </TouchableOpacity>

        <View style={styles.replayButtonPlaceholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 180,
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
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
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
  streamingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  streamingText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  permissionWarning: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    padding: 16,
  },
  permissionWarningText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  stateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 12,
  },
  recordingPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  stateText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#3B82F6',
  },
  speakingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  speakingText: {
    fontSize: 13,
    color: '#60A5FA',
    fontWeight: '500',
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
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  replayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  replayButtonActive: {
    opacity: 0.5,
  },
  replayButtonPlaceholder: {
    width: 56,
    height: 56,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  micButtonActive: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  micButtonProcessing: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
  },
  micButtonDisabled: {
    backgroundColor: '#475569',
    shadowOpacity: 0,
  },
});
