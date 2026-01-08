import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SampleArztbriefScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sample Arztbrief</Text>
          <Text style={styles.headerSubtitle}>
            Professional medical letter example for FSP preparation
          </Text>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Arztbrief</Text>
          
          <Text style={styles.contentText}>
            <Text style={styles.bold}>Anamnese:{'\n'}</Text>
            Der 58-jährige Patient stellte sich in unserer Notaufnahme mit akuten
            thorakalen Schmerzen vor, die seit circa 2 Stunden bestehen. Die
            Schmerzen werden als drückend und retrosternal lokalisiert beschrieben,
            mit Ausstrahlung in den linken Arm. Der Patient berichtet über
            Dyspnoe und Diaphorese. In der Eigenanamnese sind eine arterielle
            Hypertonie und Hyperlipidämie bekannt. Nikotinabusus von 40
            pack-years.
          </Text>

          <Text style={styles.contentText}>
            <Text style={styles.bold}>Befund:{'\n'}</Text>
            Bei Aufnahme: RR 160/95 mmHg, HF 98/min, SpO₂ 94% an Raumluft. Patient
            wirkt ängstlich und diaphoretisch. Herz: rhythmisch, keine Herzgeräusche.
            Lunge: vesikuläres Atemgeräusch beidseits, keine Rasselgeräusche.
            EKG: ST-Streckenhebungen in den Ableitungen V1-V4. Labor: Troponin T
            erhöht (0,8 ng/ml), CK-MB erhöht.
          </Text>

          <Text style={styles.contentText}>
            <Text style={styles.bold}>Diagnose:{'\n'}</Text>
            ST-Hebungsinfarkt (STEMI), anterior, bei koronarer Herzkrankheit
            (KHK).
          </Text>

          <Text style={styles.contentText}>
            <Text style={styles.bold}>Therapie:{'\n'}</Text>
            Notfall-Herzkatheteruntersuchung mit Implantation eines
            Drug-eluting-Stents im LAD. Duale Thrombozytenaggregationshemmung
            (ASS 100mg + Ticagrelor 90mg). Statin-Therapie intensiviert.
            ACE-Hemmer und Betablocker begonnen.
          </Text>

          <Text style={styles.contentText}>
            <Text style={styles.bold}>Empfehlung:{'\n'}</Text>
            Kardiale Rehabilitation empfohlen. Nikotinkarenz dringend angeraten.
            Ambulante kardiologische Kontrolle in 4 Wochen. Bei erneuten
            thorakalen Beschwerden sofortige Wiedervorstellung.
          </Text>

          <View style={styles.watermark}>
            <Text style={styles.watermarkText}>
              Generated via Roadmap to Germany
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Hinweise zur Struktur</Text>
          <Text style={styles.infoText}>
            Ein professioneller Arztbrief folgt immer der klaren Struktur:
            Anamnese, Befund, Diagnose, Therapie, und Empfehlung. Verwenden Sie
            präzise medizinische Terminologie und vermeiden Sie umgangssprachliche
            Ausdrücke.
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
  contentText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 20,
  },
  bold: {
    fontWeight: '700' as const,
    color: '#60A5FA',
  },
  watermark: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  watermarkText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
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
