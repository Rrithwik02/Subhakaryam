
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Link, X } from "lucide-react";
import { AdvancePaymentField } from "../shared-fields/AdvancePaymentField";

const MENU_TYPES = [
  { id: "veg", name: "Vegetarian" },
  { id: "non-veg", name: "Non-Vegetarian" },
  { id: "jain", name: "Jain" },
  { id: "custom", name: "Custom Menu" },
];

export function CateringFields() {
  const [showPortfolioImages, setShowPortfolioImages] = useState(true);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [menuTypes, setMenuTypes] = useState<string[]>([]);
  const [onsiteCooking, setOnsiteCooking] = useState(false);
  const [waiterService, setWaiterService] = useState(false);
  const [serviceStyle, setServiceStyle] = useState("");
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
        <Label>Cuisine Specialties</Label>
        <Textarea
          placeholder="List the types of cuisines you specialize in"
          required
          className="w-full min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label>Maximum Capacity</Label>
        <Input
          type="number"
          placeholder="Maximum number of people you can serve"
          required
          min="1"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label>Food License Number</Label>
        <Input name="food_license_number" required className="w-full" />
      </div>

      <div className="space-y-3">
        <Label className="text-base">Menu Types Offered</Label>
        <div className="grid grid-cols-2 gap-3">
          {MENU_TYPES.map((menu) => (
            <div key={menu.id} className="flex items-center space-x-2">
              <Checkbox
                id={menu.id}
                checked={menuTypes.includes(menu.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setMenuTypes([...menuTypes, menu.id]);
                  } else {
                    setMenuTypes(menuTypes.filter((m) => m !== menu.id));
                  }
                }}
              />
              <label htmlFor={menu.id} className="text-sm cursor-pointer">
                {menu.name}
              </label>
            </div>
          ))}
        </div>
        <input type="hidden" name="menu_types" value={JSON.stringify(menuTypes)} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="onsite-cooking" className="text-base">
            On-Site Cooking Available
          </Label>
          <Switch
            id="onsite-cooking"
            checked={onsiteCooking}
            onCheckedChange={setOnsiteCooking}
          />
        </div>
        <input type="hidden" name="onsite_cooking" value={onsiteCooking.toString()} />
      </div>

      <div className="space-y-2">
        <Label>Service Style</Label>
        <Select value={serviceStyle} onValueChange={setServiceStyle}>
          <SelectTrigger>
            <SelectValue placeholder="Select service style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buffet">Buffet</SelectItem>
            <SelectItem value="seated">Seated Service</SelectItem>
            <SelectItem value="self-serve">Self Serve</SelectItem>
            <SelectItem value="mix">Mix of Both</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" name="service_style" value={serviceStyle} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="waiter-service" className="text-base">
            Waiter Service Included
          </Label>
          <Switch
            id="waiter-service"
            checked={waiterService}
            onCheckedChange={setWaiterService}
          />
        </div>
        <input type="hidden" name="waiter_service" value={waiterService.toString()} />
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
