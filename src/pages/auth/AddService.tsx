import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdditionalServiceForm from '@/components/service-provider/AdditionalServiceForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AddService: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [providerId, setProviderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderId = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "Please log in to access this page",
          });
          navigate('/login');
          return;
        }

        const { data: provider, error } = await supabase
          .from('service_providers')
          .select('id')
          .eq('profile_id', session.session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching provider:', error);
          toast({
            variant: "destructive",
            title: "Error", 
            description: "Failed to load provider information",
          });
          navigate('/dashboard');
          return;
        }

        if (!provider) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You must be a registered service provider to add services",
          });
          navigate('/dashboard');
          return;
        }

        setProviderId(provider.id);
      } catch (error) {
        console.error('Error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred",
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchProviderId();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!providerId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Add Additional Service</h1>
          <p className="text-muted-foreground mt-2">
            Expand your service offerings by adding a new service type
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <h2 className="text-2xl font-semibold">New Service Details</h2>
            <p className="text-muted-foreground">
              Fill in the details for your additional service offering
            </p>
          </CardHeader>
          <CardContent>
            <AdditionalServiceForm providerId={providerId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddService;