import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, scenario, mode, userName } = await req.json();

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    let systemPrompt = "";

    if (mode === "simulation") {
      systemPrompt = `Eres un actor de simulación profesional para entrenamiento corporativo. Estás interpretando un role-play de "${scenario.title}" en la categoría "${scenario.category}".

CONTEXTO DEL ESCENARIO: ${scenario.context || scenario.description}

TU ROL: ${scenario.aiRole || "el interlocutor en la simulación"}
El usuario (${userName || "el participante"}) practica: ${scenario.userRole || "la habilidad correspondiente"}.

REGLAS:
- Actúa de forma realista y desafiante pero justa
- Responde en español con tono profesional
- Mantén tus respuestas cortas (2-4 oraciones máximo)
- Reacciona de forma natural a lo que dice el usuario
- Si el usuario comete errores, no los corrijas directamente — simplemente reacciona como lo haría una persona real
- Después de 6-8 intercambios, busca cerrar la conversación naturalmente
- NUNCA rompas el personaje ni menciones que eres IA`;
    } else if (mode === "feedback") {
      systemPrompt = `Eres un evaluador experto en habilidades blandas corporativas. Analiza la siguiente conversación de role-play y devuelve un feedback estructurado.

El escenario era: "${scenario.title}" - ${scenario.description}
El usuario practicaba: ${scenario.userRole || "habilidades de comunicación"}

Devuelve tu evaluación en el siguiente formato JSON exacto (sin markdown, solo JSON puro):
{
  "overall_score": <número del 1 al 100>,
  "dimensions": [
    {"name": "Empatía", "score": <1-100>, "comment": "<1 oración>"},
    {"name": "Claridad", "score": <1-100>, "comment": "<1 oración>"},
    {"name": "Manejo de objeciones", "score": <1-100>, "comment": "<1 oración>"},
    {"name": "Profesionalismo", "score": <1-100>, "comment": "<1 oración>"},
    {"name": "Resolución", "score": <1-100>, "comment": "<1 oración>"}
  ],
  "strengths": ["<fortaleza 1>", "<fortaleza 2>"],
  "improvements": ["<mejora 1>", "<mejora 2>"],
  "summary": "<resumen de 2-3 oraciones>"
}`;
    } else if (mode === "microlearning") {
      systemPrompt = `Eres un instructor de microlearning corporativo. Genera una píldora de aprendizaje breve (2-3 minutos de lectura) sobre el tema solicitado.

Formato de respuesta (JSON puro, sin markdown):
{
  "title": "<título atractivo>",
  "duration": "2 min",
  "sections": [
    {"type": "intro", "content": "<1-2 oraciones introductorias>"},
    {"type": "key_points", "points": ["<punto 1>", "<punto 2>", "<punto 3>"]},
    {"type": "example", "content": "<ejemplo práctico breve>"},
    {"type": "tip", "content": "<tip accionable>"},
    {"type": "quiz", "question": "<pregunta de repaso>", "options": ["<a>", "<b>", "<c>"], "correct": 0}
  ]
}`;
    } else if (mode === "course_generator") {
      systemPrompt = `Eres un diseñador instruccional experto. A partir del contenido proporcionado, genera la estructura de un curso completo.

Devuelve JSON puro (sin markdown):
{
  "title": "<título del curso>",
  "description": "<descripción de 2-3 oraciones>",
  "category": "<categoría>",
  "duration": "<duración estimada>",
  "modules": [
    {
      "title": "<título del módulo>",
      "type": "text",
      "duration": "<duración>",
      "content": "<contenido detallado del módulo (3-5 párrafos)>"
    }
  ],
  "quizzes": [
    {
      "question": "<pregunta>",
      "options": ["<a>", "<b>", "<c>", "<d>"],
      "correct": "<respuesta correcta>",
      "explanation": "<explicación>"
    }
  ]
}

Genera entre 3-6 módulos y 5-8 preguntas de quiz.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-20),
        ],
        max_tokens: mode === "course_generator" ? 4000 : (mode === "feedback" || mode === "microlearning" ? 2000 : 500),
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Intenta en unos segundos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA agotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      throw new Error(`AI Gateway error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});