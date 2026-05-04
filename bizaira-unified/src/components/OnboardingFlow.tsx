import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { safeSetItem, safeSetSessionItem, safeGetSessionItem } from "@/lib/safe-storage";
import { toast } from "sonner";
import { createGuestSession, updateGuestSession, saveGuestOnboardingAnswers } from "@/lib/guest-session";
import {
  ArrowLeft, Check,
  ShoppingBag, Utensils, Star, Home, Monitor, Briefcase,
  Heart, GraduationCap, MoreHorizontal,
  Users, Baby, User, UserCheck, Building, PartyPopper, Globe,
  TrendingUp, Megaphone, Share2, Award, Clock, UserPlus,
} from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
}

type Step = "greeting" | "language" | "business" | "business-info" | "audience" | "audience-info" | "goal" | "done" | "guest-auth-choice";

type LangOption = {
  label: string;
  value: "en" | "he";
};

const NAVY = "#001830";
const GOLD = "#001830"; // Changed to navy
const CREAM = "hsl(45 20% 95%)";
const OFF_WHITE = "hsl(220 25% 98%)";
const DARK_GRAY = "hsl(220 12% 35%)";
const MID_GRAY = "hsl(220 12% 50%)";
const LIGHT_GRAY = "hsl(220 16% 92%)";

