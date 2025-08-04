import React from 'react';

interface LocationSchemaProps {
  city: string;
  state: string;
  serviceName: string;
}

const LocationSchema = ({ city, state, serviceName }: LocationSchemaProps) => {
  const locationData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Subhakaryam - ${serviceName} in ${city}`,
    "description": `Professional ${serviceName} services available in ${city}, ${state}. Book verified service providers for traditional ceremonies and events.`,
    "areaServed": {
      "@type": "City",
      "name": city,
      "containedInPlace": {
        "@type": "State",
        "name": state,
        "containedInPlace": {
          "@type": "Country",
          "name": "India"
        }
      }
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "addressLocality": city,
        "addressRegion": state,
        "addressCountry": "IN"
      }
    },
    "provider": {
      "@type": "Organization",
      "name": "Subhakaryam",
      "url": "https://subhakaryam.org"
    }
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(locationData) }}
    />
  );
};

export default LocationSchema;