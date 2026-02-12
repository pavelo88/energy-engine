import type { User, Asset, Report, WebContent, UserRole } from './types';
import { PlaceHolderImages } from './placeholder-images';

const users: User[] = [
  { uid: 'admin-01', nombre: 'Admin User', rol: 'admin', isFirstLogin: false, avatarUrl: PlaceHolderImages.find(i => i.id === 'avatar-1')?.imageUrl },
  { uid: 'gerente-01', nombre: 'Gerente User', rol: 'gerente', isFirstLogin: false, avatarUrl: PlaceHolderImages.find(i => i.id === 'avatar-2')?.imageUrl },
  { uid: 'inspector-01', nombre: 'Inspector User', rol: 'inspector', isFirstLogin: true, avatarUrl: PlaceHolderImages.find(i => i.id === 'avatar-3')?.imageUrl },
];

const assets: Asset[] = [
  { id_bien: 'M-3209', id_aeropuerto: 'MAD', id_sector: 'T4-S1', categoria: 'Energía', marca_modelo: 'DEUTZ BF4M1013EC', numero_serie: 'SN-A123', potencia: '150kVA', estado: 'Operativo', ultimo_mantenimiento: '2024-05-10', proximo_mantenimiento: '2024-11-10' },
  { id_bien: 'M-3210', id_aeropuerto: 'MAD', id_sector: 'T4-S2', categoria: 'Energía', marca_modelo: 'CATERPILLAR C4.4', numero_serie: 'SN-B456', potencia: '100kVA', estado: 'Alerta', ultimo_mantenimiento: '2024-04-20', proximo_mantenimiento: '2024-10-20' },
  { id_bien: 'VLC-BHS-01', id_aeropuerto: 'VLC', id_sector: 'P1-Cintas', categoria: 'BHS', marca_modelo: 'Vanderlande C-100', numero_serie: 'SN-C789', potencia: 'N/A', estado: 'Mantenimiento', ultimo_mantenimiento: '2024-06-01', proximo_mantenimiento: '2024-07-01' },
  { id_bien: 'VLC-CLIMA-05', id_aeropuerto: 'VLC', id_sector: 'Terminal', categoria: 'Clima', marca_modelo: 'Carrier Aquaforce 30XW', numero_serie: 'SN-D101', potencia: '500kW', estado: 'Operativo', ultimo_mantenimiento: '2024-05-15', proximo_mantenimiento: '2025-05-15' },
  { id_bien: 'M-CLIMA-12', id_aeropuerto: 'MAD', id_sector: 'T1-Norte', categoria: 'Clima', marca_modelo: 'Trane CenTraVac', numero_serie: 'SN-E112', potencia: '1.2MW', estado: 'PAR', ultimo_mantenimiento: '2023-12-01', proximo_mantenimiento: '2024-06-01'},
  { id_bien: 'M-BHS-22', id_aeropuerto: 'MAD', id_sector: 'T2-SATE', categoria: 'BHS', marca_modelo: 'Siemens VarioSort', numero_serie: 'SN-F131', potencia: 'N/A', estado: 'OFE', ultimo_mantenimiento: '2024-01-01', proximo_mantenimiento: '2024-07-01'},
];

const reports: Report[] = [
  {
    id_informe: 'REP-001', id_bien: 'M-3210', id_tecnico: 'inspector-01', estado: 'Alerta',
    tiempos: { inicio: new Date('2024-06-15T09:00:00Z').getTime(), fin: new Date('2024-06-15T10:30:00Z').getTime(), total_horas_decimal: 1.5 },
    inspeccion: { 'Nivel de aceite': 'ACU', 'Sistema eléctrico': 'OPT', 'Batería': 'OPT', 'Filtro de aire': 'ACU' },
    ubicacion: { lat: 40.4936, lng: -3.5934, validado_gps: true },
    core_issue: 'Nivel de aceite bajo y filtro de aire sucio',
    recommended_actions: 'Rellenar aceite y cambiar filtro de aire.',
    potential_impact: 'Posible sobrecalentamiento y pérdida de rendimiento.'
  },
  {
    id_informe: 'REP-002', id_bien: 'VLC-BHS-01', id_tecnico: 'inspector-01', estado: 'Mantenimiento',
    tiempos: { inicio: new Date('2024-06-14T11:00:00Z').getTime(), fin: new Date('2024-06-14T15:00:00Z').getTime(), total_horas_decimal: 4.0 },
    inspeccion: { 'Rodamientos': 'PAR', 'Cinta transportadora': 'ACU', 'Sensores': 'OPT' },
    ubicacion: { lat: 39.4925, lng: -0.4784, validado_gps: true },
    core_issue: 'Fallo crítico en rodamientos del motor principal.',
    recommended_actions: 'Reemplazo inmediato de rodamientos. Tarea de mantenimiento programada.',
    potential_impact: 'Parada total de la línea de equipaje.'
  },
   {
    id_informe: 'REP-003', id_bien: 'M-CLIMA-12', id_tecnico: 'inspector-01', estado: 'PAR',
    tiempos: { inicio: new Date('2024-06-13T08:00:00Z').getTime(), fin: new Date('2024-06-13T12:00:00Z').getTime(), total_horas_decimal: 4.0 },
    inspeccion: { 'Compresor': 'PAR', 'Circuito refrigerante': 'OFE', 'Panel de control': 'OPT' },
    ubicacion: { lat: 40.4936, lng: -3.5934, validado_gps: true },
    core_issue: 'Compresor gripado por falta de lubricación.',
    recommended_actions: 'Reemplazo del compresor y del circuito de refrigerante dañado.',
    potential_impact: 'Pérdida de climatización en todo el sector Norte de la T1.'
  }
];

const webContent: WebContent = {
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

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getUsers(): Promise<User[]> {
  await delay(100);
  return users;
}

export async function getUser(uid: string): Promise<User | undefined> {
  await delay(50);
  return users.find(u => u.uid === uid);
}

export async function getAssets(): Promise<Asset[]> {
  await delay(200);
  return assets;
}

export async function getAsset(id_bien: string): Promise<Asset | undefined> {
  await delay(50);
  return assets.find(a => a.id_bien === id_bien);
}

export async function getReports(): Promise<Report[]> {
  await delay(300);
  return reports;
}

export async function getWebContent(): Promise<WebContent> {
  await delay(100);
  return webContent;
}

export async function updateWebContent(newContent: Partial<WebContent>): Promise<WebContent> {
  await delay(500);
  Object.assign(webContent, newContent);
  return webContent;
}

export async function addReport(report: Report): Promise<Report> {
  await delay(500);
  reports.unshift(report);
  const asset = assets.find(a => a.id_bien === report.id_bien);
  if (asset) {
    asset.estado = report.estado;
  }
  return report;
}

export const USER_ROLES: UserRole[] = ['admin', 'gerente', 'inspector'];
