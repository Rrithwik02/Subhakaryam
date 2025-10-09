import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LanguagesSelector } from "../shared-fields/LanguagesSelector";
import { TravelChargesToggle } from "../shared-fields/TravelChargesToggle";
import { AudioUpload } from "../shared-fields/AudioUpload";

export function MusicFields() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [travelCharges, setTravelCharges] = useState(false);
  const [audioSamples, setAudioSamples] = useState<string[]>([]);

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
          Instruments
        </label>
        <Textarea
          name="instruments"
          placeholder="List the traditional instruments you play (e.g., Nadaswaram, Thavil, etc.)"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Types of Events
        </label>
        <Input name="event_types" placeholder="e.g., Weddings, Temple Functions, Processions" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Group Size
        </label>
        <Input type="number" name="group_size" placeholder="Number of musicians in your group" required min="1" />
      </div>

      <LanguagesSelector value={languages} onChange={setLanguages} />
      <input type="hidden" name="languages" value={JSON.stringify(languages)} />

      <TravelChargesToggle value={travelCharges} onChange={setTravelCharges} />
      <input type="hidden" name="travel_charges" value={travelCharges.toString()} />

      <AudioUpload value={audioSamples} onChange={setAudioSamples} />
      <input type="hidden" name="audio_samples" value={JSON.stringify(audioSamples)} />
    </>
  );
}