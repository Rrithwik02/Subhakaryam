import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function PhotoFields() {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Equipment Details
        </label>
        <Textarea
          placeholder="List your camera equipment and accessories"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Photography Style
        </label>
        <Input
          placeholder="e.g., Traditional, Contemporary, Candid"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Portfolio Website (Optional)
        </label>
        <Input type="url" placeholder="Link to your portfolio" />
      </div>
    </>
  );
}