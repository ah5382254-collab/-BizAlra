import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, UserCircle2, Sparkles, Bell, ArrowRight, ChartBar, Briefcase, ClipboardCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { getActivityStats } from "@/lib/activity-tracker";

const MIDNIGHT_BLUE = "#001830";
const BACKGROUND = "#FAF9F6";

const ProfilePage = () => {
  const { lang } = useI18n();
  const isHe = lang === "he";
  const { user, profile } = useAuth();
  const [stats, setStats] = useState(getActivityStats());
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const refreshStats = () => setStats(getActivityStats());
    window.addEventListener("storage", refreshStats);
    const interval = setInterval(refreshStats, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", refreshStats);
    };
  }, []);

  const userName = user?.user_metadata?.full_name || user?.email || (isHe ? "אורח" : "Guest");
  const userEmail = user?.email || "";
  const planLabel = profile?.plan && profile.plan !== "free"
    ? `${profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)} ${isHe ? "Plan" : "Plan"}`
    : (isHe ? "תוכנית חינם" : "Free Plan");

  const creditsTotal = profile?.credits_total ?? stats.limit;
  const creditsUsed = profile?.credits_used ?? stats.totalActions;
  const remainingCredits = Math.max(0, creditsTotal - creditsUsed);
  const usedPercent = creditsTotal > 0 ? Math.min(100, Math.round((creditsUsed / creditsTotal) * 100)) : 0;
  const remainingPercent = creditsTotal > 0 ? 100 - usedPercent : 0;

  const firstUseLabel = profile?.plan_started_at
    ? new Date(profile.plan_started_at).toLocaleDateString(isHe ? "he-IL" : "en-US", { day: "numeric", month: "short", year: "numeric" })
    : stats.firstUseDate
      ? new Date(stats.firstUseDate).toLocaleDateString(isHe ? "he-IL" : "en-US", { day: "numeric", month: "short", year: "numeric" })
      : (isHe ? "היום" : "Today");

  const renewalLabel = profile?.last_renewal_at
    ? new Date(profile.last_renewal_at).toLocaleDateString(isHe ? "he-IL" : "en-US", { day: "numeric", month: "short" })
    : stats.nextRenewalDate
      ? stats.nextRenewalDate.toLocaleDateString(isHe ? "he-IL" : "en-US", { day: "numeric", month: "short" })
      : (isHe ? "בעוד חודש" : "Next Month");

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: BACKGROUND, color: MIDNIGHT_BLUE, fontFamily: "'Heebo', 'Assistant', sans-serif" }} dir={isHe ? "rtl" : "ltr"}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          <section className="rounded-[32px] border border-[rgba(0,24,48,0.08)] bg-white p-8 shadow-[0_24px_60px_-40px_rgba(0,24,48,0.12)]">
            <p className="text-xs uppercase tracking-[0.38em] text-[#6B7280] mb-4">
              {isHe ? "אזור אישי" : "Personal Area"}
            </p>
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-4xl sm:text-5xl font-semibold leading-tight" style={{ color: MIDNIGHT_BLUE }}>
                  {isHe ? "מרכז ניהול פרואקטיבי" : "Executive dashboard for your business"}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4B5563]">
                  {isHe ? "כל הנתונים, קרדיטים, אבטחה ותובנות העסק במקום אחד מקצועי ומדויק." : "All account health, credit status, and performance signals in a polished executive view."}
                </p>
              </div>
              <button className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-[#001830] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d294d]">
                {isHe ? "סקור סטטוס" : "Review status"}
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-[rgba(0,24,48,0.08)] bg-[#F8FBFF] p-5">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#6B7280] mb-3">
                  {isHe ? "תוכנית" : "Plan"}
                </p>
                <p className="text-base font-semibold" style={{ color: MIDNIGHT_BLUE }}>
                  {planLabel}
                </p>
              </div>
              <div className="rounded-[24px] border border-[rgba(0,24,48,0.08)] bg-[#F8FBFF] p-5">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#6B7280] mb-3">
                  {isHe ? "קרדיטים" : "Credits"}
                </p>
                <p className="text-base font-semibold" style={{ color: MIDNIGHT_BLUE }}>
                  {remainingCredits} {isHe ? "נותרו" : "remaining"}
                </p>
              </div>
              <div className="rounded-[24px] border border-[rgba(0,24,48,0.08)] bg-[#F8FBFF] p-5">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#6B7280] mb-3">
                  {isHe ? "תובנה" : "Score"}
                </p>
                <p className="text-base font-semibold" style={{ color: MIDNIGHT_BLUE }}>
                  {stats.totalActions}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-[rgba(0,24,48,0.08)] bg-white p-8 shadow-[0_24px_60px_-40px_rgba(0,24,48,0.12)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#6B7280] mb-2">
                  {isHe ? "קרדיטים" : "Credits"}
                </p>
                <h2 className="text-3xl font-semibold" style={{ color: MIDNIGHT_BLUE }}>
                  {remainingCredits}
                </h2>
              </div>
              <div className="rounded-3xl bg-[#001830] px-4 py-3 text-sm font-semibold text-white">
                {remainingPercent}%
              </div>
            </div>
            <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${remainingPercent}%`, backgroundColor: MIDNIGHT_BLUE }}
              />
            </div>
            <p className="mt-4 text-sm text-[#4B5563]">
              {isHe ? "קרדיטים שנותרו עד לחידוש הבא" : "Credits remaining until the next renewal."}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#F8FBFF] p-4">
                <span className="text-[11px] uppercase tracking-[0.35em] text-[#6B7280]">
                  {isHe ? "חידוש" : "Renewal"}
                </span>
                <p className="mt-2 text-sm font-semibold text-[#001830]">{renewalLabel}</p>
              </div>
              <div className="rounded-3xl bg-[#F8FBFF] p-4">
                <span className="text-[11px] uppercase tracking-[0.35em] text-[#6B7280]">
                  {isHe ? "ראשון לשימוש" : "First use"}
                </span>
                <p className="mt-2 text-sm font-semibold text-[#001830]">{firstUseLabel}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          <section className="rounded-[28px] border border-[rgba(0,24,48,0.08)] bg-white p-8 shadow-[0_18px_40px_-24px_rgba(0,24,48,0.12)]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#6B7280] mb-2">
                  {isHe ? "מעקב ביצועים" : "Performance pulse"}
                </p>
                <h3 className="text-xl font-semibold" style={{ color: MIDNIGHT_BLUE }}>
                  {isHe ? "מדדי שימוש" : "Usage metrics"}
                </h3>
              </div>
              <ChartBar size={28} className="text-[#001830]" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-[rgba(0,24,48,0.08)] bg-[#F8FBFF] p-5">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#6B7280]">{isHe ? "יצירות" : "Creations"}</p>
                <p className="mt-2 text-3xl font-semibold text-[#001830]">{stats.creationsCount}</p>
              </div>
              <div className="rounded-3xl border border-[rgba(0,24,48,0.08)] bg-[#F8FBFF] p-5">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#6B7280]">{isHe ? "הורדות" : "Downloads"}</p>
                <p className="mt-2 text-3xl font-semibold text-[#001830]">{stats.downloadsCount}</p>
              </div>
              <div className="rounded-3xl border border-[rgba(0,24,48,0.08)] bg-[#F8FBFF] p-5">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#6B7280]">{isHe ? "פעולות כלליות" : "General actions"}</p>
                <p className="mt-2 text-3xl font-semibold text-[#001830]">{stats.generalCount}</p>
              </div>
              <div className="rounded-3xl border border-[rgba(0,24,48,0.08)] bg-[#F8FBFF] p-5">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#6B7280]">{isHe ? "שבועי" : "Weekly"}</p>
                <p className="mt-2 text-3xl font-semibold text-[#001830]">{stats.weeklyTotal}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[rgba(0,24,48,0.08)] bg-white p-8 shadow-[0_18px_40px_-24px_rgba(0,24,48,0.12)]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#6B7280] mb-2">
                  {isHe ? "חשבון" : "Account"}
                </p>
                <h3 className="text-xl font-semibold" style={{ color: MIDNIGHT_BLUE }}>
                  {isHe ? "פרטי פרופיל" : "Profile details"}
                </h3>
              </div>
              <UserCircle2 size={28} className="text-[#001830]" />
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-[#F8FBFF] p-4">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#6B7280] mb-2">{isHe ? "שם" : "Name"}</p>
                <p className="text-sm font-semibold text-[#001830]">{userName}</p>
              </div>
              <div className="rounded-3xl bg-[#F8FBFF] p-4">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#6B7280] mb-2">{isHe ? 'דוא"ל' : "Email"}</p>
                <p className="text-sm font-semibold text-[#001830]">{userEmail}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="flex-1 rounded-3xl bg-[#001830] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0d294d]">
                  {isHe ? "ערוך פרופיל" : "Edit profile"}
                </button>
                <button className="flex-1 rounded-3xl border border-[#001830] bg-white px-4 py-3 text-sm font-semibold text-[#001830] transition hover:bg-[#F8FBFF]">
                  {isHe ? "נהל חשבון" : "Manage account"}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[28px] border border-[rgba(0,24,48,0.08)] bg-white p-8 shadow-[0_18px_40px_-24px_rgba(0,24,48,0.12)]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#6B7280] mb-2">
                  {isHe ? "פעולות מהירות" : "Quick actions"}
                </p>
                <h3 className="text-xl font-semibold" style={{ color: MIDNIGHT_BLUE }}>
                  {isHe ? "מה לעשות עכשיו" : "What to do next"}
                </h3>
              </div>
              <ArrowRight size={28} className="text-[#001830]" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link to="/create" className="rounded-3xl border border-[rgba(0,24,48,0.08)] bg-[#F8FBFF] p-5 transition hover:bg-[#EEF2FF]">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase size={18} className="text-[#001830]" />
                  <p className="text-sm font-semibold text-[#001830]">{isHe ? "צור נכס" : "Create asset"}</p>
                </div>
                <p className="text-sm text-[#4B5563]">{isHe ? "פתח את הסטודיו היצירתי למהלך הבא." : "Open the creative studio for your next move."}</p>
              </Link>
              <Link to="/create/analytics" className="rounded-3xl border border-[rgba(0,24,48,0.08)] bg-[#F8FBFF] p-5 transition hover:bg-[#EEF2FF]">
                <div className="flex items-center gap-3 mb-3">
                  <ChartBar size={18} className="text-[#001830]" />
                  <p className="text-sm font-semibold text-[#001830]">{isHe ? "תובנות" : "Insights"}</p>
                </div>
                <p className="text-sm text-[#4B5563]">{isHe ? "קבל תמצית עסקית מהירה" : "Capture a crisp business summary."}</p>
              </Link>
              <Link to="/journal" className="rounded-3xl border border-[rgba(0,24,48,0.08)] bg-[#F8FBFF] p-5 transition hover:bg-[#EEF2FF]">
                <div className="flex items-center gap-3 mb-3">
                  <ClipboardCheck size={18} className="text-[#001830]" />
                  <p className="text-sm font-semibold text-[#001830]">{isHe ? "נהל את היום" : "Manage today"}</p>
                </div>
                <p className="text-sm text-[#4B5563]">{isHe ? "ארגן משימות מרכזיות וחדשות." : "Organize your top priorities."}</p>
              </Link>
              <Link to="/support" className="rounded-3xl border border-[rgba(0,24,48,0.08)] bg-[#F8FBFF] p-5 transition hover:bg-[#EEF2FF]">
                <div className="flex items-center gap-3 mb-3">
                  <Bell size={18} className="text-[#001830]" />
                  <p className="text-sm font-semibold text-[#001830]">{isHe ? "תמיכה" : "Support"}</p>
                </div>
                <p className="text-sm text-[#4B5563]">{isHe ? "קבל מענה מקצועי במהירות." : "Get expert assistance fast."}</p>
              </Link>
            </div>
          </section>

          <section className="rounded-[28px] border border-[rgba(0,24,48,0.08)] bg-white p-8 shadow-[0_18px_40px_-24px_rgba(0,24,48,0.12)]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#6B7280] mb-2">
                  {isHe ? "העדפות" : "Preferences"}
                </p>
                <h3 className="text-xl font-semibold" style={{ color: MIDNIGHT_BLUE }}>
                  {isHe ? "אבטחה והגדרות" : "Security & settings"}
                </h3>
              </div>
              <ShieldCheck size={28} className="text-[#001830]" />
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-[#F8FBFF] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#6B7280] mb-1">{isHe ? "שפה" : "Language"}</p>
                    <p className="text-sm font-semibold text-[#001830]">{isHe ? "עברית" : "English"}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#001830]">{isHe ? "מוקצה" : "Set"}</span>
                </div>
              </div>
              <div className="rounded-3xl bg-[#F8FBFF] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#6B7280] mb-1">{isHe ? 'עדכוני דוא"ל' : "Email updates"}</p>
                    <p className="text-sm text-[#4B5563]">{isHe ? "קבל עדכונים על חידושים ותובנות." : "Receive updates on product and strategy."}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={notificationsEnabled}
                      onChange={() => setNotificationsEnabled(prev => !prev)}
                      className="peer sr-only"
                    />
                    <span className="h-6 w-11 rounded-full border border-[#001830] bg-white transition peer-checked:bg-[#001830]" />
                    <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                  </label>
                </div>
              </div>
              <div className="rounded-3xl bg-[#F8FBFF] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#6B7280] mb-1">{isHe ? "אימות דו-שלבי" : "Two-factor auth"}</p>
                    <p className="text-sm text-[#4B5563]">{isHe ? "הגנה נוספת על חשבונך." : "Protect your account with an extra step."}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={twoFactorEnabled}
                      onChange={() => setTwoFactorEnabled(prev => !prev)}
                      className="peer sr-only"
                    />
                    <span className="h-6 w-11 rounded-full border border-[#001830] bg-white transition peer-checked:bg-[#001830]" />
                    <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                  </label>
                </div>
              </div>
              <button className="w-full rounded-3xl bg-[#001830] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0d294d]">
                {isHe ? "שמור הגדרות" : "Save settings"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
