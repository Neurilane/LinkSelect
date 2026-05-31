import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [perfil, setPerfil] = useState('cliente');
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    if (!nome || !email || !senha || !confirmar) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (senha !== confirmar) {
      Alert.alert('Atenção', 'As senhas não conferem.');
      return;
    }
    setCarregando(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha);
      await setDoc(doc(db, 'usuarios', cred.user.uid), {
        nome, email, perfil, ativo: true
      });
      Alert.alert('Sucesso!', 'Conta criada com sucesso!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível criar a conta.');
    }
    setCarregando(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>‹ Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Criar Conta</Text>
        <Text style={styles.subtitulo}>LinkSelect</Text>

        <TextInput style={styles.input} placeholder="Nome completo"
          placeholderTextColor="#999" value={nome} onChangeText={setNome} />

        <TextInput style={styles.input} placeholder="E-mail"
          placeholderTextColor="#999" value={email} onChangeText={setEmail}
          keyboardType="email-address" autoCapitalize="none" />

        <TextInput style={styles.input} placeholder="Senha"
          placeholderTextColor="#999" value={senha} onChangeText={setSenha}
          secureTextEntry />

        <TextInput style={styles.input} placeholder="Confirmar senha"
          placeholderTextColor="#999" value={confirmar} onChangeText={setConfirmar}
          secureTextEntry />

        <Text style={styles.label}>Tipo de conta:</Text>
        <View style={styles.perfilRow}>
          <TouchableOpacity
            style={[styles.perfilBtn, perfil === 'cliente' && styles.perfilBtnAtivo]}
            onPress={() => setPerfil('cliente')}>
            <Text style={[styles.perfilTexto, perfil === 'cliente' && styles.perfilTextoAtivo]}>
              👤 Cliente
            </Text>
            <Text style={styles.perfilDesc}>Acompanha faturas e chamados</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.perfilBtn, perfil === 'atendente' && styles.perfilBtnAtivo]}
            onPress={() => setPerfil('atendente')}>
            <Text style={[styles.perfilTexto, perfil === 'atendente' && styles.perfilTextoAtivo]}>
              🏢 Atendente
            </Text>
            <Text style={styles.perfilDesc}>Gerencia clientes e chamados</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botao} onPress={cadastrar} disabled={carregando}>
          {carregando
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.botaoTexto}>Cadastrar</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  inner: { padding: 28, paddingTop: 60 },
  voltar: { color: '#2E86C1', fontSize: 16, marginBottom: 24 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#1A5276', marginBottom: 4 },
  subtitulo: { fontSize: 14, color: '#888', marginBottom: 36 },
  input: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    fontSize: 15, color: '#1C2833', marginBottom: 14,
    borderWidth: 1, borderColor: '#e0e0e0'
  },
  label: { fontSize: 14, fontWeight: 'bold', color: '#1C2833', marginBottom: 12 },
  perfilRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  perfilBtn: {
    flex: 1, borderRadius: 12, padding: 14, borderWidth: 1,
    borderColor: '#e0e0e0', backgroundColor: '#fff', alignItems: 'center'
  },
  perfilBtnAtivo: { backgroundColor: '#1A5276', borderColor: '#1A5276' },
  perfilTexto: { fontSize: 14, fontWeight: 'bold', color: '#888' },
  perfilTextoAtivo: { color: '#fff' },
  perfilDesc: { fontSize: 11, color: '#aaa', marginTop: 4, textAlign: 'center' },
  botao: {
    backgroundColor: '#1A5276', borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 6
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});