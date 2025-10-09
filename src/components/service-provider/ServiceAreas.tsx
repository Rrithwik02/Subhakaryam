import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const serviceAreas = [
  { id: "vizag", name: "Visakhapatnam" },
  { id: "vijayawada", name: "Vijayawada" },
  { id: "hyderabad", name: "Hyderabad" },
  { id: "guntur", name: "Guntur" },
  { id: "tirupati", name: "Tirupati" },
  { id: "nellore", name: "Nellore" },
  { id: "kakinada", name: "Kakinada" },
  { id: "rajahmundry", name: "Rajahmundry" },
];

interface ServiceAreasProps {
  className?: string;
  value?: string[];
  onChange?: (cities: string[]) => void;
}

export function ServiceAreas({ 
  className,
  value = [],
  onChange 
}: ServiceAreasProps) {
  const [selectedCities, setSelectedCities] = useState<string[]>(value);

  const handleCityToggle = (cityId: string) => {
    const newCities = selectedCities.includes(cityId)
      ? selectedCities.filter((id) => id !== cityId)
      : [...selectedCities, cityId];
    
    setSelectedCities(newCities);
    onChange?.(newCities);
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-base">Service Areas (Select all that apply)</Label>
          <p className="text-sm text-muted-foreground">
            Choose all cities where you can provide your services. The first selected city will be your primary service area.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {serviceAreas.map((area) => (
              <div key={area.id} className="flex items-center space-x-2">
                <Checkbox
                  id={area.id}
                  checked={selectedCities.includes(area.id)}
                  onCheckedChange={() => handleCityToggle(area.id)}
                />
                <label
                  htmlFor={area.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {area.name}
                </label>
              </div>
            ))}
          </div>
          {selectedCities.length > 0 && (
            <p className="text-sm text-green-600 mt-2">
              Selected {selectedCities.length} service area{selectedCities.length > 1 ? 's' : ''}
            </p>
          )}
          <input 
            type="hidden" 
            name="service_cities" 
            value={JSON.stringify(selectedCities)} 
          />
        </div>
      </div>
    </div>
  );
}