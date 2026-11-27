/**
 * Textos legales de SuperHman.
 *
 * La diferencia deliberada con `allegiant-legal.ts`: esta política SÍ
 * contempla pasarle la solicitud a otro profesional. Allegiant promete lo
 * contrario, y por eso sus leads no se pueden derivar ni vender sin incumplir
 * su propia política publicada.
 *
 * La distinción que hay que mantener, porque son dos cosas distintas:
 *
 *  - Pasarle los datos de la persona a un profesional con licencia PARA HACER
 *    el trabajo que esa persona pidió: permitido, y declarado acá y en el
 *    formulario.
 *  - Vender o ceder el consentimiento de SMS para que otros hagan marketing:
 *    NO, nunca. Las operadoras lo exigen para el registro A2P 10DLC y es la
 *    frase que no se toca.
 *
 * Esto es un borrador de trabajo, no asesoramiento legal. Antes de que el
 * negocio de derivación mueva dinero de verdad, que lo lea un abogado de
 * Florida.
 */

import type { Lang } from "@/data/superhman";

type Section = { h: string; p: string[] };

export const legalLabels: Record<Lang, { smsOptIn: string; callNote: string; privacy: string; referral: string }> = {
  en: {
    smsOptIn:
      "Optional: text me updates about my request at this number. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase.",
    callNote: "By sending this you agree I may call or text you about this request.",
    privacy: "Privacy",
    referral:
      "If your job needs a licensed trade I do not perform, I may pass your request and contact details to a licensed professional so they can contact you about it.",
  },
  es: {
    smsOptIn:
      "Opcional: envíenme mensajes de texto sobre mi solicitud a este número. La frecuencia varía. Pueden aplicar tarifas de mensajes y datos. Responda STOP para dejar de recibirlos o HELP para ayuda. El consentimiento no es condición para contratar.",
    callNote: "Al enviar esto aceptás que te llame o te escriba por esta solicitud.",
    privacy: "Privacidad",
    referral:
      "Si tu trabajo necesita un oficio con licencia que yo no hago, puedo pasarle tu solicitud y tus datos de contacto a un profesional con licencia para que te contacte por ese trabajo.",
  },
};

