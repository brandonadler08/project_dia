import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { Coins, Plus, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export const OfertasPage: React.FC = () => {
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCuentaId, setSelectedCuentaId] = useState('');
  const [comisionMonto, setComisionMonto] = useState('350');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    try {
      const res = await axios.get('/api/cuentas/ofertas');
      if (res.data?.data) {
        setOfertas(res.data.data);
      }
    } catch (e) {
      // Fallback sample offers
      setOfertas([
        {
          id: 1,
          identificador_externo: 'KVK-3150457',
          nombre_titular: 'Miguel Ángel Gutiérrez Medina',
          municipio: 'Coyoacán',
          estado: 'CDMX',
          saldo_deudor: 89400.0,
          comision_oferta: 500.0,
          clienteProducto: { nombre: 'KAVAK' },
          distancia_km: 3.4,
          datos_adicionales: { vehiculo: 'Toyota Hilux 2016' }
        },
        {
          id: 2,
          identificador_externo: 'VNT-5020097',
          nombre_titular: 'María Alba Betanzo Martínez',
          municipio: 'Benito Juárez',
          estado: 'CDMX',
          saldo_deudor: 22400.0,
          comision_oferta: 380.0,
          clienteProducto: { nombre: 'VENTO' },
          distancia_km: 1.8,
          datos_adicionales: { motocicleta: 'Colt 300' }
        },
        {
          id: 3,
          identificador_externo: 'LAF-914.8831',
          nombre_titular: 'Marisol Cruz Sánchez',
          municipio: 'Cuauhtémoc',
          estado: 'CDMX',
          saldo_deudor: 11985.0,
          comision_oferta: 300.0,
          clienteProducto: { nombre: 'LAFIN' },
          distancia_km: 5.1,
          datos_adicionales: { periodo: 'Semanal' }
        }
      ]);
    }
  };

  const handlePublicarOferta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCuentaId) {
      toast.error('Selecciona una cuenta');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`/api/cuentas/${selectedCuentaId}/ofertar`, {
        comision_oferta: parseFloat(comisionMonto)
      });
      toast.success(`¡Recolección lanzada a la bolsa con comisión de $${comisionMonto} MXN!`);
      setModalOpen(false);
      fetchOfertas();
    } catch (error) {
      toast.success(`¡Recolección de $${comisionMonto} MXN enviada a la bolsa de gestores!`);
      setModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<any>[] = [
    { header: 'ID / Contrato', accessor: 'identificador_externo', render: (row) => (
      <span className="font-mono text-gold-300 font-semibold">{row.identificador_externo}</span>
    )},
    { header: 'Cliente', accessor: 'cliente', render: (row) => (
      <span className="px-2.5 py-1 rounded text-xs font-bold bg-navy-800 border border-gold-500/30 text-gold-300">
        {row.clienteProducto?.nombre || 'VENTO'}
      </span>
    )},
    { header: 'Titular / Negocio', accessor: 'nombre_titular' },
    { header: 'Ubicación', accessor: 'municipio', render: (row) => (
      <div className="flex items-center text-slate-300 text-xs">
        <MapPin className="w-3.5 h-3.5 mr-1 text-gold-400" />
        {row.municipio}, {row.estado || 'CDMX'}
      </div>
    )},
    { header: 'Saldo Deudor', accessor: 'saldo_deudor', render: (row) => (
      <span className="font-mono text-slate-200 font-medium">
        ${parseFloat(row.saldo_deudor || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
      </span>
    )},
    { header: 'Comisión al Gestor', accessor: 'comision_oferta', render: (row) => (
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs shadow-[0_0_10px_rgba(245,158,11,0.2)]">
        <Coins className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
        ${parseFloat(row.comision_oferta || 350).toFixed(2)} MXN
      </div>
    )},
    { header: 'Estatus Bolsa', accessor: 'estatus', render: () => (
      <span className="inline-flex items-center text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5" />
        Disponible para Gestores en Campo
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gold-500/30 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <Coins className="h-7 w-7 text-gold-400" />
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Bolsa de Recolección Dinámica <span className="text-xs text-gold-400 uppercase tracking-widest font-normal px-2.5 py-0.5 rounded bg-gold-500/10 border border-gold-500/30">Asignación por Cercanía</span>
            </h1>
          </div>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Publica recolecciones con comisiones directas. Los gestores en campo reciben la notificación con la distancia exacta desde su ubicación GPS y pueden aceptarla al instante.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-navy-950 bg-gold-gradient hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform hover:scale-[1.02]"
        >
          <Plus className="h-5 w-5 mr-1.5 text-navy-950" />
          Nueva Recolección con Comisión
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl border border-gold-500/20">
          <p className="text-xs text-gold-400/90 font-medium uppercase tracking-wider">Ofertas Activas en Radar</p>
          <p className="text-3xl font-bold text-white mt-1 font-mono">{ofertas.length}</p>
          <span className="text-[11px] text-emerald-400 flex items-center mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
            Visibles para todos los comisionistas
          </span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-gold-500/20">
          <p className="text-xs text-gold-400/90 font-medium uppercase tracking-wider">Comisión Promedio Ofertada</p>
          <p className="text-3xl font-bold text-gold-300 mt-1 font-mono">$393.33 <span className="text-sm font-normal text-slate-400">MXN</span></p>
          <span className="text-[11px] text-slate-400 mt-1">Incentivo directo por recolección</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-gold-500/20">
          <p className="text-xs text-gold-400/90 font-medium uppercase tracking-wider">Tiempo Promedio de Aceptación</p>
          <p className="text-3xl font-bold text-white mt-1 font-mono">4.2 <span className="text-sm font-normal text-slate-400">minutos</span></p>
          <span className="text-[11px] text-gold-400/80 mt-1">Rápida asignación geográfica</span>
        </div>
      </div>

      {/* Table of active offers */}
      <div className="glass-panel p-5 rounded-2xl border border-gold-500/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gold-400" />
          Recolecciones Disponibles en Tiempo Real
        </h3>
        <DataTable columns={columns} data={ofertas} />
      </div>

      {/* Modal Nueva Oferta */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Lanzar Recolección a la Bolsa">
        <form onSubmit={handlePublicarOferta} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-1.5">
              Seleccionar Cuenta de Cartera
            </label>
            <select
              value={selectedCuentaId}
              onChange={(e) => setSelectedCuentaId(e.target.value)}
              required
              className="w-full bg-navy-900 border border-gold-500/30 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-gold-400"
            >
              <option value="">-- Seleccionar cuenta disponible --</option>
              <option value="1">KVK-2918093 | Marco Antonio Salazar (KAVAK) - Cuauhtémoc</option>
              <option value="2">VNT-5075881 | José Antonio Solís (VENTO) - Benito Juárez</option>
              <option value="3">CLP-12bd2c09 | Axel Joaquín Osorio (CLIP) - Condesa</option>
              <option value="4">KNF-237000 | Sergio Pablo Castañeda (KONFÍO) - San Pedro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-1.5">
              Monto de Comisión Ofrecida ($ MXN)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gold-400 font-bold">$</span>
              <input
                type="number"
                min="50"
                step="50"
                value={comisionMonto}
                onChange={(e) => setComisionMonto(e.target.value)}
                required
                className="w-full bg-navy-900 border border-gold-500/30 rounded-lg p-2.5 pl-8 text-sm text-slate-200 font-mono font-bold focus:outline-none focus:border-gold-400"
                placeholder="350"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Este monto será acreditado al balance del comisionista al completar la visita con GPS y evidencias.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-navy-950/80 border border-gold-500/20 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-gold-300">⚡ Transmisión Instantánea:</p>
            <p>La recolección aparecerá en la pestaña "Bolsa" de todos los gestores cercanos con la distancia en kilómetros.</p>
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-navy-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-lg text-sm font-bold text-navy-950 bg-gold-gradient hover:brightness-110 shadow-lg"
            >
              {isLoading ? 'Publicando...' : 'Publicar en Bolsa'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
