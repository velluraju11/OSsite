'use client';

import { useFormStatus } from 'react-dom';
import { logout } from '@/app/root/actions';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut } from 'lucide-react';

export function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <form action={logout}>
      <Button variant="outline" size="sm" disabled={pending}>
         {pending ? <Loader2 className="animate-spin" /> : <LogOut />}
        <span className="hidden sm:inline ml-2">Logout</span>
      </Button>
    </form>
  );
}
