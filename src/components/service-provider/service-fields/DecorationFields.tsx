import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function DecorationFields() {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Decoration Styles
        </label>
        <Textarea
          placeholder="List your decoration specialties"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Maximum Event Size
        </label>
        <Input
          type="number"
          placeholder="Maximum venue size you can handle (in sq ft)"
          required
          min="1"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Portfolio Link (Optional)
        </label>
        <Input type="url" placeholder="Link to your previous work" />
      </div>
    </>
  );
}