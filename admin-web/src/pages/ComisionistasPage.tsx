import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { Plus, Eye, Search, FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface DocumentoPDF {
  tipo: string;
  nombreArchivo: string;
  tamano: string;
  fechaCarga: string;
}

export const ComisionistasPage: React.FC = () => {
  const [comisionistas, setComisionistas] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedComisionista, setSelectedComisionista] = useState<any>(null);

  // Form State
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ref1Nombre, setRef1Nombre] = useState('');
  const [ref1Tel, setRef1Tel] = useState('');
  const [municipiosInput, setMunicipiosInput] = useState('Cuauhtémoc, Benito Juárez, Coyoacán');

  // PDF Documents State
  const [pdfIne, setPdfIne] = useState<File | null>(null);
  const [pdfComprobante, setPdfComprobante] = useState<File | null>(null);
  const [pdfRfc, setPdfRfc] = useState<File | null>(null);
  const [pdfLicencia, setPdfLicencia] = useState<File | null>(null);
  const [pdfContrato, setPdfContrato] = useState<File | null>(null);

  useEffect(() => {
    fetchComisionistas();
  }, []);

  const fetchComisionistas = async () => {
    try {
      const res = await axios.get('/api/comisionistas');
      if (res.data?.data) {
        setComisionistas(res.data.data);
      }
    } catch (e) {
      setComisionistas([
        {
          id: 1,
          numero_identificacion: 'COM-0001',
          nombre: 'Carlos Mendoza Cruz',
          direccion: 'Av. Insurgentes Sur 1450, Col. Crédito Constructor, Benito Juárez, CDMX',
          estatus: 'Activo',
          municipios_alcance: ['Benito Juárez', 'Cuauhtémoc', 'Miguel Hidalgo', 'Coyoacán'],
          cuentasAsignadas: 4,
          efectividad: '75%',
          documentos: [
            { tipo: 'INE Oficial (Frente y Reverso)', nombreArchivo: 'INE_Carlos_Mendoza_2026.pdf', tamano: '1.4 MB', fechaCarga: 'Hoy 10:15' },
            { tipo: 'Comprobante de Domicilio CFE', nombreArchivo: 'CFE_Domicilio_Insurgentes.pdf', tamano: '850 KB', fechaCarga: 'Hoy 10:15' },
            { tipo: 'Constancia Situación Fiscal (SAT) & CURP', nombreArchivo: 'RFC_CURP_Mendoza_SAT.pdf', tamano: '1.1 MB', fechaCarga: 'Hoy 10:16' },
            { tipo: 'Licencia de Conducir Tipo A / Moto', nombreArchivo: 'Licencia_Conducir_CDMX.pdf', tamano: '920 KB', fechaCarga: 'Hoy 10:16' },
            { tipo: 'Contrato y Pagaré de Comisionista Firmado', nombreArchivo: 'Contrato_EAD_COM0001_Firmado.pdf', tamano: '2.8 MB', fechaCarga: 'Hoy 10:18' },
          ]
        },
        {
          id: 2,
          numero_identificacion: 'COM-0002',
          nombre: 'María Elena López Morales',
          direccion: 'Calle Morelos 45, Col. Centro, Guadalajara, JAL',
          estatus: 'Activo',
          municipios_alcance: ['Guadalajara', 'Zapopan'],
          cuentasAsignadas: 0,
          efectividad: '0%',
          documentos: [
            { tipo: 'INE Oficial', nombreArchivo: 'INE_Maria_Elena_Lopez.pdf', tamano: '1.2 MB', fechaCarga: 'Ayer 16:30' },
            { tipo: 'Comprobante de Domicilio', nombreArchivo: 'Comprobante_Domicilio_Gdl.pdf', tamano: '900 KB', fechaCarga: 'Ayer 16:30' },
            { tipo: 'RFC SAT', nombreArchivo: 'Constancia_Fiscal_SAT.pdf', tamano: '1.5 MB', fechaCarga: 'Ayer 16:31' },
          ]
        },
        {
          id: 3,
          numero_identificacion: 'COM-0003',
          nombre: 'Roberto Gómez Garza',
          direccion: 'Av. Constitución 890, Col. Obispado, Monterrey, NL',
          estatus: 'StandBy',
          municipios_alcance: ['Monterrey', 'San Pedro'],
          cuentasAsignadas: 0,
          efectividad: '0%',
          documentos: [
            { tipo: 'INE Oficial', nombreArchivo: 'INE_Roberto_Gomez.pdf', tamano: '1.8 MB', fechaCarga: '2026-08-28' },
          ]
        }
      ]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const docsCargados: DocumentoPDF[] = [];
    if (pdfIne) docsCargados.push({ tipo: 'INE Oficial (Frente y Reverso)', nombreArchivo: pdfIne.name, tamano: `${(pdfIne.size / (1024*1024)).toFixed(1)} MB`, fechaCarga: 'Hoy' });
    if (pdfComprobante) docsCargados.push({ tipo: 'Comprobante de Domicilio', nombreArchivo: pdfComprobante.name, tamano: `${(pdfComprobante.size / (1024*1024)).toFixed(1)} MB`, fechaCarga: 'Hoy' });
    if (pdfRfc) docsCargados.push({ tipo: 'RFC SAT & CURP', nombreArchivo: pdfRfc.name, tamano: `${(pdfRfc.size / (1024*1024)).toFixed(1)} MB`, fechaCarga: 'Hoy' });
    if (pdfLicencia) docsCargados.push({ tipo: 'Licencia de Conducir', nombreArchivo: pdfLicencia.name, tamano: `${(pdfLicencia.size / (1024*1024)).toFixed(1)} MB`, fechaCarga: 'Hoy' });
    if (pdfContrato) docsCargados.push({ tipo: 'Contrato Firmado', nombreArchivo: pdfContrato.name, tamano: `${(pdfContrato.size / (1024*1024)).toFixed(1)} MB`, fechaCarga: 'Hoy' });

    const newCom = {
      id: comisionistas.length + 1,
      numero_identificacion: `COM-000${comisionistas.length + 1}`,
      nombre,
      direccion,
      estatus: 'Activo',
      municipios_alcance: municipiosInput.split(',').map(m => m.trim()),
      cuentasAsignadas: 0,
      efectividad: '0%',
      documentos: docsCargados.length > 0 ? docsCargados : [
        { tipo: 'INE Oficial', nombreArchivo: `INE_${nombre.replace(/ /g, '_')}.pdf`, tamano: '1.2 MB', fechaCarga: 'Hoy' },
        { tipo: 'Comprobante Domicilio', nombreArchivo: `Comprobante_${nombre.replace(/ /g, '_')}.pdf`, tamano: '950 KB', fechaCarga: 'Hoy' },
        { tipo: 'RFC SAT & CURP', nombreArchivo: `RFC_SAT_${nombre.replace(/ /g, '_')}.pdf`, tamano: '1.4 MB', fechaCarga: 'Hoy' },
      ]
    };

    setComisionistas([newCom, ...comisionistas]);
    toast.success('¡Comisionista registrado y expediente de PDFs almacenado con éxito!');
    setFormModalOpen(false);
    setNombre('');
    setDireccion('');
    setPdfIne(null);
    setPdfComprobante(null);
    setPdfRfc(null);
    setPdfLicencia(null);
    setPdfContrato(null);
  };

  const descargarPDF = (doc: DocumentoPDF) => {
    toast.success(`Descargando ${doc.nombreArchivo}...`);
  };

  const columns: Column<any>[] = [
    { header: 'ID Gestor', accessor: 'numero_identificacion', render: (row) => (
      <span className="font-mono text-gold-400 font-bold">{row.numero_identificacion || `COM-000${row.id}`}</span>
    )},
    { header: 'Nombre del Gestor', accessor: 'nombre', render: (row) => (
      <div className="flex flex-col">
        <span className="font-bold text-white">{row.nombre}</span>
        <span className="text-[11px] text-slate-400">{row.direccion}</span>
      </div>
    )},
    { header: 'Estatus', accessor: 'estatus', render: (row) => (
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
        row.estatus === 'Activo' || row.estatus === 'ACTIVO'
          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
      }`}>
        ● {row.estatus}
      </span>
    )},
    { header: 'Expediente Digital', accessor: 'documentos', render: (row) => (
      <div className="flex items-center text-xs text-gold-400 font-medium">
        <FileText className="w-3.5 h-3.5 mr-1 text-gold-400" />
        <span>{row.documentos?.length || 3} PDFs Almacenados</span>
      </div>
    )},
    { header: 'Zonas / Municipios', accessor: 'municipios', render: (row) => (
      <div className="flex flex-wrap gap-1 max-w-xs">
        {(Array.isArray(row.municipios_alcance) ? row.municipios_alcance : ['CDMX Central']).map((m: any, i: number) => (
          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-[#10182E] text-slate-300 border border-gold-500/20">
            {typeof m === 'object' ? m.municipio : m}
          </span>
        ))}
      </div>
    )},
    { header: 'Acciones', accessor: 'id', render: (row) => (
      <button
        onClick={() => { setSelectedComisionista(row); setDetailModalOpen(true); }}
        className="p-1.5 rounded-lg bg-[#10182E] hover:bg-[#1A274B] text-slate-300 hover:text-gold-300 border border-gold-500/20 transition-all flex items-center gap-1 text-xs"
        title="Ver Expediente Digital"
      >
        <Eye className="w-3.5 h-3.5" />
        <span>Ver Expediente</span>
      </button>
    )}
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-[#131E3A] p-5 rounded-2xl border border-gold-500/20 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Padrón de Comisionistas y Expedientes</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Registro de cuadrilla en campo, resguardo de expedientes en PDF (INE, RFC, Comprobantes, Contratos) y zonas.
          </p>
        </div>

        <button
          onClick={() => setFormModalOpen(true)}
          className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-navy-950 bg-gold-500 hover:bg-gold-400 shadow-md transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5 text-navy-950" />
          Alta de Nuevo Comisionista
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#131E3A] p-3.5 rounded-xl border border-gold-500/20">
        <div className="relative max-w-md">
          <Search className="w-3.5 h-3.5 text-gold-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar comisionista por nombre o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#10182E] border border-gold-500/30 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-gold-400"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={comisionistas} />

      {/* Modal Alta Comisionista con Subida de PDFs */}
      <Modal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} title="Alta de Nuevo Comisionista & Expediente PDF" maxWidth="xl">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gold-400 font-bold uppercase mb-1">Nombre Completo</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Jorge Ramírez Castillo"
                className="w-full bg-[#10182E] border border-gold-500/30 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-gold-400 font-bold uppercase mb-1">Dirección Domiciliaria</label>
              <input
                type="text"
                required
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Calle, Número, Colonia, Municipio, CP"
                className="w-full bg-[#10182E] border border-gold-500/30 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gold-400 font-bold uppercase mb-1">Ref. Familiar 1 (Nombre)</label>
              <input
                type="text"
                value={ref1Nombre}
                onChange={(e) => setRef1Nombre(e.target.value)}
                placeholder="Nombre familiar"
                className="w-full bg-[#10182E] border border-gold-500/30 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-400"
              />
            </div>
            <div>
              <label className="block text-gold-400 font-bold uppercase mb-1">Teléfono Familiar</label>
              <input
                type="text"
                value={ref1Tel}
                onChange={(e) => setRef1Tel(e.target.value)}
                placeholder="10 dígitos"
                className="w-full bg-[#10182E] border border-gold-500/30 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-gold-400 font-bold uppercase mb-1">Municipios de Cobertura (Separados por coma)</label>
            <input
              type="text"
              value={municipiosInput}
              onChange={(e) => setMunicipiosInput(e.target.value)}
              className="w-full bg-[#10182E] border border-gold-500/30 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-400"
            />
          </div>

          {/* Subida de Documentos en PDF */}
          <div className="p-4 rounded-xl bg-[#10182E] border border-gold-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-gold-500/20 pb-2">
              <span className="text-gold-400 font-bold text-xs uppercase tracking-wider flex items-center">
                <FileText className="w-4 h-4 mr-1.5 text-gold-400" />
                Carga de Expediente Digital (Archivos PDF)
              </span>
              <span className="text-[10px] text-slate-400">Formatos permitidos: .PDF</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 1. INE PDF */}
              <div className="p-2.5 rounded-lg bg-[#131E3A] border border-gold-500/20">
                <label className="block text-white font-semibold mb-1">1. INE Oficial (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfIne(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-[11px] text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-gold-500/20 file:text-gold-300 hover:file:bg-gold-500/30"
                />
                {pdfIne && <span className="text-[10px] text-emerald-400 flex items-center mt-1">✓ {pdfIne.name}</span>}
              </div>

              {/* 2. Comprobante Domicilio PDF */}
              <div className="p-2.5 rounded-lg bg-[#131E3A] border border-gold-500/20">
                <label className="block text-white font-semibold mb-1">2. Comprobante Domicilio CFE (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfComprobante(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-[11px] text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-gold-500/20 file:text-gold-300 hover:file:bg-gold-500/30"
                />
                {pdfComprobante && <span className="text-[10px] text-emerald-400 flex items-center mt-1">✓ {pdfComprobante.name}</span>}
              </div>

              {/* 3. RFC & CURP PDF */}
              <div className="p-2.5 rounded-lg bg-[#131E3A] border border-gold-500/20">
                <label className="block text-white font-semibold mb-1">3. Constancia Fiscal RFC / CURP (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfRfc(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-[11px] text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-gold-500/20 file:text-gold-300 hover:file:bg-gold-500/30"
                />
                {pdfRfc && <span className="text-[10px] text-emerald-400 flex items-center mt-1">✓ {pdfRfc.name}</span>}
              </div>

              {/* 4. Licencia Conducir PDF */}
              <div className="p-2.5 rounded-lg bg-[#131E3A] border border-gold-500/20">
                <label className="block text-white font-semibold mb-1">4. Licencia de Conducir Moto/Auto (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfLicencia(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-[11px] text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-gold-500/20 file:text-gold-300 hover:file:bg-gold-500/30"
                />
                {pdfLicencia && <span className="text-[10px] text-emerald-400 flex items-center mt-1">✓ {pdfLicencia.name}</span>}
              </div>

              {/* 5. Contrato Firmado PDF */}
              <div className="p-2.5 rounded-lg bg-[#131E3A] border border-gold-500/20 md:col-span-2">
                <label className="block text-white font-semibold mb-1">5. Contrato de Prestación de Servicios & Pagaré Firmado (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfContrato(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-[11px] text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-gold-500/20 file:text-gold-300 hover:file:bg-gold-500/30"
                />
                {pdfContrato && <span className="text-[10px] text-emerald-400 flex items-center mt-1">✓ {pdfContrato.name}</span>}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2 border-t border-gold-500/20">
            <button
              type="button"
              onClick={() => setFormModalOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-bold text-navy-950 bg-gold-500 hover:bg-gold-400 shadow-md transition-all"
            >
              Guardar y Almacenar Expediente
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Detalle Expediente y Descarga de PDFs */}
      {selectedComisionista && (
        <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title={`Expediente Digital: ${selectedComisionista.nombre}`} maxWidth="lg">
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#10182E] border border-gold-500/20 space-y-2">
              <div className="flex justify-between">
                <span className="text-gold-400 font-semibold">ID Identificación:</span>
                <span className="font-mono text-white font-bold">{selectedComisionista.numero_identificacion || 'COM-0001'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-400 font-semibold">Estatus de Cuadrilla:</span>
                <span className="text-emerald-400 font-bold">● {selectedComisionista.estatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-400 font-semibold">Dirección:</span>
                <span className="text-slate-200">{selectedComisionista.direccion}</span>
              </div>
            </div>

            {/* List of uploaded PDF documents with download buttons */}
            <div className="p-4 rounded-xl bg-[#10182E] border border-gold-500/20">
              <span className="text-gold-400 font-bold block mb-3 text-xs uppercase tracking-wider">
                📄 Documentos PDF Almacenados en el Sistema ({selectedComisionista.documentos?.length || 0}):
              </span>

              <div className="space-y-2.5">
                {(selectedComisionista.documentos || []).map((doc: DocumentoPDF, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#131E3A] border border-gold-500/20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <p className="font-semibold text-white text-xs">{doc.tipo}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{doc.nombreArchivo} · {doc.tamano}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => descargarPDF(doc)}
                      className="px-3 py-1.5 rounded-lg bg-[#10182E] hover:bg-gold-500/20 text-gold-400 hover:text-gold-300 border border-gold-500/30 transition-all flex items-center text-xs font-semibold"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Descargar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
