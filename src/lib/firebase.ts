
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "@/firebase/config";


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Nombres de las colecciones de la base de datos
export const COLLECTIONS = {
  USERS: 'usuarios',
  INSPECTIONS: 'inspecciones',
  EXPENSES: 'gastos',
  PARTES_DIARIOS: 'partes_diarios',
  INTERVENCIONES: 'intervenciones',
};

export { app, db, auth, storage };
