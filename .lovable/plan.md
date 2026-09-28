
# Plan: Prisma Admin — Corrección del Dashboard

Reorganizo el admin actual en las 6 secciones del brief, reutilizando el estilo existente (sidebar, cards, tipografía Space Grotesk, tokens de color). Todos los datos serán mock realistas (siguiendo el patrón de `nexia-mock.ts`) para poder navegar la herramienta completa antes de conectarla al backend real.

**Alcance:** solo la vista admin (rol `company_admin` / `super_admin`). La vista learner (`/me`) no se toca. La app mobile no está en este proyecto.

## Nueva estructura del sidebar admin

Reemplazo el árbol actual (Diagnóstico / Hunting / Upskilling) por uno alineado al brief:

```text
Prisma Admin
├─ Inicio                              /dashboard  (resumen ejecutivo)
├─ Gestión documental
│   ├─ Biblioteca                      /docs
│   ├─ Cargar / Sincronizar            /docs/upload
│   ├─ Conectores                      /docs/connectors
│   ├─ Aprobaciones                    /docs/approvals
│   └─ Vigencia & duplicados           /docs/health
├─ Indicadores
│   ├─ Consultas & tópicos             /insights/topics
│   ├─ Salud documental                /insights/doc-health
│   ├─ Actividad por sector            /insights/activity
│   └─ Aprendizaje & onboarding        /insights/learning
├─ Simulador del agente                /simulator
├─ Gobernanza
│   ├─ Roles & permisos                /governance/roles
│   └─ Reportes exportables            /governance/reports
└─ Configuración                        /configuracion  (existente)
```

Mantengo `/me` y `/me/aprendizaje` para el rol learner. El sidebar detecta rol y muestra un árbol u otro.

## Secciones a construir

### 1. Gestión documental
- **Biblioteca (`/docs`)**: tabla densa con filtros (área, proceso, tipo, criticidad, idioma, máquina, estado). Columnas: título, área/proceso, tipo, versión, estado (`subido`/`indexando`/`publicado`/`error`/`obsoleto`), última revisión, próxima revisión, autor. Chips de estado y badge de criticidad.
- **Cargar (`/docs/upload`)**: dropzone grande (drag & drop de archivos y carpetas usando `webkitdirectory`), listado en vivo del pipeline por archivo con progress bar por etapa (subido → indexando → publicado). Al terminar, sección "FAQs sugeridas por IA" editables antes de publicar.
- **Conectores (`/docs/connectors`)**: cards Google Drive, SharePoint, Confluence con estado de sync, última sincronización, frecuencia, botón "Sincronizar ahora" y "Configurar". Reusa el estilo del `IntegrationStatus` que ya existe.
- **Aprobaciones (`/docs/approvals`)**: kanban de 3 columnas *borrador → revisión → publicado* con cards arrastrables (mock). Cada card muestra autor, revisor asignado, área, tipo.
- **Vigencia & duplicados (`/docs/health`)**: dos tabs. (a) Documentos vencidos / próximos a vencer con countdown. (b) Detección de duplicados y contradicciones (pares de documentos con score de similitud y motivo detectado por IA).
- **Detalle de documento (`/docs/:id`)**: metadata editable, historial de versiones, material audiovisual vinculado (con sugeridos por IA), FAQs generadas.

### 2. Indicadores — Consultas & tópicos (`/insights/topics`)
- Ranking top 20 tópicos con tendencia semana/mes (sparkline por fila).
- Panel "Consultas recurrentes sobre el mismo proceso" (agrupador).
- Panel **Dolores principales**: preguntas mal resueltas (baja confianza / 👎), con % de escalamiento humano por tema.
- Todo agregado, nunca por persona.

### 3. Indicadores — Salud documental (`/insights/doc-health`)
- KPIs: % vigente, % vencido, # zombies, # gaps.
- Tabla "documentos más usados" y "documentos sin uso (zombie)".
- Tabla **Gaps**: temas con alto volumen de consulta y sin doc fuente adecuado.

