'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, StopCircle, Zap, Activity, ClipboardCheck, 
  Save, AlertTriangle, CheckCircle2, BrainCircuit, Sparkles 
} from 'lucide-react';
import { db, COLLECTIONS } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

// --- CONFIGURACIÓN DE SECCIONES TÉCNICAS ---
const SECTIONS = {
  "MOTOR": ["Nivel lubricante", "Refrigerante", "Correas", "Filtros combustible", "Filtro aire", "Tubo escape"],
  "ALTERNADOR": ["Bornes", "Regulador", "Escobillas", "Ventilación"],
  "ELÉCTRICO": ["Baterías", "Cargador", "Interruptor Gral", "Relés", "Cableado"],
  "RECAMBIOS": ["Aceite", "Filtro Aceite", "Filtro Gasoil", "Anticongelante"]
};

const ALL_ITEMS = Object.values(SECTIONS).flat();

export default function InspectionFormTab() {
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  
  // --- ESTADO DEL FORMULARIO ---
  const [form, setForm] = useState({
    cliente: { nombre: '', instalacion: '', n_grupo: '', potencia: '' },
    equipo: { marca: '', modelo: '', sn: '' },
    check: {} as Record<string, string>,
    mediciones: { horas: '', presion: '', temp: '', bat: '' },
    carga: { rs: '', st: '', rt: '', r: '', s: '', t: '', kw: '' },
    observaciones: ''
  });

  // --- IA: DICTADO POR VOZ (GEMINI) ---
  const toggleRecording = () => {
    const Speech = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Speech) return alert("Navegador no soporta voz.");

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const rec = new Speech();
    rec.lang = 'es-ES';
    rec.continuous = false;
    rec.onstart = () => setIsRecording(true);
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      processWithAI(text);
    };
    rec.onend = () => setIsRecording(false);
    rec.start();
  };

  const processWithAI = async (text: string) => {
    setAiProcessing(true);
    // Nota: Aquí llamamos a la función callGemini que definimos al inicio
    // Para este componente, simulamos la actualización basada en el dictado
    console.log("Procesando dictado:", text);
    
    // Simulación de respuesta IA para rellenar campos
    setTimeout(() => {
      if (text.toLowerCase().includes("todo ok")) {
        const newCheck = { ...form.check };
        ALL_ITEMS.forEach(it => newCheck[it] = 'OK');
        setForm(prev => ({ ...prev, check: newCheck }));
      }
      setAiProcessing(false);
    }, 1500);
  };

  const saveReport = async () => {
    setLoading(true);
    try {
      const reportData = {
        ...form,
        fecha: serverTimestamp(),
        estado: 'finalizada',
        tipo: 'inspeccion_tecnica'
      };
      await addDoc(collection(db, COLLECTIONS.INTERVENCIONES), reportData);
      alert("¡Informe guardado y sincronizado!");
    } catch (e) {
      alert("Error al guardar: " + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      {/* BOTÓN FLOTANTE IA */}
      <div className="fixed bottom-24 right-6 z-50">
        <button 
          onClick={toggleRecording}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-emerald-600'}`}
        >
          {aiProcessing ? <BrainCircuit className="text-white animate-spin" /> : <Mic className="text-white" />}
        </button>
      </div>

      {/* CABECERA DE DATOS */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
          <Activity size={20} className="text-emerald-500" /> Identificación
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <input 
            placeholder="Cliente / Empresa" 
            className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-900"
            value={form.cliente.nombre}
            onChange={e => setForm({...form, cliente: {...form.cliente, nombre: e.target.value}})}
          />
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Nº Grupo" className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-900" value={form.cliente.n_grupo} onChange={e => setForm({...form, cliente: {...form.cliente, n_grupo: e.target.value}})} />
            <input placeholder="Potencia KVA" className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-900" value={form.cliente.potencia} onChange={e => setForm({...form, cliente: {...form.cliente, potencia: e.target.value}})} />
          </div>
        </div>
      </section>

      {/* CHECKLISTS DINÁMICOS */}
      {Object.entries(SECTIONS).map(([name, items]) => (
        <section key={name} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{name}</h3>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item} className="flex items-center justify-between p-2">
                <span className="text-sm font-bold text-slate-700">{item}</span>
                <div className="flex gap-2">
                  {['OK', 'DEF', 'CMB'].map(status => (
                    <button 
                      key={status}
                      onClick={() => setForm({...form, check: {...form.check, [item]: status}})}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black border-2 transition-all ${form.check[item] === status ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-100 text-slate-300'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* PRUEBAS DE CARGA */}
      <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl space-y-6 text-white">
        <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter">
          <Zap size={20} className="text-emerald-400" /> Pruebas con Carga
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <input placeholder="V (RS)" className="bg-white/10 p-4 rounded-2xl text-center font-bold outline-none focus:bg-white/20" onChange={e => setForm({...form, carga: {...form.carga, rs: e.target.value}})} />
          <input placeholder="V (ST)" className="bg-white/10 p-4 rounded-2xl text-center font-bold outline-none focus:bg-white/20" onChange={e => setForm({...form, carga: {...form.carga, st: e.target.value}})} />
          <input placeholder="V (RT)" className="bg-white/10 p-4 rounded-2xl text-center font-bold outline-none focus:bg-white/20" onChange={e => setForm({...form, carga: {...form.carga, rt: e.target.value}})} />
          <input placeholder="A (R)" className="bg-white/10 p-4 rounded-2xl text-center font-bold outline-none focus:bg-white/20" onChange={e => setForm({...form, carga: {...form.carga, r: e.target.value}})} />
          <input placeholder="A (S)" className="bg-white/10 p-4 rounded-2xl text-center font-bold outline-none focus:bg-white/20" onChange={e => setForm({...form, carga: {...form.carga, s: e.target.value}})} />
          <input placeholder="A (T)" className="bg-white/10 p-4 rounded-2xl text-center font-bold outline-none focus:bg-white/20" onChange={e => setForm({...form, carga: {...form.carga, t: e.target.value}})} />
        </div>
      </section>

      {/* BOTÓN GUARDAR */}
      <button 
        onClick={saveReport}
        disabled={loading}
        className="w-full p-8 bg-emerald-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-4"
      >
        {loading ? <BrainCircuit className="animate-spin" /> : <Save />}
        FINALIZAR REPORTE
      </button>
    </div>
  );
}