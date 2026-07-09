import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Navbar from '@/components/Navbar';
import RepetidoraManagement from '@/components/RepetidoraManagement';

export default async function RepetidorasPage() {
  const session = await getSession();

  // 1. Validar Autenticação
  if (!session) {
    redirect('/login');
  }

  // 2. Validar Nível de Acesso (Apenas Admin e Gestor)
  const hasAccess = session.role === 'admin' || session.role === 'gestor';
  if (!hasAccess) {
    redirect('/dashboard');
  }

  const repetidoras = await db.getRepetidoras();
  const contratos = await db.getContratos();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar user={session} />

      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
        <RepetidoraManagement initialRepetidoras={repetidoras} contratos={contratos} userRole={session.role} />
      </main>
    </div>
  );
}
