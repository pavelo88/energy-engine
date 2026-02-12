
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
                titulo: 'Protegemos su INFRAESTRUCTURA',
                subitulo: 'Soluciones integrales de mantenimiento predictivo, ingeniería y automatización industrial para activos críticos.',
                imagen_id: 'hero-image'
            },
            servicios: [
                { icono: 'mantenimiento', titulo: 'Mantenimiento Predictivo y Correctivo', descripcion: 'Anticipamos fallos antes de que ocurran, utilizando IA para análisis de datos y optimización de rendimiento energético.' },
                { icono: 'inspeccion', titulo: 'Inspecciones Técnicas Avanzadas', descripcion: 'Garantizamos que todos los activos cumplan con las normativas más estrictas mediante escaneo y auditoría digital.' },
                { icono: 'gestion', titulo: 'Gestión Inteligente de Activos', descripcion: 'Control del ciclo de vida completo del activo, desde la instalación hasta el reemplazo estratégico basado en datos.' },
                { icono: 'soporte', titulo: 'Soporte y Asistencia 24/7', descripcion: 'Servicio de asistencia técnica los 365 días del año con cobertura nacional para resolver cualquier anomalía.' },
                { icono: 'auditoria', titulo: 'Auditorías y Optimización Energética', descripcion: 'Optimizamos el consumo para reducir costes y el impacto ambiental en grandes infraestructuras y plantas de cogeneración.' },
                { icono: 'suministro', titulo: 'Suministro Urgente de Componentes', descripcion: 'Aseguramos la provisión de todo tipo de recambios y componentes críticos en tiempo récord para minimizar la inactividad.' },
            ],
            stats_publicas: [
              { icon: 'Zap', value: '500+', label: 'PROYECTOS' },
              { icon: 'Globe', value: '15+', label: 'AÑOS EXP.' },
              { icon: 'Shield', value: '99.7%', label: 'UPTIME' },
              { icon: 'Clock', value: '24/7', label: 'SOPORTE' }
            ],
            trusted_brands: [
                "AENA", "SIEMENS", "BOSCH", "VANDERLANDE", "FERROVIAL", "ACCIONA", "IBERIA", "PELCO", "AVIGILON"
            ]
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


export async function saveContactMessage(formData: { name: string; email: string; message: string; }) {
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
