import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { serviceCategories, getSubcategories, getSubcategoryDetails } from "@/data/services";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MobileOptimizedDialogContent } from "@/components/ui/mobile-optimized-dialog";
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
import { X, Plus } from "lucide-react";
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
  const [subcategory, setSubcategory] = useState("");
  const [customServiceName, setCustomServiceName] = useState("");
  const [customSubcategoryName, setCustomSubcategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
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
      if (!serviceType || !description || !minPrice || !maxPrice) {
        throw new Error("Please fill in all required fields");
      }

      if (serviceType === "other" && !customServiceName) {
        throw new Error("Please enter a custom service name");
      }

      if (parseInt(minPrice) > parseInt(maxPrice)) {
        throw new Error("Minimum price must be less than or equal to maximum price");
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("You must be logged in to submit additional services");
      }

      const { error } = await supabase.from("additional_services").insert({
        provider_id: providerId,
        service_type: serviceType === "other" ? customServiceName : serviceType,
        subcategory: subcategory === "other" ? customSubcategoryName : subcategory,
        description,
        min_price: parseFloat(minPrice),
        max_price: parseFloat(maxPrice),
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
      setSubcategory("");
      setCustomServiceName("");
      setCustomSubcategoryName("");
      setDescription("");
      setMinPrice("");
      setMaxPrice("");
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
        <Button className="bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </DialogTrigger>
      <MobileOptimizedDialogContent className="flex flex-col max-h-[90vh]">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-2xl font-display font-bold text-ceremonial-maroon text-center">
            Add Additional Service
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <form id="additional-service-form" onSubmit={handleSubmit} className="space-y-6">
              {uploadError && (
                <Alert variant="destructive">
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label className="text-base">Service Type</Label>
                <Select value={serviceType} onValueChange={(value) => {
                  setServiceType(value);
                  setSubcategory("");
                  setCustomSubcategoryName("");
                  // Auto-suggest pricing based on first subcategory
                  if (value !== "other") {
                    const subcategories = getSubcategories(value);
                    if (subcategories.length > 0) {
                      const firstSub = subcategories[0];
                      setMinPrice(firstSub.priceRange.min.toString());
                      setMaxPrice(firstSub.priceRange.max.toString());
                    }
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other (Custom Service)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {serviceType && serviceType !== "other" && (
                <div className="space-y-2">
                  <Label className="text-base">Service Subcategory</Label>
                  <Select value={subcategory} onValueChange={(value) => {
                    setSubcategory(value);
                    setCustomSubcategoryName("");
                    // Auto-suggest pricing based on selected subcategory
                    if (value !== "other") {
                      const subcategoryDetails = getSubcategoryDetails(serviceType, value);
                      if (subcategoryDetails) {
                        setMinPrice(subcategoryDetails.priceRange.min.toString());
                        setMaxPrice(subcategoryDetails.priceRange.max.toString());
                      }
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubcategories(serviceType).map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                          <span className="text-xs text-gray-500 ml-2">
                            (₹{sub.priceRange.min.toLocaleString()} - ₹{sub.priceRange.max.toLocaleString()})
                          </span>
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other (Custom Subcategory)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {serviceType === "other" && (
                <div className="space-y-2">
                  <Label className="text-base">Custom Service Name</Label>
                  <Input
                    value={customServiceName}
                    onChange={(e) => setCustomServiceName(e.target.value)}
                    placeholder="Enter service name"
                    required
                  />
                </div>
              )}

              {subcategory === "other" && serviceType !== "other" && (
                <div className="space-y-2">
                  <Label className="text-base">Custom Subcategory Name</Label>
                  <Input
                    value={customSubcategoryName}
                    onChange={(e) => setCustomSubcategoryName(e.target.value)}
                    placeholder="Enter subcategory name"
                    required
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-base">Minimum Price (₹)</Label>
                  <Input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min price"
                    min="1"
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Maximum Price (₹)</Label>
                  <Input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max price"
                    min="1"
                    required
                    className="w-full"
                  />
                </div>
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

              </form>
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter className="flex-shrink-0 mt-4 p-4 border-t">
          <Button
            type="submit"
            form="additional-service-form"
            className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Additional Service"}
          </Button>
        </DialogFooter>
      </MobileOptimizedDialogContent>

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
};

export default AdditionalServiceForm;
