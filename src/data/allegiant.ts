/**
 * CONTENIDO — Allegiant Appliances Inc (Vadim)
 * ============================================
 * Datos reales (tarjeta de presentación): nombre, teléfono, "Residential &
 * Commercial", "Licensed & Insured", 20% de descuento al guardar el contacto.
 * Todo lo marcado con TODO es un supuesto a confirmar con Vadim.
 */

export const business = {
  name: "Allegiant Appliances Inc",
  owner: "Vadim",
  role: "Appliance Repair Technician",
  phone: "+1 (323) 578-4010",
  phoneHref: "tel:+13235784010",
  smsHref: "sms:+13235784010",
  // TODO: confirmar email con Vadim.
  email: "",
  area: "Beverly Hills, Pasadena, Santa Monica & up the coast",
  headline: "Appliance repair you can count on.",
  subhead:
    "Fast, honest repairs for home and business — by a licensed & insured technician who picks up the phone.",
  discount: "20% off labor or maintenance",
};

export const services = [
  { title: "Refrigerators & Freezers", note: "Not cooling, noisy, leaking or icing up." },
  { title: "Washers & Dryers", note: "Won't drain, spin or heat." },
  { title: "Dishwashers", note: "Poor cleaning, leaks, won't start or drain." },
  { title: "Ovens, Ranges & Cooktops", note: "Burners, igniters and temperature issues." },
  { title: "Microwaves & Hoods", note: "Dead, sparking or not heating." },
  { title: "Ice Makers & Wine Coolers", note: "Diagnosis and repair for specialty units." },
];

export const reasons = [
  { title: "Licensed & Insured", note: "Work done right, with you fully covered." },
  { title: "Residential & Commercial", note: "From a family kitchen to a restaurant line." },
  { title: "Direct line to your technician", note: "Call or text Vadim — no call center." },
  { title: "Maintenance that saves money", note: "Catch small problems before they become replacements." },
];

export const steps = [
  { title: "Call or text", note: "Describe the issue and the brand." },
  { title: "Diagnose", note: "Vadim finds the root cause and gives you the options." },
  { title: "Fixed", note: "Repair done properly, appliance running again." },
];

/** Contenido del QR: tarjeta de contacto (vCard) para guardar a Vadim. */
export const vcard = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "N:;Vadim;;;",
  "FN:Vadim — Allegiant Appliances Inc",
  "ORG:Allegiant Appliances Inc",
  "TITLE:Appliance Repair Technician",
  "TEL;TYPE=CELL:+13235784010",
  "END:VCARD",
].join("\n");

// TODO: confirmar con Vadim que atiende todas estas marcas.
export const brands = [
  "Samsung", "LG", "Whirlpool", "GE", "Bosch", "Maytag", "Frigidaire",
  "KitchenAid", "Kenmore", "Electrolux",
];

export const faqs = [
  {
    q: "Do you repair residential and commercial appliances?",
    a: "Yes. Allegiant Appliances services both homes and businesses.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes — fully licensed and insured, so your property and your appliance are protected.",
  },
  {
    q: "How do I get the 20% discount?",
    a: "Scan the QR code on this page (or on Vadim's business card) and save the contact. Mention it when you book and you get 20% off labor or maintenance.",
  },
  {
    q: "How fast can you come out?",
    a: "Call or text Vadim directly at +1 (323) 578-4010 and he'll confirm the earliest available window.",
  },
  {
    q: "Is it worth repairing, or should I replace it?",
    a: "Vadim will give you an honest answer after diagnosing it — if a repair doesn't make sense, he'll tell you.",
  },
];

/** Zonas que Vadim confirmó. TODO: añadir ciudades exactas "arriba por la costa". */
export const areas = ["Beverly Hills", "Pasadena", "Santa Monica", "Malibu & the coast north"];

/** Marcas premium (carrusel). TODO: confirmar con Vadim cuáles atiende. */
export const premiumBrands = [
  "Sub-Zero", "Wolf", "Thermador", "Viking", "Miele", "Gaggenau", "La Cornue",
  "Lacanche", "Best", "Cove", "Dacor", "Monogram", "Jenn-Air", "Fisher & Paykel",
  "Bertazzoni", "BlueStar", "Liebherr", "True",
];
