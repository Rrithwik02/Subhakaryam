import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Link, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export function FunctionHallFields() {
  const [showPortfolioImages, setShowPortfolioImages] = useState(true);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [hasAc, setHasAc] = useState(false);
  const [cateringPolicy, setCateringPolicy] = useState("");

  const handleImageUpload = (url: string) => {
    setPortfolioImages((prev) => [...prev, url]);
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setPortfolioImages((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Hall Name</Label>
        <Input
          placeholder="Name of your function hall"
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Seating Capacity</Label>
        <Input
          type="number"
          placeholder="Maximum number of guests"
          required
          min="1"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Standing Capacity</Label>
        <Input
          type="number"
          placeholder="Maximum standing capacity"
          required
          min="1"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Hall Size (sq ft)</Label>
        <Input
          type="number"
          placeholder="Total area in square feet"
          required
          min="1"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Complete Address</Label>
        <Textarea
          placeholder="Full address including landmarks, pin code"
          required
          className="w-full min-h-[80px]"
        />
      </div>

      <div className="space-y-3">
        <Label>Available Facilities</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            "Air Conditioning",
            "Parking",
            "Kitchen",
            "Sound System",
            "Stage",
            "Generator Backup",
            "Restrooms",
            "Catering Area",
            "Bridal Room",
            "VIP Lounge",
            "Dance Floor",
            "Decorative Lighting"
          ].map((facility) => (
            <div key={facility} className="flex items-center space-x-2">
              <Checkbox id={facility} />
              <Label htmlFor={facility} className="text-sm">{facility}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Additional Amenities</Label>
        <Textarea
          placeholder="Describe any other facilities or special features"
          className="w-full min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Parking Capacity</Label>
        <Input
          type="number"
          name="parking_capacity"
          placeholder="Number of vehicles"
          required
          min="0"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="ac" className="text-base">
            Air Conditioning
          </Label>
          <Switch
            id="ac"
            checked={hasAc}
            onCheckedChange={setHasAc}
          />
        </div>
        <input type="hidden" name="has_ac" value={hasAc.toString()} />
      </div>

      <div className="space-y-2">
        <Label>Catering Policy</Label>
        <Select value={cateringPolicy} onValueChange={setCateringPolicy}>
          <SelectTrigger>
            <SelectValue placeholder="Select catering policy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="included">Catering Included</SelectItem>
            <SelectItem value="allowed">Outside Catering Allowed</SelectItem>
            <SelectItem value="not-allowed">Outside Catering Not Allowed</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" name="catering_policy" value={cateringPolicy} />
      </div>

      <div className="space-y-2">
        <Label>Google Maps Location URL</Label>
        <Input
          type="url"
          name="map_location_url"
          placeholder="https://maps.google.com/..."
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">
          Paste the Google Maps link for your hall location
        </p>
      </div>

      <div className="space-y-2">
        <Label>License Number</Label>
        <Input
          name="license_number"
          placeholder="Business/Municipal license number"
          required
          className="w-full"
        />
      </div>
      
      <div className="space-y-4">
        <Label>Hall Portfolio</Label>
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
                      alt={`Hall view ${index + 1}`}
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