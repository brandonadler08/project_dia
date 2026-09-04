import React, { useState } from 'react';
import { DataTable, Column } from '../components/common/DataTable';
import { FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReportesPage: React.FC = () => {
  const [cliente, setCliente] = useState('');
  const [fechaInicio, setFechaInicio] = useState('2026-09-01');
  const [fechaFin, setFechaFin] = useState('2026-09-02');

  const data = [
    { fecha: '2026-09-02 14:30', cuenta: 'KVK-2918093', titular: 'Marco Antonio Salazar Rodríguez', cliente: 'KAVAK', comisionista: 'Carlos Mendoza Cruz', resultado: 'Exitoso', codigo: 'Promesa de Pago', comision: '$400 MXN', notas: 'Pagará $12,500 este viernes' },
    { fecha: '2026-09-02 13:15', cuenta: 'VNT-5075881', titular: 'José Antonio Solís Sánchez', cliente: 'VENTO', comisionista: 'Carlos Mendoza Cruz', resultado: 'Exitoso', codigo: 'Dación / Recuperación', comision: '$350 MXN', notas: 'Recuperación moto Falkon con video' },
    { fecha: '2026-09-02 11:45', cuenta: 'CLP-12bd2c09', titular: 'Axel Joaquín Osorio Peña', cliente: 'CLIP', comisionista: 'Juan Pérez', resultado: 'No Exitoso', codigo: 'No Localizado', comision: '$0 MXN', notas: 'Local cerrado' },
    { fecha: '2026-09-02 10:20', cuenta: 'KNF-237000', titular: 'Sergio Pablo Castañeda Anaya', cliente: 'KONFÍO', comisionista: 'Carlos Mendoza Cruz', resultado: 'Exitoso', codigo: 'Promesa de Pago', comision: '$550 MXN', notas: 'Liquidación One Shot 50% desc.' },
    { fecha: '2026-09-01 16:40', cuenta: 'LAF-914.8831', titular: 'Marisol Cruz Sánchez', cliente: 'LAFIN', comisionista: 'Carlos Mendoza Cruz', resultado: 'Exitoso', codigo: 'Contacto Exitoso', comision: '$300 MXN', notas: 'Pago en OXXO registrado' },
  ];

  const columns: Column<typeof data[0]>[] = [
    { header: 'Fecha / Hora', accessor: 'fecha', render: (r) => <span className="font-mono text-slate-300">{r.fecha}</span> },
    { header: 'ID Contrato', accessor: 'cuenta', render: (r) => <span className="font-mono text-gold-300 font-bold">{r.cuenta}</span> },
    { header: 'Titular', accessor: 'titular', render: (r) => <span className="font-semibold text-white">{r.titular}</span> },
    { header: 'Cliente', accessor: 'cliente', render: (row) => (
      <span className="px-2 py-0.5 rounded text-xs font-bold bg-navy-800 border border-gold-500/30 text-gold-300">
        {row.cliente}
      </span>
    )},
    { header: 'Gestor', accessor: 'comisionista' },
    { header: 'Resultado', accessor: 'resultado', render: (row) => (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
        row.resultado === 'Exitoso'
          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          : 'bg-red-500/20 text-red-300 border border-red-500/40'
      }`}>
        {row.resultado}
      </span>
    )},
    { header: 'Código Cierre', accessor: 'codigo' },
    { header: 'Comisión Devengada', accessor: 'comision', render: (r) => <span className="font-mono text-amber-300 font-bold">{r.comision}</span> },
  ];

  const handleExport = () => {
    toast.success('Generando y descargando reporte consolidado en Excel...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-gold-500/20 shadow-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Reportes y Cierres Operativos</h1>
          <p className="text-xs text-slate-300 mt-1">
            Exportación de bitácoras de gestión, liquidación de comisiones a gestores y métricas de recuperación por cliente.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold text-navy-950 bg-gold-gradient hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
        >
          <FileSpreadsheet className="w-4 h-4 mr-1.5 text-navy-950" />
          Exportar a Excel (.xlsx)
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-5 rounded-2xl border border-gold-500/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-gold-400 font-semibold uppercase mb-1.5">Cliente / Cartera</label>
            <select
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className="w-full bg-navy-950/90 border border-gold-500/30 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-gold-400"
            >
              <option value="">-- Todos los Clientes --</option>
              <option value="KAVAK">KAVAK (Autos)</option>
              <option value="VENTO">VENTO (Motos)</option>
              <option value="CLIP">CLIP (Terminales)</option>
              <option value="KONFÍO">KONFÍO (PyME)</option>
              <option value="LAFIN">LAFIN (Motos)</option>
            </select>
          </div>

          <div>
            <label className="block text-gold-400 font-semibold uppercase mb-1.5">Fecha Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full bg-navy-950/90 border border-gold-500/30 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-gold-400 font-semibold uppercase mb-1.5">Fecha Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full bg-navy-950/90 border border-gold-500/30 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-gold-400 font-semibold uppercase mb-1.5">Comisionista / Gestor</label>
            <select
              className="w-full bg-navy-950/90 border border-gold-500/30 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-gold-400"
            >
              <option value="">-- Todos los Gestores --</option>
              <option value="1">Carlos Mendoza Cruz</option>
              <option value="2">María Elena López</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel p-5 rounded-2xl border border-gold-500/20">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};
