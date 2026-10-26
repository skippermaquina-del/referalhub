/**
 * Política de privacidad y términos (incluye el programa de mensajes de texto)
 * de Allegiant Appliances Inc, en inglés y español.
 *
 * Es el texto que revisan Twilio y las operadoras al registrar el número. Solo
 * describe lo que el negocio hace: si cambia cómo se usan las llamadas, los
 * mensajes o los datos, hay que actualizar esto y `updated`.
 * Texto de referencia: conviene que lo revise un abogado.
 */
import type { Lang } from "./allegiant";

export type Section = { h: string; p?: string[]; ul?: string[] };
export type Doc = { title: string; updated: string; intro: string; sections: Section[] };

const PHONE = "+1 (323) 578-4010";

export const legalLabels: Record<
  Lang,
  { privacy: string; terms: string; updatedLabel: string; backHome: string; consent: string; smsTerms: string }
> = {
  en: {
    privacy: "Privacy Policy",
    terms: "Terms & SMS Terms",
    updatedLabel: "Last updated",
    backHome: "Back to home",
    smsTerms: "SMS Terms",
    consent:
      "By submitting, you agree that Allegiant Appliances may call or text you at this number about your request. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase.",
  },
  es: {
    privacy: "Política de privacidad",
    terms: "Términos y mensajes de texto",
    updatedLabel: "Última actualización",
    backHome: "Volver al inicio",
    smsTerms: "Términos de mensajes de texto",
    consent:
      "Al enviar, aceptas que Allegiant Appliances te llame o te escriba por mensaje de texto a este número sobre tu solicitud. La frecuencia varía. Pueden aplicar tarifas de mensajes y datos. Responde STOP para dejar de recibirlos o HELP para ayuda. El consentimiento no es condición para comprar.",
  },
};

