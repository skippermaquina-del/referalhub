/**
 * Modelo de precios de SuperHman.
 *
 * Los precios base salen del volante de puerta, que ya está impreso: son el
 * «desde». Los recargos de cada opción los puse yo como punto de partida
 * razonable y Andy los tiene que ajustar con los primeros trabajos reales —
 * por eso están acá arriba, en un solo lugar, y no desparramados en la UI.
 *
 * Lo que mueve el precio en este oficio no es la hora: es la condición que no
 * se ve en la foto. Pared de concreto en vez de drywall, un TV de 75 pulgadas
 * en vez de 50, tres parches en vez de uno. Por eso el modelo pregunta eso y
 * no «cuántas horas te lleva».
 *
 * Algunas opciones llevan `warn`: son las que tocan trabajo con licencia o
 * riesgo real. No bloquean la cotización, la marcan — la decisión es de Andy,
 * pero no la toma sin verla.
 */

export type Lang = "en" | "es" | "ru";

export type Option = {
  id: string;
  label: string;
  /** Recargo fijo en dólares. */
  delta?: number;
  /** Multiplicador sobre el subtotal. Se aplica después de los deltas. */
  mult?: number;
  /** Aviso para Andy. No frena nada; se muestra en rojo. */
  warn?: string;
  /**
   * Trabajo que no hay que tomar: con licencia ajena o con un riesgo que
   * primero hay que descartar. A diferencia de `warn`, esto sí frena: el
   * cotizador no deja copiar un mensaje con precio para el cliente.
   */
  block?: true;
  /**
   * Una foto alcanza para contestar esto. Es la lista blanca de lo que la IA
   * puede llegar a sugerir, y se respeta en el servidor, no en el prompt.
   *
   * El tipo de pared no está marcado a propósito: pintados, el drywall y el
   * bloque se ven idénticos, y esa opción es la que más mueve el precio. Una
   * IA igual va a contestar algo, porque siempre contesta algo. Eso se
   * pregunta.
   */
  fromPhoto?: true;
};

export type Choice = {
  id: string;
  label: string;
  /** Varias a la vez (casillas) en vez de una sola (opciones). */
  multiple?: boolean;
  /**
   * Mostrar este grupo solo si otro ya tiene cierto valor.
   *
   * No es cosmético. Un grupo que no viene al caso igual aporta su opción por
   * defecto, con su recargo y su aviso: ajustar unas bisagras terminaba
   * mostrando el aviso de cómo rellenar un agujero. Avisos que no
   * corresponden enseñan a no leer los avisos, y entre ellos están los que
   * frenan un trabajo con licencia.
   */
  showIf?: { choice: string; in: string[] };
  options: Option[];
};

export type Job = {
  id: string;
  label: string;
  /** Cómo se nombra el trabajo en el mensaje al cliente. */
  name: Record<Lang, string>;
  base: number;
  /** Se cobra por unidad: el precio base se multiplica por la cantidad. */
  perUnit?: { label: string; max: number };
  choices: Choice[];
};

/** Nadie maneja por menos de esto. Es la regla del protocolo. */
export const MINIMO = 120;

/** Los precios se redondean a múltiplos de esto: un número redondo se discute menos. */
export const REDONDEO = 5;

/**
 * Cuánto cuesta cada pieza después de la primera.
 *
 * Colgar cuatro estantes no es cuatro veces colgar uno: el viaje, sacar las
 * herramientas, tapar el piso y medir se pagan una sola vez. Multiplicar el
 * precio entero por la cantidad da números que ningún cliente acepta y que
 * además son injustos. La primera pieza va completa y las siguientes al 60%.
 */
export const REPETICION = 0.6;

const PARED: Choice = {
  id: "pared",
  label: "Tipo de pared",
  options: [
    { id: "drywall", label: "Drywall con montantes", delta: 0 },
    { id: "metal", label: "Montantes de metal", delta: 15 },
    // En el sur de Florida muchísimas paredes exteriores e interiores son de
    // bloque. Es taladro de percusión, brocas de mampostería y el doble de tiempo.
    { id: "concreto", label: "Concreto o bloque", delta: 45 },
    { id: "nosabe", label: "No sé todavía", delta: 0, warn: "Confirmalo antes de dar el precio: concreto cambia el número." },
  ],
};

