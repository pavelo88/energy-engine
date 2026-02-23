
'use client';

import { useState, useEffect } from 'react';
import { db, COLLECTIONS } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import InspectionForm from 'inspection/components/InspectionFormTab'; // Asumiendo que así se llama tu componente principal

export default function InspectionPage() {
  const [step, setStep] = useState<'login' | 'setup' | 'main'>('login');
  const [loading, setLoading] = useState(false);
  const [userDocId, setUserDocId] = useState<string | null>(null);
  
  // Estados de formulario
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [signature, setSignature] = useState(''); // Aquí guardarías el Base64 de la firma

  const handleLogin = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, COLLECTIONS.USUARIOS), where("dni", "==", dni));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Usuario no encontrado.");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      setUserDocId(userDoc.id);

      if (userData.esPrimerIngreso) {
        setStep('setup');
      } else {
        // Validar contraseña (en una app real, usa Firebase Auth o hashing)
        if (userData.password === password) {
          setStep('main');
        } else {
          alert("Contraseña incorrecta");
        }
      }
    } catch (error) {
      console.error("Error en login:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async () => {
    if (!userDocId || !newPassword || !signature) return;
    
    setLoading(true);
    try {
      const userRef = doc(db, COLLECTIONS.USUARIOS, userDocId);
      await updateDoc(userRef, {
        password: newPassword,
        firma: signature,
        esPrimerIngreso: false
      });
      setStep('main');
    } catch (error) {
      alert("Error guardando datos");
    } finally {
      setLoading(false);
    }
  };

  if (step === 'login') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Acceso Inspectores</h2>
          <input 
            className="w-full p-3 mb-4 border rounded" 
            placeholder="DNI / NIE" 
            value={dni} 
            onChange={(e) => setDni(e.target.value)}
          />
          <input 
            type="password" 
            className="w-full p-3 mb-6 border rounded" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-amber-500 text-white p-3 rounded-lg font-bold hover:bg-amber-600"
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Primer Ingreso</h2>
          <p className="text-slate-500 mb-6">Configura tu acceso y firma para continuar.</p>
          
          <label className="block mb-2 text-sm font-medium">Nueva Contraseña</label>
          <input 
            type="password" 
            className="w-full p-3 mb-4 border rounded" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label className="block mb-2 text-sm font-medium">Firma Digital (Base64/Dibujo)</label>
          <div className="border-2 border-dashed border-slate-300 h-32 mb-6 rounded flex items-center justify-center bg-slate-50">
            {/* Aquí deberías integrar un componente de Canvas para firmas */}
            <input 
              type="text" 
              placeholder="Simular firma con texto por ahora" 
              className="p-2 w-full mx-4"
              onChange={(e) => setSignature(e.target.value)}
            />
          </div>

          <button 
            onClick={handleSetup}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-bold"
          >
            Finalizar Configuración
          </button>
        </div>
      </div>
    );
  }

  // Si ya se logueó, mostrar el formulario de inspección
  return <InspectionForm />;
}
