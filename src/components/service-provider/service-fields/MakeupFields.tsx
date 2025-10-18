import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function MakeupFields() {
  const makeupTypes = [
    { id: "bridal", label: "Bridal Makeup" },
    { id: "party", label: "Party Makeup" },
    { id: "engagement", label: "Engagement Makeup" },
    { id: "hd", label: "HD Makeup" },
    { id: "airbrush", label: "Airbrush Makeup" },
    { id: "other", label: "Other Occasions" }
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-3 block">Makeup Specializations</Label>
        <div className="grid grid-cols-2 gap-3">
          {makeupTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={`makeup-${type.id}`}
                name="specializations"
                value={type.id}
              />
              <Label
                htmlFor={`makeup-${type.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
