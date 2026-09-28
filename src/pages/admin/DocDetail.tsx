import { useParams, Link } from "react-router-dom";
import { SectionHeader } from "@/components/nexia/primitives";
import { documentos, faqsSugeridas } from "@/lib/prisma-admin-mock";
import { ArrowLeft, PlayCircle, Sparkles, History } from "lucide-react";

export default function DocDetail() {
  const { id } = useParams();
  const doc = documentos.find((d) => d.id === id);
  if (!doc) return (
    <div className="p-8">
      <Link to="/docs" className="text-sm text-muted-foreground">← Volver a biblioteca</Link>
      <div className="mt-6">Documento no encontrado.</div>
    </div>
  );

  const versiones = [
    { v: doc.version, fecha: doc.actualizado, autor: doc.autor, activa: true },
    { v: "v4.1", fecha: "2026-02-05", autor: doc.autor, activa: false },
    { v: "v4.0", fecha: "2025-10-11", autor: doc.autor, activa: false },
  ];
  const faqs = faqsSugeridas.filter((f) => f.doc === doc.id);

  return (
    <div className="space-y-6">
      <Link to="/docs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Volver a biblioteca
      </Link>

      <SectionHeader
        title={doc.titulo}
        subtitle={`${doc.area} · ${doc.proceso} · ${doc.tipo} · ${doc.idioma}${doc.maquina ? ` · ${doc.maquina}` : ""}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card-elevated p-5">
            <h3 className="font-medium mb-3">Metadata</h3>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><dt className="text-xs text-muted-foreground">Estado</dt><dd className="font-medium capitalize">{doc.estado}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Versión</dt><dd className="font-medium">{doc.version}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Criticidad</dt><dd className="font-medium">{doc.criticidad}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Autor</dt><dd className="font-medium">{doc.autor}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Actualizado</dt><dd className="font-medium">{doc.actualizado}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Próx. revisión</dt><dd className="font-medium">{doc.proximaRevision}</dd></div>
            </dl>
          </div>

          {doc.videoVinculado && (
            <div className="card-elevated p-5">
              <h3 className="font-medium mb-3">Material audiovisual vinculado</h3>
              <div className="rounded-xl border border-border p-4 flex items-center gap-3">
                <PlayCircle className="w-8 h-8" />
                <div>
                  <div className="font-medium text-sm">{doc.videoVinculado}</div>
                  <div className="text-xs text-muted-foreground">Duración 4:12 · vinculado manualmente</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> Prisma sugiere además: "Cambio de formato — variantes especiales"
              </div>
            </div>
          )}

          {faqs.length > 0 && (
            <div className="card-elevated p-5">
              <h3 className="font-medium mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4" /> FAQs generadas</h3>
              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <div key={i} className="rounded-xl border border-border p-3">
                    <div className="font-medium text-sm">{f.q}</div>
                    <div className="text-xs text-muted-foreground mt-1">{f.a}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card-elevated p-5">
            <h3 className="font-medium mb-3 flex items-center gap-2"><History className="w-4 h-4" /> Historial de versiones</h3>
            <div className="space-y-2">
              {versiones.map((v) => (
                <div key={v.v} className="flex items-center justify-between text-sm border-b border-border last:border-0 py-2">
                  <div>
                    <div className="font-medium">{v.v} {v.activa && <span className="ml-2 text-[10px] uppercase px-1.5 py-0.5 rounded bg-success/10 text-success">activa</span>}</div>
                    <div className="text-xs text-muted-foreground">{v.fecha} · {v.autor}</div>
                  </div>
                  {!v.activa && <button className="text-xs text-muted-foreground hover:text-foreground">Ver</button>}
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">Al publicar una versión nueva, la anterior se marca automáticamente como obsoleta.</div>
          </div>

          <div className="card-elevated p-5">
            <h3 className="font-medium mb-3">Uso del agente</h3>
            <div className="text-4xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>{doc.usos30d}</div>
            <div className="text-xs text-muted-foreground">consultas en los últimos 30 días</div>
          </div>
        </div>
      </div>
    </div>
  );
}
