# Configuración de Airtable

## Paso 1: Obtener API Key

1. Ve a https://airtable.com/account/developer/apps
2. Haz clic en "Create new token"
3. Dale un nombre: "My Grupolive" (o similar)
4. Selecciona los permisos: **data.records:read**
5. Selecciona la base donde están tus participantes
6. Copia el token y guárdalo en `.env.local` como `AIRTABLE_API_KEY`

## Paso 2: Obtener Base ID

1. Abre tu base en Airtable
2. La URL se verá así: `https://airtable.com/appXXXXXXXXXXXXXXXX/tblYYYYYYYYYYYYYYYY`
3. El `BASE_ID` es la parte que empieza con `app` (ej: `appXXXXXXXXXXXXXXXX`)
4. Copia ese ID y guárdalo en `.env.local` como `AIRTABLE_BASE_ID`

## Paso 3: Verificar las tablas

Asegúrate de que tu base tenga exactamente estas tablas y campos:

### Tabla: Participantes
- **Nombre** (texto, campo primario) - ej: "María"
- **Etapa Actual** (single select) - debe ser una de las etapas definidas en `stage-requirements.ts`

### Tabla: Items
- **Participante** (link field → Participantes table)
- **Tipo** (single select: "documento" o "hito_proceso")
- **Nombre** (texto) - ej: "Pasaporte vigente"
- **Estado** (single select: "pendiente", "aprobado", o "rechazado")
- **Motivo de Rechazo** (texto largo, opcional) - solo si Estado = "rechazado"

## Paso 4: Actualizar `.env.local`

```env
AIRTABLE_API_KEY=pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXXXX
```

## Paso 5: Testear la conexión

Después de actualizar `.env.local`, el servidor se recargarápido automáticamente (hot-reload). 

Para verificar que funciona:
1. Recarga la app en el navegador
2. Intenta ingresar con uno de los nombres en Airtable (ej: "María")
3. Verifica que aparezcan los datos de Airtable (etapa actual, items)

## Troubleshooting

- **"Participant not found"**: Verifica que el nombre en Airtable coincida con lo que ingresas (normalización de acentos)
- **Respuesta vacía del agente**: Revisa la consola del servidor para errores de API de Airtable
- **Error 401 en logs**: El API key es inválido o expiró

## Cambios desde mock-data

La app ahora funciona 100% con Airtable:
- `mock-data.ts` sigue en el repo como referencia, pero no se usa
- Editar datos directamente en Airtable se refleja en la app sin reiniciar
- Los datos se validan en el servidor (no NEXT_PUBLIC), así que son seguros
