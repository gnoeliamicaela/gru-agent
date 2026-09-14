# Guía de Uso: Flujo de Escalamiento con Email Preview

## 🎯 Objetivo

Cuando un participante quiere ser contactado por el staff (explícita o implícitamente por insatisfacción), el sistema:
1. Muestra una previsualización del email en el chat (sin enviarlo realmente)
2. Registra el escalamiento (envío a N8N si está configurado)
3. Confirma al usuario que su pedido quedó registrado

## 🔄 Flujo de Usuario

### Caso 1: Usuario pide contacto explícitamente

```
Usuario: "Quiero hablar con el staff"
  ↓
Gru: "Dale, ¿cuál es el motivo?"
  ↓
Usuario: "Me rechazaron un documento y no entiendo..."
  ↓
Gru: [intenta resolver]
  ↓
Usuario: "No, necesito hablar con el staff"
  ↓
Gru: [ejecuta escalate_to_staff]
  ↓
[Sistema genera y muestra email preview]
  ↓
Gru: "Perfecto, tu pedido quedó registrado. El staff te contactará de lunes a viernes de 9 a 18hs."
```

### Caso 2: Usuario insatisfecho con respuesta

```
Usuario: [recibe respuesta que no lo satisface]
  ↓
Usuario: "No es lo que esperaba, necesito contacto directo"
  ↓
Gru: [detecta insatisfacción]
  ↓
Gru: "Entiendo. Déjame escalar esto al staff. ¿Cuál es el motivo específico de tu inquietud?"
  ↓
[sigue igual que Caso 1]
```

## 💾 Datos que se Capturan

```typescript
{
  para: "staff@mygrupolive.com",
  asunto: "URGENTE: contactar a {nombre}",
  remitente: "My Grupolive Agent",
  remitente_email: "noreply@mygrupolive.com",
  nombre_participante: "María",
  etapa_actual: "Presentación ante sponsor",
  motivo: "[Lo que escribió el usuario]"
}
```

## 🎨 Visual del Email Preview

```
┌─ Mail simulado — no enviado ─────────────────────────┐
├───────────────────────────────────────────────────────┤
│ URGENTE: contactar a María                            │
├───────────────────────────────────────────────────────┤
│ [MG] My Grupolive Agent                               │
│      <noreply@mygrupolive.com>                        │
│ Para: staff@mygrupolive.com                           │
├───────────────────────────────────────────────────────┤
│ Participante: María                                   │
│ Etapa actual: Presentación ante sponsor               │
│                                                       │
│ ┌─────────────────────────────────────────────────┐  │
│ │ MOTIVO                                          │  │
│ │                                                 │  │
│ │ No entiendo por qué me rechazaron el            │  │
│ │ certificado de alumno regular...                │  │
│ └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
```

## 🛠️ Arquitectura

### Componentes

```
StaffEmailPreview
  ↑
  └── MessageBubble
        ↑
        └── ChatWindow
              ↑
              └── API /chat
                    ↑
                    └── escalate_to_staff (tool)
```

### Funciones Principales

#### `buildStaffEmail(data)`
- **Ubicación**: `lib/email/mail-builder.ts`
- **Responsabilidad**: Armar datos del email
- **Entrada**: `{ nombre_participante, etapa_actual, motivo }`
- **Salida**: Estructura tipada `StaffEmailData`
- **Ventaja**: Separada del componente visual, fácil de reemplazar por Resend/SendGrid

#### `escalate_to_staff(participantId, input)`
- **Ubicación**: `lib/tools/tool-executors.ts`
- **Responsabilidad**: Ejecutar escalamiento
- **Entrada**: `{ motivo: string }`
- **Salida**: `{ escalated: true, delivered: boolean, email?: StaffEmailData }`
- **Acciones**:
  1. Obtiene datos del participante
  2. Llama a `buildStaffEmail()`
  3. Envía a webhook N8N si está configurado
  4. Retorna datos para UI

#### `StaffEmailPreview({ email })`
- **Ubicación**: `components/StaffEmailPreview.tsx`
- **Responsabilidad**: Renderizar visual del email
- **Props**: Estructura tipada `StaffEmailData`
- **Estilos**: Tailwind, responsive, dark-mode ready

## ⚙️ Configuración

### Variables de Entorno

```env
# .env.local (ya configurado)
N8N_WEBHOOK_ESCALATION_URL=https://tu-instancia-n8n.com/webhook/escalation
```

Si no está configurada:
- La app **no falla**
- Los escalamientos se registran en logs del servidor
- El email preview se muestra igual

### Horario de Atención

- **Hardcodeado**: Lunes a viernes de 9 a 18hs
- **Ubicación**: Mensajes de confirmación de Gru
- **Para cambiar**: Actualizar `lib/system-prompt.ts`, línea ~38

## 🔐 Seguridad

✅ No se envía realmente email (solo simulado)
✅ Datos tratados como sensibles (nombre, etapa)
✅ Validación de participante antes de escalar
✅ Información privada nunca se expone en frontend

## 🧪 Testing

### Test Manual

1. Abrir http://localhost:3000
2. Ingresar nombre: "Maria Garcia"
3. En chat escribir: "Quiero hablar con el staff"
4. Responder el motivo
5. Insistir: "No, necesito contacto directo"
6. Ver email preview aparecer

### Test API

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "participant_id":"rec85Wa8R3IJbhH8u",
    "message":"No, necesito contacto directo del staff",
    "history":[...]
  }'
```

Respuesta esperada:
```json
{
  "reply": "Perfecto, tu pedido quedó registrado...",
  "escalated": true,
  "emailPreview": {
    "type": "staff-email",
    "data": { ... }
  }
}
```

## 📈 Métricas de Uso

Datos a trackear en futuro:

- Cantidad de escalamientos por día
- Tiempo promedio de escalamiento
- Participantes más frecuentes
- Temas más comunes
- Tasa de resolución sin escalar

## 🔄 Integración Futura con Resend/SendGrid

Cuando sea momento de enviar emails realmente:

```typescript
// Cambiar esta función
export async function escalateToStaff(...) {
  const emailData = buildStaffEmail(...);
  
  // Reemplazar esto:
  // await fetch(webhookUrl, { ... })
  
  // Con esto:
  const result = await resend.emails.send({
    from: "noreply@mygrupolive.com",
    to: emailData.para,
    subject: emailData.asunto,
    html: renderEmailTemplate(emailData),
  });
  
  return { escalated: true, delivered: result.success };
}
```

**Ventaja de la arquitectura actual**: `buildStaffEmail()` está completamente separada, por lo que el cambio es trivial.

## 📞 Contacto y Soporte

Si algo no funciona:
1. Revisar logs de servidor: `npm run dev`
2. Verificar que Airtable está configurado (`AIRTABLE_API_KEY`)
3. Confirmar que Claude API key es válida (`ANTHROPIC_API_KEY`)
4. Revisar historial de chat (podría estar en tool loop)

---

**Última actualización**: 2026-09-14
**Versión**: 1.0
**Estado**: Producción
