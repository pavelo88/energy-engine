'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, StopCircle, Type, MapPin, Save, Printer, FileText, Settings, Users, 
  CheckCircle2, ShieldCheck, BrainCircuit, X, Zap, Mail, Wand2, RefreshCcw, ArrowUpRight
} from 'lucide-react';

// --- ESTRUCTURA DE DATOS ---
const CHECKLIST_SECTIONS = {
  "INSPECCION EN EL MOTOR": ["Nivel de lubricante", "Indicador nivel refrigerante", "Correa del ventilador", "Filtro de combustible y prefiltro", "Filtro de aire", "Filtro de aceite y prefiltro de aceite", "Tubo de escape", "Circuito de refrigeración", "Circuito de lubricación", "Baterías", "Motor de arranque"],
  "INSPECCION EN EL ALTERNADOR": ["Placas de los bornes", "Regulador eléctrico", "Colector", "Rodamiento", "Ventilación", "Escobillas", "Maniobra"],
  "INSPECCION EQUIPO ELECTRICO": ["Aparatos de medida", "Pilotos", "Mantenedor de baterías", "Interruptor general", "Resistencia de caldeo", "Contactores", "Reles auxiliares", "Apriete bornes", "Cableado"],
  "RECAMBIOS": ["Filtro de combustible", "Filtro de aceite", "Filtro de aire", "Correa motor", "Aceite", "Anticongelante"]
};

