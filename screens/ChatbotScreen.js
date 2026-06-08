import { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';

const GROQ_API_KEY = 'Sgsk_9hn1s77Dg5tNe33zcN53WGdyb3FYyMsX95kNJoorAgzHAVqcxfye';

export default function ChatbotScreen() {
  const [mensagens, setMensagens] = useState([
    {
      id: '1', tipo: 'bot',
      texto: 'Olá! 👋 Sou o assistente LinkSelect. Descreva seu problema de internet e vou te ajudar!'
    }
  ]);
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);
  const flatListRef = useRef(null);

  async function enviarMensagem() {
    if (!input.trim()) return;

    const novaMensagem = { id: Date.now().toString(), tipo: 'usuario', texto: input };
    const historico = [...mensagens, novaMensagem];
    setMensagens(historico);
    setInput('');
    setCarregando(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: `Você é um assistente técnico do LinkSelect, sistema de gestão de provedor de internet. 
              Ajude o cliente a identificar problemas de internet e sugira soluções simples.
              Seja direto, amigável e fale em português brasileiro.
              Se o problema for grave, oriente a abrir um chamado técnico.
              Responda sempre em no máximo 3 frases curtas.`
            },
            ...historico.map(m => ({
              role: m.tipo === 'usuario' ? 'user' : 'assistant',
              content: m.texto
            }))
          ],
          max_tokens: 200
        })
      });

      const data = await response.json();
      console.log('Resposta Groq:', JSON.stringify(data));
      const resposta = data.choices?.[0]?.message?.content
        || 'Desculpe, não consegui responder agora.';

      setMensagens(prev => [...prev, {
        id: Date.now().toString(), tipo: 'bot', texto: resposta
      }]);
    } catch (e) {
      console.log('ERRO:', e.message);
      setMensagens(prev => [...prev, {
        id: Date.now().toString(), tipo: 'bot',
        texto: 'Erro: ' + e.message
      }]);
    }
    setCarregando(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>🤖 Assistente LinkSelect</Text>
        <Text style={styles.headerSub}>Suporte com IA</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={mensagens}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        renderItem={({ item }) => (
          <View style={[
            styles.bubble,
            item.tipo === 'usuario' ? styles.bubbleUsuario : styles.bubbleBot
          ]}>
            <Text style={[
              styles.bubbleTexto,
              item.tipo === 'usuario' ? styles.bubbleTextoUsuario : styles.bubbleTextoBot
            ]}>
              {item.texto}
            </Text>
          </View>
        )}
      />

      {carregando && (
        <View style={styles.digitando}>
          <ActivityIndicator size="small" color="#1A5276" />
          <Text style={styles.digitandoTexto}>Assistente digitando...</Text>
        </View>
      )}

      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua dúvida..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.botaoEnviar} onPress={enviarMensagem} disabled={carregando}>
          <Text style={styles.botaoEnviarTexto}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#1A5276', padding: 20, paddingTop: 52 },
  headerTitulo: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 12, color: '#AED6F1', marginTop: 2 },
  bubble: { maxWidth: '80%', borderRadius: 16, padding: 12, marginBottom: 10 },
  bubbleBot: { backgroundColor: '#fff', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#e0e0e0' },
  bubbleUsuario: { backgroundColor: '#1A5276', alignSelf: 'flex-end' },
  bubbleTexto: { fontSize: 14, lineHeight: 20 },
  bubbleTextoBot: { color: '#1C2833' },
  bubbleTextoUsuario: { color: '#fff' },
  digitando: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 8 },
  digitandoTexto: { fontSize: 12, color: '#888', marginLeft: 8 },
  inputBox: {
    flexDirection: 'row', padding: 12, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#e0e0e0', alignItems: 'flex-end'
  },
  input: {
    flex: 1, backgroundColor: '#F8F9FA', borderRadius: 20, paddingHorizontal: 16,
    paddingVertical: 10, fontSize: 14, color: '#1C2833', maxHeight: 100,
    borderWidth: 1, borderColor: '#e0e0e0'
  },
  botaoEnviar: {
    backgroundColor: '#1A5276', borderRadius: 20, width: 42, height: 42,
    justifyContent: 'center', alignItems: 'center', marginLeft: 8
  },
  botaoEnviarTexto: { color: '#fff', fontSize: 18 },
});