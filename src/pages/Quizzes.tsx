import { useQuizzes } from "@/hooks/useData";
import { mockQuizzes } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Plus, ClipboardCheck, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Quizzes() {
  const { user } = useAuth();
  const isAdmin = user?.role !== "learner";
  const { data: dbQuizzes } = useQuizzes();

  const quizzes = dbQuizzes?.length
    ? dbQuizzes.map((q: any) => ({
        id: q.id,
        title: q.title,
        courseTitle: q.courses?.title || "",
        type: q.type,
        questions: 5,
        avgScore: 0,
        attempts: 0,
      }))
    : mockQuizzes;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Quizzes</h1>
          <p className="page-subtitle">{isAdmin ? "Gestiona las evaluaciones" : "Tus evaluaciones"}</p>
        </div>
        {isAdmin && (
          <Button><Plus className="w-4 h-4 mr-2" />Crear Quiz</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {quizzes.map((quiz: any, i: number) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-elevated p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-accent">
                <ClipboardCheck className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-md bg-secondary text-secondary-foreground capitalize">
                {(quiz.type || "").replace("_", " ")}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-foreground">{quiz.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{quiz.courseTitle}</p>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ClipboardCheck className="w-3.5 h-3.5" /> {quiz.questions} preguntas
              </span>
            </div>

            <Link to={`/quizzes/${quiz.id}`}>
              <Button variant="outline" size="sm" className="w-full mt-4">
                {isAdmin ? "Ver Resultados" : "Realizar Quiz"}
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
