/**
 * Registro de inquilinos de la plataforma.
 *
 * Cada negocio que corre sobre este código —Allegiant, SuperHman y los que
 * vengan— es un inquilino. Todo lo que cambia entre uno y otro vive acá: la
 * marca, a quién se le avisa, con qué número contesta el agente de voz, en qué
 * estado opera (que decide el texto legal) y cómo se llama la cosa que se
 * arregla.
 *
 * ## Convención de variables de entorno
 *
 * `<INQUILINO>_<CLAVE>`, en mayúsculas: `ALLEGIANT_NOTIFY_EMAIL`,
 * `SUPERHMAN_OWNER_PHONE`. No es una convención nueva: es la que ya usaba
 * Allegiant, formalizada. Por eso ninguna variable existente hay que renombrarla
 * en Vercel para que esto siga funcionando.
 *
 * Las claves que antes no llevaban prefijo (`TWILIO_VADIM_PHONE`,
 * `VAPI_WEBHOOK_SECRET`) se leen primero con prefijo y, si no están, con el
 * nombre viejo. Así el despliegue no rompe nada y la migración se puede hacer
 * variable por variable.
 *
 * Twilio (SID, token y número emisor) sigue siendo compartido: es una sola
 * cuenta que manda por todos.
 */

export type Lang = "en" | "es";

/** Estado donde opera el negocio. Decide el texto de consentimiento del agente. */
export type UsState = "CA" | "FL";

export type TenantId = "allegiant" | "superhman";

export type Tenant = {
  id: TenantId;
  /** Razón social, para textos legales. */
  name: string;
  /** Cómo se nombra al negocio en un SMS o un asunto de correo. */
  shortName: string;
  /** Nombre del asistente de voz. Es una variable, no una constante global. */
  assistantName: string;
  /** Dueño del negocio: a quién se le avisa, por nombre. */
  ownerName: string;
  state: UsState;
  langs: Lang[];
  /** Oficio, en inglés, para el prompt del agente. */
  trade: string;
  /** Servicios que sí presta. Alimenta el prompt del agente. */
  services: string[];
  /** Zona de cobertura, en una línea. */
  serviceArea: string;
  /** Horario, en una línea legible por el agente. */
  hours: string;
  /**
   * Cómo se llama en la ficha lo que hay que arreglar. La columna de la base
   * se sigue llamando `appliance` por historia; la etiqueta cambia por negocio.
   */
  itemLabel: string;
  /** Número con el que contesta el agente de voz, en E.164. Rutea las llamadas entrantes. */
  agentPhone: string | null;
  /** URL absoluta del panel, para el pie de los avisos. */
  adminUrl: string;
};

/**
 * Aviso de grabación y de que no es una persona.
 *
 * California (Penal Code 632 y 632.7) y Florida (F.S. 934.03) exigen el
 * consentimiento de las dos partes. Las dos redacciones dicen lo mismo porque
 * el requisito es el mismo; se mantienen separadas para poder ajustar una sola
 * si algún estado agrega un requisito propio.
 *
 * Esto NO es opcional y no se quita por inquilino: va al principio de cada
 * llamada. California da acción civil privada con daños estatutarios por
 * violación, así que el costo de omitirlo se multiplica por llamada.
 */
export const CONSENT_LINE: Record<UsState, Record<Lang, string>> = {
  CA: {
    en: "Hi, this is an automated assistant, and this call may be recorded. If you would rather not be recorded, just let me know and I will arrange a callback.",
    es: "Hola, soy un asistente automático y esta llamada puede ser grabada. Si prefiere que no se grabe, dígamelo y coordino que le devuelvan el llamado.",
  },
  FL: {
    en: "Hi, this is an automated assistant, and this call may be recorded. If you would rather not be recorded, just let me know and I will arrange a callback.",
    es: "Hola, soy un asistente automático y esta llamada puede ser grabada. Si prefiere que no se grabe, dígamelo y coordino que le devuelvan el llamado.",
  },
};

