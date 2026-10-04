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
    slug: "wolf-burners-not-lighting",
    title: {
      en: "Wolf Range Burners Not Lighting? Common Causes & Fixes",
      es: "¿Quemadores Wolf no encienden? Causas comunes y soluciones",
    },
    excerpt: {
      en: "Wolf ranges are built for performance, but burner ignition issues happen. Here's how to diagnose and fix the problem.",
      es: "Los rangos Wolf están diseñados para rendimiento, pero los problemas de ignición ocurren. Aquí se explica cómo diagnosticar y solucionar.",
    },
    content: {
      en: `# Wolf Range Burners Not Lighting?

Wolf ranges are known for their powerful burners and professional-grade construction. When a burner won't light, it's usually one of a few common issues.

## Quick Diagnosis

### Check for Gas Supply
First, confirm gas is reaching the range. Turn on another burner—if it lights, gas is flowing. If no burner lights, check:
- Gas valve at the range (should be fully open)
- Main gas shutoff for your home
- Gas line for kinks or damage

### Inspect the Igniter
The hot surface igniter glows red to light the gas. If it doesn't glow:
- Listen for a clicking sound (indicates the spark module is trying)
- Look for a broken or dark igniter element
- Check for debris blocking the burner opening

### Clean the Burner
Spilled food can block gas flow or prevent ignition. Remove the burner cap and grate, then:
- Soak in warm soapy water for 15 minutes
- Clean with a soft brush
- Dry completely before reinstalling

## Common Problems We Fix

- **Failed hot surface igniter**: The ceramic element cracks or fails
- **Spark electrode misalignment**: Electrode doesn't sit close enough to the burner
- **Clogged burner ports**: Food debris blocks the flame ports
- **Defective spark module**: Control board not sending ignition signal

## Prevention

- Wipe spills immediately to prevent burnon
- Replace burner caps if they crack
- Schedule annual professional maintenance

Wolf ranges are investments. When ignition fails, don't wait—call us for professional diagnosis and repair.`,
      es: `# ¿Quemadores Wolf no encienden?

Los rangos Wolf son conocidos por sus quemadores potentes. Cuando un quemador no enciende, generalmente es uno de varios problemas comunes.

## Diagnóstico rápido

### Verifica el suministro de gas
Primero, confirma que el gas llega al rango. Enciende otro quemador—si enciende, el gas fluye.

### Inspecciona el encendedor
El encendedor de superficie caliente se pone rojo para encender el gas:
- Escucha un sonido de clic (indica que el módulo de chispa intenta)
- Busca un elemento encendedor roto u oscuro
- Verifica si hay escombros bloqueando la apertura

### Limpia el quemador
La comida derramada puede bloquear el flujo de gas:
- Remoja en agua con jabón 15 minutos
- Limpia con un cepillo suave
- Seca completamente antes de reinstalar

## Problemas comunes que reparamos
- **Encendedor de superficie caliente defectuoso**: Se agrieta o falla
- **Desalineación del electrodo de chispa**: No está lo suficientemente cerca
- **Puertos de quemador obstruidos**: Escombros bloquean las puertos
- **Módulo de chispa defectuoso**: Control no envía señal de encendido`,
    },
    keywords: ["Wolf burner not lighting", "Wolf range igniter", "quemador Wolf no enciende", "encendedor Wolf"],
    brands: ["Wolf"],
    category: "troubleshooting",
    publishedAt: "2026-10-03",
    readTime: 5,
  },
  {
    slug: "lg-washer-not-spinning",
    title: {
      en: "LG Washing Machine Not Spinning? Here's Why",
      es: "¿Lavadora LG no centrifuga? Aquí está por qué",
    },
    excerpt: {
      en: "A washing machine that doesn't spin leaves clothes soaking wet. Learn the most common causes and when to call for help.",
      es: "Una lavadora que no centrifuga deja la ropa mojada. Aprende las causas más comunes y cuándo pedir ayuda.",
    },
    content: {
      en: `# LG Washing Machine Not Spinning?

Clothes left soaking wet after a wash cycle means your LG's spin cycle has failed. This is one of the most common issues we see.

## Step 1: Check the Load
An unbalanced load is the #1 cause of spin failure:
- Open the door and redistribute clothes evenly
- Remove one or two items if overloaded
- Close the door and run the spin cycle alone (no wash)

If it spins now, the problem is load balancing—not a mechanical failure.

## Step 2: Inspect the Drain System
If the drum won't drain, the spin cycle can't start:
- Check the drain hose for kinks or clogs
- Look inside the tub for foreign objects (coins, buttons, underwire)
- Run the drain-only cycle to test

## Step 3: Check the Lid Switch
Many LG models have a safety lid switch. If it doesn't sense the lid is closed:
- Close the lid firmly and listen for a click
- Try manually pressing the switch while running the spin cycle
- If spin now works, the switch needs replacement

## Common Problems We Find

- **Worn drum bearing**: The drum becomes unbalanced and won't spin fast enough
- **Broken motor coupling**: Connects the motor to the drum; fails over time
- **Failed shift actuator**: Controls engagement between wash and spin modes
- **Bad pump motor**: Can't drain water, preventing spin

## Prevention
- Don't overload the machine
- Clean the filter regularly
- Use the correct water level setting

An LG that won't spin needs professional diagnosis. Some fixes are simple; others require component replacement.`,
      es: `# ¿Lavadora LG no centrifuga?

La ropa que queda mojada después del ciclo de lavado significa que la centrifugación ha fallado.

## Paso 1: Verifica la carga
Una carga desequilibrada es la causa #1:
- Abre la puerta y redistribuye la ropa uniformemente
- Retira uno o dos artículos si está sobrecargada
- Ejecuta solo el ciclo de centrifugación

## Paso 2: Inspecciona el sistema de drenaje
Si el tambor no drena, no puede centrifugar:
- Revisa la manguera de drenaje por dobleces u obstrucciones
- Busca objetos extraños (monedas, botones)
- Ejecuta solo el ciclo de drenaje

## Paso 3: Verifica el interruptor de tapa
Algunos modelos LG tienen un interruptor de seguridad:
- Cierra la tapa firmemente y escucha un clic
- Intenta presionar manualmente el interruptor

## Problemas comunes que encontramos
- **Rodamiento desgastado del tambor**: El tambor se desequilibra
- **Acoplamiento roto del motor**: Falla con el tiempo
- **Actuador de cambio fallido**: Controla la centrifugación
- **Motor de bomba defectuoso**: No puede drenar el agua`,
    },
    keywords: ["LG washer not spinning", "LG washing machine spin cycle", "lavadora LG no centrifuga", "ciclo de centrifugación"],
    brands: ["LG"],
    category: "troubleshooting",
    publishedAt: "2026-10-02",
    readTime: 5,
  },
  {
    slug: "sub-zero-fridge-noise",
    title: {
      en: "Sub-Zero Refrigerator Making Noise? Diagnosis Guide",
      es: "¿Refrigerador Sub-Zero ruidoso? Guía de diagnóstico",
    },
    excerpt: {
      en: "A quiet refrigerator is a luxury. When your Sub-Zero starts making noise, it could be a simple fix or a sign of trouble ahead.",
      es: "Un refrigerador silencioso es un lujo. Cuando tu Sub-Zero empieza a hacer ruido, podría ser una solución simple.",
    },
    content: {
      en: `# Sub-Zero Refrigerator Making Noise?

Sub-Zero refrigerators are engineered to run quietly. When you hear noise—buzzing, humming, knocking—something needs attention.

## Identify the Noise Type

### Buzzing or Humming Sound
- **Compressor running**: Normal but loud if continuous—thermostat may be stuck
- **Defrost cycle**: Sub-Zero cycles defrost every 8 hours (normal, temporary noise)
- **Fan motor**: Cooling fan running harder than usual; could indicate ice buildup

### Knocking or Grinding Sound
- **Water line vibration**: Ice maker line can vibrate against cabinet
- **Expansion and contraction**: Metal components expanding in normal operation
- **Compressor valve clicking**: The compressor opening/closing (usually normal)

### Rattling Sound
- **Loose shelves or drawers**: Check that all components are seated properly
- **Loose fasteners**: Vibration can loosen mounting bolts over time
- **Door seal issue**: Vibrating door-to-frame contact

## Quick Fixes to Try

1. **Check the condenser coils**: Dust buildup forces the compressor to work harder
   - Vacuum coils at the back of the unit
   - Clean quarterly for optimal operation

2. **Ensure proper clearance**: Confirm 2 inches of space on all sides for air circulation

3. **Level the unit**: A slightly tilted fridge works harder; use a level to adjust

## When to Call for Service

- Noise accompanied by reduced cooling
- Grinding that sounds mechanical (not expansion clicking)
- Noise increasing over days or weeks
- Ice maker running constantly without making ice

Sub-Zero machines are built to last decades. Noise diagnosis requires expertise—we've seen everything from a loose ice maker tray to a failing compressor.`,
      es: `# ¿Refrigerador Sub-Zero ruidoso?

Los refrigeradores Sub-Zero están diseñados para funcionar silenciosamente. Cuando escuchas ruido, algo necesita atención.

## Identifica el tipo de ruido

### Zumbido o sonido de ronroneo
- **Compresor en funcionamiento**: Normal pero ruidoso si es continuo
- **Ciclo de descongelación**: Sub-Zero descongela cada 8 horas
- **Motor del ventilador**: El ventilador trabaja más duro; podría indicar hielo

### Sonido de golpe o rechinamiento
- **Vibración de la línea de agua**: La línea de hielo puede vibrar
- **Expansión y contracción**: Componentes metálicos (normal)
- **Válvula del compresor**: Abre/cierra (generalmente normal)

### Sonido de traqueteo
- **Estantes o cajones sueltos**: Verifica que todos los componentes estén bien colocados
- **Pernos sueltos**: La vibración puede aflojar los pernos
- **Problema del sello de puerta**: Vibración puerta-marco

## Soluciones rápidas

1. **Limpia las bobinas del condensador**: El polvo fuerza al compresor a trabajar más
2. **Asegura espacio de circulación**: 2 pulgadas en todos los lados
3. **Nivela la unidad**: Usa un nivel para ajustar`,
    },
    keywords: ["Sub-Zero noise", "refrigerator humming", "Sub-Zero ruidoso", "compresor ruidoso"],
    brands: ["Sub-Zero"],
    category: "troubleshooting",
    publishedAt: "2026-10-01",
    readTime: 4,
  },
  {
    slug: "samsung-fridge-display-dead",
    title: {
      en: "Samsung Refrigerator Display Not Working? Quick Fix",
      es: "¿Pantalla Samsung no funciona? Solución rápida",
    },
    excerpt: {
      en: "A dead display on your Samsung fridge means no temperature control or ice maker management. Here's what we check first.",
      es: "Una pantalla muerta en tu Samsung significa sin control de temperatura. Aquí está lo que revisamos primero.",
    },
    content: {
      en: `# Samsung Refrigerator Display Not Working?

Modern Samsung refrigerators rely on digital displays for temperature control and smart features. When the screen goes dark, panic isn't necessary—it's often a quick fix.

## Step 1: Power Cycle the Unit
Electronics sometimes need a hard reset:
- Locate the circuit breaker for the refrigerator
- Turn it OFF and wait 5 minutes
- Turn it back ON
- Give it 10 minutes to boot up

Many Samsung displays come back to life after a power cycle.

## Step 2: Check for Error Codes
If the display powers on but shows an error:
- Write down any codes (like dF or FF)
- Consult your manual or search online for the meaning
- Some codes indicate sensor failures; others are temporary

## Step 3: Inspect Connections
Behind the refrigerator or in the back panel:
- Check all ribbon cables connecting the display to the main board
- Look for loose connections or bent pins
- Reseat any loose connectors by unplugging and reseating firmly

## Step 4: Test Temperature Control
Even with no display, your fridge should still cool:
- Feel the back of the unit—should be warm (condenser at work)
- Check if compressor is running (listen for humming)
- If compressor is dead silent, the control board may be offline

## Common Problems We Fix

- **Failed display panel**: LED screen burns out (common after 5+ years)
- **Loose ribbon cable**: Vibration or service disconnects the display
- **Water damage**: Condensation shorting the control board
- **Voltage surge**: Power spike damages circuit board
- **Sensor failure**: Temperature sensor offline, no display feedback

## Prevention

- Keep rear clearance for air circulation
- Avoid power surges with a surge protector
- Get annual maintenance to catch issues early`,
      es: `# ¿Pantalla Samsung no funciona?

Las pantallas digitales de Samsung controlan la temperatura e hielo. Cuando la pantalla se apaga, no es necesario entrar en pánico.

## Paso 1: Reinicia la unidad
- Localiza el interruptor del frigorífico
- Apágalo y espera 5 minutos
- Enciéndelo de nuevo
- Espera 10 minutos

## Paso 2: Busca códigos de error
Si la pantalla se enciende pero muestra un error:
- Anota los códigos que ves
- Consulta el manual o busca en línea

## Paso 3: Inspecciona las conexiones
Detrás del frigorífico:
- Revisa los cables que conectan la pantalla
- Busca conexiones sueltas o pines doblados
- Reconecta cualquier cable suelto

## Paso 4: Prueba el control de temperatura
Incluso sin pantalla, tu frigorífico debería enfriar:
- Siente la parte trasera—debe estar tibia
- Escucha si el compresor zumba

## Problemas comunes que reparamos
- **Panel de pantalla defectuoso**: LED se quema
- **Cable de cinta suelto**: Vibración desconecta la pantalla
- **Daño por agua**: Condensación cortocircuita la placa
- **Falla del sensor**: Sensor de temperatura sin conexión
- **Sobretensión**: Pico de energía daña la placa`,
    },
    keywords: ["Samsung refrigerator display", "fridge screen not working", "pantalla Samsung no funciona", "display muerto"],
    brands: ["Samsung"],
    category: "troubleshooting",
    publishedAt: "2026-09-30",
    readTime: 5,
  },
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
    slug: "bosch-dishwasher-loud",
    title: {
      en: "Why Is My Bosch Dishwasher So Loud? Diagnosis & Solutions",
      es: "¿Por qué mi lavavajillas Bosch es tan ruidoso? Diagnóstico",
    },
    excerpt: {
      en: "Bosch dishwashers are engineered to be quiet. Unusual noise means something needs attention before it gets worse.",
      es: "Los lavavajillas Bosch están diseñados para ser silenciosos. El ruido inusual significa que algo necesita atención.",
    },
    content: {
      en: `# Why Is My Bosch Dishwasher So Loud?

Bosch prides itself on ultra-quiet operation. When your Bosch becomes loud, it's not normal—and it signals a problem.

## Step 1: Identify the Noise

### Loud Spray Arm Noise (Grinding/Rattling)
- Water pressure may be too high
- Spray arm hitting dishes or racks
- Debris in spray arm holes restricting water flow
- Worn spray arm bearing

### Motor Noise (High Pitch Whining)
- Pump cavitation (air in the line)
- Worn motor bearing
- Foreign object in pump
- Failed circulation motor

### Door Latch Noise (Rattling at Door)
- Door latch spring weakened
- Door alignment off—rubs against frame
- Hinge screws loosening from vibration

## Quick Fixes

1. **Rinse dishes thoroughly** before loading—food particles cause noise and clogs
2. **Load properly**: Don't overload; allow spray arm to rotate freely
3. **Check the filter**: Remove and rinse; clogged filters restrict water flow
4. **Ensure spray arms spin freely**: Gently rotate by hand; should move with minimal resistance

## Common Problems We Fix

- **Worn pump bearings**: Creates grinding noise; will eventually fail
- **Clogged filter basket**: Debris restricts water, causing cavitation
- **Broken spray arm support**: Arm hits tank; creates loud rattling
- **Failed wash motor**: Overheating causes grinding before shutdown
- **Damaged door gasket**: Vibrates; creates rattling at the frame

## Prevention

- Scrape (don't rinse) dishes to reduce debris load
- Use quality detergent for consistent results
- Run an empty cycle monthly with dishwasher cleaner
- Have seals and bearings checked annually

Bosch dishwashers last 10+ years when maintained properly. Noise is your early warning system.`,
      es: `# ¿Por qué mi lavavajillas Bosch es tan ruidoso?

Bosch se enorgullece de su funcionamiento ultra silencioso. Cuando tu Bosch se pone ruidoso, no es normal.

## Paso 1: Identifica el ruido

### Ruido de brazo rociador (Rechinamiento/Traqueteo)
- La presión del agua puede ser demasiado alta
- El brazo rociador golpea la vajilla
- Escombros en los agujeros del brazo
- Cojinete desgastado del brazo

### Ruido del motor (Zumbido agudo)
- Cavitación de la bomba (aire en la línea)
- Cojinete del motor desgastado
- Objeto extraño en la bomba
- Motor de circulación fallido

### Ruido del cierre de puerta (Traqueteo)
- Muelle del cierre debilitado
- Alineación de puerta descentrada
- Tornillos de bisagra aflojados

## Soluciones rápidas

1. **Enjuaga los platos** a fondo antes de cargar
2. **Carga correctamente**: No sobrecargues
3. **Revisa el filtro**: Limpiar y enjuagar
4. **Asegura que los brazos giren libremente**

## Problemas comunes que reparamos
- **Cojinetes de bomba desgastados**: Crea ruido de rechinamiento
- **Canasta de filtro obstruida**: Escombros restringen el agua
- **Brazo rociador roto**: Golpea el tanque
- **Motor de lavado fallido**: Recalentamiento causa rechinamiento
- **Junta de puerta dañada**: Vibra y causa traqueteo`,
    },
    keywords: ["Bosch dishwasher loud", "noisy dishwasher", "lavavajillas ruidoso", "Bosch ruidoso"],
    brands: ["Bosch"],
    category: "troubleshooting",
    publishedAt: "2026-09-29",
    readTime: 5,
  },
  {
    slug: "miele-control-panel-error",
    title: {
      en: "Miele Washing Machine Control Panel Errors: What They Mean",
      es: "Errores del panel de control Miele: Qué significan",
    },
    excerpt: {
      en: "Miele machines are precise German engineering. Error codes are helpful diagnostics that tell us exactly what to fix.",
      es: "Las máquinas Miele son precisión de ingeniería alemana. Los códigos de error nos dicen exactamente qué reparar.",
    },
    content: {
      en: `# Miele Washing Machine Control Panel Errors

Miele builds precise machines with detailed diagnostics. When an error code appears, it's helpful information—not a disaster.

## Common Miele Error Codes

### Error F (Water Inlet)
Miele can't get water into the machine. Check:
- Is the water tap fully open?
- Are inlet hoses kinked or frozen?
- Is the filter screen in the inlet valve clogged?
- Is water pressure too low?

### Error E (Water Drainage)
Miele detected water won't drain. Check:
- Is the drain hose kinked?
- Is the floor drain backed up?
- Is the drain pump running? (listen for motor noise)
- Is the filter clogged with lint?

### Error A (Motor/Drive)
Motor or drum isn't moving as expected:
- Is the load balanced? (redistribute and try again)
- Is the door properly closed and latched?
- Is the motor running but stalled? (may need repair)

### Error C (Temperature Sensor)
The machine can't read water temperature:
- Usually indicates a faulty sensor
- Requires professional diagnosis and part replacement
- Machine typically stops working until sensor is replaced

## Before Calling for Service

1. **Write down the exact code**: Miele codes are precise; knowing the exact number is crucial
2. **Try a power cycle**: Turn off at breaker for 5 minutes, then restart
3. **Check obvious issues**: Water supply, drain, load balance, door seal
4. **Note when it appears**: During wash, rinse, or drain cycle? This helps diagnosis

## Why Miele Codes Are Actually Great

Unlike many brands, Miele error codes pinpoint the problem. Instead of "something's wrong," you know:
- Where the failure occurred (inlet, drain, motor, sensor)
- What to check first
- When professional repair is needed vs. user error

## Common Repairs We Perform

- **Inlet valve replacement**: When error F persists
- **Pump motor replacement**: For persistent error E
- **Temperature sensor replacement**: For error C
- **Drum bearing service**: When motor errors point to mechanical wear

Miele machines are investments in quality. The engineering and diagnostics make them easier to repair correctly.`,
      es: `# Errores del panel de control Miele

Miele construye máquinas precisas con diagnósticos detallados. Cuando aparece un código de error, es información útil.

## Códigos de error comunes

### Error F (Entrada de agua)
Miele no puede obtener agua. Verifica:
- ¿Está la llave de agua completamente abierta?
- ¿Están las mangueras dobladas o congeladas?
- ¿Está la pantalla del filtro obstruida?
- ¿Es la presión del agua demasiado baja?

### Error E (Drenaje de agua)
Miele detectó que el agua no drena. Verifica:
- ¿Está la manguera de drenaje doblada?
- ¿El desagüe está respaldado?
- ¿Está corriendo la bomba de drenaje?
- ¿Está el filtro obstruido?

### Error A (Motor/Tambor)
El motor o tambor no se mueve como se esperaba:
- ¿Está la carga equilibrada?
- ¿Está la puerta correctamente cerrada?
- ¿El motor está atascado?

### Error C (Sensor de temperatura)
La máquina no puede leer la temperatura:
- Generalmente indica un sensor defectuoso
- Requiere diagnóstico profesional
- La máquina generalmente se detiene hasta que se reemplaza

## Antes de llamar al servicio

1. **Anota el código exacto**: Los códigos Miele son precisos
2. **Intenta un reinicio**: Apaga por 5 minutos, luego reinicia
3. **Revisa problemas obvios**: Suministro de agua, drenaje, carga, sello
4. **Nota cuándo aparece**: ¿Durante lavado, enjuague o drenaje?

## Por qué los códigos Miele son excelentes

Los códigos de error Miele son precisos. En lugar de "algo está mal", sabes exactamente qué falló.`,
    },
    keywords: ["Miele error code", "washing machine error", "error Miele", "código de error"],
    brands: ["Miele"],
    category: "troubleshooting",
    publishedAt: "2026-09-28",
    readTime: 6,
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
