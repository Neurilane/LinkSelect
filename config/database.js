import * as SQLite from 'expo-sqlite';

let db;

export async function getDatabase() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('linkselect.db');
    await inicializarTabelas(db);
  }
  return db;
}

async function inicializarTabelas(db) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS chamados_offline (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      tipo TEXT NOT NULL,
      status TEXT DEFAULT 'Aberto',
      sincronizado INTEGER DEFAULT 0,
      dataCriacao TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clientes_offline (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cpf TEXT NOT NULL,
      email TEXT NOT NULL,
      telefone TEXT NOT NULL,
      status TEXT DEFAULT 'ativo',
      sincronizado INTEGER DEFAULT 0,
      dataCriacao TEXT NOT NULL
    );
  `);
}

export async function salvarChamadoOffline(chamado) {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO chamados_offline (titulo, descricao, tipo, dataCriacao) VALUES (?, ?, ?, ?)`,
    [chamado.titulo, chamado.descricao, chamado.tipo, new Date().toISOString()]
  );
}

export async function salvarClienteOffline(cliente) {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO clientes_offline (nome, cpf, email, telefone, dataCriacao) VALUES (?, ?, ?, ?, ?)`,
    [cliente.nome, cliente.cpf, cliente.email, cliente.telefone, new Date().toISOString()]
  );
}

export async function getChamadosOffline() {
  const db = await getDatabase();
  return await db.getAllAsync(`SELECT * FROM chamados_offline WHERE sincronizado = 0`);
}

export async function getClientesOffline() {
  const db = await getDatabase();
  return await db.getAllAsync(`SELECT * FROM clientes_offline WHERE sincronizado = 0`);
}

export async function marcarChamadoSincronizado(id) {
  const db = await getDatabase();
  await db.runAsync(`UPDATE chamados_offline SET sincronizado = 1 WHERE id = ?`, [id]);
}

export async function marcarClienteSincronizado(id) {
  const db = await getDatabase();
  await db.runAsync(`UPDATE clientes_offline SET sincronizado = 1 WHERE id = ?`, [id]);
}