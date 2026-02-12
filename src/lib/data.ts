import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, getDoc, updateDoc, addDoc, setDoc, query, where } from 'firebase/firestore';
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
                titulo: 'Ingeniería Energética de Vanguardia',
                subitulo: 'Maximizando la eficiencia y fiabilidad de activos críticos en infraestructuras clave.',
                imagen_id: 'hero-image'
            },
            servicios: [
                { icono: 'Wrench', titulo: 'Mantenimiento Predictivo', descripcion: 'Anticipamos fallos antes de que ocurran, utilizando IA y análisis de datos.' },
                { icono: 'ShieldCheck', titulo: 'Inspecciones de Cumplimiento', descripcion: 'Garantizamos que todos los activos cumplan con las normativas más estrictas.' },
                { icono: 'Lightbulb', titulo: 'Auditorías Energéticas', descripcion: 'Optimizamos el consumo para reducir costes y el impacto ambiental.' },
                { icono: 'TrendingUp', titulo: 'Gestión de Activos', descripcion: 'Ciclo de vida completo, desde la instalación hasta el reemplazo estratégico.' },
            ],
            stats_publicas: {
                activos_totales: 1250,
                intervenciones_exitosas: 40000
            }
        };
    }
}

export async function updateWebContent(newContent: WebContent): Promise<WebContent> {
    const docRef = doc(db, 'web_content', 'config_principal');
    // Using setDoc with merge:true is safer as it creates the doc if it doesn't exist.
    await setDoc(docRef, newContent, { merge: true });
    return newContent;
}

export async function addReport(report: Report): Promise<Report> {
    // Add the report to the 'reports' collection
    const reportsCollection = collection(db, 'reports');
    await setDoc(doc(reportsCollection, report.id_informe), report);

    // Update the corresponding asset's status
    const assetRef = doc(db, 'assets', report.id_bien);
    await updateDoc(assetRef, {
        estado: report.estado
    });

    return report;
}
