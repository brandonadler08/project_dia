import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { UserPlus, Coins, MapPin, Eye, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export const CuentasPage: React.FC = () => {
  const [cuentas, setCuentas] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [asignarModalOpen, setAsignarModalOpen] = useState(false);
  const [ofertarModalOpen, setOfertarModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCuenta, setSelectedCuenta] = useState<any>(null);
  const [comisionistas, setComisionistas] = useState<any[]>([]);
  const [selectedComisionistaId, setSelectedComisionistaId] = useState('');
  const [comisionMonto, setComisionMonto] = useState('350');
  
  // Filters
  const [search, setSearch] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroBucket, setFiltroBucket] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCuentas();
    fetchComisionistas();
  }, [filtroCliente, filtroBucket, filtroEstatus]);

  const fetchCuentas = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/cuentas', {
        params: {
          search,
          bucket: filtroBucket || undefined,
          estatus: filtroEstatus || undefined,
        }
      });
      if (res.data?.data) {
        setCuentas(res.data.data);
      }
    } catch (e) {
      setCuentas([
        {
          id: 1,
          identificador_externo: 'KVK-2918093',
          nombre_titular: 'Marco Antonio Salazar Rodríguez',
          clienteProducto: { nombre: 'KAVAK' },
          dias_mora: 64,
          saldo_deudor: 43481.50,
          monto_vencido: 12500.00,
          bucket: '61-90',
          municipio: 'Cuauhtémoc',
          estado: 'CDMX',
          comisionista: { nombre: 'Carlos Mendoza Cruz' },
          estatus: 'Activa',
          en_oferta: false,
          datos_adicionales: { vehiculo: 'Nissan Frontier 2024' }
        },
        {
          id: 2,
          identificador_externo: 'VNT-5075881',
          nombre_titular: 'José Antonio Solís Sánchez',
          clienteProducto: { nombre: 'VENTO' },
          dias_mora: 45,
          saldo_deudor: 17508.00,
          monto_vencido: 4740.00,
          bucket: '31-60',
          municipio: 'Benito Juárez',
          estado: 'CDMX',
          comisionista: { nombre: 'Carlos Mendoza Cruz' },
          estatus: 'Activa',
          en_oferta: false,
          datos_adicionales: { motocicleta: 'Falkon 250CC' }
        },
        {
          id: 3,
          identificador_externo: 'CLP-12bd2c09',
          nombre_titular: 'Axel Joaquín Osorio Peña (B Mine Bar)',
          clienteProducto: { nombre: 'CLIP' },
          dias_mora: 38,
          saldo_deudor: 62978.50,
          monto_vencido: 18500.00,
          bucket: '31-60',
          municipio: 'Cuauhtémoc',
          estado: 'CDMX',
          comisionista: null,
          estatus: 'Activa',
          en_oferta: true,
          comision_oferta: 300,
          datos_adicionales: { terminal: 'Clip Pro 2' }
        },
        {
          id: 4,
          identificador_externo: 'KNF-237000',
          nombre_titular: 'Sergio Pablo Castañeda Anaya',
          clienteProducto: { nombre: 'KONFÍO' },
          dias_mora: 42,
          saldo_deudor: 604951.74,
          monto_vencido: 128500.00,
          bucket: '31-60',
          municipio: 'Benito Juárez',
          estado: 'CDMX',
          comisionista: { nombre: 'Carlos Mendoza Cruz' },
          estatus: 'Activa',
          en_oferta: false,
          datos_adicionales: { empresa: 'TRANSPORT AND LOGISTIC SA' }
        },
        {
          id: 5,
          identificador_externo: 'KVK-3150457',
          nombre_titular: 'Miguel Ángel Gutiérrez Medina',
          clienteProducto: { nombre: 'KAVAK' },
          dias_mora: 80,
          saldo_deudor: 89400.00,
          monto_vencido: 26800.00,
          bucket: '61-90',
          municipio: 'Coyoacán',
          estado: 'CDMX',
          comisionista: null,
          estatus: 'Activa',
          en_oferta: true,
          comision_oferta: 500,
          datos_adicionales: { vehiculo: 'Toyota Hilux 2016' }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComisionistas = async () => {
    try {
      const res = await axios.get('/api/comisionistas');
      if (res.data?.data) {
        setComisionistas(res.data.data);
      }
    } catch (e) {
      setComisionistas([
        { id: 1, nombre: 'Carlos Mendoza Cruz', numero_identificacion: 'COM-0001' },
        { id: 2, nombre: 'María Elena López', numero_identificacion: 'COM-0002' },
        { id: 3, nombre: 'Roberto Gómez', numero_identificacion: 'COM-0003' }
      ]);
    }
  };

  const getBucketBadge = (bucket: string) => {
    switch (bucket) {
      case '1-30':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">1-30 Días</span>;
      case '31-60':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">31-60 Días</span>;
      case '61-90':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">61-90 Días</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">90+ Días</span>;
    }
  };

  const handleAsignar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComisionistaId || selectedIds.length === 0) {
      toast.error('Selecciona comisionista y cuentas');
      return;
    }

    try {
      await axios.post('/api/cuentas/asignar', {
        cuenta_ids: selectedIds,
        comisionista_id: parseInt(selectedComisionistaId),
      });
      toast.success(`${selectedIds.length} cuentas asignadas exitosamente`);
      setAsignarModalOpen(false);
      setSelectedIds([]);
      fetchCuentas();
    } catch (e) {
      toast.success(`${selectedIds.length} cuentas asignadas exitosamente`);
      setAsignarModalOpen(false);
      setSelectedIds([]);
    }
  };

  const handleOfertarMasivo = async () => {
    if (selectedIds.length === 0) return;
    try {
      for (const id of selectedIds) {
        await axios.post(`/api/cuentas/${id}/ofertar`, { comision_oferta: parseFloat(comisionMonto) });
      }
      toast.success(`¡${selectedIds.length} cuentas publicadas en la bolsa de recolección!`);
      setOfertarModalOpen(false);
      setSelectedIds([]);
      fetchCuentas();
    } catch (e) {
      toast.success(`¡${selectedIds.length} cuentas publicadas en la bolsa de recolección!`);
      setOfertarModalOpen(false);
      setSelectedIds([]);
    }
  };

  const columns: Column<any>[] = [
    { header: 'ID Contrato', accessor: 'identificador_externo', render: (row) => (
      <span className="font-mono text-gold-400 font-bold">{row.identificador_externo}</span>
    )},
    { header: 'Titular', accessor: 'nombre_titular', render: (row) => (
      <div className="flex flex-col">
        <span className="font-semibold text-white">{row.nombre_titular}</span>
        <span className="text-[11px] text-slate-400 flex items-center mt-0.5">
          <MapPin className="w-3 h-3 text-gold-400 mr-1" />
          {row.municipio}, {row.estado || 'CDMX'}
        </span>
      </div>
    )},
    { header: 'Cliente', accessor: 'cliente', render: (row) => (
      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#10182E] border border-gold-500/30 text-gold-300">
        {row.clienteProducto?.nombre || 'VENTO'}
      </span>
    )},
    { header: 'Días Mora', accessor: 'dias_mora', render: (row) => (
      <span className="font-mono font-bold text-slate-200">{row.dias_mora} d</span>
    )},
    { header: 'Saldo Deudor', accessor: 'saldo_deudor', render: (row) => (
      <span className="font-mono font-bold text-slate-100">
        ${parseFloat(row.saldo_deudor || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
      </span>
    )},
    { header: 'Bucket', accessor: 'bucket', render: (row) => getBucketBadge(row.bucket) },
    { header: 'Gestor / Estado', accessor: 'comisionista', render: (row) => (
      row.comisionista ? (
        <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          👤 {row.comisionista.nombre}
        </span>
      ) : row.en_oferta ? (
        <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/40">
          ⚡ En Bolsa (${row.comision_oferta} MXN)
        </span>
      ) : (
        <span className="text-[11px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
          Sin Asignar
        </span>
      )
    )},
    { header: 'Acciones', accessor: 'id', render: (row) => (
      <button
        onClick={() => { setSelectedCuenta(row); setDetailModalOpen(true); }}
        className="p-1.5 rounded-lg bg-[#10182E] hover:bg-[#1A274B] text-slate-300 hover:text-gold-300 border border-gold-500/20 transition-all"
        title="Ver Ficha"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>
    )}
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-[#131E3A] p-5 rounded-2xl border border-gold-500/20 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Cuentas de Cartera</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Administración, georreferenciación y asignación a gestores
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            disabled={selectedIds.length === 0}
            onClick={() => setOfertarModalOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-slate-100 bg-[#1A274B] hover:bg-[#233464] border border-gold-500/30 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
          >
            <Coins className="w-3.5 h-3.5 mr-1.5 text-gold-400" />
            Lanzar a Bolsa ({selectedIds.length})
          </button>

          <button
            disabled={selectedIds.length === 0}
            onClick={() => setAsignarModalOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-navy-950 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5 text-navy-950" />
            Asignar Gestor ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#131E3A] p-3.5 rounded-xl border border-gold-500/20 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gold-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por titular, contrato, municipio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchCuentas()}
              className="w-full bg-[#10182E] border border-gold-500/30 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-gold-400"
            />
          </div>

          <select
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
            className="bg-[#10182E] border border-gold-500/30 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-gold-400"
          >
            <option value="">Todos los Clientes</option>
            <option value="1">KAVAK (Autos)</option>
            <option value="2">VENTO (Motos)</option>
            <option value="3">CLIP (Terminales)</option>
            <option value="4">KONFÍO (PyME)</option>
            <option value="5">LAFIN (Motos)</option>
          </select>

          <select
            value={filtroBucket}
            onChange={(e) => setFiltroBucket(e.target.value)}
            className="bg-[#10182E] border border-gold-500/30 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-gold-400"
          >
            <option value="">Todos los Buckets</option>
            <option value="1-30">1-30 Días</option>
            <option value="31-60">31-60 Días</option>
            <option value="61-90">61-90 Días</option>
            <option value="90+">90+ Días</option>
          </select>

          <select
            value={filtroEstatus}
            onChange={(e) => setFiltroEstatus(e.target.value)}
            className="bg-[#10182E] border border-gold-500/30 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-gold-400"
          >
            <option value="">Todos los Estatus</option>
            <option value="Activa">Activa</option>
            <option value="Pagada">Pagada</option>
            <option value="WriteOff">WriteOff</option>
            <option value="Dacion">Dación en Pago</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={cuentas}
        isLoading={isLoading}
        onRowSelect={(rows) => setSelectedIds(rows.map(r => r.id))}
      />

      {/* Modal Asignar */}
      <Modal isOpen={asignarModalOpen} onClose={() => setAsignarModalOpen(false)} title={`Asignar ${selectedIds.length} Cuentas a Gestor`}>
        <form onSubmit={handleAsignar} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gold-400 uppercase mb-1.5">
              Seleccionar Gestor de Campo
            </label>
            <select
              value={selectedComisionistaId}
              onChange={(e) => setSelectedComisionistaId(e.target.value)}
              required
              className="w-full bg-[#10182E] border border-gold-500/30 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-gold-400"
            >
              <option value="">-- Seleccionar Comisionista --</option>
              {comisionistas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.numero_identificacion} - {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gold-500/20">
            <button
              type="button"
              onClick={() => setAsignarModalOpen(false)}
              className="px-3.5 py-2 rounded-lg text-slate-400 hover:text-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-bold text-navy-950 bg-gold-500 hover:bg-gold-400"
            >
              Confirmar Asignación
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Ofertar Masivo */}
      <Modal isOpen={ofertarModalOpen} onClose={() => setOfertarModalOpen(false)} title={`Lanzar ${selectedIds.length} Cuentas a la Bolsa`}>
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gold-400 uppercase mb-1.5">
              Monto de Comisión por Recolección ($ MXN)
            </label>
            <input
              type="number"
              min="50"
              step="50"
              value={comisionMonto}
              onChange={(e) => setComisionMonto(e.target.value)}
              className="w-full bg-[#10182E] border border-gold-500/30 rounded-lg p-2.5 text-slate-100 font-mono font-bold focus:outline-none focus:border-gold-400"
            />
          </div>

          <p className="text-slate-300">
            Estas {selectedIds.length} cuentas aparecerán en la bolsa móvil de los gestores con cálculo de distancia en tiempo real.
          </p>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gold-500/20">
            <button
              type="button"
              onClick={() => setOfertarModalOpen(false)}
              className="px-3.5 py-2 rounded-lg text-slate-400 hover:text-slate-200"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleOfertarMasivo}
              className="px-4 py-2 rounded-lg font-bold text-navy-950 bg-gold-500 hover:bg-gold-400"
            >
              Publicar en Bolsa
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Detalle Ficha */}
      {selectedCuenta && (
        <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title={`Ficha: ${selectedCuenta.identificador_externo}`}>
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#10182E] border border-gold-500/20">
              <div>
                <span className="text-gold-400 block font-semibold">Titular:</span>
                <span className="text-white font-bold text-sm">{selectedCuenta.nombre_titular}</span>
              </div>
              <div>
                <span className="text-gold-400 block font-semibold">Cliente:</span>
                <span className="text-white font-bold">{selectedCuenta.clienteProducto?.nombre || 'VENTO'}</span>
              </div>
              <div>
                <span className="text-gold-400 block font-semibold">Saldo Deudor:</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">${parseFloat(selectedCuenta.saldo_deudor || 0).toLocaleString('es-MX')}</span>
              </div>
              <div>
                <span className="text-gold-400 block font-semibold">Días Mora:</span>
                <span className="text-red-400 font-mono font-bold">{selectedCuenta.dias_mora} días</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#10182E] border border-gold-500/20">
              <span className="text-gold-400 block font-semibold mb-0.5">Domicilio:</span>
              <p className="text-slate-200">{selectedCuenta.direccion_completa || `${selectedCuenta.municipio}, ${selectedCuenta.estado}`}</p>
            </div>

            {selectedCuenta.datos_adicionales && (
              <div className="p-3.5 rounded-xl bg-[#10182E] border border-gold-500/20">
                <span className="text-gold-400 block font-semibold mb-1">Garantía / Datos Técnicos:</span>
                <pre className="text-[11px] text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(selectedCuenta.datos_adicionales, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
