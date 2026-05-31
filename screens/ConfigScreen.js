import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Switch, ScrollView, Alert
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function ConfigScreen() {
  const [altoContraste, setAltoContraste] = useState(false);
  const [vibracoa, setVibracao] = useState(true);
  const [notificacoes, setNotificacoes] = useState(true);
  const [tamanhoFonte, setTamanhoFonte] = useState('M');

  async function sair() {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar' },
      { text: 'Sair', style: 'destructive', onPress: () => signOut(auth) }
    ]);
  }

  return (
    <ScrollView style={[styles.container, altoContraste && styles.containerContraste]}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Configurações</Text>
      </View>

      {/* Acessibilidade */}
      <Text style={styles.secao}>♿ Acessibilidade</Text>
      <View style={styles.card}>
        <View style={styles.item}>
          <Text style={styles.itemTexto}>Alto Contraste</Text>
          <Switch value={altoContraste} onValueChange={setAltoContraste}
            trackColor={{ true: '#1D9E75' }} />
        </View>
        <View style={styles.divisor} />
        <View style={styles.item}>
          <Text style={styles.itemTexto}>Vibração para alertas</Text>
          <Switch value={vibracoa} onValueChange={setVibracao}
            trackColor={{ true: '#1D9E75' }} />
        </View>
      </View>

      {/* Tamanho da fonte */}
      <Text style={styles.secao}>🔤 Tamanho da Fonte</Text>
      <View style={styles.card}>
        <View style={styles.fonteRow}>
          {['P', 'M', 'G', 'XG'].map(t => (
            <TouchableOpacity key={t}
              style={[styles.fonteBtn, tamanhoFonte === t && styles.fonteBtnAtivo]}
              onPress={() => setTamanhoFonte(t)}>
              <Text style={[styles.fonteBtnTexto, tamanhoFonte === t && styles.fonteBtnTextoAtivo]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Libras */}
      <Text style={styles.secao}>🤟 Acessibilidade em Libras</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.item}
          onPress={() => Alert.alert('Libras', 'Central de Libras em breve!')}>
          <Text style={styles.itemTexto}>Central de Vídeos em Libras</Text>
          <Text style={styles.seta}>›</Text>
        </TouchableOpacity>
        <View style={styles.divisor} />
        <TouchableOpacity style={styles.item}
          onPress={() => Alert.alert('Intérprete', 'Videochamada com intérprete em breve!')}>
          <Text style={styles.itemTexto}>Videochamada com Intérprete</Text>
          <Text style={styles.seta}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Notificações */}
      <Text style={styles.secao}>🔔 Notificações</Text>
      <View style={styles.card}>
        <View style={styles.item}>
          <Text style={styles.itemTexto}>Receber notificações</Text>
          <Switch value={notificacoes} onValueChange={setNotificacoes}
            trackColor={{ true: '#1D9E75' }} />
        </View>
      </View>

      {/* Sair */}
      <TouchableOpacity style={styles.botaoSair} onPress={sair}>
        <Text style={styles.botaoSairTexto}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  containerContraste: { backgroundColor: '#000' },
  header: { backgroundColor: '#1A5276', padding: 20, paddingTop: 52 },
  headerTitulo: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  secao: { fontSize: 13, fontWeight: 'bold', color: '#888', margin: 16, marginBottom: 8, textTransform: 'uppercase' },
  card: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  itemTexto: { fontSize: 15, color: '#1C2833' },
  seta: { fontSize: 20, color: '#888' },
  divisor: { height: 1, backgroundColor: '#e0e0e0', marginHorizontal: 16 },
  fonteRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
  fonteBtn: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  fonteBtnAtivo: { backgroundColor: '#1A5276', borderColor: '#1A5276' },
  fonteBtnTexto: { fontSize: 14, color: '#888', fontWeight: 'bold' },
  fonteBtnTextoAtivo: { color: '#fff' },
  botaoSair: { backgroundColor: '#E74C3C', borderRadius: 12, margin: 16, padding: 16, alignItems: 'center', marginBottom: 40 },
  botaoSairTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});