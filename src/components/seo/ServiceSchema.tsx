import React from 'react';

interface ServiceSchemaProps {
  serviceName: string;
  description: string;
  priceRange?: string;
  areaServed?: string;
}

const ServiceSchema = ({ 
  serviceName, 
  description, 
  priceRange = "₹500-₹50000",
  areaServed = "India" 
}: ServiceSchemaProps) => {
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "Subhakary",
      "url": "https://subhakary.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": areaServed
    },
    "offers": {
      "@type": "Offer",
      "priceRange": priceRange,
      "priceCurrency": "INR"
    },
    "category": "Traditional Indian Ceremonies",
    "serviceType": serviceName
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
    />
  );
};

export default ServiceSchema;