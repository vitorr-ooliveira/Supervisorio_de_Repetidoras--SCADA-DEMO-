import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import { FileText } from 'lucide-react';
import ContratoManagement from '@/components/ContratoManagement';

export default async function ContratosPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'admin' && session.role !== 'gestor') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      <Navbar user={session} />
      <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Gestão de Contratos</h1>
            <p className="text-muted-foreground text-sm mt-1">Gerencie os contratos e clientes para associação de repetidoras.</p>
          </div>
        </div>
        <ContratoManagement />
      </main>
    </div>
  );
}
