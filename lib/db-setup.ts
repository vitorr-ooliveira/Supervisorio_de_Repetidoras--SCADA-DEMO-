import knex from 'knex';
import { logger } from './logger';

if (!process.env.DB_PRIMARY_USER || !process.env.DB_PRIMARY_PASSWORD) {
  throw new Error('Faltam credenciais do banco de dados primário nas variáveis de ambiente!');
}

const primaryConfig = {
  client: process.env.DB_PRIMARY_CLIENT || 'pg',
  connection: {
    host: process.env.DB_PRIMARY_HOST,
    port: Number(process.env.DB_PRIMARY_PORT),
    user: process.env.DB_PRIMARY_USER,
    password: process.env.DB_PRIMARY_PASSWORD,
    database: process.env.DB_PRIMARY_NAME,
  }
};

const secondaryConfig = {
  client: process.env.DB_SECONDARY_CLIENT || 'mysql2',
  connection: {
    host: process.env.DB_SECONDARY_HOST,
    port: Number(process.env.DB_SECONDARY_PORT),
    user: process.env.DB_SECONDARY_USER,
    password: process.env.DB_SECONDARY_PASSWORD,
    database: process.env.DB_SECONDARY_NAME,
  }
};

const primaryDb = knex(primaryConfig);
const secondaryDb = knex(secondaryConfig);

async function syncTables(db: knex.Knex) {
  try {
    const hasUsers = await db.schema.hasTable('tb_users');
    if (!hasUsers) {
      await db.schema.createTable('tb_users', (t) => {
        t.string('id', 50).primary();
        t.string('username', 50).notNullable();
        t.string('role', 20).notNullable();
        t.string('password_hash', 100).notNullable();
        t.string('email', 100);
      });
      logger.info(`[DB-SETUP] Tabela 'tb_users' criada no dialeto ${db.client.config.client}`);
    } else {
      const hasEmail = await db.schema.hasColumn('tb_users', 'email');
      if (!hasEmail) {
        await db.schema.alterTable('tb_users', (t) => {
          t.string('email', 100);
        });
        logger.info(`[DB-SETUP] Coluna 'email' adicionada à tabela 'tb_users' no dialeto ${db.client.config.client}`);
      }
    }

    const hasRestartHistory = await db.schema.hasTable('tb_restart_history');
    if (!hasRestartHistory) {
      await db.schema.createTable('tb_restart_history', (t) => {
        t.increments('id').primary();
        t.string('bateria_id', 255).notNullable();
        t.string('restarted_by', 255).notNullable();
        t.datetime('restarted_at').notNullable();
      });
      logger.info(`[DB-SETUP] Tabela 'tb_restart_history' criada no dialeto ${db.client.config.client}`);
    }

    const hasMfaTokens = await db.schema.hasTable('tb_mfa_tokens');
    if (!hasMfaTokens) {
      await db.schema.createTable('tb_mfa_tokens', (t) => {
        t.increments('id').primary();
        t.string('username', 50).notNullable();
        t.string('repetidora_id', 100).notNullable();
        t.string('code', 10).notNullable();
        t.timestamp('expires_at').notNullable();
        t.timestamp('created_at').defaultTo(db.fn.now());
      });
      logger.info(`[DB-SETUP] Tabela 'tb_mfa_tokens' criada no dialeto ${db.client.config.client}`);
    }
  } catch (error) {
    logger.error({ err: error }, `[DB-SETUP] Erro ao sincronizar tabelas no dialeto ${db.client.config.client}`);
  }
}

export async function initDatabase() {
  logger.info('[DB-SETUP] Conectando aos bancos...');
  try {
    // Check connections
    await primaryDb.raw('SELECT 1 as result');
    logger.info('[DB-SETUP] Banco primário conectado.');
    await syncTables(primaryDb);
  } catch (error) {
    logger.error({ err: error }, '[DB-SETUP] Erro ao conectar ao banco primário');
  }
  
  if (process.env.DB_SECONDARY_USER && process.env.DB_SECONDARY_PASSWORD) {
    try {
      await secondaryDb.raw('SELECT 1 as result');
      logger.info('[DB-SETUP] Banco secundário conectado.');
      await syncTables(secondaryDb);
    } catch (error) {
      logger.error({ err: error }, '[DB-SETUP] Erro ao conectar ao banco secundário');
    }
  }
}

// Chamar imediatamente no startup do módulo
initDatabase().catch(err => logger.error(err));

export { primaryDb, secondaryDb };
