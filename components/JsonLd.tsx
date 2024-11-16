"use client";

import Script from "next/script";

export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "@id": "https://www.smashpropickleball.in",
    name: "Smash Pro Arena Pickleball",
    description:
      "Premier rooftop pickleball courts in the heart of Hyderabad. Professional courts, valet parking, & world-class facilities.",
    url: "https://www.smashpropickleball.in",
    telephone: "+917702090273",
    email: "smashpropickleball@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "160/1, Sardar Patel Road",
      addressLocality: "Begumpet",
      addressRegion: "Hyderabad",
      addressCountry: "IN",
      postalCode: "500016",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "06:00",
      closes: "00:00",
    },
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Professional Courts",
        value: true,
        description:
          "Spacious surfaces designed for top performance and safety",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Valet Parking",
        value: true,
        description: "Convenient valet parking service",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Washrooms",
        value: true,
        description: "Clean, well-maintained washrooms",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Refreshments",
        value: true,
        description: "Complimentary water with each 1-hour booking",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Pickleball Court Bookings",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Pickleball Court Rental",
            description: "Professional pickleball court rental with amenities",
          },
        },
      ],
    },
    areaServed: {
      "@type": "City",
      name: "Hyderabad",
    },
    image: [
      {
        "@type": "ImageObject",
        url: "https://www.smashpropickleball.in/location.png",
        caption: "Smash Pro Arena Pickleball Courts",
      },
    ],
    sameAs: [
      // Add social media links if available
    ],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Landmark",
        value: "Beside Pizza Zone, Opposite Chutney's",
      },
    ],
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "tel:+917702090273",
        actionPlatform: ["http://schema.org/MobileWebPlatform"],
      },
      result: {
        "@type": "Reservation",
        name: "Court Booking",
      },
    },
  };

  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