const TENANTS: Record<TenantId, Tenant> = {
  allegiant: {
    id: "allegiant",
    name: "Allegiant Appliances Inc",
    shortName: "Allegiant",
    assistantName: "Jessica",
    ownerName: "Vadim",
    state: "CA",
    langs: ["en", "es"],
    trade: "appliance repair",
    services: [
      "refrigerators",
      "washers and dryers",
      "dishwashers",
      "ovens and ranges",
      "microwaves",
    ],
    serviceArea: "the Los Angeles area",
    hours: "Monday to Friday, 9am to 7pm. Saturdays by special request.",
    itemLabel: "Appliance",
    agentPhone: "+18555171764",
    adminUrl: "https://allegiantappliance.com/allegiant/admin",
  },
  superhman: {
    id: "superhman",
    name: "SuperHman Handyman",
    shortName: "SuperHman",
    // Nombre propio: a un negocio local se le vende mejor "tu recepcionista"
    // que "la asistente de la plataforma".
    assistantName: "Carmen",
    ownerName: "Andy",
    state: "FL",
    langs: ["en", "es"],
    trade: "handyman work",
    // Sin plomería ni electricidad: son oficios con licencia bajo el Capítulo
    // 489 de Florida, y anunciarlos anula la exención de los $2,500.
    services: [
      "TV mounting",
      "drywall patching and painting",
      "doors that stick or will not close",
      "furniture assembly",
      "shelves, curtains and mirrors hung",
    ],
    serviceArea: "Broward, Miami-Dade and Boca Raton",
    hours: "Monday to Saturday, 8am to 6pm.",
    itemLabel: "Job",
    agentPhone: "+18888970636",
    adminUrl: "https://allegiantappliance.com/superhman/admin",
  },
};

export const TENANT_IDS = Object.keys(TENANTS) as TenantId[];

export function isTenantId(value: unknown): value is TenantId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(TENANTS, value);
}

/** El inquilino, o `null` si el id no existe. Nunca tira. */
export function getTenant(id: unknown): Tenant | null {
  return isTenantId(id) ? TENANTS[id] : null;
}

/** Solo dígitos, para comparar teléfonos sin pelear con el formato. */
function digits(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Qué inquilino contesta en ese número. Lo usa el webhook de Vapi para saber
 * de quién es la llamada sin que el agente tenga que declararlo.
 */
export function tenantByAgentPhone(phone: unknown): Tenant | null {
  if (typeof phone !== "string") return null;
  const wanted = digits(phone);
  if (wanted.length < 7) return null;
  return (
    TENANT_IDS.map((id) => TENANTS[id]).find(
      (t) => t.agentPhone !== null && digits(t.agentPhone) === wanted,
    ) ?? null
  );
}

/**
 * Variable de entorno del inquilino: primero `<INQUILINO>_<CLAVE>`, y si no
 * está, el nombre viejo sin prefijo que se le pase en `legacy`.
 */
export function tenantEnv(tenant: Tenant, key: string, legacy?: string): string | undefined {
  const own = process.env[`${tenant.id.toUpperCase()}_${key}`];
  if (own && own.trim() !== "") return own;
  if (legacy) {
    const old = process.env[legacy];
    if (old && old.trim() !== "") return old;
  }
  return undefined;
}

/** Celular del dueño para los SMS. Allegiant sigue leyendo `TWILIO_VADIM_PHONE`. */
export function ownerPhone(tenant: Tenant): string | undefined {
  return tenantEnv(tenant, "OWNER_PHONE", tenant.id === "allegiant" ? "TWILIO_VADIM_PHONE" : undefined);
}

/**
 * El asistente plantilla de Vapi: uno solo, con el prompt lleno de `{{...}}`.
 *
 * No es un secreto, es un identificador, así que vive acá y no en una variable
 * de entorno: un paso menos de configuración. `<INQUILINO>_VAPI_ASSISTANT_ID` o
 * `VAPI_ASSISTANT_ID` lo pisan si hace falta — por ejemplo para probar un
 * asistente nuevo sin tocar el código.
 */
export const TEMPLATE_ASSISTANT_ID = "1d7a8f41-259c-4b82-8f5e-1b5e1e2de753";

/** Secreto del webhook de voz. Si el inquilino no tiene el suyo, usa el compartido. */
export function vapiSecret(tenant: Tenant): string | undefined {
  return tenantEnv(tenant, "VAPI_WEBHOOK_SECRET", "VAPI_WEBHOOK_SECRET");
}
