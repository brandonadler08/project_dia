import React from 'react';
import { DataTable, Column } from '../components/common/DataTable';
import { Briefcase, UserCheck, Activity, AlertCircle, Coins } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const DashboardPage: React.FC = () => {
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
    { name: 'Exitoso', value: 72 },
    { name: 'No Exitoso', value: 28 },
  ];
  const COLORS = ['#D4AF37', '#64748B'];

  const ultimasGestiones = [
    { id: '1', cuenta: 'KVK-2918093', cliente: 'KAVAK', comisionista: 'Carlos Mendoza', resultado: 'Exitoso', fecha: 'Hoy 14:30', comision: '$400' },
    { id: '2', cuenta: 'VNT-5075881', cliente: 'VENTO', comisionista: 'Carlos Mendoza', resultado: 'Exitoso', fecha: 'Hoy 13:15', comision: '$350' },
    { id: '3', cuenta: 'CLP-12bd2c09', cliente: 'CLIP', comisionista: 'Juan Pérez', resultado: 'No Exitoso', fecha: 'Hoy 11:45', comision: '$300' },
    { id: '4', cuenta: 'KNF-237000', cliente: 'KONFÍO', comisionista: 'Carlos Mendoza', resultado: 'Exitoso', fecha: 'Hoy 10:20', comision: '$550' },
  ];

  const columns: Column<typeof ultimasGestiones[0]>[] = [
    { header: 'ID Cuenta', accessor: 'cuenta', render: (r) => <span className="font-mono text-slate-300 font-semibold">{r.cuenta}</span> },
    { header: 'Cliente', accessor: 'cliente', render: (row) => (
      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#141926] border border-white/[0.08] text-slate-300">
        {row.cliente}
      </span>
    )},
    { header: 'Gestor de Campo', accessor: 'comisionista' },
    { header: 'Comisión Generada', accessor: 'comision', render: (r) => <span className="text-gold-400 font-mono font-medium">{r.comision} MXN</span> },
    { header: 'Resultado', accessor: 'resultado', render: (row) => (
      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${row.resultado === 'Exitoso' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
        {row.resultado}
      </span>
    )},
    { header: 'Hora Visita', accessor: 'fecha' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-xl font-semibold text-white">Dashboard Operativo</h1>
          <p className="text-xs text-slate-400">Monitoreo de carteras, asignaciones y gestiones de campo</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400 font-mono bg-[#0E121B] px-3 py-1.5 rounded-lg border border-white/[0.08]">
            Actualización en vivo
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
            <span className="text-xs font-medium text-slate-400">Gestiones Hoy</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2 font-mono">245</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">72% Tasa de Contacto</span>
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
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Últimas Gestiones de Campo</h3>
          <DataTable columns={columns} data={ultimasGestiones} />
        </div>
      </div>
    </div>
  );
};
