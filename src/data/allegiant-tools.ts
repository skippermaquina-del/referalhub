/**
 * Herramientas para propietarios (página /tools): revisión de síntomas, guía de
 * mantenimiento y calculadora de energía del refrigerador.
 *
 * Solo pasos seguros que cualquiera puede hacer y señales de cuándo llamar. Las
 * cifras de la calculadora son estimaciones conservadoras y se presentan como
 * tales; no hay datos inventados ni diagnósticos.
 */

import type { Lang } from "./allegiant";

export type ApplianceId = "fridge" | "dishwasher" | "washer" | "dryer" | "oven";

export type Symptom = {
  id: string;
  label: string;
  /** Peligro inmediato: se muestra el aviso urgente en lugar de los pasos. */
  urgent?: string;
  checks: string[];
  callIf: string[];
};

export type MaintenanceTask = { task: string; how: string; every: string };

type ToolsCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  h1a: string;
  h1b: string;
  intro: string;
  tabs: { symptoms: string; maintenance: string; energy: string };
  appliances: Record<ApplianceId, string>;
  symptoms: {
    pickAppliance: string;
    pickSymptom: string;
    checksTitle: string;
    callTitle: string;
    unplug: string;
    urgentTitle: string;
    list: Record<ApplianceId, Symptom[]>;
  };
  maintenance: {
    intro: string;
    taskCol: string;
    everyCol: string;
    list: Record<ApplianceId, MaintenanceTask[]>;
    proTitle: string;
    proText: string;
  };
  energy: {
    title: string;
    intro: string;
    type: string;
    types: { standard: string; builtin: string };
    age: string;
    ages: { new: string; mid: string; old: string };
    coils: string;
    coilsOpts: { recent: string; year: string; never: string };
    rate: string;
    rateHint: string;
    yearly: string;
    extra: string;
    extraNone: string;
    perYear: string;
    note: string;
  };
  cta: { title: string; text: string; book: string; call: string };
};

