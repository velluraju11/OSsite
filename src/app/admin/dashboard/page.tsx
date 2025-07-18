
import { fetchSubmissions } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import type { Submission as SubmissionType } from '@/lib/db';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';


function ViewSubmissionDialog({ submission }: { submission: SubmissionType }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View Submission</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>Full details for {submission.fullName}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm max-h-[60vh] overflow-y-auto pr-4">
          <p><strong>Full Name:</strong> {submission.fullName}</p>
          <p><strong>Username:</strong> {submission.username}</p>
          <p><strong>Email:</strong> {submission.email}</p>
          <p><strong>Mobile:</strong> {submission.mobile}</p>
          <p><strong>Designation:</strong> {submission.designation}</p>
          {submission.otherDesignation && <p><strong>Specified Designation:</strong> {submission.otherDesignation}</p>}
          <div>
            <p><strong>Desired Features:</strong></p>
            <p className="pl-2 mt-1 whitespace-pre-wrap bg-muted p-2 rounded-md">{submission.features}</p>
          </div>
           <div>
            <p><strong>Reason:</strong></p>
            <p className="pl-2 mt-1 whitespace-pre-wrap bg-muted p-2 rounded-md">{submission.reason}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default async function DashboardPage() {
  const { submissions, error } = await fetchSubmissions();

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>View and manage waitlist submissions for Ryha OS.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
             {error && (
                <Alert variant="destructive" className="mb-4">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Database Error</AlertTitle>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead className="hidden md:table-cell">Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Designation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions && submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.fullName}</TableCell>
                      <TableCell className="hidden md:table-cell">{submission.username}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell className="hidden lg:table-cell">{submission.designation === 'other' ? submission.otherDesignation : submission.designation}</TableCell>
                      <TableCell className="text-right">
                        <ViewSubmissionDialog submission={submission} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No submissions yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
