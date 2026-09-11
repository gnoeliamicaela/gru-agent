import { normalize } from "./stage-requirements";

export interface FaqEntry {
  topic: string;
  aliases: string[];
  proposito: string;
  que_implica: string;
  dudas_comunes: { pregunta: string; respuesta: string }[];
}

export const FAQ_DATA: FaqEntry[] = [
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
    topic: "DNI",
    aliases: ["documento de identidad", "cedula"],
    proposito: "Verificar tu identidad y datos personales.",
    que_implica: "Subir una foto clara de ambos lados de tu DNI (frente y dorso).",
    dudas_comunes: [
      {
        pregunta: "¿Puede estar vencido?",
        respuesta: "Preferiblemente no. Si está muy cerca del vencimiento, es mejor renovarlo primero.",
      },
    ],
  },
  {
    topic: "Pasaporte vigente",
    aliases: ["pasaporte", "passport"],
    proposito: "Acreditar que tenés un documento válido para viajar a EE.UU.",
    que_implica: "Subir la página de datos de tu pasaporte (foto, número, fechas de validez).",
    dudas_comunes: [
      {
        pregunta: "¿Cuál es la validez mínima?",
        respuesta: "Tu pasaporte debe ser válido por al menos 6 meses a partir de tu viaje.",
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
        respuesta: "Sí, en general es válido por 30 días desde su emisión. Si pasó ese tiempo, tenés que pedir uno nuevo.",
      },
    ],
  },
  {
    topic: "Curriculum Vitae/Resume",
    aliases: ["CV", "curriculum", "resume"],
    proposito: "Presentar tu formación, experiencia laboral y habilidades a los empleadores estadounidenses.",
    que_implica: "Un documento (PDF o Word) con tus datos de contacto, educación, experiencia laboral y habilidades.",
    dudas_comunes: [
      {
        pregunta: "¿En qué idioma?",
        respuesta: "En inglés es lo más común, pero podés presentar una versión bilingüe.",
      },
      {
        pregunta: "¿Qué estructura sigo?",
        respuesta: "Encabezado con datos de contacto, resumen profesional, experiencia, educación, habilidades.",
      },
    ],
  },
  {
    topic: "Formulario DS-2019",
    aliases: ["DS-2019", "I-20", "form DS-2019"],
    proposito: "Documento emitido por el sponsor que acredita tu aceptación en el programa.",
    que_implica: "El sponsor lo genera en su sistema una vez que validó tu documentación.",
    dudas_comunes: [
      {
        pregunta: "¿Yo lo genero o lo envía el sponsor?",
        respuesta: "Lo genera y envía el sponsor. Vos recibís el documento por mail.",
      },
    ],
  },
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
  {
    topic: "Formulario DS-160",
    aliases: ["DS-160", "visa application", "aplicación visa"],
    proposito: "Solicitud de visa de trabajo para EE.UU. que completás online.",
    que_implica: "Rellenar un formulario web con tus datos personales, historia de viajes, empleo, etc.",
    dudas_comunes: [
      {
        pregunta: "¿Cuándo tengo que hacerlo?",
        respuesta: "Después de que tu empleador firma la oferta. Tu asesor te dará instrucciones.",
      },
    ],
  },
  {
    topic: "Comprobante de pago de tasa SEVIS",
    aliases: ["pago SEVIS", "I-901 fee", "SEVIS fee"],
    proposito: "Acreditar que pagaste la tasa de mantenimiento del registro SEVIS (Sistema de seguimiento de estudiantes/trabajadores).",
    que_implica: "Pagar aproximadamente USD 200 vía el sitio web de SEVIS y guardar el comprobante.",
    dudas_comunes: [
      {
        pregunta: "¿Cuándo pago?",
        respuesta: "Después de que tu empleador complete el DS-2019. Tu asesor te guía con las fechas.",
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
