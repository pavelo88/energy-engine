'use server';

import { saveContactMessage as dbSaveContactMessage } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export async function saveContactMessage(formData: FormData) {
  const rawFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    message: formData.get('message') as string,
  };

  // Basic validation
  if (!rawFormData.name || !rawFormData.email || !rawFormData.message) {
    return { success: false, message: 'Nombre, email y mensaje son requeridos.' };
  }

  const result = await dbSaveContactMessage(rawFormData);
  
  if (result.success) {
    revalidatePath('/');
  }

  return result;
}
