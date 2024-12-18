import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function PoojariFields() {
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
          Specializations
        </label>
        <Textarea
          placeholder="List your specializations in different types of pujas and ceremonies"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Languages Known
        </label>
        <Input placeholder="e.g., Sanskrit, Hindi, Tamil" required />
      </div>
    </>
  );
}