// Componente de Input Estilizado
const StableInput = ({ label, value, onChange, icon: Icon, type = "text", placeholder }: any) => (
  <div className="space-y-2 w-full text-left">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={18}/>}
      <input 
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 ${Icon ? 'pl-12' : ''} outline-none focus:border-amber-500 focus:bg-white transition-all font-bold text-slate-700 shadow-sm`}
      />
    </div>
  </div>
);

// --- CORRECCIÓN FINAL: Se unifica la declaración y exportación en una sola línea ---
export default function InspectionFormTab() {
  const [isRecording, setIsRecording] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  
  const [intervention, setIntervention] = useState({
    cliente: { nombre: '', instalacion: '', direccion: '', potencia_kva: '', n_grupo: '' },
    equipo: { marca: '', modelo: '', sn: '' },
    check: {} as Record<string, string>, 
    mediciones: { horas: '', presion: '', temp: '', combustible: '' },
    pruebasCarga: { rs: '', st: '', rt: '', r: '', s: '', t: '', kw: '' },
    observaciones: '',
    recibidoPor: '',
    firmaCliente: null as string | null
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      return;
    }
    const Speech = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Speech) return alert("Voz no soportada por el navegador.");
    const rec = new Speech();
    rec.lang = 'es-ES';
    rec.continuous = true;
    rec.onstart = () => setIsRecording(true);
    rec.onresult = async (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('. ');
      console.log("Dictado detectado:", transcript);
      setIntervention(prev => ({ ...prev, observaciones: prev.observaciones + " " + transcript }));
    };
    rec.onend = () => setIsRecording(false);
    recognitionRef.current = rec;
    rec.start();
  };

  return (
    <div className="space-y-10 pb-32">
      
      {/* AGENTE FLOTANTE IA */}
      <div className="fixed bottom-28 right-8 z-[200] flex flex-col items-end gap-4">
        {isAiMenuOpen && (
          <div className="flex flex-col items-end gap-3 mb-4 animate-in slide-in-from-bottom-6">
            <button onClick={() => { toggleRecording(); setIsAiMenuOpen(false); }} className={`flex items-center gap-3 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-black text-[10px] uppercase border-2 border-white transition-all ${isRecording ? 'bg-red-500 animate-pulse' : ''}`}>
              {isRecording ? <StopCircle size={18}/> : <Mic size={18}/>} Dictado IA ✨
            </button>
            <button className="flex items-center gap-3 bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-black text-[10px] uppercase border-2 border-white">
              <Wand2 size={18}/> Refinar Datos ✨
            </button>
          </div>
        )}
        <button onClick={() => setIsAiMenuOpen(!isAiMenuOpen)} className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center shadow-2xl border-4 border-white text-white">
          {isAiMenuOpen ? <X size={32}/> : <BrainCircuit size={32}/>}
          {aiLoading && <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>}
        </button>
      </div>

      {/* 1. IDENTIFICACIÓN ADN */}
      <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
        <h2 className="text-2xl md:text-4xl font-black border-l-8 border-amber-500 pl-6 uppercase tracking-tighter">Identificación ADN</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StableInput label="Empresa / Cliente" icon={Users} value={intervention.cliente.nombre} onChange={(v:any) => setIntervention(p => ({...p, cliente: {...p.cliente, nombre: v}}))}/>
          <StableInput label="Instalación / Ubicación" icon={MapPin} value={intervention.cliente.instalacion} onChange={(v:any) => setIntervention(p => ({...p, cliente: {...p.cliente, instalacion: v}}))}/>
          <StableInput label="Dirección Postal" icon={Mail} value={intervention.cliente.direccion} onChange={(v:any) => setIntervention(p => ({...p, cliente: {...p.cliente, direccion: v}}))}/>
          <div className="grid grid-cols-2 gap-4">
            <StableInput label="Nº de Grupo" value={intervention.cliente.n_grupo} onChange={(v:any) => setIntervention(p => ({...p, cliente: {...p.cliente, n_grupo: v}}))}/>
            <StableInput label="Potencia" value={intervention.cliente.potencia_kva} onChange={(v:any) => setIntervention(p => ({...p, cliente: {...p.cliente, potencia_kva: v}}))}/>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StableInput label="Marca del Motor" icon={Settings} value={intervention.equipo.marca} onChange={(v:any) => setIntervention(p => ({...p, equipo: {...p.equipo, marca: v}}))}/>
          <StableInput label="Modelo" value={intervention.equipo.modelo} onChange={(v:any) => setIntervention(p => ({...p, equipo: {...p.equipo, modelo: v}}))}/>
          <StableInput label="Nº Serie (SN)" value={intervention.equipo.sn} onChange={(v:any) => setIntervention(p => ({...p, equipo: {...p.equipo, sn: v}}))}/>
        </div>
      </section>

      {/* 2. CHECKLISTS POR SECCIONES */}
      {Object.entries(CHECKLIST_SECTIONS).map(([section, items]) => (
        <section key={section} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
          <h3 className="font-black text-slate-400 text-xs uppercase tracking-widest">{section}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map(it => (
              <div key={it} className="p-4 rounded-2xl flex justify-between items-center border border-slate-50 bg-slate-50/50">
                <span className="text-[11px] font-bold text-slate-700 leading-tight pr-2">{it}</span>
                <div className="flex gap-1">
                  {["OK", "DEF", "AVR", "CMB"].map(st => (
                    <button 
                      key={st} 
                      onClick={() => setIntervention(p => ({...p, check: {...p.check, [it]: st}}))} 
                      className={`w-10 h-8 rounded-lg text-[8px] font-black border-2 transition-all ${intervention.check[it] === st ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-100 text-slate-300'}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* 3. OBSERVACIONES / TEXTO DE VOZ */}
      <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3"><Type className="text-amber-500"/> Notas del Informe</h2>
        <textarea 
          className="w-full h-64 bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8 outline-none focus:border-amber-500 font-medium text-slate-600 shadow-inner resize-none leading-relaxed" 
          placeholder="Aquí aparecerá lo que dictes por voz..." 
          value={intervention.observaciones} 
          onChange={e => setIntervention(p => ({...p, observaciones: e.target.value}))}
        />
      </section>

      {/* 4. FIRMA CLIENTE */}
      <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-6 text-center">
        <StableInput label="Persona que recibe" icon={Users} value={intervention.recibidoPor} onChange={(v:any) => setIntervention(p => ({...p, recibidoPor: v}))}/>
        <div className="bg-slate-50 h-48 border-2 border-dashed rounded-[3rem] relative shadow-inner">
           <canvas ref={canvasRef} className="w-full h-full cursor-crosshair touch-none" />
        </div>
        <button onClick={() => {}} className="text-red-500 font-black text-[10px] uppercase tracking-widest">Limpiar Firma</button>
      </section>

      {/* ACCIÓN FINAL */}
      <button className="w-full p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl font-black text-4xl uppercase tracking-tighter hover:scale-[1.02] transition-all flex flex-col items-center justify-center gap-2">
        <Save className="text-amber-500" size={40}/>
        <div>
          <span>Finalizar e Iniciar</span>
          <span className="block text-lg">Sincronización</span>
        </div>
      </button>

    </div>
  );
}
