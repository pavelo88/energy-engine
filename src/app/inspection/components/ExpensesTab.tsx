'use client';

import React, { useState } from 'react';
import { 
  Receipt, MapPin, Clock, Camera, Save, 
  CreditCard, Wallet, Tag, Loader2, Navigation 
} from 'lucide-react';
import { db, COLLECTIONS, storage, auth } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

export default function ExpensesTab() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  // --- ESTADO DEL GASTO / PARTE DIARIO ---
  const [form, setForm] = useState({
    rubro: 'Alimentación',
    monto: '',
    descripcion: '',
    forma_pago: 'Efectivo',
    id_intervencion: '', // Opcional: asociado a un reporte
    horas_trabajadas: ''
  });

  // --- CAPTURAR GEOLOCALIZACIÓN ---
  const getGeoLocation = () => {
    if (!navigator.geolocation) return alert("GPS no soportado");
    
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    }, (err) => alert("Error al obtener ubicación: " + err.message));
  };

  // --- CAPTURAR FOTO DEL RECIBO (Simulado con Input) ---
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const saveExpense = async () => {
    if (!form.monto || !form.descripcion) return alert("Complete los campos obligatorios");
    setLoading(true);

    try {
      let photoUrl = null;
      // Subir foto a Firebase Storage si existe
      if (photo) {
        const storageRef = ref(storage, `comprobantes/${Date.now()}.png`);
        await uploadString(storageRef, photo, 'data_url');
        photoUrl = await getDownloadURL(storageRef);
      }

      const expenseData = {
        ...form,
        id_inspector: auth.currentUser?.uid,
        email_inspector: auth.currentUser?.email,
        fecha: serverTimestamp(),
        ubicacion: location,
        comprobante_url: photoUrl, //
        estado: 'Pendiente' //
      };

      await addDoc(collection(db, COLLECTIONS.PARTES_DIARIOS), expenseData); //
      
      alert("Parte diario guardado exitosamente");
      // Resetear form
      setForm({ rubro: 'Alimentación', monto: '', descripcion: '', forma_pago: 'Efectivo', id_intervencion: '', horas_trabajadas: '' });
      setPhoto(null);
      setLocation(null);

    } catch (e) {
      alert("Error al guardar: " + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* SECCIÓN DE DATOS DEL GASTO */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Receipt size={20} />
          </div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Nuevo Gasto / Parte</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Rubro del Gasto</label>
            <select 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
              value={form.rubro}
              onChange={e => setForm({...form, rubro: e.target.value})}
            >
              {['Alimentación', 'Combustible', 'Peajes', 'Hospedaje', 'Repuestos', 'Otros'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Monto (€)</label>
              <input 
                type="number"
                placeholder="0.00"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-900"
                value={form.monto}
                onChange={e => setForm({...form, monto: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Horas Trabajo</label>
              <input 
                type="number"
                placeholder="H/H"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-900"
                value={form.horas_trabajadas}
                onChange={e => setForm({...form, horas_trabajadas: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Descripción del trabajo / gasto</label>
            <textarea 
              placeholder="Ej: Almuerzo en ruta Getafe o Compra de filtros..."
              className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-900 h-24 resize-none"
              value={form.descripcion}
              onChange={e => setForm({...form, descripcion: e.target.value})}
            />
          </div>
        </div>
      </section>

      {/* GEOLOCALIZACIÓN Y COMPROBANTE */}
      <section className="grid grid-cols-2 gap-4">
        <button 
          onClick={getGeoLocation}
          className={`p-6 rounded-[2rem] border-2 flex flex-col items-center justify-center gap-2 transition-all ${location ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-slate-100 text-slate-400'}`}
        >
          <MapPin size={24} />
          <span className="text-[9px] font-black uppercase tracking-widest text-center">
            {location ? 'Ubicación OK' : 'Capturar GPS'}
          </span>
        </button>

        <label className={`p-6 rounded-[2rem] border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${photo ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-slate-100 text-slate-400'}`}>
          <Camera size={24} />
          <span className="text-[9px] font-black uppercase tracking-widest text-center">
            {photo ? 'Foto Lista' : 'Subir Recibo'}
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </label>
      </section>

      {/* ACCIÓN FINAL */}
      <button 
        onClick={saveExpense}
        disabled={loading}
        className="w-full p-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin text-emerald-500" /> : <Save className="text-emerald-500" />}
        GUARDAR PARTE DIARIO
      </button>

      {location && (
        <p className="text-center text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          Lat: {location.lat.toFixed(4)} • Lng: {location.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
}