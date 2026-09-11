import { normalize } from "./stage-requirements";

export interface FaqEntry {
  topic: string;
  aliases: string[];
  proposito: string;
  que_implica: string;
  dudas_comunes: { pregunta: string; respuesta: string }[];
}

export const FAQ_DATA: FaqEntry[] = [
  // ─────────────────────────────────────────────
  // ETAPA 1 — Presentación de documentación personal y universitaria
  // ─────────────────────────────────────────────
  {
    topic: "Comprobante de pago de inscripción",
    aliases: ["pago inscripción", "comprobante pago"],
    proposito: "Acreditar que completaste el pago de tu inscripción al programa.",
    que_implica: "Subir el comprobante o recibo de tu transferencia bancaria, tarjeta de crédito o billetera digital.",
    dudas_comunes: [
      {
        pregunta: "¿Qué formato tiene que tener?",
        respuesta: "PDF, PNG o JPG. Tiene que verse claro el monto, fecha y tu nombre.",
      },
    ],
  },
  {
    topic: "Datos del participante",
    aliases: ["datos personales", "informacion personal"],
    proposito: "Registrar tus datos personales reales para el proceso de inscripción y visa.",
    que_implica: "Cargar fecha de nacimiento, lugar de residencia, lugar de nacimiento, condiciones médicas, etc.",
    dudas_comunes: [
      {
        pregunta: "¿Por qué el lugar de nacimiento tiene que ser el real?",
        respuesta: "Porque es un dato que se cruza en el trámite de la visa; una inconsistencia entre lo declarado y lo real puede generar problemas en el proceso.",
      },
      {
        pregunta: "¿Puedo poner datos aproximados si no estoy seguro?",
        respuesta: "No, todos los datos cargados tienen que ser reales y exactos.",
      },
    ],
  },
  {
    topic: "DNI",
    aliases: ["documento de identidad", "cedula"],
    proposito: "Verificar tu identidad y acreditar que tenés residencia en Argentina.",
    que_implica: "Subir una foto clara de ambos lados de tu DNI (frente y dorso). Podés tener otra nacionalidad, pero el DNI tiene que demostrar residencia argentina.",
    dudas_comunes: [
      {
        pregunta: "¿Puede estar vencido?",
        respuesta: "Preferiblemente no. Si está muy cerca del vencimiento, es mejor renovarlo primero.",
      },
      {
        pregunta: "¿Tengo que ser ciudadano argentino para aplicar?",
        respuesta: "No necesariamente — podés tener otra nacionalidad — pero el DNI presentado tiene que demostrar residencia en Argentina, porque hay que acreditar que estás estudiando en el país mientras hacés el Work and Travel.",
      },
    ],
  },
  {
    topic: "Pasaporte vigente",
    aliases: ["pasaporte", "passport"],
    proposito: "Acreditar que tenés un documento válido para viajar a EE.UU.",
    que_implica: "Subir la página de datos de tu pasaporte (foto, número, fechas de validez). No necesita ser argentino.",
    dudas_comunes: [
      {
        pregunta: "¿Cuál es la validez mínima?",
        respuesta: "Tu pasaporte debe ser válido por al menos 6 meses a partir de tu ingreso a Estados Unidos.",
      },
    ],
  },
  {
    topic: "Foto tipo CV profesional",
    aliases: ["foto perfil", "foto busto", "foto CV"],
    proposito: "Presentar tu imagen a los empleadores estadounidenses de forma profesional.",
    que_implica: "Subir una foto de busto, estilo CV profesional, donde se vea la cara con claridad.",
    dudas_comunes: [
      {
        pregunta: "¿Sirve una selfie o una foto informal?",
        respuesta: "No, tiene que ser una foto tipo currículum profesional, no una selfie ni una foto casual.",
      },
    ],
  },
  {
    topic: "Datos de contacto de emergencia",
    aliases: ["contacto emergencia", "emergency contact"],
    proposito: "Tener a alguien de referencia en Argentina por si sucede algo con el participante durante el programa.",
    que_implica: "Cargar los datos de una persona que se quede en Argentina durante todo el período del programa.",
    dudas_comunes: [
      {
        pregunta: "¿Quién puede ser el contacto de emergencia?",
        respuesta: "Una persona que se quede en Argentina durante todo el período del programa (no alguien que viaje también).",
      },
    ],
  },
  {
    topic: "Certificado de alumno regular",
    aliases: ["constancia alumno regular", "certificado alumno", "comprobante alumno"],
    proposito: "Probar que estás cursando una carrera de grado o ciclo superior.",
    que_implica: "Documento de tu institución educativa que dice que sos alumno regular (cursando).",
    dudas_comunes: [
      {
        pregunta: "¿Tiene fecha de vencimiento?",
        respuesta: "Sí: tiene que tener una validez de al menos 30 días previos al momento de aplicar a la visa. Conviene pedirlo cerca de esa fecha, no con mucha anticipación.",
      },
    ],
  },
  {
    topic: "Carta de la universidad",
    aliases: ["carta universidad", "university letter"],
    proposito: "Certificar el período en el que la universidad te habilita a hacer el programa.",
    que_implica: "Documento firmado por la universidad indicando las fechas de receso académico habilitadas (ej. diciembre a marzo).",
    dudas_comunes: [
      {
        pregunta: "¿Por qué es tan importante esta carta?",
        respuesta: "Porque esas fechas condicionan directamente cuándo podés trabajar y cuándo podés viajar — no se puede acordar fechas de trabajo o viaje fuera de ese rango.",
      },
    ],
  },
  {
    topic: "Curriculum Vitae/Resume",
    aliases: ["CV", "curriculum", "resume"],
    proposito: "Presentar tu formación, experiencia laboral y habilidades a los empleadores estadounidenses.",
    que_implica: "Armar tu CV obligatoriamente con la plantilla que te da Grupolive, para garantizar que estén todos los datos requeridos.",
    dudas_comunes: [
      {
        pregunta: "¿Puedo enviar mi propio CV con otro diseño?",
        respuesta: "No, solo se aceptan CVs armados con la plantilla que brinda Grupolive; no se aceptan currículums con otro formato.",
      },
      {
        pregunta: "¿En qué idioma?",
        respuesta: "Sí o sí en inglés, porque la entrevista laboral la realiza una persona de Recursos Humanos en Estados Unidos que no habla español.",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // ETAPA 2 — Entrevista con empleadores
  // ─────────────────────────────────────────────
  {
    topic: "Esperando match con empleadores",
    aliases: ["match con empleadores", "asignacion empleador"],
    proposito: "El sponsor te conecta con empleadores que buscan participantes con tu perfil.",
    que_implica: "Esperar a que el sponsor identifique ofertas de trabajo compatibles con vos.",
    dudas_comunes: [
      {
        pregunta: "¿Cuánto tarda?",
        respuesta: "Varía según demanda. Podés ir de 1-2 semanas a un mes o más.",
      },
    ],
  },
  {
    topic: "Esperando entrevista laboral",
    aliases: ["entrevista con empleador", "interview laboral"],
    proposito: "El empleador te entrevista para conocerte y evaluar si sos un buen fit.",
    que_implica: "Una o más entrevistas (por video call o llamada) con el empleador o HR.",
    dudas_comunes: [
      {
        pregunta: "¿En qué idioma?",
        respuesta: "En inglés. Es la oportunidad para practicar y mostrar tus habilidades comunicativas.",
      },
    ],
  },
  {
    topic: "Esperando resultado de entrevista laboral",
    aliases: ["resultado entrevista", "decision empleador"],
    proposito: "Esperar la decisión del empleador sobre si te quiere contratar.",
    que_implica: "El empleador se comunica contigo o con el sponsor para confirmar si avanzás.",
    dudas_comunes: [
      {
        pregunta: "¿Qué pasa si me dicen que no?",
        respuesta: "El sponsor te conecta con otras ofertas. Es normal tener que hacer varias entrevistas.",
      },
    ],
  },
  {
    topic: "Confirmación de posición y paga",
    aliases: ["oferta laboral", "job offer", "confirmacion trabajo"],
    proposito: "Acuerdo formal entre vos y el empleador sobre el puesto y el salario.",
    que_implica: "El empleador te comunica la posición exacta, el sueldo y los términos de la contratación.",
    dudas_comunes: [
      {
        pregunta: "¿Qué tiene que incluir?",
        respuesta: "Título del puesto, horario, salario, beneficios y duración de la posición.",
      },
    ],
  },
  {
    topic: "Firma de oferta laboral",
    aliases: ["firmar oferta", "offer acceptance", "aceptar oferta"],
    proposito: "Aceptar formalmente la oferta de empleo y formalizar el contrato.",
    que_implica: "Firmar (electrónica o papel) la carta de oferta del empleador.",
    dudas_comunes: [
      {
        pregunta: "¿Puedo negociar?",
        respuesta: "Podés hacer preguntas, pero en general los términos vienen cerrados. Consultá con tu asesor si tenés dudas.",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // ETAPA 3 — Presentación de documentación ante el sponsor
  // ─────────────────────────────────────────────
  {
    topic: "Formulario DS-2019",
    aliases: ["DS-2019", "form DS-2019"],
    proposito: "Documento emitido por el sponsor que acredita tu aceptación en el programa.",
    que_implica: "El sponsor lo genera en su sistema una vez que validó tu documentación y ya tenés oferta laboral firmada.",
    dudas_comunes: [
      {
        pregunta: "¿Yo lo genero o lo envía el sponsor?",
        respuesta: "Lo genera y envía el sponsor. Vos recibís el documento por mail.",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // ETAPA 4 — Visado
  // ─────────────────────────────────────────────
  {
    topic: "Formulario DS-160",
    aliases: ["DS-160", "visa application", "aplicación visa"],
    proposito: "Solicitud de visa de trabajo para EE.UU. que completás online.",
    que_implica: "Rellenar un formulario web con tus datos personales, historia de viajes, empleo, etc.",
    dudas_comunes: [
      {
        pregunta: "¿Cuándo tengo que hacerlo?",
        respuesta: "Después de que tu empleador firma la oferta y el sponsor emite tu DS-2019. Tu asesor te dará instrucciones.",
      },
    ],
  },
  {
    topic: "Comprobante de pago de tasa SEVIS",
    aliases: ["pago SEVIS", "I-901 fee", "SEVIS fee"],
    proposito: "Acreditar que pagaste la tasa de mantenimiento del registro SEVIS (Sistema de seguimiento de estudiantes/trabajadores).",
    que_implica: "Pagar la tasa vía el sitio oficial fmjfee.com y guardar el comprobante. El monto actual es de USD 35, pero puede cambiar, así que conviene confirmarlo antes de pagar.",
    dudas_comunes: [
      {
        pregunta: "¿Cuánto tengo que pagar?",
        respuesta: "El monto vigente es de USD 35. Este valor puede actualizarse, así que confirmalo con tu asesor antes de pagar.",
      },
      {
        pregunta: "¿Cuándo pago?",
        respuesta: "Después de que tu empleador complete el DS-2019 y antes de la entrevista consular. Tu asesor te guía con las fechas.",
      },
    ],
  },
  {
    topic: "Pago del arancel consular",
    aliases: ["arancel visa", "visa fee", "pago consulado"],
    proposito: "Tasa que cobra la embajada/consulado para procesar tu solicitud de visa.",
    que_implica: "Pagar el arancel (monto varía por país) para que el consulado revise tu caso.",
    dudas_comunes: [
      {
        pregunta: "¿Cuánto es?",
        respuesta: "Varía según tu país de residencia. Consultá con tu asesor para confirmar el monto exacto.",
      },
    ],
  },
  {
    topic: "Entrevista consular",
    aliases: ["cita consular", "visa interview", "entrevista visa"],
    proposito: "Entrevista con un oficial del consulado para evaluar tu solicitud de visa.",
    que_implica: "Comparecencia personal en la embajada o consulado en una fecha programada.",
    dudas_comunes: [
      {
        pregunta: "¿Qué tengo que llevar?",
        respuesta: "Pasaporte, DS-160 confirmado, DS-2019, comprobante SEVIS, carta del empleador y documentación de soporte.",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // ETAPA 5 — Pre-viaje
  // ─────────────────────────────────────────────
  {
    topic: "Pasaje aéreo",
    aliases: ["boleto aereo", "flight ticket", "ticket aereo"],
    proposito: "Tu reserva de vuelo a EE.UU. para el inicio de tu programa.",
    que_implica: "Comprar o reservar tu pasaje de ida (y eventualmente vuelta) a tu destino.",
    dudas_comunes: [
      {
        pregunta: "¿Me ayudan a comprarlo?",
        respuesta: "En general no. Algunos sponsors ofrecen orientación o contactos con agencias de viajes, pero la compra es por tu cuenta.",
      },
    ],
  },
  {
    topic: "Comprobante de alojamiento",
    aliases: ["comprobante alojamiento", "housing confirmation", "direccion alojamiento"],
    proposito: "Acreditar dónde vas a vivir durante tu programa.",
    que_implica: "Confirmación escrita (mail, contrato, etc.) de tu empleador, host family o propiedad rentada.",
    dudas_comunes: [
      {
        pregunta: "¿El empleador lo proporciona?",
        respuesta: "Algunos sí, otros no. Consultá con tu asesor — en algunos casos tenés que arreglarlo vos.",
      },
    ],
  },
];

export function normalizeTopic(s: string): string {
  return normalize(s);
}

export function getFaq(topic: string): FaqEntry | undefined {
  const n = normalizeTopic(topic);
  return FAQ_DATA.find(
    (e) => normalizeTopic(e.topic) === n || e.aliases.some((a) => normalizeTopic(a) === n),
  );
}
