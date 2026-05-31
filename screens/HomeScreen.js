import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';

export default function HomeScreen({ usuario }) {
  const [totalClientes, setTotalClientes] = useState(0);
  const [inadimplentes, setInadimplentes] = useState(0);
  const [chamadosAbertos, setChamadosAbertos] = useState(0);
  const [ultimosChamados, setUltimosChamados] = useState([]);
  const [ultimosClientes, setUltimosClientes] = useState([]);

  useEffect(() => {
    // Total clientes ativos
    const unsubClientes = onSnapshot(
      query(collection(db, 'clientes'), where('status', '==', 'ativo')),
      snap => {
        setTotalClientes(snap.size);
        setUltimosClientes(snap.docs.slice(0, 3).map(d => ({ id: d.id, ...d.data() })));
      }
    );

    // Inadimplentes
    const unsubInadim = onSnapshot(
      query(collection(db, 'clientes'), where('status', '==', 'inadimplente')),
      snap => setInadimplentes(snap.size)
    );

    // Chamados abertos
    const unsubChamados = onSnapshot(
      query(collection(db, 'chamados'), where('status', '==', 'Aberto')),
      snap => {
        setChamadosAbertos(snap.size);
        setUltimosChamados(snap.docs.slice(0, 3).map(d => ({ id: d.id, ...d.data() })));
      }
    );

    return () => {
      unsubClientes();
      unsubInadim();
      unsubChamados();
    };
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

      <Text style={styles.secao}>Visão Geral</Text>
      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: '#1A5276' }]}>
          <Text style={styles.cardNumero}>{totalClientes}</Text>
          <Text style={styles.cardLabel}>Clientes Ativos</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#E74C3C' }]}>
          <Text style={styles.cardNumero}>{inadimplentes}</Text>
          <Text style={styles.cardLabel}>Inadimplentes</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#1D9E75' }]}>
          <Text style={styles.cardNumero}>{chamadosAbertos}</Text>
          <Text style={styles.cardLabel}>Chamados Abertos</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#2E86C1' }]}>
          <Text style={styles.cardNumero}>R$ 0</Text>
          <Text style={styles.cardLabel}>Rec. do Mês</Text>
        </View>
      </View>

      <Text style={styles.secao}>Últimos Chamados</Text>
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

      <Text style={styles.secao}>Últimos Clientes</Text>
      {ultimosClientes.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTexto}>Nenhum cliente cadastrado</Text>
        </View>
      ) : (
        ultimosClientes.map(c => (
          <View key={c.id} style={styles.itemCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemNome}>{c.nome}</Text>
              <Text style={styles.itemSub}>{c.email}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#1D9E75' }]}>
              <Text style={styles.badgeTexto}>{c.status}</Text>
            </View>
          </View>
        ))
      )}
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
});