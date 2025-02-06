
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ServiceSelection } from "./ServiceSelection";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdditionalServiceFormProps {
  providerId: string;
}

const AdditionalServiceForm = ({ providerId }: AdditionalServiceFormProps) => {
  const { toast } = useToast();
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadError(null);

    try {
      if (!serviceType || !description) {
        throw new Error("Please fill in all required fields");
      }

      const { error } = await supabase.from("additional_services").insert({
        provider_id: providerId,
        service_type: serviceType,
        description,
        portfolio_images: portfolioImages,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your additional service has been submitted for review.",
      });

      setServiceType("");
      setDescription("");
      setPortfolioImages([]);
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error submitting additional service:", error);
      setUploadError(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit additional service. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (url: string) => {
    try {
      setPortfolioImages((prev) => [...prev, url]);
      setUploadError(null);
      
      // Show success toast for image upload
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      setUploadError("Failed to add image. Please try again.");
      console.error("Error handling image upload:", error);
      
      // Show error toast
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image. Please try again.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="shadow-[5px_5px_10px_#b8b8b8,-5px_-5px_10px_#ffffff] border-ceremonial-gold text-ceremonial-gold hover:bg-ceremonial-gold hover:text-white backdrop-blur-md bg-white/30 flex items-center gap-2"
        >
          Add Extra Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-ceremonial-maroon text-center mb-6">
            Add Additional Service
          </DialogTitle>
        </DialogHeader>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {uploadError && (
              <Alert variant="destructive">
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}
            
            <ServiceSelection 
              onServiceChange={setServiceType} 
              className="space-y-2"
            />
            
            <div className="space-y-2">
              <Label className="text-gray-700">Description</Label>
              <Textarea
                placeholder="Describe the additional service you'd like to offer..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-gray-700">Portfolio Images</Label>
              <div className="space-y-4">
                <ImageUpload
                  onUploadComplete={handleImageUpload}
                  className="w-full"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {portfolioImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Additional Service"}
            </Button>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AdditionalServiceForm;
