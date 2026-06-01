import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';

export default function ClienteHomeScreen({ usuario, navigation }) {
  const [chamadosAbertos, setChamadosAbertos] = useState(0);
  const [faturasVencidas, setFaturasVencidas] = useState(0);
  const [ultimosChamados, setUltimosChamados] = useState([]);

  useEffect(() => {
    const unsubChamados = onSnapshot(
      query(collection(db, 'chamados'), where('usuarioId', '==', usuario.uid)),
      snap => {
        const todos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setChamadosAbertos(todos.filter(c => c.status === 'Aberto').length);
        setUltimosChamados(todos.slice(0, 3));
      }
    );

    const unsubFaturas = onSnapshot(
      query(collection(db, 'faturas'),
        where('usuarioId', '==', usuario.uid),
        where('status', '==', 'Vencido')),
      snap => setFaturasVencidas(snap.size)
    );

    return () => { unsubChamados(); unsubFaturas(); };
  }, []);

  async function sair() {
    await signOut(auth);
  }

  const badgeColor = (status) => {
    if (status === 'Aberto') return '#E74C3C';
    if (status === 'Em andamento') return '#F39C12';
    return '#1D9E75';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.bemVindo}>Olá! 👋</Text>
          <Text style={styles.email}>{usuario?.email}</Text>
        </View>
        <TouchableOpacity onPress={sair} style={styles.botaoSair}>
          <Text style={styles.botaoSairTexto}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.secao}>Minha Situação</Text>
      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: '#1D9E75' }]}>
          <Text style={styles.cardNumero}>{chamadosAbertos}</Text>
          <Text style={styles.cardLabel}>Chamados Abertos</Text>
        </View>
        <View style={[styles.card, { backgroundColor: faturasVencidas > 0 ? '#E74C3C' : '#1A5276' }]}>
          <Text style={styles.cardNumero}>{faturasVencidas}</Text>
          <Text style={styles.cardLabel}>Faturas Vencidas</Text>
        </View>
      </View>

      <Text style={styles.secao}>Meus Últimos Chamados</Text>
      {ultimosChamados.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTexto}>Nenhum chamado ainda</Text>
        </View>
      ) : (
        ultimosChamados.map(c => (
          <View key={c.id} style={styles.itemCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemNome}>{c.titulo}</Text>
              <Text style={styles.itemSub}>{c.tipo}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: badgeColor(c.status) }]}>
              <Text style={styles.badgeTexto}>{c.status}</Text>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.librasBtn} onPress={() => navigation.navigate('Libras')}>
        <Text style={styles.librasBtnTexto}>🤟 Ajuda em Libras</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    backgroundColor: '#1A5276', padding: 24, paddingTop: 52,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  bemVindo: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  email: { fontSize: 12, color: '#AED6F1', marginTop: 2 },
  botaoSair: { backgroundColor: '#E74C3C', borderRadius: 8, padding: 8 },
  botaoSairTexto: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  secao: { fontSize: 16, fontWeight: 'bold', color: '#1A5276', margin: 16, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  card: { width: '46%', margin: '2%', borderRadius: 12, padding: 16, alignItems: 'center' },
  cardNumero: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  cardLabel: { fontSize: 11, color: '#fff', marginTop: 4, textAlign: 'center' },
  emptyBox: {
    marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 12,
    padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0'
  },
  emptyTexto: { color: '#999', fontSize: 14 },
  itemCard: {
    marginHorizontal: 16, marginBottom: 8, backgroundColor: '#fff', borderRadius: 12,
    padding: 14, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#e0e0e0'
  },
  itemNome: { fontSize: 14, fontWeight: 'bold', color: '#1C2833' },
  itemSub: { fontSize: 12, color: '#888', marginTop: 2 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  badgeTexto: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  librasBtn: {
    margin: 16, backgroundColor: '#1D9E75', borderRadius: 12,
    padding: 16, alignItems: 'center', marginBottom: 40
  },
  librasBtnTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});