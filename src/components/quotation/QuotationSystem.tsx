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

interface QuotationRequest {
  id?: string;
  service_type: string;
  description: string;
  event_date?: string;
  budget_range?: string;
  location: string;
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
      const { data, error } = await supabase
        .from('quotation_requests')
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
      return data;
    },
    enabled: !!userId,
  });

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const requestData = {
        ...formData,
        user_id: userId,
        provider_id: providerId || null,
        status: 'pending'
      };

      const { error } = await supabase
        .from('quotation_requests')
        .insert(requestData);

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
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Event location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Event Date (Optional)</label>
                  <Input
                    type="date"
                    value={formData.event_date || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range (Optional)</label>
                  <Select
                    value={formData.budget_range || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, budget_range: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-10k">Under ₹10,000</SelectItem>
                      <SelectItem value="10k-25k">₹10,000 - ₹25,000</SelectItem>
                      <SelectItem value="25k-50k">₹25,000 - ₹50,000</SelectItem>
                      <SelectItem value="50k-1l">₹50,000 - ₹1,00,000</SelectItem>
                      <SelectItem value="above-1l">Above ₹1,00,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Guest Count (Optional)</label>
                  <Input
                    type="number"
                    value={formData.guest_count || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, guest_count: parseInt(e.target.value) || undefined }))}
                    placeholder="Number of guests"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your requirements in detail..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Special Requirements (Optional)</label>
                <Textarea
                  value={formData.special_requirements || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, special_requirements: e.target.value }))}
                  placeholder="Any special requirements or preferences..."
                  rows={2}
                />
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
          <CardTitle>Your Quotation Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {!quotationRequests || quotationRequests.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No quotation requests yet</p>
          ) : (
            <div className="space-y-4">
              {quotationRequests.map((request) => (
                <Card key={request.id} className="border border-gray-200">
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
                          <div className="text-sm text-gray-600 mb-2">
                            Provider: {request.service_providers.business_name}
                          </div>
                        )}

                        <p className="text-gray-600 mb-2">{request.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-500">
                          <div>📍 {request.location}</div>
                          {request.event_date && (
                            <div>📅 {format(new Date(request.event_date), 'PP')}</div>
                          )}
                          {request.guest_count && (
                            <div>👥 {request.guest_count} guests</div>
                          )}
                          {request.budget_range && (
                            <div>💰 {request.budget_range}</div>
                          )}
                        </div>

                        {request.special_requirements && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Special Requirements:</span> {request.special_requirements}
                          </div>
                        )}
                      </div>

                      <div className="text-right space-y-2">
                        <div className="text-xs text-gray-500">
                          {request.created_at && format(new Date(request.created_at), 'PPP')}
                        </div>
                        
                        {request.status === 'quoted' && request.quoted_amount && (
                          <div className="space-y-1">
                            <div className="text-lg font-bold text-ceremonial-gold">
                              ₹{request.quoted_amount.toLocaleString()}
                            </div>
                            {request.quoted_description && (
                              <div className="text-sm text-gray-600">
                                {request.quoted_description}
                              </div>
                            )}
                            <div className="space-x-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Accept
                              </Button>
                              <Button size="sm" variant="outline">
                                Decline
                              </Button>
                            </div>
                          </div>
                        )}
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
