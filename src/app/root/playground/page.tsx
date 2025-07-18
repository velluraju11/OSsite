import { getSubmissions } from '@/lib/db';
import { SubmissionsTable } from './submissions-table';
import { LogoutButton } from './logout-button';

export default async function RootPlaygroundPage() {
  const submissions = await getSubmissions();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
         <h1 className="font-headline text-2xl">Root Playground</h1>
         <div className="ml-auto">
            <LogoutButton />
         </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="rounded-lg border shadow-sm">
           <SubmissionsTable submissions={submissions} />
        </div>
      </main>
    </div>
  );
}