export const privacy: Record<Lang, Doc> = {
  en: {
    title: "Privacy Policy",
    updated: "October 26, 2026",
    intro:
      "Allegiant Appliances Inc (“Allegiant”, “we”, “us”) repairs and maintains home appliances in the Los Angeles area. This policy explains what information we collect when you visit allegiantappliance.com, request a visit, call us or text us, and how we use and protect it.",
    sections: [
      {
        h: "1. Information we collect",
        p: ["Information you give us:"],
        ul: [
          "Your name and phone number.",
          "The appliance and brand, your ZIP code or address, your preferred time, and a description of the problem, when you fill in our booking form, call us or text us.",
          "The content of text messages you send to us.",
        ],
      },
      {
        h: "",
        p: ["Information collected automatically:"],
        ul: [
          "When you call, the phone number you are calling from, the date and time of the call, and, when a call is answered by our virtual assistant, a recording and a transcript of the call.",
          "When you use the website, technical data such as pages viewed, device and browser type, and approximate location, collected through cookies and similar tools, including Google Analytics and Google Ads tags if we have them turned on.",
        ],
      },
      {
        h: "2. How we use it",
        ul: [
          "To answer your request, call or text you back, schedule and carry out the repair or maintenance.",
          "To send you service messages about your request, such as appointment confirmations, scheduling, callbacks and technician updates.",
          "To keep records of our work, handle payments, warranties and disputes, and meet legal and tax obligations.",
          "To keep our website and phone service working, safe and improving, and to measure whether our advertising reaches people.",
        ],
      },
      {
        h: "3. Phone calls, recordings and our virtual assistant",
        p: [
          "When Vadim cannot answer, your call may be answered by a virtual assistant (an automated voice system, not a person). It will tell you so at the start of the call, and that the call may be recorded. If you do not want to be recorded, tell the assistant and ask for a callback, or hang up and call again later.",
          "Recordings and transcripts are used to take down your request, to check the quality of the service and to resolve disputes. The assistant does not give final prices or confirm appointments; Allegiant confirms those with you directly.",
        ],
      },
      {
        h: "4. Text messages (SMS)",
        p: [
          "We use text messages only to communicate with you about your service request. Details on how our text messaging works, how to opt in and how to opt out are in our Terms, section “SMS Terms”.",
          "We will not share your mobile phone number, or your text-messaging opt-in or consent data, with third parties or affiliates for their marketing or promotional purposes. Text-messaging opt-in data and consent are never shared with any third party, except with the service providers that technically deliver our messages, as described below.",
        ],
      },
      {
        h: "5. Who we share information with",
        p: [
          "We do not sell your personal information. We share it only with:",
        ],
        ul: [
          "Service providers that help us run the business, under their own privacy and security terms, such as website hosting (Vercel), our database (Supabase), phone calls and text messaging (Twilio), our virtual phone assistant (Vapi and the voice, speech-recognition and AI-model providers it uses), and analytics and advertising measurement (Google).",
          "Authorities or other parties when the law requires it, or to protect rights, safety and property.",
          "A buyer or successor, if Allegiant is sold or reorganized.",
        ],
      },
      {
        h: "6. How long we keep it",
        p: [
          "We keep information for as long as we need it for the purposes above, including service, warranty, tax and legal records. After that we delete it or remove what identifies you.",
        ],
      },
      {
        h: "7. Your choices and rights",
        ul: [
          "Text messages: reply STOP to any message to stop receiving them. Reply HELP for help.",
          "You can ask us what information we hold about you, to correct it, or to delete it, by calling us or writing through the booking form.",
          "California residents have the right to know what personal information we collect and why, to ask us to delete or correct it, to opt out of the sale or sharing of personal information (we do not sell it), and not to be treated differently for using these rights. We will answer within the time the law sets.",
          "You can control cookies in your browser and manage Google ad settings in your Google account.",
        ],
      },
      {
        h: "8. Security",
        p: [
          "We use reasonable measures to protect your information. No website, phone system or storage is completely secure, so we cannot guarantee absolute security.",
        ],
      },
      {
        h: "9. Children",
        p: [
          "Our services and website are for adults. We do not knowingly collect information from children under 13.",
        ],
      },
      {
        h: "10. Changes to this policy",
        p: [
          "We may update this policy. The date at the top shows the latest version. If we make important changes, we will make them clear on this page.",
        ],
      },
      {
        h: "11. Contact us",
        p: [
          `Allegiant Appliances Inc, Los Angeles, California. Phone: ${PHONE}. You can also write to us through the booking form on allegiantappliance.com.`,
        ],
      },
    ],
  },
  es: {
    title: "Política de privacidad",
    updated: "26 de octubre de 2026",
    intro:
      "Allegiant Appliances Inc (“Allegiant”, “nosotros”) repara y da mantenimiento a electrodomésticos del hogar en el área de Los Ángeles. Esta política explica qué información recopilamos cuando visitas allegiantappliance.com, pides una visita, nos llamas o nos escribes, y cómo la usamos y protegemos.",
    sections: [
      {
        h: "1. Información que recopilamos",
        p: ["Información que tú nos das:"],
        ul: [
          "Tu nombre y número de teléfono.",
          "El aparato y la marca, tu código postal o dirección, tu horario preferido y la descripción del problema, cuando llenas nuestro formulario, nos llamas o nos escribes.",
          "El contenido de los mensajes de texto que nos envías.",
        ],
      },
      {
        h: "",
        p: ["Información que se recopila automáticamente:"],
        ul: [
          "Cuando llamas, el número desde el que llamas, la fecha y hora y, si atiende nuestro asistente virtual, una grabación y una transcripción de la llamada.",
          "Cuando usas el sitio web, datos técnicos como las páginas vistas, el tipo de dispositivo y navegador y la ubicación aproximada, mediante cookies y herramientas parecidas, incluidas las etiquetas de Google Analytics y Google Ads si las tenemos activadas.",
        ],
      },
      {
        h: "2. Para qué la usamos",
        ul: [
          "Para atender tu solicitud, devolverte la llamada o el mensaje, y programar y hacer la reparación o el mantenimiento.",
          "Para enviarte mensajes de servicio sobre tu solicitud, como confirmaciones de cita, programación, devoluciones de llamada y avisos del técnico.",
          "Para llevar registros de nuestro trabajo, atender pagos, garantías y reclamos, y cumplir obligaciones legales y fiscales.",
          "Para mantener, proteger y mejorar el sitio y el servicio telefónico, y medir si nuestra publicidad llega a las personas.",
        ],
      },
      {
        h: "3. Llamadas, grabaciones y nuestro asistente virtual",
        p: [
          "Cuando Vadim no puede contestar, tu llamada puede ser atendida por un asistente virtual (un sistema de voz automático, no una persona). Te lo dirá al inicio de la llamada, y también que la llamada puede ser grabada. Si no quieres que te graben, díselo al asistente y pide que te devuelvan la llamada, o cuelga y llama más tarde.",
          "Las grabaciones y transcripciones sirven para anotar tu solicitud, revisar la calidad del servicio y resolver reclamos. El asistente no da precios finales ni confirma citas; eso lo confirma Allegiant directamente contigo.",
        ],
      },
      {
        h: "4. Mensajes de texto (SMS)",
        p: [
          "Usamos los mensajes de texto solo para comunicarnos contigo sobre tu solicitud de servicio. Los detalles de cómo funcionan, cómo aceptarlos y cómo dejar de recibirlos están en nuestros Términos, sección “Términos de mensajes de texto”.",
          "No compartiremos tu número de celular, ni los datos de tu aceptación o consentimiento para recibir mensajes de texto, con terceros ni con empresas afiliadas para sus fines de mercadotecnia o promoción. Esos datos nunca se comparten con terceros, salvo con los proveedores que técnicamente entregan nuestros mensajes, como se explica abajo.",
        ],
      },
      {
        h: "5. Con quién compartimos la información",
        p: ["No vendemos tu información personal. La compartimos solo con:"],
        ul: [
          "Proveedores que nos ayudan a operar el negocio, bajo sus propias condiciones de privacidad y seguridad, como el alojamiento del sitio (Vercel), nuestra base de datos (Supabase), las llamadas y mensajes de texto (Twilio), nuestro asistente telefónico virtual (Vapi y los proveedores de voz, reconocimiento de voz y modelos de IA que usa), y la medición de análisis y publicidad (Google).",
          "Autoridades u otras partes cuando la ley lo exige, o para proteger derechos, seguridad y bienes.",
          "Un comprador o sucesor, si Allegiant se vende o se reorganiza.",
        ],
      },
      {
        h: "6. Cuánto tiempo la conservamos",
        p: [
          "Conservamos la información el tiempo que la necesitemos para los fines anteriores, incluidos los registros de servicio, garantía, fiscales y legales. Después la borramos o quitamos lo que te identifica.",
        ],
      },
      {
        h: "7. Tus opciones y derechos",
        ul: [
          "Mensajes de texto: responde STOP a cualquier mensaje para dejar de recibirlos. Responde HELP para pedir ayuda.",
          "Puedes pedirnos qué información tenemos sobre ti, que la corrijamos o que la borremos, llamándonos o escribiendo por el formulario de reserva.",
          "Los residentes de California tienen derecho a saber qué información personal recopilamos y por qué, a pedir que la borremos o corrijamos, a negarse a la venta o al uso compartido de información personal (nosotros no la vendemos) y a no recibir un trato distinto por ejercer estos derechos. Responderemos en el plazo que fije la ley.",
          "Puedes controlar las cookies en tu navegador y administrar la publicidad de Google en tu cuenta de Google.",
        ],
      },
      {
        h: "8. Seguridad",
        p: [
          "Usamos medidas razonables para proteger tu información. Ningún sitio, sistema telefónico o almacenamiento es totalmente seguro, así que no podemos garantizar una seguridad absoluta.",
        ],
      },
      {
        h: "9. Menores de edad",
        p: [
          "Nuestros servicios y nuestro sitio son para adultos. No recopilamos a sabiendas información de menores de 13 años.",
        ],
      },
      {
        h: "10. Cambios en esta política",
        p: [
          "Podemos actualizar esta política. La fecha de arriba indica la versión más reciente. Si hacemos cambios importantes, los haremos visibles en esta página.",
        ],
      },
      {
        h: "11. Contáctanos",
        p: [
          `Allegiant Appliances Inc, Los Ángeles, California. Teléfono: ${PHONE}. También puedes escribirnos por el formulario de reserva en allegiantappliance.com.`,
        ],
      },
    ],
  },
};

