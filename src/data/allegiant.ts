/**
 * Contenido y configuración del sitio de Allegiant Appliances Inc.
 *
 * Todo lo que el negocio tiene que confirmar o completar vive aquí arriba, en
 * `business`: mientras un dato sea `null` / vacío, la sección que lo muestra
 * simplemente no se renderiza (nada de cifras o reseñas inventadas).
 */

export type Lang = "en" | "es";

export const business = {
  name: "Allegiant Appliances Inc",
  phoneDisplay: "+1 (323) 578-4010",
  phoneHref: "+13235784010",
  /**
   * Enlaces de Google. Se sobreescriben con variables de entorno cuando el
   * perfil de Google Business esté verificado (ver `.env.example`). Mientras
   * tanto apuntan a una búsqueda, para que nunca sean un enlace roto.
   */
  reviewsUrl:
    process.env.NEXT_PUBLIC_ALLEGIANT_REVIEWS_URL ??
    "https://share.google/dUAHoST79DXRbFNId",
  writeReviewUrl:
    process.env.NEXT_PUBLIC_ALLEGIANT_WRITE_REVIEW_URL ??
    "https://www.google.com/search?q=Allegiant+Appliances+Inc+reviews",
  /** Años de experiencia de Vadim en la zona (dato confirmado por el negocio). */
  yearsInArea: 5,
  /** Número de registro estatal de reparación de electrodomésticos. */
  registrationNumber: null as string | null,
  /** Calificación y cantidad de reseñas de Google; `null` oculta el dato. */
  reviewStats: null as { rating: string; count: number } | null,
  /** Reseñas reales (con permiso para publicarlas). Vacío oculta la sección. */
  testimonials: [] as { text: string; who: string }[],
  /** Horario de atención de lunes a viernes (24 h). Los sábados son solo por solicitud especial. */
  weekdayHours: { opens: "09:00", closes: "19:00" },
  /** Oferta de la tarjeta de visita; `false` oculta la cinta superior. */
  offerEnabled: false,
};

/** Rutas públicas de cada idioma. */
export function paths(lang: Lang) {
  const base = lang === "es" ? "/allegiant/es" : "/allegiant";
  return {
    home: base,
    tour: `${base}/tour`,
    blog: `${base}/blog`,
    about: `${base}/about`,
    other: lang === "es" ? "/allegiant" : "/allegiant/es",
    otherTour: lang === "es" ? "/allegiant/tour" : "/allegiant/es/tour",
    otherAbout: lang === "es" ? "/allegiant/about" : "/allegiant/es/about",
  };
}

export const luxuryBrands = [
  "Sub-Zero",
  "Wolf",
  "Miele",
  "Gaggenau",
  "Thermador",
  "Viking",
  "La Cornue",
  "Fisher & Paykel",
  "Liebherr",
  "Dacor",
  "Monogram",
  "Smeg",
];

export const homeBrands = [
  "Samsung",
  "LG",
  "Whirlpool",
  "GE",
  "Maytag",
  "Frigidaire",
  "KitchenAid",
  "Bosch",
  "Electrolux",
  "Kenmore",
  "Amana",
  "Hotpoint",
];

/**
 * Logos oficiales por marca (ruta bajo /public). Se agregan cuando el negocio
 * tenga los archivos de cada marca; mientras falte uno, la tarjeta muestra el
 * nombre en tipografía.
 */
export const brandLogos: Record<string, string> = {
  "Sub-Zero": "/images/brands/sub-zero.png",
  Miele: "/images/brands/miele.svg",
  Gaggenau: "/images/brands/gaggenau.png",
  Thermador: "/images/brands/thermador.png",
  Viking: "/images/brands/viking.png",
  "La Cornue": "/images/brands/la-cornue.png",
  "Fisher & Paykel": "/images/brands/fisher-paykel.svg",
  Liebherr: "/images/brands/liebherr.png",
  Dacor: "/images/brands/dacor.png",
  Monogram: "/images/brands/monogram.svg",
  Smeg: "/images/brands/smeg.svg",
  Samsung: "/images/brands/samsung.svg",
  LG: "/images/brands/lg.svg",
  Whirlpool: "/images/brands/whirlpool.png",
  GE: "/images/brands/ge.svg",
  Maytag: "/images/brands/maytag.png",
  Frigidaire: "/images/brands/frigidaire.png",
  KitchenAid: "/images/brands/kitchenaid.png",
  Bosch: "/images/brands/bosch.svg",
  Electrolux: "/images/brands/electrolux.svg",
  Kenmore: "/images/brands/kenmore.png",
  Amana: "/images/brands/amana.png",
  Hotpoint: "/images/brands/hotpoint.png",
};

/** Logos que traen su propio fondo de color: van en escala de grises en vez de un solo tono. */
export const brandLogosWithBackground = new Set(["Miele", "Maytag", "Viking", "Dacor"]);

/**
 * Información detallada de marcas de electrodomésticos.
 * Cada marca incluye su historia, características y datos para mejorar SEO.
 */
export type BrandInfo = {
  name: string;
  category: "luxury" | "home" | "professional" | "compact";
  country: string;
  founded: number;
  description: { en: string; es: string };
  specialties: { en: string[]; es: string[] };
  commonIssues: { en: string[]; es: string[] };
  priceRange: "budget" | "mid" | "premium" | "luxury";
};