const languageOptions: LangOption[] = [
  { label: "English", value: "en" },
];

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { lang, setLang } = useI18n();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>("greeting");
  const [selectedLanguage, setSelectedLanguage] = useState<LangOption | null>(
    languageOptions.find((option) => option.value === lang) ?? null
  );
  const [businessType, setBusinessType] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");

  const businessTypes = [
    { label: "Fashion", Icon: ShoppingBag },
    { label: "Food", Icon: Utensils },
    { label: "Beauty", Icon: Star },
    { label: "Real Estate", Icon: Home },
    { label: "Digital", Icon: Monitor },
    { label: "Services", Icon: Briefcase },
    { label: "Health", Icon: Heart },
    { label: "Education", Icon: GraduationCap },
    { label: "Other", Icon: MoreHorizontal },
  ];

  const audiences = [
    { label: "Teens", Icon: Baby },
    { label: "Adults", Icon: User },
    { label: "Women", Icon: Users },
    { label: "Men", Icon: UserCheck },
    { label: "Businesses (B2B)", Icon: Building },
    { label: "Parents", Icon: PartyPopper },
    { label: "General", Icon: Globe },
  ];

  const goals = [
    { label: "More Sales", Icon: TrendingUp },
    { label: "More Exposure", Icon: Megaphone },
    { label: "Social Content", Icon: Share2 },
    { label: "Professional Branding", Icon: Award },
    { label: "Save Time", Icon: Clock },
    { label: "Attract Clients", Icon: UserPlus },
  ];

  const handleLanguageSelect = (option: LangOption) => {
    setSelectedLanguage(option);
    setLang(option.value);
  };

  useEffect(() => {
    const currentSelection = languageOptions.find((option) => option.value === lang) ?? null;
    if (currentSelection?.value !== selectedLanguage?.value) {
      setSelectedLanguage(currentSelection);
    }
  }, [lang]);

  const getStepNumber = (): number => {
    switch (step) {
      case "language": return 1;
      case "business": case "business-info": return 2;
      case "audience": case "audience-info": return 3;
      case "goal": return 4;
      default: return 0;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
      style={{
        backgroundColor: CREAM,
        backgroundImage: "radial-gradient(circle at top right, rgba(5,10,20,0.03) 1px, transparent 1px), radial-gradient(circle at bottom left, rgba(5,10,20,0.02) 1px, transparent 1px)",
        backgroundSize: "72px 72px, 96px 96px",
      }}
      dir="ltr"
    >
      <div className="w-full max-w-2xl" style={{
        borderRadius: "24px",
        border: `1px solid hsla(222 47% 8% / 0.1)`,
        backgroundColor: "hsl(0 0% 100%)",
        boxShadow: "0 32px 80px -40px rgba(5, 10, 20, 0.42)",
        backdropFilter: "blur(20px)",
        padding: "48px 40px",
      }}>

        {/* ─── Screen 1: Greeting ─── */}
        {step === "greeting" && (
          <div className="text-center animate-fade-in" dir="ltr">
            <h1 className="mb-4" style={{ color: NAVY, fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700 }}>
              Elevate and Shape your unique brand experience with BizAIra
            </h1>
            <p className="mb-12 max-w-md mx-auto" style={{ color: DARK_GRAY, fontFamily: "'Montserrat', sans-serif", fontSize: '1rem' }}>
              Just 4 short questions to tailor a unique experience for your brand. It only takes a minute.
            </p>

            <button
              onClick={() => setStep("language")}
              style={{
                width: "100%",
                padding: "16px 24px",
                borderRadius: "12px",
                backgroundColor: NAVY,
                color: CREAM,
                fontSize: "1rem",
                fontWeight: 600,
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: "0.01em",
                border: "none",
              }}
            >
              Get Started
            </button>
          </div>
        )}
                border: `1px solid ${GOLD}`,
                cursor: "pointer",
                boxShadow: `0 12px 30px -12px ${NAVY}`,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 16px 40px -8px ${NAVY}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 12px 30px -12px ${NAVY}`;
              }}
            >
              {isHe ? "התחלה עכשיו" : "Start Now"}
            </button>
          </div>
        )}

        {/* ─── Screen 2: Language Selection ─── */}
        {step === "language" && (
          <div className="animate-fade-in">
            <StepHeader num={1} total={4} title="Which language do you prefer?" />
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
              {languageOptions.map((option) => {
                const selected = selectedLanguage?.value === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleLanguageSelect(option)}
                    style={{
                      minHeight: "120px",
                      padding: "24px",
                      borderRadius: "12px",
                      backgroundColor: selected ? NAVY : "hsl(0 0% 100%)",
                      border: `2px solid ${selected ? NAVY : LIGHT_GRAY}`,
                      color: selected ? CREAM : NAVY,
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      fontFamily: "var(--font-assistant)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: selected ? `0 8px 24px -8px ${NAVY}` : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = NAVY;
                        e.currentTarget.style.backgroundColor = "hsl(220 25% 97%)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = LIGHT_GRAY;
                        e.currentTarget.style.backgroundColor = "hsl(0 0% 100%)";
                      }
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setStep("greeting")}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "10px",
                  border: `2px solid ${LIGHT_GRAY}`,
                  backgroundColor: "hsl(0 0% 100%)",
                  color: NAVY,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                }}
              >
                <ArrowLeft size={20} style={{ transform: isHe ? "scaleX(-1)" : "none" }} />
              </button>
              <button
                onClick={() => selectedLanguage && setStep("business")}
                disabled={!selectedLanguage}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  borderRadius: "10px",
                  backgroundColor: selectedLanguage ? NAVY : MID_GRAY,
                  color: CREAM,
                  fontSize: "1rem",
                  fontWeight: 600,
                  fontFamily: isHe ? "var(--font-assistant)" : "var(--font-montserrat)",
                  border: "none",
                  cursor: selectedLanguage ? "pointer" : "not-allowed",
                  boxShadow: selectedLanguage ? `0 8px 20px -8px ${NAVY}` : "none",
                  transition: "all 0.3s ease",
                  opacity: selectedLanguage ? 1 : 0.6,
                }}
              >
                {isHe ? "המשך" : "Continue"}
              </button>
            </div>
          </div>
        )}

        {/* ─── Screen 3: Business Type ─── */}
        {step === "business" && (
          <div className="animate-fade-in">
            <StepHeader num={2} total={4} title="What's your business type?" />
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
              {businessTypes.map(({ label, Icon }) => {
                const selected = businessType === label;
                return (
                  <button
                    key={label}
                    onClick={() => setBusinessType(label)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "12px",
                      padding: "20px 16px",
                      borderRadius: "12px",
                      backgroundColor: selected ? NAVY : "hsl(0 0% 100%)",
                      border: `2px solid ${selected ? NAVY : LIGHT_GRAY}`,
                      color: selected ? CREAM : NAVY,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      fontFamily: isHe ? "var(--font-assistant)" : "var(--font-montserrat)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: selected ? `0 6px 16px -6px ${NAVY}` : "none",
                      transform: selected ? "scale(1.03)" : "scale(1)",
                    }}
                    onMouseEnter={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = NAVY;
                        e.currentTarget.style.backgroundColor = "hsl(220 25% 97%)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = LIGHT_GRAY;
                        e.currentTarget.style.backgroundColor = "hsl(0 0% 100%)";
                      }
                    }}
                  >
                    <Icon size={24} strokeWidth={1.5} />
                    <span style={{ textAlign: "center", lineHeight: "1.3" }}>{label}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setStep("language")}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "10px",
                  border: `2px solid ${LIGHT_GRAY}`,
                  backgroundColor: "hsl(0 0% 100%)",
                  color: NAVY,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                }}
              >
                <ArrowLeft size={20} style={{ transform: isHe ? "scaleX(-1)" : "none" }} />
              </button>
              <button
                onClick={() => businessType && setStep("business-info")}
                disabled={!businessType}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  borderRadius: "10px",
                  backgroundColor: businessType ? NAVY : MID_GRAY,
                  color: CREAM,
                  fontSize: "1rem",
                  fontWeight: 600,
                  fontFamily: isHe ? "var(--font-assistant)" : "var(--font-montserrat)",
                  border: "none",
                  cursor: businessType ? "pointer" : "not-allowed",
                  boxShadow: businessType ? `0 8px 20px -8px ${NAVY}` : "none",
                  transition: "all 0.3s ease",
                  opacity: businessType ? 1 : 0.6,
                }}
              >
                {isHe ? "המשך" : "Continue"}
              </button>
            </div>
          </div>
        )}

        {/* ─── Screen 3b: Business Info Confirmation ─── */}
        {step === "business-info" && (
          <div className="animate-fade-in text-center">
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: `hsla(222 47% 8% / 0.1)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <Check size={32} style={{ color: NAVY, strokeWidth: 3 }} />
            </div>
            <h2 className={`hebrew-heading-2 ${isHe ? 'hebrew-heading-2' : ''} mb-4`} style={{ color: NAVY, fontFamily: isHe ? "var(--font-heebo)" : "var(--font-playfair)" }}>
              {isHe ? "נהדר!" : "Perfect!"}
            </h2>
            <p className={`hebrew-body ${isHe ? 'hebrew-body' : ''} mb-12 max-w-md mx-auto`} style={{ color: DARK_GRAY }}>
              {isHe
                ? `נתאים את כל דבר עבורך בתחום ה${businessType} — תוכן מדויק, תמונות מדהימות, וניסוחים שדוברים בשפת הלקוחות שלך.`
                : `We'll tailor everything in the ${businessType} space — precise content, stunning photos, and copy that speaks to your customers.`}
            </p>
            <button
              onClick={() => setStep("audience")}
              style={{
                width: "100%",
                padding: "14px 24px",
                borderRadius: "10px",
                border: `2px solid ${NAVY}`,
                backgroundColor: "hsl(0 0% 100%)",
                color: NAVY,
                fontSize: "1rem",
                fontWeight: 600,
                fontFamily: isHe ? "var(--font-assistant)" : "var(--font-montserrat)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = NAVY;
                e.currentTarget.style.color = CREAM;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "hsl(0 0% 100%)";
                e.currentTarget.style.color = NAVY;
              }}
            >
              {isHe ? "שאלה הבאה" : "Next question"}
            </button>
          </div>
        )}

        {/* ─── Screen 4: Audience ─── */}
        {step === "audience" && (
          <div className="animate-fade-in">
            <StepHeader num={3} total={4} title="Who's your audience?" />
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
              {audiences.map(({ label, Icon }) => {
                const selected = audience === label;
                return (
                  <button
                    key={label}
                    onClick={() => setAudience(label)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "16px",
                      borderRadius: "10px",
                      backgroundColor: selected ? NAVY : "hsl(0 0% 100%)",
                      border: `2px solid ${selected ? NAVY : LIGHT_GRAY}`,
                      color: selected ? CREAM : NAVY,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      fontFamily: isHe ? "var(--font-assistant)" : "var(--font-montserrat)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: selected ? `0 6px 16px -6px ${NAVY}` : "none",
                      textAlign: isHe ? "right" : "left",
                      justifyContent: isHe ? "flex-end" : "flex-start",
                    }}
                    onMouseEnter={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = NAVY;
                        e.currentTarget.style.backgroundColor = "hsl(220 25% 97%)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = LIGHT_GRAY;
                        e.currentTarget.style.backgroundColor = "hsl(0 0% 100%)";
                      }
                    }}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setStep("business")}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "10px",
                  border: `2px solid ${LIGHT_GRAY}`,
                  backgroundColor: "hsl(0 0% 100%)",
                  color: NAVY,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                }}
              >
                <ArrowLeft size={20} style={{ transform: isHe ? "scaleX(-1)" : "none" }} />
              </button>
              <button
                onClick={() => audience && setStep("audience-info")}
                disabled={!audience}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  borderRadius: "10px",
                  backgroundColor: audience ? NAVY : MID_GRAY,
                  color: CREAM,
                  fontSize: "1rem",
                  fontWeight: 600,
                  fontFamily: isHe ? "var(--font-assistant)" : "var(--font-montserrat)",
                  border: "none",
                  cursor: audience ? "pointer" : "not-allowed",
                  boxShadow: audience ? `0 8px 20px -8px ${NAVY}` : "none",
                  transition: "all 0.3s ease",
                  opacity: audience ? 1 : 0.6,
                }}
              >
                {isHe ? "המשך" : "Continue"}
              </button>
            </div>
          </div>
        )}

        {/* ─── Screen 4b: Audience Info Confirmation ─── */}
        {step === "audience-info" && (
          <div className="animate-fade-in text-center">
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: `hsla(222 47% 8% / 0.1)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <Check size={32} style={{ color: NAVY, strokeWidth: 3 }} />
            </div>
            <h2 className={`hebrew-heading-2 ${isHe ? 'hebrew-heading-2' : ''} mb-4`} style={{ color: NAVY, fontFamily: isHe ? "var(--font-heebo)" : "var(--font-playfair)" }}>
              {isHe ? "מעולה!" : "Excellent!"}
            </h2>
            <p className={`hebrew-body ${isHe ? 'hebrew-body' : ''} mb-12 max-w-md mx-auto`} style={{ color: DARK_GRAY }}>
              {isHe
                ? `נתאים את הטון, הסגנון והשפה כדי פנות בדיוק ל${audience} — תוכן שמושך, מדבר ולהניע לפעולה.`
                : `We'll match the tone, style, and language to reach ${audience} — content that attracts, speaks, and drives action.`}
            </p>
            <button
              onClick={() => setStep("goal")}
              style={{
                width: "100%",
                padding: "14px 24px",
                borderRadius: "10px",
                border: `2px solid ${NAVY}`,
                backgroundColor: "hsl(0 0% 100%)",
                color: NAVY,
                fontSize: "1rem",
                fontWeight: 600,
                fontFamily: isHe ? "var(--font-assistant)" : "var(--font-montserrat)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = NAVY;
                e.currentTarget.style.color = CREAM;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "hsl(0 0% 100%)";
                e.currentTarget.style.color = NAVY;
              }}
            >
              {isHe ? "שאלה אחרונה" : "Last question"}
            </button>
          </div>
        )}

        {/* ─── Screen 5: Goal ─── */}
        {step === "goal" && (
          <div className="animate-fade-in">
            <StepHeader num={4} total={4} title="What's your current goal?" />
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
              {goals.map(({ label, Icon }) => {
                const selected = goal === label;
                return (
                  <button
                    key={label}
                    onClick={() => setGoal(label)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "16px",
                      borderRadius: "10px",
                      backgroundColor: selected ? NAVY : "hsl(0 0% 100%)",
                      border: `2px solid ${selected ? NAVY : LIGHT_GRAY}`,
                      color: selected ? CREAM : NAVY,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      fontFamily: isHe ? "var(--font-assistant)" : "var(--font-montserrat)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: selected ? `0 6px 16px -6px ${NAVY}` : "none",
                      textAlign: isHe ? "right" : "left",
                      justifyContent: isHe ? "flex-end" : "flex-start",
                    }}
                    onMouseEnter={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = NAVY;
                        e.currentTarget.style.backgroundColor = "hsl(220 25% 97%)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = LIGHT_GRAY;
                        e.currentTarget.style.backgroundColor = "hsl(0 0% 100%)";
                      }
                    }}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setStep("audience")}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "10px",
                  border: `2px solid ${LIGHT_GRAY}`,
                  backgroundColor: "hsl(0 0% 100%)",
                  color: NAVY,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                }}
              >
                <ArrowLeft size={20} style={{ transform: isHe ? "scaleX(-1)" : "none" }} />
              </button>
              <button
                onClick={() => goal && setStep("done")}
                disabled={!goal}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  borderRadius: "10px",
                  backgroundColor: goal ? NAVY : MID_GRAY,
                  color: CREAM,
                  fontSize: "1rem",
                  fontWeight: 600,
                  fontFamily: isHe ? "var(--font-assistant)" : "var(--font-montserrat)",
                  border: "none",
                  cursor: goal ? "pointer" : "not-allowed",
                  boxShadow: goal ? `0 8px 20px -8px ${NAVY}` : "none",
                  transition: "all 0.3s ease",
                  opacity: goal ? 1 : 0.6,
                }}
              >
                {isHe ? "סיים" : "Finish"}
              </button>
            </div>
          </div>
        )}

        {/* ─── Screen 6: Done ─── */}
        {step === "done" && (
          <div className="animate-fade-in text-center">
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${NAVY} 0%, ${GOLD} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: `0 12px 40px -12px ${NAVY}`,
            }}>
              <Check size={40} style={{ color: CREAM, strokeWidth: 3 }} />
            </div>
            <h2 className={`hebrew-heading-2 ${isHe ? 'hebrew-heading-2' : ''} mb-4`} style={{ color: NAVY, fontFamily: isHe ? "var(--font-heebo)" : "var(--font-playfair)" }}>
              {isHe ? "הכל מוכן!" : "All Set!"}
            </h2>
            <p className={`hebrew-body ${isHe ? 'hebrew-body' : ''} mb-12 max-w-md mx-auto`} style={{ color: DARK_GRAY }}>
              {isHe
                ? "התאמנו הכל בדיוק בשבילך — תוכן חכם, מדויק ומותאם לעסק שלך. בלי סיבוכים, בלי המתנה. בואו נבנה משהו גדול."
                : "Everything's tailored just for you — smart, precise content for your business. No complications, no waiting. Let's build something great."}
            </p>
            <button
              onClick={() => setStep("guest-auth-choice")}
              style={{
                width: "100%",
                padding: "16px 24px",
                borderRadius: "12px",
                backgroundColor: NAVY,
                color: CREAM,
                fontSize: isHe ? "1.125rem" : "1rem",
                fontWeight: 600,
                fontFamily: isHe ? "var(--font-assistant)" : "var(--font-montserrat)",
                letterSpacing: "0.01em",
                border: "none",
                cursor: "pointer",
                boxShadow: `0 12px 30px -12px ${NAVY}`,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 16px 40px -8px ${NAVY}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 12px 30px -12px ${NAVY}`;
              }}
            >
              {isHe ? "בואו נתחיל!" : "Let's Start!"}
            </button>
          </div>
        )}

        {/* ─── Screen 7: Guest vs Auth Choice ─── */}
        {step === "guest-auth-choice" && (
          <div className="animate-fade-in text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: NAVY, fontFamily: "'Montserrat', sans-serif" }}>
              {isHe ? "בואו נתחילו" : "Let's Get Started"}
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: DARK_GRAY }}>
              {isHe
                ? "תוכלו להמשיך כאורח או להתחבר כדי לשמור את כל היצירות שלכם."
                : "You can continue as a guest or sign in to save all your creations."}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              {/* Guest Option */}
              <button
                onClick={() => {
                  const onboardingData = {
                    business_type: businessType,
                    target_audience: audience,
                    business_goals: goal,
                  };
                  createGuestSession();
                  updateGuestSession(onboardingData);
                  saveGuestOnboardingAnswers(onboardingData);
                  onComplete();
                }}
                style={{
                  padding: "24px",
                  borderRadius: "12px",
                  backgroundColor: "hsl(0 0% 100%)",
                  border: `2px solid ${LIGHT_GRAY}`,
                  color: NAVY,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = NAVY;
                  e.currentTarget.style.backgroundColor = "hsl(220 25% 97%)";
                  e.currentTarget.style.boxShadow = `0 6px 16px -6px ${NAVY}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = LIGHT_GRAY;
                  e.currentTarget.style.backgroundColor = "hsl(0 0% 100%)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <User size={24} />
                <div>
                  <p style={{ fontWeight: 600, fontSize: "1rem" }}>
                    {isHe ? "המשך כאורח" : "Continue as Guest"}
                  </p>
                  <p style={{ fontSize: "0.875rem", marginTop: "4px", color: MID_GRAY }}>
                    {isHe ? "ללא שמירה" : "No saving"}
                  </p>
                </div>
              </button>

              {/* Register Option */}
              <button
                onClick={() => {
                  const onboardingData = {
                    business_type: businessType,
                    target_audience: audience,
                    business_goals: goal,
                  };
                  saveGuestOnboardingAnswers(onboardingData);
                  window.location.href = "/auth";
                }}
                style={{
                  padding: "24px",
                  borderRadius: "12px",
                  backgroundColor: NAVY,
                  border: `2px solid ${NAVY}`,
                  color: CREAM,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  boxShadow: `0 6px 16px -6px ${NAVY}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 24px -6px ${NAVY}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 6px 16px -6px ${NAVY}`;
                }}
              >
                <UserPlus size={24} />
                <div>
                  <p style={{ fontWeight: 600, fontSize: "1rem" }}>
                    {isHe ? "התחברות / הרשמה" : "Login / Sign Up"}
                  </p>
                  <p style={{ fontSize: "0.875rem", marginTop: "4px", color: "rgba(255,255,255,0.7)" }}>
                    {isHe ? "עם שמירה" : "With saving"}
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StepHeader = ({ num, total, title }: { num: number; total: number; title: string }) => (
  <div style={{ marginBottom: "32px" }}>
    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: "4px",
            borderRadius: "2px",
            backgroundColor: i < num ? NAVY : LIGHT_GRAY,
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
    <p style={{
      fontSize: "0.75rem",
      fontWeight: 600,
      letterSpacing: "0.05em",
      color: MID_GRAY,
      textTransform: "uppercase",
      marginBottom: "8px",
      fontFamily: "'Montserrat', sans-serif",
    }}>
      Step {num} of {total}
    </p>
    <h2 style={{
      fontSize: "1.5rem",
      fontWeight: 600,
      color: NAVY,
      fontFamily: isHe ? "var(--font-heebo)" : "var(--font-playfair)",
      margin: 0,
    }}>
      {title}
    </h2>
  </div>
);

export default OnboardingFlow;
