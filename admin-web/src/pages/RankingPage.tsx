import React, { useState } from 'react';
import { DataTable, Column } from '../components/common/DataTable';
import { Trophy, Medal, Flame, Target } from 'lucide-react';

interface GestorRanking {
  posicion: number;
  id: string;
  nombre: string;
  zona: string;
  visitasCompletadas: number;
  efectividadPorcentaje: number;
  montoRecuperado: number;
  comisionesGanadas: number;
  nivel: 'Oro' | 'Plata' | 'Bronce';
  rachaDias: number;
  fotoEmoji: string;
}

export const RankingPage: React.FC = () => {
  const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'historico'>('semana');

  const rankingData: GestorRanking[] = [
    {
      posicion: 1,
      id: 'COM-0001',
      nombre: 'Carlos Mendoza Cruz',
      zona: 'Benito Juárez / Cuauhtémoc',
      visitasCompletadas: 48,
      efectividadPorcentaje: 87.5,
      montoRecuperado: 485200.00,
      comisionesGanadas: 18450.00,
      nivel: 'Oro',
      rachaDias: 12,
      fotoEmoji: '🥇',
    },
    {
      posicion: 2,
      id: 'COM-0004',
      nombre: 'Héctor Valencia Ruiz',
      zona: 'Miguel Hidalgo / Naucalpan',
      visitasCompletadas: 42,
      efectividadPorcentaje: 83.3,
      montoRecuperado: 392100.00,
      comisionesGanadas: 15800.00,
      nivel: 'Oro',
      rachaDias: 9,
      fotoEmoji: '🥈',
    },
    {
      posicion: 3,
      id: 'COM-0002',
      nombre: 'María Elena López Morales',
      zona: 'Guadalajara / Zapopan',
      visitasCompletadas: 39,
      efectividadPorcentaje: 79.5,
      montoRecuperado: 310450.00,
      comisionesGanadas: 13900.00,
      nivel: 'Plata',
      rachaDias: 7,
      fotoEmoji: '🥉',
    },
    {
      posicion: 4,
      id: 'COM-0005',
      nombre: 'Alejandro Domínguez Silva',
      zona: 'Coyoacán / Tlalpan',
      visitasCompletadas: 34,
      efectividadPorcentaje: 73.5,
      montoRecuperado: 245000.00,
      comisionesGanadas: 11200.00,
      nivel: 'Plata',
      rachaDias: 5,
      fotoEmoji: '🏃',
    },
    {
      posicion: 5,
      id: 'COM-0003',
      nombre: 'Roberto Gómez Garza',
      zona: 'Monterrey / San Pedro',
      visitasCompletadas: 28,
      efectividadPorcentaje: 67.8,
      montoRecuperado: 198300.00,
      comisionesGanadas: 8900.00,
      nivel: 'Bronce',
      rachaDias: 3,
      fotoEmoji: '🚶',
    },
  ];

  const columns: Column<GestorRanking>[] = [
    { header: 'Posición', accessor: 'posicion', render: (row) => (
      <div className="flex items-center space-x-2">
        <span className="text-base">{row.fotoEmoji}</span>
        <span className={`font-mono font-black text-sm ${row.posicion === 1 ? 'text-gold-400' : row.posicion === 2 ? 'text-slate-200' : row.posicion === 3 ? 'text-amber-600' : 'text-slate-400'}`}>
          #{row.posicion}
        </span>
      </div>
    )},
    { header: 'Gestor de Campo', accessor: 'nombre', render: (row) => (
      <div className="flex flex-col">
        <div className="flex items-center space-x-1.5">
          <span className="font-bold text-white text-xs">{row.nombre}</span>
          <span className="font-mono text-[10px] text-slate-400">({row.id})</span>
        </div>
        <span className="text-[11px] text-slate-400">{row.zona}</span>
      </div>
    )},
    { header: 'Visitas Completadas', accessor: 'visitasCompletadas', render: (row) => (
      <div className="flex items-center space-x-1 font-mono font-bold text-slate-100">
        <Target className="w-3.5 h-3.5 text-gold-400" />
        <span>{row.visitasCompletadas}</span>
      </div>
    )},
    { header: 'Efectividad', accessor: 'efectividadPorcentaje', render: (row) => (
      <div className="flex flex-col w-24">
        <span className="text-emerald-400 font-bold font-mono text-xs">{row.efectividadPorcentaje}%</span>
        <div className="w-full h-1.5 bg-[#10182E] rounded-full overflow-hidden mt-1 border border-gold-500/20">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${row.efectividadPorcentaje}%` }} />
        </div>
      </div>
    )},
    { header: 'Monto Recuperado', accessor: 'montoRecuperado', render: (row) => (
      <span className="font-mono font-bold text-white text-xs">
        ${row.montoRecuperado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
      </span>
    )},
    { header: 'Comisiones Ganadas', accessor: 'comisionesGanadas', render: (row) => (
      <span className="font-mono font-bold text-gold-400 text-xs bg-gold-500/10 px-2.5 py-1 rounded-md border border-gold-500/30">
        + ${row.comisionesGanadas.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
      </span>
    )},
    { header: 'Racha Activa', accessor: 'rachaDias', render: (row) => (
      <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
        <Flame className="w-3 h-3 text-amber-400 mr-1 animate-pulse" />
        {row.rachaDias} días
      </div>
    )},
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-[#131E3A] p-5 rounded-2xl border border-gold-500/20 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Ranking & Tabla de Rendimiento de Gestores</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Incentivo de competencia laboral: avance en tiempo real, recuperaciones efectivas y comisiones acumuladas.
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center bg-[#10182E] p-1 rounded-xl border border-gold-500/30 text-xs">
          <button
            onClick={() => setPeriodo('semana')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${periodo === 'semana' ? 'bg-gold-500 text-navy-950 shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            Semana Actual
          </button>
          <button
            onClick={() => setPeriodo('mes')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${periodo === 'mes' ? 'bg-gold-500 text-navy-950 shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            Mes en Curso
          </button>
          <button
            onClick={() => setPeriodo('historico')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${periodo === 'historico' ? 'bg-gold-500 text-navy-950 shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            Histórico Anual
          </button>
        </div>
      </div>

      {/* Podium Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 2nd Place */}
        <div className="bg-[#131E3A] p-5 rounded-2xl border border-slate-400/30 shadow-md flex flex-col items-center text-center relative order-2 md:order-1">
          <div className="w-8 h-8 rounded-full bg-slate-400/20 border border-slate-300 flex items-center justify-center text-slate-200 font-bold text-xs mb-2">
            🥈 2°
          </div>
          <h3 className="font-bold text-white text-sm">{rankingData[1].nombre}</h3>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{rankingData[1].zona}</p>
          
          <div className="w-full bg-[#10182E] rounded-xl p-3 mt-3 border border-slate-400/20 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Comisiones:</span>
              <span className="font-mono font-bold text-slate-200">+${rankingData[1].comisionesGanadas.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Efectividad:</span>
              <span className="font-mono font-bold text-emerald-400">{rankingData[1].efectividadPorcentaje}%</span>
            </div>
          </div>
        </div>

        {/* 1st Place - Champion */}
        <div className="bg-[#131E3A] p-6 rounded-2xl border-2 border-gold-500 shadow-xl flex flex-col items-center text-center relative order-1 md:order-2 transform md:-translate-y-2 bg-gradient-to-b from-[#1A274B] to-[#131E3A]">
          <div className="w-10 h-10 rounded-full bg-gold-500/20 border-2 border-gold-400 flex items-center justify-center text-gold-300 font-black text-sm mb-2 shadow-[0_0_15px_rgba(212,163,59,0.4)]">
            👑 1°
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-400 mb-0.5">LÍDER DE CAMPO ACTUAL</span>
          <h3 className="font-black text-white text-base">{rankingData[0].nombre}</h3>
          <p className="text-xs text-slate-300 font-mono mt-0.5">{rankingData[0].zona}</p>
          
          <div className="w-full bg-[#10182E] rounded-xl p-3.5 mt-3.5 border border-gold-500/40 grid grid-cols-2 gap-2 text-xs shadow-inner">
            <div>
              <span className="text-[10px] text-gold-400 font-semibold block">Comisiones Ganadas:</span>
              <span className="font-mono font-black text-gold-300 text-sm">+${rankingData[0].comisionesGanadas.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Efectividad Global:</span>
              <span className="font-mono font-black text-emerald-400 text-sm">{rankingData[0].efectividadPorcentaje}%</span>
            </div>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="bg-[#131E3A] p-5 rounded-2xl border border-amber-600/30 shadow-md flex flex-col items-center text-center relative order-3">
          <div className="w-8 h-8 rounded-full bg-amber-600/20 border border-amber-500 flex items-center justify-center text-amber-300 font-bold text-xs mb-2">
            🥉 3°
          </div>
          <h3 className="font-bold text-white text-sm">{rankingData[2].nombre}</h3>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{rankingData[2].zona}</p>
          
          <div className="w-full bg-[#10182E] rounded-xl p-3 mt-3 border border-amber-600/20 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Comisiones:</span>
              <span className="font-mono font-bold text-slate-200">+${rankingData[2].comisionesGanadas.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Efectividad:</span>
              <span className="font-mono font-bold text-emerald-400">{rankingData[2].efectividadPorcentaje}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-[#131E3A] p-5 rounded-2xl border border-gold-500/20 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center">
          <Medal className="w-4 h-4 text-gold-400 mr-2" />
          Tabla General de Posiciones & Rendimiento
        </h3>
        <DataTable columns={columns} data={rankingData} />
      </div>
    </div>
  );
};