export const brandDatabase: Record<string, BrandInfo> = {
  // Marcas de lujo
  "Sub-Zero": {
    name: "Sub-Zero",
    category: "luxury",
    country: "USA",
    founded: 1945,
    description: {
      en: "The gold standard in premium refrigeration. Famous for integrated freezer compartments and precision cooling systems.",
      es: "El estándar de oro en refrigeración premium. Famosa por sus cámaras de congelación integradas y sistemas de enfriamiento de precisión.",
    },
    specialties: {
      en: ["Built-in refrigeration", "Freezer compartments", "Wine storage", "Humidity control"],
      es: ["Refrigeración built-in", "Cámaras de congelación", "Wine storage", "Control de humedad"],
    },
    commonIssues: {
      en: ["Not cooling", "Noisy compressor", "Temperature fluctuations"],
      es: ["No enfría", "Compresor ruidoso", "Variaciones de temperatura"],
    },
    priceRange: "luxury",
  },
  Wolf: {
    name: "Wolf",
    category: "luxury",
    country: "USA",
    founded: 1952,
    description: {
      en: "Professional-quality cooktops and ovens with distinctive red knobs. Known for powerful burners and precise baking.",
      es: "Cocinas y hornos de calidad profesional con perillas rojas distintivo. Conocida por su potencia de quemadores y precisión de horneado.",
    },
    specialties: {
      en: ["Professional cooktops", "Convection ovens", "High-power burners", "Gourmet tops"],
      es: ["Cocinas profesionales", "Hornos de convección", "Quemadores de alta potencia", "Tops gourmet"],
    },
    commonIssues: {
      en: ["Burners won't ignite", "Ignition failure", "Oven problems"],
      es: ["Quemadores no encienden", "Encendido defectuoso", "Problemas de horno"],
    },
    priceRange: "luxury",
  },
  Miele: {
    name: "Miele",
    category: "luxury",
    country: "Alemania",
    founded: 1899,
    description: {
      en: "German precision engineering. Leader in ultra-silent dishwashers, front-load washers, and integrated coffee systems.",
      es: "Ingeniería alemana de precisión. Líder en lavavajillas ultra silenciosos, lavadoras de carga frontal y sistemas de café integrados.",
    },
    specialties: {
      en: ["Ultra-silent dishwashers", "Premium washers", "Coffee systems", "Steam ovens"],
      es: ["Lavavajillas silenciosos", "Lavadoras premium", "Sistemas de café", "Hornos de vapor"],
    },
    commonIssues: {
      en: ["Dishwasher not draining", "Pump problems", "Control errors"],
      es: ["Lavavajillas no drena", "Problemas de bomba", "Errores de control"],
    },
    priceRange: "luxury",
  },
  Gaggenau: {
    name: "Gaggenau",
    category: "luxury",
    country: "Alemania",
    founded: 1683,
    description: {
      en: "Ultra-luxury minimalist European design. Perfect integration in high-end architectural kitchens.",
      es: "Ultra lujo minimalista de diseño europeo. Integración perfecta en cocinas arquitectónicas de alto nivel.",
    },
    specialties: {
      en: ["Precision ovens", "Architectural integration", "Minimalist design", "Digital controls"],
      es: ["Hornos de precisión", "Integración arquitectónica", "Diseño minimalista", "Controles digitales"],
    },
    commonIssues: {
      en: ["Electronic problems", "Sensor errors", "Faulty controls"],
      es: ["Problemas electrónicos", "Errores de sensor", "Control defectuoso"],
    },
    priceRange: "luxury",
  },
  Thermador: {
    name: "Thermador",
    category: "luxury",
    country: "USA",
    founded: 1916,
    description: {
      en: "Luxury line with exclusive star burners and integrated refrigerated columns. Innovative design for gourmet kitchens.",
      es: "Línea de lujo con quemadores de estrella exclusivos y columnas de frío integradas. Diseño innovador para cocinas gourmet.",
    },
    specialties: {
      en: ["Star burners", "Refrigerated columns", "Convection ovens", "Innovative cooktops"],
      es: ["Quemadores de estrella", "Columnas de frío", "Hornos de convección", "Tops innovadores"],
    },
    commonIssues: {
      en: ["Burners malfunctioning", "Ignition problems", "Oven failures"],
      es: ["Quemadores mal funcionan", "Problemas de encendido", "Fallos de horno"],
    },
    priceRange: "luxury",
  },
  Viking: {
    name: "Viking",
    category: "luxury",
    country: "USA",
    founded: 1987,
    description: {
      en: "Professional-style ranges with exceptional durability. Extreme burner power and heavy-duty performance.",
      es: "Cocinas de estilo profesional de gran robustez. Potencia extrema de quemadores y resistencia de uso intenso.",
    },
    specialties: {
      en: ["Professional ranges", "Ultra-powerful burners", "Commercial ovens", "Extreme durability"],
      es: ["Cocinas profesionales", "Quemadores ultra potentes", "Hornos comerciales", "Durabilidad extrema"],
    },
    commonIssues: {
      en: ["Ignition problems", "Weak burners", "Faulty thermostat"],
      es: ["Problemas de ignición", "Quemadores débiles", "Termostato defectuoso"],
    },
    priceRange: "luxury",
  },
  "La Cornue": {
    name: "La Cornue",
    category: "luxury",
    country: "Francia",
    founded: 1908,
    description: {
      en: "Hand-crafted French luxury ranges. Each model is custom-made and a functional work of art.",
      es: "Cocinas de lujo francesas hechas a mano. Cada modelo es personalizado y es una pieza de arte funcional.",
    },
    specialties: {
      en: ["Custom ranges", "Artisanal craftsmanship", "Classic design", "Cast-iron oven"],
      es: ["Cocinas personalizadas", "Manufactura artesanal", "Diseño clásico", "Horno de hierro fundido"],
    },
    commonIssues: {
      en: ["Oven problems", "Faulty ignition", "Temperature regulation"],
      es: ["Problemas de horno", "Ignición defectuosa", "Regulación de temperatura"],
    },
    priceRange: "luxury",
  },
  "Fisher & Paykel": {
    name: "Fisher & Paykel",
    category: "luxury",
    country: "Nueva Zelanda",
    founded: 1934,
    description: {
      en: "New Zealand innovators in dishwasher drawers and French-style refrigeration. Smart and functional design.",
      es: "Innovadores neozelandeses en cajones lavavajillas y frigoríficos con estilo francés. Diseño inteligente y funcional.",
    },
    specialties: {
      en: ["Dishwasher drawers", "French-style refrigeration", "Innovative design", "Ease of use"],
      es: ["Cajones lavavajillas", "Refrigeración francesa", "Diseño innovador", "Facilidad de uso"],
    },
    commonIssues: {
      en: ["Drawer won't open", "Drainage problems", "Noisy compressor"],
      es: ["Cajón no abre", "Problemas de drenaje", "Compresor ruidoso"],
    },
    priceRange: "premium",
  },
  Liebherr: {
    name: "Liebherr",
    category: "luxury",
    country: "Alemania",
    founded: 1949,
    description: {
      en: "German premium refrigeration manufacturer. Experts in column refrigerators and precision preservation systems.",
      es: "Fabricante alemán de refrigeración premium. Expertos en frigoríficos de columna y sistemas de conservación de precisión.",
    },
    specialties: {
      en: ["Column refrigerators", "Precision systems", "Wine coolers", "German technology"],
      es: ["Frigoríficos de columna", "Sistemas de precisión", "Wine coolers", "Tecnología alemana"],
    },
    commonIssues: {
      en: ["Not cooling", "Compressor problems", "Temperature fluctuation"],
      es: ["No enfría", "Problemas de compresor", "Variación de temperatura"],
    },
    priceRange: "luxury",
  },
  Dacor: {
    name: "Dacor",
    category: "luxury",
    country: "USA",
    founded: 1965,
    description: {
      en: "Luxury line with contemporary design. Samsung-owned, combines modern aesthetics with smart technology.",
      es: "Línea de lujo de diseño contemporáneo. Propiedad de Samsung, combina estética moderna con tecnología inteligente.",
    },
    specialties: {
      en: ["Modern ranges", "Smart ovens", "Contemporary design", "Remote control"],
      es: ["Cocinas modernas", "Hornos inteligentes", "Diseño contemporáneo", "Control remoto"],
    },
    commonIssues: {
      en: ["App errors", "WiFi problems", "Sensor failures"],
      es: ["Errores de aplicación", "Problemas WiFi", "Fallos de sensor"],
    },
    priceRange: "luxury",
  },
  Monogram: {
    name: "Monogram",
    category: "luxury",
    country: "USA",
    founded: 1990,
    description: {
      en: "Premium GE line with seamless integration. Modular and customizable for architectural kitchens.",
      es: "Línea premium de GE con integración perfecta. Modular y personalizable para cocinas arquitectónicas.",
    },
    specialties: {
      en: ["Modular integration", "Customizable design", "Built-in appliances", "Premium finishes"],
      es: ["Integración modular", "Diseño personalizable", "Electrodomésticos built-in", "Acabados premium"],
    },
    commonIssues: {
      en: ["Control problems", "Sensor failures", "Electronic errors"],
      es: ["Problemas de control", "Fallos de sensor", "Errores electrónicos"],
    },
    priceRange: "premium",
  },
  Smeg: {
    name: "Smeg",
    category: "luxury",
    country: "Italia",
    founded: 1948,
    description: {
      en: "Retro-modern Italian design. Vintage-style refrigerators with modern functionality and unique colorful finishes.",
      es: "Diseño italiano retro-moderno. Frigoríficos vintage con funcionalidad moderna y acabados coloridos únicos.",
    },
    specialties: {
      en: ["Design refrigerators", "Vintage finishes", "Colored appliances", "Italian aesthetics"],
      es: ["Frigoríficos diseño", "Acabados vintage", "Electrodomésticos de color", "Estética italiana"],
    },
    commonIssues: {
      en: ["Cosmetic problems", "Compressor failures", "Poor cooling"],
      es: ["Problemas cosméticos", "Fallos de compresor", "No enfría adecuadamente"],
    },
    priceRange: "premium",
  },

  // Marcas home residenciales
  Samsung: {
    name: "Samsung",
    category: "home",
    country: "Corea del Sur",
    founded: 1938,
    description: {
      en: "Leader in smart connectivity and integrated displays. Modern family refrigerators with WiFi and interior cameras.",
      es: "Líder en conectividad inteligente y pantallas integradas. Frigoríficos de familia moderna con WiFi y cámaras interiores.",
    },
    specialties: {
      en: ["Smart refrigerators", "LED displays", "WiFi connectivity", "Remote control"],
      es: ["Frigoríficos inteligentes", "Pantallas LED", "Conectividad WiFi", "Control remoto"],
    },
    commonIssues: {
      en: ["Dead display", "Noisy compressor", "WiFi problems", "Control error"],
      es: ["Pantalla muerta", "Compresor ruidoso", "Problemas WiFi", "Error de control"],
    },
    priceRange: "mid",
  },
  LG: {
    name: "LG",
    category: "home",
    country: "Corea del Sur",
    founded: 1947,
    description: {
      en: "Recognized for innovation in washing motor and refrigeration technology. Front-load washers and inverter refrigerators.",
      es: "Reconocida por innovación en motores de lavado y refrigeración. Lavadoras con tecnología de carga frontal y frigoríficos inverter.",
    },
    specialties: {
      en: ["Inverter washers", "Linear refrigerators", "Direct drive technology", "Energy efficiency"],
      es: ["Lavadoras inverter", "Frigoríficos lineales", "Tecnología directdrive", "Eficiencia energética"],
    },
    commonIssues: {
      en: ["Motor problems", "Not cooling", "Long cycles", "Water leaks"],
      es: ["Problemas de motor", "No enfría", "Ciclos largos", "Fugas de agua"],
    },
    priceRange: "mid",
  },
  Whirlpool: {
    name: "Whirlpool",
    category: "home",
    country: "USA",
    founded: 1911,
    description: {
      en: "Traditional mass-market brand. Reliable refrigerators, washers and dryers for the American family.",
      es: "Marca tradicional de consumo masivo. Frigoríficos, lavadoras y secadoras confiables para la familia estadounidense.",
    },
    specialties: {
      en: ["Durable refrigerators", "Resistant washers", "Economical dryers", "Reliability"],
      es: ["Frigoríficos duraderos", "Lavadoras resistentes", "Secadoras económicas", "Confiabilidad"],
    },
    commonIssues: {
      en: ["Not cooling", "Leaks", "Washing problems", "Faulty motor"],
      es: ["No enfría", "Fugas", "Problemas de lavado", "Motor defectuoso"],
    },
    priceRange: "mid",
  },
  GE: {
    name: "GE",
    category: "home",
    country: "USA",
    founded: 1892,
    description: {
      en: "General Electric - The iconic mass-market brand. Refrigerators, ranges and appliances since 1892.",
      es: "General Electric - La marca icónica de consumo general. Frigoríficos, estufas y electrodomésticos desde 1892.",
    },
    specialties: {
      en: ["Robust refrigerators", "Electric ranges", "Dishwashers", "General appliances"],
      es: ["Frigoríficos robustos", "Estufas eléctricas", "Lavavajillas", "Electrodomésticos generales"],
    },
    commonIssues: {
      en: ["Not cooling", "Weak burners", "Faulty drainage", "Weak motor"],
      es: ["No enfría", "Quemadores débiles", "Drenaje defectuoso", "Motor débil"],
    },
    priceRange: "mid",
  },
  Maytag: {
    name: "Maytag",
    category: "home",
    country: "USA",
    founded: 1908,
    description: {
      en: "Focused on durability and power. Washers and dryers famous for their resistance and heavy-load capacity.",
      es: "Enfocada en durabilidad y potencia. Lavadoras y secadoras famosas por su resistencia y capacidad de carga pesada.",
    },
    specialties: {
      en: ["Powerful washers", "Durable dryers", "Extreme resistance", "Large capacity"],
      es: ["Lavadoras potentes", "Secadoras duraderas", "Resistencia extrema", "Capacidad grande"],
    },
    commonIssues: {
      en: ["Transmission problems", "Won't spin", "Drying problems", "Leaks"],
      es: ["Problemas de transmisión", "No centrifuga", "Problemas de secado", "Fugas"],
    },
    priceRange: "mid",
  },
  Frigidaire: {
    name: "Frigidaire",
    category: "home",
    country: "USA",
    founded: 1916,
    description: {
      en: "One of the best-selling mass-market brands. Affordable and reliable refrigerators and appliances.",
      es: "Una de las marcas más vendidas de consumo masivo. Frigoríficos y electrodomésticos asequibles y confiables.",
    },
    specialties: {
      en: ["Budget refrigerators", "Basic appliances", "Good price-to-performance", "Availability"],
      es: ["Frigoríficos económicos", "Electrodomésticos básicos", "Buena relación precio-rendimiento", "Disponibilidad"],
    },
    commonIssues: {
      en: ["Not cooling", "Compressor noise", "Ice problems", "Faulty controls"],
      es: ["No enfría", "Ruido de compresor", "Problemas de hielo", "Control defectuoso"],
    },
    priceRange: "budget",
  },
  KitchenAid: {
    name: "KitchenAid",
    category: "home",
    country: "USA",
    founded: 1919,
    description: {
      en: "Mid-to-upper range famous for mixers and ranges. Quality appliances for functional kitchens.",
      es: "Gama media-alta famosa por sus batidoras y cocinas. Electrodomésticos de calidad para cocinas funcionales.",
    },
    specialties: {
      en: ["Quality ranges", "Legendary mixers", "Built-in refrigerators", "Functional design"],
      es: ["Cocinas de calidad", "Batidoras legendarias", "Frigoríficos built-in", "Diseño funcional"],
    },
    commonIssues: {
      en: ["Burner won't light", "Oven problems", "Faulty control", "Weak motor"],
      es: ["Quemador no enciende", "Problemas de horno", "Control defectuoso", "Motor débil"],
    },
    priceRange: "mid",
  },
  Bosch: {
    name: "Bosch",
    category: "home",
    country: "Alemania",
    founded: 1921,
    description: {
      en: "German manufacturer famous for ultra-silent dishwashers and European design. Precision engineering.",
      es: "Fabricante alemán famosa por lavavajillas ultra silenciosos y diseño europeo. Ingeniería de precisión.",
    },
    specialties: {
      en: ["Silent dishwashers", "German engineering", "Energy efficiency", "European integration"],
      es: ["Lavavajillas silenciosos", "Ingeniería alemana", "Eficiencia energética", "Integración europea"],
    },
    commonIssues: {
      en: ["Poor drainage", "Weak pump", "Clogged spray arm", "Sensor errors"],
      es: ["No drena bien", "Bomba débil", "Brazo rociador atascado", "Errores de sensor"],
    },
    priceRange: "mid",
  },
  Electrolux: {
    name: "Electrolux",
    category: "home",
    country: "Suecia",
    founded: 1919,
    description: {
      en: "Swedish mid-to-upper range, strong in premium laundry. Washers with Scandinavian technology and efficient refrigerators.",
      es: "Gama media-alta sueca, fuerte en lavandería premium. Lavadoras con tecnología escandinava y frigoríficos eficientes.",
    },
    specialties: {
      en: ["Premium washers", "Efficient refrigerators", "Scandinavian technology", "Advanced dishwashers"],
      es: ["Lavadoras premium", "Frigoríficos eficientes", "Tecnología escandinava", "Lavavajillas avanzados"],
    },
    commonIssues: {
      en: ["Motor problems", "Poor spin cycle", "Water leaks", "Control errors"],
      es: ["Problemas de motor", "No centrifuga bien", "Fugas de agua", "Errores de control"],
    },
    priceRange: "mid",
  },
  Kenmore: {
    name: "Kenmore",
    category: "home",
    country: "USA",
    founded: 1927,
    description: {
      en: "Sears traditional brand, now manufactured under license. Refrigerators, washers and general appliances.",
      es: "Marca tradicional de Sears, ahora fabricada bajo licencia. Frigoríficos, lavadoras y electrodomésticos generales.",
    },
    specialties: {
      en: ["Reliable refrigerators", "Robust washers", "General appliances", "Availability"],
      es: ["Frigoríficos confiables", "Lavadoras robustas", "Electrodomésticos generales", "Disponibilidad"],
    },
    commonIssues: {
      en: ["Not cooling", "Motor problems", "Leaks", "Faulty controls"],
      es: ["No enfría", "Problemas de motor", "Fugas", "Control defectuoso"],
    },
    priceRange: "mid",
  },
  Amana: {
    name: "Amana",
    category: "home",
    country: "USA",
    founded: 1934,
    description: {
      en: "Budget line from Whirlpool group. Basic appliances at affordable prices.",
      es: "Línea económica y de primera necesidad del grupo Whirlpool. Electrodomésticos básicos a precio accesible.",
    },
    specialties: {
      en: ["Budget appliances", "Basic reliability", "Easy to repair", "Availability"],
      es: ["Electrodomésticos económicos", "Confiabilidad básica", "Fácil reparación", "Disponibilidad"],
    },
    commonIssues: {
      en: ["Not cooling", "General problems", "Component wear", "Control failure"],
      es: ["No enfría", "Problemas generales", "Desgaste de componentes", "Falla de control"],
    },
    priceRange: "budget",
  },
  Hotpoint: {
    name: "Hotpoint",
    category: "home",
    country: "USA",
    founded: 1912,
    description: {
      en: "Basic models operated by Whirlpool in the US. Entry-level low-cost appliances.",
      es: "Modelos básicos operada por Whirlpool en EE. UU. Electrodomésticos entry-level de bajo costo.",
    },
    specialties: {
      en: ["Budget models", "Basic appliances", "Easy maintenance", "Low cost"],
      es: ["Modelos económicos", "Electrodomésticos básicos", "Fácil mantenimiento", "Bajo costo"],
    },
    commonIssues: {
      en: ["Not cooling", "Weak burners", "Rapid wear", "Component failure"],
      es: ["No enfría", "Quemadores débiles", "Desgaste rápido", "Falla de componentes"],
    },
    priceRange: "budget",
  },
};

