import { PoojariFields } from "./service-fields/PoojariFields";
import { MehendiFields } from "./service-fields/MehendiFields";
import { PhotoFields } from "./service-fields/PhotoFields";
import { CateringFields } from "./service-fields/CateringFields";
import { MusicFields } from "./service-fields/MusicFields";
import { DecorationFields } from "./service-fields/DecorationFields";

interface ServiceDetailsProps {
  selectedService: string;
  className?: string;
}

export function ServiceDetails({ selectedService, className }: ServiceDetailsProps) {
  const renderServiceSpecificFields = () => {
    switch (selectedService) {
      case "poojari":
        return <PoojariFields />;
      case "mehendi":
        return <MehendiFields />;
      case "photo":
        return <PhotoFields />;
      case "catering":
        return <CateringFields />;
      case "music":
        return <MusicFields />;
      case "decoration":
        return <DecorationFields />;
      default:
        return null;
    }
  };

  if (!selectedService) return null;

  return (
    <div className={className}>
      <h2 className="text-xl font-display font-semibold text-ceremonial-maroon mb-4">
        Service Details
      </h2>
      <div className="space-y-4">
        {renderServiceSpecificFields()}
      </div>
    </div>
  );
}