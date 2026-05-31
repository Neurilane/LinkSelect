import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Modal, Alert
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function LibrasScreen() {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [funcaoSelecionada, setFuncaoSelecionada] = useState(null);

  const funcionalidades = [
    { id: 1, icone: '🔑', titulo: 'Login e Cadastro', texto: 'Para fazer login no aplicativo LinkSelect, digite seu email e senha e toque no botão entrar.' },
    { id: 2, icone: '🏠', titulo: 'Tela Inicial', texto: 'A tela inicial mostra um resumo com clientes ativos, chamados abertos e faturas pendentes.' },
    { id: 3, icone: '👥', titulo: 'Clientes', texto: 'Na tela de clientes você pode cadastrar novos clientes e buscar clientes existentes.' },
    { id: 4, icone: '🎫', titulo: 'Chamados', texto: 'Na tela de chamados você pode abrir um novo chamado técnico e acompanhar o status.' },
    { id: 5, icone: '💰', titulo: 'Faturas', texto: 'Na tela de faturas você pode ver suas faturas e pagar usando o código PIX.' },
    { id: 6, icone: '📄', titulo: '2ª Via', texto: 'Para obter a segunda via de uma fatura, toque na fatura desejada e copie o código PIX.' },
    { id: 7, icone: '⚙️', titulo: 'Configurações', texto: 'Nas configurações você pode ativar o modo de alto contraste e ajustar o tamanho da fonte.' },
    { id: 8, icone: '📊', titulo: 'Relatórios', texto: 'Na tela de relatórios você pode ver métricas e dados sobre clientes e chamados.' },
  ];

  function abrirVideo(funcao) {
    setFuncaoSelecionada(funcao);
    setModalVisivel(true);
  }

  function gerarHTML(texto) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; background: #F8F9FA; display: flex; flex-direction: column; align-items: center; }
          #vw { position: fixed; bottom: 0; right: 0; }
        </style>
        <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
      </head>
      <body>
        <div vw class="enabled">
          <div vw-access-button class="active"></div>
          <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
          </div>
        </div>
        <script>
          new window.VLibras.Widget('https://vlibras.gov.br/app');
        </script>
        <div style="padding: 20px; font-family: Arial; font-size: 16px; color: #1A5276; text-align: center; margin-top: 20px;">
          <p>${texto}</p>
          <p style="color: #888; font-size: 13px;">Toque no boneco azul para ver em Libras 👆</p>
        </div>
      </body>
      </html>
    `;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>🤟 Central de Libras</Text>
        <Text style={styles.headerSub}>Acessibilidade para deficientes auditivos</Text>
      </View>

      <Text style={styles.secao}>Vídeos Explicativos em Libras</Text>
      <Text style={styles.descricao}>
        Toque em qualquer funcionalidade para ver a explicação em Libras via VLibras (tecnologia do governo federal).
      </Text>

      <View style={styles.grid}>
        {funcionalidades.map(f => (
          <TouchableOpacity key={f.id} style={styles.card} onPress={() => abrirVideo(f)}>
            <Text style={styles.cardIcone}>{f.icone}</Text>
            <Text style={styles.cardTitulo}>{f.titulo}</Text>
            <Text style={styles.cardDesc}>{f.texto.substring(0, 40)}...</Text>
            <View style={styles.botaoVideo}>
              <Text style={styles.botaoVideoTexto}>🤟 Ver em Libras</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

     
      {/* Modal VLibras */}
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>{funcaoSelecionada?.icone} {funcaoSelecionada?.titulo}</Text>
            <View style={styles.webviewBox}>
              {funcaoSelecionada && (
                <WebView
                  source={{ html: gerarHTML(funcaoSelecionada.texto) }}
                  style={{ flex: 1 }}
                  javaScriptEnabled={true}
                />
              )}
            </View>
            <TouchableOpacity style={styles.botaoFechar} onPress={() => setModalVisivel(false)}>
              <Text style={styles.botaoFecharTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#1A5276', padding: 20, paddingTop: 52 },
  headerTitulo: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 12, color: '#AED6F1', marginTop: 4 },
  secao: { fontSize: 16, fontWeight: 'bold', color: '#1A5276', margin: 16, marginBottom: 4 },
  descricao: { fontSize: 13, color: '#888', marginHorizontal: 16, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  card: {
    width: '46%', margin: '2%', backgroundColor: '#fff', borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: '#e0e0e0', alignItems: 'center'
  },
  cardIcone: { fontSize: 32, marginBottom: 8 },
  cardTitulo: { fontSize: 13, fontWeight: 'bold', color: '#1C2833', textAlign: 'center' },
  cardDesc: { fontSize: 11, color: '#888', textAlign: 'center', marginTop: 4, marginBottom: 10 },
  botaoVideo: { backgroundColor: '#1A5276', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  botaoVideoTexto: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  interpreteBtn: {
    marginHorizontal: 16, backgroundColor: '#1D9E75', borderRadius: 12,
    padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 40
  },
  interpreteIcone: { fontSize: 28, marginRight: 12 },
  interpreteTitulo: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  interpreteSub: { fontSize: 12, color: '#E1F5EE', marginTop: 2 },
  seta: { fontSize: 24, color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalBox: { flex: 1, backgroundColor: '#fff', marginTop: 60, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', color: '#1A5276', marginBottom: 12 },
  webviewBox: { flex: 1, borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  botaoFechar: { borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  botaoFecharTexto: { color: '#888', fontSize: 16 },
});