export const serviceAreas = [
  "West Hollywood",
  "Beverly Hills",
  "Bel Air",
  "Hollywood Hills",
  "Brentwood",
  "Santa Monica",
  "Culver City",
  "Studio City",
  "Sherman Oaks",
  "Downtown LA",
  "Pasadena",
  "Glendale",
  "Burbank",
  "Malibu",
];

export const heroImages = [
  { src: "/allegiant/kitchen-island.jpg", alt: { en: "Luxury kitchen with a marble island", es: "Cocina de lujo con isla de mármol" } },
  { src: "/allegiant/kitchen-wide.jpg", alt: { en: "Luxury kitchen with built-in refrigeration", es: "Cocina de lujo con refrigeración empotrada" } },
  { src: "/allegiant/laundry.jpg", alt: { en: "Luxury laundry room", es: "Lavandería de lujo" } },
];

export type ApplianceKind = "fridge" | "micro" | "dish" | "wine" | "washer" | "dryer";

export type Hotspot = {
  id: string;
  kind: ApplianceKind;
  /** Posición del punto, en % de la imagen. */
  x: number;
  y: number;
  /** Zona (en % de la imagen) que se abre en la vista de rayos X. */
  xray?: { left: number; top: number; width: number; height: number };
};

export const tourScenes: { src: string; hotspots: Hotspot[] }[] = [
  {
    src: "/allegiant/kitchen-wide.jpg",
    hotspots: [
      { id: "a1", kind: "fridge", x: 69, y: 50, xray: { left: 64.3, top: 27.3, width: 9.5, height: 46.3 } },
      { id: "a2", kind: "fridge", x: 52.7, y: 50 },
      { id: "a3", kind: "micro", x: 41.6, y: 69.5 },
      { id: "a4", kind: "wine", x: 28.9, y: 62 },
    ],
  },
  {
    src: "/allegiant/kitchen-island.jpg",
    hotspots: [
      { id: "b1", kind: "fridge", x: 37.4, y: 47, xray: { left: 31.6, top: 20.8, width: 11.6, height: 50 } },
      { id: "b2", kind: "micro", x: 54.5, y: 71 },
      { id: "b3", kind: "dish", x: 64, y: 77 },
      { id: "b4", kind: "wine", x: 81, y: 61 },
    ],
  },
  {
    src: "/allegiant/laundry.jpg",
    hotspots: [
      { id: "c1", kind: "dryer", x: 49, y: 38 },
      { id: "c2", kind: "washer", x: 49, y: 56 },
      { id: "c3", kind: "dish", x: 65, y: 59 },
      { id: "c4", kind: "wine", x: 91, y: 83 },
    ],
  },
];

