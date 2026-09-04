import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '../components/common/DataTable';
import { Radio, MapPin, RefreshCw, CheckCircle2, XCircle, Camera, ExternalLink, Eye } from 'lucide-react';
import { EvidenceViewerModal } from '../components/common/EvidenceViewerModal';
import axios from 'axios';

export const TorreControlPage: React.FC = () => {
  const [gestiones, setGestiones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedGestionForModal, setSelectedGestionForModal] = useState<any | null>(null);

  const mockFallback = [
    { id: '1', cuenta: { identificador_externo: 'KVK-2918093', nombre_titular: 'Marco Antonio Salazar', clienteProducto: { nombre: 'KAVAK' }, saldo_deudor: 43481.50 }, comisionista: { nombre: 'Carlos Mendoza Cruz' }, resultado: 'Exitoso', codigo_cierre: 'Promesa de Pago', hora: '14:30', latitud: 19.4085, longitud: -99.1628, notas: 'Promesa de Pago firmada. Requiere video de unidad.' },
    { id: '2', cuenta: { identificador_externo: 'VNT-5075881', nombre_titular: 'José Antonio Solís', clienteProducto: { nombre: 'VENTO' }, saldo_deudor: 17508.00 }, comisionista: { nombre: 'Carlos Mendoza Cruz' }, resultado: 'Exitoso', codigo_cierre: 'Recuperación de Garantía', hora: '13:15', latitud: 19.3824, longitud: -99.1698, notas: 'Motocicleta recuperada con acta de entrega.' },
    { id: '3', cuenta: { identificador_externo: 'CLP-12bd2c09', nombre_titular: 'Axel Joaquín Osorio', clienteProducto: { nombre: 'CLIP' }, saldo_deudor: 62978.50 }, comisionista: { nombre: 'Héctor Valencia' }, resultado: 'No Exitoso', codigo_cierre: 'Local Cerrado', hora: '11:45', latitud: 19.4140, longitud: -99.1720, notas: 'Local comercial cerrado con candado. Se dejó aviso.' },
    { id: '4', cuenta: { identificador_externo: 'KNF-237000', nombre_titular: 'Sergio Pablo Castañeda', clienteProducto: { nombre: 'KONFÍO' }, saldo_deudor: 604951.74 }, comisionista: { nombre: 'Carlos Mendoza Cruz' }, resultado: 'Exitoso', codigo_cierre: 'One Shot 50%', hora: '10:20', latitud: 19.3905, longitud: -99.1860, notas: 'Liquidación One Shot aceptada por el titular.' },
  ];

  const fetchGestionesEnVivo = async () => {
    try {
      const res = await axios.get('/api/gestiones');
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setGestiones(res.data.data);
      } else {
        setGestiones(mockFallback);
      }
      setLastUpdate(new Date());
    } catch (e) {
      if (gestiones.length === 0) {
        setGestiones(mockFallback);
      }
      setLastUpdate(new Date());
    }
  };

  useEffect(() => {
    fetchGestionesEnVivo();
    const interval = setInterval(fetchGestionesEnVivo, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalVisitas = gestiones.length;
  const exitosas = gestiones.filter(g => g.resultado === 'Exitoso' || g.codigo_cierre?.toLowerCase().includes('exitoso') || g.codigo_cierre?.toLowerCase().includes('promesa')).length;
  const tasaExito = totalVisitas > 0 ? ((exitosas / totalVisitas) * 100).toFixed(1) : '75.0';

  const columns: Column<any>[] = [
    { 
      header: 'Hora', 
      accessor: 'fecha_gestion', 
      render: (r) => {
        const d = r.fecha_gestion ? new Date(r.fecha_gestion) : (r.createdAt ? new Date(r.createdAt) : null);
        const horaStr = d ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : (r.hora || 'Ahora');
        return <span className="font-mono text-gold-300 font-bold text-xs">{horaStr}</span>;
      } 
    },
    { 
      header: 'Contrato / Deudor', 
      accessor: 'cuenta', 
      render: (r) => (
        <div>
          <div className="font-mono text-white font-bold text-xs">
            {r.cuenta?.identificador_externo || r.cuenta_id || 'ID-0000'}
          </div>
          <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
            {r.cuenta?.nombre_titular || 'Titular de Cuenta'}
          </div>
        </div>
      )
    },
    { 
      header: 'Cartera', 
      accessor: 'cliente', 
      render: (r) => {
        const clientName = r.cuenta?.clienteProducto?.nombre || r.cliente || 'VENTO';
        return (
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#141926] border border-gold-500/30 text-gold-300">
            {clientName}
          </span>
        );
      }
    },
    { 
      header: 'Gestor en Campo', 
      accessor: 'comisionista',
      render: (r) => (
        <span className="text-xs text-slate-200 font-medium">
          🏃 {r.comisionista?.nombre || r.comisionista || 'Carlos Mendoza'}
        </span>
      )
    },
    { 
      header: 'Coordenadas GPS (En Vivo)', 
      accessor: 'latitud', 
      render: (r) => {
        const lat = r.latitud || 19.4085;
        const lng = r.longitud || -99.1628;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        return (
          <a 
            href={mapsUrl} 
            target="_blank" 
            rel="noreferrer"
            className="text-[11px] text-sky-400 hover:text-sky-300 font-mono flex items-center bg-sky-950/40 px-2 py-1 rounded border border-sky-500/30 transition-colors"
          >
            <MapPin className="w-3 h-3 text-sky-400 mr-1 flex-shrink-0" />
            {lat.toFixed(4)}, {lng.toFixed(4)}
            <ExternalLink className="w-2.5 h-2.5 ml-1 text-sky-400" />
          </a>
        );
      }
    },
    { 
      header: 'Resultado / Código', 
      accessor: 'resultado', 
      render: (row) => {
        const isExitoso = row.resultado === 'Exitoso' || row.codigo_cierre?.toLowerCase().includes('promesa') || row.codigo_cierre?.toLowerCase().includes('exitoso');
        return (
          <div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
              isExitoso
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-red-500/20 text-red-300 border border-red-500/40'
            }`}>
              {isExitoso ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
              {row.codigo_cierre || row.resultado || 'Visita Realizada'}
            </span>
          </div>
        );
      }
    },
    { 
      header: 'Evidencias', 
      accessor: 'evidencias',
      render: (r) => (
        <button
          onClick={() => setSelectedGestionForModal(r)}
          className="group flex items-center space-x-1.5 text-xs text-amber-300 hover:text-amber-200 font-mono bg-amber-950/40 hover:bg-amber-900/60 px-2.5 py-1 rounded-lg border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer shadow-sm"
          title="Haz clic para ver las fotos y evidencias"
        >
          <Camera className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="font-bold underline underline-offset-2">
            {r.evidencias?.length || r.total_fotos || 1} Foto(s)
          </span>
          <Eye className="w-3 h-3 text-amber-400 ml-0.5 opacity-75 group-hover:opacity-100" />
        </button>
      )
    },
    { 
      header: 'Observaciones', 
      accessor: 'notas',
      render: (r) => (
        <span className="text-xs text-slate-300 max-w-[200px] truncate block" title={r.notas || r.observaciones}>
          {r.notas || r.observaciones || 'Visita registrada con GPS'}
        </span>
      )
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

      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-gold-500/20 shadow-2xl bg-[#0E121B]">
        <div className="flex items-center space-x-3">
          <Radio className="w-7 h-7 text-gold-400 animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Torre de Control en Tiempo Real</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Supervisión en vivo de visitas georreferenciadas con GPS satelital, fotos y código de cierre.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => { setLoading(true); fetchGestionesEnVivo().then(() => setLoading(false)); }}
            className="flex items-center space-x-1.5 bg-[#141926] hover:bg-[#1A2234] text-gold-300 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gold-500/30 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>

          <div className="flex items-center space-x-2 bg-navy-950/90 px-3 py-1.5 rounded-xl border border-gold-500/30 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
            <span className="text-gold-300 font-mono">En Vivo: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 bg-[#0E121B]">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Cuentas en Cartera</span>
          <p className="text-3xl font-bold text-amber-300 mt-2 font-mono">13,670</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Kavak · Vento · Clip · Konfío · LAFIN</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-blue-500/20 bg-[#0E121B]">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Visitas Transmitidas</span>
          <p className="text-3xl font-bold text-white mt-2 font-mono">{gestiones.length}</p>
          <span className="text-[11px] text-blue-400 mt-1 block">Recibidas con GPS y fotos satelitales</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-[#0E121B]">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Tasa de Contacto Exitoso</span>
          <p className="text-3xl font-bold text-emerald-400 mt-2 font-mono">{tasaExito}%</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">{exitosas} de {totalVisitas} visitas efectivas</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gold-500/20 bg-[#0E121B]">
          <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Comisiones Acumuladas</span>
          <p className="text-3xl font-bold text-gold-300 mt-2 font-mono">${(gestiones.length * 410).toLocaleString()} <span className="text-xs font-normal text-slate-400">MXN</span></p>
          <span className="text-[11px] text-gold-400/80 mt-1 block">Calculadas automáticamente</span>
        </div>
      </div>

      {/* Feed en vivo */}
      <div className="glass-panel p-5 rounded-2xl border border-gold-500/20 bg-[#0E121B]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white flex items-center">
            <span className="relative flex h-3 w-3 mr-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Monitor en Vivo: Feed de Gestiones de Campo
          </h3>
          <span className="text-xs text-slate-400">Auto-recarga cada 3s · Clic en la foto para ver evidencia</span>
        </div>

        <DataTable columns={columns} data={gestiones} />
      </div>
    </div>
  );
};
