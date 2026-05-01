import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, User, Phone, ArrowLeft, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getSavedGuestAnswers } from "@/lib/guest-session";

const NAVY = "#0D2344";
const CREAM = "#FBF4E8";
const OFF_WHITE = "#F5F0E8";

const AuthPage = () => {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const isHe = lang === "he";
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const BackArrow = isHe ? ArrowLeft : ArrowRight;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && (!name || !email || !password || !phone)) {
      toast.error(isHe ? "נא למלא את כל השדות" : "Please fill in all fields");
      return;
    }
    if (isLogin && (!email || !password)) {
      toast.error(isHe ? "נא למלא אימייל וסיסמה" : "Please fill in email and password");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(isHe ? "התחברת בהצלחה!" : "Logged in successfully!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              full_name: name,
              phone: phone,
              ...getSavedGuestAnswers(),
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success(isHe ? "החשבון נוצר! בדוק את האימייל שלך" : "Account created! Check your email");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-10"
      dir={isHe ? "rtl" : "ltr"}
      style={{ backgroundColor: CREAM }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY} 100%)`, boxShadow: "0 8px 24px -4px rgba(13, 35, 68, 0.35)" }}
          >
            <Sparkles size={28} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight" style={{ color: NAVY, fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
            {isHe ? "מתחילים להתחבר," : "Let's Connect,"}
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ color: NAVY, fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
            {isHe ? "להתחיל להשתמש" : "Get Started"}
          </h2>
          <p className="text-sm mt-3" style={{ color: "#747474" }}>
            {isLogin ? (isHe ? "ברוכים חוזרים!" : "Welcome back!") : (isHe ? "צור חשבון חדש" : "Create a new account")}
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-7 space-y-5"
          style={{ backgroundColor: "#FFFFFF", boxShadow: "0 8px 40px -8px rgba(13, 35, 68, 0.1)" }}
        >
          {/* Name field */}
          {!isLogin && (
            <FieldWrapper label={isHe ? "שם מלא" : "Full Name"}>
              <div className="relative">
                <User
                  size={15}
                  strokeWidth={1.5}
                  className="absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  style={{ [isHe ? "right" : "left"]: "14px" }}
                />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={isHe ? "שם מלא" : "Full Name"}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  style={{ [isHe ? "paddingRight" : "paddingLeft"]: "40px", [isHe ? "paddingLeft" : "paddingRight"]: "16px" }}
                />
              </div>
            </FieldWrapper>
          )}

          {/* Phone field */}
          {!isLogin && (
            <FieldWrapper label={isHe ? "מספר טלפון" : "Phone Number"}>
              <div className="relative">
                <Phone
                  size={15}
                  strokeWidth={1.5}
                  className="absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  style={{ [isHe ? "right" : "left"]: "14px" }}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder={isHe ? "050-1234567" : "+972-50-1234567"}
                  dir="ltr"
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  style={{ [isHe ? "paddingRight" : "paddingLeft"]: "40px", [isHe ? "paddingLeft" : "paddingRight"]: "16px" }}
                />
              </div>
            </FieldWrapper>
          )}

          {/* Email */}
          <FieldWrapper label={isHe ? "אימייל" : "Email"}>
            <div className="relative">
              <Mail
                size={15}
                strokeWidth={1.5}
                className="absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                style={{ [isHe ? "right" : "left"]: "14px" }}
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                dir="ltr"
                className="w-full bg-white border border-gray-200 rounded-xl py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                style={{ [isHe ? "paddingRight" : "paddingLeft"]: "40px", [isHe ? "paddingLeft" : "paddingRight"]: "16px" }}
              />
            </div>
          </FieldWrapper>

          {/* Password */}
          <FieldWrapper label={isHe ? "סיסמה" : "Password"}>
            <div className="relative">
              <Lock
                size={15}
                strokeWidth={1.5}
                className="absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                style={{ [isHe ? "right" : "left"]: "14px" }}
              />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full bg-white border border-gray-200 rounded-xl py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                style={{ [isHe ? "paddingRight" : "paddingLeft"]: "40px", [isHe ? "paddingLeft" : "paddingRight"]: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                style={{ [isHe ? "left" : "right"]: "14px" }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </FieldWrapper>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            style={{ backgroundColor: NAVY }}
          >
            {loading
              ? <Loader2 size={18} className="animate-spin" />
              : <Sparkles size={18} />}
            {isLogin ? (isHe ? "התחברות" : "Sign In") : (isHe ? "יצירת חשבון" : "Create Account")}
          </button>

          {/* Toggle */}
          <div className="text-center pt-3 space-y-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold transition-colors"
              style={{ color: NAVY }}
            >
              {isLogin ? (isHe ? "אין לך חשבון? הרשם כאן" : "No account? Sign up here") : (isHe ? "כבר יש לך חשבון? התחבר" : "Already have an account? Sign in")}
            </button>
          </div>
        </form>

        {/* Continue as guest link */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm font-medium transition-colors"
            style={{ color: NAVY }}
          >
            {isHe ? "או המשך כאורח →" : "Or continue as guest →"}
          </button>
        </div>
      </div>
    </div>
  );
};

const FieldWrapper = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block">
      {label}
    </label>
    {children}
  </div>
);

export default AuthPage;
