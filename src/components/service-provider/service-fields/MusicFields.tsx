import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function MusicFields() {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Instruments
        </label>
        <Textarea
          placeholder="List the instruments you/your team plays"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Group Size
        </label>
        <Input
          type="number"
          placeholder="Number of performers in your group"
          required
          min="1"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Sample Performance Link (Optional)
        </label>
        <Input type="url" placeholder="Link to your performance video" />
      </div>
    </>
  );
}