### 4. Indicadores — Actividad por sector (`/insights/activity`)
- **Heatmap** área × día de la semana (Producción, Operaciones, RRHH, Legal, Finanzas, Marketing, Ventas, IT).
- Barras: actividad por línea/máquina/ubicación.
- Barras: actividad por turno (mañana/tarde/noche).
- Feed de **picos anómalos** detectados (área + tema + delta vs baseline).

### 5. Indicadores — Aprendizaje (`/insights/learning`)
- Barras: % de avance en rutas/onboarding por área.
- KPI: tiempo promedio de resolución de consulta.
- KPI: rating promedio de satisfacción (con distribución 1-5).

### 6. Simulador del agente (`/simulator`)
- Chat de prueba lado a lado: input de pregunta + versión de documentación (actual / borrador con cambios). Muestra respuesta simulada con documento fuente citado y confianza. Permite comparar "antes vs después" de un cambio documental.

### 7. Gobernanza
- **Roles (`/governance/roles`)**: matriz de permisos (subir / aprobar / ver métricas) por rol; tabla de usuarios plataforma con su rol.
- **Reportes (`/governance/reports`)**: catálogo de reportes exportables a PDF/Excel (mock: botón que descarga un `.csv` generado en cliente). Reportes: uso mensual, salud documental, dolores por área, avance de onboarding.

### 8. Inicio (`/dashboard`)
Reemplazo el actual hero de búsqueda por un resumen ejecutivo cuando el rol es admin (mantengo el hero para learner): 6 KPIs en tarjetas + top 3 dolores + heatmap resumido + alertas de vigencia. La vista actual "AI Search Hero" queda para learners en `/me`.

## Detalles técnicos

- **Mocks**: creo `src/lib/prisma-admin-mock.ts` con datasets tipados (documentos, tópicos, gaps, heatmap, aprobaciones, conectores, picos anómalos, reportes). Sigo el patrón de `nexia-mock.ts`.
- **UI**: shadcn (`Table`, `Tabs`, `Card`, `Badge`, `Progress`, `Dialog`), `lucide-react` para íconos. Heatmap y sparklines con SVG inline (sin nuevas dependencias). Kanban de aprobaciones con `@dnd-kit/core` sólo si ya está instalado; si no, uso botones "mover a…" para evitar añadir deps pesadas.
- **Sidebar**: extiendo `AppSidebar.tsx` con el nuevo árbol admin. Detecta `user.role` desde `AuthContext`; learners siguen viendo el árbol reducido actual.
- **Rutas**: agrego las nuevas en `src/App.tsx` dentro del `AppLayout`. Reutilizo `AdminRoute`/guard existente si aplica (o filtro por rol en el propio sidebar y hago fallback a 404 dentro de cada página admin).
- **Estilo**: reutilizo `card-elevated`, tokens (`bg-muted`, `border-border`, `text-muted-foreground`, `text-success`, `text-warning`), tipografía Space Grotesk en headings. Cero colores hardcoded nuevos.
- **Principio de gobernanza**: ningún indicador muestra nombres de personas — todos los widgets se agregan por área/tema/turno. Añado un comentario en el mock para dejarlo explícito.
- **Fuera de alcance**: no toco `MiEspacio`, `MiAprendizaje`, la app mobile, ni el backend/Supabase. Este PR es 100% frontend + mocks; los conectores reales (Drive/SharePoint/Confluence) quedan como UI + estado simulado con nota "Próximamente conectar backend".

## Orden de ejecución

1. Mock data (`prisma-admin-mock.ts`).
2. Sidebar admin + rutas nuevas.
3. Gestión documental (5 páginas) + detalle.
4. 4 páginas de indicadores.
5. Simulador.
6. Gobernanza (roles + reportes).
7. Nuevo `/dashboard` admin (resumen).
8. QA visual con Playwright en `/docs`, `/insights/topics`, `/insights/activity`, `/simulator`.
