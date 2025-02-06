import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function MusicFields() {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Years of Experience
        </label>
        <Input type="number" required min="0" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Instruments
        </label>
        <Textarea
          placeholder="List the traditional instruments you play (e.g., Nadaswaram, Thavil, etc.)"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Types of Events
        </label>
        <Input placeholder="e.g., Weddings, Temple Functions, Processions" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Group Size
        </label>
        <Input type="number" placeholder="Number of musicians in your group" required min="1" />
      </div>
    </>
  );
}