'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getWebContent, updateWebContent as apiUpdateWebContent } from "@/lib/data";
import type { WebContent } from "@/lib/types";
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Save, Loader2 } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

export default function CmsEditor() {
    const [content, setContent] = useState<WebContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await getWebContent();
            setContent(data);
            setLoading(false);
        };
        loadData();
    }, []);

    const handleInputChange = (section: keyof WebContent, field: string, value: any, index?: number) => {
        if (!content) return;
        
        const newContent = { ...content };
        if (index !== undefined && Array.isArray(newContent[section])) {
            (newContent[section] as any[])[index][field] = value;
        } else {
            (newContent[section] as any)[field] = value;
        }
        setContent(newContent);
    };

    const handleAddService = () => {
        if (!content) return;
        const newServices = [...content.servicios, { icono: 'Wrench', titulo: 'Nuevo Servicio', descripcion: 'Descripción del servicio.' }];
        setContent({ ...content, servicios: newServices });
    };

    const handleRemoveService = (index: number) => {
        if (!content) return;
        const newServices = content.servicios.filter((_, i) => i !== index);
        setContent({ ...content, servicios: newServices });
    };

    const handleSave = async () => {
        if (!content) return;
        setSaving(true);
        try {
            await apiUpdateWebContent(content);
            toast({
                title: "Contenido Guardado",
                description: "La página principal ha sido actualizada exitosamente.",
                variant: 'default',
            });
        } catch (error) {
            toast({
                title: "Error al Guardar",
                description: "No se pudo actualizar el contenido.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };
    
    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-1/3" />
                <div className="space-y-4">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
                 <div className="space-y-4">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        )
    }

    if (!content) return <p>No se pudo cargar el contenido.</p>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Editor de Contenido Web</h1>
                    <p className="text-muted-foreground">Gestiona el contenido de la página principal pública.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Cambios
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Sección Hero</CardTitle>
                    <CardDescription>El mensaje principal que ven los visitantes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="hero-title">Título Principal</Label>
                        <Input id="hero-title" value={content.hero.titulo} onChange={e => handleInputChange('hero', 'titulo', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hero-subtitle">Subtítulo</Label>
                        <Textarea id="hero-subtitle" value={content.hero.subitulo} onChange={e => handleInputChange('hero', 'subitulo', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Servicios</CardTitle>
                            <CardDescription>Los servicios que se muestran en la página principal.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleAddService}><Plus className="mr-2 h-4 w-4" /> Añadir Servicio</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {content.servicios.map((service, index) => (
                        <div key={index} className="p-4 border rounded-md relative space-y-2">
                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveService(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Título del Servicio</Label>
                                    <Input value={service.titulo} onChange={e => handleInputChange('servicios', 'titulo', e.target.value, index)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Icono (Lucide)</Label>
                                    <Input value={service.icono} onChange={e => handleInputChange('servicios', 'icono', e.target.value, index)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Descripción</Label>
                                <Textarea value={service.descripcion} onChange={e => handleInputChange('servicios', 'descripcion', e.target.value, index)} />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Estadísticas Públicas</CardTitle>
                    <CardDescription>Contadores que se muestran públicamente.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="stats-activos">Activos Totales</Label>
                        <Input id="stats-activos" type="number" value={content.stats_publicas.activos_totales} onChange={e => handleInputChange('stats_publicas', 'activos_totales', parseInt(e.target.value, 10))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stats-intervenciones">Intervenciones Exitosas</Label>
                        <Input id="stats-intervenciones" type="number" value={content.stats_publicas.intervenciones_exitosas} onChange={e => handleInputChange('stats_publicas', 'intervenciones_exitosas', parseInt(e.target.value, 10))} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
