'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Submission } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface SubmissionsTableProps {
  submissions: Submission[];
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const [selectedSubmission, setSelectedSubmission] = React.useState<Submission | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Waitlist Submissions</CardTitle>
          <CardDescription>
            A list of all users who have joined the waitlist for Ryha OS.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Designation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length > 0 ? (
                submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.fullName}</TableCell>
                    <TableCell>{submission.username}</TableCell>
                    <TableCell className="hidden md:table-cell">{submission.email}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{submission.designation === 'other' ? submission.otherDesignation : submission.designation}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DialogTrigger asChild>
                         <Button variant="ghost" size="icon" onClick={() => setSelectedSubmission(submission)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View submission</span>
                        </Button>
                      </DialogTrigger>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No submissions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Full details for {selectedSubmission?.fullName}.
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="grid gap-4 py-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">Full Name</p>
                        <p>{selectedSubmission.fullName}</p>
                    </div>
                     <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">Username</p>
                        <p>{selectedSubmission.username}</p>
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">Email</p>
                        <p>{selectedSubmission.email}</p>
                    </div>
                     <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">Mobile</p>
                        <p>{selectedSubmission.mobile}</p>
                    </div>
                </div>
                 <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Designation</p>
                    <p>{selectedSubmission.designation === 'other' ? selectedSubmission.otherDesignation : selectedSubmission.designation}</p>
                </div>
                <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Features Wanted</p>
                    <p className="p-2 bg-muted/50 rounded-md">{selectedSubmission.features}</p>
                </div>
                 <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Reason for Wanting Ryha OS</p>
                    <p className="p-2 bg-muted/50 rounded-md">{selectedSubmission.reason}</p>
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
