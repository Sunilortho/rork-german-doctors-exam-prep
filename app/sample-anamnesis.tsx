import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SampleAnamnesisScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sample Anamnesis Dialogue</Text>
          <Text style={styles.headerSubtitle}>
            Example patient history conversation for FSP practice
          </Text>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Anamnesegespräch</Text>
          
          <View style={styles.dialogueContainer}>
            <View style={styles.arztMessage}>
              <Text style={styles.speaker}>Arzt:</Text>
              <Text style={styles.messageText}>
                Guten Tag. Bitte nehmen Sie Platz. Was führt Sie heute zu mir?
              </Text>
            </View>

            <View style={styles.patientMessage}>
              <Text style={styles.speaker}>Patient:</Text>
              <Text style={styles.messageText}>
                Guten Tag, Herr Doktor. Ich habe seit drei Tagen starke Kopfschmerzen.
              </Text>
            </View>

            <View style={styles.arztMessage}>
              <Text style={styles.speaker}>Arzt:</Text>
              <Text style={styles.messageText}>
                Können Sie die Kopfschmerzen näher beschreiben? Wo genau tut es weh?
              </Text>
            </View>

            <View style={styles.patientMessage}>
              <Text style={styles.speaker}>Patient:</Text>
              <Text style={styles.messageText}>
                Die Schmerzen sind hauptsächlich hier an der Stirn und an den Schläfen.
                Es fühlt sich drückend an.
              </Text>
            </View>

            <View style={styles.arztMessage}>
              <Text style={styles.speaker}>Arzt:</Text>
              <Text style={styles.messageText}>
                Und wie stark sind die Schmerzen auf einer Skala von eins bis zehn?
              </Text>
            </View>

            <View style={styles.patientMessage}>
              <Text style={styles.speaker}>Patient:</Text>
              <Text style={styles.messageText}>
                Ich würde sagen, etwa sechs oder sieben.
              </Text>
            </View>

            <View style={styles.arztMessage}>
              <Text style={styles.speaker}>Arzt:</Text>
              <Text style={styles.messageText}>
                Haben Sie auch andere Beschwerden? Übelkeit, Erbrechen, Sehstörungen?
              </Text>
            </View>

            <View style={styles.patientMessage}>
              <Text style={styles.speaker}>Patient:</Text>
              <Text style={styles.messageText}>
                Ja, mir ist manchmal übel, besonders am Morgen. Erbrochen habe ich aber
                nicht. Mit den Augen ist alles normal.
              </Text>
            </View>

            <View style={styles.arztMessage}>
              <Text style={styles.speaker}>Arzt:</Text>
              <Text style={styles.messageText}>
                Hatten Sie in der letzten Zeit besonders viel Stress oder haben Sie Ihre
                Gewohnheiten geändert?
              </Text>
            </View>

            <View style={styles.patientMessage}>
              <Text style={styles.speaker}>Patient:</Text>
              <Text style={styles.messageText}>
                Ja, auf der Arbeit ist es momentan sehr stressig. Ich schlafe auch nicht
                so gut wie sonst.
              </Text>
            </View>

            <View style={styles.arztMessage}>
              <Text style={styles.speaker}>Arzt:</Text>
              <Text style={styles.messageText}>
                Nehmen Sie regelmäßig Medikamente ein?
              </Text>
            </View>

            <View style={styles.patientMessage}>
              <Text style={styles.speaker}>Patient:</Text>
              <Text style={styles.messageText}>
                Nein, normalerweise nicht. Ich habe in den letzten Tagen Ibuprofen
                genommen, aber es hat nicht viel geholfen.
              </Text>
            </View>

            <View style={styles.arztMessage}>
              <Text style={styles.speaker}>Arzt:</Text>
              <Text style={styles.messageText}>
                Gut. Ich werde Sie jetzt kurz untersuchen. Bitte schauen Sie geradeaus.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Wichtige Anamnesefragen</Text>
          <Text style={styles.infoText}>
            • Lokalisation und Charakter der Beschwerden{'\n'}
            • Intensität (Schmerzskala 1-10){'\n'}
            • Zeitlicher Verlauf (seit wann, Dauer){'\n'}
            • Begleitende Symptome{'\n'}
            • Auslösende Faktoren{'\n'}
            • Vorerkrankungen und Medikamente{'\n'}
            • Soziale und berufliche Situation
          </Text>
        </View>
      </ScrollView>
    </View>
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
  contentCard: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#60A5FA',
    marginBottom: 20,
  },
  dialogueContainer: {
    gap: 16,
  },
  arztMessage: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  patientMessage: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#60A5FA',
  },
  speaker: {
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
  infoCard: {
    marginHorizontal: 24,
    marginTop: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#60A5FA',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#93C5FD',
    lineHeight: 20,
  },
});
