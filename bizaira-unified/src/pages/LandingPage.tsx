import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import OnboardingFlow from "@/components/OnboardingFlow";
import HomePage from "./HomePage";
import AuthPage from "./AuthPage";
import { safeSetItem, safeGetItem } from "@/lib/safe-storage";

type Step = "onboarding" | "auth" | "home";

const LandingPage = () => {
  const { lang } = useI18n();
  const { user, loading, profile } = useAuth();
  const navigate = useNavigate();
  const isHe = lang === "he";

  const [step, setStep] = useState<Step>("onboarding");

  useEffect(() => {
    if (loading) return;

    const onboardingComplete = safeGetItem("onboarding_complete");
    const isGuest = safeGetItem("guest_mode");

    if (user) {
      setStep("home");
    } else if (isGuest) {
      setStep("onboarding");
    } else if (onboardingComplete) {
      setStep("auth");
    } else {
      setStep("onboarding");
    }
  }, [user, loading]);

  const onOnboardingComplete = useCallback(() => {
    safeSetItem("onboarding_complete", "true");
    setStep("auth");
  }, []);

  // If user is loading, show loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading BizAIra...</p>
        </div>
      </div>
    );
  }

  // Show onboarding for new users
  if (step === "onboarding" && !user) {
    return <OnboardingFlow onComplete={onOnboardingComplete} />;
  }

  // Show auth after onboarding
  if (step === "auth") {
    return <AuthPage />;
  }

  // Show home page for authenticated users or after auth
  if (step === "home") {
    return <HomePage />;
  }

  // Fallback (should not reach here)
  return null;
};

export default LandingPage;