type Kind = { name: string; copy: string; faults: string[] };

export const copy = {
  en: {
    ribbon: { text: "Save your contact and get 20% off labor or maintenance.", cta: "Book now" },
    nav: { brands: "Brands", reviews: "Reviews", tour: "Home tour", about: "About us", blog: "Blog", faq: "FAQ", book: "Book a visit" },
    hero: {
      eyebrow: "Greater Los Angeles",
      h1a: "Every appliance,",
      h1b: "expertly",
      h1c: "restored.",
      p: "From luxury estates to family homes across Los Angeles. Over five years of trusted repair and maintenance in the neighborhood. Residential and commercial, licensed and insured.",
      cta: "Request a visit",
      tour: "Tour the home",
      rooms: ["The Island", "The Kitchen", "The Laundry"],
    },
    trust: {
      years: "Years serving the neighborhood",
      licensed: "Licensed",
      licensedSmall: "& insured",
      rating: "Google rating",
      reviews: "reviews",
      registration: "State repair registration",
    },
    brands: {
      eyebrow: "Brands we repair",
      h2: "Fine marques or everyday brands, the same standard of care.",
      luxury: "Luxury & professional",
      home: "Home favorites",
      all: "And every other major brand. If it plugs in, we know how to repair it.",
      prev: "Previous brands",
      next: "Next brands",
    },
    why: {
      eyebrow: "Why Allegiant",
      h2: "A small team, held to the highest standard.",
      items: [
        { n: "01", t: "Personal", p: "You deal with the technician who does the work. Vadim knows your appliance, your home and your name." },
        { n: "02", t: "Punctual", p: "Clear arrival windows, a call when we are on the way and no surprises on the bill." },
        { n: "03", t: "Discreet", p: "Careful, clean and respectful of your home and your privacy, from estates to apartments." },
      ],
    },
    reviews: {
      eyebrow: "Reviews",
      h2: "Over five years, one neighborhood at a time.",
      p: "Read what homeowners across Los Angeles say about Vadim and the team, or share your own experience.",
      read: "Read reviews on Google",
      write: "Leave a review",
      testimonials: "What our clients say.",
    },
    services: {
      items: [
        { n: "01", t: "Refrigeration & ice", p: "Built-in and column refrigeration, wine storage and ice makers." },
        { n: "02", t: "Cooking", p: "Ranges, ovens, cooktops and microwaves." },
        { n: "03", t: "Dishwashing", p: "Integrated and freestanding dishwashers." },
        { n: "04", t: "Laundry", p: "Washers and dryers, from diagnosis to restoration." },
        { n: "05", t: "Preventive care", p: "Scheduled maintenance for estates and commercial kitchens." },
      ],
    },
    tourTeaser: {
      eyebrow: "Home tour",
      h2a: "Walk through the house.",
      h2b: "See inside.",
      p: "Step into the kitchen and laundry, then look through the refrigerator to find the failing valve before we ever open the panel.",
      cta: "Begin the tour",
    },
    faq: {
      eyebrow: "Good to know",
      h2: "Quick answers before you call.",
      items: [
        { q: "Why isn’t my refrigerator keeping food cold?", a: "Make sure the unit has power and the controls are set correctly. Check the plug or the circuit breaker, and confirm the doors close fully. If it is still warm, keep the doors shut and call us. A failing part is often simple to fix when caught early." },
        { q: "Why isn’t my ice maker or water dispenser working?", a: "Check that the water line is open and not kinked, replace the water filter if it is overdue, and make sure the freezer is cold enough to make ice. If it still does not work, the water inlet valve is a common cause, and we can test it." },
        { q: "Why won’t my burners light?", a: "Check that the range has power and that the burner caps are seated and dry. If you smell gas, leave the home and call your gas utility right away. Otherwise, call us and we will diagnose the igniter or the gas supply safely." },
        { q: "Why is my dishwasher not draining?", a: "Clean the filter at the bottom of the tub and check that the drain hose is not kinked. If you have a garbage disposal, make sure the knockout plug was removed. If water is still standing, we can find the blockage or pump issue." },
      ],
    },
    areas: { eyebrow: "Service areas", h2: "From the hills to the coast, and beyond." },
    contact: { eyebrow: "By appointment", h2: "Let us take care of it." },
    footer: {
      blurb: "Expert repair and maintenance for fine appliances and everyday homes, across Greater Los Angeles.",
      contact: "Contact",
      where: "Serving Greater Los Angeles",
      hours: "Monday–Friday, 9am–7pm · Saturday by special request",
      explore: "Explore",
      google: "View us on Google →",
      mid: "Residential & Commercial · Licensed & Insured",
      legal: "Brand names are trademarks of their respective owners. Allegiant Appliances Inc is an independent service company and is not affiliated with, sponsored or authorized by these manufacturers.",
    },
    booking: {
      title: "Book a visit",
      sub: "Tell us what needs repair and we will call you back shortly.",
      hours: "We work Monday to Friday, 9am to 7pm. Saturday visits are by special request.",
      name: "Name",
      phone: "Phone",
      appliance: "Appliance",
      brand: "Brand",
      zip: "ZIP code",
      time: "Preferred time",
      message: "What is happening?",
      send: "Request visit",
      sending: "Sending…",
      or: "Or call",
      close: "Close",
      thanks: "Thank you.",
      thanksP: "We received your request. Vadim will contact you shortly.",
      error: "Something went wrong. Please call us instead.",
      appliances: ["Refrigerator", "Wine cooler", "Ice maker", "Microwave", "Oven / range", "Dishwasher", "Washer", "Dryer", "Other"],
      times: ["As soon as possible", "Morning", "Afternoon", "Evening", "Saturday (special request)"],
    },
    chat: {
      title: "Jessica · Allegiant",
      sub: "Virtual assistant",
      hi: "Hi, I’m Jessica. How can I help you today?",
      call: "Call us",
      text: "Text us",
    },
    tour: {
      back: "Back to site",
      book: "Book a repair",
      repair: "we repair it.",
      xrayOn: "X-ray view",
      xrayOff: "Exit X-ray",
      xrayTitle: "X-ray · Water inlet valve",
      xrayNote: "A worn inlet valve is a common cause of leaks and ice maker problems. We test it first, then repair or replace it.",
      hint: "Tap the glowing points to see what we repair in every appliance.",
      prev: "Previous room",
      next: "Next room",
      scenes: ["The Kitchen", "The Island", "The Laundry"],
      tabs: ["Kitchen", "Island", "Laundry"],
      kinds: {
        fridge: { name: "Refrigerator", copy: "Cooling, leaks and noise, along with ice and water systems, diagnosed and repaired.", faults: ["Not cooling", "Leaking", "Noisy"] },
        micro: { name: "Microwave drawer", copy: "Heating, controls and door problems on built-in and drawer microwaves.", faults: ["No heat", "Sparking", "Dead panel"] },
        dish: { name: "Dishwasher", copy: "Drainage, cleaning performance and leaks on integrated and freestanding models.", faults: ["Not draining", "Not cleaning", "Leaking"] },
        wine: { name: "Wine cooler", copy: "Temperature stability and compressor issues, so every bottle is kept right.", faults: ["Not cooling", "Compressor noise", "Temperature swings"] },
        washer: { name: "Washer", copy: "Spin, drain and leak problems, from diagnosis to restoration.", faults: ["Not spinning", "Not draining", "Leaking"] },
        dryer: { name: "Dryer", copy: "Heating, airflow and drum problems, handled with care for your laundry.", faults: ["No heat", "Long cycles", "Drum noise"] },
      } satisfies Record<ApplianceKind, Kind>,
    },
    meta: {
      title: "Allegiant Appliances — Luxury & Everyday Appliance Repair in Los Angeles",
      description: "Expert appliance repair and maintenance across Greater Los Angeles. Sub-Zero, Wolf, Miele, Samsung, LG and every major brand. Licensed and insured.",
      tourTitle: "Home Tour — Allegiant Appliances",
      tourDescription: "Walk through a luxury home and see what Allegiant repairs in every appliance.",
    },
  },
  es: {
    ribbon: { text: "Guarda nuestro contacto y obtén 20 % de descuento en mano de obra o mantenimiento.", cta: "Reservar" },
    nav: { brands: "Marcas", reviews: "Reseñas", tour: "Recorrido", about: "Nosotros", blog: "Blog", faq: "Preguntas", book: "Reservar visita" },
    hero: {
      eyebrow: "Gran Los Ángeles",
      h1a: "Cada electrodoméstico,",
      h1b: "reparado",
      h1c: "con maestría.",
      p: "De las residencias de lujo a los hogares de familia en todo Los Ángeles. Más de cinco años de reparación y mantenimiento de confianza en el barrio. Residencial y comercial, con licencia y seguro.",
      cta: "Solicitar visita",
      tour: "Recorre la casa",
      rooms: ["La Isla", "La Cocina", "La Lavandería"],
    },
    trust: {
      years: "Años sirviendo al barrio",
      licensed: "Con licencia",
      licensedSmall: "y seguro",
      rating: "Calificación en Google",
      reviews: "reseñas",
      registration: "Registro estatal de reparación",
    },
    brands: {
      eyebrow: "Marcas que reparamos",
      h2: "Marcas de lujo o de uso diario, el mismo nivel de cuidado.",
      luxury: "Lujo y profesional",
      home: "Favoritas del hogar",
      all: "Y todas las demás marcas importantes. Si se enchufa, sabemos repararlo.",
      prev: "Marcas anteriores",
      next: "Siguientes marcas",
    },
    why: {
      eyebrow: "Por qué Allegiant",
      h2: "Un equipo pequeño, con el más alto estándar.",
      items: [
        { n: "01", t: "Personal", p: "Tratas con el técnico que hace el trabajo. Vadim conoce tu aparato, tu casa y tu nombre." },
        { n: "02", t: "Puntual", p: "Ventanas de llegada claras, una llamada cuando vamos en camino y sin sorpresas en la factura." },
        { n: "03", t: "Discreto", p: "Cuidadoso, limpio y respetuoso con tu hogar y tu privacidad, de residencias a apartamentos." },
      ],
    },
    reviews: {
      eyebrow: "Reseñas",
      h2: "Más de cinco años, un barrio a la vez.",
      p: "Lee lo que dicen los propietarios de Los Ángeles sobre Vadim y su equipo, o comparte tu experiencia.",
      read: "Ver reseñas en Google",
      write: "Dejar una reseña",
      testimonials: "Lo que dicen nuestros clientes.",
    },
    services: {
      items: [
        { n: "01", t: "Refrigeración y hielo", p: "Refrigeración empotrada y de columna, vinotecas y máquinas de hielo." },
        { n: "02", t: "Cocción", p: "Estufas, hornos, placas y microondas." },
        { n: "03", t: "Lavavajillas", p: "Lavavajillas integrados y de libre instalación." },
        { n: "04", t: "Lavandería", p: "Lavadoras y secadoras, del diagnóstico a la restauración." },
        { n: "05", t: "Cuidado preventivo", p: "Mantenimiento programado para residencias y cocinas comerciales." },
      ],
    },
    tourTeaser: {
      eyebrow: "Recorrido",
      h2a: "Recorre la casa.",
      h2b: "Mira por dentro.",
      p: "Entra a la cocina y a la lavandería, y mira a través del refrigerador para encontrar la válvula dañada antes de abrir el panel.",
      cta: "Comenzar el recorrido",
    },
    faq: {
      eyebrow: "Bueno saber",
      h2: "Respuestas rápidas antes de llamar.",
      items: [
        { q: "¿Por qué mi refrigerador no enfría?", a: "Verifica que tenga corriente y que los controles estén bien ajustados. Revisa el enchufe o el breaker y confirma que las puertas cierran bien. Si sigue tibio, mantén las puertas cerradas y llámanos. Una pieza que falla suele ser fácil de arreglar si se detecta a tiempo." },
        { q: "¿Por qué no funciona mi máquina de hielo o el dispensador de agua?", a: "Comprueba que la línea de agua esté abierta y sin dobleces, cambia el filtro si ya toca y asegúrate de que el congelador esté lo bastante frío. Si sigue igual, la válvula de entrada de agua es una causa común y podemos probarla." },
        { q: "¿Por qué no encienden los quemadores?", a: "Verifica que la estufa tenga corriente y que las tapas de los quemadores estén bien colocadas y secas. Si hueles a gas, sal de la casa y llama de inmediato a la compañía de gas. Si no, llámanos y diagnosticaremos con seguridad el encendedor o el suministro de gas." },
        { q: "¿Por qué mi lavavajillas no drena?", a: "Limpia el filtro del fondo y revisa que la manguera de desagüe no esté doblada. Si tienes triturador de basura, confirma que se retiró el tapón. Si aún queda agua, podemos encontrar la obstrucción o el problema de la bomba." },
      ],
    },
    areas: { eyebrow: "Zonas de servicio", h2: "De las colinas a la costa, y más allá." },
    contact: { eyebrow: "Con cita previa", h2: "Permítanos encargarnos." },
    footer: {
      blurb: "Reparación y mantenimiento expertos para electrodomésticos finos y hogares de todos los días, en todo el Gran Los Ángeles.",
      contact: "Contacto",
      where: "Servicio en el Gran Los Ángeles",
      hours: "Lunes a viernes, 9 a. m.–7 p. m. · Sábado por solicitud especial",
      explore: "Explorar",
      google: "Vernos en Google →",
      mid: "Residencial y comercial · Con licencia y seguro",
      legal: "Los nombres de marca pertenecen a sus respectivos propietarios. Allegiant Appliances Inc es una empresa de servicio independiente y no está afiliada, patrocinada ni autorizada por estos fabricantes.",
    },
    booking: {
      title: "Reservar una visita",
      sub: "Cuéntanos qué necesita reparación y te llamamos enseguida.",
      hours: "Atendemos de lunes a viernes, de 9 a. m. a 7 p. m. Los sábados, por solicitud especial.",
      name: "Nombre",
      phone: "Teléfono",
      appliance: "Aparato",
      brand: "Marca",
      zip: "Código postal",
      time: "Horario preferido",
      message: "¿Qué está pasando?",
      send: "Solicitar visita",
      sending: "Enviando…",
      or: "O llama al",
      close: "Cerrar",
      thanks: "Gracias.",
      thanksP: "Recibimos tu solicitud. Vadim te contactará en breve.",
      error: "Algo salió mal. Por favor llámanos.",
      appliances: ["Refrigerador", "Vinoteca", "Máquina de hielo", "Microondas", "Horno / estufa", "Lavavajillas", "Lavadora", "Secadora", "Otro"],
      times: ["Lo antes posible", "Mañana", "Tarde", "Noche", "Sábado (solicitud especial)"],
    },
    chat: {
      title: "Jessica · Allegiant",
      sub: "Asistente virtual",
      hi: "Hola, soy Jessica. ¿En qué puedo ayudarte hoy?",
      call: "Llámanos",
      text: "Escríbenos",
    },
    tour: {
      back: "Volver al sitio",
      book: "Reservar reparación",
      repair: "lo reparamos.",
      xrayOn: "Vista de rayos X",
      xrayOff: "Salir de rayos X",
      xrayTitle: "Rayos X · Válvula de entrada de agua",
      xrayNote: "Una válvula de entrada desgastada es una causa común de fugas y fallas en la máquina de hielo. La probamos primero y luego la reparamos o la cambiamos.",
      hint: "Toca los puntos brillantes para ver qué reparamos en cada aparato.",
      prev: "Cuarto anterior",
      next: "Siguiente cuarto",
      scenes: ["La Cocina", "La Isla", "La Lavandería"],
      tabs: ["Cocina", "Isla", "Lavandería"],
      kinds: {
        fridge: { name: "Refrigerador", copy: "Enfriamiento, fugas y ruido, además de hielo y agua, diagnosticados y reparados.", faults: ["No enfría", "Gotea", "Ruidoso"] },
        micro: { name: "Microondas de cajón", copy: "Problemas de calentamiento, controles y puerta en microondas empotrados y de cajón.", faults: ["No calienta", "Chispas", "Panel muerto"] },
        dish: { name: "Lavavajillas", copy: "Drenaje, limpieza y fugas en modelos integrados y de libre instalación.", faults: ["No drena", "No limpia", "Gotea"] },
        wine: { name: "Vinoteca", copy: "Estabilidad de temperatura y problemas del compresor, para que cada botella esté en su punto.", faults: ["No enfría", "Ruido del compresor", "Temperatura inestable"] },
        washer: { name: "Lavadora", copy: "Problemas de giro, drenaje y fugas, del diagnóstico a la restauración.", faults: ["No gira", "No drena", "Gotea"] },
        dryer: { name: "Secadora", copy: "Problemas de calor, flujo de aire y tambor, con el cuidado que merece tu ropa.", faults: ["No calienta", "Ciclos largos", "Ruido del tambor"] },
      } satisfies Record<ApplianceKind, Kind>,
    },
    meta: {
      title: "Allegiant Appliances — Reparación de electrodomésticos de lujo y de uso diario en Los Ángeles",
      description: "Reparación y mantenimiento expertos de electrodomésticos en el Gran Los Ángeles. Sub-Zero, Wolf, Miele, Samsung, LG y todas las marcas importantes. Con licencia y seguro.",
      tourTitle: "Recorrido — Allegiant Appliances",
      tourDescription: "Recorre una casa de lujo y mira qué reparamos en cada aparato.",
    },
  },
} as const;

export type Copy = (typeof copy)["en"] | (typeof copy)["es"];
