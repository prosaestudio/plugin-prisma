import { useParams, Link } from "react-router-dom";
import { useCourse, useModules } from "@/hooks/useData";
import { getCourseImage } from "@/lib/course-images";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, Play, FileText, Download, CheckCircle2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function CourseViewer() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: course } = useCourse(id || "");
  const { data: modules } = useModules(id || "");
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [videoPositions, setVideoPositions] = useState<Record<string, number>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const queryClient = useQueryClient();
  const lastSavedPosition = useRef(0);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("progress_tracking")
      .select("module_id, completed, video_position")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) {
          setCompletedIds(new Set(data.filter((d) => d.completed).map((d) => d.module_id)));
          const positions: Record<string, number> = {};
          data.forEach((d) => {
            if (d.video_position) positions[d.module_id] = Number(d.video_position);
          });
          setVideoPositions(positions);
        }
      });
  }, [user?.id]);

  // Restore video position when switching modules
  useEffect(() => {
    if (activeModule && videoRef.current && videoPositions[activeModule]) {
      videoRef.current.currentTime = videoPositions[activeModule];
    }
    lastSavedPosition.current = 0;
  }, [activeModule]);

  const saveVideoPosition = useCallback(async (moduleId: string, position: number, duration: number) => {
    if (!user?.id) return;
    // Only save every 5 seconds to avoid spam
    if (Math.abs(position - lastSavedPosition.current) < 5) return;
    lastSavedPosition.current = position;

    await supabase.from("progress_tracking").upsert({
      user_id: user.id,
      module_id: moduleId,
      video_position: position,
      video_duration: duration,
      completed: false,
    }, { onConflict: "user_id,module_id" });
  }, [user?.id]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current || !activeModule) return;
    const { currentTime, duration } = videoRef.current;
    saveVideoPosition(activeModule, currentTime, duration);
  }, [activeModule, saveVideoPosition]);

  const handleVideoEnded = useCallback(async () => {
    if (!activeModule) return;
    await markComplete(activeModule);
  }, [activeModule]);

  const activeModuleData = modules?.find((m) => m.id === activeModule);
  const completedCount = modules?.filter((m) => completedIds.has(m.id)).length || 0;
  const totalCount = modules?.length || 1;
  const progress = Math.round((completedCount / totalCount) * 100);

  const markComplete = async (moduleId: string) => {
    if (!user?.id) return;
    await supabase.from("progress_tracking").upsert({
      user_id: user.id,
      module_id: moduleId,
      completed: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,module_id" });
    setCompletedIds((prev) => new Set([...prev, moduleId]));
    queryClient.invalidateQueries({ queryKey: ["progress"] });
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "video": return <Play className="w-4 h-4" />;
      case "file": return <Download className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getVideoUrl = (content: string | null) => {
    if (!content) return null;
    // If it's already a full URL, return as-is
    if (content.startsWith("http")) return content;
    // Otherwise assume it's a storage path
    const { data } = supabase.storage.from("course-materials").getPublicUrl(content);
    return data.publicUrl;
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Cargando curso...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a Cursos
      </Link>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {/* Course header with cover */}
        <div className="card-elevated overflow-hidden mb-6">
          <div className="relative h-48 md:h-56">
            <img
              src={getCourseImage(course)}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-xs font-medium text-white/80 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">{course.category}</span>
              <h1 className="text-2xl font-semibold mt-2 text-white">{course.title}</h1>
              {course.description && <p className="text-white/70 text-sm mt-1 line-clamp-2">{course.description}</p>}
            </div>
          </div>
          <div className="p-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">{completedCount} de {totalCount} módulos completados</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content area */}
          <div className="lg:col-span-2">
            {activeModuleData ? (
              <motion.div key={activeModule} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-elevated overflow-hidden">
                {activeModuleData.type === "video" && activeModuleData.content ? (
                  <div className="aspect-video bg-black">
                    <video
                      ref={videoRef}
                      src={getVideoUrl(activeModuleData.content) || ""}
                      className="w-full h-full"
                      controls
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={handleVideoEnded}
                      onLoadedMetadata={() => {
                        if (videoRef.current && activeModule && videoPositions[activeModule]) {
                          videoRef.current.currentTime = videoPositions[activeModule];
                        }
                      }}
                    />
                  </div>
                ) : null}

                <div className="p-6">
                  <h2 className="text-lg font-semibold text-foreground">{activeModuleData.title}</h2>
                  <span className="text-xs text-muted-foreground capitalize">{activeModuleData.type} · {activeModuleData.duration}</span>

                  {activeModuleData.type === "text" && activeModuleData.content && (
                    <div className="mt-4 text-sm text-foreground leading-relaxed whitespace-pre-line">
                      {activeModuleData.content}
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    {!completedIds.has(activeModuleData.id) ? (
                      <Button onClick={() => markComplete(activeModuleData.id)}>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Marcar como completado
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Completado
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="card-elevated p-12 flex flex-col items-center justify-center text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-base font-medium text-foreground">Selecciona un módulo</h3>
                <p className="text-sm text-muted-foreground mt-1">Elige un módulo del panel lateral para comenzar</p>
              </div>
            )}
          </div>

          {/* Module list */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground mb-3">Módulos del curso</h3>
            {modules?.map((mod, i) => {
              const isCompleted = completedIds.has(mod.id);
              const isActive = activeModule === mod.id;
              return (
                <motion.button
                  key={mod.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setActiveModule(mod.id)}
                  className={`w-full card-elevated p-3.5 flex items-center gap-3 text-left transition-all ${
                    isActive ? "ring-2 ring-primary" : ""
                  } ${isCompleted ? "opacity-70" : ""}`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${
                    isCompleted ? "bg-success/10 text-success" : isActive ? "bg-primary/10 text-primary" : "bg-accent text-accent-foreground"
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : typeIcon(mod.type)}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {mod.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{mod.type} · {mod.duration}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
