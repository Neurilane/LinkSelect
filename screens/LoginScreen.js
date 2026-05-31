import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    setCarregando(true);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch (e) {
      Alert.alert('Erro', 'E-mail ou senha incorretos.');
    }
    setCarregando(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>🔗</Text>
        <Text style={styles.titulo}>LinkSelect</Text>
        <Text style={styles.subtitulo}>Gestão de Provedor de Internet</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.botao} onPress={entrar} disabled={carregando}>
          {carregando
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.botaoTexto}>Entrar</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  inner: { flex: 1, justifyContent: 'center', padding: 28 },
  logo: { fontSize: 56, textAlign: 'center', marginBottom: 8 },
  titulo: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#1A5276', marginBottom: 4 },
  subtitulo: { fontSize: 14, textAlign: 'center', color: '#888', marginBottom: 36 },
  input: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    fontSize: 15, color: '#1C2833', marginBottom: 14,
    borderWidth: 1, borderColor: '#e0e0e0'
  },
  botao: {
    backgroundColor: '#1A5276', borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 6
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#2E86C1', fontSize: 14, textAlign: 'center', marginTop: 20 }
});