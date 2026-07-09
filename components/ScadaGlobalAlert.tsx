'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { AlertTriangle, VolumeX, Volume2, ShieldAlert } from 'lucide-react';

interface ScadaGlobalAlertProps {
  count: number;
  userRole?: string;
}

export default function ScadaGlobalAlert({ count, userRole }: ScadaGlobalAlertProps) {
  const [muted, setMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  
  // Flag to know if user interacted with the page (required by browsers for AudioContext)
  const [canPlayAudio, setCanPlayAudio] = useState(false);

  useEffect(() => {
    const handleInteraction = () => setCanPlayAudio(true);
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  const playBeep = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz piercing tone

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }, []);

  const stopAudioLoop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPlayingRef.current = false;
  }, []);

  const startAudioLoop = useCallback(() => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    
    // Play immediately, then loop
    playBeep();
    intervalRef.current = setInterval(() => {
      playBeep();
    }, 1000); // 1 beep per second
  }, [playBeep]);

  useEffect(() => {
    if (count > 0 && canPlayAudio && !muted) {
      startAudioLoop();
    } else {
      stopAudioLoop();
    }

    return () => {
      stopAudioLoop();
    };
  }, [count, muted, canPlayAudio, startAudioLoop, stopAudioLoop]);

  useEffect(() => {
    // Mock for static demo: no-op
  }, [count]);

  if (count === 0) return null;

  return (
    <>
      <style>{`
        @keyframes scada-flash-border {
          0%, 100% { box-shadow: inset 0 0 0 0px rgba(239, 68, 68, 0); }
          50% { box-shadow: inset 0 0 30px 10px rgba(239, 68, 68, 0.8); }
        }
        @keyframes scada-flash-bg {
          0%, 100% { background-color: rgba(239, 68, 68, 0.95); }
          50% { background-color: rgba(185, 28, 28, 1); }
        }
        .scada-screen-border {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9998;
          animation: scada-flash-border 1.5s infinite ease-in-out;
        }
        .scada-banner {
          animation: scada-flash-bg 1s infinite ease-in-out;
        }
      `}</style>
      
      {/* Flashing screen border */}
      <div className="scada-screen-border" />

      {/* Persistent Bottom Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] shadow-2xl">
        <div className="scada-banner flex flex-col sm:flex-row items-center justify-between px-6 py-3 text-white border-t-4 border-yellow-400">
          
          <div className="flex items-center gap-4 flex-1">
            <div className="bg-yellow-400 p-2 rounded text-red-900 animate-pulse">
              <AlertTriangle className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-widest uppercase text-yellow-400 drop-shadow-md flex items-center gap-2">
                Atenção - Sistema em Falha
              </h2>
              <p className="text-sm font-bold text-red-100 uppercase tracking-wide">
                {count} {count === 1 ? 'Alerta Crítico Não Reconhecido' : 'Alertas Críticos Não Reconhecidos'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            {userRole === 'admin' && (
              <button
                onClick={() => setMuted(!muted)}
                className="flex items-center gap-2 px-4 py-2 bg-red-950/40 hover:bg-red-950/60 border border-red-900 rounded font-bold uppercase text-xs tracking-wider transition-colors"
                title={muted ? "Ativar som" : "Silenciar alarme"}
              >
                {muted ? <VolumeX className="h-4 w-4 text-gray-300" /> : <Volume2 className="h-4 w-4 text-white animate-pulse" />}
                {muted ? 'Silenciado' : 'Silenciar'}
              </button>
            )}
            
            <Link 
              href="/alertas"
              className="flex items-center gap-2 px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-red-950 rounded font-black uppercase tracking-wider shadow-lg transition-transform active:scale-95"
            >
              <ShieldAlert className="h-5 w-5" />
              Reconhecer Alertas
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
