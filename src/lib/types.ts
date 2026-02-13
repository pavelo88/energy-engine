
import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'gerente' | 'inspector';

export interface User {
  uid: string;
  nombre: string;
  rol: UserRole;
  firma_storage_url?: string;
  isFirstLogin: boolean;
  avatarUrl?: string;
}

export type AssetCategory = 'Energía' | 'BHS' | 'Clima';
export type AssetStatus = 'Operativo' | 'Alerta' | 'Mantenimiento' | 'PAR' | 'OFE';
export type Airport = 'VLC' | 'MAD';

export interface Asset {
  id_bien: string;
  id_aeropuerto: Airport;
  id_sector: string;
  categoria: AssetCategory;
  marca_modelo: string;
  numero_serie: string;
  potencia: string;
  estado: AssetStatus;
  ultimo_mantenimiento?: string; // ISO Date string
  proximo_mantenimiento?: string; // ISO Date string
}

export type InspectionStatus = 'N/A' | 'OPT' | 'ACU' | 'PAR' | 'OFE';

export interface Inspection {
  [key: string]: InspectionStatus;
}

export interface GpsLocation {
  lat: number;
  lng: number;
  validado_gps: boolean;
}

export interface Report {
  id_informe: string;
  id_bien: string;
  id_tecnico: string;
  tiempos: {
    inicio: number; // Using number (timestamp) for easier offline handling
    fin: number;
    total_horas_decimal: number;
  };
  inspeccion: Inspection;
  ubicacion: GpsLocation;
  core_issue?: string;
  recommended_actions?: string;
  potential_impact?: string;
  estado: AssetStatus;
  photoEvidenceDataUrl?: string;
}

export interface WebContent {
  id: 'config_principal';
  hero: {
    titulo: string;
    subitulo: string;
    imagen_id: string; // references id in placeholder-images.json
  };
  servicios: Array<{
    icono: string;
    titulo: string;
    descripcion: string;
  }>;
  stats_publicas: Array<{
    icon: string;
    value: string;
    label: string;
  }>;
  trusted_brands: string[];
  metadata: {
    title: string;
    description: string;
    keywords: string;
  };
}
