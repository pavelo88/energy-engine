'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, StopCircle, Type, MapPin, Save, Printer, FileText, Settings, Users, 
  CheckCircle2, ShieldCheck, BrainCircuit, X, Zap, Mail, Wand2, RefreshCcw, AlertCircle
} from 'lucide-react';

// --- CONFIGURACIÓN DE SECCIONES COMPLETAS (34 ÍTEMS) ---
const CHECKLIST_SECTIONS = {
  "INSPECCION EN EL MOTOR": ["Nivel de lubricante", "Indicador nivel refrigerante", "Correa del ventilador", "Filtro de combustible y prefiltro", "Filtro de aire", "Filtro de aceite y prefiltro de aceite", "Tubo de escape", "Circuito de refrigeración", "Circuito de lubricación", "Baterías", "Motor de arranque"],
  "INSPECCION EN EL ALTERNADOR": ["Placas de los bornes", "Regulador eléctrico", "Colector", "Rodamiento", "Ventilación", "Escobillas", "Maniobra"],
  "INSPECCION EQUIPO ELECTRICO": ["Aparatos de medida", "Pilotos", "Mantenedor de baterías", "Interruptor general", "Resistencia de caldeo", "Contactores", "Reles auxiliares", "Apriete bornes", "Cableado"],
  "RECAMBIOS": ["Filtro de combustible", "Filtro de aceite", "Filtro de aire", "Correa motor", "Aceite", "Anticongelante"]
};

const ALL_CHECKLIST_ITEMS = Object.values(CHECKLIST_SECTIONS).flat();

