import { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, Alert, ScrollView
} from 'react-native';
import { collection, addDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ClienteChamadosScreen({ usuario }) {
  const [chamados, setChamados] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('Queda de sinal');
  const [salvando, setSalvando] = useState(false);
  const [aba, setAba] = useState('Aberto');

  const tipos = ['Queda de sinal', 'Lentidão', 'Equipamento', 'Configuração', 'Outro'];

  useEffect(() => {
    const q = query(
      collection(db, 'chamados'),
      where('usuarioId', '==', usuario.uid),
      orderBy('dataCriacao', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setChamados(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  async function salvarChamado() {
    if (!titulo || !descricao) {
      Alert.alert('Atenção', 'Preencha título e descrição.');
      return;
    }
    setSalvando(true);
    try {
      await addDoc(collection(db, 'chamados'), {
        titulo, descricao, tipo, status: 'Aberto',
        usuarioId: usuario.uid, email: usuario.email,
        dataCriacao: new Date()
      });
      setTitulo(''); setDescricao(''); setTipo('Queda de sinal');
      setMostrarForm(false);
      Alert.alert('Sucesso!', 'Chamado aberto!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar.');
    }
    setSalvando(false);
  }

  const chamadosFiltrados = chamados.filter(c => c.status === aba);

  const badgeColor = (status) => {
    if (status === 'Aberto') return '#E74C3C';
    if (status === 'Em andamento') return '#F39C12';
    return '#1D9E75';
  };

  if (mostrarForm) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMostrarForm(false)}>
            <Text style={styles.voltar}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Novo Chamado</Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView style={styles.form}>
          <TextInput style={styles.input} placeholder="Título do chamado"
            placeholderTextColor="#999" value={titulo} onChangeText={setTitulo} />
          <TextInput style={[styles.input, { height: 100 }]}
            placeholder="Descrição do problema"
            placeholderTextColor="#999" value={descricao} onChangeText={setDescricao}
            multiline />
          <Text style={styles.label}>Tipo de problema:</Text>
          {tipos.map(t => (
            <TouchableOpacity key={t} style={[styles.tipoBtn, tipo === t && styles.tipoBtnAtivo]}
              onPress={() => setTipo(t)}>
              <Text style={[styles.tipoBtnTexto, tipo === t && styles.tipoBtnTextoAtivo]}>{t}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.botao} onPress={salvarChamado} disabled={salvando}>
            <Text style={styles.botaoTexto}>{salvando ? 'Salvando...' : 'Abrir Chamado'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Meus Chamados</Text>
        <TouchableOpacity style={styles.botaoAdd} onPress={() => setMostrarForm(true)}>
          <Text style={styles.botaoAddTexto}>+ Novo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.abas}>
        {['Aberto', 'Em andamento', 'Resolvido'].map(a => (
          <TouchableOpacity key={a} style={[styles.aba, aba === a && styles.abaAtiva]}
            onPress={() => setAba(a)}>
            <Text style={[styles.abaTexto, aba === a && styles.abaTextoAtivo]}>{a}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={chamadosFiltrados}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTexto}>Nenhum chamado {aba.toLowerCase()}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome}>{item.titulo}</Text>
              <Text style={styles.cardSub}>{item.tipo}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: badgeColor(item.status) }]}>
              <Text style={styles.badgeTexto}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    backgroundColor: '#1A5276', padding: 20, paddingTop: 52,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  headerTitulo: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  voltar: { color: '#AED6F1', fontSize: 16 },
  botaoAdd: { backgroundColor: '#1D9E75', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  botaoAddTexto: { color: '#fff', fontWeight: 'bold' },
  abas: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  aba: { flex: 1, padding: 12, alignItems: 'center' },
  abaAtiva: { borderBottomWidth: 2, borderBottomColor: '#1A5276' },
  abaTexto: { fontSize: 12, color: '#888' },
  abaTextoAtivo: { color: '#1A5276', fontWeight: 'bold' },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#1C2833', marginBottom: 8 },
  input: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    fontSize: 15, color: '#1C2833', marginBottom: 14,
    borderWidth: 1, borderColor: '#e0e0e0'
  },
  tipoBtn: {
    borderRadius: 8, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fff'
  },
  tipoBtnAtivo: { backgroundColor: '#1A5276', borderColor: '#1A5276' },
  tipoBtnTexto: { color: '#888', fontSize: 14 },
  tipoBtnTextoAtivo: { color: '#fff', fontWeight: 'bold' },
  botao: { backgroundColor: '#1A5276', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 6 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#e0e0e0'
  },
  cardInfo: { flex: 1 },
  cardNome: { fontSize: 15, fontWeight: 'bold', color: '#1C2833' },
  cardSub: { fontSize: 12, color: '#888', marginTop: 2 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  badgeTexto: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  emptyBox: { alignItems: 'center', padding: 40 },
  emptyTexto: { color: '#999', fontSize: 14 }
});