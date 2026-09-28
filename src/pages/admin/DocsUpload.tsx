import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "@/components/nexia/primitives";
import { faqsSugeridas } from "@/lib/prisma-admin-mock";
import { UploadCloud, FileText, CheckCircle2, Loader2, AlertTriangle, Sparkles, FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Etapa = "subido" | "indexando" | "publicado" | "error";
interface Fila { id: string; name: string; size: number; etapa: Etapa; progress: number; }

export default function DocsUpload() {
  const [dragOver, setDragOver] = useState(false);
  const [items, setItems] = useState<Fila[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  const acceptFiles = (files: FileList | null) => {
    if (!files) return;
    const nuevos: Fila[] = Array.from(files).map((f, i) => ({
      id: `${Date.now()}-${i}-${f.name}`,
      name: (f as any).webkitRelativePath || f.name,
      size: f.size,
      etapa: "subido",
      progress: 5,
    }));
    setItems((prev) => [...nuevos, ...prev]);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setItems((prev) =>
        prev.map((it) => {
          if (it.etapa === "publicado" || it.etapa === "error") return it;
          const p = Math.min(100, it.progress + 6 + Math.random() * 10);
          let etapa: Etapa = it.etapa;
          if (p > 35 && etapa === "subido") etapa = "indexando";
          if (p >= 100) etapa = Math.random() < 0.08 ? "error" : "publicado";
          return { ...it, progress: p, etapa };
        }),
      );
    }, 700);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Cargar documentos"
        subtitle="Arrastra archivos o carpetas completas. Prisma los indexa y sugiere FAQs automáticamente."
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); acceptFiles(e.dataTransfer.files); }}
        className={cn(
          "card-elevated border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors",
          dragOver ? "border-foreground bg-muted/40" : "border-border",
        )}
      >
        <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
        <div className="text-lg font-medium">Suelta aquí tus archivos o carpetas</div>
        <div className="text-sm text-muted-foreground mt-1">PDF, DOCX, PPTX, MP4, MOV, XLSX — hasta 500MB c/u</div>
        <div className="mt-5 flex flex-wrap items-center gap-3 justify-center">
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-foreground text-background text-sm font-medium"
          >
            <FileText className="w-4 h-4" /> Seleccionar archivos
          </button>
          <button
            onClick={() => folderRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border border-border bg-background text-sm font-medium hover:bg-muted"
          >
            <FolderPlus className="w-4 h-4" /> Seleccionar carpeta
          </button>
          <input ref={fileRef} type="file" multiple hidden onChange={(e) => acceptFiles(e.target.files)} />
          <input
            ref={folderRef}
            type="file"
            hidden
            multiple
            // @ts-expect-error webkitdirectory
            webkitdirectory=""
            directory=""
            onChange={(e) => acceptFiles(e.target.files)}
          />
        </div>
      </div>

      {items.length > 0 && (
        <div className="card-elevated overflow-hidden">
          <div className="px-4 py-3 border-b border-border text-sm font-medium">Pipeline de procesamiento</div>
          <div className="divide-y divide-border">
            {items.map((it) => (
              <div key={it.id} className="px-4 py-3 flex items-center gap-4">
                <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{it.name}</div>
                  <div className="mt-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all rounded-full",
                        it.etapa === "error" ? "bg-destructive" : it.etapa === "publicado" ? "bg-success" : "bg-foreground",
                      )}
                      style={{ width: `${it.progress}%` }}
                    />
                  </div>
                </div>
                <div className="w-32 text-xs flex items-center gap-2 justify-end">
                  {it.etapa === "publicado" && <><CheckCircle2 className="w-3.5 h-3.5 text-success" /> Publicado</>}
                  {it.etapa === "indexando" && <><Loader2 className="w-3.5 h-3.5 animate-spin text-warning" /> Indexando</>}
                  {it.etapa === "subido" && <><Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" /> Subiendo</>}
                  {it.etapa === "error" && <><AlertTriangle className="w-3.5 h-3.5 text-destructive" /> Error</>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card-elevated p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4" />
          <h3 className="font-medium">FAQs sugeridas por IA</h3>
          <span className="text-xs text-muted-foreground ml-1">— editables antes de publicar</span>
        </div>
        <div className="space-y-4">
          {faqsSugeridas.map((f, i) => (
            <div key={i} className="rounded-xl border border-border p-4 space-y-2">
              <Input defaultValue={f.q} className="rounded-lg font-medium" />
              <Textarea defaultValue={f.a} className="rounded-lg text-sm min-h-[72px]" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Fuente sugerida: <span className="font-medium text-foreground">{f.doc}</span></span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded-lg border border-border hover:bg-muted">Descartar</button>
                  <button className="px-3 py-1 rounded-lg bg-foreground text-background">Aprobar FAQ</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
