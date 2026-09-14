# Implementación: Flujo de Escalamiento con Previsualización de Mail

## ✅ Completado

### 1. **Arquitectura de Email (Separación de responsabilidades)**

#### `lib/email/mail-builder.ts`
- Función `buildStaffEmail(data)` que arma los datos del mail de forma independiente
- Retorna estructura tipada `StaffEmailData` con:
  - `para`: staff@mygrupolive.com
  - `asunto`: URGENTE: contactar a {nombre}
  - `remitente`: My Grupolive Agent
  - `remitente_email`: noreply@mygrupolive.com
  - `nombre_participante`, `etapa_actual`, `motivo`
- Fácil de reemplazar por un servicio real (Resend/SendGrid) en el futuro sin tocar lógica del chat

### 2. **Componente Visual de Email**

#### `components/StaffEmailPreview.tsx`
Renderiza una previsualización estilo Gmail con:
- **Encabezado gris**: "✉️ Mail simulado — no enviado"
- **Asunto**: Texto en negrita, tamaño 18px (clase `text-lg font-bold`)
- **Remitente**: Avatar circular "MG" + nombre + email entre <>
- **Para**: staff@mygrupolive.com (alineado con el nombre, no con avatar)
- **Separador horizontal**: Línea fina (border-gray-200)
- **Cuerpo del mail**:
  - Nombre del participante
  - Etapa actual
  - **Motivo destacado**: Bloque con fondo gris, borde izquierdo indigo, padding
- **Estilos**:
  - Bordes redondeados: 12px (`rounded-xl`)
  - Borde sutil: 1px gris (`border border-gray-300`)
  - Fondo blanco
  - Ancho máximo: 28rem (max-w-md)
  - Centrado en pantalla

### 3. **Sistema de Tipos Actualizado**

#### `lib/chat/types.ts`
```typescript
type MessageContent = string | { type: string; data: unknown };

interface ChatMessage {
  role: "user" | "assistant";
  content: MessageContent;  // Ahora puede ser complejo
}

interface ChatResponse {
  reply: string;
  emailPreview?: { type: string; data: unknown };
  escalated: boolean;
}
```

### 4. **Actualización de Tool `escalate_to_staff`**

#### `lib/tools/tool-definitions.ts`
- Schema simplificado: solo toma `motivo` como parámetro
- Descripción actualizada explica el flujo completo

#### `lib/tools/tool-executors.ts`
- Obtiene datos del participante (nombre, etapa)
- Llama a `buildStaffEmail()` para armar los datos
- Retorna estructura que incluye el `email` data
- Sigue enviando a webhook N8N si está configurado (para persistencia real)

#### `lib/tools/types.ts`
```typescript
interface EscalateResult {
  escalated: true;
  delivered: boolean;
  email?: StaffEmailData;  // Incluye los datos armados
}
```

### 5. **Backend: Captura y Envío de Email Preview**

#### `app/api/chat/route.ts`
- Variable `emailPreview` tipada correctamente
- Al ejecutar tool `escalate_to_staff`, extrae el `.email` del resultado
- Arma estructura `{ type: "staff-email", data: emailData }`
- Incluye `emailPreview` en la `ChatResponse` solo si existe
- Cuando envía historial a Claude, convierte contenido complejo a texto descriptivo

### 6. **Frontend: Renderización de Email Preview**

#### `components/MessageBubble.tsx`
- Detecta si contenido es string o objeto con tipo
- Si es `type === "staff-email"`: renderiza `StaffEmailPreview`
- Si es string normal: renderiza mensaje de burbuja tradicional
- El preview se centra en pantalla completa, no en burbuja

#### `components/ChatWindow.tsx`
- Si respuesta incluye `emailPreview`, lo agrega como mensaje separado
- Luego agrega el `reply` textual
- Mantiene el flujo visual: primero el mail (visual), luego confirmación (texto)

### 7. **Instrucciones al Modelo (System Prompt)**

#### `lib/system-prompt.ts`
Gru sabe cómo usar el flujo:

**Punto 4 (Escalamiento con Email Preview):**
1. Pregunta el motivo/consulta si no está explícito
2. Confirma horario: "lunes a viernes de 9 a 18hs"
3. Llama a `escalate_to_staff` pasando solo el `motivo`
4. El sistema genera automáticamente la previsualización
5. Gru confirma que el pedido quedó registrado (tono cercano)

