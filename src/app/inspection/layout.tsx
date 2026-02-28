'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import ForceChangePassword from '@/components/auth/ForceChangePassword';

export default function InspectionLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<'loading' | 'authorized' | 'unauthorized' | 'needs_password_change'>('loading');

  useEffect(() => {
    if (isUserLoading) return;

    if (user && user.email) {
      const checkUserStatus = async () => {
        try {
          const userDocRef = doc(db, 'usuarios', user.email!);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.roles?.includes('inspector')) {
               if (userData.forcePasswordChange) {
                setAuthStatus('needs_password_change');
              } else {
                setAuthStatus('authorized');
              }
            } else {
              setAuthStatus('unauthorized');
              await auth.signOut();
              router.push('/auth/inspection');
            }
          } else {
            setAuthStatus('unauthorized');
            await auth.signOut();
            router.push('/auth/inspection');
          }
        } catch (error) {
            console.error("Error al verificar el rol del inspector:", error);
            setAuthStatus('unauthorized');
            await auth.signOut();
            router.push('/auth/inspection');
        }
      };
      checkUserStatus();
    } else {
      setAuthStatus('unauthorized');
      router.push('/auth/inspection');
    }
  }, [user, isUserLoading, router, auth, authStatus]);

  if (authStatus === 'loading' || authStatus === 'unauthorized') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (authStatus === 'needs_password_change') {
    return <ForceChangePassword onPasswordChanged={() => setAuthStatus('authorized')} />;
  }
  
  return <>{children}</>;
}
