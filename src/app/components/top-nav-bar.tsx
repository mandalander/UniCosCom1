'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from './language-provider';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function TopNavBar() {
  const { t } = useLanguage();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-sidebar px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-4">
        {isUserLoading ? (
          <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
        ) : user ? (
          <Button onClick={handleLogout} variant="default">
            {t('logout')}
          </Button>
        ) : (
          <Button asChild variant="default">
            <Link href="/login">{t('login')}</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
