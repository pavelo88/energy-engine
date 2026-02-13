
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, getDoc, updateDoc, addDoc, setDoc, query, where, serverTimestamp } from 'firebase/firestore';
import type { User, Asset, Report, WebContent, UserRole } from './types';
import { PlaceHolderImages } from './placeholder-images';

// MOCK DATA FOR USERS (role switching simulation)
const users: User[] = [
  { uid: 'admin-01', nombre: 'Admin User', rol: 'admin', isFirstLogin: false, avatarUrl: PlaceHolderImages.find(i => i.id === 'avatar-1')?.imageUrl },
  { uid: 'gerente-01', nombre: 'Gerente User', rol: 'gerente', isFirstLogin: false, avatarUrl: PlaceHolderImages.find(i => i.id === 'avatar-2')?.imageUrl },
  { uid: 'inspector-01', nombre: 'Inspector User', rol: 'inspector', isFirstLogin: true, avatarUrl: PlaceHolderImages.find(i => i.id === 'avatar-3')?.imageUrl },
];
export const USER_ROLES: UserRole[] = ['admin', 'gerente', 'inspector'];

export async function getUsers(): Promise<User[]> {
  // This remains a mock to allow for easy user role simulation without a full auth implementation
  return users;
}

export async function getUser(uid: string): Promise<User | undefined> {
    // Mock implementation
  return users.find(u => u.uid === uid);
}


// FIRESTORE-BACKED FUNCTIONS
export async function getAssets(): Promise<Asset[]> {
    const assetsCollection = collection(db, 'assets');
    const assetSnapshot = await getDocs(assetsCollection);
    const assets = assetSnapshot.docs.map(doc => doc.data() as Asset);
    return assets;
}

export async function getAsset(id_bien: string): Promise<Asset | undefined> {
    const assetDoc = await getDoc(doc(db, 'assets', id_bien));
    return assetDoc.exists() ? assetDoc.data() as Asset : undefined;
}

export async function getReports(): Promise<Report[]> {
    const reportsCollection = collection(db, 'reports');
    const reportSnapshot = await getDocs(reportsCollection);
    const reports = reportSnapshot.docs.map(doc => doc.data() as Report);
    // Sort by descending end time
    return reports.sort((a, b) => b.tiempos.fin - a.tiempos.fin);
}

export async function getWebContent(): Promise<WebContent> {
    const docRef = doc(db, 'web_content', 'config_principal');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as WebContent;
    } else {
        // Return a default structure if it doesn't exist, which can be saved later
        return {
            id: 'config_principal',
            hero: {
                titulo: 'INGENIERÍA ENERGÉTICA DE VANGUARDIA',
                subitulo: 'Maximizando la eficiencia y fiabilidad de activos críticos en infraestructuras clave.',
                imagen_id: 'hero-image'
            },
            servicios: [
                { icono: 'mantenimiento', titulo: 'Mantenimiento Integral', descripcion: 'Mantenimiento preventivo, correctivo y cambios de componentes (aceite, filtros, etc.) para todo tipo de generadores multimarca.' },
                { icono: 'inspeccion', titulo: 'Inspecciones y Revisiones', descripcion: 'Inspecciones técnicas detalladas y revisiones a medida según las necesidades del cliente para garantizar el óptimo funcionamiento.' },
                { icono: 'suministro', titulo: 'Suministro Urgente de Recambios', descripcion: 'Provisión de todo tipo de recambios y componentes críticos en tiempo récord para minimizar la inactividad de los activos.' },
                { icono: 'gestion', titulo: 'Operación de Plantas', descripcion: 'Contratos de operación y mantenimiento para plantas de cogeneración, con personal electromecánico altamente cualificado.' },
                { icono: 'soporte', titulo: 'Asistencia Técnica 24/7', descripcion: 'Servicio de asistencia técnica disponible 24/7, los 365 días del año, con cobertura nacional e internacional (Portugal).' },
                { icono: 'auditoria', titulo: 'Gestión de Averías', descripcion: 'Tarifas y gestión especializada para la resolución de averías, asegurando una respuesta rápida y eficiente.' },
            ],
            stats_publicas: [
              { icon: 'Zap', value: '500+', label: 'PROYECTOS' },
              { icon: 'Globe', value: '15+', label: 'AÑOS EXP.' },
              { icon: 'Shield', value: '99.7%', label: 'UPTIME' },
              { icon: 'Clock', value: '24/7', label: 'SOPORTE' }
            ],
            trusted_brands: ["Perkins", "Guascor", "Cummins", "Iveco", "Ruggerini", "Volvo Penta", "Lombardini", "MAN", "Rolls-Royce", "MTU"]
        };
    }
}

export async function updateWebContent(newContent: WebContent): Promise<WebContent> {
    const docRef = doc(db, 'web_content', 'config_principal');
    await setDoc(docRef, newContent, { merge: true });
    return newContent;
}

export async function addReport(report: Report): Promise<Report> {
    const reportsCollection = collection(db, 'reports');
    await setDoc(doc(reportsCollection, report.id_informe), report);

    const assetRef = doc(db, 'assets', report.id_bien);
    await updateDoc(assetRef, {
        estado: report.estado
    });

    return report;
}


export async function saveContactMessage(formData: { name: string; email: string; phone?: string; message: string; }) {
  try {
    const contactsCollection = collection(db, 'contact_messages');
    await addDoc(contactsCollection, {
      ...formData,
      timestamp: serverTimestamp(),
    });
    return { success: true, message: "Mensaje enviado con éxito." };
  } catch (error) {
    console.error("Error saving contact message:", error);
    return { success: false, message: "No se pudo enviar el mensaje. Inténtalo de nuevo." };
  }
}
