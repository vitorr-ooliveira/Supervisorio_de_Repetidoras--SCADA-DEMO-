import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Navbar from '@/components/Navbar';
import UserManagement from '@/components/UserManagement';

export default async function UsuariosPage() {
  const session = await getSession();

  // 1. Validar Autenticação
  if (!session) {
    redirect('/login');
  }

  // 2. Validar Nível de Acesso (Apenas Admin)
  const isAdmin = session.role === 'admin';
  if (!isAdmin) {
    redirect('/dashboard');
  }

  // Omitimos a senha no envio para o componente por segurança
  const users = (await db.getUsers()).map(({ passwordHash, ...u }) => u);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar user={session} />

      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
        <UserManagement initialUsers={users} />
      </main>
    </div>
  );
}
