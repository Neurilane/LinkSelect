import { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, Modal, Clipboard
} from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function FaturasScreen() {
  const [faturas, setFaturas] = useState([]);
  const [faturaSelecionada, setFaturaSelecionada] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'faturas'), orderBy('vencimento', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setFaturas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  function abrirSegundaVia(fatura) {
    setFaturaSelecionada(fatura);
    setModalVisivel(true);
  }

  function copiarPIX() {
    Clipboard.setString(faturaSelecionada?.pixCode || '');
    Alert.alert('Copiado!', 'Código PIX copiado para a área de transferência.');
  }

  const badgeColor = (status) => {
    if (status === 'Pendente') return '#F39C12';
    if (status === 'Vencido') return '#E74C3C';
    return '#1D9E75';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Faturas</Text>
      </View>

      <FlatList
        data={faturas}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTexto}>Nenhuma fatura encontrada</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => abrirSegundaVia(item)}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome}>{item.cliente || 'Cliente'}</Text>
              <Text style={styles.cardSub}>Venc: {item.vencimento} • R$ {item.valor}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: badgeColor(item.status) }]}>
              <Text style={styles.badgeTexto}>{item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal 2ª Via */}
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>2ª Via — Fatura</Text>
            <Text style={styles.modalInfo}>Cliente: {faturaSelecionada?.cliente}</Text>
            <Text style={styles.modalInfo}>Valor: R$ {faturaSelecionada?.valor}</Text>
            <Text style={styles.modalInfo}>Vencimento: {faturaSelecionada?.vencimento}</Text>
            <Text style={styles.modalInfo}>Status: {faturaSelecionada?.status}</Text>

            <View style={styles.qrBox}>
              <Text style={styles.qrTexto}>📱 QR Code PIX</Text>
              <Text style={styles.qrPlaceholder}>████████████{'\n'}████████████{'\n'}████████████</Text>
            </View>

            <TouchableOpacity style={styles.botaoPix} onPress={copiarPIX}>
              <Text style={styles.botaoTexto}>Copiar Código PIX</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoFechar} onPress={() => setModalVisivel(false)}>
              <Text style={styles.botaoFecharTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  emptyTexto: { color: '#999', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', color: '#1A5276', marginBottom: 16 },
  modalInfo: { fontSize: 14, color: '#1C2833', marginBottom: 8 },
  qrBox: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 20, alignItems: 'center', marginVertical: 16 },
  qrTexto: { fontSize: 14, fontWeight: 'bold', color: '#1A5276', marginBottom: 8 },
  qrPlaceholder: { fontSize: 24, color: '#1A5276', textAlign: 'center', letterSpacing: 4 },
  botaoPix: { backgroundColor: '#1D9E75', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 10 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botaoFechar: { borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  botaoFecharTexto: { color: '#888', fontSize: 16 },
});