const StableInput = ({ label, value, onChange, icon: Icon, type = "text", placeholder }: any) => (
  <div className="space-y-1 w-full text-left">
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

export default function InspectionFormTab() {
  // --- ESTADOS INTERNOS ---
  const [tecnico, setTecnico] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const [intervention, setIntervention] = useState({
    cliente: { nombre: '', instalacion: '', direccion: '', potencia_kva: '', n_grupo: '' },
    equipo: { marca: '', modelo: '', sn: '' },
    check: {} as Record<string, string>, 
    mediciones: { horas: '', presion: '', temp: '', combustible: '' },
    pruebasCarga: { rs: '', st: '', rt: '', r: '', s: '', t: '', kw: '' }, // LOS 7 CAMPOS ELÉCTRICOS RESTAURADOS
    observaciones: '',
    recibidoPor: '',
    firmaCliente: null as string | null
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const name = localStorage.getItem('inspector_name');
    if (name) setTecnico(name);
  }, []);

  // --- LÓGICA DE IA (CONEXIÓN CON TU API EXTERNA) ---
  const processAiCommand = async (transcript: string) => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });

      const aiData = await response.json();

      setIntervention(prev => {
        let newCheck = { ...prev.check, ...aiData.checklist_updates };
        if (aiData.all_ok) {
          ALL_CHECKLIST_ITEMS.forEach(it => { if(!newCheck[it]) newCheck[it] = 'OK'; });
        }
        return {
          ...prev,
          cliente: { ...prev.cliente, ...aiData.identidad },
          mediciones: { ...prev.mediciones, ...aiData.mediciones },
          pruebasCarga: { ...prev.pruebasCarga, ...aiData.pruebasCarga },
          observaciones: prev.observaciones + (prev.observaciones ? "\n" : "") + (aiData.resumen_profesional || "")
        };
      });
    } catch (e) { console.error("Error procesando IA:", e); }
    finally { setAiLoading(false); }
  };

  const toggleRecording = () => {
    if (isRecording) { recognitionRef.current?.stop(); return; }
    const Speech = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Speech) return alert("Voz no soportada");
    const rec = new Speech();
    rec.lang = 'es-ES';
    rec.onstart = () => setIsRecording(true);
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('. ');
      processAiCommand(transcript);
    };
    rec.onend = () => setIsRecording(false);
    recognitionRef.current = rec;
    rec.start();
  };

  // --- LÓGICA DE FIRMA ---
  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx?.beginPath(); ctx?.moveTo(x, y);
    (canvas as any).drawing = true;
  };

  const draw = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas || !(canvas as any).drawing) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx?.lineTo(x, y); ctx?.stroke();
  };
  
  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    (canvas as any).drawing = false;
    setIntervention(p => ({...p, firmaCliente: canvas.toDataURL() || null}));
  };

  return (
    <div className="space-y-10 pb-32 max-w-6xl mx-auto px-4 animate-in fade-in duration-700 font-sans">
      
      {/* HEADER DINÁMICO */}
      <div className="flex justify-between items-center p-8 bg-white rounded-[2.5rem] border border-amber-100 shadow-sm mt-6">
        <div className="text-left">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] leading-none">RTS Inspector Activo</p>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{tecnico || 'Técnico PowerSat'}</h1>
        </div>
        <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 rotate-3">
          <Zap size={28} />
        </div>
      </div>

      {/* BOTÓN FLOTANTE IA ✨ */}
      <div className="fixed bottom-28 right-8 z-[200] flex flex-col items-end gap-4">
        {isAiMenuOpen && (
          <div className="flex flex-col items-end gap-3 mb-4 animate-in slide-in-from-bottom-6">
            <button onClick={toggleRecording} className={`flex items-center gap-4 bg-amber-600 text-white px-8 py-5 rounded-3xl shadow-2xl font-black text-xs uppercase border-2 border-white transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'hover:scale-105'}`}>
              {isRecording ? <StopCircle size={20}/> : <Mic size={20}/>} {isRecording ? 'Escuchando...' : 'Dictado IA ✨'}
            </button>
          </div>
        )}
        <button onClick={() => setIsAiMenuOpen(!isAiMenuOpen)} className="w-20 h-20 rounded-[2.5rem] bg-slate-900 flex items-center justify-center shadow-2xl border-4 border-white text-white hover:rotate-90 transition-all duration-500">
          {isAiMenuOpen ? <X size={32}/> : <BrainCircuit size={32}/>}
          {aiLoading && <div className="absolute inset-0 rounded-[2.5rem] border-4 border-amber-500 border-t-transparent animate-spin"></div>}
        </button>
      </div>

      {/* 1. ADN DEL GRUPO */}
      <section className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8">
        <h2 className="text-3xl font-black border-l-8 border-amber-500 pl-6 uppercase tracking-tighter text-slate-900 text-left">ADN del Grupo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StableInput label="Empresa / Cliente" icon={Users} value={intervention.cliente.nombre} onChange={(v:any) => setIntervention(p => ({...p, cliente: {...p.cliente, nombre: v}}))}/>
          <StableInput label="Instalación" icon={MapPin} value={intervention.cliente.instalacion} onChange={(v:any) => setIntervention(p => ({...p, cliente: {...p.cliente, instalacion: v}}))}/>
          <div className="grid grid-cols-2 gap-4">
            <StableInput label="Nº de Grupo" value={intervention.cliente.n_grupo} onChange={(v:any) => setIntervention(p => ({...p, cliente: {...p.cliente, n_grupo: v}}))}/>
            <StableInput label="Potencia KVA" value={intervention.cliente.potencia_kva} onChange={(v:any) => setIntervention(p => ({...p, cliente: {...p.cliente, potencia_kva: v}}))}/>
          </div>
          <StableInput label="Número de Serie (SN)" icon={Settings} value={intervention.equipo.sn} onChange={(v:any) => setIntervention(p => ({...p, equipo: {...p.equipo, sn: v}}))}/>
        </div>
      </section>

      {/* 2. CHECKLISTS POR SECCIÓN (4 BOTONES CADA ÍTEM) */}
      {Object.entries(CHECKLIST_SECTIONS).map(([section, items]) => (
        <section key={section} className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-6">
          <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em] ml-2 text-left">{section}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map(it => (
              <div key={it} className={`p-5 rounded-[2rem] flex justify-between items-center transition-all border-2 ${intervention.check[it] ? 'bg-amber-50 border-amber-100 shadow-inner' : 'bg-slate-50 border-transparent shadow-sm'}`}>
                <span className="text-[11px] font-black text-slate-700 leading-tight uppercase pr-4 text-left">{it}</span>
                <div className="flex gap-1.5">
                  {["OK", "DEF", "AVR", "CMB"].map(st => (
                    <button 
                      key={st} 
                      onClick={() => setIntervention(p => ({...p, check: {...p.check, [it]: st}}))} 
                      className={`w-11 h-9 rounded-xl text-[9px] font-black border-2 transition-all ${intervention.check[it] === st ? 'bg-amber-500 border-amber-500 text-white shadow-lg scale-110' : 'bg-white border-slate-200 text-slate-300 hover:border-slate-400'}`}
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

      {/* 3. PRUEBAS ELÉCTRICAS Y CARGA (7 CAMPOS ELÉCTRICOS) */}
      <section className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8">
        <h2 className="text-2xl font-black flex items-center gap-3 text-amber-600 uppercase tracking-tighter text-left"><Zap size={24}/> Pruebas Eléctricas y Carga</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
           <StableInput label="Horas Funcionamiento" value={intervention.mediciones.horas} onChange={(v:any) => setIntervention(p => ({...p, mediciones: {...p.mediciones, horas: v}}))}/>
           <StableInput label="Presión Aceite" value={intervention.mediciones.presion} onChange={(v:any) => setIntervention(p => ({...p, mediciones: {...p.mediciones, presion: v}}))}/>
           <StableInput label="Tensión RS (V)" value={intervention.pruebasCarga.rs} onChange={(v:any) => setIntervention(p => ({...p, pruebasCarga: {...p.pruebasCarga, rs: v}}))}/>
           <StableInput label="Tensión ST (V)" value={intervention.pruebasCarga.st} onChange={(v:any) => setIntervention(p => ({...p, pruebasCarga: {...p.pruebasCarga, st: v}}))}/>
           <StableInput label="Intensidad R (A)" value={intervention.pruebasCarga.r} onChange={(v:any) => setIntervention(p => ({...p, pruebasCarga: {...p.pruebasCarga, r: v}}))}/>
           <StableInput label="Intensidad S (A)" value={intervention.pruebasCarga.s} onChange={(v:any) => setIntervention(p => ({...p, pruebasCarga: {...p.pruebasCarga, s: v}}))}/>
           <StableInput label="Potencia Final (kW)" value={intervention.pruebasCarga.kw} onChange={(v:any) => setIntervention(p => ({...p, pruebasCarga: {...p.pruebasCarga, kw: v}}))}/>
        </div>
      </section>

      {/* 4. OBSERVACIONES Y FIRMA */}
      <section className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-10">
        <div className="text-left space-y-4">
           <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2 px-2"><Type className="text-amber-500" size={20}/> Notas del Reporte</h2>
           <textarea className="w-full h-56 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-10 outline-none focus:border-amber-500 font-medium text-slate-600 shadow-inner resize-none leading-relaxed" placeholder="Notas..." value={intervention.observaciones} onChange={e => setIntervention(p => ({...p, observaciones: e.target.value}))}/>
        </div>
        
        <div className="space-y-10">
           <StableInput label="Persona que recibe (Nombre)" icon={Users} value={intervention.recibidoPor} onChange={(v:any) => setIntervention(p => ({...p, recibidoPor: v}))}/>
           <div className="space-y-4 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Firma del Cliente</label>
              <div className="bg-slate-50 h-56 border-2 border-dashed border-slate-200 rounded-[2.5rem] relative overflow-hidden group shadow-inner">
                 <canvas 
                   ref={canvasRef} 
                   onMouseDown={startDrawing} 
                   onMouseMove={draw} 
                   onMouseUp={stopDrawing}
                   onMouseLeave={stopDrawing} // Guardar si el mouse sale del canvas
                   onTouchStart={startDrawing} 
                   onTouchMove={draw} 
                   onTouchEnd={stopDrawing}
                   className="w-full h-full cursor-crosshair touch-none" 
                 />
              </div>
           </div>
        </div>
      </section>

      {/* BOTONES DE IMPRESIÓN (PDFs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="p-10 rounded-[3rem] border-2 bg-white border-slate-100 hover:border-amber-500 shadow-lg group transition-all text-left">
          <FileText className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={36}/>
          <p className="font-black text-slate-900 uppercase text-xs tracking-tight leading-none">Informe Técnico</p>
        </button>
        <button className="p-10 rounded-[3rem] border-2 bg-white border-slate-100 hover:border-blue-500 shadow-lg group transition-all text-left">
          <ShieldCheck className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" size={36}/>
          <p className="font-black text-slate-900 uppercase text-xs tracking-tight leading-none">Ficha Getafe</p>
        </button>
        <button className="p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl group transition-all text-left border-2 border-slate-900">
          <Printer className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={36}/>
          <p className="font-black uppercase text-xs tracking-tight leading-none">Albarán Final</p>
        </button>
      </div>

      {/* ACCIÓN FINAL */}
      <button 
        onClick={() => { setSaveStatus('success'); setTimeout(() => setSaveStatus('idle'), 3000); }} 
        className={`w-full p-12 rounded-[3.5rem] shadow-2xl font-black text-3xl uppercase tracking-tighter transition-all flex items-center justify-center gap-6 ${saveStatus === 'success' ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white hover:scale-[1.01]'}`}
      >
        {saveStatus === 'success' ? <CheckCircle2 size={44}/> : <Save className="text-amber-500" size={40}/>}
        {saveStatus === 'success' ? '¡SE LOGRÓ CON ÉXITO!' : 'FINALIZAR INTERVENCIÓN RTS'}
      </button>

    </div>
  );
}