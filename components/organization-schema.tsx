import Script from "next/script"

export default function OrganizationSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BR Store",
    url: "https://yourdomain.com",
    logo: "https://yourdomain.com/logo.png",
    sameAs: [
      "https://facebook.com/yourecommercestore",
      "https://twitter.com/yourecommercestore",
      "https://instagram.com/yourecommercestore",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-555-5555",
      contactType: "customer service",
      availableLanguage: "English",
    },
  }

  return (
    <Script id="organization-schema" type="application/ld+json">
      {JSON.stringify(schemaData)}
    </Script>
  )
}

