'use client';

import React, { useState, useEffect } from 'react';
import { auth, db, COLLECTIONS } from '@/lib/firebase'; // Asegúrate de que COLLECTIONS esté exportado en tu firebase.ts
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  query, 
  onSnapshot, 
  Unsubscribe 
} from 'firebase/firestore';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Receipt, 
  Users, 
  Globe, 
  LogOut, 
  Mail, 
  Lock,
  ChevronRight,
  Loader2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  UserPlus
} from 'lucide-react';

type AdminView = 'dashboard' | 'intervenciones' | 'gastos' | 'inspectores' | 'cms';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  
  // Estados de Datos Reales
  const [stats, setStats] = useState({
    totalIntervenciones: 0,
    totalGastos: 0,
    totalInspectores: 0,
    eficiencia: 0
  });

  // Estados para Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // 1. Lógica de Firebase en Tiempo Real
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    let unsubIntervenciones: Unsubscribe;
    let unsubGastos: Unsubscribe;

    if (user) {
      // Escuchar Intervenciones
      unsubIntervenciones = onSnapshot(collection(db, "INTERVENCIONES"), (snap) => {
        const total = snap.size;
        const finalizadas = snap.docs.filter(d => d.data().estado === 'finalizado').length;
        setStats(prev => ({ 
          ...prev, 
          totalIntervenciones: total,
          eficiencia: total > 0 ? Math.round((finalizadas / total) * 100) : 0
        }));
      });

      // Escuchar Gastos (Partes Diarios)
      unsubGastos = onSnapshot(collection(db, "PARTES_DIARIOS"), (snap) => {
        const suma = snap.docs.reduce((acc, doc) => acc + (Number(doc.data().monto) || 0), 0);
        setStats(prev => ({ ...prev, totalGastos: suma }));
      });
    }

    return () => {
      unsubAuth();
      if (unsubIntervenciones) unsubIntervenciones();
      if (unsubGastos) unsubGastos();
    };
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoginError('Error de acceso.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-emerald-500" /></div>;

  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
            <h1 className="text-2xl font-bold text-slate-900 text-center mb-8">Energy Engine Admin</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" placeholder="Email" className="w-full p-3 border rounded-xl" onChange={e => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" className="w-full p-3 border rounded-xl" onChange={e => setPassword(e.target.value)} />
              <button className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold">Entrar</button>
            </form>
          </div>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 fixed h-full flex flex-col p-6">
        <div className="mb-10 px-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">ENERGY ENGINE</h2>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Control Panel</p>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'intervenciones', label: 'Intervenciones', icon: ClipboardList },
            { id: 'gastos', label: 'Control Gastos', icon: Receipt },
            { id: 'inspectores', label: 'Inspectores', icon: Users },
            { id: 'cms', label: 'Contenido Web', icon: Globe },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveView(item.id as AdminView)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeView === item.id ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={() => signOut(auth)} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 transition-colors text-sm font-medium">
          <LogOut className="w-5 h-5" /> Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 capitalize tracking-tighter">
            {activeView}
          </h1>
        </header>

        {/* --- VISTA DASHBOARD --- */}
        {activeView === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Intervenciones" value={stats.totalIntervenciones} icon={<ClipboardList className="text-emerald-600" />} />
              <StatCard title="Gastos Totales" value={`${stats.totalGastos}€`} icon={<Receipt className="text-amber-600" />} />
              <StatCard title="Inspectores" value="4" icon={<Users className="text-blue-600" />} />
              <StatCard title="Eficiencia" value={`${stats.eficiencia}%`} icon={<TrendingUp className="text-emerald-600" />} />
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-slate-900 font-bold text-lg">Progreso de Operaciones</h3>
                    <span className="text-emerald-600 font-black text-2xl">{stats.eficiencia}%</span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-emerald-500 transition-all duration-1000 ease-out" 
                        style={{ width: `${stats.eficiencia}%` }}
                    />
                </div>
                <p className="mt-4 text-slate-500 text-sm italic text-center">Datos calculados en base a intervenciones finalizadas vs totales.</p>
            </div>
          </div>
        )}

        {/* --- VISTA INSPECTORES --- */}
        {activeView === 'inspectores' && (
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 flex justify-between items-center border-b border-slate-100">
                <h3 className="text-slate-900 font-bold text-xl">Plantilla Técnica</h3>
                <button onClick={() => alert('Abriendo formulario de asignación...')} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
                    <UserPlus className="w-4 h-4" /> Asignar Tarea
                </button>
            </div>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                        <th className="px-8 py-4">Nombre Completo</th>
                        <th className="px-8 py-4">DNI / NIE</th>
                        <th className="px-8 py-4 text-center">Estado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {[
                        { name: "Carlos Esteban Amarilla Bogado", id: "70287885-T" },
                        { name: "Antonio Ugena Del Cerro", id: "50475775-K" },
                        { name: "Mocanu Baluta", id: "X4266252-M" },
                        { name: "Juan Carlos Cabral", id: "X-6112156-K" }
                    ].map((tec, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-8 py-5 text-slate-900 font-semibold">{tec.name}</td>
                            <td className="px-8 py-5 text-slate-500 font-mono text-sm">{tec.id}</td>
                            <td className="px-8 py-5">
                                <div className="flex justify-center">
                                    <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-100">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        Activo
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        )}

        {/* Placeholder para otras vistas */}
        {activeView !== 'dashboard' && activeView !== 'inspectores' && (
            <div className="bg-white min-h-[400px] rounded-[2rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold uppercase text-xs tracking-widest">Módulo {activeView} pronto disponible</p>
            </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-3">
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      </div>
      <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
  );
}
