import crypto from 'crypto';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'gestor' | 'tecnico';
  passwordHash: string;
  email?: string;
}

export interface Repetidora {
  id: string;
  name: string;
  location: string;
  username: string;
  password?: string;
  lastIp: string;
  status: 'online' | 'offline';
  lastRestart?: string;
  tensaoMin?: number;
  tensaoMax?: number;
  correnteMin?: number;
  correnteMax?: number;
  tempMin?: number;
  tempMax?: number;
  tensaoInputMin?: number;
  tensaoInputMax?: number;
  tensaoCargaMin?: number;
  tensaoCargaMax?: number;
  correnteCargaMin?: number;
  correnteCargaMax?: number;
  potenciaBatMin?: number;
  potenciaBatMax?: number;
  tempControladoraMin?: number;
  tempControladoraMax?: number;
  contratoId?: string;
}

export interface Telemetry {
  id: string;
  idControladora: string;
  energizado: boolean;
  timestampEvento: string;
  tensaoInput?: number;
  tensaoRepetidora?: number;
  statusCarga?: number;
  correntePlacaSolar?: number;
  temperaturaRepetidora?: number;
  capacidadeRepetidora?: number;
  tensaoCarga?: number;
  correnteCarga?: number;
  potenciaRepetidora?: number;
  temperaturaControladora?: number;
  energiaGeradaHora?: number;
  energiaConsumidaHora?: number;
  dataHoraControladora?: string;
}

export interface Contrato {
  id: string;
  nome: string;
  descricao?: string;
  cif?: string;
  dataCriacao?: string;
}

export interface Alerta {
  id: string;
  repetidoraId: string;
  tipoAlerta: string;
  mensagem: string;
  status: 'NAO_RECONHECIDO' | 'RECONHECIDO' | 'RESOLVIDO';
  dataCriacao: string;
  dataResolucao?: string;
}

// Mock Data Generators

const MOCK_REPETIDORAS: Repetidora[] = [
  {
    id: '1',
    name: 'Bateria Nobreak Principal',
    location: 'Rio de Janeiro - RJ',
    username: 'admin',
    lastIp: '192.168.9.77',
    status: 'offline',
    lastRestart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    tensaoMin: 11,
    tensaoMax: 15,
  },
  {
    id: '2',
    name: 'Repetidora Serra',
    location: 'Petrópolis - RJ',
    username: 'admin',
    lastIp: '192.168.9.78',
    status: 'offline',
    lastRestart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    tensaoMin: 11,
    tensaoMax: 15,
  }
];

const MOCK_ALERTAS: Alerta[] = [
  {
    id: 'a1',
    repetidoraId: '1',
    tipoAlerta: 'Corrente Baixa',
    mensagem: 'Corrente 0.0A abaixo do mínimo permitido de 0.1A',
    status: 'NAO_RECONHECIDO',
    dataCriacao: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'a2',
    repetidoraId: '1',
    tipoAlerta: 'Corrente Baixa',
    mensagem: 'Corrente 0.0A abaixo do mínimo permitido de 0.1A',
    status: 'RECONHECIDO',
    dataCriacao: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'a3',
    repetidoraId: '2',
    tipoAlerta: 'Falha de Comunicação',
    mensagem: 'Ping timeout (15min)',
    status: 'RESOLVIDO',
    dataCriacao: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    dataResolucao: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  }
];

export const db = {
  getUsers: async (): Promise<User[]> => [],
  addUser: async (user: User): Promise<User> => user,
  updateUser: async (user: User): Promise<User> => user,
  deleteUser: async (id: string): Promise<void> => {},

  getRepetidoras: async (): Promise<Repetidora[]> => MOCK_REPETIDORAS,
  addRepetidora: async (repetidora: Repetidora): Promise<Repetidora> => repetidora,
  updateRepetidora: async (repetidora: Repetidora): Promise<Repetidora> => repetidora,
  deleteRepetidora: async (id: string): Promise<void> => {},

  logRestart: async (repetidoraId: string, username: string): Promise<string> => new Date().toLocaleString('pt-BR'),
  saveMfaToken: async () => {},
  validateAndConsumeMfaToken: async () => true,

  getRepetidoraById: async (id: string): Promise<Repetidora | null> => {
    return MOCK_REPETIDORAS.find(r => r.id === id) || null;
  },

  getTelemetryHistory: async (idControladora: string, from?: string, to?: string): Promise<Telemetry[]> => {
    const history: Telemetry[] = [];
    const now = Date.now();
    for (let i = 0; i < 50; i++) {
      history.push({
        id: `tel-${i}`,
        idControladora,
        energizado: true,
        timestampEvento: new Date(now - i * 1000 * 60 * 15).toISOString(),
        tensaoInput: 11.87 + (Math.random() * 0.5),
        tensaoRepetidora: 10.83 + (Math.random() * 0.5),
        correntePlacaSolar: 0.42 + (Math.random() * 0.1),
        temperaturaRepetidora: 25.0 + (Math.random() * 2),
        tensaoCarga: 0,
        correnteCarga: 0,
        potenciaRepetidora: 4.98 + (Math.random() * 1),
        temperaturaControladora: 27.6 + (Math.random() * 2),
      });
    }
    return history;
  },

  getGlobalEnergyHistory: async (days: number = 7): Promise<{ date: string, gerada: number, consumida: number }[]> => {
    const data = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      data.push({
        date: d.toISOString().split('T')[0],
        gerada: 100 + Math.random() * 1000,
        consumida: 50 + Math.random() * 500
      });
    }
    return data;
  },

  getContratos: async (): Promise<any[]> => [],
  addContrato: async (contrato: Contrato): Promise<Contrato> => contrato,
  updateContrato: async (contrato: Contrato): Promise<Contrato> => contrato,
  deleteContrato: async (id: string): Promise<void> => {},

  getAlertas: async (): Promise<Alerta[]> => MOCK_ALERTAS,
  updateAlertaStatus: async (id: string, status: string): Promise<void> => {},
  registerAlertaView: async (alertaId: string, userId: string): Promise<void> => {},
  getAlertaViews: async (alertaId: string): Promise<{ userId: string, dataVisualizacao: string }[]> => []
};