const en: ToolsCopy = {
  meta: {
    title: "Appliance Tools: Symptom Checker, Maintenance Guide & Energy Calculator | Allegiant Appliances",
    description:
      "Free tools from Allegiant Appliances in Los Angeles: check your appliance's symptoms, follow a simple maintenance schedule, and estimate what your refrigerator costs to run.",
  },
  eyebrow: "Homeowner tools",
  h1a: "Before you call,",
  h1b: "check this.",
  intro:
    "Simple, safe checks you can do yourself, a maintenance schedule that keeps appliances running longer, and a quick estimate of what your refrigerator costs to run. If it still isn't right, we're one call away.",
  tabs: { symptoms: "Symptom checker", maintenance: "Maintenance guide", energy: "Energy calculator" },
  appliances: {
    fridge: "Refrigerator",
    dishwasher: "Dishwasher",
    washer: "Washer",
    dryer: "Dryer",
    oven: "Oven & range",
  },
  symptoms: {
    pickAppliance: "Which appliance?",
    pickSymptom: "What is it doing?",
    checksTitle: "What you can safely check",
    callTitle: "Call a technician if",
    unplug: "Unplug the appliance (or switch off its breaker) before touching anything inside or behind it.",
    urgentTitle: "Stop. Do this first",
    list: {
      fridge: [
        {
          id: "warm",
          label: "Not cooling enough",
          checks: [
            "Set the fridge to 37°F and the freezer to 0°F, then wait 24 hours.",
            "Make sure food isn't blocking the air vents inside.",
            "Close the door on a dollar bill. If it slides out easily, the gasket isn't sealing.",
            "Clean the condenser coils (bottom grille or top panel) with a coil brush and a vacuum.",
          ],
          callIf: [
            "It's still warm 24 hours after these checks.",
            "You hear clicking every few minutes, or the compressor never seems to run.",
            "Frost is building up on the back wall of the freezer.",
          ],
        },
        {
          id: "leak",
          label: "Leaking water",
          checks: [
            "Look for ice at the bottom of the freezer. A frozen defrost drain is a common cause.",
            "Check that the water filter is fully seated and locked.",
            "Make sure the fridge is level, tilted slightly back so the doors close on their own.",
          ],
          callIf: [
            "Water keeps coming from behind or under the unit. Close the water valve behind it.",
            "The drain keeps freezing after you thaw it.",
          ],
        },
        {
          id: "ice",
          label: "Ice maker not making ice",
          checks: [
            "Make sure the ice maker is on (switch on, or the wire arm is down).",
            "Replace the water filter if it's older than 6 months.",
            "Check that the freezer is at 0°F and the water valve behind the fridge is open.",
          ],
          callIf: ["No water reaches the ice tray.", "The water dispenser also stopped working."],
        },
        {
          id: "noise",
          label: "Loud or unusual noise",
          checks: [
            "Make sure the fridge is level and not touching the wall or cabinets.",
            "Remove items on top of the fridge and check the drip pan isn't rattling.",
          ],
          callIf: ["Grinding, squealing or buzzing that doesn't stop.", "The noise started with a cooling problem."],
        },
      ],
      dishwasher: [
        {
          id: "dirty",
          label: "Dishes not getting clean",
          checks: [
            "Remove and rinse the filter at the bottom of the tub.",
            "Check that the spray arm holes aren't clogged and the arms spin freely.",
            "Run the kitchen tap until the water is hot before starting a cycle.",
            "Don't overload, and use fresh dishwasher detergent.",
          ],
          callIf: ["You don't hear water spraying.", "The motor hums but nothing happens."],
        },
        {
          id: "water",
          label: "Water left at the bottom",
          checks: [
            "Clean the filter.",
            "Check the drain hose under the sink for kinks.",
            "If it drains into a garbage disposal, run the disposal first.",
          ],
          callIf: ["Water is still standing after these checks."],
        },
        {
          id: "leak",
          label: "Leaking from the door",
          checks: [
            "Wipe the door gasket and check it for tears.",
            "Use only dishwasher detergent. Regular dish soap makes foam that leaks out.",
            "Make sure the dishwasher is level.",
          ],
          callIf: ["Water is leaking from underneath the unit."],
        },
      ],
      washer: [
        {
          id: "drain",
          label: "Won't drain or spin",
          checks: [
            "Front-loader: open the small panel at the bottom front and clean the drain pump filter. Have towels ready.",
            "Redistribute the load. A single heavy item can stop the spin.",
            "Check the drain hose for kinks.",
          ],
          callIf: ["It hums but doesn't drain.", "It shows an error code after you clean the filter."],
        },
        {
          id: "smell",
          label: "Bad smell",
          checks: [
            "Wipe inside the door gasket, including the folds.",
            "Leave the door and detergent drawer open between washes.",
            "Run a cleaning cycle (or hot cycle with washer cleaner) once a month.",
            "Use HE detergent and only the recommended amount.",
          ],
          callIf: ["The smell stays after a month of these steps."],
        },
        {
          id: "shake",
          label: "Shakes or moves during spin",
          checks: [
            "Level the feet and tighten the lock nuts.",
            "Balance the load.",
            "New washer? Make sure the shipping bolts on the back were removed.",
          ],
          callIf: ["You hear banging or grinding during the spin cycle."],
        },
      ],
      dryer: [
        {
          id: "slow",
          label: "Takes too long to dry",
          checks: [
            "Clean the lint screen before every load.",
            "Check that the vent hose behind the dryer isn't crushed or kinked.",
            "Go outside while it runs: you should feel strong warm air at the vent flap.",
          ],
          callIf: [
            "Airflow outside is weak even with a clean screen. The vent duct needs cleaning (a lint buildup is a fire risk).",
            "The dryer runs but doesn't heat.",
          ],
        },
        {
          id: "noheat",
          label: "Runs but no heat",
          checks: [
            "Electric dryer: check the breaker panel. Many dryers use two breakers, and one may have tripped.",
            "Gas dryer: make sure the gas valve behind it is open.",
          ],
          callIf: ["Still no heat after checking the breaker or gas valve."],
        },
        {
          id: "burn",
          label: "Burning smell",
          urgent:
            "Stop the dryer and unplug it (or switch off its breaker). Don't run it again until it has been checked. If you see smoke or flames, leave and call 911.",
          checks: [],
          callIf: ["Always. A burning smell needs a technician before the next use."],
        },
      ],
      oven: [
        {
          id: "heat",
          label: "Not heating or heating unevenly",
          checks: [
            "Check that the oven isn't in lock, timer or Sabbath mode.",
            "Let it preheat fully, and use an oven thermometer to check the real temperature.",
          ],
          callIf: [
            "Electric: the bottom element doesn't glow red.",
            "Gas: the igniter glows but the burner doesn't light.",
            "It's more than 25°F off the set temperature.",
          ],
        },
        {
          id: "burner",
          label: "Gas burner won't light",
          checks: [
            "Let it cool, then lift the burner cap and make sure it's dry and sitting flat.",
            "Clean the small ports around the burner with a dry brush (no water).",
          ],
          callIf: ["It keeps clicking without lighting.", "The flame is yellow or uneven."],
        },
        {
          id: "gas",
          label: "I smell gas",
          urgent:
            "Don't turn anything on or off, and don't use a lighter or your phone inside. Leave the house now and call 911 or your gas company from outside.",
          checks: [],
          callIf: ["After the gas company has checked it and it's safe, call us to inspect the appliance."],
        },
      ],
    },
  },
  maintenance: {
    intro: "A few minutes on this schedule keeps appliances running efficiently and helps you avoid many repairs.",
    taskCol: "Task",
    everyCol: "How often",
    list: {
      fridge: [
        { task: "Clean the condenser coils", how: "Unplug, remove the grille, use a coil brush and a vacuum.", every: "Every 6–12 months (more often with pets)" },
        { task: "Replace the water filter", how: "Twist out the old filter and lock in the new one, then run 2 gallons through the dispenser.", every: "Every 6 months" },
        { task: "Check the door gaskets", how: "Wipe with warm soapy water and do the dollar-bill test.", every: "Every 3 months" },
      ],
      dishwasher: [
        { task: "Clean the filter", how: "Twist it out, rinse under the tap, and brush gently.", every: "Monthly" },
        { task: "Clear the spray arms", how: "Pop them off and clear the holes with a toothpick.", every: "Every 3 months" },
        { task: "Run a cleaning cycle", how: "Empty dishwasher, dishwasher cleaner, hottest cycle.", every: "Monthly" },
      ],
      washer: [
        { task: "Wipe the door gasket and leave the door open", how: "Dry the folds after the last load of the day.", every: "Weekly" },
        { task: "Run a cleaning cycle", how: "Washer cleaner or the built-in clean cycle, empty drum.", every: "Monthly" },
        { task: "Clean the drain pump filter (front-loaders)", how: "Small panel at the bottom front. Have towels ready.", every: "Every 3 months" },
        { task: "Check the fill hoses", how: "Look for bulges or cracks. Replace rubber hoses with braided steel.", every: "Yearly" },
      ],
      dryer: [
        { task: "Clean the lint screen", how: "Pull it out and remove the lint.", every: "Every load" },
        { task: "Wash the lint screen", how: "Scrub with warm soapy water to remove dryer-sheet residue.", every: "Every 6 months" },
        { task: "Clean the vent duct", how: "From the dryer to the outside wall. A clogged duct is a fire risk.", every: "Yearly" },
      ],
      oven: [
        { task: "Clean the range hood filter", how: "Soak in hot water with degreaser, or run it through the dishwasher if it's metal.", every: "Every 1–3 months" },
        { task: "Clean the burner caps and ports", how: "When cool, wash the caps and dry them fully before putting them back.", every: "Monthly" },
        { task: "Check the oven door gasket", how: "Look for gaps or tears that let heat escape.", every: "Yearly" },
      ],
    },
    proTitle: "Prefer a professional to do it?",
    proText: "Vadim does a full maintenance visit for your kitchen and laundry appliances, with 20% off maintenance labor.",
  },
  energy: {
    title: "What does your refrigerator cost to run?",
    intro:
      "A quick estimate based on the type and age of your refrigerator and when its coils were last cleaned. Dusty condenser coils make the compressor run longer to keep the same temperature.",
    type: "Type",
    types: { standard: "Standard full-size", builtin: "Built-in (Sub-Zero, Thermador, Viking…)" },
    age: "Age",
    ages: { new: "Under 10 years", mid: "10–15 years", old: "Over 15 years" },
    coils: "Coils last cleaned",
    coilsOpts: { recent: "In the last year", year: "1–2 years ago", never: "Never / I don't know" },
    rate: "Electricity rate ($/kWh)",
    rateHint: "Check your LADWP or SCE bill. Many LA homes pay about $0.30.",
    yearly: "Estimated cost to run",
    extra: "Estimated extra from dirty coils",
    extraNone: "Coils recently cleaned: no extra estimated.",
    perYear: "/year",
    note:
      "Rough estimate only. Real usage depends on your model, settings, how often the door opens and the temperature in your kitchen. For your model's exact number, check the yellow EnergyGuide label or the manufacturer's specs.",
  },
  cta: {
    title: "Still not right?",
    text: "Vadim diagnoses and repairs luxury and everyday appliances across Los Angeles. 20% off maintenance and repair labor.",
    book: "Book a visit",
    call: "Call",
  },
};

