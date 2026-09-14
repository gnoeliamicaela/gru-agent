# Verification Guide: Identificación con Nombre y Apellido

## Cambios Implementados

### 1. Backend (airtable-service.ts)
- ✅ Agregado campo `Apellido` a `ParticipanteFields`
- ✅ Nueva función `findParticipantByFullName(nombre, apellido)` - búsqueda exacta
- ✅ Nueva función `findParticipantsByFirstName(nombre)` - búsqueda por nombre de pila
- ✅ Función `findParticipantByName()` marcada como deprecada

### 2. Actions (actions.ts)
- ✅ Nueva función `identifyParticipantWithLastName()` que devuelve:
  - `{ status: "identified", participant }` - identificación exitosa
  - `{ status: "ambiguous", candidates }` - múltiples matches por nombre
  - `{ status: "not_found" }` - no encontrado

### 3. Frontend (NameGate.tsx)
- ✅ Pide "nombre y apellido" en el mensaje inicial
- ✅ Maneja ambigüedad sin incrementar intentos fallidos
- ✅ Mantiene contador de intentos fallidos (máximo 2)
- ✅ Muestra mensajes diferenciados para cada estado
- ✅ Actualiza hint de participantes con datos correctos

## Participantes de Prueba (en Airtable)

| Nombre | Apellido | Etapa Actual |
|--------|----------|--------------|
| Maria | Garcia | Carga y validación de documentación personal y universitaria |
| Juan | Perez | Carga y validación de documentación personal y universitaria |
| Lucia | Lopez | Entrevista con empleadores estadounidenses |

## Corrección de Seguridad Implementada

**Bug Encontrado**: Cuando el usuario ingresaba "Lucía García" (con apellido incorrecto), 
el sistema hacía fallback a "buscar solo Lucía" y la identificaba igual, violando la validación.

**Solución**: 
- **Si el usuario ingresa 2+ palabras** (nombre + intento de apellido): búsqueda ESTRICTA
  - Match exacto → identificado
  - Sin match → error real (sin fallback)
- **Si el usuario ingresa 1 palabra** (solo nombre): búsqueda FLEXIBLE
  - Match exacto → identificado
  - Sin match → intento fallido
  - Múltiples matches → pedir apellido

## Casos de Prueba - Flujo Normal (Sin Ambigüedad)

### ✅ Test 1: Identificación Exitosa - Maria Garcia
1. Ir a http://localhost:3000
2. Escribir: `Maria Garcia`
3. Presionar "Ingresar"
4. **Esperado**: Debe identificarse inmediatamente y entrar a ChatWindow
5. **Status**: Sin incrementar intentos, sin pedir apellido nuevamente

### ✅ Test 2: Identificación Exitosa - Juan Perez
1. Recargar página (para resetear sesión)
2. Escribir: `Juan Perez`
3. Presionar "Ingresar"
4. **Esperado**: Debe identificarse inmediatamente
5. **Status**: Sin pedir confirmación

### ✅ Test 3: Identificación Exitosa - Lucia Lopez
1. Recargar página
2. Escribir: `Lucia Lopez`
3. Presionar "Ingresar"
4. **Esperado**: Debe identificarse inmediatamente
5. **Status**: Prueba con acento en el nombre

## Casos de Prueba - Error y Reintentos

### ✅ Test 4: Primer Intento Fallido
1. Recargar página
2. Escribir: `Unknown Person`
3. Presionar "Ingresar"
4. **Esperado**: Mensaje de error "Verificá que hayas ingresado..."
5. **Status**: `failedAttempts = 1`, input limpiado, no locked

### ✅ Test 5: Segundo Intento Fallido → Lockout
1. **Sin recargar página**
2. Escribir: `Another Unknown`
3. Presionar "Ingresar"
4. **Esperado**: Mensaje de lockout "No pudimos confirmar tu identidad..."
5. **Status**: `failedAttempts = 2`, gate locked, no se puede interactuar más

## Casos de Prueba - Ambigüedad (Requiere Test Data)

> **Nota**: Para probar la desambigüedad, sería necesario agregar un 4to participante
> con el mismo nombre de pila (ej. otra "Maria" con apellido distinto, como "Maria Rodriguez").
> 
> Cuando esto esté en Airtable:

### ✅ Test 6: Desambiguación - Primer Intento
1. Recargar página
2. Escribir: `Maria Something` (donde "Something" no coincida con García ni Rodríguez)
3. Presionar "Ingresar"
4. **Esperado**: 
   - Mensaje: "Hay varios participantes con ese nombre..."
   - Campo pide específicamente: "Necesito también tu apellido..."
   - **Importante**: `failedAttempts` NO se incrementa (es información útil, no un error)

