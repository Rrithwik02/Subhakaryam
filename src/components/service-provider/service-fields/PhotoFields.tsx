
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Link, X } from "lucide-react";
import { LanguagesSelector } from "../shared-fields/LanguagesSelector";
import { AdvancePaymentField } from "../shared-fields/AdvancePaymentField";

export function PhotoFields() {
  const [showPortfolioImages, setShowPortfolioImages] = useState(true);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [droneAvailable, setDroneAvailable] = useState(false);
  const [outstationAvailable, setOutstationAvailable] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
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
        <Label>Equipment Details</Label>
        <Textarea
          placeholder="List your camera equipment and accessories"
          required
          className="w-full min-h-[100px]"
          name="equipment_details"
        />
      </div>
      <div className="space-y-2">
        <Label>Photography Style</Label>
        <Input
          placeholder="e.g., Traditional, Contemporary, Candid"
          required
          className="w-full"
          name="photography_style"
        />
      </div>

      <div className="space-y-2">
        <Label>Delivery Time (Days)</Label>
        <Input
          type="number"
          name="delivery_time_days"
          placeholder="How many days to deliver final photos/videos"
          required
          min="1"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Team Size</Label>
        <Input
          type="number"
          name="team_size"
          placeholder="Number of photographers/videographers"
          required
          min="1"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="drone" className="text-base">
            Drone Available
          </Label>
          <Switch
            id="drone"
            checked={droneAvailable}
            onCheckedChange={setDroneAvailable}
          />
        </div>
        <input type="hidden" name="drone_available" value={droneAvailable.toString()} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="outstation" className="text-base">
            Outstation Shoots Available
          </Label>
          <Switch
            id="outstation"
            checked={outstationAvailable}
            onCheckedChange={setOutstationAvailable}
          />
        </div>
        <input type="hidden" name="outstation_available" value={outstationAvailable.toString()} />
      </div>

      <LanguagesSelector value={languages} onChange={setLanguages} />
      <input type="hidden" name="languages" value={JSON.stringify(languages)} />

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
              <input
                type="hidden"
                name="portfolio_images"
                value={JSON.stringify(portfolioImages)}
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
              name="portfolio_link"
              placeholder="Enter your portfolio website URL"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              required={!showPortfolioImages}
              className="w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
