import { motion } from "framer-motion";
import { BookOpen, Clock, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const programs = [
  { id: "p1", title: "Ruta de Fundamentos de IA", courses: 4, totalDuration: "12h", enrolled: 34, progress: 45, description: "Programa completo de alfabetización en IA para todos los empleados" },
  { id: "p2", title: "Fundamentos de Cumplimiento", courses: 3, totalDuration: "6h", enrolled: 89, progress: 78, description: "Capacitación de cumplimiento requerida para nuevos empleados" },
  { id: "p3", title: "Desarrollo de Liderazgo", courses: 5, totalDuration: "15h", enrolled: 12, progress: 30, description: "Habilidades avanzadas de liderazgo para gerentes" },
];

export default function Programs() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Programas de Aprendizaje</h1>
        <p className="page-subtitle">Rutas de aprendizaje estructuradas para tu equipo</p>
      </div>

      <div className="space-y-4">
        {programs.map((program, i) => (
          <motion.div
            key={program.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card-elevated p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground">{program.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{program.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {program.courses} cursos</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {program.totalDuration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {program.enrolled} inscritos</span>
                </div>
              </div>
              <div className="w-full sm:w-48">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium text-foreground">{program.progress}%</span>
                </div>
                <Progress value={program.progress} className="h-2" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