const es: ToolsCopy = {
  meta: {
    title: "Herramientas: revisión de síntomas, mantenimiento y calculadora de energía | Allegiant Appliances",
    description:
      "Herramientas gratuitas de Allegiant Appliances en Los Ángeles: revisa los síntomas de tu electrodoméstico, sigue un calendario de mantenimiento y calcula cuánto gasta tu refrigerador.",
  },
  eyebrow: "Herramientas para tu casa",
  h1a: "Antes de llamar,",
  h1b: "revisa esto.",
  intro:
    "Revisiones simples y seguras que puedes hacer tú mismo, un calendario de mantenimiento para que tus electrodomésticos duren más y un cálculo rápido de cuánto gasta tu refrigerador. Si sigue sin funcionar bien, estamos a una llamada.",
  tabs: { symptoms: "Revisar síntomas", maintenance: "Guía de mantenimiento", energy: "Calculadora de energía" },
  appliances: {
    fridge: "Refrigerador",
    dishwasher: "Lavavajillas",
    washer: "Lavadora",
    dryer: "Secadora",
    oven: "Horno y estufa",
  },
  symptoms: {
    pickAppliance: "¿Qué electrodoméstico?",
    pickSymptom: "¿Qué le pasa?",
    checksTitle: "Lo que puedes revisar con seguridad",
    callTitle: "Llama a un técnico si",
    unplug: "Desconecta el aparato (o apaga su breaker) antes de tocar nada adentro o atrás.",
    urgentTitle: "Detente. Haz esto primero",
    list: {
      fridge: [
        {
          id: "warm",
          label: "No enfría lo suficiente",
          checks: [
            "Pon el refrigerador en 37°F y el congelador en 0°F, y espera 24 horas.",
            "Revisa que la comida no tape las salidas de aire de adentro.",
            "Cierra la puerta sobre un billete. Si sale fácil, la goma no está sellando.",
            "Limpia las bobinas del condensador (rejilla de abajo o panel de arriba) con un cepillo y la aspiradora.",
          ],
          callIf: [
            "Sigue sin enfriar 24 horas después de estas revisiones.",
            "Escuchas un clic cada pocos minutos, o el compresor parece no arrancar nunca.",
            "Se forma escarcha en la pared de atrás del congelador.",
          ],
        },
        {
          id: "leak",
          label: "Gotea agua",
          checks: [
            "Busca hielo en el fondo del congelador. Un desagüe de descongelación tapado es una causa común.",
            "Revisa que el filtro de agua esté bien puesto y trabado.",
            "Revisa que el refrigerador esté nivelado, un poco inclinado hacia atrás para que las puertas cierren solas.",
          ],
          callIf: [
            "Sale agua sin parar por detrás o por debajo. Cierra la llave de agua de atrás.",
            "El desagüe se vuelve a congelar después de descongelarlo.",
          ],
        },
        {
          id: "ice",
          label: "La máquina de hielo no hace hielo",
          checks: [
            "Revisa que la máquina de hielo esté encendida (interruptor o brazo de alambre abajo).",
            "Cambia el filtro de agua si tiene más de 6 meses.",
            "Revisa que el congelador esté en 0°F y que la llave de agua de atrás esté abierta.",
          ],
          callIf: ["No llega agua a la bandeja de hielo.", "El dispensador de agua también dejó de funcionar."],
        },
        {
          id: "noise",
          label: "Ruido fuerte o raro",
          checks: [
            "Revisa que esté nivelado y que no toque la pared ni los muebles.",
            "Quita lo que haya encima y revisa que la bandeja de goteo no esté vibrando.",
          ],
          callIf: ["Un ruido de roce, chillido o zumbido que no para.", "El ruido empezó junto con un problema de frío."],
        },
      ],
      dishwasher: [
        {
          id: "dirty",
          label: "Los platos no salen limpios",
          checks: [
            "Saca y enjuaga el filtro del fondo.",
            "Revisa que los agujeros de los brazos rociadores no estén tapados y que giren libres.",
            "Abre la llave de agua caliente de la cocina hasta que salga caliente antes de empezar.",
            "No lo sobrecargues y usa detergente para lavavajillas en buen estado.",
          ],
          callIf: ["No escuchas el agua rociando.", "El motor zumba pero no pasa nada."],
        },
        {
          id: "water",
          label: "Queda agua en el fondo",
          checks: [
            "Limpia el filtro.",
            "Revisa que la manguera de desagüe bajo el fregadero no esté doblada.",
            "Si desagua al triturador de basura, enciende el triturador primero.",
          ],
          callIf: ["Sigue quedando agua después de estas revisiones."],
        },
        {
          id: "leak",
          label: "Gotea por la puerta",
          checks: [
            "Limpia la goma de la puerta y revisa que no esté rota.",
            "Usa solo detergente para lavavajillas. El jabón de platos común hace espuma que se sale.",
            "Revisa que esté nivelado.",
          ],
          callIf: ["Gotea por debajo del aparato."],
        },
      ],
      washer: [
        {
          id: "drain",
          label: "No desagua o no centrifuga",
          checks: [
            "Carga frontal: abre la tapita de abajo al frente y limpia el filtro de la bomba. Ten toallas a mano.",
            "Reparte la ropa. Una sola prenda pesada puede impedir el centrifugado.",
            "Revisa que la manguera de desagüe no esté doblada.",
          ],
          callIf: ["Zumba pero no desagua.", "Muestra un código de error después de limpiar el filtro."],
        },
        {
          id: "smell",
          label: "Mal olor",
          checks: [
            "Limpia por dentro la goma de la puerta, incluidos los pliegues.",
            "Deja la puerta y el cajón del detergente abiertos entre lavados.",
            "Haz un ciclo de limpieza (o ciclo caliente con limpiador) una vez al mes.",
            "Usa detergente HE y solo la cantidad recomendada.",
          ],
          callIf: ["El olor sigue después de un mes con estos pasos."],
        },
        {
          id: "shake",
          label: "Se sacude o se mueve al centrifugar",
          checks: [
            "Nivela las patas y ajusta las tuercas.",
            "Reparte la carga.",
            "¿Lavadora nueva? Revisa que hayan quitado los tornillos de transporte de atrás.",
          ],
          callIf: ["Escuchas golpes o roces durante el centrifugado."],
        },
      ],
      dryer: [
        {
          id: "slow",
          label: "Tarda mucho en secar",
          checks: [
            "Limpia el filtro de pelusa antes de cada carga.",
            "Revisa que la manguera de ventilación de atrás no esté aplastada ni doblada.",
            "Sal afuera mientras funciona: debes sentir aire tibio y fuerte en la salida.",
          ],
          callIf: [
            "Sale poco aire afuera aunque el filtro esté limpio. Hay que limpiar el ducto (la pelusa acumulada puede causar un incendio).",
            "Funciona pero no calienta.",
          ],
        },
        {
          id: "noheat",
          label: "Funciona pero no calienta",
          checks: [
            "Eléctrica: revisa el panel de breakers. Muchas secadoras usan dos y uno puede haber saltado.",
            "A gas: revisa que la llave de gas de atrás esté abierta.",
          ],
          callIf: ["Sigue sin calentar después de revisar el breaker o la llave de gas."],
        },
        {
          id: "burn",
          label: "Olor a quemado",
          urgent:
            "Apaga la secadora y desconéctala (o apaga su breaker). No la vuelvas a usar hasta que la revisen. Si ves humo o fuego, sal y llama al 911.",
          checks: [],
          callIf: ["Siempre. El olor a quemado necesita un técnico antes de volver a usarla."],
        },
      ],
      oven: [
        {
          id: "heat",
          label: "No calienta o calienta desparejo",
          checks: [
            "Revisa que el horno no esté en bloqueo, temporizador o modo Sabbath.",
            "Déjalo precalentar bien y usa un termómetro de horno para ver la temperatura real.",
          ],
          callIf: [
            "Eléctrico: la resistencia de abajo no se pone roja.",
            "A gas: el encendedor brilla pero el quemador no prende.",
            "La temperatura real difiere más de 25°F de la que elegiste.",
          ],
        },
        {
          id: "burner",
          label: "Un quemador a gas no prende",
          checks: [
            "Con todo frío, levanta la tapa del quemador y revisa que esté seca y bien asentada.",
            "Limpia los orificios del quemador con un cepillo seco (sin agua).",
          ],
          callIf: ["Sigue haciendo clic sin prender.", "La llama es amarilla o desigual."],
        },
        {
          id: "gas",
          label: "Huele a gas",
          urgent:
            "No enciendas ni apagues nada, y no uses encendedor ni el celular adentro. Sal de la casa ahora y llama al 911 o a la compañía de gas desde afuera.",
          checks: [],
          callIf: ["Cuando la compañía de gas confirme que es seguro, llámanos para revisar el aparato."],
        },
      ],
    },
  },
  maintenance: {
    intro: "Unos minutos con este calendario mantienen tus electrodomésticos eficientes y te ayudan a evitar muchas reparaciones.",
    taskCol: "Tarea",
    everyCol: "Cada cuánto",
    list: {
      fridge: [
        { task: "Limpiar las bobinas del condensador", how: "Desconecta, quita la rejilla y usa un cepillo para bobinas y la aspiradora.", every: "Cada 6–12 meses (más seguido si tienes mascotas)" },
        { task: "Cambiar el filtro de agua", how: "Gira y saca el viejo, traba el nuevo y deja correr 2 galones por el dispensador.", every: "Cada 6 meses" },
        { task: "Revisar las gomas de las puertas", how: "Límpialas con agua tibia y jabón y haz la prueba del billete.", every: "Cada 3 meses" },
      ],
      dishwasher: [
        { task: "Limpiar el filtro", how: "Gíralo, sácalo, enjuágalo bajo la llave y cepíllalo suave.", every: "Cada mes" },
        { task: "Destapar los brazos rociadores", how: "Sácalos y limpia los agujeros con un palillo.", every: "Cada 3 meses" },
        { task: "Hacer un ciclo de limpieza", how: "Vacío, con limpiador para lavavajillas, en el ciclo más caliente.", every: "Cada mes" },
      ],
      washer: [
        { task: "Secar la goma de la puerta y dejarla abierta", how: "Seca los pliegues después de la última carga del día.", every: "Cada semana" },
        { task: "Hacer un ciclo de limpieza", how: "Con limpiador o el ciclo de limpieza propio, con el tambor vacío.", every: "Cada mes" },
        { task: "Limpiar el filtro de la bomba (carga frontal)", how: "Tapita de abajo al frente. Ten toallas a mano.", every: "Cada 3 meses" },
        { task: "Revisar las mangueras de entrada", how: "Busca bultos o grietas. Cambia las de goma por mangueras de acero trenzado.", every: "Cada año" },
      ],
      dryer: [
        { task: "Limpiar el filtro de pelusa", how: "Sácalo y quita la pelusa.", every: "En cada carga" },
        { task: "Lavar el filtro de pelusa", how: "Restriégalo con agua tibia y jabón para sacar los restos de las toallitas suavizantes.", every: "Cada 6 meses" },
        { task: "Limpiar el ducto de ventilación", how: "Desde la secadora hasta la pared exterior. Un ducto tapado puede causar un incendio.", every: "Cada año" },
      ],
      oven: [
        { task: "Limpiar el filtro de la campana", how: "Remójalo en agua caliente con desengrasante, o lávalo en el lavavajillas si es de metal.", every: "Cada 1–3 meses" },
        { task: "Limpiar las tapas y orificios de los quemadores", how: "En frío, lava las tapas y sécalas bien antes de ponerlas.", every: "Cada mes" },
        { task: "Revisar la goma de la puerta del horno", how: "Busca huecos o roturas por donde se escape el calor.", every: "Cada año" },
      ],
    },
    proTitle: "¿Prefieres que lo haga un profesional?",
    proText: "Vadim hace una visita completa de mantenimiento de tu cocina y lavandería, con 20% de descuento en la mano de obra de mantenimiento.",
  },
  energy: {
    title: "¿Cuánto gasta tu refrigerador?",
    intro:
      "Un cálculo rápido según el tipo y la edad de tu refrigerador, y cuándo se limpiaron sus bobinas por última vez. Las bobinas del condensador con polvo hacen que el compresor funcione más tiempo para mantener la misma temperatura.",
    type: "Tipo",
    types: { standard: "Estándar, tamaño completo", builtin: "Empotrado (Sub-Zero, Thermador, Viking…)" },
    age: "Antigüedad",
    ages: { new: "Menos de 10 años", mid: "10–15 años", old: "Más de 15 años" },
    coils: "Última limpieza de bobinas",
    coilsOpts: { recent: "En el último año", year: "Hace 1–2 años", never: "Nunca / No sé" },
    rate: "Tarifa de luz ($/kWh)",
    rateHint: "Revisa tu factura de LADWP o SCE. Muchas casas en Los Ángeles pagan cerca de $0.30.",
    yearly: "Costo estimado de funcionamiento",
    extra: "Gasto extra estimado por bobinas sucias",
    extraNone: "Bobinas limpias hace poco: sin gasto extra estimado.",
    perYear: "/año",
    note:
      "Es solo un cálculo aproximado. El consumo real depende del modelo, la configuración, cuántas veces se abre la puerta y la temperatura de tu cocina. Para el dato exacto de tu modelo, revisa la etiqueta amarilla EnergyGuide o las especificaciones del fabricante.",
  },
  cta: {
    title: "¿Sigue sin funcionar bien?",
    text: "Vadim diagnostica y repara electrodomésticos de lujo y de uso diario en todo Los Ángeles. 20% de descuento en la mano de obra de mantenimiento y reparación.",
    book: "Reservar visita",
    call: "Llamar",
  },
};

export const toolsCopy: Record<Lang, ToolsCopy> = { en, es };

/**
 * Supuestos de la calculadora (conservadores, a propósito):
 * - Consumo anual de referencia: refrigerador estándar ~500 kWh, empotrado ~700 kWh.
 * - Antigüedad: los modelos viejos son menos eficientes (x1.25 y x1.6).
 * - Bobinas sucias: rango de consumo extra, no una cifra exacta.
 */
export const energyModel = {
  baseKwh: { standard: 500, builtin: 700 },
  ageFactor: { new: 1, mid: 1.25, old: 1.6 },
  coilsExtra: { recent: [0, 0], year: [0.05, 0.1], never: [0.1, 0.2] },
  defaultRate: 0.3,
} as const;
