import NetInfo from '@react-native-community/netinfo';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import {
  getChamadosOffline, getClientesOffline,
  marcarChamadoSincronizado, marcarClienteSincronizado
} from './database';

export async function sincronizarDados() {
  const state = await NetInfo.fetch();
  if (!state.isConnected) return;

  // Sincroniza chamados
  const chamados = await getChamadosOffline();
  for (const chamado of chamados) {
    try {
      await addDoc(collection(db, 'chamados'), {
        titulo: chamado.titulo,
        descricao: chamado.descricao,
        tipo: chamado.tipo,
        status: 'Aberto',
        dataCriacao: new Date(chamado.dataCriacao)
      });
      await marcarChamadoSincronizado(chamado.id);
    } catch (e) {
      console.log('Erro ao sincronizar chamado:', e);
    }
  }

  // Sincroniza clientes
  const clientes = await getClientesOffline();
  for (const cliente of clientes) {
    try {
      await addDoc(collection(db, 'clientes'), {
        nome: cliente.nome,
        cpf: cliente.cpf,
        email: cliente.email,
        telefone: cliente.telefone,
        status: 'ativo',
        dataCadastro: new Date(cliente.dataCriacao)
      });
      await marcarClienteSincronizado(cliente.id);
    } catch (e) {
      console.log('Erro ao sincronizar cliente:', e);
    }
  }
}