export const privacy: Record<Lang, { title: string; updated: string; intro: string; sections: Section[] }> = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: November 2026",
    intro:
      "This policy explains what SuperHman Handyman collects when you contact us, what we do with it, and what we never do with it.",
    sections: [
      {
        h: "1. What we collect",
        p: [
          "When you fill in the form or send a message: your name, your phone number, what you need done, your ZIP code, the time that suits you, and anything you write in the notes.",
          "When you call, the phone number you are calling from, and the date and time of the call. If a call is answered by a virtual assistant, a recording and a transcript of the call.",
          "We do not ask for, and do not want, your payment card details, your social security number, or any identity document through this website.",
        ],
      },
      {
        h: "2. What we use it for",
        p: [
          "To call you back, give you a price, and do the work you asked for.",
          "To keep records of our work, handle warranties and disputes, and meet legal and tax obligations.",
        ],
      },
      {
        h: "3. Phone calls, recordings and our virtual assistant",
        p: [
          "When we cannot answer, your call may be answered by a virtual assistant — an automated voice system, not a person. It will tell you so at the start of the call, and that the call may be recorded.",
          "Florida law requires the consent of everyone on the call before it is recorded. If you do not want to be recorded, tell the assistant and ask for a callback, or hang up and call again later.",
          "The assistant does not give final prices and does not confirm appointments. Those are confirmed with you directly.",
        ],
      },
      {
        h: "4. Referrals to licensed professionals",
        p: [
          "We do carpentry, drywall, painting, mounting and assembly. We do not do plumbing, electrical, air conditioning or roofing work, which require a state licence in Florida.",
          "If what you need is one of those, we may pass your request and your contact details to a licensed professional so that they can contact you about that job. We will tell you when we do this. You can tell us not to, and we will not pass anything on.",
          "A professional we refer you to is a separate business. They set their own price, do their own work, and handle your information under their own policy. We are not a party to the work they do for you.",
        ],
      },
      {
        h: "5. Text messages",
        p: [
          "Text messages about your request are optional. The box on the form is never pre-ticked, and not ticking it does not stop us from doing the job — we simply call you instead.",
          "Reply STOP to stop receiving them, or HELP for help. Message frequency varies and message and data rates may apply.",
          "We will not sell or share your mobile phone number, or your text-messaging opt-in or consent data, with third parties or affiliates for their own marketing or promotional purposes. This is separate from, and not changed by, the referrals described in section 4: a licensed professional we refer you to receives your request so they can do the work you asked about, never your messaging consent for their marketing.",
        ],
      },
      {
        h: "6. Who else sees your information",
        p: [
          "The service providers that make this work: our website host, our database provider, the telephone and messaging provider that delivers our calls and texts, and our email provider. They handle it on our instructions and for no other purpose.",
          "Anyone we are required to give it to by law.",
        ],
      },
      {
        h: "7. How long we keep it",
        p: [
          "As long as we need it for the purposes above, including service, warranty, tax and legal records. After that we delete it or remove what identifies you.",
        ],
      },
      {
        h: "8. Your choices",
        p: [
          "You can ask us what we hold about you, ask us to correct it, or ask us to delete it. You can ask us to stop texting you at any time, and to stop referring you to anyone.",
          "Write to us at the phone number on this site and we will take care of it.",
        ],
      },
    ],
  },
  es: {
    title: "Política de Privacidad",
    updated: "Última actualización: noviembre de 2026",
    intro:
      "Esta política explica qué recoge SuperHman Handyman cuando nos contactás, qué hacemos con esos datos y qué no hacemos nunca.",
    sections: [
      {
        h: "1. Qué recogemos",
        p: [
          "Cuando llenás el formulario o mandás un mensaje: tu nombre, tu teléfono, qué necesitás, tu código postal, el horario que te conviene y lo que escribas en las notas.",
          "Cuando llamás, el número desde el que llamás y la fecha y hora. Si atiende un asistente virtual, una grabación y una transcripción de la llamada.",
          "No pedimos, y no queremos, los datos de tu tarjeta, tu número de seguro social ni ningún documento de identidad por este sitio.",
        ],
      },
      {
        h: "2. Para qué los usamos",
        p: [
          "Para devolverte el llamado, pasarte un precio y hacer el trabajo que pediste.",
          "Para llevar registro del trabajo, manejar garantías y reclamos, y cumplir obligaciones legales e impositivas.",
        ],
      },
      {
        h: "3. Llamadas, grabaciones y nuestro asistente virtual",
        p: [
          "Cuando no podemos atender, tu llamada puede ser atendida por un asistente virtual: un sistema de voz automático, no una persona. Te lo dice al inicio de la llamada, y también que la llamada puede ser grabada.",
          "La ley de Florida exige el consentimiento de todas las personas en la llamada antes de grabarla. Si no querés que te graben, decíselo al asistente y pedí que te devuelvan el llamado, o cortá y llamá más tarde.",
          "El asistente no da precios finales ni confirma turnos. Eso se confirma con vos directamente.",
        ],
      },
      {
        h: "4. Derivación a profesionales con licencia",
        p: [
          "Hacemos carpintería, pared, pintura, montaje y armado. No hacemos plomería, electricidad, aire acondicionado ni techos, que en Florida requieren licencia estatal.",
          "Si lo que necesitás es uno de esos, podemos pasarle tu solicitud y tus datos de contacto a un profesional con licencia para que te contacte por ese trabajo. Te avisamos cuando lo hacemos. Podés decirnos que no, y no pasamos nada.",
          "El profesional al que te derivamos es un negocio aparte. Pone su propio precio, hace su propio trabajo y maneja tu información bajo su propia política. No somos parte del trabajo que hagan para vos.",
        ],
      },
      {
        h: "5. Mensajes de texto",
        p: [
          "Los mensajes de texto sobre tu solicitud son opcionales. La casilla del formulario nunca viene marcada, y no marcarla no impide que hagamos el trabajo: simplemente te llamamos.",
          "Respondé STOP para dejar de recibirlos, o HELP para ayuda. La frecuencia varía y pueden aplicar tarifas de mensajes y datos.",
          "No vendemos ni compartimos tu número de celular, ni tu aceptación o consentimiento de mensajes de texto, con terceros ni afiliados para su propio marketing o promoción. Esto es distinto de las derivaciones de la sección 4 y no se ve afectado por ellas: un profesional con licencia al que te derivamos recibe tu solicitud para hacer el trabajo que pediste, nunca tu consentimiento de mensajería para su marketing.",
        ],
      },
      {
        h: "6. Quién más ve tus datos",
        p: [
          "Los proveedores que hacen que esto funcione: el alojamiento del sitio, la base de datos, el proveedor de telefonía y mensajería que entrega las llamadas y los textos, y el de correo. Los manejan por instrucción nuestra y para ningún otro fin.",
          "Quien la ley nos obligue.",
        ],
      },
      {
        h: "7. Cuánto tiempo los guardamos",
        p: [
          "El que haga falta para los fines de arriba, incluidos los registros de servicio, garantía, impositivos y legales. Después los borramos o les quitamos lo que te identifica.",
        ],
      },
      {
        h: "8. Tus opciones",
        p: [
          "Podés pedirnos qué datos tuyos tenemos, que los corrijamos o que los borremos. Podés pedir que dejemos de escribirte, y que dejemos de derivarte a nadie.",
          "Escribinos al teléfono que figura en este sitio y lo resolvemos.",
        ],
      },
    ],
  },
};
