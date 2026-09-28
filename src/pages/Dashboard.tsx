import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CompanyOnboarding } from "@/components/CompanyOnboarding";
import { GuidedTour } from "@/components/GuidedTour";
import { AiSearchHero } from "@/components/dashboard/AiSearchHero";
import { SkillPulse } from "@/components/dashboard/SkillPulse";

export default function Dashboard() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasResolvedOnboarding, setHasResolvedOnboarding] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const resolveOnboardingState = async () => {
      const isAdmin = user?.role === "company_admin" || user?.role === "super_admin";

      if (!user?.companyId || !isAdmin) {
        if (!isCancelled) {
          setShowOnboarding(false);
          setHasResolvedOnboarding(true);
        }
        return;
      }

      const storageKey = `onboarding_completed_${user.companyId}`;
      const completedLocally = localStorage.getItem(storageKey) === "true";

      if (completedLocally) {
        if (!isCancelled) {
          setShowOnboarding(false);
          setHasResolvedOnboarding(true);
        }
        return;
      }

      const { data: brandSettings, error } = await supabase
        .from("company_brand_settings")
        .select("id")
        .eq("company_id", user.companyId)
        .maybeSingle();

      if (isCancelled) return;

      const alreadyConfigured = Boolean(brandSettings?.id);

      if (alreadyConfigured) {
        localStorage.setItem(storageKey, "true");
      }

      setShowOnboarding(!alreadyConfigured && !error);
      setHasResolvedOnboarding(true);
    };

    setHasResolvedOnboarding(false);
    resolveOnboardingState();

    return () => {
      isCancelled = true;
    };
  }, [user?.companyId, user?.role]);

  return (
    <div>
      {showOnboarding && <CompanyOnboarding onComplete={() => setShowOnboarding(false)} />}
      {hasResolvedOnboarding && <GuidedTour disabled={showOnboarding} />}

      <AiSearchHero />

    </div>
  );
}
