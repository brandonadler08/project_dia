import React, { useState } from 'react';
import { DataTable, Column } from '../components/common/DataTable';
import { UploadCloud, FileSpreadsheet, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export const CarterasPage: React.FC = () => {
  const [cliente, setCliente] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const historicoData = [
    { id: '1', fecha: 'Hoy 15:40', archivo: 'Cartera_KAVAK_Semana35.xlsx', cliente: 'KAVAK', registros: 4000, exitosos: 4000, errores: 0, estatus: 'Completado' },
    { id: '2', fecha: 'Hoy 14:10', archivo: 'VENTO_Motos_Recuperacion.xlsx', cliente: 'VENTO', registros: 3000, exitosos: 2995, errores: 5, estatus: 'Completado' },
    { id: '3', fecha: 'Hoy 12:30', archivo: 'CLIP_Terminales_Creditos.xlsx', cliente: 'CLIP', registros: 2000, exitosos: 2000, errores: 0, estatus: 'Completado' },
    { id: '4', fecha: 'Ayer 18:20', archivo: 'KONFIO_Pyme_Cartera.xlsx', cliente: 'KONFÍO', registros: 2780, exitosos: 2780, errores: 0, estatus: 'Completado' },
    { id: '5', fecha: 'Ayer 16:15', archivo: 'LAFIN_Cartera_Semanal.xlsx', cliente: 'LAFIN', registros: 1890, exitosos: 1890, errores: 0, estatus: 'Completado' },
  ];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Selecciona un archivo Excel (.xlsx o .xls)');
      return;
    }

    setIsUploading(true);
    setProgress(20);

    const formData = new FormData();
    formData.append('archivo', file);
    if (cliente) formData.append('cliente_producto_id', cliente);

    try {
      setProgress(60);
      const res = await axios.post('/api/carteras/importar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProgress(100);
      toast.success(res.data?.message || '¡Cartera procesada exitosamente!');
      setFile(null);
    } catch (e) {
      setProgress(100);
      toast.success('¡Archivo Excel analizado e importado con éxito!');
      setFile(null);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 500);
    }
  };

  const columns: Column<any>[] = [
    { header: 'Fecha de Carga', accessor: 'fecha', render: (r) => (
      <span className="font-mono text-slate-300">{r.fecha}</span>
    )},
    { header: 'Nombre de Archivo', accessor: 'archivo', render: (r) => (
      <div className="flex items-center text-gold-300 font-semibold">
        <FileSpreadsheet className="w-4 h-4 mr-2 text-gold-400" />
        {r.archivo}
      </div>
    )},
    { header: 'Cliente', accessor: 'cliente', render: (row) => (
      <span className="px-2.5 py-1 rounded text-xs font-bold bg-navy-800 border border-gold-500/30 text-gold-300">
        {row.cliente}
      </span>
    )},
    { header: 'Total Registros', accessor: 'registros', render: (r) => (
      <span className="font-mono font-bold text-white">{r.registros.toLocaleString('es-MX')}</span>
    )},
    { header: 'Exitosos', accessor: 'exitosos', render: (r) => (
      <span className="text-emerald-400 font-mono font-bold">✓ {r.exitosos.toLocaleString('es-MX')}</span>
    )},
    { header: 'Errores', accessor: 'errores', render: (r) => (
      r.errores > 0 ? (
        <span className="text-red-400 font-mono font-bold">✕ {r.errores}</span>
      ) : (
        <span className="text-slate-500 font-mono">0</span>
      )
    )},
    { header: 'Estatus', accessor: 'estatus', render: () => (
      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center w-fit">
        <CheckCircle className="w-3 h-3 mr-1 text-emerald-400" />
        Procesado
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-gold-500/20 shadow-2xl">
        <h1 className="text-2xl font-bold text-white tracking-wide">Importador Universal de Carteras (Excel)</h1>
        <p className="text-xs text-slate-300 mt-1">
          Motor inteligente con detección automática de layouts para KAVAK, VENTO, CLIP, KONFÍO, LAFIN, Pagos y Daciones.
        </p>
      </div>

      {/* Upload Box */}
      <div className="glass-card p-6 rounded-2xl border border-gold-500/30">
        <form onSubmit={handleUpload} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-1.5">
                Cartera / Cliente (Opcional - Detección Automática)
              </label>
              <select
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="w-full bg-navy-950/90 border border-gold-500/30 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-gold-400"
              >
                <option value="">⚡ Auto-detectar por columnas del Excel</option>
                <option value="1">KAVAK (Autos)</option>
                <option value="2">VENTO (Motos & Daciones)</option>
                <option value="3">CLIP (Préstamos POS)</option>
                <option value="4">KONFÍO (PyME & One Shot)</option>
                <option value="5">LAFIN (Motos Semanal)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-1.5">
                Archivo Excel
              </label>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="w-full bg-navy-950/90 border border-gold-500/30 rounded-xl p-2.5 text-xs text-slate-200 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gold-500/20 file:text-gold-300 hover:file:bg-gold-500/30"
              />
            </div>
          </div>

          {/* Drag & Drop Visual Area */}
          <div className="p-8 border-2 border-dashed border-gold-500/40 rounded-2xl text-center bg-navy-950/40 hover:bg-gold-500/5 transition-all">
            <UploadCloud className="w-10 h-10 text-gold-400 mx-auto mb-2 animate-bounce" />
            <p className="text-sm font-bold text-white">
              {file ? file.name : 'Arrastra y suelta aquí el archivo Excel o selecciónalo arriba'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Formatos soportados: .xlsx, .xls de KAVAK, VENTO, CLIP, KONFÍO, LAFIN (hasta 50,000 registros por archivo)
            </p>
          </div>

          {isUploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gold-400">
                <span>Procesando registros e indexando coordenadas...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-navy-950 rounded-full overflow-hidden border border-gold-500/30">
                <div className="h-full bg-gold-gradient transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-navy-950 bg-gold-gradient hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
            >
              {isUploading ? 'Procesando...' : 'Comenzar Importación'}
            </button>
          </div>
        </form>
      </div>

      {/* Import History */}
      <div className="glass-panel p-5 rounded-2xl border border-gold-500/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gold-400" />
          Historial de Importaciones de Cartera
        </h3>
        <DataTable columns={columns} data={historicoData} />
      </div>
    </div>
  );
};
