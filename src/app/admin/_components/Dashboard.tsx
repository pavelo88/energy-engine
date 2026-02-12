'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from "recharts";
import { useEffect, useState } from "react";
import type { Asset, Report } from "@/lib/types";
import { getAssets, getReports } from "@/lib/data";
import { AlertCircle, CheckCircle, MapPin, Wrench, TriangleAlert } from "lucide-react";

const COLORS = {
  Operativo: 'hsl(var(--chart-2))',
  Alerta: 'hsl(var(--chart-5))',
  Mantenimiento: 'hsl(var(--accent))',
  PAR: 'hsl(var(--destructive))',
  OFE: '#a855f7', // purple-500
};

const STATUS_ICONS = {
  Operativo: <CheckCircle className="h-4 w-4 text-green-500" />,
  Alerta: <TriangleAlert className="h-4 w-4 text-orange-500" />,
  Mantenimiento: <Wrench className="h-4 w-4 text-blue-500" />,
  PAR: <AlertCircle className="h-4 w-4 text-red-500" />,
  OFE: <AlertCircle className="h-4 w-4 text-purple-500" />,
}

export default function Dashboard() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [assetsData, reportsData] = await Promise.all([getAssets(), getReports()]);
            setAssets(assetsData);
            setReports(reportsData);
            setLoading(false);
        };
        fetchData();
    }, []);

    const fleetStatusData = assets.reduce((acc, asset) => {
        const status = asset.estado;
        const existing = acc.find(item => item.name === status);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: status, value: 1 });
        }
        return acc;
    }, [] as { name: string, value: number }[]);

    const workloadData = reports.reduce((acc, report) => {
        const date = new Date(report.tiempos.inicio).toLocaleDateString('es-ES', { weekday: 'short' });
        const existing = acc.find(item => item.date === date);
        if(existing) {
            existing.hours += report.tiempos.total_horas_decimal;
        } else {
            acc.push({ date, hours: report.tiempos.total_horas_decimal });
        }
        return acc;
    }, [] as { date: string, hours: number }[]).reverse();

    const incidentRanking = reports
        .flatMap(report => Object.entries(report.inspeccion)
        .filter(([, status]) => status === 'PAR' || status === 'OFE')
        .map(([component, status]) => ({ component, status, asset: report.id_bien })))
        .reduce((acc, incident) => {
            const existing = acc.find(item => item.component === incident.component);
            if(existing) {
                existing.count += 1;
            } else {
                acc.push({ component: incident.component, count: 1 });
            }
            return acc;
        }, [] as { component: string, count: number }[])
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
        
    const criticalReports = reports.filter(r => r.estado === 'PAR' || r.estado === 'OFE');

    return (
        <div className="grid gap-6 md:gap-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Estado de la Flota</CardTitle>
                        <CardDescription>Distribución de los {assets.length} activos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={fleetStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {fleetStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value} activos`, name]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>KPI de Horas Hombre</CardTitle>
                        <CardDescription>Acumulado de horas trabajadas en los últimos días.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={workloadData}>
                                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}h`}/>
                                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle /> Informes Críticos
                    </CardTitle>
                    <CardDescription>Activos que requieren atención inmediata (estado PAR u OFE).</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID Informe</TableHead>
                                <TableHead>ID Activo</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Problema Principal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {criticalReports.length > 0 ? criticalReports.map(report => (
                                <TableRow key={report.id_informe}>
                                    <TableCell className="font-medium">{report.id_informe}</TableCell>
                                    <TableCell>{report.id_bien}</TableCell>
                                    <TableCell>
                                        <Badge variant={report.estado === 'PAR' ? 'destructive' : 'default'} className={report.estado === 'OFE' ? 'bg-purple-500' : ''}>
                                            {report.estado}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{report.core_issue}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No hay informes críticos actualmente.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Ranking de Incidencias</CardTitle>
                        <CardDescription>Componentes con más fallos (PAR/OFE) reportados.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {incidentRanking.map(item => (
                                <li key={item.component} className="flex items-center">
                                    <span>{item.component}</span>
                                    <span className="ml-auto font-bold">{item.count} <span className="font-normal text-muted-foreground">fallos</span></span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Actividad Reciente</CardTitle>
                        <CardDescription>Últimas inspecciones finalizadas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ul className="space-y-4">
                            {reports.slice(0, 5).map(report => (
                                <li key={report.id_informe} className="flex items-center gap-4">
                                    <div className="p-2 bg-muted rounded-full">
                                        {STATUS_ICONS[report.estado as keyof typeof STATUS_ICONS]}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold">Activo {report.id_bien}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {report.id_tecnico} - {new Date(report.tiempos.fin).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                       <Badge variant="outline">{report.estado}</Badge>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
