import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCourses, useModules } from "@/hooks/useData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Trash2, Upload, GripVertical, Video, FileText, BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface NewCourse {
  title: string;
  description: string;
  category: string;
  duration: string;
  imageFile?: File | null;
  imagePreview?: string | null;
}

interface NewModule {
  title: string;
  type: "video" | "text" | "file";
  content: string;
  duration: string;
  file?: File | null;
}

export default function AdminCourses() {
  const { user } = useAuth();
  const { data: courses, isLoading } = useCourses();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState<NewCourse>({ title: "", description: "", category: "", duration: "", imageFile: null, imagePreview: null });
  const [saving, setSaving] = useState(false);

  // Module creation state
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [moduleCourseId, setModuleCourseId] = useState<string>("");
  const [newModule, setNewModule] = useState<NewModule>({ title: "", type: "video", content: "", duration: "", file: null });
  const [uploading, setUploading] = useState(false);

  const isAdmin = user?.role === "company_admin" || user?.role === "super_admin";

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No tienes permisos para acceder a esta página.
      </div>
    );
  }

  const handleCreateCourse = async () => {
    if (!newCourse.title || !user?.companyId) return;
    setSaving(true);
    try {
      let imageUrl: string | null = null;
      if (newCourse.imageFile) {
        const ext = newCourse.imageFile.name.split(".").pop();
        const path = `thumbnails/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("course-materials").upload(path, newCourse.imageFile);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from("course-materials").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("courses").insert({
        title: newCourse.title,
        description: newCourse.description || null,
        category: newCourse.category || null,
        duration: newCourse.duration || null,
        image_url: imageUrl,
        company_id: user.companyId,
        created_by: user.id,
      });
      if (error) throw error;
      toast({ title: "Curso creado", description: "El curso se ha creado exitosamente." });
      setNewCourse({ title: "", description: "", category: "", duration: "", imageFile: null, imagePreview: null });
      setCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("¿Estás seguro de eliminar este curso y todos sus módulos?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", courseId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Eliminado", description: "Curso eliminado correctamente." });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    }
  };

  const handleAddModule = async () => {
    if (!newModule.title || !moduleCourseId) return;
    setUploading(true);
    try {
      let contentValue = newModule.content;

      // If it's a video file, upload to storage
      if (newModule.type === "video" && newModule.file) {
        const fileExt = newModule.file.name.split(".").pop();
        const filePath = `${moduleCourseId}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("course-materials")
          .upload(filePath, newModule.file);
        if (uploadError) throw uploadError;
        contentValue = filePath;
      }

      // Get current max sort_order
      const { data: existing } = await supabase
        .from("modules")
        .select("sort_order")
        .eq("course_id", moduleCourseId)
        .order("sort_order", { ascending: false })
        .limit(1);

      const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

      const { error } = await supabase.from("modules").insert({
        course_id: moduleCourseId,
        title: newModule.title,
        type: newModule.type,
        content: contentValue || null,
        duration: newModule.duration || null,
        sort_order: nextOrder,
      });
      if (error) throw error;

      toast({ title: "Módulo agregado", description: "El módulo se ha agregado al curso." });
      setNewModule({ title: "", type: "video", content: "", duration: "", file: null });
      setModuleDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["modules", moduleCourseId] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Gestión de Cursos</h1>
          <p className="page-subtitle">Crear cursos, subir videos y gestionar módulos</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Crear Curso</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Curso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>Título *</Label>
                <Input value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="Nombre del curso" />
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} placeholder="Descripción del curso" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Categoría</Label>
                  <Input value={newCourse.category} onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })} placeholder="ej: AI, Liderazgo" />
                </div>
                <div>
                  <Label>Duración</Label>
                  <Input value={newCourse.duration} onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} placeholder="ej: 2h 30min" />
                </div>
              </div>
              {/* Thumbnail */}
              <div>
                <Label>Imagen de portada</Label>
                <label className="flex items-center gap-3 p-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors mt-1">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {newCourse.imageFile ? newCourse.imageFile.name : "Subir imagen de portada"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setNewCourse({ ...newCourse, imageFile: file, imagePreview: URL.createObjectURL(file) });
                  }} />
                </label>
                {newCourse.imagePreview && (
                  <img src={newCourse.imagePreview} alt="Preview" className="mt-2 h-24 w-full object-cover rounded-lg" />
                )}
              </div>
              <Button className="w-full" onClick={handleCreateCourse} disabled={!newCourse.title || saving}>
                {saving ? "Creando..." : "Crear Curso"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Module creation dialog */}
      <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Módulo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Título *</Label>
              <Input value={newModule.title} onChange={(e) => setNewModule({ ...newModule, title: e.target.value })} placeholder="Nombre del módulo" />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={newModule.type} onValueChange={(v: any) => setNewModule({ ...newModule, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="file">Archivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newModule.type === "video" ? (
              <div>
                <Label>Archivo de video</Label>
                <div className="mt-1.5">
                  <label className="flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {newModule.file ? newModule.file.name : "Seleccionar video (MP4, WebM, MOV)"}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => setNewModule({ ...newModule, file: e.target.files?.[0] || null })}
                    />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">O pega una URL directa al video:</p>
                <Input
                  value={newModule.content}
                  onChange={(e) => setNewModule({ ...newModule, content: e.target.value })}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            ) : (
              <div>
                <Label>Contenido</Label>
                <Textarea
                  value={newModule.content}
                  onChange={(e) => setNewModule({ ...newModule, content: e.target.value })}
                  placeholder={newModule.type === "text" ? "Escribe el contenido del módulo..." : "URL del archivo"}
                  rows={5}
                />
              </div>
            )}
            <div>
              <Label>Duración</Label>
              <Input value={newModule.duration} onChange={(e) => setNewModule({ ...newModule, duration: e.target.value })} placeholder="ej: 15 min" />
            </div>
            <Button className="w-full" onClick={handleAddModule} disabled={!newModule.title || uploading}>
              {uploading ? "Subiendo..." : "Agregar Módulo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Course list */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-muted-foreground text-center py-12">Cargando cursos...</div>
        ) : !courses?.length ? (
          <div className="card-elevated p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-base font-medium text-foreground">No hay cursos aún</h3>
            <p className="text-sm text-muted-foreground mt-1">Crea tu primer curso para empezar</p>
          </div>
        ) : (
          courses.map((course, i) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <div className="card-elevated">
                <div
                  className="p-4 flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                >
                  {expandedCourse === course.id ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{course.title}</h3>
                    <p className="text-xs text-muted-foreground">{course.category || "Sin categoría"} · {course.duration || "—"}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive shrink-0"
                    onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {expandedCourse === course.id && (
                  <CourseModuleList
                    courseId={course.id}
                    onAddModule={() => {
                      setModuleCourseId(course.id);
                      setModuleDialogOpen(true);
                    }}
                  />
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function CourseModuleList({ courseId, onAddModule }: { courseId: string; onAddModule: () => void }) {
  const { data: modules, isLoading } = useModules(courseId);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDeleteModule = async (moduleId: string) => {
    const { error } = await supabase.from("modules").delete().eq("id", moduleId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
    }
  };

  return (
    <div className="border-t border-border px-4 pb-4">
      <div className="flex items-center justify-between py-3">
        <span className="text-xs font-medium text-muted-foreground">Módulos ({modules?.length || 0})</span>
        <Button variant="outline" size="sm" onClick={onAddModule}>
          <Plus className="w-3 h-3 mr-1" /> Agregar
        </Button>
      </div>
      {isLoading ? (
        <p className="text-xs text-muted-foreground py-2">Cargando...</p>
      ) : !modules?.length ? (
        <p className="text-xs text-muted-foreground py-2">Sin módulos. Agrega el primero.</p>
      ) : (
        <div className="space-y-1.5">
          {modules.map((mod, i) => (
            <div key={mod.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-accent/50 text-sm">
              <GripVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <div className={`p-1.5 rounded shrink-0 ${mod.type === "video" ? "bg-primary/10 text-primary" : "bg-accent text-accent-foreground"}`}>
                {mod.type === "video" ? <Video className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              </div>
              <span className="flex-1 truncate text-foreground">{mod.title}</span>
              <span className="text-xs text-muted-foreground shrink-0">{mod.duration || "—"}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-destructive hover:text-destructive shrink-0"
                onClick={() => handleDeleteModule(mod.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
