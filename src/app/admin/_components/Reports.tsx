
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { Report, User, Asset, AssetStatus } from "@/lib/types";
import { getReports, getUsers, getAssets } from "@/lib/data";
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const statusColors: Record<AssetStatus, string> = {
  Operativo: "bg-green-100 text-green-800 border-green-200",
  Alerta: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Mantenimiento: "bg-blue-100 text-blue-800 border-blue-200",
  PAR: "bg-red-100 text-red-800 border-red-200",
  OFE: "bg-purple-100 text-purple-800 border-purple-200",
};

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    technician: 'all',
    assetType: 'all',
    airport: 'all',
    date: undefined as Date | undefined,
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [reportsData, usersData, assetsData] = await Promise.all([getReports(), getUsers(), getAssets()]);
      setReports(reportsData);
      setUsers(usersData);
      setAssets(assetsData);
      setLoading(false);
    };
    loadData();
  }, []);
  
  const handleFilterChange = (filterName: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const filteredReports = reports.filter(report => {
    const asset = assets.find(a => a.id_bien === report.id_bien);
    const techMatch = filters.technician === 'all' || report.id_tecnico === filters.technician;
    const assetTypeMatch = filters.assetType === 'all' || asset?.categoria === filters.assetType;
    const airportMatch = filters.airport === 'all' || asset?.id_aeropuerto === filters.airport;
    const dateMatch = !filters.date || format(new Date(report.tiempos.fin), 'yyyy-MM-dd') === format(filters.date, 'yyyy-MM-dd');

    return techMatch && assetTypeMatch && airportMatch && dateMatch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <CardTitle>Historial de Informes</CardTitle>
                <CardDescription>Filtra y audita todas las intervenciones realizadas.</CardDescription>
            </div>
            <Button variant="outline" className="mt-4 sm:mt-0">
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Select value={filters.technician} onValueChange={v => handleFilterChange('technician', v)}>
            <SelectTrigger><SelectValue placeholder="Técnico" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {users.filter(u => u.rol === 'inspector').map(u => <SelectItem key={u.uid} value={u.uid}>{u.nombre}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.airport} onValueChange={v => handleFilterChange('airport', v)}>
            <SelectTrigger><SelectValue placeholder="Aeropuerto" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="VLC">VLC</SelectItem>
              <SelectItem value="MAD">MAD</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.assetType} onValueChange={v => handleFilterChange('assetType', v)}>
            <SelectTrigger><SelectValue placeholder="Tipo de Activo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Energía">Energía</SelectItem>
              <SelectItem value="BHS">BHS</SelectItem>
              <SelectItem value="Clima">Clima</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date ? format(filters.date, "PPP") : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.date}
                onSelect={date => handleFilterChange('date', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Informe</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Fecha Fin</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead>Estado Final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? Array.from({length: 5}).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                </TableRow>
              )) : filteredReports.length > 0 ? (
                filteredReports.map(report => (
                  <TableRow key={report.id_informe}>
                    <TableCell className="font-mono">{report.id_informe}</TableCell>
                    <TableCell>{report.id_bien}</TableCell>
                    <TableCell>{users.find(u => u.uid === report.id_tecnico)?.nombre || 'Desconocido'}</TableCell>
                    <TableCell>{format(new Date(report.tiempos.fin), 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell>{report.tiempos.total_horas_decimal.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[report.estado]}>{report.estado}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron informes con los filtros seleccionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
