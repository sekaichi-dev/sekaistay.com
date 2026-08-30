/**
 * High-quality Unsplash images for SEKAI STAY website.
 * All images are served via Unsplash CDN with optimized parameters.
 * License: Unsplash License (free for commercial use)
 */

const u = (id: string, w = 800, h = 500) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80&auto=format`

export const IMG = {
  // Feature section (3 cards)
  featureSupport: u('photo-1502672260266-1c1ef2d93688'),      // Cozy modern living room
  featureInbound: u('photo-1566073771259-6a8506099945'),       // Luxury resort pool area
  featureCleaning: u('photo-1600585154340-be6161a56a0c'),      // Modern clean house exterior

  // Service cards (9 cards)
  svcManagement: u('photo-1582719478250-c89cae4dc85b'),        // Hotel concierge / reception
  svcOta: u('photo-1460925895917-afdab827c52f'),               // Laptop travel booking
  svcMonthly: u('photo-1522708323590-d24dbb6b0267'),           // Stylish apartment interior
  svcStartup: u('photo-1557804506-669a67965ba0'),              // Business meeting planning
  svcPhoto: u('photo-1542744094-3a31f272c490'),                    // Photo editing / color grading on screen
  svcCleaning: u('photo-1631049307264-da0ec9d70304'),          // Hotel bed clean white
  svcPricing: u('photo-1551288049-bebda4e38f71'),              // Analytics data dashboard
  svcDashboard: u('photo-1551434678-e076c223a692'),            // Business laptop analytics
  svcConsulting: u('photo-1600880292203-757bb62b4baf'),        // Consultation office meeting

  // Blog
  blogPlaceholder: u('photo-1545569341-9eb8b30979d9'),         // Japanese traditional house

  // Properties
  propVilla: u('photo-1613490493576-7fde63acd811'),            // Luxury lakeside villa
  propTrailer: u('photo-1587061949409-02df41d5e562'),          // Glamping / cabin in nature
  propKyoto: u('photo-1493976040374-85c8e12f0c0e'),            // Kyoto traditional machiya

  // Hero / Background
  heroBg: u('photo-1571896349842-33c89424de2d', 1600, 900),   // Luxury hotel room
} as const
