import React from 'react';

const FAQSchema = () => {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What services does Subhakaryam offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Subhakaryam connects you with trusted service providers for pooja services, wedding photography, catering, event decoration, mehendi artists, function hall booking, and traditional Indian ceremonies."
        }
      },
      {
        "@type": "Question", 
        "name": "How do I book a pandit for pooja services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can search for verified pandits in your area through our platform, view their profiles, check availability, and book directly online with secure payment options."
        }
      },
      {
        "@type": "Question",
        "name": "Are the service providers on Subhakaryam verified?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all service providers on Subhakaryam go through a verification process to ensure quality and authenticity of their traditional services."
        }
      },
      {
        "@type": "Question",
        "name": "What areas does Subhakaryam serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Subhakaryam serves customers across India, connecting them with local service providers for traditional ceremonies and cultural events."
        }
      },
      {
        "@type": "Question",
        "name": "How are payments handled on Subhakaryam?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer secure online payments including UPI, credit/debit cards, and net banking. Payments are processed securely through trusted payment gateways."
        }
      }
    ]
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
};

export default FAQSchema;