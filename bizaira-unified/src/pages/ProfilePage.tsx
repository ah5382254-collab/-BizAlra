import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Volume2,
  Video,
  Image,
  Type,
  Plus,
  Download,
  Trash2,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { getActivityStats } from "@/lib/activity-tracker";

const DEEP_MIDNIGHT_BLUE = "#001830";
const CLEAN_WHITE = "#FFFFFF";
const COOL_GRAY = "#6B7280";
const SOFT_BORDER = "#E5E7EB";

const tabs = [
  { id: "audio", labelHe: "אודיו", labelEn: "Audio", icon: Volume2 },
  { id: "video", labelHe: "וידאו", labelEn: "Video", icon: Video },
  { id: "image", labelHe: "תמונה", labelEn: "Image", icon: Image },
  { id: "text", labelHe: "טקסט", labelEn: "Text", icon: Type },
];

const cards = [
  { id: "creations", labelHe: "יצירות בוצעו", labelEn: "Creations Done", icon: Plus },
  { id: "downloads", labelHe: "הורדות", labelEn: "Downloads", icon: Download },
  { id: "deletions", labelHe: "מחיקות", labelEn: "Deletions", icon: Trash2 },
];

const ProfilePage = () => {
  const { lang } = useI18n();
  const isHe = lang === "he";
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const [stats, setStats] = useState(() => getActivityStats());

  useEffect(() => {
    setStats(getActivityStats());
  }, []);

  const { creationsCount, downloadsCount, deletionsCount, totalActions, limit, nextRenewalDate } = stats;
  const usagePercent = limit > 0 ? Math.min(100, Math.round((totalActions / limit) * 100)) : 0;
  const progressStyle = {
    width: `${usagePercent}%`,
    backgroundColor: DEEP_MIDNIGHT_BLUE,
    marginInlineStart: isHe ? "auto" : undefined,
  };

  const displayName = profile?.full_name || (isHe ? "אורח" : "Guest");
  const planLabel = profile?.plan || (isHe ? "חינם" : "Free");
  const renewalLabel = nextRenewalDate
    ? nextRenewalDate.toLocaleDateString(isHe ? "he-IL" : "en-US", {
        day: "numeric",
        month: "short",
      })
    : isHe
    ? "טרם נקבע"
    : "Not set";

  return (
    <div
      className="min-h-screen pb-28"
      style={{ backgroundColor: CLEAN_WHITE, color: DEEP_MIDNIGHT_BLUE }}
      dir={isHe ? "rtl" : "ltr"}
    >
      <div className="max-w-4xl mx-auto px-6 py-14">
        <section className="mb-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#6B7280]">
                {isHe ? "אזור אישי" : "Personal Area"}
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight" style={{ color: DEEP_MIDNIGHT_BLUE }}>
                {displayName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: COOL_GRAY }}>
                {isHe
                  ? "מערכת מקצועית לניהול ביצועים, חידושים ופעילות עסקית בסטייל מינימליסטי."
                  : "A premium dashboard for clean performance management, renewal insights, and activity tracking."}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium" style={{ borderColor: SOFT_BORDER }}>
                <span style={{ color: DEEP_MIDNIGHT_BLUE }}>{planLabel}</span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
                className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold"
                style={{ borderColor: SOFT_BORDER, color: DEEP_MIDNIGHT_BLUE }}
              >
                {isHe ? "התנתק" : "Sign Out"}
              </button>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-[#DFE3EA] bg-white px-5 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#6B7280]">
                  {isHe ? "שימוש קרדיטים" : "Credit usage"}
                </p>
                <p className="mt-3 text-2xl font-semibold" style={{ color: DEEP_MIDNIGHT_BLUE }}>
                  {totalActions} / {limit}
                </p>
              </div>
              <div className="text-sm text-[#6B7280]">
                {isHe ? "חידוש הבא" : "Next renewal"}: {renewalLabel}
              </div>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
              <div className="h-full transition-all duration-500" style={progressStyle} />
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;
              const value =
                card.id === "creations"
                  ? creationsCount
                  : card.id === "downloads"
                  ? downloadsCount
                  : deletionsCount;

              return (
                <div
                  key={card.id}
                  className="rounded-3xl border border-[#DFE3EA] bg-white px-5 py-7 text-center"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#E5E7EB] text-[15px]" style={{ color: DEEP_MIDNIGHT_BLUE }}>
                    <Icon size={22} />
                  </div>
                  <p className="mt-6 text-3xl font-semibold" style={{ color: DEEP_MIDNIGHT_BLUE }}>
                    {value ?? 0}
                  </p>
                  <p className="mt-2 text-sm leading-6" style={{ color: COOL_GRAY }}>
                    {isHe ? card.labelHe : card.labelEn}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-24 rounded-3xl border border-[#DFE3EA] bg-white px-6 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#6B7280]">
                {isHe ? "ניווט פעילות" : "Activity tabs"}
              </p>
              <h2 className="mt-3 text-xl font-semibold" style={{ color: DEEP_MIDNIGHT_BLUE }}>
                {isHe ? "בחר קטגוריה לצפייה" : "Select a category to view"}
              </h2>
            </div>
            <div className="text-sm text-[#6B7280]">
              {isHe
                ? "החלפת לשונית משנה את מצב המסך מידית"
                : "Switching tabs updates the active state instantly."}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex min-h-[90px] w-full flex-col items-center justify-center rounded-3xl px-4 py-4 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? "bg-[#001830] text-white"
                      : "bg-white text-[#001830] ring-1 ring-[#E5E7EB] hover:bg-[#F8FAFC]"
                  }`}
                  style={{ borderColor: SOFT_BORDER }}
                >
                  <Icon size={22} style={{ marginBottom: 8 }} />
                  <span>{isHe ? tab.labelHe : tab.labelEn}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-3xl px-3 py-2 text-center text-[11px] font-semibold transition-colors duration-200 ${
                  isActive
                    ? "bg-[#001830] text-white"
                    : "text-[#001830]"
                }`}
                style={{ margin: "0 4px" }}
              >
                <Icon size={20} style={{ marginBottom: 4 }} />
                <div>{isHe ? tab.labelHe : tab.labelEn}</div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default ProfilePage;
