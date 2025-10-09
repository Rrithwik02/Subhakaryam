
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Link, X } from "lucide-react";
import { AdvancePaymentField } from "../shared-fields/AdvancePaymentField";

const MATERIALS = [
  { id: "flowers", name: "Flowers" },
  { id: "lights", name: "Lights" },
  { id: "drapes", name: "Drapes & Fabrics" },
  { id: "balloons", name: "Balloons" },
  { id: "props", name: "Props & Artifacts" },
  { id: "stage", name: "Stage Decoration" },
];

export function DecorationFields() {
  const [showPortfolioImages, setShowPortfolioImages] = useState(true);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [customizationAvailable, setCustomizationAvailable] = useState(true);
  const [materials, setMaterials] = useState<string[]>([]);
  const [advancePayment, setAdvancePayment] = useState(30);

  const handleImageUpload = (url: string) => {
    setPortfolioImages((prev) => [...prev, url]);
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setPortfolioImages((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Decoration Styles</Label>
        <Textarea
          placeholder="List your decoration specialties"
          required
          className="w-full min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label>Maximum Event Size</Label>
        <Input
          type="number"
          name="max_event_size"
          placeholder="Maximum venue size you can handle (in sq ft)"
          required
          min="1"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Setup Time Required (Hours)</Label>
        <Input
          type="number"
          name="setup_time_hours"
          placeholder="e.g., 4"
          required
          min="1"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="customization" className="text-base">
            Customization Available
          </Label>
          <Switch
            id="customization"
            checked={customizationAvailable}
            onCheckedChange={setCustomizationAvailable}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Can you create custom decoration designs based on client preferences?
        </p>
        <input type="hidden" name="customization_available" value={customizationAvailable.toString()} />
      </div>

      <div className="space-y-3">
        <Label className="text-base">Materials Used</Label>
        <div className="grid grid-cols-2 gap-3">
          {MATERIALS.map((material) => (
            <div key={material.id} className="flex items-center space-x-2">
              <Checkbox
                id={material.id}
                checked={materials.includes(material.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setMaterials([...materials, material.id]);
                  } else {
                    setMaterials(materials.filter((m) => m !== material.id));
                  }
                }}
              />
              <label htmlFor={material.id} className="text-sm cursor-pointer">
                {material.name}
              </label>
            </div>
          ))}
        </div>
        <input type="hidden" name="materials_used" value={JSON.stringify(materials)} />
      </div>

      <AdvancePaymentField value={advancePayment} onChange={setAdvancePayment} />
      <input type="hidden" name="advance_payment" value={advancePayment} />
      
      <div className="space-y-4">
        <Label>Portfolio</Label>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={showPortfolioImages ? "default" : "outline"}
              onClick={() => setShowPortfolioImages(true)}
              className="flex-1"
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
            <Button
              type="button"
              variant={!showPortfolioImages ? "default" : "outline"}
              onClick={() => setShowPortfolioImages(false)}
              className="flex-1"
            >
              <Link className="w-4 h-4 mr-2" />
              Portfolio Link
            </Button>
          </div>

          {showPortfolioImages ? (
            <div className="space-y-4">
              <ImageUpload
                onUploadComplete={handleImageUpload}
                className="w-full"
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {portfolioImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Input
              type="url"
              placeholder="Enter your portfolio website URL"
              required={!showPortfolioImages}
              className="w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
