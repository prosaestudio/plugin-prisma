import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import OnboardingAdmin from "./pages/OnboardingAdmin";
import OnboardingColaborador from "./pages/OnboardingColaborador";

import DashboardPrisma from "./pages/nexia/DashboardNexia";
import DiagnosticoOverview from "./pages/nexia/DiagnosticoOverview";
import Integraciones from "./pages/nexia/Integraciones";
import AreasPage from "./pages/nexia/AreasPage";
import AreaDetalle from "./pages/nexia/AreaDetalle";
import ColaboradoresGrid from "./pages/nexia/ColaboradoresGrid";
import RolesPage from "./pages/nexia/RolesPage";
import HuntingOverview from "./pages/nexia/HuntingOverview";
import Requerimientos from "./pages/nexia/Requerimientos";
import CandidatosKanban from "./pages/nexia/CandidatosKanban";
import CandidatoDetalle from "./pages/nexia/CandidatoDetalle";
import UpskillingOverview from "./pages/nexia/UpskillingOverview";
import RutaDetalle from "./pages/nexia/RutaDetalle";
import UpskillingColaboradores from "./pages/nexia/UpskillingColaboradores";
import AgenteIA from "./pages/nexia/AgenteIA";
import Configuracion from "./pages/nexia/Configuracion";
import FlujosPage from "./pages/nexia/FlujosPage";
import Seguridad from "./pages/nexia/Seguridad";
import MiEspacio from "./pages/nexia/MiEspacio";
import MiAprendizaje from "./pages/nexia/MiAprendizaje";

// Prisma Admin — nuevo
import AdminHome from "./pages/admin/PluginAdmin";
import DocsLibrary from "./pages/admin/DocsLibrary";
import DocsUpload from "./pages/admin/DocsUpload";
import DocsConnectors from "./pages/admin/DocsConnectors";
import DocsApprovals from "./pages/admin/DocsApprovals";
import DocsHealth from "./pages/admin/DocsHealth";
import DocDetail from "./pages/admin/DocDetail";
import InsightsTopics from "./pages/admin/InsightsTopics";
import InsightsDocHealth from "./pages/admin/InsightsDocHealth";
import InsightsActivity from "./pages/admin/InsightsActivity";
import InsightsLearning from "./pages/admin/InsightsLearning";
import Simulator from "./pages/admin/Simulator";
import GovernanceRoles from "./pages/admin/GovernanceRoles";
import GovernanceReports from "./pages/admin/GovernanceReports";
import { useViewMode } from "@/lib/view-mode";

const DashboardSwitch = () => {
  const [mode] = useViewMode();
  return mode === "user" ? <DashboardPrisma /> : <AdminHome />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding" element={<OnboardingAdmin />} />
            <Route path="/onboarding-colaborador" element={<OnboardingColaborador />} />

            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardSwitch />} />
              <Route path="/me" element={<MiEspacio />} />
              <Route path="/me/aprendizaje" element={<MiAprendizaje />} />

              {/* Prisma Admin — Gestión documental */}
              <Route path="/docs" element={<DocsLibrary />} />
              <Route path="/docs/upload" element={<DocsUpload />} />
              <Route path="/docs/connectors" element={<DocsConnectors />} />
              <Route path="/docs/approvals" element={<DocsApprovals />} />
              <Route path="/docs/health" element={<DocsHealth />} />
              <Route path="/docs/:id" element={<DocDetail />} />

              {/* Prisma Admin — Indicadores */}
              <Route path="/insights/topics" element={<InsightsTopics />} />
              <Route path="/insights/doc-health" element={<InsightsDocHealth />} />
              <Route path="/insights/activity" element={<InsightsActivity />} />
              <Route path="/insights/learning" element={<InsightsLearning />} />

              {/* Prisma Admin — Herramientas & Gobernanza */}
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/governance/roles" element={<GovernanceRoles />} />
              <Route path="/governance/reports" element={<GovernanceReports />} />

              {/* Rutas legacy (mantengo para compatibilidad) */}
              <Route path="/diagnostico" element={<DiagnosticoOverview />} />
              <Route path="/diagnostico/integraciones" element={<Integraciones />} />
              <Route path="/diagnostico/areas" element={<AreasPage />} />
              <Route path="/diagnostico/areas/:id" element={<AreaDetalle />} />
              <Route path="/diagnostico/colaboradores" element={<ColaboradoresGrid />} />
              <Route path="/diagnostico/colaboradores/:id" element={<Navigate to="/diagnostico/areas" replace />} />
              <Route path="/diagnostico/roles" element={<RolesPage />} />

              <Route path="/hunting" element={<HuntingOverview />} />
              <Route path="/hunting/requerimientos" element={<Requerimientos />} />
              <Route path="/hunting/candidatos" element={<CandidatosKanban />} />
              <Route path="/hunting/candidatos/:id" element={<CandidatoDetalle />} />

              <Route path="/upskilling" element={<UpskillingOverview />} />
              <Route path="/upskilling/rutas" element={<UpskillingOverview />} />
              <Route path="/upskilling/rutas/:id" element={<RutaDetalle />} />
              <Route path="/upskilling/colaboradores" element={<UpskillingColaboradores />} />
              <Route path="/upskilling/agente" element={<AgenteIA />} />

              <Route path="/flujos" element={<FlujosPage />} />
              <Route path="/seguridad" element={<Seguridad />} />

              <Route path="/configuracion" element={<Configuracion />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
