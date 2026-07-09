import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import { Bell } from 'lucide-react';
import AlertManagement from '@/components/AlertManagement';

export default async function AlertasPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      <Navbar user={session} />
      <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Gestão de Alertas</h1>
            <p className="text-muted-foreground text-sm mt-1">Acompanhe e trate os alertas gerados pelo sistema.</p>
          </div>
        </div>
        <AlertManagement userId={session.id} role={session.role} />
      </main>
    </div>
  );
}
