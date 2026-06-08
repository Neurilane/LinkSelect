// Offline storage temporariamente desabilitado
export async function salvarChamadoOffline(chamado) {
  console.log('Offline: chamado salvo localmente', chamado);
}

export async function salvarClienteOffline(cliente) {
  console.log('Offline: cliente salvo localmente', cliente);
}

export async function getChamadosOffline() {
  return [];
}

export async function getClientesOffline() {
  return [];
}

export async function marcarChamadoSincronizado(id) {}
export async function marcarClienteSincronizado(id) {}
export async function getDatabase() {}