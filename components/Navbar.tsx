'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BatteryCharging, LayoutDashboard, Settings, Users, LogOut, Bell, ShieldAlert, FileText, Loader2, Menu, X } from 'lucide-react';
import ScadaGlobalAlert from './ScadaGlobalAlert';

interface NavbarProps {
  user: {
    username: string;
    role: 'admin' | 'gestor' | 'tecnico';
  };
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [alertasNaoReconhecidos, setAlertasNaoReconhecidos] = useState(0);
  const [alertasReconhecidos, setAlertasReconhecidos] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchAlertas = async () => {
      // Mock for static demo
      setAlertasNaoReconhecidos(1);
      setAlertasReconhecidos(1);
    };

    fetchAlertas();
    const interval = setInterval(fetchAlertas, 10000); // Poll every 10s
    window.addEventListener('alertStatusChanged', fetchAlertas);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('alertStatusChanged', fetchAlertas);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      router.push('/login');
      router.refresh();
    }, 500);
  };

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'gestor', 'tecnico'],
    },
    {
      name: 'Repetidoras',
      href: '/repetidoras',
      icon: BatteryCharging,
      roles: ['admin', 'gestor'],
    },
    {
      name: 'Contratos',
      href: '/contratos',
      icon: FileText,
      roles: ['admin', 'gestor'],
    },
    {
      name: 'Usuários',
      href: '/usuarios',
      icon: Users,
      roles: ['admin'],
    },
  ];

  const filteredMenu = menuItems.filter((item) => item.roles.includes(user.role));

  const roleLabels = {
    admin: 'Administrador',
    gestor: 'Gestor',
    tecnico: 'Técnico',
  };

  const roleColors = {
    admin: 'bg-red-500/10 text-red-400 border border-red-500/20',
    gestor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    tecnico: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  };

  return (
    <>
      <ScadaGlobalAlert count={alertasNaoReconhecidos} userRole={user.role} />
      <nav className="glass border-b border-border sticky top-0 z-50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity">
            <BatteryCharging className="h-6 w-6 stroke-[2.5]" />
            <span className="font-bold text-lg tracking-wider text-foreground">EMPRESA <span className="text-primary font-normal">Supervisório</span></span>
          </Link>

          {/* Menu Items (Desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <Link href="/alertas" className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors bg-card/50">
            <Bell className="h-4 w-4" />
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className={`flex items-center justify-center min-w-[20px] h-[20px] rounded-full px-1.5 gap-1 ${alertasNaoReconhecidos > 0 ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse' : 'bg-muted text-muted-foreground'}`} title="Não Reconhecidos">
                {alertasNaoReconhecidos}
                <span className="hidden lg:inline text-[10px]">Não Reconhecidos</span>
              </span>
              <span className={`flex items-center justify-center min-w-[20px] h-[20px] rounded-full px-1.5 gap-1 ${alertasReconhecidos > 0 ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground'}`} title="Reconhecidos">
                {alertasReconhecidos}
                <span className="hidden lg:inline text-[10px]">Reconhecidos</span>
              </span>
            </div>
          </Link>

          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground">{user.username}</p>
            <span className={`inline-block text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full mt-1 ${roleColors[user.role]}`}>
              {roleLabels[user.role]}
            </span>
          </div>

          <div className="h-8 w-px bg-border hidden sm:block"></div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all border border-transparent hover:border-rose-500/20 disabled:opacity-50"
            title="Sair do sistema"
          >
            {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            <span className="hidden sm:inline">Sair</span>
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-b border-border shadow-xl absolute w-full z-40 animate-in slide-in-from-top-2">
          <div className="p-4 flex flex-col gap-2">
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
