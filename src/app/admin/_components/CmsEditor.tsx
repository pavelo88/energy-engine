
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
            
            if (!data.stats_publicas || !Array.isArray(data.stats_publicas) || data.stats_publicas.length === 0) {
                data.stats_publicas = [
                  { icon: 'Zap', value: '500+', label: 'PROYECTOS' },
                  { icon: 'Globe', value: '15+', label: 'AÑOS EXP.' },
                  { icon: 'Shield', value: '99.7%', label: 'UPTIME' },
                  { icon: 'Clock', value: '24/7', label: 'SOPORTE' }
                ];
            }
            
            if (!data.trusted_brands || !Array.isArray(data.trusted_brands) || data.trusted_brands.length === 0) {
                data.trusted_brands = ["Perkins", "Guascor", "Cummins", "Iveco", "Ruggerini", "Volvo Penta", "Lombardini", "MAN", "Rolls-Royce", "MTU"];
            }

            if (!data.servicios || data.servicios.length === 0) {
                 data.servicios = [
                    { icono: 'mantenimiento', titulo: 'Mantenimiento Integral', descripcion: 'Mantenimiento preventivo, correctivo y cambios de componentes (aceite, filtros, etc.) para todo tipo de generadores multimarca.' },
                    { icono: 'inspeccion', titulo: 'Inspecciones y Revisiones', descripcion: 'Inspecciones técnicas detalladas y revisiones a medida según las necesidades del cliente para garantizar el óptimo funcionamiento.' },
                    { icono: 'suministro', titulo: 'Suministro Urgente de Recambios', descripcion: 'Provisión de todo tipo de recambios y componentes críticos en tiempo récord para minimizar la inactividad de los activos.' },
                    { icono: 'gestion', titulo: 'Operación de Plantas', descripcion: 'Contratos de operación y mantenimiento para plantas de cogeneración, con personal electromecánico altamente cualificado.' },
                    { icono: 'soporte', titulo: 'Asistencia Técnica 24/7', descripcion: 'Servicio de asistencia técnica disponible 24/7, los 365 días del año, con cobertura nacional e internacional (Portugal).' },
                    { icono: 'auditoria', titulo: 'Gestión de Averías', descripcion: 'Tarifas y gestión especializada para la resolución de averías, asegurando una respuesta rápida y eficiente.' },
                ];
            }

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
        const newServices = [...(content.servicios || []), { icono: 'Wrench', titulo: 'Nuevo Servicio', descripcion: 'Descripción del servicio.' }];
        setContent({ ...content, servicios: newServices });
    };

    const handleRemoveService = (index: number) => {
        if (!content || !content.servicios) return;
        const newServices = content.servicios.filter((_, i) => i !== index);
        setContent({ ...content, servicios: newServices });
    };
    
    const handleBrandChange = (index: number, value: string) => {
        if (!content || !content.trusted_brands) return;
        const newBrands = [...content.trusted_brands];
        newBrands[index] = value;
        setContent({ ...content, trusted_brands: newBrands });
    };

    const handleAddBrand = () => {
        if (!content) return;
        const newBrands = [...(content.trusted_brands || []), "Nueva Marca"];
        setContent({ ...content, trusted_brands: newBrands });
    };

    const handleRemoveBrand = (index: number) => {
        if (!content || !content.trusted_brands) return;
        const newBrands = content.trusted_brands.filter((_, i) => i !== index);
        setContent({ ...content, trusted_brands: newBrands });
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
                    <CardTitle>Estadísticas (Sección Experiencia)</CardTitle>
                    <CardDescription>Los 4 contadores de la sección de experiencia.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.isArray(content.stats_publicas) && content.stats_publicas.map((stat, index) => (
                         <div key={index} className="p-4 border rounded-md space-y-2">
                             <div className="space-y-1">
                                 <Label>Icono (Lucide: Zap, Globe, Shield, Clock)</Label>
                                 <Input value={stat.icon} onChange={e => handleInputChange('stats_publicas', 'icon', e.target.value, index)} />
                             </div>
                             <div className="space-y-1">
                                 <Label>Valor (ej. 500+)</Label>
                                 <Input value={stat.value} onChange={e => handleInputChange('stats_publicas', 'value', e.target.value, index)} />
                             </div>
                              <div className="space-y-1">
                                 <Label>Etiqueta (ej. PROYECTOS)</Label>
                                 <Input value={stat.label} onChange={e => handleInputChange('stats_publicas', 'label', e.target.value, index)} />
                             </div>
                         </div>
                    ))}
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
                    {Array.isArray(content.servicios) && content.servicios.map((service, index) => (
                        <div key={index} className="p-4 border rounded-md relative space-y-2">
                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveService(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Título del Servicio</Label>
                                    <Input value={service.titulo} onChange={e => handleInputChange('servicios', 'titulo', e.target.value, index)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Icono (Palabra clave para ilustración)</Label>
                                    <Input value={service.icono} onChange={e => handleInputChange('servicios', 'icono', e.target.value, index)} />
                                    <p className="text-xs text-muted-foreground">
                                        Sugerencias: mantenimiento, inspeccion, suministro, gestion, soporte, auditoria, energia
                                    </p>
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
                    <div className="flex justify-between items-center">
                        <CardTitle>Aliados Tecnológicos (Marcas)</CardTitle>
                        <Button variant="outline" size="sm" onClick={handleAddBrand}><Plus className="mr-2 h-4 w-4" /> Añadir Marca</Button>
                    </div>
                    <CardDescription>La lista de marcas que se muestra en el anillo rotatorio.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Array.isArray(content.trusted_brands) && content.trusted_brands.map((brand, index) => (
                        <div key={index} className="relative flex items-center">
                            <Input value={brand} onChange={e => handleBrandChange(index, e.target.value)} className="pr-10"/>
                            <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleRemoveBrand(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

        </div>
    );
}

    
