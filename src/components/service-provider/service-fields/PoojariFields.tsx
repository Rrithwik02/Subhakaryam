import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { LanguagesSelector } from "../shared-fields/LanguagesSelector";
import { ImageUpload } from "@/components/ui/image-upload";

const TIMINGS = [
  { id: "morning", name: "Morning (6 AM - 12 PM)" },
  { id: "afternoon", name: "Afternoon (12 PM - 5 PM)" },
  { id: "evening", name: "Evening (5 PM - 9 PM)" },
];

export function PoojariFields() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [travelAvailable, setTravelAvailable] = useState(false);
  const [timings, setTimings] = useState<string[]>([]);
  const [certificateUrl, setCertificateUrl] = useState("");

  const handleTimingToggle = (timingId: string) => {
    setTimings((prev) =>
      prev.includes(timingId)
        ? prev.filter((id) => id !== timingId)
        : [...prev, timingId]
    );
  };

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Years of Experience
        </label>
        <Input type="number" name="experience_years" required min="0" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Specializations
        </label>
        <Textarea
          name="specializations"
          placeholder="List your specializations in different types of pujas and ceremonies"
          required
        />
      </div>

      <LanguagesSelector value={languages} onChange={setLanguages} />
      <input type="hidden" name="languages" value={JSON.stringify(languages)} />

      <div className="space-y-3">
        <Label className="text-base">Available Timings</Label>
        {TIMINGS.map((timing) => (
          <div key={timing.id} className="flex items-center space-x-2">
            <Checkbox
              id={timing.id}
              checked={timings.includes(timing.id)}
              onCheckedChange={() => handleTimingToggle(timing.id)}
            />
            <label htmlFor={timing.id} className="text-sm cursor-pointer">
              {timing.name}
            </label>
          </div>
        ))}
        <input type="hidden" name="available_timings" value={JSON.stringify(timings)} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="travel-toggle" className="text-base">
            Travel Available
          </Label>
          <Switch
            id="travel-toggle"
            checked={travelAvailable}
            onCheckedChange={setTravelAvailable}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Can you travel to perform ceremonies at client locations?
        </p>
        <input type="hidden" name="travel_available" value={travelAvailable.toString()} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">Required Items Information</Label>
        <Textarea
          name="required_items"
          placeholder="Describe what items you bring vs what the client needs to arrange"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-base">Certificate (Optional)</Label>
        <ImageUpload
          onUploadComplete={(url) => setCertificateUrl(url)}
          allowedFileTypes={["image/jpeg", "image/png", "application/pdf"]}
        />
        {certificateUrl && (
          <p className="text-sm text-green-600">Certificate uploaded successfully</p>
        )}
        <input type="hidden" name="certificate_url" value={certificateUrl} />
      </div>
    </>
  );
}