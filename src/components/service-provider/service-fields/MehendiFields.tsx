import { Input } from "@/components/ui/input";

export function MehendiFields() {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Style Specialties
        </label>
        <Input
          placeholder="e.g., Arabic, Indian, Indo-Arabic"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Maximum Designs Per Day
        </label>
        <Input type="number" required min="1" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Portfolio Link (Optional)
        </label>
        <Input type="url" placeholder="Link to your work samples" />
      </div>
    </>
  );
}