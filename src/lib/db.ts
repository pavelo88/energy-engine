import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Asset, Report } from './types';

export interface SyncTask {
  id?: number;
  type: 'report' | 'multimedia';
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  payload: Report | { reportId: string, photoDataUrl: string };
  createdAt: number;
}

export interface MaestroCache extends Asset {
    cachedAt: number;
}

export class EnergyEngineDB extends Dexie {
  sync_tasks!: Table<SyncTask>;
  maestro_cache!: Table<MaestroCache>;

  constructor() {
    super('EnergyEngineDB');
    this.version(1).stores({
      sync_tasks: '++id, type, status', // Indexes
      maestro_cache: '&id_bien, categoria, id_aeropuerto, estado', // & makes it a unique primary key
    });
  }
}

export const localDb = new EnergyEngineDB();
