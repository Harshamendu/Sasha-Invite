// ============================================================
// INVITATION CONFIGURATION
// Update these values with your actual details
// ============================================================

const CONFIG = {
  // Baby & Family Details
  baby: {
    name: "Sasha Mendu",
    tagline: "A little miracle has arrived",
    dateOfBirth: "February 18, 2026",
  },

  // Event Details
  event: {
    title: "Cradle Ceremony & Celebration",
    date: "Friday, Jun 12, 2026",
    time: "07:00 PM Onwards",
    venue: "Banjara Banquets",
    address: "1656 Buford Hwy, Cumming, GA 30041",
    googleMapsUrl: "https://maps.google.com/?q=1656+Buford+Hwy+Cumming+GA+30041",
    googleMapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.5!2d-84.1282!3d34.2071!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f59e1f1c0eaaab%3A0x0!2zMzTCsDEyJzI1LjYiTiA4NMKwMDcnNDEuNSJX!5e0!3m2!1sen!2sus!4v1234567890",
    dressCode: "Semi-formal / Festive attire",
  },

  // Host Details
  hosts: {
    family: "The Mendu Family",
    parents: "Harsha & Manisha",
    message:
      "We are overjoyed to welcome our little blessing into this world and would love for you to join us in celebrating this beautiful new chapter.",
  },

  // Contact
  contact: {
    phone: "+1 (618) 305-5651",
    email: "harshareddymendu@gmail.com",
    whatsapp: "+16183055651",
  },

  // RSVP Settings
  rsvp: {
    enabled: true,
    deadline: "Jun 05, 2026",

    // Google Apps Script Web App (writes directly to your Google Sheet)
    // ----------------------------------------------------------------
    // HOW TO SET UP:
    // 1. Create a Google Sheet, add headers in row 1:
    //    Timestamp | Name | Email | Phone | Adults | Kids | Attending | Message
    // 2. Extensions → Apps Script → paste the doPost() function from the README
    // 3. Deploy → New deployment → Web app
    //    (Execute as: Me, Who has access: Anyone)
    // 4. Paste the Web App URL below:
    appsScriptUrl: "https://script.google.com/macros/s/AKfycbz93aSIfbjdLtkhPyii235WvH85a1KieZo4B3H3UwIcKnOY9pltMz536h7bUPsF5NUw/exec",          // e.g. "https://script.google.com/macros/s/AKfyc.../exec"

    // Fallback options
    apiEndpoint: "",            // AWS API Gateway + Lambda
    formspreeId: "",            // Formspree form ID
  },

  // S3 Photo Gallery Settings
  gallery: {
    // Your S3 bucket URL (must have public read or use CloudFront)
    bucketUrl: "https://sasha-invite.s3.amazonaws.com",
    // Folder prefix in the bucket where photos are stored
    prefix: "photos/",
    // Manually list photo filenames here
    // OR set listFromS3 to true (requires bucket listing enabled)
    photos: [
      "Photo1.jpg",
      "Photo6.jpg",
    ],
    // If true, attempts to list objects from S3 (bucket must allow ListBucket)
    listFromS3: true,
    // Main hero photo (used in the invitation card)
    heroPhoto: "Hero.jpg",

    // PREVIEW MODE: Set to true to use placeholder images instead of S3
    // Remove or set to false when you have real S3 photos
    previewMode: false,
    previewPhotos: [
      "https://picsum.photos/seed/baby1/800/600",
      "https://picsum.photos/seed/baby2/800/600",
      "https://picsum.photos/seed/baby3/600/800",
      "https://picsum.photos/seed/baby4/800/600",
      "https://picsum.photos/seed/baby5/600/800",
      "https://picsum.photos/seed/baby6/800/600",
      "https://picsum.photos/seed/baby7/800/600",
      "https://picsum.photos/seed/baby8/600/800",
    ],
    previewHero: "https://picsum.photos/seed/babyhero/600/600",
  },

  // Theme colors (CSS custom properties — override in styles.css if preferred)
  theme: {
    primary: "#b8860b",       // Dark goldenrod
    primaryLight: "#d4a843",  // Light gold
    accent: "#7c9a6e",        // Sage green
    accentLight: "#a8c49a",   // Light sage
    cream: "#faf7f0",         // Warm ivory
    warmWhite: "#fff9f0",     // Warm white
    textDark: "#3a3226",      // Rich brown
    textMedium: "#6b5e4f",    // Medium brown
    textLight: "#9c8b78",     // Light brown
  },
};