export const JOBS: Job[] = [
  {
    id: "tv",
    label: "Colgar TV",
    name: { en: "TV mounted on the wall", es: "TV montado en la pared", ru: "Установка телевизора" },
    base: 150,
    choices: [
      {
        id: "tamano",
        label: "Tamaño del TV",
        options: [
          { id: "s", fromPhoto: true, label: "Hasta 50\"", delta: 0 },
          { id: "m", fromPhoto: true, label: "50 a 65\"", delta: 25 },
          { id: "l", fromPhoto: true, label: "Más de 65\"", delta: 60, warn: "Arriba de 65\" suele hacer falta otra persona para levantarlo." },
        ],
      },
      PARED,
      {
        id: "soporte",
        label: "Soporte",
        options: [
          { id: "tiene", label: "El cliente lo tiene", delta: 0 },
          { id: "compro", label: "Lo compro yo", delta: 0, warn: "El soporte lo paga el cliente aparte, con recibo. No lo incluyas en el precio." },
        ],
      },
      {
        id: "extras",
        label: "Extras",
        multiple: true,
        options: [
          { id: "cables", label: "Esconder cables HDMI en la pared", delta: 90 },
          { id: "chimenea", fromPhoto: true, label: "Arriba de la chimenea", delta: 70, warn: "Casi siempre es concreto y queda alto: confirmá el tipo de pared." },
          { id: "soundbar", fromPhoto: true, label: "Barra de sonido también", delta: 45 },
          { id: "tomacorriente", block: true, label: "Mover el tomacorriente adentro de la pared", delta: 0, warn: "NO. Eso es trabajo eléctrico con licencia (Cap. 489). Pasale un electricista." },
        ],
      },
    ],
  },
  {
    id: "pared",
    label: "Parchar y pintar pared",
    name: { en: "Drywall patched and painted", es: "Pared parchada y pintada", ru: "Заделка и покраска стены" },
    base: 120,
    perUnit: { label: "Cantidad de parches", max: 8 },
    choices: [
      {
        id: "tamano",
        label: "Tamaño del agujero",
        options: [
          { id: "s", fromPhoto: true, label: "Chico, hasta 15 cm", delta: 0 },
          { id: "m", fromPhoto: true, label: "Mediano, hasta 40 cm", delta: 35 },
          { id: "l", fromPhoto: true, label: "Grande, necesita refuerzo atrás", delta: 80 },
        ],
      },
      {
        id: "pintura",
        label: "Pintura",
        options: [
          { id: "tiene", label: "El cliente tiene la pintura", delta: 0 },
          { id: "match", label: "Hay que igualar el color", delta: 40, warn: "Igualar color nunca sale perfecto. Avisalo antes, por escrito." },
          { id: "pared", label: "Pintar la pared entera", delta: 110 },
        ],
      },
      {
        id: "textura",
        label: "Textura",
        options: [
          { id: "lisa", fromPhoto: true, label: "Lisa", delta: 0 },
          { id: "knockdown", fromPhoto: true, label: "Knockdown o naranja", delta: 30 },
          { id: "popcorn", fromPhoto: true, block: true, label: "Popcorn en el techo", delta: 45, warn: "Si la casa es anterior a 1980, el popcorn puede tener asbesto. No lo lijes ni lo raspes: mandalo a analizar." },
        ],
      },
    ],
  },
  {
    id: "puerta",
    label: "Arreglar puerta",
    name: { en: "Door repair", es: "Arreglo de la puerta", ru: "Ремонт двери" },
    base: 90,
    choices: [
      {
        id: "que",
        label: "Qué hay que hacer",
        options: [
          { id: "ajuste", label: "Ajustar bisagras o cepillar", delta: 0 },
          { id: "herrajes", label: "Cambiar picaporte o cerradura", delta: 35 },
          { id: "recolgar", label: "Descolgar y volver a colgar", delta: 60 },
          { id: "marco", fromPhoto: true, label: "El marco está fuera de escuadra", delta: 95, warn: "Marco torcido puede ser asentamiento de la casa. Mirá bien antes de prometer que cierra." },
          { id: "agujero", fromPhoto: true, label: "Agujero o golpe en la hoja", delta: 85, warn: "Va a quedar visible con luz rasante: decilo POR ESCRITO antes de empezar. Y lleva dos visitas, porque la espuma y la masilla tienen que secar." },
          { id: "cambiarhoja", label: "Cambiar la hoja entera", delta: 150, warn: "Medí alto, ancho y espesor, y de qué lado abre. Fijate si la hoja nueva viene con los huecos del picaporte y las bisagras hechos: si no, es otra hora de trabajo." },
        ],
      },
      {
        id: "tipo",
        label: "Tipo de puerta",
        options: [
          { id: "interior", fromPhoto: true, label: "Interior", delta: 0 },
          { id: "exterior", fromPhoto: true, label: "Exterior", delta: 40 },
          { id: "corrediza", fromPhoto: true, label: "Corrediza de vidrio", delta: 70, warn: "Las corredizas pesan muchísimo. No la levantes solo." },
        ],
      },
      {
        id: "relleno",
        label: "Hueca o maciza",
        showIf: { choice: "que", in: ["agujero", "cambiarhoja"] },
        options: [
          { id: "hueca", fromPhoto: true, label: "Hueca (panel moldeado)", delta: 0, warn: "Hueca: adentro hay aire y cartón. Si la tapás, primero rellenás la cavidad (espuma o un refuerzo) y dejás curar, porque la masilla no se agarra de nada. Si la cambiás, la hoja sale $40-80 y queda perfecta: decile las dos opciones." },
          { id: "maciza", fromPhoto: true, label: "Maciza o de madera", delta: 40, warn: "Maciza: la masilla tiene de dónde agarrarse, pero el color de la madera no se iguala. Si está barnizada y no pintada, avisale que se va a ver." },
          { id: "nose", label: "No sé todavía", delta: 0, warn: "Golpeala con el nudillo: si suena a tambor es hueca. Confirmalo antes de dar el precio." },
        ],
      },
    ],
  },
  {
    id: "muebles",
    label: "Armar muebles",
    name: { en: "Furniture assembled", es: "Muebles armados", ru: "Сборка мебели" },
    base: 120,
    perUnit: { label: "Cantidad de muebles", max: 10 },
    choices: [
      {
        id: "complejidad",
        label: "Qué es",
        options: [
          { id: "simple", fromPhoto: true, label: "Mesa de luz, silla, estantería chica", delta: 0 },
          { id: "medio", fromPhoto: true, label: "Cómoda, escritorio, cama", delta: 40 },
          { id: "grande", fromPhoto: true, label: "Placard, ropero, modular grande", delta: 110, warn: "Un ropero grande puede llevar medio día. Cotizá por tiempo, no por pieza." },
        ],
      },
      {
        id: "extras",
        label: "Extras",
        multiple: true,
        options: [
          { id: "anclar", label: "Anclar a la pared (antivuelco)", delta: 25 },
          { id: "sacar", label: "Sacar y llevarse el embalaje", delta: 30 },
        ],
      },
    ],
  },
  {
    id: "colgar",
    label: "Colgar estantes, cortinas, espejos",
    name: { en: "Shelves, curtains and mirrors hung", es: "Estantes, cortinas y espejos colgados", ru: "Полки, карнизы и зеркала" },
    base: 100,
    perUnit: { label: "Cuántas piezas", max: 12 },
    choices: [
      PARED,
      {
        id: "que",
        label: "Qué es",
        options: [
          { id: "liviano", fromPhoto: true, label: "Cuadro, espejo chico, cortina", delta: 0 },
          { id: "estante", fromPhoto: true, label: "Estante flotante", delta: 20 },
          { id: "pesado", fromPhoto: true, label: "Espejo grande o estante cargado", delta: 45, warn: "Arriba de 25 kg tiene que ir a montante o anclaje de carga. No confíes en el tarugo de plástico." },
        ],
      },
    ],
  },
  {
    id: "focos",
    label: "Cambiar focos y luces",
    name: { en: "Light bulbs replaced", es: "Focos cambiados", ru: "Замена лампочек" },
    base: 70,
    perUnit: { label: "Cuántas luces", max: 20 },
    choices: [
      {
        id: "que",
        label: "Qué hay que hacer",
        options: [
          { id: "bombilla", fromPhoto: true, label: "Solo cambiar la bombilla", delta: 0 },
          { id: "bombillas", label: "Bombillas que compro yo", delta: 20, warn: "Las bombillas las paga el cliente aparte, con recibo. Sacale foto al zócalo antes de ir a comprarlas." },
          {
            id: "artefacto",
            fromPhoto: true,
            block: true,
            label: "Cambiar o colgar el artefacto de luz",
            delta: 0,
            warn: "NO. Cambiar un artefacto es contratación eléctrica (Cap. 489, Parte II) y la exención de trabajo menor NO la cubre: ahí no hay monto chico que te salve. Pasale un electricista.",
          },
          {
            id: "falta",
            fromPhoto: true,
            block: true,
            label: "Falta un artefacto entero (base vacía)",
            delta: 0,
            warn: "NO. Colgar el artefacto que falta es trabajo eléctrico, igual que cambiarlo. Pasale un electricista.",
          },
        ],
      },
      {
        id: "altura",
        label: "A qué altura",
        options: [
          { id: "normal", fromPhoto: true, label: "Se llega con escalera chica", delta: 0 },
          { id: "alto", fromPhoto: true, label: "Techo alto o escalera grande", delta: 40, warn: "Techo alto con escalera grande: no vayas solo si tenés que estirarte." },
          { id: "colgante", fromPhoto: true, label: "Colgante sobre barra o mesada", delta: 25, warn: "Arriba de una mesada de piedra, tapala. Un foco que cae la pica." },
        ],
      },
    ],
  },
  {
    id: "plomeria",
    label: "Plomería menor",
    name: { en: "Minor plumbing repair", es: "Arreglo de plomería", ru: "Мелкий сантехнический ремонт" },
    base: 110,
    choices: [
      {
        id: "que",
        label: "Qué hay que hacer",
        options: [
          { id: "junta", label: "Junta, O-ring o cartucho de canilla", delta: 0 },
          { id: "aireador", label: "Aireador o cabezal de ducha", delta: 0 },
          { id: "flexible", label: "Manguera flexible de alimentación", delta: 15, warn: "Cerrá las llaves de paso y probá que cierren de verdad ANTES de desarmar nada." },
          { id: "inodoro", label: "Herrajes del inodoro (flotante, sapito)", delta: 20 },
          { id: "canilla", label: "Cambiar la canilla entera", delta: 60, warn: "Canilla entera: confirmá que las llaves de paso cierren, y que abajo del bacha haya lugar para la llave." },
          { id: "destapar", label: "Destapar un desagüe", delta: 40, warn: "Destapar con chupón o sonda de mano está bien. Si hay que sacar el inodoro o abrir el sifón de pared, ya no." },
          {
            id: "caneria",
            block: true,
            label: "Mover o agregar cañería",
            delta: 0,
            warn: "NO. La exención cubre reparaciones menores, no líneas nuevas ni mover cañería. Eso es plomería con licencia.",
          },
          {
            id: "abrirpared",
            block: true,
            label: "Hay que abrir la pared o el piso",
            delta: 0,
            warn: "NO. Si hay que abrir para llegar al caño, ya no es una reparación menor. Pasale un plomero.",
          },
          {
            id: "calefon",
            block: true,
            label: "Calentador de agua",
            delta: 0,
            warn: "NO. Lleva permiso, y lo que lleva permiso necesita licencia aunque salga barato.",
          },
        ],
      },
      {
        id: "estado",
        label: "Cómo está",
        options: [
          { id: "sano", fromPhoto: true, label: "Se ve sano", delta: 0 },
          { id: "oxido", fromPhoto: true, label: "Hay óxido o verdín en las bases", delta: 35, warn: "Las tuercas oxidadas se parten. Llevá repuestos y avisale al cliente ANTES de empezar que puede aparecer más trabajo." },
          { id: "viejo", fromPhoto: true, label: "Instalación vieja, todo duro", delta: 45, warn: "Instalación vieja: una llave de paso que no cerró en 20 años puede no cerrar hoy. Si gotea, parás y llamás al plomero." },
        ],
      },
    ],
  },
];

