# Pipeline: resumen matutino del agente personal

Ejecutado por la rutina diaria en la nube de Anthropic (8:00 aprox., hora de Nueva York).
La sesión principal actúa como **orquestador**: no analiza ni redacta, solo coordina a los
tres agentes definidos en `.claude/agents/`.

| Agente | Archivo | Modelo | Rol |
|---|---|---|---|
| analista | `.claude/agents/analista.md` | opus | Lee Gmail + Calendar y analiza |
| ejecutor | `.claude/agents/ejecutor.md` | sonnet | Redacta, corrige y entrega (borrador Gmail) |
| revisor | `.claude/agents/revisor.md` | opus | Puntúa 0–100; < 95 = rechazado |

## Cómo invocar a cada agente

Si el tipo de subagente (`analista`, `ejecutor`, `revisor`) está registrado en la sesión,
úsalo directamente. Si no lo está, lee su archivo `.md` y lanza un agente
`general-purpose` con `model` = el valor `model` del frontmatter y, como prompt, el cuerpo
del archivo seguido de la entrada del paso.

## Flujo

1. **Analizar** — `analista` con: "Genera el análisis del día." Guarda la salida como
   `ANALISIS`. Si ambas fuentes (Gmail y Calendar) fallan, salta al paso 5 con estado
   `ERROR DE FUENTES`.
2. **Redactar** — `ejecutor` en modo `REDACTAR` con `ANALISIS`. Salida: `BORRADOR`.
3. **Revisar** — `revisor` con `ANALISIS` + `BORRADOR`. Salida: `INFORME`.
   - `PUNTUACIÓN ≥ 95` y `VEREDICTO: APROBADO` → paso 4.
   - En otro caso → `ejecutor` en modo `CORREGIR` con `BORRADOR` + `INFORME`, y vuelve a
     revisar. **Máximo 3 rondas de revisión.** Cada revisión la hace una instancia nueva
     del revisor (sin ver puntuaciones anteriores) para que no se "ablande".
   - Tras 3 rondas por debajo de 95 → **rechazado definitivamente**: no se entrega nada,
     ve al paso 5 con estado `RECHAZADO`.
4. **Entregar** — `ejecutor` en modo `ENTREGAR` con el borrador aprobado. Crea el
   borrador en Gmail (nunca envía).
5. **Informe final** — una notificación push corta (si la herramienta está disponible) y
   el mensaje final de la sesión con: estado (`ENTREGADO` / `RECHAZADO` /
   `ERROR DE FUENTES`), puntuación de cada ronda, ID del borrador de Gmail si existe, y si
   fue rechazado, los problemas pendientes del último informe del revisor.

## Límites

- Nada se envía, borra, etiqueta ni se responde en nombre del dueño. Calendar es solo
  lectura.
- No se modifica ni se hace commit de nada en el repositorio.
