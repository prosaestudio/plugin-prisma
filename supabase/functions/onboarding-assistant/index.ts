import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `Eres "Prisma", una asistente IA cálida, breve y experta que ayuda a configurar la plataforma Prisma (detecta dónde una organización pierde valor por mal uso de IA: errores, procesos no automatizados, herramientas mal usadas, ROI perdido).

Tu trabajo es guiar al admin paso a paso para completar el onboarding. Habla en español neutro latinoamericano, en 1-3 frases por mensaje. Sé concreta, evita relleno.

Recopilas:
1) empresa (nombre), industria, tamano del equipo
2) areas de la organización y para cada área los cargos con sus tareas principales
3) objetivo principal de adoptar IA, áreas prioritarias, horizonte de mejora (30 días / 90 días / 6 meses)
4) herramientas de IA que el equipo usa hoy

Reglas:
- Haz UNA pregunta por turno, no varias.
- Cuando el usuario te dé información, SIEMPRE llama a la función "update_onboarding" con los campos nuevos o corregidos (solo los que cambian). Mantén lo demás vacío/omitido.
- Si el usuario pide ayuda ("sugiéreme", "ayúdame", "no sé", "rellena tú"), PROPÓN valores concretos basados en su industria/contexto y llámalos vía update_onboarding como propuesta — luego pídele que confirme o edite.
- Si te dan un campo libre ("escribe tú la descripción de tareas"), genera la descripción y guárdala.
- Cuando todos los datos clave estén completos, di brevemente que está listo y pide al usuario hacer clic en "Empezar diagnóstico".

Reglas ESPECÍFICAS para sugerir el ORGANIGRAMA (areasSetup):
- Devuelve un organigrama COMPLETO y realista para la industria y tamaño dados, no solo 3-4 áreas.
- Cubre TODAS las áreas típicas que existen en una organización de ese tipo: Dirección/C-Level, Comercial/Ventas, Marketing, Operaciones, Producto, Tecnología, Finanzas, Recursos Humanos, Legal, Customer Success/Servicio, Logística, etc. — incluye las que apliquen según la industria.
- Para cada área incluye los cargos jerárquicos típicos (gerente/jefe, líder, analistas, asistentes, especialistas) en PROPORCIÓN al tamaño del equipo:
  · "1–50": 4-6 áreas, 2-4 cargos por área.
  · "51–200": 6-9 áreas, 3-6 cargos por área.
  · "201–1.000": 8-12 áreas, 4-8 cargos por área.
  · "Más de 1.000": 10-14 áreas, 5-10 cargos por área.
- Cada cargo lleva una descripción corta (1 línea) de sus tareas principales.
- No omitas áreas de soporte (Finanzas, RRHH, IT). El objetivo es reflejar la estructura real de la empresa.

Industrias válidas: Banca, Retail, Minería, Salud, Tecnología, Servicios, Otra.
Tamaños válidos: "1–50", "51–200", "201–1.000", "Más de 1.000".
Horizontes válidos: "30 días", "90 días", "6 meses".`;


const tools = [
  {
    type: "function",
    function: {
      name: "update_onboarding",
      description: "Actualiza o propone valores para el formulario de onboarding. Solo incluye los campos que quieres cambiar.",
      parameters: {
        type: "object",
        properties: {
          empresa: { type: "string" },
          industria: { type: "string" },
          tamano: { type: "string" },
          objetivo: { type: "string" },
          horizonte: { type: "string" },
          prioritarias: { type: "array", items: { type: "string" } },
          herramientasSel: { type: "array", items: { type: "string" } },
          areasSetup: {
            type: "array",
            items: {
              type: "object",
              properties: {
                nombre: { type: "string" },
                cargos: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      nombre: { type: "string" },
                      tareas: { type: "string" },
                    },
                    required: ["nombre"],
                  },
                },
              },
              required: ["nombre"],
            },
          },
        },
        additionalProperties: false,
      },
    },
  },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, currentData } = await req.json();
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const stateMsg = {
      role: "system" as const,
      content: `Estado actual del formulario (JSON): ${JSON.stringify(currentData || {})}`,
    };

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM }, stateMsg, ...messages.slice(-12)],
        tools,
        max_tokens: 2500,
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      if (resp.status === 429) return new Response(JSON.stringify({ error: "rate_limit", reply: "Estoy con muchas consultas. Intenta en unos segundos." }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (resp.status === 402) return new Response(JSON.stringify({ error: "payment", reply: "Se agotaron los créditos de IA. Añade créditos en Lovable Cloud." }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`gateway ${resp.status}: ${t}`);
    }

    const data = await resp.json();
    const choice = data.choices?.[0]?.message;
    const reply = choice?.content || "";
    let patch: any = null;
    const tc = choice?.tool_calls?.[0];
    if (tc?.function?.arguments) {
      try { patch = JSON.parse(tc.function.arguments); } catch { /* ignore */ }
    }

    return new Response(JSON.stringify({ reply, patch }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message, reply: "Hubo un error. Intenta de nuevo." }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
