
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Asset, AssetStatus, Airport, AssetCategory } from "@/lib/types";
import { getAssets } from "@/lib/data";
import { Skeleton } from '@/components/ui/skeleton';

const statusColors: Record<AssetStatus, string> = {
  Operativo: "bg-green-100 text-green-800 border-green-200",
  Alerta: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Mantenimiento: "bg-blue-100 text-blue-800 border-blue-200",
  PAR: "bg-red-100 text-red-800 border-red-200",
  OFE: "bg-purple-100 text-purple-800 border-purple-200",
};


export default function AssetManager() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    id_aeropuerto: '',
    categoria: '',
    estado: ''
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getAssets();
      setAssets(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const filteredAssets = assets.filter(asset => {
    const searchMatch = asset.id_bien.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        asset.marca_modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        asset.numero_serie.toLowerCase().includes(searchTerm.toLowerCase());
    
    const airportMatch = !filters.id_aeropuerto || filters.id_aeropuerto === 'all' || asset.id_aeropuerto === filters.id_aeropuerto;
    const categoryMatch = !filters.categoria || filters.categoria === 'all' || asset.categoria === filters.categoria;
    const statusMatch = !filters.estado || filters.estado === 'all' || asset.estado === filters.estado;

    return searchMatch && airportMatch && categoryMatch && statusMatch;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Activos</CardTitle>
        <CardDescription>Visualiza, filtra y gestiona el maestro de activos de la empresa.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Input 
            placeholder="Buscar por ID, modelo, S/N..." 
            className="sm:col-span-2 lg:col-span-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={filters.id_aeropuerto} onValueChange={(value) => handleFilterChange('id_aeropuerto', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Aeropuerto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="VLC">VLC</SelectItem>
              <SelectItem value="MAD">MAD</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.categoria} onValueChange={(value) => handleFilterChange('categoria', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Energía">Energía</SelectItem>
              <SelectItem value="BHS">BHS</SelectItem>
              <SelectItem value="Clima">Clima</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.estado} onValueChange={(value) => handleFilterChange('estado', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Operativo">Operativo</SelectItem>
              <SelectItem value="Alerta">Alerta</SelectItem>
              <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
              <SelectItem value="PAR">PAR</SelectItem>
              <SelectItem value="OFE">OFE</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Bien</TableHead>
                <TableHead>Aeropuerto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Marca/Modelo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Próx. Mtto.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({length: 5}).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : filteredAssets.length > 0 ? (
                filteredAssets.map(asset => (
                  <TableRow key={asset.id_bien}>
                    <TableCell className="font-medium">{asset.id_bien}</TableCell>
                    <TableCell>{asset.id_aeropuerto}</TableCell>
                    <TableCell>{asset.categoria}</TableCell>
                    <TableCell>{asset.marca_modelo}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={statusColors[asset.estado]}>
                            {asset.estado}
                        </Badge>
                    </TableCell>
                    <TableCell>{asset.proximo_mantenimiento ? new Date(asset.proximo_mantenimiento).toLocaleDateString() : 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron activos con los filtros seleccionados.
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