/** Recargos que aplican a cualquier trabajo. */
export const GLOBALES: Choice[] = [
  {
    id: "zona",
    label: "Zona",
    options: [
      { id: "broward", label: "Broward", delta: 0 },
      { id: "dade", label: "Miami-Dade norte", delta: 20 },
      { id: "boca", label: "Boca Raton", delta: 25 },
      { id: "lejos", label: "Más lejos", delta: 50, warn: "Arriba de 45 minutos, el viaje se come la ganancia. Cotizá alto o pasá." },
    ],
  },
  {
    id: "acceso",
    label: "Acceso",
    multiple: true,
    options: [
      { id: "sinascensor", label: "Piso alto sin ascensor", delta: 35 },
      { id: "condo", label: "Condominio con reserva de ascensor y seguro", delta: 40, warn: "Muchos condos exigen certificado de seguro para dejarte trabajar. Preguntá antes de agendar." },
    ],
  },
  {
    id: "urgencia",
    label: "Urgencia",
    options: [
      { id: "normal", label: "Esta semana", mult: 1 },
      { id: "rapido", label: "En 48 horas", mult: 1.15 },
      { id: "hoy", label: "Hoy o mañana", mult: 1.3 },
    ],
  },
];

export type Seleccion = Record<string, string | string[]>;

