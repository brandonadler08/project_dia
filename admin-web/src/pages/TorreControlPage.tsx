import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '../components/common/DataTable';
import { Radio, MapPin } from 'lucide-react';

export const TorreControlPage: React.FC = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const gestionesHoy = [
    { id: '1', cuenta: 'KVK-2918093', cliente: 'KAVAK', comisionista: 'Carlos Mendoza', resultado: 'Exitoso', hora: '14:30', gps: '19.4085, -99.1628', comision: '$400 MXN', notas: 'Promesa de Pago para viernes 5' },
    { id: '2', cuenta: 'VNT-5075881', cliente: 'VENTO', comisionista: 'Carlos Mendoza', resultado: 'Exitoso', hora: '13:15', gps: '19.3824, -99.1698', comision: '$350 MXN', notas: 'Recuperación de motocicleta Falkon' },
    { id: '3', cuenta: 'CLP-12bd2c09', cliente: 'CLIP', comisionista: 'Juan Pérez', resultado: 'No Exitoso', hora: '11:45', gps: '19.4140, -99.1720', comision: '$0 MXN', notas: 'Local comercial cerrado con candado' },
    { id: '4', cuenta: 'KNF-237000', cliente: 'KONFÍO', comisionista: 'Carlos Mendoza', resultado: 'Exitoso', hora: '10:20', gps: '19.3905, -99.1860', comision: '$550 MXN', notas: 'Liquidación One Shot aceptada' },
  ];

  const columns: Column<any>[] = [
    { header: 'Hora', accessor: 'hora', render: (r) => <span className="font-mono text-gold-300 font-bold">{r.hora}</span> },
    { header: 'Contrato / ID', accessor: 'cuenta', render: (r) => <span className="font-mono text-white font-bold">{r.cuenta}</span> },
    { header: 'Cliente', accessor: 'cliente', render: (row) => (
      <span className="px-2 py-0.5 rounded text-xs font-bold bg-navy-800 border border-gold-500/30 text-gold-300">
        {row.cliente}
      </span>
    )},
    { header: 'Gestor en Campo', accessor: 'comisionista' },
    { header: 'Coordenadas GPS', accessor: 'gps', render: (r) => (
      <span className="text-[11px] text-slate-300 font-mono flex items-center">
        <MapPin className="w-3 h-3 text-gold-400 mr-1" />
        {r.gps}
      </span>
    )},
    { header: 'Comisión Generada', accessor: 'comision', render: (r) => (
      <span className="text-amber-300 font-mono font-bold">{r.comision}</span>
    )},
    { header: 'Resultado', accessor: 'resultado', render: (row) => (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
        row.resultado === 'Exitoso'
          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          : 'bg-red-500/20 text-red-300 border border-red-500/40'
      }`}>
        {row.resultado}
      </span>
    )},
    { header: 'Detalle de Gestión', accessor: 'notas' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-gold-500/20 shadow-2xl">
        <div className="flex items-center space-x-3">
          <Radio className="w-7 h-7 text-gold-400 animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Torre de Control Operativa</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Supervisión de cuadrilla en tiempo real, alertas de cobertura y recepción de visitas con geolocalización.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-navy-950/80 px-3 py-1.5 rounded-xl border border-gold-500/30 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
          <span className="text-gold-300 font-mono">Última actualización: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Cuentas Sin Gestor</span>
          <p className="text-3xl font-bold text-amber-300 mt-2 font-mono">1,570</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Disponibles para Bolsa de Recolección</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-blue-500/20">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Visitas Transmitidas Hoy</span>
          <p className="text-3xl font-bold text-white mt-2 font-mono">245</p>
          <span className="text-[11px] text-blue-400 mt-1 block">Georreferenciadas con GPS y fotos</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Tasa de Contacto Exitoso</span>
          <p className="text-3xl font-bold text-emerald-400 mt-2 font-mono">72.4%</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">Promesas y Recuperaciones</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gold-500/20">
          <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Comisiones Asignadas Hoy</span>
          <p className="text-3xl font-bold text-gold-300 mt-2 font-mono">$18,450 <span className="text-xs font-normal text-slate-400">MXN</span></p>
          <span className="text-[11px] text-gold-400/80 mt-1 block">Pagos e incentivos devengados</span>
        </div>
      </div>

      {/* Feed en vivo */}
      <div className="glass-panel p-5 rounded-2xl border border-gold-500/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <span className="relative flex h-3 w-3 mr-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          Monitor en Vivo: Feed de Gestiones de Campo
        </h3>
        <DataTable columns={columns} data={gestionesHoy} />
      </div>
    </div>
  );
};
