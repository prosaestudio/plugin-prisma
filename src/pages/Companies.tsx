import { useCompanies } from "@/hooks/useData";
import { mockCompanies } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Building2, Users, BookOpen, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Companies() {
  const { data: dbCompanies } = useCompanies();
  const companies = dbCompanies?.length ? dbCompanies : mockCompanies;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Empresas</h1>
          <p className="page-subtitle">Gestionar organizaciones</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Agregar Empresa</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {companies.map((company: any, i: number) => (
          <motion.div key={company.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-elevated p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <Building2 className="w-6 h-6 text-accent-foreground" />
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
            <h3 className="text-base font-semibold text-foreground">{company.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{company.domain || company.createdAt}</p>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {company.userCount ?? 0} usuarios</span>
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {company.activeCourses ?? 0} cursos</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
