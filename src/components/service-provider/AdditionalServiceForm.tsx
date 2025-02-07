
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AdditionalServiceFormProps {
  providerId: string;
}

const AdditionalServiceForm = ({ providerId }: AdditionalServiceFormProps) => {
  const { toast } = useToast();
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    setUploadError(null);

    try {
      if (!serviceType || !description || !basePrice) {
        throw new Error("Please fill in all required fields");
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("You must be logged in to submit additional services");
      }

      const { error } = await supabase.from("additional_services").insert({
        provider_id: providerId,
        service_type: serviceType,
        description,
        base_price: parseFloat(basePrice),
        portfolio_images: portfolioImages,
      });

      if (error) {
        console.error("Submission error:", error);
        throw new Error(error.message);
      }

      toast({
        title: "Success",
        description: "Your additional service has been submitted for review.",
      });

      setServiceType("");
      setDescription("");
      setBasePrice("");
      setPortfolioImages([]);
      setIsOpen(false);
      setShowConfirmation(false);
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
      if (portfolioImages.length >= 5) {
        throw new Error("Maximum 5 images allowed");
      }
      
      setPortfolioImages((prev) => [...prev, url]);
      setUploadError(null);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      setUploadError(error.message);
      console.error("Error handling image upload:", error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload image. Please try again.",
      });
    }
  };

  const removeImage = (indexToRemove: number) => {
    setPortfolioImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    toast({
      description: "Image removed successfully",
    });
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
              <Label className="text-base">Base Price (₹)</Label>
              <Input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="Enter base price"
                min="0"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base">Description</Label>
              <Textarea
                placeholder="Describe your additional service in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base">Portfolio Images</Label>
                <span className="text-sm text-gray-500">
                  {portfolioImages.length}/5 images
                </span>
              </div>
              <div className="space-y-4">
                {portfolioImages.length < 5 && (
                  <ImageUpload
                    onUploadComplete={handleImageUpload}
                    className="w-full"
                    maxSizeInBytes={5 * 1024 * 1024}
                    allowedFileTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
                  />
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {portfolioImages.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Additional Service"}
              </Button>
            </DialogFooter>
          </form>
        </Card>
      </DialogContent>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this additional service? Please review all details before confirming.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={submitForm}
              className="bg-ceremonial-gold hover:bg-ceremonial-gold/90"
            >
              Confirm Submission
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );