export interface SessionData {
  id: string;
  username: string;
  role: 'admin' | 'gestor' | 'tecnico';
  createdAt: number;
}

export async function getSession(): Promise<SessionData | null> {
  // Mocked session for GitHub Pages demo
  return {
    id: 'demo-admin-id',
    username: 'admin',
    role: 'admin',
    createdAt: Date.now(),
  };
}

export async function setSession(id: string, username: string, role: 'admin' | 'gestor' | 'tecnico') {
  // No-op for static demo
}

export async function clearSession() {
  // No-op for static demo
}