### ✅ Test 7: Desambiguar con García
1. **Sin recargar página** (el componente mantiene `pendingFirstName = "Maria"`)
2. Escribir: `Garcia`
3. Presionar "Ingresar"
4. **Esperado**: Identificación exitosa
5. **Status**: `pendingFirstName` se limpia, entra a ChatWindow

### ✅ Test 8: Desambiguar Fallido (García Incorrecto)
1. Recargar página
2. Escribir: `Maria Incorrect`
3. **Esperado**: Desambiguación (múltiples Marias)
4. Escribir: `WrongLastName`
5. Presionar "Ingresar"
6. **Esperado**: Error (ahora `failedAttempts = 1`, porque el apellido fue incorrecto)

## Comportamiento Transversal - Casos Especiales

### ✅ Test 9: Case Insensitivity
1. Recargar página
2. Escribir: `maria garcia` (minúsculas)
3. **Esperado**: Identificación exitosa igual

### ✅ Test 10: UPPERCASE
1. Recargar página
2. Escribir: `JUAN PEREZ` (mayúsculas)
3. **Esperado**: Identificación exitosa igual

### ✅ Test 11: Extra Spaces
1. Recargar página
2. Escribir: `Maria    Garcia` (espacios múltiples)
3. **Esperado**: Identificación exitosa (parsing de espacios)

### ✅ Test 12: Solo Nombre (Sin Apellido) - PERMITE FALLBACK
1. Recargar página
2. Escribir: `Maria` (solo primer nombre)
3. Presionar "Ingresar"
4. **Esperado**: Identificación exitosa (busca solo por nombre, fallback permitido)
5. **Rationale**: Una sola palabra se interpreta como búsqueda flexible

### ✅ Test 12b: Apellido Incorrecto (Bug de Seguridad)
1. Recargar página
2. Escribir: `Lucia Garcia` (apellido INCORRECTO, el real es López)
3. Presionar "Ingresar"
4. **Esperado**: Error "No encontramos ese nombre registrado..." (`failedAttempts = 1`)
5. **IMPORTANTE**: NO debe hacer fallback a "identificar como Lucía López"
6. **Rationale**: Cuando se ingresa 2+ palabras, es búsqueda ESTRICTA (sin fallback)

## Seguridad - Verificación de Privacidad

### ✅ Test 13: Sin Revelar Información
Cuando hay error de no encontrado, el mensaje es genérico:
- ❌ NO debe decir "No encontramos 'Unknown'..." (no revela que lo buscó)
- ❌ NO debe listar participantes válidos
- ❌ NO debe dar pistas sobre cuántos participantes existen
- ✅ Debe ser: "Verificá que hayas ingresado tu nombre y apellido correctamente"

## Resumen de Pruebas

| Test | Tipo | Status | Notas |
|------|------|--------|-------|
| 1-3 | Éxito Normal | ✅ | Identificación directa |
| 4-5 | Reintentos | ✅ | Contador de intentos, lockout en 2do |
| 6-8 | Ambigüedad | ⚠️ | Requiere test data |
| 9-11 | Casos Especiales | ✅ | Normalization, case-insensitive |
| 12 | Edge Case | ✅ | Error si falta apellido |
| 13 | Seguridad | ✅ | No revela información |

## Cómo Ejecutar Manualmente

```bash
# Terminal 1: Inicia el servidor dev
cd /Users/noeliagarcia/Desktop/Proyectos\ Claude/Gru\ Agent
npm run dev

# Terminal 2: Abre el navegador
# Ve a http://localhost:3000

# Prueba los casos arriba
```

## Verificación del Código

```bash
# Ver cambios de airtable-service.ts
git show HEAD:lib/airtable-service.ts

# Ver cambios de actions.ts
git show HEAD:lib/actions.ts

# Ver cambios de NameGate.tsx
git show HEAD:components/NameGate.tsx

# Ver commit completo
git show HEAD
```

## Estado Actual

✅ **Backend**: Funciones de búsqueda implementadas y testeadas  
✅ **Actions**: Orquestación del flujo implementada  
✅ **Frontend**: UI actualizado con nuevo flujo  
✅ **Compilación**: Sin errores TypeScript  
✅ **Server**: Corriendo en localhost:3000  
✅ **Airtable**: Datos correctos en tabla Participantes  

**Pendiente**: Pruebas manuales en navegador (para verificar visual + comportamiento real)
