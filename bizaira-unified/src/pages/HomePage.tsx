import { useNavigate } from "react-router-dom";
import { Wand2, User, BarChart3, CreditCard, HelpCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";

// Business-Luxury Color Palette (NO GOLD)
const NAVY = "#0D2344";
const CREAM = "#FBF4E8";
const OFF_WHITE = "#F5F0E8";
const LIGHT_TEXT = "#747474";

const HomePage = () => {
  const { lang } = useI18n();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const isHe = lang === "he";

  const userName = profile?.full_name || user?.user_metadata?.full_name || (isHe ? "משתמש" : "User");

  // Feature cards matching specification exactly
  const features = [
    {
      id: 1,
      icon: Wand2,
      titleHe: "התחל ליצור",
      titleEn: "Start Creating",
      descHe: "תוכן שיווקי, תמונות וסרטונים",
      descEn: "Marketing content, photos & videos",
      path: "/create",
      bgColor: "#0D2344",
    },
    {
      id: 2,
      icon: User,
      titleHe: "אזור אישי",
      titleEn: "My Area",
      descHe: "פרופיל והגדרות אישיות",
      descEn: "Profile & Personal Settings",
      path: "/profile",
      bgColor: "#1A3A52",
    },
    {
      id: 3,
      icon: BarChart3,
      titleHe: "מעקב פעילות",
      titleEn: "Activity Tracking",
      descHe: "ניתוח עסקי ותובנות חכמות",
      descEn: "Business analytics & insights",
      path: "/create/analytics",
      bgColor: "#264B6A",
    },
    {
      id: 4,
      icon: CreditCard,
      titleHe: "ניהול מנוי",
      titleEn: "Manage Subscription",
      descHe: "תכניות ותמחור",
      descEn: "Plans & Pricing",
      path: "/pricing",
      bgColor: "#2D5A78",
    },
    {
      id: 5,
      icon: HelpCircle,
      titleHe: "תמיכה",
      titleEn: "Support",
      descHe: "עזרה וליווי מקצועי",
      descEn: "Help & Professional Guidance",
      path: "/support",
      bgColor: "#376386",
    },
  ];

  return (
    <div
      className="min-h-screen pb-24 px-4 sm:px-6 md:px-8"
      dir={isHe ? "rtl" : "ltr"}
      style={{ backgroundColor: CREAM }}
    >
      {/* Header Greeting - Specification Format */}
      <div className="pt-8 pb-8 max-w-5xl mx-auto">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3"
          style={{ color: NAVY, fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}
        >
          {isHe ? `שלום ${userName},` : `Hello ${userName},`}
        </h1>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
          style={{ color: NAVY, fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}
        >
          {isHe ? "מה תרצה לבנות היום?" : "What would you like to build today?"}
        </h2>
        <p className="text-base sm:text-lg" style={{ color: LIGHT_TEXT }}>
          {isHe
            ? "בחר כלי מהרשתוח לתחת ותתחיל ליצור תוכן שיווקי, ניתוח עסקי ועוד."
            : "Choose a tool below and start creating marketing content, business analytics and more."}
        </p>
      </div>

      {/* Feature Cards Grid - Spec Section: Main Feature Cards */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => navigate(feature.path)}
                className="group relative overflow-hidden rounded-2xl p-6 sm:p-7 text-left transition-all duration-300 hover:shadow-xl active:scale-95"
                style={{
                  backgroundColor: feature.bgColor,
                  boxShadow: "0 4px 12px rgba(13, 35, 68, 0.1)",
                }}
              >
                {/* Hover effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  style={{ backgroundColor: "#FFFFFF" }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <IconComponent
                      size={32}
                      strokeWidth={1.5}
                      style={{ color: "#FFFFFF" }}
                    />
                  </div>
                  <h3
                    className="text-xl sm:text-2xl font-bold mb-2"
                    style={{ color: "#FFFFFF", fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {isHe ? feature.titleHe : feature.titleEn}
                  </h3>
                  <p
                    className="text-sm sm:text-base"
                    style={{ color: "rgba(255, 255, 255, 0.85)" }}
                  >
                    {isHe ? feature.descHe : feature.descEn}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1.5 origin-left group-hover:scale-x-100 transform scale-x-0 transition-transform duration-300"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="max-w-5xl mx-auto mt-12 sm:mt-16">
        <div
          className="grid grid-cols-3 gap-4 p-6 sm:p-8 rounded-2xl"
          style={{ backgroundColor: OFF_WHITE }}
        >
          <div>
            <p
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: NAVY, fontFamily: "'Montserrat', sans-serif" }}
            >
              0
            </p>
            <p className="text-xs sm:text-sm mt-2" style={{ color: LIGHT_TEXT }}>
              {isHe ? "יצירות" : "Creations"}
            </p>
          </div>
          <div>
            <p
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: NAVY, fontFamily: "'Montserrat', sans-serif" }}
            >
              0
            </p>
            <p className="text-xs sm:text-sm mt-2" style={{ color: LIGHT_TEXT }}>
              {isHe ? "שמורות" : "Saved"}
            </p>
          </div>
          <div>
            <p
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: NAVY, fontFamily: "'Montserrat', sans-serif" }}
            >
              0
            </p>
            <p className="text-xs sm:text-sm mt-2" style={{ color: LIGHT_TEXT }}>
              {isHe ? "קרדיטים" : "Credits"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
