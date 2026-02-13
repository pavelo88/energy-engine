'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import type { Asset } from '@/lib/types';
import { predictiveMaintenanceSuggestion, type PredictiveMaintenanceSuggestionOutput } from '@/ai/flows/predictive-maintenance-suggestion';
import { getReports } from '@/lib/data';

interface PredictiveMaintenanceDialogProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
}

const priorityVariant: Record<'High' | 'Medium' | 'Low', 'destructive' | 'default' | 'secondary'> = {
  High: 'destructive',
  Medium: 'default',
  Low: 'secondary',
};


export default function PredictiveMaintenanceDialog({ asset, isOpen, onClose }: PredictiveMaintenanceDialogProps) {
  const [suggestions, setSuggestions] = useState<PredictiveMaintenanceSuggestionOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchSuggestions = async () => {
        setLoading(true);
        setError(null);
        setSuggestions(null);

        try {
          // 1. Fetch all reports
          const allReports = await getReports();
          
          // 2. Filter reports for the current asset
          const historicalReports = allReports
            .filter(report => report.id_bien === asset.id_bien)
            .map(report => ({
                reportId: report.id_informe,
                reportDate: new Date(report.tiempos.fin).toISOString(),
                inspectionResults: report.inspeccion,
            }));

          // 3. Prepare input for the AI flow
          const input = {
            assetId: asset.id_bien,
            assetCategory: asset.categoria,
            assetModel: asset.marca_modelo,
            assetSerialNumber: asset.numero_serie,
            assetPower: asset.potencia,
            historicalReports,
          };

          // 4. Call the AI flow
          const result = await predictiveMaintenanceSuggestion(input);
          setSuggestions(result);

        } catch (e) {
          console.error("Failed to get predictive maintenance suggestions:", e);
          setError("No se pudieron obtener las sugerencias de la IA. Inténtelo de nuevo más tarde.");
        } finally {
          setLoading(false);
        }
      };

      fetchSuggestions();
    }
  }, [isOpen, asset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="text-primary"/>
            Análisis Predictivo para {asset.id_bien}
          </DialogTitle>
          <DialogDescription>
            Sugerencias generadas por IA basadas en el historial de inspecciones del activo.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto pr-2">
          {loading && (
             <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
          )}
          {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {suggestions && (
            suggestions.suggestions.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {suggestions.suggestions.map((suggestion, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-4 text-left">
                                    <Badge variant={priorityVariant[suggestion.priority]}>{suggestion.priority}</Badge>
                                    <span className="font-semibold">{suggestion.assetComponent}: <span className="font-normal">{suggestion.description}</span></span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                <p><strong>Razón de la IA:</strong> {suggestion.reason}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>Activo en Buen Estado</AlertTitle>
                    <AlertDescription>
                        La IA no ha detectado patrones que requieran mantenimiento proactivo en este momento.
                    </AlertDescription>
                </Alert>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
