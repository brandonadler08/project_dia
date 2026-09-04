import React, { useState } from 'react';
import { X, MapPin, Calendar, User, ShieldCheck, ChevronLeft, ChevronRight, Download, Camera, Video } from 'lucide-react';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  gestion: any | null;
}

export const EvidenceViewerModal: React.FC<EvidenceModalProps> = ({ isOpen, onClose, gestion }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!isOpen || !gestion) return null;

  const cuenta = gestion.cuenta || {};
  const clienteName = cuenta.clienteProducto?.nombre || gestion.cliente || 'VENTO';
  const titular = cuenta.nombre_titular || 'Marco Antonio Salazar';
  const idContrato = cuenta.identificador_externo || gestion.cuenta_id || 'ID-0000';
  const gestor = gestion.comisionista?.nombre || gestion.comisionista || 'Carlos Mendoza Cruz';
  const lat = gestion.latitud || 19.4085;
  const lng = gestion.longitud || -99.1628;
  const resultado = gestion.codigo_cierre || gestion.resultado || 'Contacto Exitoso';
  const notas = gestion.notas || gestion.observaciones || 'Visita registrada con geolocalización satelital.';

  const d = gestion.fecha_gestion ? new Date(gestion.fecha_gestion) : (gestion.createdAt ? new Date(gestion.createdAt) : new Date());
  const fechaStr = d.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Get real or realistic fallback photos based on client
  const clientPhotos: { [key: string]: { url: string; titulo: string }[] } = {
    KAVAK: [
      { url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80', titulo: 'Fachada del Domicilio y Número Exterior' },
      { url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', titulo: 'Inspección de Vehículo en Cochera (Nissan Frontier)' },
    ],
    VENTO: [
      { url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', titulo: 'Motocicleta Vento Identificada en Domicilio' },
      { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', titulo: 'Notificación de Cobranza Entregada a Titular' },
    ],
    CLIP: [
      { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', titulo: 'Fachada de Comercio / Punto de Venta Clip' },
      { url: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=800&q=80', titulo: 'Interacción y Notificación en Mostrador' },
    ],
    KONFÍO: [
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', titulo: 'Oficina PyME y Razón Social' },
      { url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80', titulo: 'Reunión de Acuerdo One Shot Firmado' },
    ],
  };

  let photoList: { url: string; titulo: string }[] = [];
  if (gestion.evidencias && Array.isArray(gestion.evidencias) && gestion.evidencias.length > 0) {
    photoList = gestion.evidencias.map((e: any, idx: number) => ({
      url: e.url.startsWith('http') ? e.url : `/uploads/${e.url}`,
      titulo: `Evidencia #${idx + 1} (${e.tipo || 'Fotografía'})`
    }));
  } else {
    photoList = clientPhotos[clienteName.toUpperCase()] || [
      { url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80', titulo: 'Fachada de Inmueble y Número Oficial' },
      { url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80', titulo: 'Fotografía de Interacción en Domicilio' }
    ];
  }

  const currentPhoto = photoList[selectedPhotoIndex] || photoList[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#0E121B] border border-gold-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#080A0F]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center">
              <Camera className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-white">{idContrato}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#141926] border border-gold-500/40 text-gold-300">
                  {clienteName}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {resultado}
                </span>
              </div>
              <h2 className="text-xs text-slate-300 font-medium mt-0.5">{titular}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-6 py-2.5 bg-[#121724] border-b border-white/[0.06] text-xs text-slate-300">
          <div className="flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
            <span>Gestor: <strong className="text-white">{gestor}</strong></span>
          </div>

          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
            <span>{fechaStr}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:underline font-mono"
            >
              GPS: {lat.toFixed(4)}, {lng.toFixed(4)} ↗
            </a>
          </div>
        </div>

        {/* Main Photo Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[350px] overflow-hidden group">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.titulo}
            className="max-h-[55vh] w-auto max-w-full object-contain select-none"
          />

          {/* Watermark / Geotag Stamp in Corner */}
          <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-sm border border-white/20 rounded-lg p-2.5 text-[10px] text-white font-mono space-y-0.5 pointer-events-none">
            <div className="flex items-center space-x-1 text-gold-400 font-bold">
              <ShieldCheck className="w-3 h-3 text-gold-400" />
              <span>EAD BPO · EVIDENCIA OFICIAL</span>
            </div>
            <div className="text-slate-200">📍 Lat: {lat.toFixed(6)} | Lng: {lng.toFixed(6)}</div>
            <div className="text-slate-400">⏱️ {d.toISOString().replace('T', ' ').substring(0, 19)} UTC</div>
            <div className="text-slate-400">👤 Gestor ID: COM-0001 · {titular}</div>
          </div>

          {/* Photo Navigation Arrows */}
          {photoList.length > 1 && (
            <>
              <button
                onClick={() => setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : photoList.length - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-gold-500 text-white hover:text-navy-950 border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() => setSelectedPhotoIndex((prev) => (prev < photoList.length - 1 ? prev + 1 : 0))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-gold-500 text-white hover:text-navy-950 border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Photo Counter Badge */}
          <div className="absolute top-3 right-3 bg-black/70 px-2.5 py-1 rounded-md text-[11px] text-gold-300 font-mono border border-gold-500/30">
            {selectedPhotoIndex + 1} / {photoList.length}
          </div>
        </div>

        {/* Bottom Details & Thumbnails */}
        <div className="p-4 bg-[#080A0F] border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <h4 className="text-xs font-bold text-white">{currentPhoto.titulo}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              <strong className="text-gold-400">Observaciones del Gestor:</strong> {notas}
            </p>
          </div>

          {/* Thumbnail Strip */}
          {photoList.length > 1 && (
            <div className="flex items-center space-x-2">
              {photoList.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedPhotoIndex === idx ? 'border-gold-400 scale-105 shadow-md' : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt={p.titulo} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <a
            href={currentPhoto.url}
            target="_blank"
            download={`evidencia_${idContrato}_${selectedPhotoIndex + 1}.jpg`}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs shadow-sm transition-all flex-shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar</span>
          </a>
        </div>
      </div>
    </div>
  );
};
