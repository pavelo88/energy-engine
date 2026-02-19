'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, MapPin, PhoneCall, Facebook, Instagram, Linkedin } from 'lucide-react';
import { enhanceTechnicalRequest } from '@/ai/flows/enhance-technical-request-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { contactInfo, socialLinks } from '@/lib/data';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  technicalRequest: z.string().min(10, { message: 'Los detalles deben tener al menos 10 caracteres.' }),
});

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', technicalRequest: '' },
  });

  const handleEnhance = async () => {
    const currentText = form.getValues('technicalRequest');
    if (!currentText.trim()) return;

    setIsEnhancing(true);
    try {
      const result = await enhanceTechnicalRequest({ technicalRequest: currentText });
      form.setValue('technicalRequest', result.enhancedRequest, { shouldValidate: true });
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error de IA',
        description: 'No se pudo mejorar el texto. Inténtelo más tarde.',
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(values);
    setIsSubmitting(false);
    toast({
      title: 'Solicitud Enviada',
      description: 'Gracias por contactarnos. Nos pondremos en contacto pronto.',
    });
    form.reset();
  }

  return (
    <section id="contacto" className="py-32 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="bg-secondary/50 dark:bg-white/[0.03] p-8 md:p-10 rounded-lg border">
          <h3 className="text-3xl font-black uppercase mb-8 font-headline">Solicitar Asistencia</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl><Input placeholder="NOMBRE" {...field} className="uppercase font-bold text-sm bg-transparent border-0 border-b rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl><Input type="email" placeholder="EMAIL" {...field} className="uppercase font-bold text-sm bg-transparent border-0 border-b rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="technicalRequest"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl><Textarea rows={4} placeholder="DETALLES TÉCNICOS..." {...field} className="uppercase font-bold text-sm bg-transparent border-0 border-b rounded-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary pr-32" /></FormControl>
                    <Button type="button" onClick={handleEnhance} disabled={isEnhancing} size="sm" className="absolute right-2 bottom-4 flex items-center gap-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg">
                      {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Mejorar con IA
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground py-6 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Requerimiento
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-8">
          <div className="h-[400px] rounded-lg overflow-hidden border-4 shadow-2xl relative group">
            <iframe src={contactInfo.mapUrl} className="w-full h-full map-filter transition-all duration-700" allowFullScreen loading="lazy"></iframe>
          </div>
          <div className="flex items-start gap-4 px-4 text-muted-foreground">
            <MapPin className="text-primary shrink-0 mt-1" size={20} />
            <p className="text-sm font-bold uppercase tracking-widest">{contactInfo.address}</p>
          </div>
          <div className="bg-secondary/50 dark:bg-white/[0.03] p-10 rounded-lg border flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-primary-foreground"><PhoneCall size={28}/></div>
              <div className="text-4xl font-black tracking-tighter">{contactInfo.phone}</div>
            </div>
            <div className="flex gap-4">
              {[
                {href: socialLinks.facebook, icon: Facebook, hover: 'hover:bg-blue-600'},
                {href: socialLinks.instagram, icon: Instagram, hover: 'hover:bg-pink-600'},
                {href: socialLinks.linkedin, icon: Linkedin, hover: 'hover:bg-blue-700'}
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <Button key={i} variant="outline" size="icon" asChild className={`w-12 h-12 rounded-full border bg-card ${social.hover} hover:text-white transition-all`}>
                    <Link href={social.href} target="_blank"><Icon size={20}/></Link>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
