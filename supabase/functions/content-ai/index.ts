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
    const { action, data } = await req.json();
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "suggest_styles") {
      systemPrompt = `Eres un experto en producción de video educativo y animación. Debes sugerir 8 estilos de animación/video para contenido educativo corporativo. Los estilos deben ser muy variados e inspirados en tendencias visuales de Pinterest y Behance. Cada vez que te llamen debes generar estilos DIFERENTES y creativos. Responde SOLO en JSON válido.`;
      userPrompt = `Dado este brief de video:
- Título: ${data.title}
- Descripción: ${data.description}
- Objetivos: ${data.objectives}
- Audiencia: ${data.target_audience}
- Duración: ${data.video_duration}

Sugiere 8 estilos visuales diferentes y creativos. Responde con un JSON array así:
[{"id":"style_1","name":"Nombre del estilo","description":"Descripción breve del look & feel","keywords":"palabra1, palabra2, palabra3","color_palette":["#hex1","#hex2","#hex3","#hex4"],"example_prompt":"Un prompt EN INGLÉS muy descriptivo para generar una imagen de referencia de este estilo aplicado ESPECÍFICAMENTE al tema: ${data.title}. Debe mostrar visualmente el contenido del curso/video."}]

IMPORTANTE: El campo example_prompt debe ser en INGLÉS, muy descriptivo del estilo visual Y RELACIONADO DIRECTAMENTE CON EL TEMA "${data.title}". Las imágenes deben representar el contenido educativo del tema, no ser genéricas. Los estilos deben ser variados: flat design, 3D cartoon, motion graphics, isométrico, cinematic, retro, acuarela, paper cut, line art, collage, gradiente, cómic, claymation, infográfico, low poly, neón, etc. Sé creativo, NO repitas los mismos estilos.`;
    } else if (action === "generate_script") {
      systemPrompt = `Eres un guionista experto en contenido educativo corporativo. Creas guiones estructurados por bloques. Responde SOLO en JSON válido.`;
      userPrompt = `Crea un guión por bloques para este video:
- Título: ${data.title}
- Descripción: ${data.description}
- Objetivos: ${data.objectives}
- Estilo visual: ${data.style_name}
- Duración estimada: ${data.video_duration}

Responde con un JSON array de bloques así:
[{"id":"block_1","title":"Título del bloque","duration":"30s","narration":"Texto de narración para este bloque","visual_notes":"Descripción de lo que se ve en pantalla","transition":"Tipo de transición al siguiente bloque"}]

Crea entre 4-8 bloques que cubran intro, desarrollo de cada objetivo, y cierre.`;
    } else if (action === "spec_assist") {
      systemPrompt = `Eres un asistente experto en diseño instruccional y producción de contenido educativo corporativo. Ayudas a los usuarios a redactar especificaciones para videos educativos.

Tu rol es:
- Sugerir títulos claros y atractivos
- Ayudar a redactar objetivos de aprendizaje medibles (verbos de Bloom)
- Proponer descripciones concisas y efectivas
- Recomendar audiencias objetivo bien segmentadas
- Dar tips sobre duración ideal según el contenido

Responde de forma breve, práctica y directa. Usa formato markdown cuando sea útil. Si el usuario te da contexto parcial, complétalo con sugerencias concretas que pueda copiar y pegar. Responde en español.`;
      
      const conversationMessages = (data.messages || []).map((m: any) => ({
        role: m.role,
        content: m.content,
      }));

      const currentFormContext = data.form ? `
Contexto actual del formulario:
- Título: ${data.form.title || "(vacío)"}
- Descripción: ${data.form.description || "(vacío)"}
- Objetivos: ${data.form.objectives || "(vacío)"}
- Audiencia: ${data.form.target_audience || "(vacío)"}
- Duración: ${data.form.video_duration || "(vacío)"}` : "";

      const response2 = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt + currentFormContext },
            ...conversationMessages,
          ],
          max_tokens: 1500,
        }),
      });

      if (!response2.ok) {
        if (response2.status === 429) {
          return new Response(JSON.stringify({ error: "Demasiadas solicitudes, intenta de nuevo." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response2.status === 402) {
          return new Response(JSON.stringify({ error: "Créditos de IA agotados." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const errText = await response2.text();
        throw new Error(`AI Gateway error: ${response2.status} - ${errText}`);
      }

      const aiData2 = await response2.json();
      const reply = aiData2.choices?.[0]?.message?.content || "No pude procesar tu solicitud.";

      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (action === "generate_style_image") {
      // Generate a single image for a style
      const imgResponse = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.1-flash-image-preview",
          prompt: `${data.prompt}. High quality reference image for corporate educational animation.`,
          n: 1,
          response_format: "b64_json",
        }),
      });
      if (!imgResponse.ok) {
        throw new Error("Image generation failed");
      }
      const imgData = await imgResponse.json();
      const b64 = imgData.data?.[0]?.b64_json;
      return new Response(JSON.stringify({ image_url: b64 ? `data:image/png;base64,${b64}` : null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      throw new Error("Unknown action: " + action);
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
          { role: "user", content: userPrompt },
        ],
        max_tokens: 5000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Demasiadas solicitudes, intenta de nuevo en un momento." }), {
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

    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || "[]";
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      content = jsonMatch[1].trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = [];
    }


    return new Response(JSON.stringify({ result: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