**Punto 5 (Escalamiento por no poder resolver):**
- Derivación automática si las herramientas no pueden resolver

**Punto 6 (No inventar datos):**
- Ante la duda, escalá (no inventar plazos, montos, políticas)

## 🧪 Pruebas Realizadas

### Test de API (curl)

```bash
# Participante: Maria (rec85Wa8R3IJbhH8u)
# Flujo:

1. Usuario pide contacto por problema grave
   → Gru pregunta el motivo

2. Usuario da motivo sobre certificado rechazado
   → Gru intenta resolver explicando por qué se rechazó

3. Usuario rechaza solución y pide staff directo
   → Gru ejecuta escalate_to_staff
   → API retorna emailPreview con datos completos
   → escalated = true
   → Gru confirma que quedó registrado
```

**Respuesta exitosa:**

```json
{
  "reply": "Perfecto, tu pedido quedó registrado. El staff te va a contactar en el horario de atención, que es de lunes a viernes de 9 a 18hs...",
  "escalated": true,
  "emailPreview": {
    "type": "staff-email",
    "data": {
      "para": "staff@mygrupolive.com",
      "asunto": "URGENTE: contactar a Maria",
      "remitente": "My Grupolive Agent",
      "remitente_email": "noreply@mygrupolive.com",
      "nombre_participante": "Maria",
      "etapa_actual": "Carga y validación de documentación personal y universitaria",
      "motivo": "Me rechazaron el certificado..."
    }
  }
}
```

## 📝 Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `lib/email/mail-builder.ts` | ✨ Nuevo - función `buildStaffEmail()` |
| `components/StaffEmailPreview.tsx` | ✨ Nuevo - componente visual |
| `lib/chat/types.ts` | Actualizado tipos para contenido complejo |
| `components/MessageBubble.tsx` | Extendido para renderizar múltiples tipos |
| `components/ChatWindow.tsx` | Maneja emailPreview en respuesta |
| `lib/tools/tool-definitions.ts` | Tool `escalate_to_staff` rediseñada |
| `lib/tools/tool-executors.ts` | Lógica completa de escalamiento |
| `lib/tools/types.ts` | Tipos actualizados para email data |
| `app/api/chat/route.ts` | Captura y envía emailPreview |
| `lib/system-prompt.ts` | Instrucciones para flujo de escalamiento |
| `components/NameGate.tsx` | Mejora: validación de apellido |

## 🔄 Flujo Completo de Usuario

```
[Usuario en chat]
    ↓
"Quiero ser contactado por el staff porque..."
    ↓
[Gru - SI explícito]
"Dale, cuál es el motivo?"
    ↓
"Tengo un problema con X"
    ↓
[Gru - Intenta resolver si puede]
[Si NO puede o usuario insiste]
    ↓
escalate_to_staff(motivo="...")
    ↓
[Backend arma email data]
    ↓
[Frontend recibe emailPreview]
    ↓
[StaffEmailPreview renderiza en chat]
    ↓
[Gru confirma]
"Perfecto, tu pedido quedó registrado. El staff te va a contactar
lunes a viernes de 9 a 18hs."
    ↓
escalated = true
```

## 🎨 Características de la Previsualización

✅ Encabezado simulado tipo Gmail
✅ Asunto destacado (18px, negrita)
✅ Avatar circular con iniciales "MG"
✅ Email del remitente en formato <email>
✅ Línea "Para: staff@mygrupolive.com"
✅ Separador horizontal
✅ Bloques de información: nombre, etapa, motivo
✅ Motivo destacado con borde izquierdo y fondo
✅ Responsive (funciona en móvil)
✅ Bordes redondeados, sutil, profesional

## 🚀 Próximos Pasos (Futuros)

1. Reemplazar `buildStaffEmail()` con integración Resend/SendGrid
2. Guardar histórico de escalaciones en base de datos
3. Sistema de notificaciones para staff cuando llega un escalamiento
4. Tracking de estados de escalación
5. Formulario interactivo si se necesita información adicional

---

**Status**: ✅ Implementación completa y probada
**Último cambio**: 2026-09-14
