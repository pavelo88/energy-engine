
'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, Camera, PenTool, CheckCircle, AlertCircle, ChevronRight, ArrowLeft, Download, Database, Battery, Zap, Thermometer, FileText, User, History, Save, Printer, Trash2, Lock, LogOut, LayoutDashboard, ClipboardList, RefreshCw, HardDrive } from 'lucide-react';

/**

ENERGYTRACK PRO - ENERGY ENGINE ENTERPRISE
Optimizado para Android/Tablets | Funcionalidad Offline-First */
// --- BASE DE DATOS DE ACTIVOS (Basada en Revision.xlsx) ---
const ASSETS_DB = {
  "Aeropuerto de Valencia (VLC)": [
    { id: "M-3209", modelo: "DEUTZ BF4M1013EC", sn: "00481993", potencia: "110 kVA", cliente: "AENA / JJ PASCUAL", estado: "Operativo" },
    { id: "M-3210", modelo: "DEUTZ BF4M1013EC", sn: "00481994", potencia: "110 kVA", cliente: "AENA / JJ PASCUAL", estado: "Mantenimiento" },
    { id: "GEN-AUX-VLC", modelo: "CATERPILLAR C4.4", sn: "CAT-VLC-01", potencia: "55 kVA", cliente: "AENA", estado: "Operativo" }
  ],
  "Madrid-Barajas (MAD)": [
    { id: "M-5001", modelo: "DEUTZ TCD2013", sn: "MAD-882", potencia: "250 kVA", cliente: "AENA", estado: "Operativo" },
    { id: "M-5002", modelo: "DEUTZ TCD2013", sn: "MAD-883", potencia: "250 kVA", cliente: "AENA", estado: "Alerta" }
  ]
};

const SECCIONES_CHECKLIST = [
  { nombre: "Inspección Motor", campos: ["Nivel lubricante", "Nivel refrigerante", "Fugas aceite", "Estado correas"] },
  { nombre: "Sistemas Críticos", campos: ["Resistencia de caldeo", "Mantenedor baterías", "Contactores", "Reles auxiliares"] },
  { nombre: "Recambios (Excel)", campos: ["Filtro combustible", "Filtro aceite", "Filtro aire", "Anticongelante"] }
];

