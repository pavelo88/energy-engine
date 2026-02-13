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
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BrainCircuit, AlertTriangle, FileText } from 'lucide-react';
import type { Report } from '@/lib/types';
import { criticalReportSummary, type CriticalReportSummaryOutput, type CriticalReportInput } from '@/ai/flows/critical-report-summary';

interface CriticalSummaryDialogProps {
  reports: Report[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CriticalSummaryDialog({ reports, isOpen, onClose }: CriticalSummaryDialogProps) {
  const [summary, setSummary] = useState<CriticalReportSummaryOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchSummary = async () => {
        setLoading(true);
        setError(null);
        setSummary(null);

        if (reports.length === 0) {
            setLoading(false);
            return;
        }

        try {
          // The AI flow expects a specific input format.
          const formattedReports: CriticalReportInput = reports.map(r => ({
              id_informe: r.id_informe,
              id_bien: r.id_bien,
              estado: r.estado,
              core_issue: r.core_issue || 'No especificado',
              recommended_actions: r.recommended_actions || 'No especificado',
              potential_impact: r.potential_impact || 'No especificado',
          }));
          
          const result = await criticalReportSummary(formattedReports);
          setSummary(result);

        } catch (e) {
          console.error("Failed to get critical report summary:", e);
          setError("No se pudo generar el resumen con la IA. Inténtelo de nuevo más tarde.");
        } finally {
          setLoading(false);
        }
      };

      fetchSummary();
    }
  }, [isOpen, reports]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BrainCircuit className="text-primary"/>
            Resumen de Informes Críticos
          </DialogTitle>
          <DialogDescription>
            Resumen generado por IA de los {reports.length} informes que requieren atención inmediata.
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
          {summary && (
            summary.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {summary.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-4 text-left">
                                    <FileText className="h-5 w-5 text-destructive flex-shrink-0" />
                                    <span className="font-semibold">Activo: {item.assetId}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                <p>{item.summary}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <Alert>
                    <BrainCircuit className="h-4 w-4" />
                    <AlertTitle>Análisis Completado</AlertTitle>
                    <AlertDescription>
                        La IA ha procesado los informes pero no ha generado un resumen. Esto puede ocurrir si no hay informes críticos válidos.
                    </AlertDescription>
                </Alert>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
