import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { PaymentInformation } from "./PaymentInformation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface PaymentDetailsData {
  payment_method: "bank_account" | "upi" | "qr_code";
  account_holder_name?: string;
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  upi_id?: string;
  qr_code_url?: string;
}

interface AdvancePaymentData {
  requires_advance_payment: boolean;
  advance_payment_percentage: number;
}

export function PaymentSettings() {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [paymentMethod, setPaymentMethod] = useState<"bank_account" | "upi" | "qr_code">("bank_account");
  const [advanceSettings, setAdvanceSettings] = useState({
    requiresAdvance: false,
    percentage: 0
  });

  // Get provider ID
  const { data: provider } = useQuery({
    queryKey: ["provider-id"],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data, error } = await supabase
        .from("service_providers")
        .select("id, requires_advance_payment, advance_payment_percentage")
        .eq("profile_id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user,
  });

  // Load existing payment details
  const { data: existingPaymentDetails } = useQuery({
    queryKey: ["payment-details", provider?.id],
    queryFn: async () => {
      if (!provider?.id) return null;
      
      const { data, error } = await supabase
        .from("provider_payment_details")
        .select("*")
        .eq("provider_id", provider.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!provider?.id,
  });

  // Load existing payment details and advance settings
  useEffect(() => {
    if (provider) {
      setAdvanceSettings({
        requiresAdvance: provider.requires_advance_payment || false,
        percentage: provider.advance_payment_percentage || 0
      });
    }

    if (existingPaymentDetails) {
      setPaymentMethod(existingPaymentDetails.payment_method as "bank_account" | "upi" | "qr_code");
    }
  }, [provider, existingPaymentDetails]);

  // Save payment settings mutation
  const savePaymentSettings = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!provider?.id) throw new Error("Provider not found");

      const paymentData: PaymentDetailsData = {
        payment_method: paymentMethod,
      };

      // Add method-specific fields
      if (paymentMethod === "bank_account") {
        paymentData.account_holder_name = formData.get("account_holder_name") as string;
        paymentData.bank_name = formData.get("bank_name") as string;
        paymentData.account_number = formData.get("account_number") as string;
        paymentData.ifsc_code = formData.get("ifsc_code") as string;
      } else if (paymentMethod === "upi") {
        paymentData.upi_id = formData.get("upi_id") as string;
      } else if (paymentMethod === "qr_code") {
        paymentData.qr_code_url = formData.get("qr_code_url") as string;
      }

      // Upsert payment details
      const { error: paymentError } = await supabase
        .from("provider_payment_details")
        .upsert({
          provider_id: provider.id,
          ...paymentData,
        }, {
          onConflict: 'provider_id'
        });

      if (paymentError) throw paymentError;

      // Update advance payment settings
      const { error: advanceError } = await supabase
        .from("service_providers")
        .update({
          requires_advance_payment: advanceSettings.requiresAdvance,
          advance_payment_percentage: advanceSettings.percentage,
        })
        .eq("id", provider.id);

      if (advanceError) throw advanceError;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payment settings updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["payment-details"] });
    },
    onError: (error: any) => {
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update payment settings",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    savePaymentSettings.mutate(formData);
  };

  const handleAdvancePaymentChange = (requiresAdvance: boolean, percentage: number) => {
    setAdvanceSettings({ requiresAdvance, percentage });
  };

  if (!provider) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading payment settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentInformation
            onPaymentMethodChange={setPaymentMethod}
            onAdvancePaymentChange={handleAdvancePaymentChange}
            initialAdvanceSettings={advanceSettings}
          />
          
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={savePaymentSettings.isPending}
              className="bg-ceremonial-gold hover:bg-ceremonial-gold/90"
            >
              {savePaymentSettings.isPending ? "Saving..." : "Save Payment Settings"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}