export type Resultado = {
  total: number;
  base: number;
  cantidad: number;
  lineas: { label: string; delta: number }[];
  multiplicador: { label: string; mult: number } | null;
  avisos: string[];
  /** True si el total lo levantó el mínimo y no el trabajo. */
  tocoMinimo: boolean;
  /** True si alguna opción elegida es trabajo que no hay que tomar. */
  bloqueado: boolean;
};

/** ¿Este grupo viene al caso con lo que hay elegido? */
export function grupoVisible(choice: Choice, sel: Seleccion): boolean {
  if (!choice.showIf) return true;
  const valor = sel[choice.showIf.choice];
  const actuales = Array.isArray(valor) ? valor : [valor];
  return actuales.some((v) => typeof v === "string" && choice.showIf!.in.includes(v));
}

function opcionesElegidas(choices: Choice[], sel: Seleccion): Option[] {
  const out: Option[] = [];
  for (const c of choices) {
    if (!grupoVisible(c, sel)) continue;
    const v = sel[c.id];
    if (v === undefined) continue;
    const ids = Array.isArray(v) ? v : [v];
    for (const id of ids) {
      const o = c.options.find((x) => x.id === id);
      if (o) out.push(o);
    }
  }
  return out;
}

export function cotizar(job: Job, sel: Seleccion, cantidad = 1): Resultado {
  const n = job.perUnit ? Math.max(1, Math.min(cantidad, job.perUnit.max)) : 1;
  const elegidas = [...opcionesElegidas(job.choices, sel), ...opcionesElegidas(GLOBALES, sel)];

  // Los recargos globales (viaje, acceso) se cobran una sola vez: manejás una
  // vez y subís la escalera una vez. Los del trabajo sí escalan, pero con la
  // repetición aplicada a partir de la segunda pieza.
  const globalIds = new Set(GLOBALES.flatMap((c) => c.options.map((o) => o.id)));
  /** 1 pieza = 1. 4 piezas = 1 + 3 × 0,6 = 2,8. */
  const factor = 1 + (n - 1) * REPETICION;

  let subtotal = job.base * factor;
  const lineas: { label: string; delta: number }[] = [];

  for (const o of elegidas) {
    if (!o.delta) continue;
    const esGlobal = globalIds.has(o.id);
    const monto = esGlobal ? o.delta : o.delta * factor;
    subtotal += monto;
    lineas.push({
      label: !esGlobal && n > 1 ? `${o.label} (${n} piezas)` : o.label,
      delta: Math.round(monto),
    });
  }

  const conMult = elegidas.find((o) => o.mult && o.mult !== 1);
  if (conMult?.mult) subtotal *= conMult.mult;

  const redondeado = Math.round(subtotal / REDONDEO) * REDONDEO;
  const total = Math.max(redondeado, MINIMO);

  return {
    total,
    base: Math.round(job.base * factor),
    cantidad: n,
    lineas,
    multiplicador: conMult?.mult ? { label: conMult.label, mult: conMult.mult } : null,
    avisos: elegidas.map((o) => o.warn).filter((w): w is string => Boolean(w)),
    tocoMinimo: redondeado < MINIMO,
    bloqueado: elegidas.some((o) => o.block),
  };
}

