import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '../components/common/DataTable';
import { Briefcase, UserCheck, Activity, AlertCircle, Coins, Camera, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { EvidenceViewerModal } from '../components/common/EvidenceViewerModal';
import axios from 'axios';

export const DashboardPage: React.FC = () => {
  const [gestiones, setGestiones] = useState<any[]>([]);
  const [selectedGestionForModal, setSelectedGestionForModal] = useState<any | null>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get('/api/gestiones');
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setGestiones(res.data.data);
      }
    } catch (e) {
      // Keep existing data
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 4000);
    return () => clearInterval(interval);
  }, []);

  const chartDataCuentas = [
    { name: 'KAVAK', cuentas: 4000 },
    { name: 'VENTO', cuentas: 3000 },
    { name: 'CLIP', cuentas: 2000 },
    { name: 'KONFÍO', cuentas: 2780 },
    { name: 'LAFIN', cuentas: 1890 },
  ];

  const chartDataGestiones = [
    { name: 'Lun', gestiones: 400 },
    { name: 'Mar', gestiones: 300 },
    { name: 'Mié', gestiones: 550 },
    { name: 'Jue', gestiones: 450 },
    { name: 'Vie', gestiones: 600 },
    { name: 'Sáb', gestiones: 200 },
    { name: 'Dom', gestiones: 50 },
  ];

  const chartDataExito = [
    { name: 'Exitoso', value: 74 },
    { name: 'No Exitoso', value: 26 },
  ];
  const COLORS = ['#D4AF37', '#64748B'];

  const fallbackGestiones = [
    { id: '1', cuenta: { identificador_externo: 'KVK-2918093', clienteProducto: { nombre: 'KAVAK' } }, comisionista: { nombre: 'Carlos Mendoza' }, resultado: 'Exitoso', hora: 'Hoy 14:30', codigo_cierre: 'Promesa de Pago' },
    { id: '2', cuenta: { identificador_externo: 'VNT-5075881', clienteProducto: { nombre: 'VENTO' } }, comisionista: { nombre: 'Carlos Mendoza' }, resultado: 'Exitoso', hora: 'Hoy 13:15', codigo_cierre: 'Recuperación de Garantía' },
    { id: '3', cuenta: { identificador_externo: 'CLP-12bd2c09', clienteProducto: { nombre: 'CLIP' } }, comisionista: { nombre: 'Héctor Valencia' }, resultado: 'No Exitoso', hora: 'Hoy 11:45', codigo_cierre: 'Local Cerrado' },
    { id: '4', cuenta: { identificador_externo: 'KNF-237000', clienteProducto: { nombre: 'KONFÍO' } }, comisionista: { nombre: 'Carlos Mendoza' }, resultado: 'Exitoso', hora: 'Hoy 10:20', codigo_cierre: 'One Shot 50%' },
  ];

  const dataSource = gestiones.length > 0 ? gestiones.slice(0, 5) : fallbackGestiones;

  const columns: Column<any>[] = [
    { 
      header: 'ID Cuenta', 
      accessor: 'cuenta', 
      render: (r) => <span className="font-mono text-slate-300 font-semibold">{r.cuenta?.identificador_externo || r.cuenta_id || 'ID-0000'}</span> 
    },
    { 
      header: 'Cliente', 
      accessor: 'cliente', 
      render: (r) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#141926] border border-gold-500/30 text-gold-300">
          {r.cuenta?.clienteProducto?.nombre || r.cliente || 'VENTO'}
        </span>
      )
    },
    { 
      header: 'Gestor de Campo', 
      accessor: 'comisionista',
      render: (r) => <span className="text-xs text-slate-200">🏃 {r.comisionista?.nombre || r.comisionista || 'Carlos Mendoza'}</span>
    },
    { 
      header: 'Resultado / Código', 
      accessor: 'resultado', 
      render: (row) => {
        const isExitoso = row.resultado === 'Exitoso' || row.codigo_cierre?.toLowerCase().includes('promesa') || row.codigo_cierre?.toLowerCase().includes('exitoso');
        return (
          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${isExitoso ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {row.codigo_cierre || row.resultado || 'Exitoso'}
          </span>
        );
      }
    },
    { 
      header: 'Evidencias', 
      accessor: 'evidencias',
      render: (r) => (
        <button
          onClick={() => setSelectedGestionForModal(r)}
          className="group flex items-center space-x-1.5 text-xs text-amber-300 hover:text-amber-200 font-mono bg-amber-950/40 hover:bg-amber-900/60 px-2 py-0.5 rounded-lg border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer"
          title="Haz clic para ver las fotos"
        >
          <Camera className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="underline underline-offset-2">
            {r.evidencias?.length || r.total_fotos || 1} Foto(s)
          </span>
          <Eye className="w-2.5 h-2.5 text-amber-400 opacity-75 group-hover:opacity-100" />
        </button>
      )
    },
    { 
      header: 'Hora Visita', 
      accessor: 'fecha_gestion',
      render: (r) => {
        const d = r.fecha_gestion ? new Date(r.fecha_gestion) : (r.createdAt ? new Date(r.createdAt) : null);
        return <span className="font-mono text-xs text-gold-300 font-bold">{d ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (r.hora || 'Ahora')}</span>;
      }
    },
  ];

  return (
    <div className="space-y-6">
      {/* Evidence Viewer Modal */}
      <EvidenceViewerModal
        isOpen={!!selectedGestionForModal}
        gestion={selectedGestionForModal}
        onClose={() => setSelectedGestionForModal(null)}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-xl font-semibold text-white">Dashboard Operativo</h1>
          <p className="text-xs text-slate-400">Monitoreo en vivo de carteras, asignaciones y gestiones de campo</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-emerald-400 font-mono bg-[#0E121B] px-3 py-1.5 rounded-lg border border-emerald-500/30 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5" />
            Sincronización en Tiempo Real Activa
          </span>
        </div>
      </div>

      {/* KPI Cards Minimalist */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-[#0E121B] p-4 rounded-xl border border-white/[0.07]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Cuentas</span>
            <Briefcase className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-2 font-mono">13,670</p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">5 Clientes Corporativos</span>
        </div>

        <div className="bg-[#0E121B] p-4 rounded-xl border border-white/[0.07]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Cuentas Asignadas</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2 font-mono">12,100</p>
          <span className="text-[11px] text-emerald-400 mt-0.5 block">88.5% Cobertura Activa</span>
        </div>

        <div className="bg-[#0E121B] p-4 rounded-xl border border-white/[0.07]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Bolsa de Recolección</span>
            <Coins className="w-4 h-4 text-gold-400" />
          </div>
          <p className="text-2xl font-bold text-gold-400 mt-2 font-mono">3 en Radar</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Comisión Promedio: $393 MXN</span>
        </div>

        <div className="bg-[#0E121B] p-4 rounded-xl border border-white/[0.07]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Visitas Transmitidas</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2 font-mono">{gestiones.length || 4}</p>
          <span className="text-[11px] text-emerald-400 mt-0.5 block">Transmitidas con GPS satelital</span>
        </div>
      </div>

      {/* Alerta de Cuentas sin Asignar */}
      <div className="p-3.5 rounded-xl bg-[#0E121B] border border-white/[0.07] flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 text-gold-400 mr-3 flex-shrink-0" />
          <p className="text-xs text-slate-300">
            <span className="text-white font-medium">1,570 cuentas pendientes de asignación.</span> Puedes lanzarlas a la bolsa dinámica para que los gestores las tomen por cercanía.
          </p>
        </div>
        <a href="/ofertas" className="text-xs font-medium text-navy-950 bg-gold-500 hover:bg-gold-400 px-3 py-1.5 rounded-lg transition-colors ml-4 flex-shrink-0">
          Ver Bolsa de Ofertas
        </a>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0E121B] p-5 rounded-xl border border-white/[0.07]">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Distribución por Cliente</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataCuentas}>
                <CartesianGrid strokeDasharray="2 2" stroke="#171E2D" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <RechartsTooltip contentStyle={{ background: '#0E121B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="cuentas" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0E121B] p-5 rounded-xl border border-white/[0.07]">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Gestiones Semanales</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartDataGestiones}>
                <CartesianGrid strokeDasharray="2 2" stroke="#171E2D" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <RechartsTooltip contentStyle={{ background: '#0E121B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="gestiones" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#0E121B] p-5 rounded-xl border border-white/[0.07] lg:col-span-1 flex flex-col items-center">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 w-full">Efectividad Global</h3>
          <div className="h-52 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartDataExito}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {chartDataExito.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ background: '#0E121B', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0E121B] p-5 rounded-xl border border-white/[0.07] lg:col-span-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Últimas Gestiones de Campo en Vivo</h3>
          <DataTable columns={columns} data={dataSource} />
        </div>
      </div>
    </div>
  );
};
