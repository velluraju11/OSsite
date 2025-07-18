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
import { Submission } from '@/lib/db';

function ViewSubmissionDialog({ submission }: { submission: Submission }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View Submission</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>Full details for {submission.fullName}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <p><strong>Full Name:</strong> {submission.fullName}</p>
          <p><strong>Username:</strong> {submission.username}</p>
          <p><strong>Email:</strong> {submission.email}</p>
          <p><strong>Mobile:</strong> {submission.mobile}</p>
          <p><strong>Designation:</strong> {submission.designation}</p>
          {submission.otherDesignation && <p><strong>Specified Designation:</strong> {submission.otherDesignation}</p>}
          <p><strong>Desired Features:</strong> {submission.features}</p>
          <p><strong>Reason:</strong> {submission.reason}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default async function DashboardPage() {
  const submissions = await fetchSubmissions();

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.fullName}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.designation}</TableCell>
                      <TableCell className="text-right">
                        <ViewSubmissionDialog submission={submission} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No submissions yet.</TableCell>
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