/**
 * Lo que se le contesta al cliente cuando el trabajo no hay que tomarlo.
 *
 * Decir que no también es una respuesta, y queda mejor dicha a tiempo que
 * después de romper algo. Sirve igual para el trabajo eléctrico con licencia
 * y para el popcorn que puede tener asbesto: en los dos casos va un
 * especialista, no él.
 */
export function mensajeNoTomo(lang: Lang): string {
  if (lang === "es") {
    return `Hola. Esa parte no la puedo tomar: necesita un especialista con licencia.\n\nTe lo digo antes y no después, porque hacerlo mal te sale mucho más caro. Si querés te paso un contacto de confianza.\n\nEl resto del trabajo sí lo puedo hacer, avisame.`;
  }
  if (lang === "ru") {
    return `Здравствуйте. Эту часть я взять не могу: нужен специалист с лицензией.\n\nГоворю сразу, а не потом, — сделать плохо обойдётся вам дороже. Если хотите, дам контакт проверенного мастера.\n\nОстальную работу сделать могу, напишите мне.`;
  }
  return `Hi. I can't take that part — it needs a licensed specialist.\n\nI'd rather tell you now than after something goes wrong. I'm happy to pass you someone I trust.\n\nThe rest of the job I can do, just let me know.`;
}

/** El mensaje que se le manda al cliente. Es el paso 4 del protocolo. */
export function mensaje(job: Job, r: Resultado, lang: Lang): string {
  if (r.bloqueado) return mensajeNoTomo(lang);
  const nombre = job.name[lang];
  const q = r.cantidad > 1 ? `${r.cantidad}× ` : "";
  if (lang === "es") {
    return `Hola, te paso el precio.\n\n${q}${nombre}: $${r.total}\n\nIncluye el trabajo y los materiales chicos. Si al llegar el trabajo resulta más grande de lo que se ve en la foto, te aviso y lo hablamos antes de empezar — no te lo cobro sin avisarte.\n\n¿Te viene bien que pase esta semana?`;
  }
  if (lang === "ru") {
    return `Здравствуйте! Вот цена.\n\n${q}${nombre}: $${r.total}\n\nВключая работу и мелкие материалы. Если на месте окажется больше работы, чем видно на фото, я сначала скажу вам и мы обсудим — ничего не делаю без согласования.\n\nПодойдёт, если приеду на этой неделе?`;
  }
  return `Hi, here's the price.\n\n${q}${nombre}: $${r.total}\n\nThat covers the work and small materials. If it turns out bigger than the photo showed, I'll tell you and we agree on it before I start — I never add to the bill without asking first.\n\nDoes this week work for you?`;
}

/**
 * ¿Puede la IA sugerir esta opción mirando una foto?
 *
 * Busca la opción de verdad dentro del trabajo, en vez de confiar en una
 * lista de ids sueltos: los ids se repiten entre trabajos ("s", "m" y "l"
 * están en el tamaño del TV y en el del agujero), así que una lista plana
 * dejaría pasar una sugerencia del trabajo equivocado.
 *
 * Los globales (zona, acceso, urgencia) nunca entran: no están en la foto.
 */
export function puedeSugerir(job: Job, choiceId: string, optionId: string): boolean {
  const choice = job.choices.find((c) => c.id === choiceId);
  return Boolean(choice?.options.find((o) => o.id === optionId)?.fromPhoto);
}
