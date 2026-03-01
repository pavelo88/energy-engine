'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Receipt, Save, Loader2, User, Euro, Trash2, Plus, 
  FileText, ClipboardSignature, Upload, Camera, Calendar as CalendarIcon, FileSearch, Building
} from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadString } from 'firebase/storage';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';

// --- TIPOS DE DATOS ---
type GastoItem = {
  rubro: string;
  monto: number;
  descripcion:string;
  forma_pago: string;
  comprobanteUrl?: string;
  comprobanteFile?: File;
};

const initialGastoState = { rubro: 'Alimentación', monto: '', descripcion: '', forma_pago: 'Efectivo', comprobanteFile: undefined };

// --- COMPONENTE PRINCIPAL ---
export default function ExpensesTab() {
  const { user } = useUser();
  const db = useFirestore();
  const storage = db ? getStorage(db.app) : null;

  const [reportDate, setReportDate] = useState<Date>(new Date());
  const [clientName, setClientName] = useState('');
  
  const [gastos, setGastos] = useState<GastoItem[]>([]);
  const [currentGasto, setCurrentGasto] = useState<any>(initialGastoState);
  
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LÓGICA DE FIRMA ---
  useEffect(() => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let drawing = false;
    ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.strokeStyle = '#0f172a';

    const getPos = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    }
    const start = (e: any) => { drawing = true; draw(e) };
    const end = () => { if(drawing) { drawing = false; ctx.beginPath(); setSignature(canvas.toDataURL()); }};
    const draw = (e: any) => {
        if (!drawing) return; e.preventDefault();
        const { x, y } = getPos(e);
        ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y);
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mouseup', end); canvas.addEventListener('mouseleave', end);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchend', end);
    canvas.addEventListener('touchmove', draw, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mouseup', end); canvas.removeEventListener('mouseleave', end);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchend', end);
      canvas.removeEventListener('touchmove', draw);
    };
  }, []);

  const clearCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setSignature(null);
    }
  };

  // --- LÓGICA DEL FORMULARIO ---
  const handleAddGasto = () => {
    if (!currentGasto.monto || !currentGasto.descripcion) {
      return alert("El monto y la descripción del gasto son obligatorios.");
    }
    setGastos([...gastos, { ...currentGasto, monto: parseFloat(currentGasto.monto) }]);
    setCurrentGasto(initialGastoState);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCurrentGasto(prev => ({ ...prev, comprobanteFile: e.target.files[0] }));
    }
  };

  const totalGastos = useMemo(() => gastos.reduce((acc, curr) => acc + curr.monto, 0), [gastos]);

  // --- LÓGICA DE PDF ---
  const createParteDiarioPDF = (data: any) => {
    const doc = new jsPDF();
    const darkColor = '#0f172a';

    // Header
    doc.setFillColor(darkColor);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("REPORTE DE GASTOS", 15, 18);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Inspector: ${data.inspectorNombre || 'No especificado'}`, 205, 12, { align: 'right' });
    doc.text(`Fecha: ${format(data.fecha, 'dd \'de\' MMMM \'de\' yyyy', { locale: es })}`, 205, 18, { align: 'right' });

    let currentY = 40;
    doc.setTextColor(darkColor);
    doc.setFontSize(12);
    doc.text(`Cliente: ${data.clienteNombre || 'No especificado'}`, 15, currentY);

    currentY += 10;
    
    // Summary Card
    doc.setFillColor('#F1F5F9');
    doc.roundedRect(15, currentY, 180, 20, 3, 3, 'F');
    
    doc.setTextColor(darkColor);
    doc.setFontSize(10);
    doc.text('GASTOS TOTALES DEL REPORTE', 20, currentY + 7);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.monto.toFixed(2)} €`, 20, currentY + 15);

    currentY += 30;

    // Expenses Table
    if (data.gastos.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Desglose de Gastos y Viáticos", 15, currentY);
      currentY += 7;
      autoTable(doc, {
        startY: currentY,
        head: [['Rubro', 'Descripción', 'Forma Pago', 'Comprobante', 'Monto (€)']],
        body: data.gastos.map((g: any) => [g.rubro, g.descripcion, g.forma_pago, g.comprobanteUrl || g.comprobanteFile ? 'Sí' : 'No', g.monto.toFixed(2)]),
        theme: 'grid',
        headStyles: { fillColor: darkColor, textColor: '#FFFFFF' },
        didParseCell: function (data: any) {
          if (data.column.dataKey === 4) {
            data.cell.styles.halign = 'right';
          }
        }
      });
      currentY = (doc as any).lastAutoTable.finalY;
    }

    // Signature
    const signatureY = doc.internal.pageSize.height - 50;
    doc.setLineWidth(0.5);
    doc.setDrawColor(darkColor);
    doc.line(15, signatureY + 25, 85, signatureY + 25);
    doc.setFontSize(10);
    doc.text("Firma de Conformidad", 40, signatureY + 30);
    if(data.firmaUrl) {
      doc.addImage(data.firmaUrl, 'PNG', 20, signatureY, 60, 25);
    }
    
    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor('#94A3B8');
        doc.text(`Energy Engine © ${new Date().getFullYear()}`, 15, 290);
        doc.text(`Página ${i} de ${pageCount}`, 180, 290);
    }

    return doc;
  }

  const handlePreviewPDF = () => {
    if (!user) return alert("Error de autenticación. Por favor, recarga la página.");
    if (!clientName) return alert("Por favor, introduce el nombre del cliente.");
    
    const parteDataForPreview = {
        inspectorNombre: user.displayName || user.email,
        fecha: reportDate,
        clienteNombre: clientName,
        gastos: gastos,
        monto: totalGastos,
        firmaUrl: signature,
    };
    const doc = createParteDiarioPDF(parteDataForPreview);
    const pdfDataUri = doc.output('datauristring');
    setPreviewPdfUrl(pdfDataUri);
  }

  const generateAndUploadPDF = async (data: any, docId: string) => {
    if(!storage) throw new Error("Storage not available");
    const doc = createParteDiarioPDF(data);
    const pdfDataUri = doc.output('datauristring');
    const storageRef = ref(storage, `gastos_informes/${docId}.pdf`);
    await uploadString(storageRef, pdfDataUri, 'data_url');
    return getDownloadURL(storageRef);
  };

  const handleSaveParte = async () => {
    if (!user || !db || !storage) return alert("Error de autenticación o servicios no disponibles. Por favor, recarga la página.");
    if (!clientName) return alert("Por favor, introduce el nombre del cliente.");
    if (gastos.length === 0 && !signature) return alert("Debes añadir al menos un gasto o firmar para crear un reporte.");
    if (!signature) return alert("La firma del inspector es obligatoria.");

    setLoading(true);
    try {
        const docId = `GTO-${Date.now().toString().slice(-6)}`;

        const uploadedGastos = await Promise.all(gastos.map(async (g) => {
            if (g.comprobanteFile) {
                const fileRef = ref(storage, `comprobantes_gastos/${docId}/${g.comprobanteFile.name}`);
                await uploadBytes(fileRef, g.comprobanteFile);
                const url = await getDownloadURL(fileRef);
                return { ...g, comprobanteUrl: url, comprobanteFile: undefined };
            }
            return g;
        }));
        
        const firmaRef = ref(storage, `firmas_gastos/${docId}.png`);
        await uploadString(firmaRef, signature, 'data_url');
        const firmaUrl = await getDownloadURL(firmaRef);

        const gastoData = {
            id: docId,
            inspectorId: user.uid,
            inspectorNombre: user.displayName || user.email,
            clienteNombre: clientName,
            fecha: reportDate,
            monto: totalGastos,
            gastos: uploadedGastos.map(({comprobanteFile, ...rest}) => rest),
            firmaUrl: firmaUrl,
            estado: 'Pendiente',
            fechaCreacion: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, "gastos"), gastoData);
        
        const pdfUrl = await generateAndUploadPDF(gastoData, docRef.id);

        await updateDoc(doc(db, "gastos", docRef.id), { pdfUrl: pdfUrl });

        alert("¡Reporte de gastos guardado y PDF generado con éxito!");
        
        setReportDate(new Date());
        setClientName('');
        setGastos([]);
        clearCanvas();

    } catch (e: any) {
        console.error("Error al guardar el parte de gastos: ", e);
        alert("Error al guardar: " + e.message);
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="space-y-6 pb-24 md:pb-10 animate-in fade-in slide-in-from-right-4 duration-500">
      
       <Dialog open={!!previewPdfUrl} onOpenChange={(isOpen) => !isOpen && setPreviewPdfUrl(null)}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Vista Previa del Reporte</DialogTitle>
             <DialogDescription>
              Revisa el borrador de tu reporte antes de guardarlo.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 bg-slate-200 p-4">
            {previewPdfUrl && (
              <iframe src={previewPdfUrl} className="w-full h-full shadow-md rounded-lg" title="PDF Preview" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* SECCIÓN 1: CABECERA DEL PARTE */}
      <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><FileText size={20} /></div>
          <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">Reporte de Gastos por Cliente</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Escribir nombre del cliente..."
                    className="w-full h-auto p-4 pl-12 rounded-xl bg-slate-50 border-transparent focus:border-amber-500 focus:ring-amber-500 font-semibold"
                />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-full h-auto p-4 rounded-xl flex items-center justify-start gap-3 font-semibold text-slate-700 bg-slate-50 border-transparent hover:border-slate-200">
                    <CalendarIcon size={16} className="text-slate-400" /> {format(reportDate, "PPP", { locale: es })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={reportDate} onSelect={(date) => date && setReportDate(date)} initialFocus/>
              </PopoverContent>
            </Popover>
        </div>
         <div className='p-4 rounded-xl bg-slate-50 flex items-center gap-3 text-sm font-semibold text-slate-500'>
                <User size={16} /> Inspector: {user?.displayName || user?.email || 'Cargando...'}
            </div>
      </section>

      {/* SECCIÓN 2: GASTOS ASOCIADOS */}
      <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-sm tracking-wider"><Receipt size={18} className="text-blue-500"/> Gastos y Viáticos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input value={currentGasto.monto} onChange={e => setCurrentGasto({...currentGasto, monto: e.target.value})} type="number" placeholder="Monto (€)" className="p-4 h-auto rounded-lg bg-slate-50 border-transparent font-semibold" />
            
            <Select value={currentGasto.rubro} onValueChange={value => setCurrentGasto({...currentGasto, rubro: value})}>
              <SelectTrigger className="p-4 h-auto rounded-lg bg-slate-50 border-transparent font-semibold"><SelectValue/></SelectTrigger>
              <SelectContent>
                {['Alimentación', 'Combustible', 'Peajes', 'Hospedaje', 'Repuestos', 'Otros'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>

            <Input value={currentGasto.descripcion} onChange={e => setCurrentGasto({...currentGasto, descripcion: e.target.value})} type="text" placeholder="Descripción del gasto" className="p-4 h-auto rounded-lg bg-slate-50 border-transparent font-semibold md:col-span-2" />
            
             <Select value={currentGasto.forma_pago} onValueChange={value => setCurrentGasto({...currentGasto, forma_pago: value})}>
                <SelectTrigger className="p-4 h-auto rounded-lg bg-slate-50 border-transparent font-semibold"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                </SelectContent>
            </Select>
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="p-4 h-auto rounded-lg font-semibold flex items-center justify-center gap-2 bg-slate-50 border-transparent hover:bg-slate-100">
                <Camera size={16}/> {currentGasto.comprobanteFile ? 'Foto OK' : 'Comprobante'}
            </Button>
            
            <Button onClick={handleAddGasto} className="p-4 h-auto rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center gap-2 md:col-span-2 hover:bg-blue-700">
                <Plus size={16}/>Añadir Gasto
            </Button>
        </div>
        
        <div className="space-y-2 pt-4 border-t">
            {gastos.map((g, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        {g.comprobanteUrl || g.comprobanteFile ? <Camera size={16} className="text-blue-500"/> : <Euro size={16} className="text-emerald-500"/>}
                        <div>
                            <p className="font-bold text-sm text-slate-800">{g.descripcion}</p>
                            <p className="text-xs text-slate-500">{g.rubro} - {g.forma_pago}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-800">{g.monto.toFixed(2)}€</span>
                        <Button variant="ghost" size="icon" onClick={() => setGastos(gastos.filter((_, idx) => i !== idx))} className="text-red-500 hover:bg-red-100 rounded-full h-8 w-8"><Trash2 size={16}/></Button>
                    </div>
                </div>
            ))}
            {gastos.length === 0 && <p className="text-center text-xs text-slate-400 font-semibold py-4">No hay gastos añadidos a este parte.</p>}
        </div>
         {gastos.length > 0 && 
                <div className="text-right font-bold text-blue-600 bg-blue-50 p-3 rounded-lg">
                    TOTAL GASTOS: {totalGastos.toFixed(2)} €
                </div>
            }
      </section>

      {/* SECCIÓN 3: FIRMA DEL TÉCNICO */}
      <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-sm tracking-wider"><ClipboardSignature size={18} className="text-blue-500"/> Firma de Conformidad</h3>
        <div className="space-y-2">
            <canvas ref={signatureCanvasRef} width={600} height={200} className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-crosshair touch-none" />
            <button onClick={clearCanvas} className="text-xs text-red-500 font-bold hover:underline">Limpiar Firma</button>
        </div>
      </section>

      {/* SECCIÓN 4: ACCIONES */}
      <div className="flex flex-col md:flex-row gap-4">
        <Button onClick={handlePreviewPDF} disabled={loading} variant="outline" className="w-full p-8 rounded-3xl font-bold text-lg shadow-lg flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-50 bg-white hover:bg-slate-50">
            <FileSearch size={22} />
            VISTA PREVIA
        </Button>
        <Button onClick={handleSaveParte} disabled={loading} className="w-full p-8 bg-slate-900 text-white rounded-3xl font-bold text-xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-50 hover:bg-slate-800">
          {loading ? <Loader2 className="animate-spin text-blue-500" /> : <Upload className="text-blue-500" />}
          {loading ? 'GUARDANDO...' : 'FINALIZAR Y SUBIR REPORTE'}
        </Button>
      </div>
    </div>
  );
}
