/**
 * Guest Session Management
 * Manages temporary guest sessions with 4 onboarding questions
 * Data is NOT persisted to database, only stored in sessionStorage
 */

export interface GuestSession {
  isGuest: boolean;
  businessType: string;
  targetAudience: string;
  businessGoals: string;
  createdAt: string;
}

const GUEST_SESSION_KEY = "bizaira_guest_session";
const GUEST_ONBOARDING_KEY = "bizaira_guest_onboarding";

/**
 * Create a new guest session
 */
export const createGuestSession = (): GuestSession => {
  const session: GuestSession = {
    isGuest: true,
    businessType: "",
    targetAudience: "",
    businessGoals: "",
    createdAt: new Date().toISOString(),
  };
  sessionStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session));
  return session;
};

/**
 * Get current guest session
 */
export const getGuestSession = (): GuestSession | null => {
  const stored = sessionStorage.getItem(GUEST_SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
};

/**
 * Update guest session with onboarding answers
 */
export const updateGuestSession = (updates: Partial<GuestSession>): GuestSession => {
  const current = getGuestSession() || createGuestSession();
  const updated = { ...current, ...updates };
  sessionStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * Clear guest session (on logout or when registering)
 */
export const clearGuestSession = (): void => {
  sessionStorage.removeItem(GUEST_SESSION_KEY);
  sessionStorage.removeItem(GUEST_ONBOARDING_KEY);
};

/**
 * Check if current session is a guest
 */
export const isGuestSession = (): boolean => {
  const session = getGuestSession();
  return session?.isGuest === true;
};

/**
 * Get guest onboarding data (for later registration)
 */
export const getGuestOnboardingData = () => {
  const session = getGuestSession();
  if (!session) return null;
  
  return {
    business_type: session.businessType,
    target_audience: session.targetAudience,
    business_goals: session.businessGoals,
  };
};

/**
 * Persist guest onboarding answers for later registration
 */
export const saveGuestOnboardingAnswers = (answers: any): void => {
  sessionStorage.setItem(GUEST_ONBOARDING_KEY, JSON.stringify(answers));
};

/**
 * Get saved guest onboarding answers
 */
export const getSavedGuestAnswers = () => {
  const stored = sessionStorage.getItem(GUEST_ONBOARDING_KEY);
  return stored ? JSON.parse(stored) : null;
};
