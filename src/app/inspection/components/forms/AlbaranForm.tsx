'use client';
import React, { useState, useEffect, useRef } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { Wand2, Loader2, Save, FileSearch, Printer, CheckCircle2, User, Users, MapPin, Mail, Settings, Type } from 'lucide-react';
import { enhanceTechnicalRequest } from '@/ai/flows/enhance-technical-request-flow';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import SignaturePad from '../SignaturePad';

const StableInput = React.memo(({ label, value, onChange, icon: Icon, type = "text", placeholder }) => (
  <div className="space-y-1 w-full text-left">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18}/>}
      <input 
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 ${Icon ? 'pl-12' : ''} outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 shadow-sm`}
      />
    </div>
  </div>
));

export default function AlbaranForm({ initialData }: { initialData?: any }) {
  const { user } = useUser();
  const db = useFirestore();
  const inspectorName = user?.displayName || user?.email?.split('@')[0] || 'Técnico';
  
  const [formData, setFormData] = useState({
    cliente: { nombre: '', instalacion: '', direccion: '', potencia_kva: '', n_grupo: '' },
    equipo: { marca: '', modelo: '', sn: '' },
    observaciones: '',
    recibidoPor: '',
  });
  
  const [inspectorSignature, setInspectorSignature] = useState<string | null>(null);
  const [clientSignature, setClientSignature] = useState<string | null>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedDocId, setSavedDocId] = useState('');
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        cliente: initialData.cliente || prev.cliente,
        equipo: initialData.equipo || prev.equipo,
        observaciones: initialData.observaciones || '',
      }));
    }
  }, [initialData]);

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const improveReport = async () => {
    if (!formData.observaciones) return;
    setAiLoading(true);
    try {
      const res = await enhanceTechnicalRequest({ technicalRequest: formData.observaciones });
      setFormData(p => ({
        ...p, observaciones: res.improved,
        cliente: { ...p.cliente, nombre: res.extra?.cliente || p.cliente.nombre, n_grupo: res.extra?.n_grupo || p.cliente.n_grupo, potencia_kva: res.extra?.potencia || p.cliente.potencia_kva },
        equipo: { ...p.equipo, modelo: res.extra?.modelo || p.equipo.modelo, sn: res.extra?.sn || p.equipo.sn },
        recibidoPor: res.extra?.recibe || p.recibidoPor
      }));
    } catch(e) {
      console.error("AI enhancement failed:", e);
      alert("La IA tuvo problemas al refinar el informe.");
    } finally {
      setAiLoading(false);
    }
  };

  const generatePDF = (isDraft = false) => {
    const doc = new jsPDF();
    const finalID = isDraft ? 'BORRADOR' : savedDocId;
    
    doc.setFontSize(10);
    doc.text(`ALBARÁN DE TRABAJO - ${finalID}`, 105, 15, { align: 'center' });
    doc.autoTable({
        startY: 25,
        head: [['DATOS CLIENTE', 'INFORMACIÓN']],
        body: [
            ['CLIENTE', formData.cliente.nombre],
            ['INSTALACIÓN', formData.cliente.instalacion],
            ['TÉCNICO', inspectorName],
            ['FECHA', new Date().toLocaleDateString()],
        ],
        theme: 'grid',
    });
    
    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 5,
        head: [['TRABAJOS REALIZADOS']],
        body: [[formData.observaciones || 'Sin observaciones.']],
        theme: 'grid'
    });

    const signatureY = (doc as any).lastAutoTable.finalY + 20;
    doc.text("Firma Inspector:", 15, signatureY);
    if (inspectorSignature) doc.addImage(inspectorSignature, 'PNG', 15, signatureY + 5, 60, 25);
    doc.text("Firma Cliente:", 115, signatureY);
    if (clientSignature) doc.addImage(clientSignature, 'PNG', 115, signatureY + 5, 60, 25);

    return doc;
  };

  const handlePdfAction = () => {
    if (isSaved) {
      const doc = generatePDF(false);
      doc.save(`Albaran_${savedDocId}.pdf`);
    } else {
      const doc = generatePDF(true);
      setPreviewPdfUrl(doc.output('datauristring'));
    }
  };

  const handleSave = async () => {
    if (!db || !user) return;
    if (!clientSignature) return alert("La firma del cliente es obligatoria para guardar.");
    if (!inspectorSignature) return alert("La firma del inspector es obligatoria para guardar.");
    
    setSaving(true);
    const docId = `ALB-${Date.now().toString().slice(-6)}`;
    try {
      const docData = {
        ...formData,
        inspectorSignatureUrl: inspectorSignature,
        clientSignatureUrl: clientSignature,
        tecnicoId: user.uid,
        tecnicoNombre: inspectorName,
        fecha: Timestamp.now(),
        formType: 'albaran',
      };
      await setDoc(doc(db, 'trabajos', docId), docData);
      setSavedDocId(docId);
      setIsSaved(true);
      alert(`Albarán guardado con éxito. ID: ${docId}`);
    } catch (e) {
      console.error("Error saving document:", e);
      alert("Error al guardar el albarán.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-10 animate-in fade-in">
        
       <Dialog open={!!previewPdfUrl} onOpenChange={(isOpen) => !isOpen && setPreviewPdfUrl(null)}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Vista Previa del Albarán</DialogTitle>
             <DialogDescription>Revisa el borrador antes de guardarlo.</DialogDescription>
          </DialogHeader>
          <div className="flex-1">
            {previewPdfUrl && <iframe src={previewPdfUrl} className="w-full h-full" title="PDF Preview" />}
          </div>
        </DialogContent>
      </Dialog>
      
      <h2 className="text-2xl font-black text-black border-l-4 border-amber-500 pl-4 uppercase tracking-tighter">Albarán de Trabajo</h2>
      
      <section className="bg-white p-10 rounded-[3rem] shadow-sm space-y-8 border border-slate-100">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <StableInput label="Empresa / Cliente" icon={Users} value={formData.cliente.nombre} onChange={v => handleInputChange('cliente', 'nombre', v)}/>
            <StableInput label="Instalación / Ubicación" icon={MapPin} value={formData.cliente.instalacion} onChange={v => handleInputChange('cliente', 'instalacion', v)}/>
          </div>
      </section>

      <section className="bg-white p-10 rounded-[3rem] shadow-sm space-y-6 border border-slate-100">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3"><Type className="text-amber-500"/> Trabajos Realizados</h2>
            <button onClick={improveReport} disabled={aiLoading} className="flex items-center gap-2 text-xs font-bold bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100">
                {aiLoading ? <Loader2 size={14} className="animate-spin"/> : <Wand2 size={14} />}
                Pulir con IA
            </button>
        </div>
        <textarea className="w-full h-64 bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8 outline-none focus:border-amber-500 font-medium text-slate-600 shadow-inner resize-none leading-relaxed" placeholder="Describe los trabajos realizados..." value={formData.observaciones} onChange={e => setFormData(p => ({...p, observaciones: e.target.value}))}/>
     </section>

    <section className="bg-white p-10 rounded-[3rem] shadow-sm space-y-6 border border-slate-100">
        <h2 className="text-xl font-black text-slate-900">Firmas</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <SignaturePad title="Firma del Inspector" onSignatureEnd={setInspectorSignature} />
            <SignaturePad title="Firma del Cliente" onSignatureEnd={setClientSignature} />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
             <StableInput label="Recibido por (Nombre Cliente)" icon={User} value={formData.recibidoPor} onChange={v => setFormData(p => ({...p, recibidoPor: v}))}/>
        </div>
    </section>

    <div className="flex flex-col md:flex-row gap-4">
        <button onClick={handlePdfAction} className="w-full p-8 bg-white text-slate-900 border-2 border-slate-200 rounded-[2.5rem] font-bold text-lg shadow-lg flex items-center justify-center gap-4 active:scale-95 transition-all">
            {isSaved ? <Printer size={22} /> : <FileSearch size={22} />}
            {isSaved ? 'IMPRIMIR PDF' : 'VISTA PREVIA'}
        </button>
        <button onClick={handleSave} disabled={saving || isSaved} className="w-full p-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-50">
          {saving ? <Loader2 className="animate-spin text-amber-500" /> : isSaved ? <CheckCircle2 className="text-amber-500" /> : <Save className="text-amber-500" />}
          {saving ? 'GUARDANDO...' : isSaved ? 'GUARDADO' : 'GUARDAR ALBARÁN'}
        </button>
    </div>
    </main>
  );
}
