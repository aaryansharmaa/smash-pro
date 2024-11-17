"use client";

import Script from "next/script";

export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Smash Pro Arena Pickleball",
    description:
      "Premier rooftop pickleball court in the heart of Hyderabad. Professional courts, valet parking, & top-notch facilities.",
    url: "https://www.smashpropickleball.in",
    telephone: "+917702090273",

    // Enhanced address information
    address: {
      "@type": "PostalAddress",
      streetAddress: "Beside Pizza Zone, Opposite Chutney's",
      addressLocality: "Begumpet",
      addressRegion: "Telangana",
      postalCode: "500016",
      addressCountry: "IN",
    },

    // Precise location
    geo: {
      "@type": "GeoCoordinates",
      latitude: 17.44,
      longitude: 78.47,
    },

    // Operating hours
    openingHoursSpecification: [
      {
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
        closes: "23:30",
      },
    ],

    // Pricing and offers
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
          price: "1000",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          validFrom: "2024-01-01",
          priceValidUntil: "2024-12-31",
        },
      ],
    },

    // Facilities and amenities
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Valet Parking",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Professional Courts",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Refreshments",
        value: true,
      },
    ],

    // Images with proper attribution
    image: [
      {
        "@type": "ImageObject",
        url: "https://www.smashpropickleball.in/location.png",
        caption: "Smash Pro Arena Pickleball Courts",
        width: 1800,
        height: 945,
        inLanguage: "en",
      },
    ],

    // Reviews and ratings
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "150",
    },

    // Social media profiles
    sameAs: ["https://www.instagram.com/smashproarena"],
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