export default function App() {
  // --- Estados de Autenticación ---
  const [user, setUser] = useState(null); // { role: 'admin' | 'inspector' }
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  // --- Estados de Navegación ---
  const [view, setView] = useState('selector'); // selector, inspection, summary, database
  const [selectedInstalacion, setSelectedInstalacion] = useState('');
  const [selectedGrupo, setSelectedGrupo] = useState(null);

  // --- Estados de Formulario ---
  const [checklist, setChecklist] = useState({});
  const [mediciones, setMediciones] = useState({ horas: '', presion: '', temp: '', carga: '' });
  const [gps, setGps] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isSigned, setIsSigned] = useState(false);
  const canvasRef = useRef(null);

  const reset = useCallback(() => {
    setChecklist({});
    setMediciones({ horas: '', presion: '', temp: '', carga: '' });
    setGps(null);
    setPhotos([]);
    setIsSigned(false);
    setSelectedGrupo(null);
    setSelectedInstalacion('');
    if(canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0,0,600,192);
    }
  }, []);

  // --- Lógica de Login ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === '1234') {
      setUser({ role: 'admin', name: 'Administrador Central' });
      setView('database');
      setError('');
    } else if (loginForm.username === 'inspector' && loginForm.password === '567') {
      setUser({ role: 'inspector', name: 'Antonio Ugena' });
      setView('selector');
      setError('');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  // --- Lógica de Firma (Inspector) ---
  useEffect(() => {
    if (view === 'inspection' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#334155'; // slate-700
      ctx.lineWidth = 2;
      let drawing = false;

      const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
      };

      const start = (e) => { drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); };
      const move = (e) => { if(!drawing) return; e.preventDefault(); const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
      const stop = () => { drawing = false; setIsSigned(true); };

      canvas.addEventListener('mousedown', start);
      canvas.addEventListener('mousemove', move);
      canvas.addEventListener('mouseup', stop);
      canvas.addEventListener('touchstart', start, { passive: false });
      canvas.addEventListener('touchmove', move, { passive: false });
      canvas.addEventListener('touchend', stop);
      
      return () => {
        canvas.removeEventListener('mousedown', start);
        canvas.removeEventListener('mousemove', move);
        canvas.removeEventListener('mouseup', stop);
        canvas.removeEventListener('touchstart', start);
        canvas.removeEventListener('touchmove', move);
        canvas.removeEventListener('touchend', stop);
      }
    }

  }, [view]);

  // --- Acciones ---
  const handleCheck = (campo, valor) => setChecklist(prev => ({ ...prev, [campo]: valor }));
  const obtenerGPS = () => {
    setGps("Buscando señal...");
    setTimeout(() => setGps("39.4893° N, 0.4817° W"), 1500);
  };
  const logout = () => {
    setUser(null);
    setView('selector');
    setLoginForm({ username: '', password: '' });
    reset();
  };

  // --- Renderizado Condicional: LOGIN ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
          <div className="bg-slate-800 p-8 text-center border-b-4 border-amber-500">
            <div className="w-16 h-16 bg-amber-500 rounded-2xl mx-auto flex items-center justify-center font-black text-slate-900 text-3xl mb-4">E</div>
            <h1 className="text-white font-bold text-2xl tracking-tight">ENERGY ENGINE</h1>
            <p className="text-amber-400 text-[10px] font-mono tracking-widest uppercase mt-1">Acceso Seguridad Industrial</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold border border-red-100 flex items-center gap-2"><AlertCircle size={14}/> {error}</div>}
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Usuario</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-slate-300" size={18}/>
                  <input type="text" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 pl-12 outline-none focus:border-amber-500 transition-all" placeholder="admin o inspector" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-300" size={18}/>
                  <input type="password" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 pl-12 outline-none focus:border-amber-500 transition-all" placeholder="••••" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
                </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"> INGRESAR AL SISTEMA </button>
            <p className="text-center text-[10px] text-slate-400 uppercase font-bold tracking-widest">Protocolo Offline v2.0</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* NAVBAR */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg border-b-2 border-amber-500 print:hidden">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center font-bold text-slate-900">E</div>
            <span className="font-black text-sm tracking-tighter">ENERGY ENGINE</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-bold text-amber-500 leading-none">{user.name}</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-tighter">{user.role}</p>
            </div>
            {user.role === 'admin' && (
              <button 
                onClick={() => setView('database')}
                className={`p-2 rounded-lg transition-colors ${view === 'database' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
              >
                <LayoutDashboard size={20} />
              </button>
            )}
            <button onClick={logout} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8">

        {/* VISTA: ADMIN DASHBOARD / DATABASE */}
        {user.role === 'admin' && view === 'database' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Total Activos</p>
                <div className="flex justify-between items-end">
                  <span className="text-4xl font-black text-slate-900">124</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">DEUTZ / CAT</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Revisiones Hoy</p>
                <div className="flex justify-between items-end">
                  <span className="text-4xl font-black text-slate-900">08</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">100% OK</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Estado Sistema</p>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-black text-emerald-600 uppercase tracking-tighter">Conectado</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Sinc. 2m ago</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-bold flex items-center gap-2"><HardDrive className="text-amber-500" size={18}/> Base de Datos de Infraestructura</h2>
                <div className="flex gap-2">
                  <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"><RefreshCw size={16}/></button>
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                    <Download size={14}/> EXPORTAR REPORTE
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">ID Activo</th>
                      <th className="px-6 py-4">Ubicación</th>
                      <th className="px-6 py-4">Motor / Modelo</th>
                      <th className="px-6 py-4">Potencia</th>
                      <th className="px-6 py-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {Object.entries(ASSETS_DB).map(([city, assets]) => (
                      assets.map(asset => (
                        <tr key={asset.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4 font-bold text-slate-900">{asset.id}</td>
                          <td className="px-6 py-4 text-xs text-slate-500">{city}</td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-600">{asset.modelo}</td>
                          <td className="px-6 py-4 text-xs font-bold">{asset.potencia}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                              asset.estado === 'Operativo' ? 'bg-emerald-100 text-emerald-700' : 
                              asset.estado === 'Alerta' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {asset.estado}
                            </span>
                          </td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VISTA: INSPECTOR FLOW */}
        {user.role === 'inspector' && (
          <div className="space-y-6">
            
            {/* 1. Selector de Activo */}
            {view === 'selector' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <h2 className="text-xl font-black flex items-center gap-2"><ClipboardList className="text-amber-500"/> Nueva Inspección Técnica</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Instalación / Aeropuerto</label>
                      <select 
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-amber-500 transition-all font-bold"
                        value={selectedInstalacion}
                        onChange={e => { setSelectedInstalacion(e.target.value); setSelectedGrupo(null); }}
                      >
                        <option value="">-- Seleccionar --</option>
                        {Object.keys(ASSETS_DB).map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                    {selectedInstalacion && (
                      <div className="animate-in zoom-in-95">
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">ID Grupo Electrógeno</label>
                        <div className="grid gap-2">
                          {ASSETS_DB[selectedInstalacion].map(g => (
                            <button 
                              key={g.id}
                              onClick={() => setSelectedGrupo(g)}
                              className={`p-4 rounded-xl border-2 text-left transition-all hover:border-amber-500 hover:shadow-md active:scale-95 ${
                                selectedGrupo?.id === g.id ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'border-slate-100 bg-white'
                              }`}
                            >
                              <p className="font-black text-slate-900">{g.id}</p>
                              <p className="text-[10px] font-mono text-slate-400 uppercase">{g.modelo}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {selectedGrupo && (
                  <button 
                    onClick={() => setView('inspection')}
                    className="w-full bg-slate-900 text-white p-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 shadow-2xl hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    INICIAR REVISIÓN DE CAMPO <ChevronRight size={24}/>
                  </button>
                )}
              </div>
            )}

            {/* 2. Formulario de Inspección */}
            {view === 'inspection' && (
              <div className="animate-in fade-in duration-300 space-y-6 print:hidden">
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex justify-between items-center border-b-4 border-amber-500">
                  <div>
                    <span className="text-[10px] font-black text-amber-500 uppercase">Activo</span>
                    <h2 className="text-3xl font-black">{selectedGrupo.id}</h2>
                    <p className="text-xs font-mono opacity-50">{selectedGrupo.modelo} | SN: {selectedGrupo.sn}</p>
                  </div>
                  <button onClick={() => setView('selector')} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><ArrowLeft size={20}/></button>
                </div>

                {SECCIONES_CHECKLIST.map((sec, i) => (
                  <section key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="bg-slate-50 p-4 border-b border-slate-100 font-black text-[10px] text-slate-400 uppercase tracking-widest">{sec.nombre}</div>
                    <div className="divide-y divide-slate-50">
                      {sec.campos.map(campo => (
                        <div key={campo} className="p-5 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-slate-50 transition-colors">
                          <span className="text-sm font-bold text-slate-700">{campo}</span>
                          <div className="flex gap-1.5 overflow-x-auto">
                            {['OK', 'DEF', 'AVR', 'CAM'].map(status => (
                              <button
                                key={status}
                                onClick={() => handleCheck(campo, status)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black border-2 transition-all hover:scale-105 ${
                                  checklist[campo] === status ? 'bg-amber-500 border-amber-500 text-slate-900 shadow-md ring-2 ring-amber-100' : 'bg-white border-slate-100 text-slate-400'
                                }`}
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

                <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {['horas', 'presion', 'temp', 'carga'].map(f => (
                      <div key={f} className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase">{f}</label>
                        <input type="number" step="0.1" className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold focus:border-amber-500 outline-none" onChange={e => setMediciones({...mediciones, [f]: e.target.value})} />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={obtenerGPS} className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-black text-sm transition-all hover:scale-[1.02] ${gps ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <MapPin size={18}/> {gps || "Validar GPS"}
                    </button>
                    <div className="flex-1 relative">
                      <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setPhotos([...photos, ...Array.from(e.target.files)])} />
                      <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center gap-2 font-black text-slate-400 text-sm hover:bg-slate-50 transition-all">
                        <Camera size={18}/> {photos.length > 0 ? `${photos.length} Fotos` : "Adjuntar Fotos"}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase">Firma del Técnico</h3>
                  <div className="bg-slate-50 h-48 rounded-2xl border-2 border-slate-100 relative">
                    <canvas ref={canvasRef} width={600} height={192} className="w-full h-full cursor-crosshair touch-none" />
                    {!isSigned && <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 italic text-sm">Firma aquí</div>}
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <button onClick={() => { const ctx = canvasRef.current.getContext('2d'); ctx.clearRect(0,0,600,192); setIsSigned(false); }} className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"><Trash2 size={14}/> REINICIAR</button>
                    <button 
                      disabled={!isSigned}
                      onClick={() => setView('summary')}
                      className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-emerald-700 transition-all disabled:opacity-20 flex items-center gap-2"
                    >
                      <span>GENERAR REPORTE</span>
                      <Save size={20}/>
                    </button>
                  </div>
                </section>
              </div>
            )}

            {/* 3. Resumen y PDF */}
            {view === 'summary' && selectedGrupo && (
              <div className="space-y-8 animate-in zoom-in-95 duration-500">
                <div className="text-center space-y-4 print:hidden">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white"><CheckCircle size={40}/></div>
                  <h2 className="text-3xl font-black text-slate-900">Inspección Finalizada</h2>
                </div>

                {/* REPORTE PRINT-READY */}
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 mx-auto max-w-3xl overflow-hidden">
                  <div className="flex justify-between items-start border-b-4 border-slate-900 pb-6 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-900 text-amber-500 rounded-xl flex items-center justify-center font-black text-2xl">E</div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900">ENERGY ENGINE</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Field Maintenance Division</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Reporte No.</p>
                      <p className="text-lg font-mono font-black">R-20260038</p>
                      <p className="text-xs font-bold text-slate-500 uppercase">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="border-l-4 border-amber-500 pl-4 space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase">Instalación</span>
                      <p className="text-sm font-bold">{selectedInstalacion}</p>
                      <p className="text-[10px] text-slate-500 uppercase">GPS: {gps || 'No validado'}</p>
                    </div>
                    <div className="border-l-4 border-slate-200 pl-4 space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase">Activo Crítico</span>
                      <p className="text-sm font-bold">GRUPO {selectedGrupo.id}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-mono">{selectedGrupo.modelo} | SN: {selectedGrupo.sn}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl mb-10 border border-slate-100 grid grid-cols-4 gap-4 text-center">
                    {['horas', 'presion', 'temp', 'carga'].map(m => (
                      <div key={m}>
                        <span className="block text-[8px] font-black text-slate-400 uppercase">{m}</span>
                        <span className="text-sm font-black text-slate-900">{mediciones[m] || 'N/A'}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-x-12 gap-y-2 mb-10">
                    {Object.entries(checklist).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-slate-50 py-1 text-[10px]">
                        <span className="text-slate-400 italic">{key}:</span>
                        <span className={`font-black ${val === 'OK' ? 'text-emerald-600' : 'text-red-600'}`}>{val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-end mt-12 pt-8 border-t border-slate-100">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Técnico de Campo</p>
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="w-40 h-16 border-b border-slate-200 flex items-center justify-center">
                        {isSigned && <img alt="Firma" src={canvasRef.current.toDataURL()} className="max-h-full grayscale contrast-125" />}
                      </div>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Firma Digitalizada</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 max-w-sm mx-auto print:hidden">
                  <button onClick={() => window.print()} className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
                    <Printer size={22} className="text-amber-500"/> GENERAR REPORTE PDF
                  </button>
                  <button onClick={() => { reset(); setView('selector'); }} className="w-full bg-white border-2 border-slate-200 text-slate-600 p-5 rounded-2xl font-bold hover:bg-slate-50 transition-colors">NUEVA REVISIÓN</button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <footer className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-2 text-center text-[8px] text-slate-400 uppercase tracking-widest print:hidden">
        Energy Engine Field Ops • Protocolo de Seguridad Galapagar
      </footer>

      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
