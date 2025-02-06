import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Link } from "lucide-react";

export function PhotoFields() {
  const [showPortfolioImages, setShowPortfolioImages] = useState(true);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [portfolioLink, setPortfolioLink] = useState("");

  const handleImageUpload = (url: string) => {
    setPortfolioImages((prev) => [...prev, url]);
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
                  <img
                    key={index}
                    src={image}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
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