export const terms: Record<Lang, Doc> = {
  en: {
    title: "Terms of Service & SMS Terms",
    updated: "October 26, 2026",
    intro:
      "These terms apply when you use allegiantappliance.com or contact Allegiant Appliances Inc (“Allegiant”) by form, phone or text. The SMS Terms in section 7 describe our text-message program.",
    sections: [
      {
        h: "1. Our services",
        p: [
          "Allegiant repairs and maintains home appliances in the Los Angeles area, for homes and businesses. We work Monday to Friday, 9:00 a.m. to 7:00 p.m.; Saturday visits are by special request.",
          "Prices are given after the technician diagnoses the appliance. A request through the website, a phone call, a text or our virtual assistant is not a confirmed appointment; Allegiant confirms the day and time with you directly, and visits depend on availability.",
        ],
      },
      {
        h: "2. Offers",
        p: [
          "Any offer shown on the site, such as the 20% discount on maintenance and repair labor, applies to Allegiant labor as described in the offer, and you claim it by mentioning it when you call or book. Allegiant may change or withdraw an offer at any time.",
        ],
      },
      {
        h: "3. Virtual phone assistant",
        p: [
          "Some calls are answered by an automated assistant that takes down your request. It may make mistakes, and what it says is not a price quote, a diagnosis or a confirmed appointment. Calls may be recorded, as explained in our Privacy Policy.",
          "In an emergency, such as a gas smell, smoke, sparks or flooding, leave the area if it is unsafe and call 911 or your utility. Do not wait for a callback.",
        ],
      },
      {
        h: "4. Using the website",
        p: [
          "The blog and guides are general information, not professional advice, and cannot replace an inspection by a qualified technician. Do not open or repair appliances yourself if you are not qualified; appliances can involve electricity, gas, water and moving parts.",
          "The content and brand of this site belong to Allegiant. You may not copy it for commercial use without permission.",
        ],
      },
      {
        h: "5. Limits of responsibility",
        p: [
          "To the extent the law allows, the site and its information are provided “as is”, and Allegiant is not responsible for indirect or consequential damages arising from using the site. Our responsibility for work we perform is governed by the agreement or estimate you accept for that work. Nothing here limits rights you have under the law that cannot be waived.",
        ],
      },
      {
        h: "6. Governing law",
        p: [
          "These terms are governed by the laws of the State of California, and disputes will be handled in the courts of Los Angeles County, California, unless the law says otherwise.",
        ],
      },
      {
        h: "7. SMS Terms",
        p: [
          "Program: Allegiant Appliances service text messages.",
          "What you will receive: messages about your service request, such as confirming we received it, scheduling and confirming appointments, callbacks, technician arrival and follow-up on the work. We do not send marketing texts under this program.",
          "How you opt in: you opt in when you give us your mobile number on our booking form and agree to be contacted, or when you call or text us and ask us to reach you at that number. Consent to receive texts is not a condition of purchasing any goods or services.",
          "Message frequency varies depending on your request. Message and data rates may apply.",
          `How to opt out: reply STOP to any message at any time, and we will stop texting you. You may get one final message confirming it. For help, reply HELP or call ${PHONE}.`,
          "Carriers and mobile network operators are not liable for delayed or undelivered messages. Messages are not available on every carrier.",
          "Your information is handled as described in our Privacy Policy. We do not share mobile numbers or text-messaging opt-in data with third parties for marketing purposes.",
        ],
      },
      {
        h: "8. Changes and contact",
        p: [
          "We may update these terms; the date above shows the latest version. Questions: call us at " + PHONE + " or write through the booking form on allegiantappliance.com.",
        ],
      },
    ],
  },
  es: {
    title: "Términos de servicio y de mensajes de texto",
    updated: "26 de octubre de 2026",
    intro:
      "Estos términos se aplican cuando usas allegiantappliance.com o contactas a Allegiant Appliances Inc (“Allegiant”) por formulario, teléfono o mensaje de texto. Los Términos de mensajes de texto, en la sección 7, describen nuestro programa de mensajes.",
    sections: [
      {
        h: "1. Nuestros servicios",
        p: [
          "Allegiant repara y da mantenimiento a electrodomésticos del hogar en el área de Los Ángeles, para casas y negocios. Trabajamos de lunes a viernes, de 9:00 a. m. a 7:00 p. m.; las visitas en sábado son solo por solicitud especial.",
          "Los precios se dan después de que el técnico diagnostica el aparato. Una solicitud por el sitio, una llamada, un mensaje o nuestro asistente virtual no es una cita confirmada; Allegiant confirma contigo directamente el día y la hora, y las visitas dependen de la disponibilidad.",
        ],
      },
      {
        h: "2. Ofertas",
        p: [
          "Cualquier oferta publicada en el sitio, como el 20 % de descuento en mantenimiento y mano de obra de reparación, se aplica a la mano de obra de Allegiant según lo descrito en la oferta, y se obtiene mencionándola cuando llamas o reservas. Allegiant puede cambiar o retirar una oferta en cualquier momento.",
        ],
      },
      {
        h: "3. Asistente telefónico virtual",
        p: [
          "Algunas llamadas las atiende un asistente automático que anota tu solicitud. Puede equivocarse, y lo que dice no es una cotización, un diagnóstico ni una cita confirmada. Las llamadas pueden grabarse, como se explica en nuestra Política de privacidad.",
          "En una emergencia, como olor a gas, humo, chispas o inundación, sal del lugar si no es seguro y llama al 911 o a tu compañía de servicios. No esperes una devolución de llamada.",
        ],
      },
      {
        h: "4. Uso del sitio web",
        p: [
          "El blog y las guías son información general, no asesoría profesional, y no sustituyen la revisión de un técnico calificado. No abras ni repares aparatos por tu cuenta si no estás calificado; pueden implicar electricidad, gas, agua y piezas en movimiento.",
          "El contenido y la marca de este sitio pertenecen a Allegiant. No puedes copiarlos para uso comercial sin permiso.",
        ],
      },
      {
        h: "5. Límites de responsabilidad",
        p: [
          "En la medida que la ley lo permita, el sitio y su información se ofrecen “tal cual”, y Allegiant no es responsable de daños indirectos o consecuentes por el uso del sitio. Nuestra responsabilidad por el trabajo que realizamos se rige por el acuerdo o presupuesto que aceptes para ese trabajo. Nada de esto limita derechos que la ley te da y que no se pueden renunciar.",
        ],
      },
      {
        h: "6. Ley aplicable",
        p: [
          "Estos términos se rigen por las leyes del Estado de California, y las disputas se resolverán en los tribunales del condado de Los Ángeles, California, salvo que la ley disponga otra cosa.",
        ],
      },
      {
        h: "7. Términos de mensajes de texto",
        p: [
          "Programa: mensajes de texto de servicio de Allegiant Appliances.",
          "Qué recibirás: mensajes sobre tu solicitud de servicio, como confirmar que la recibimos, programar y confirmar citas, devoluciones de llamada, llegada del técnico y seguimiento del trabajo. Este programa no envía mensajes de publicidad.",
          "Cómo aceptas: aceptas cuando nos das tu número de celular en nuestro formulario de reserva y estás de acuerdo en que te contactemos, o cuando nos llamas o escribes y nos pides que te contactemos en ese número. Aceptar recibir mensajes no es condición para comprar ningún bien ni servicio.",
          "La frecuencia de los mensajes varía según tu solicitud. Pueden aplicar tarifas de mensajes y datos.",
          `Cómo dejar de recibirlos: responde STOP a cualquier mensaje en cualquier momento y dejaremos de escribirte. Puedes recibir un último mensaje que lo confirme. Para ayuda, responde HELP o llama al ${PHONE}.`,
          "Las operadoras y los proveedores de redes móviles no son responsables por mensajes retrasados o no entregados. Los mensajes no están disponibles en todas las operadoras.",
          "Tu información se maneja como se describe en nuestra Política de privacidad. No compartimos números de celular ni datos de aceptación de mensajes con terceros para fines de mercadotecnia.",
        ],
      },
      {
        h: "8. Cambios y contacto",
        p: [
          "Podemos actualizar estos términos; la fecha de arriba indica la versión más reciente. Preguntas: llámanos al " + PHONE + " o escríbenos por el formulario de reserva en allegiantappliance.com.",
        ],
      },
    ],
  },
};
