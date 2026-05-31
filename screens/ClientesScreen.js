import { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, Alert
} from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ClientesScreen() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'clientes'), orderBy('nome'));
    const unsub = onSnapshot(q, snap => {
      setClientes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  async function salvarCliente() {
    if (!nome || !cpf || !email || !telefone) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    setSalvando(true);
    try {
      await addDoc(collection(db, 'clientes'), {
        nome, cpf, email, telefone, status: 'ativo', dataCadastro: new Date()
      });
      setNome(''); setCpf(''); setEmail(''); setTelefone('');
      setMostrarForm(false);
      Alert.alert('Sucesso!', 'Cliente cadastrado!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar.');
    }
    setSalvando(false);
  }

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (mostrarForm) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMostrarForm(false)}>
            <Text style={styles.voltar}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Novo Cliente</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Nome completo"
            placeholderTextColor="#999" value={nome} onChangeText={setNome} />
          <TextInput style={styles.input} placeholder="CPF"
            placeholderTextColor="#999" value={cpf} onChangeText={setCpf}
            keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="E-mail"
            placeholderTextColor="#999" value={email} onChangeText={setEmail}
            keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Telefone"
            placeholderTextColor="#999" value={telefone} onChangeText={setTelefone}
            keyboardType="phone-pad" />
          <TouchableOpacity style={styles.botao} onPress={salvarCliente} disabled={salvando}>
            <Text style={styles.botaoTexto}>{salvando ? 'Salvando...' : 'Salvar Cliente'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Clientes</Text>
        <TouchableOpacity style={styles.botaoAdd} onPress={() => setMostrarForm(true)}>
          <Text style={styles.botaoAddTexto}>+ Novo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buscaBox}>
        <TextInput style={styles.busca} placeholder="Buscar cliente..."
          placeholderTextColor="#999" value={busca} onChangeText={setBusca} />
      </View>
      <FlatList
        data={clientesFiltrados}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTexto}>Nenhum cliente cadastrado</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome}>{item.nome}</Text>
              <Text style={styles.cardSub}>{item.email} • {item.telefone}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: item.status === 'ativo' ? '#1D9E75' : '#E74C3C' }]}>
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
  buscaBox: { padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  busca: { backgroundColor: '#F8F9FA', borderRadius: 8, padding: 10, fontSize: 14, color: '#1C2833' },
  form: { padding: 20 },
  input: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    fontSize: 15, color: '#1C2833', marginBottom: 14,
    borderWidth: 1, borderColor: '#e0e0e0'
  },
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