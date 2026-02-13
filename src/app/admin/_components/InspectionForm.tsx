
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Asset, InspectionStatus, Report, User, Airport } from '@/lib/types';
import { getAssets, addReport } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Play, StopCircle, MapPin, Camera, Signature, Loader2 } from 'lucide-react';

const inspectionPoints: Record<Asset['categoria'], string[]> = {
    'Energía': ['Nivel de aceite', 'Sistema eléctrico', 'Batería', 'Filtro de aire', 'Nivel de refrigerante'],
    'BHS': ['Rodamientos', 'Cinta transportadora', 'Sensores de posición', 'Motores', 'Sistema de parada de emergencia'],
    'Clima': ['Compresor', 'Circuito refrigerante', 'Ventiladores', 'Filtros', 'Panel de control'],
};

const inspectionStatuses: InspectionStatus[] = ['N/A', 'OPT', 'ACU', 'PAR', 'OFE'];

export default function InspectionForm() {
    const { user } = useAuth();
    const { toast } = useToast();

    const [assets, setAssets] = useState<Asset[]>([]);
    const [airports, setAirports] = useState<Airport[]>([]);
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
    const [inspectionData, setInspectionData] = useState<Record<string, InspectionStatus>>({});
    const [isInspecting, setIsInspecting] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [photoEvidence, setPhotoEvidence] = useState<File | null>(null);
    const [hasSigned, setHasSigned] = useState(false);

    useEffect(() => {
        getAssets().then(loadedAssets => {
            setAssets(loadedAssets);
            const uniqueAirports = [...new Set(loadedAssets.map(a => a.id_aeropuerto))].sort() as Airport[];
            setAirports(uniqueAirports);
        });
    }, []);

    const selectedAsset = assets.find(a => a.id_bien === selectedAssetId);
    const currentInspectionPoints = selectedAsset ? inspectionPoints[selectedAsset.categoria] : [];

    const handleStartInspection = () => {
        if (!selectedAssetId) {
            toast({ title: "Error", description: "Por favor, seleccione un activo para iniciar.", variant: "destructive" });
            return;
        }
        setIsInspecting(true);
        setStartTime(Date.now());
        setInspectionData({});
        setHasSigned(false);
        setPhotoEvidence(null);
        // Mock GPS capture
        setLocation({ lat: 40.4936, lng: -3.5934 });
        toast({ title: "Inspección iniciada", description: `Cronómetro activado para el activo ${selectedAssetId}.` });
    };

    const handleFinishInspection = async () => {
        if (!user || !startTime || !selectedAsset) {
            toast({ title: "Error", description: "Faltan datos para finalizar la inspección.", variant: "destructive" });
            return;
        }

        const hasOFE = Object.values(inspectionData).includes('OFE');
        if (hasOFE && !photoEvidence) {
            toast({ title: "Acción requerida", description: "Debe adjuntar una foto de evidencia para los componentes marcados como 'OFE'.", variant: "destructive" });
            return;
        }
        if (!hasSigned) {
            toast({ title: "Acción requerida", description: "Debe firmar el informe para finalizar.", variant: "destructive" });
            return;
        }

        setIsSaving(true);
        const endTime = Date.now();
        const total_horas_decimal = (endTime - startTime) / 3600000;
        
        const finalStatus = Object.values(inspectionData).reduce((acc, status) => {
            const order: InspectionStatus[] = ['PAR', 'OFE', 'Alerta' as any, 'Mantenimiento' as any, 'Operativo' as any, 'ACU', 'OPT', 'N/A'];
            return order.indexOf(status) < order.indexOf(acc) ? status : acc;
        }, 'OPT') as Asset['estado'];
        
        const newReport: Report = {
            id_informe: `REP-${Date.now()}`,
            id_bien: selectedAsset.id_bien,
            id_tecnico: user.uid,
            tiempos: { inicio: startTime, fin: endTime, total_horas_decimal },
            inspeccion: inspectionData,
            ubicacion: { ...location!, validado_gps: true },
            estado: finalStatus,
            core_issue: "Revisión periódica",
            recommended_actions: "Seguir plan de mantenimiento",
            potential_impact: "N/A",
        };

        try {
            await addReport(newReport);
            toast({ title: "Informe Guardado", description: "El informe de inspección ha sido guardado correctamente." });
            setIsInspecting(false);
            setSelectedAssetId(null);
        } catch (error) {
            toast({ title: "Error al guardar", description: "Hubo un problema al guardar el informe.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Flujo de Inspección de Campo</CardTitle>
                    <CardDescription>Seleccione un activo e inicie una nueva inspección.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Seleccionar Activo</Label>
                             <Select onValueChange={setSelectedAssetId} value={selectedAssetId || ''} disabled={isInspecting}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Buscar por ID, sector..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {airports.map(airport => (
                                        <SelectGroup key={airport}>
                                            <SelectLabel>{airport}</SelectLabel>
                                            {assets.filter(a => a.id_aeropuerto === airport).map(asset => (
                                                <SelectItem key={asset.id_bien} value={asset.id_bien}>
                                                    {asset.id_bien} - {asset.marca_modelo}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedAsset && (
                            <Card className="md:col-span-2 bg-muted/50">
                                <CardHeader className="p-4">
                                    <CardTitle className="text-lg">{selectedAsset.id_bien}</CardTitle>
                                    <CardDescription>{selectedAsset.marca_modelo}</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-2 text-sm p-4 pt-0">
                                    <p><strong>Sector:</strong> {selectedAsset.id_sector}</p>
                                    <p><strong>Categoría:</strong> {selectedAsset.categoria}</p>
                                    <p><strong>S/N:</strong> {selectedAsset.numero_serie}</p>
                                    <p><strong>Potencia:</strong> {selectedAsset.potencia}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </CardContent>
                 <CardFooter className="flex justify-end gap-4">
                    {!isInspecting ? (
                        <Button size="lg" onClick={handleStartInspection} disabled={!selectedAssetId}>
                            <Play className="mr-2 h-4 w-4" /> Iniciar Tarea
                        </Button>
                    ) : (
                        <Button size="lg" variant="destructive" onClick={handleFinishInspection} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <StopCircle className="mr-2 h-4 w-4" />}
                            Finalizar Tarea
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {isInspecting && selectedAsset && (
                <Card>
                    <CardHeader>
                        <CardTitle>Matriz de Inspección: <span className="font-mono">{selectedAsset.id_bien}</span></CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                            <MapPin className="h-4 w-4 text-green-500" />
                            <span>Ubicación GPS capturada.</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {currentInspectionPoints.map(point => (
                            <div key={point}>
                                <Label className="text-base font-semibold">{point}</Label>
                                <RadioGroup
                                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2"
                                    value={inspectionData[point]}
                                    onValueChange={(value: InspectionStatus) => setInspectionData(prev => ({ ...prev, [point]: value }))}
                                >
                                    {inspectionStatuses.map(status => (
                                        <div key={status} className="flex items-center space-x-2">
                                            <RadioGroupItem value={status} id={`${point}-${status}`} />
                                            <Label htmlFor={`${point}-${status}`}>{status}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        ))}
                    </CardContent>
                    
                    {Object.values(inspectionData).includes('OFE') && (
                        <CardFooter className="flex-col items-start gap-4 border-t pt-6">
                             <Label className="text-base font-semibold">Evidencia para 'Ofertar'</Label>
                             <div className="flex items-center gap-4 p-4 border-2 border-dashed rounded-lg w-full">
                                <Camera className="h-8 w-8 text-muted-foreground" />
                                <div className="flex-grow">
                                    <h4 className="font-semibold">Adjuntar Foto de Evidencia</h4>
                                    <p className="text-sm text-muted-foreground">Requerido para componentes marcados como OFE.</p>
                                </div>
                                <Input type="file" accept="image/*" className="hidden" id="photo-upload" onChange={(e) => setPhotoEvidence(e.target.files?.[0] || null)}/>
                                <Button asChild variant="outline">
                                    <Label htmlFor="photo-upload">{photoEvidence ? "Cambiar Foto" : "Seleccionar Foto"}</Label>
                                </Button>
                             </div>
                             {photoEvidence && <p className="text-sm text-muted-foreground">Archivo seleccionado: {photoEvidence.name}</p>}
                        </CardFooter>
                    )}

                    <CardFooter className="flex-col items-start gap-4 border-t pt-6">
                        <Label className="text-base font-semibold">Firma del Técnico</Label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed rounded-lg w-full">
                            <Signature className="h-8 w-8 text-muted-foreground" />
                            <div className="flex-grow">
                                <h4 className="font-semibold">Confirmación de Informe</h4>
                                <p className="text-sm text-muted-foreground">
                                    {user?.isFirstLogin ? "Realice su firma en el recuadro." : "Use su firma guardada."}
                                </p>
                            </div>
                            {user?.isFirstLogin ? (
                                <div className="w-full sm:w-64 h-32 bg-gray-200 rounded-md p-2 flex items-center justify-center">
                                    <p className="text-xs text-center text-muted-foreground">[Área de firma en Canvas]</p>
                                </div>
                            ) : (
                                 <Button onClick={() => setHasSigned(true)} disabled={hasSigned}>
                                    {hasSigned ? "Firmado" : "Autorizar con Auto-Firma"}
                                 </Button>
                            )}
                        </div>
                        {user?.isFirstLogin && <Button onClick={() => setHasSigned(true)}>Guardar y Usar Firma</Button>}
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
