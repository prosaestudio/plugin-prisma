import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, Users, BookOpen, Award } from "lucide-react";
import { useUsers, useCourses, useQuizzes } from "@/hooks/useData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fadeIn = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };
const COLORS = ["hsl(230, 80%, 58%)", "hsl(160, 60%, 45%)", "hsl(45, 90%, 55%)", "hsl(340, 70%, 55%)"];

export default function Analytics() {
  const { data: users } = useUsers();
  const { data: courses } = useCourses();
  const { data: quizzes } = useQuizzes();

  const { data: quizResults } = useQuery({
    queryKey: ["all-quiz-results"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quiz_results").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["all-progress"],
    queryFn: async () => {
      const { data, error } = await supabase.from("progress_tracking").select("*");
      if (error) throw error;
      return data;
    },
  });

  const totalUsers = users?.length || 0;
  const totalCourses = courses?.length || 0;
  const totalQuizzes = quizzes?.length || 0;

  const completedModules = progress?.filter((p) => p.completed)?.length || 0;
  const totalModules = progress?.length || 1;
  const completionRate = Math.round((completedModules / totalModules) * 100) || 0;

  const avgQuizScore = quizResults?.length
    ? Math.round(quizResults.reduce((a, r) => a + (r.total_questions > 0 ? (r.score / r.total_questions) * 100 : 0), 0) / quizResults.length)
    : 0;

  // Group quiz results by course (via quiz)
  const courseCategories = courses?.reduce((acc: Record<string, number>, c) => {
    const cat = c.category || "Sin categoría";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {}) || {};

  const pieData = Object.entries(courseCategories).map(([name, value]) => ({ name, value }));

  // Simple weekly-like data from quiz results by day
  const recentResults = (quizResults || []).slice(-50);
  const dayMap: Record<string, { intentos: number; promedio: number; count: number }> = {};
  recentResults.forEach((r) => {
    const day = r.completed_at?.split("T")[0] || "—";
    if (!dayMap[day]) dayMap[day] = { intentos: 0, promedio: 0, count: 0 };
    dayMap[day].intentos++;
    dayMap[day].promedio += r.total_questions > 0 ? (r.score / r.total_questions) * 100 : 0;
    dayMap[day].count++;
  });
  const chartData = Object.entries(dayMap).map(([name, d]) => ({
    name: name.slice(5),
    intentos: d.intentos,
    promedio: Math.round(d.promedio / d.count),
  })).slice(-7);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analíticas</h1>
        <p className="page-subtitle">Métricas reales de aprendizaje y participación</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { title: "Usuarios", value: totalUsers, icon: Users },
          { title: "Total Cursos", value: totalCourses, icon: BookOpen },
          { title: "Tasa de Completado", value: `${completionRate}%`, icon: TrendingUp },
          { title: "Promedio Quiz", value: `${avgQuizScore}%`, icon: Award },
        ].map((stat, i) => (
          <motion.div key={stat.title} variants={fadeIn} initial="initial" animate="animate" transition={{ delay: i * 0.05 }} className="card-stat">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1 text-foreground">{stat.value}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-accent">
                <stat.icon className="w-5 h-5 text-accent-foreground" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div variants={fadeIn} initial="initial" animate="animate" transition={{ delay: 0.2 }} className="card-elevated p-6">
          <h3 className="text-base font-semibold mb-4 text-foreground">Intentos de Quiz por Día</h3>
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="intentos" fill="hsl(230, 80%, 58%)" radius={[4, 4, 0, 0]} name="Intentos" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground py-12 text-center">Aún no hay datos de quizzes</p>
          )}
        </motion.div>

        <motion.div variants={fadeIn} initial="initial" animate="animate" transition={{ delay: 0.25 }} className="card-elevated p-6">
          <h3 className="text-base font-semibold mb-4 text-foreground">Cursos por Categoría</h3>
          {pieData.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground py-12 text-center">Aún no hay cursos</p>
          )}
        </motion.div>

        <motion.div variants={fadeIn} initial="initial" animate="animate" transition={{ delay: 0.3 }} className="card-elevated p-6 lg:col-span-2">
          <h3 className="text-base font-semibold mb-4 text-foreground">Resumen de Evaluaciones</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-muted-foreground font-medium">Quiz</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Intentos</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Promedio</th>
                </tr>
              </thead>
              <tbody>
                {(quizzes || []).map((q: any) => {
                  const results = (quizResults || []).filter((r) => r.quiz_id === q.id);
                  const avg = results.length
                    ? Math.round(results.reduce((a, r) => a + (r.total_questions > 0 ? (r.score / r.total_questions) * 100 : 0), 0) / results.length)
                    : 0;
                  return (
                    <tr key={q.id} className="border-b border-border last:border-0">
                      <td className="p-3 text-foreground">{q.title}</td>
                      <td className="p-3 text-muted-foreground">{results.length}</td>
                      <td className="p-3"><span className={`font-medium ${avg >= 70 ? "text-green-600" : "text-amber-600"}`}>{avg}%</span></td>
                    </tr>
                  );
                })}
                {!quizzes?.length && (
                  <tr><td colSpan={3} className="p-3 text-center text-muted-foreground">Sin quizzes aún</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
