import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface GoogleLoginButtonProps {
  onSuccess?: (user: any) => void;
  onError?: (error: any) => void;
  variant?: "standard" | "filled_blue" | "filled_black" | "outline" | "filled";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "signin" | "signup";
  className?: string;
}

const GoogleLoginButton = ({
  onSuccess,
  onError,
  variant = "outline",
  size = "large",
  text = "signin_with",
  className = "",
}: GoogleLoginButtonProps) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      // Decode the JWT to extract user information
      const decoded: any = jwtDecode(credentialResponse.credential);

      const { email, name, picture, sub: googleId } = decoded;

      // Sign up or sign in user with Supabase using Google credential
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: credentialResponse.credential,
      });

      if (error) {
        throw error;
      }

      // Update user metadata with Google profile info
      if (data.user) {
        await supabase.auth.updateUser({
          data: {
            full_name: name || "",
            avatar_url: picture || "",
            google_id: googleId,
          },
        });

        toast.success(
          <div>
            <div style={{ fontWeight: 600 }}>✓ {t("auth.googleLoginSuccess")}</div>
            <div style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>{email}</div>
          </div>
        );

        if (onSuccess) {
          onSuccess({ email, name, picture, googleId });
        }

        // Navigate to dashboard or onboarding
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Google login error:", error);

      const errorMessage =
        error.message === "No user found with this provider"
          ? t("auth.googleUserNotFound")
          : error.message || t("auth.googleLoginError");

      toast.error(
        <div>
          <div style={{ fontWeight: 600 }}>✗ {t("auth.googleLoginFailed")}</div>
          <div style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>{errorMessage}</div>
        </div>
      );

      if (onError) {
        onError(error);
      }
    }
  };

  const handleError = (error: any) => {
    console.error("Google login error:", error);

    const errorMessage =
      error.type === "popup_closed_by_user"
        ? t("auth.googleLoginCancelled")
        : t("auth.googleLoginError");

    toast.error(errorMessage);

    if (onError) {
      onError(error);
    }
  };

  return (
    <div className={className} style={{ display: "flex", justifyContent: "center" }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        variant={variant}
        size={size}
        text={text}
        locale="en"
      />
    </div>
  );
};

export default GoogleLoginButton;
