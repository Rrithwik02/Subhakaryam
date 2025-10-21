import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Send, Clock, CheckCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { z } from 'zod';

const quotationSchema = z.object({
  description: z.string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  special_requirements: z.string()
    .max(500, "Special requirements must be less than 500 characters")
    .optional(),
});

interface QuotationRequest {
  id?: string;
  service_type: string;
  description: string;
  event_date?: string;
  budget_range?: string;
  location?: string;
  guest_count?: number;
  special_requirements?: string;
  images?: string[];
  provider_id?: string;
  status?: 'pending' | 'quoted' | 'accepted' | 'declined';
  quoted_amount?: number;
  quoted_description?: string;
  created_at?: string;
}

interface QuotationSystemProps {
  userId: string;
  providerId?: string;
  serviceType?: string;
}

const QuotationSystem = ({ userId, providerId, serviceType }: QuotationSystemProps) => {
  const { toast } = useToast();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState<QuotationRequest>({
    service_type: serviceType || '',
    description: '',
    location: '',
    budget_range: '',
    special_requirements: ''
  });

  const { data: quotationRequests, refetch } = useQuery({
    queryKey: ['quotation-requests', userId],
    queryFn: async () => {
      // Using service_requests as a temporary placeholder until quotation_requests types are available
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          service_providers (
            business_name,
            service_type,
            city,
            rating,
            profile_image
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate input
      const validated = quotationSchema.parse({
        description: formData.description,
        special_requirements: formData.special_requirements || '',
      });

      const { error } = await supabase
        .from('service_requests')
        .insert({
          user_id: userId,
          provider_id: providerId || null,
          service_type: formData.service_type,
          description: validated.description,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Quotation Request Sent',
        description: 'Your request has been sent successfully. You will receive a quote soon.',
      });

      setFormData({
        service_type: serviceType || '',
        description: '',
        location: '',
        budget_range: '',
        special_requirements: ''
      });
      setShowRequestForm(false);
      refetch();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: error.issues[0].message,
        });
        return;
      }
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send quotation request. Please try again.',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'quoted': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined': return <X className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'quoted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Request Form */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Request Custom Quotation</CardTitle>
          <Button
            onClick={() => setShowRequestForm(!showRequestForm)}
            variant={showRequestForm ? "outline" : "default"}
          >
            {showRequestForm ? 'Cancel' : 'New Request'}
          </Button>
        </CardHeader>
        
        {showRequestForm && (
          <CardContent>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Service Type</label>
                  <Select
                    value={formData.service_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pooja">Pooja Services</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="catering">Catering</SelectItem>
                      <SelectItem value="decoration">Decoration</SelectItem>
                      <SelectItem value="music">Music Services</SelectItem>
                      <SelectItem value="mehendi">Mehendi</SelectItem>
                      <SelectItem value="function_hall">Function Hall</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location (Optional)</label>
                  <Input
                    value={formData.location || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Event location"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your requirements in detail... (10-1000 characters)"
                  rows={3}
                  required
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description.trim().length}/1000 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Details (Optional)</label>
                <Textarea
                  value={formData.special_requirements || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, special_requirements: e.target.value }))}
                  placeholder="Any additional details or special requirements... (max 500 characters)"
                  rows={2}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {(formData.special_requirements || '').trim().length}/500 characters
                </p>
              </div>

              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Quotation Request
              </Button>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Existing Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Your Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {!quotationRequests || quotationRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No service requests yet</p>
          ) : (
            <div className="space-y-4">
              {quotationRequests.map((request) => (
                <Card key={request.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {request.service_type?.replace('_', ' ').toUpperCase()}
                          </h3>
                          <Badge className={getStatusColor(request.status || 'pending')}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(request.status || 'pending')}
                              {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                            </div>
                          </Badge>
                        </div>

                        {request.service_providers && (
                          <div className="text-sm text-muted-foreground mb-2">
                            Provider: {request.service_providers.business_name}
                          </div>
                        )}

                        <p className="text-muted-foreground mb-2">{request.description}</p>
                      </div>

                      <div className="text-right space-y-2">
                        <div className="text-xs text-muted-foreground">
                          {request.created_at && format(new Date(request.created_at), 'PPP')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotationSystem;
