/**
 * Blog de reparación de electrodomésticos.
 * Artículos para SEO y educación sobre problemas comunes.
 */

export type BlogPost = {
  slug: string;
  title: {
    en: string;
    es: string;
  };
  excerpt: {
    en: string;
    es: string;
  };
  content: {
    en: string;
    es: string;
  };
  keywords: string[];
  brands: string[];
  category: "troubleshooting" | "maintenance" | "tips" | "repair";
  publishedAt: string;
  readTime: number;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-refrigerator-not-cooling",
    title: {
      en: "Why Is My Refrigerator Not Cooling? Diagnosis and Solutions",
      es: "¿Por qué mi refrigerador no enfría? Diagnóstico y soluciones",
    },
    excerpt: {
      en: "Complete guide to troubleshooting a refrigerator that isn't cooling properly. Learn the most common causes and when to call a technician.",
      es: "Guía completa para solucionar un refrigerador que no enfría. Aprende las causas más comunes y cuándo llamar a un técnico.",
    },
    content: {
      en: `# Why Is My Refrigerator Not Cooling?

A refrigerator that isn't cooling is one of the most frustrating appliance problems. Here are the most common causes and how to diagnose them:

## Step 1: Check the Thermostat
Make sure your refrigerator's temperature control is set to the correct setting. It should be between 35-38°F. If someone adjusted it accidentally, turn it back to the proper position.

## Step 2: Check for Airflow Issues
Clean the condenser coils at the back of your refrigerator. Dust buildup prevents proper heat dissipation. Unplug the unit, vacuum the coils, and plug it back in. This solves the problem in about 30% of cases.

## Step 3: Check the Door Seal
If the door doesn't close properly, cold air escapes. Look for gaps or cracks in the rubber seal. If it's damaged, the seal likely needs replacement.

## Common Problems We Fix
- **Faulty compressor**: The heart of your refrigerator. When it fails, the fridge won't cool at all.
- **Broken evaporator coils**: Ice can build up or coils can crack, preventing cooling.
- **Failed condenser fan**: Can't expel heat if the fan isn't working.
- **Weak or leaking refrigerant**: Low refrigerant means no cooling capacity.

## When to Call a Technician
If you've tried the above steps and your refrigerator still isn't cooling, contact us. We can diagnose and repair the issue quickly, often the same day.`,
      es: `# ¿Por qué mi refrigerador no enfría?

Un refrigerador que no enfría es uno de los problemas más frustrantes. Aquí están las causas más comunes y cómo diagnosticarlas:

## Paso 1: Revisa el termostato
Asegúrate de que el control de temperatura esté en la posición correcta, entre 35-38°F. Si alguien lo ajustó accidentalmente, devuélvelo a la posición correcta.

## Paso 2: Revisa el flujo de aire
Limpia las bobinas del condensador en la parte trasera. El polvo acumulado impide la disipación de calor. Desenchufa el aparato, aspira las bobinas, y vuelve a enchufar. Esto resuelve el problema en el 30% de los casos.

## Paso 3: Revisa el sello de la puerta
Si la puerta no cierra bien, el aire frío se escapa. Busca huecos o grietas en el sello de goma. Si está dañado, probablemente necesite reemplazo.

## Problemas comunes que reparamos
- **Compresor defectuoso**: El corazón del refrigerador. Cuando falla, el refrigerador no enfría en absoluto.
- **Bobinas de evaporador rotas**: El hielo puede acumularse o las bobinas pueden romperse.
- **Ventilador del condensador roto**: No puede expulsar calor si el ventilador no funciona.
- **Refrigerante débil o con fugas**: Poco refrigerante significa sin capacidad de enfriamiento.

## Cuándo llamar a un técnico
Si has probado los pasos anteriores y tu refrigerador sigue sin enfriar, contactanos. Podemos diagnosticar y reparar el problema rápidamente, a menudo el mismo día.`,
    },
    keywords: ["refrigerador no enfría", "refrigerator not cooling", "diagnóstico frigorífico", "reparación frigorífico"],
    brands: ["Sub-Zero", "Wolf", "Samsung", "LG", "GE", "Whirlpool", "Miele"],
    category: "troubleshooting",
    publishedAt: "2025-10-01",
    readTime: 5,
  },
  {
    slug: "dishwasher-not-draining",
    title: {
      en: "Dishwasher Not Draining? Here's What to Do",
      es: "¿Tu lavavajillas no drena? Aquí está lo que debes hacer",
    },
    excerpt: {
      en: "Standing water in your dishwasher is a common problem. Learn the top causes and simple fixes you can try before calling a technician.",
      es: "El agua estancada en el lavavajillas es un problema común. Aprende las causas principales y soluciones simples que puedes probar.",
    },
    content: {
      en: `# Dishwasher Not Draining? Here's What to Do

Standing water at the bottom of your dishwasher after a cycle is frustrating. Let's troubleshoot this common problem:

## Quick Fixes to Try First

### 1. Clean the Filter
The filter at the bottom of the tub catches food particles. If it's clogged, water can't drain. Remove and rinse it thoroughly.

### 2. Check the Drain Hose
Make sure the drain hose isn't kinked or bent. Follow it from the dishwasher to the drain connection and straighten any kinks.

### 3. Remove the Knockout Plug
If your dishwasher is new or recently installed, there might be a plastic knockout plug in the drain line. This must be removed for water to flow properly.

## Common Issues We Find and Fix
- **Clogged drain pump**: Food and debris block the pump impeller
- **Blocked drain line**: The hose connecting to your sink drain may be clogged
- **Failed solenoid valve**: Controls water flow and often gets stuck
- **Cracked or split hose**: Holes in the hose prevent proper draining

## Prevention Tips
- Rinse dishes before loading
- Clean the filter monthly
- Run the disposal before starting the dishwasher`,
      es: `# ¿Tu lavavajillas no drena? Aquí está lo que debes hacer

El agua estancada en el fondo del lavavajillas después de un ciclo es frustrante. Aquí está cómo solucionar este problema común:

## Soluciones rápidas que puedes probar

### 1. Limpia el filtro
El filtro en el fondo recolecta partículas de comida. Si está obstruido, el agua no puede drenar. Retíralo y enjuágalo bien.

### 2. Revisa la manguera de drenaje
Asegúrate de que la manguera de drenaje no esté doblada. Síguelo desde el lavavajillas hasta la conexión de desagüe.

### 3. Retira el tapón knockout
Si el lavavajillas es nuevo, puede haber un tapón de plástico en la línea de drenaje. Debe ser retirado para que el agua fluya.

## Problemas comunes que encontramos y reparamos
- **Bomba de desagüe obstruida**: Alimentos y residuos bloquean el impulsor
- **Línea de drenaje bloqueada**: La manguera puede estar obstruida
- **Válvula solenoide fallida**: Controla el flujo de agua y a menudo se atasca
- **Manguera agrietada**: Los agujeros en la manguera previenen el drenaje

## Consejos de prevención
- Enjuaga los platos antes de cargar
- Limpia el filtro mensualmente
- Ejecuta el triturador antes de iniciar el lavavajillas`,
    },
    keywords: ["lavavajillas no drena", "dishwasher not draining", "agua estancada lavavajillas", "dishwasher water pooling"],
    brands: ["Bosch", "Miele", "Fisher & Paykel", "GE", "Whirlpool"],
    category: "troubleshooting",
    publishedAt: "2025-09-28",
    readTime: 4,
  },
  {
    slug: "appliance-maintenance-guide",
    title: {
      en: "Complete Appliance Maintenance Guide for Homeowners",
      es: "Guía completa de mantenimiento de electrodomésticos",
    },
    excerpt: {
      en: "Preventive maintenance extends appliance lifespan and prevents costly repairs. Here's everything you need to know.",
      es: "El mantenimiento preventivo extiende la vida útil de los electrodomésticos. Todo lo que necesitas saber.",
    },
    content: {
      en: `# Complete Appliance Maintenance Guide

Regular maintenance keeps your appliances running smoothly and prevents expensive repairs. Here's what you should do:

## Monthly Maintenance

### Refrigerator
- Clean door seals to prevent leaks
- Wipe down shelves and drawers
- Empty and wipe the water tray

### Dishwasher
- Run an empty cycle with vinegar to clean
- Clean the filter
- Wipe down the door seal

### Washing Machine
- Leave the door open to prevent mildew
- Clean the rubber seal
- Run a cleaning cycle monthly

## Quarterly Maintenance

### All Appliances
- Vacuum condenser coils
- Check for leaks and water damage
- Inspect hoses for cracks

## Annual Maintenance

- Have a professional service perform deep cleaning
- Replace water filters
- Check door seals on all units
- Inspect for any signs of wear`,
      es: `# Guía completa de mantenimiento de electrodomésticos

El mantenimiento regular mantiene tus electrodomésticos en perfecto estado. Aquí está lo que debes hacer:

## Mantenimiento mensual

### Refrigerador
- Limpia los sellos de la puerta
- Pasa un paño por estantes
- Vacía la bandeja de agua

### Lavavajillas
- Ejecuta un ciclo vacío con vinagre
- Limpia el filtro
- Pasa un paño por el sello

### Lavadora
- Deja la puerta abierta
- Limpia el sello de goma
- Ejecuta un ciclo de limpieza mensualmente

## Mantenimiento trimestral

### Todos los aparatos
- Aspira las bobinas del condensador
- Busca fugas
- Inspecciona las mangueras

## Mantenimiento anual

- Servicio profesional
- Reemplaza filtros de agua
- Inspecciona sellos de puerta
- Busca signos de desgaste`,
    },
    keywords: ["mantenimiento electrodomésticos", "appliance maintenance", "preventive care", "cuidado preventivo"],
    brands: [],
    category: "maintenance",
    publishedAt: "2025-09-25",
    readTime: 6,
  },
];
