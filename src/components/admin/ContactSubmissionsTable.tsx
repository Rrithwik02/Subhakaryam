
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Eye, Check, X } from "lucide-react";

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
};

const ContactSubmissionsTable = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load contact submissions",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setSubmissions(prev => 
        prev.map(submission => 
          submission.id === id ? { ...submission, status } : submission
        )
      );

      toast({
        title: "Status Updated",
        description: `Submission marked as ${status}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update submission status",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-ceremonial-maroon mb-6">
        Contact Submissions
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : submissions.length > 0 ? (
        <Table>
          <TableCaption>A list of all contact form submissions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission.name}</TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell>{submission.phone}</TableCell>
                <TableCell>
                  {format(new Date(submission.created_at), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      submission.status === "resolved" ? "default" : 
                      submission.status === "rejected" ? "destructive" : 
                      "outline"
                    }
                  >
                    {submission.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Contact Submission</DialogTitle>
                        </DialogHeader>
                        {selectedSubmission && (
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500">From</p>
                              <p className="font-medium">{selectedSubmission.name}</p>
                              <p className="text-sm">{selectedSubmission.email}</p>
                              <p className="text-sm">{selectedSubmission.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Message</p>
                              <p className="whitespace-pre-wrap">{selectedSubmission.message}</p>
                            </div>
                            <div className="pt-4 flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                onClick={() => updateStatus(selectedSubmission.id, "rejected")}
                              >
                                <X className="h-4 w-4 mr-2" /> Reject
                              </Button>
                              <Button 
                                onClick={() => updateStatus(selectedSubmission.id, "resolved")}
                              >
                                <Check className="h-4 w-4 mr-2" /> Mark as Resolved
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => updateStatus(submission.id, "resolved")}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => updateStatus(submission.id, "rejected")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-12 text-gray-500">No contact submissions found</div>
      )}
    </div>
  );
};

export default ContactSubmissionsTable;
