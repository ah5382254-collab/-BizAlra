import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import OnboardingFlow from "@/components/OnboardingFlow";
import HomePage from "./HomePage";

type Step = "onboarding" | "home" | "auth";

const LandingPage = () => {
  const { lang } = useI18n();
  const { user, loading, profile } = useAuth();
  const navigate = useNavigate();
  const isHe = lang === "he";

  const [step, setStep] = useState<Step>("onboarding");

  useEffect(() => {
    // If already authenticated, skip onboarding and go to home
    if (!loading && user) {
      setStep("home");
    }
  }, [user, loading]);

  const onOnboardingComplete = useCallback(() => {
    // After onboarding, user can either:
    // 1. Continue as guest (go to home but still guest)
    // 2. Continue with login/signup (show auth page)
    setStep("home");
  }, []);

  // If user is loading, show nothing
  if (loading) {
    return null;
  }

  // Show onboarding for guests only
  if (step === "onboarding" && !user) {
    return <OnboardingFlow onComplete={onOnboardingComplete} />;
  }

  // Show home page for both guests (after onboarding) and authenticated users
  if (step === "home") {
    return <HomePage />;
  }

  // Fallback (should not reach here)
  return null;
};

export default LandingPage;
