import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CateringFields() {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Cuisine Specialties
        </label>
        <Textarea
          placeholder="List the types of cuisines you specialize in"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Maximum Capacity
        </label>
        <Input
          type="number"
          placeholder="Maximum number of people you can serve"
          required
          min="1"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Food License Number
        </label>
        <Input required />
      </div>
    </>
  );
}