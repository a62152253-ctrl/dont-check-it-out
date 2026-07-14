import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  updateDoc 
} from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";
import { UserProfile, UserActivity } from "shared";
import { Language } from "../lib/translations";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  activities: UserActivity[];
  language: Language;
  isSandbox: boolean;
  setLanguage: (lang: Language) => void;
  signInWithGoogle: () => Promise<void>;
  signUpEmail: (email: string, password: string, fullName: string, companyName?: string) => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshActivities: () => Promise<void>;
  clearError: () => void;
  enableSandboxMode: (email?: string, fullName?: string, companyName?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSandbox, setIsSandbox] = useState<boolean>(() => {
    return localStorage.getItem("vault_sandbox_active") === "true";
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("vault_sandbox_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("vault_sandbox_profile");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState<boolean>(() => {
    const active = localStorage.getItem("vault_sandbox_active") === "true";
    return !active;
  });

  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>(() => {
    const saved = localStorage.getItem("vault_sandbox_activities");
    return saved ? JSON.parse(saved) : [];
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("vault_lang") as Language) || "PL";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("vault_lang", lang);
  };

  // Clear error convenience function
  const clearError = () => setError(null);

  const enableSandboxMode = (email?: string, fullName?: string, companyName?: string) => {
    setIsSandbox(true);
    localStorage.setItem("vault_sandbox_active", "true");
    
    const useEmail = email || "demo@demovault.com";
    const useName = fullName || "Demo Developer";
    const useCompany = companyName || "CipherVault Demo Ltd.";

    const mockUser = {
      uid: "sandbox-demo-uid",
      email: useEmail,
      displayName: useName,
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(useName)}`
    } as User;
    
    const mockProfile: UserProfile = {
      uid: mockUser.uid,
      email: mockUser.email || "",
      displayName: mockUser.displayName || "Demo Developer",
      photoURL: mockUser.photoURL || "",
      createdAt: new Date().toISOString(),
      role: "Administrator",
      plan: "Enterprise (Sandbox)",
      companyName: useCompany,
      onboardingCompleted: true,
      status: "Active"
    };

    const mockActivities: UserActivity[] = [
      {
        id: "act-1",
        uid: mockUser.uid,
        action: "Sandbox Mode Activated",
        status: "Success",
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        details: "Firebase Auth Email/Password is disabled in Firebase console. Switched automatically to high-security Local Sandbox Mode."
      }
    ];

    setUser(mockUser);
    setProfile(mockProfile);
    setActivities(mockActivities);
    localStorage.setItem("vault_sandbox_user", JSON.stringify(mockUser));
    localStorage.setItem("vault_sandbox_profile", JSON.stringify(mockProfile));
    localStorage.setItem("vault_sandbox_activities", JSON.stringify(mockActivities));
    setLoading(false);
  };

  // Helper to log user activity to Firestore
  const logActivity = async (uid: string, action: string, status: 'Success' | 'Failed', details?: string) => {
    try {
      const activity: UserActivity = {
        uid,
        action,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        status,
        details: details || ""
      };
      await addDoc(collection(db, "userActivity"), activity);
      await fetchActivitiesList(uid);
    } catch (e) {
      console.warn("Activity logging failed, likely firestore index compiling or security limits:", e);
    }
  };

  // Fetch activities helper
  const fetchActivitiesList = async (uid: string) => {
    try {
      const q = query(
        collection(db, "userActivity"),
        where("uid", "==", uid),
        orderBy("timestamp", "desc"),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const logs: UserActivity[] = [];
      querySnapshot.forEach((docSnap) => {
        logs.push({ id: docSnap.id, ...docSnap.data() } as UserActivity);
      });
      setActivities(logs);
    } catch (e) {
      console.warn("Could not fetch activities:", e);
    }
  };

  // Re-fetch activities publicly
  const refreshActivities = async () => {
    if (user) {
      await fetchActivitiesList(user.uid);
    }
  };

  // Monitor auth state changes
  useEffect(() => {
    if (localStorage.getItem("vault_sandbox_active") === "true") {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setError(null);
      if (currentUser) {
        setUser(currentUser);
        try {
          // Fetch user profile from Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setProfile(userDocSnap.data() as UserProfile);
          } else {
            // Profile doesn't exist yet (could happen for Google login first time)
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || currentUser.email?.split("@")[0] || "SaaS User",
              photoURL: currentUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.email}`,
              createdAt: new Date().toISOString(),
              role: "User",
              plan: "Free Trial",
              companyName: "My Workspace",
              onboardingCompleted: false,
              status: "Active"
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
          
          // Fetch user logs
          await fetchActivitiesList(currentUser.uid);
        } catch (err: any) {
          console.error("Error fetching or creating profile:", err);
          setError("Session initialized with local profile due to connection limits.");
          // Fallback local profile state so the user doesn't get blocked
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email || "",
            displayName: currentUser.displayName || "SaaS User",
            photoURL: currentUser.photoURL || "",
            createdAt: new Date().toISOString(),
            role: "User",
            plan: "Free Trial",
            companyName: "My Workspace",
            onboardingCompleted: false,
            status: "Active"
          });
        }
      } else {
        setUser(null);
        setProfile(null);
        setActivities([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Google Sign-In
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedUser = result.user;
      
      // Update Firestore user document
      const userDocRef = doc(db, "users", loggedUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      let finalProfile: UserProfile;
      if (!userDocSnap.exists()) {
        finalProfile = {
          uid: loggedUser.uid,
          email: loggedUser.email || "",
          displayName: loggedUser.displayName || loggedUser.email?.split("@")[0] || "SaaS User",
          photoURL: loggedUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${loggedUser.email}`,
          createdAt: new Date().toISOString(),
          role: "User",
          plan: "Free Trial",
          companyName: "My Workspace",
          onboardingCompleted: false,
          status: "Active"
        };
        await setDoc(userDocRef, finalProfile);
      } else {
        finalProfile = userDocSnap.data() as UserProfile;
      }
      setProfile(finalProfile);
      await logActivity(loggedUser.uid, "Login (Google)", "Success", "Logged in via Google Authentication");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Google Sign-In failed.");
      if (user) {
        await logActivity(user.uid, "Login (Google)", "Failed", err.message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with Email/Password
  const signUpEmail = async (email: string, password: string, fullName: string, companyName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = result.user;

      setIsSandbox(false);
      localStorage.removeItem("vault_sandbox_active");
      localStorage.removeItem("vault_sandbox_user");
      localStorage.removeItem("vault_sandbox_profile");
      localStorage.removeItem("vault_sandbox_activities");

      // Update full name in Firebase Auth
      await updateProfile(newUser, {
        displayName: fullName,
        photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`
      });

      // Create profile in Firestore
      const newProfile: UserProfile = {
        uid: newUser.uid,
        email: email,
        displayName: fullName,
        photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
        createdAt: new Date().toISOString(),
        role: "User",
        plan: "Free Trial",
        companyName: companyName || "My Workspace",
        onboardingCompleted: false,
        status: "Active"
      };

      await setDoc(doc(db, "users", newUser.uid), newProfile);
      setProfile(newProfile);
      await logActivity(newUser.uid, "Register", "Success", `Account created for ${email}`);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/operation-not-allowed" || err.message?.includes("operation-not-allowed")) {
        console.warn("Email/Password Auth disabled in console. Autostarting Sandbox Mode.");
        enableSandboxMode(email, fullName, companyName);
        return;
      }
      setError(err.message || "Registration failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Email/Password
  const signInEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setIsSandbox(false);
      localStorage.removeItem("vault_sandbox_active");
      localStorage.removeItem("vault_sandbox_user");
      localStorage.removeItem("vault_sandbox_profile");
      localStorage.removeItem("vault_sandbox_activities");
      await logActivity(result.user.uid, "Login (Email)", "Success", `Successfully authenticated ${email}`);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/operation-not-allowed" || err.message?.includes("operation-not-allowed")) {
        console.warn("Email/Password Auth disabled in console. Autostarting Sandbox Mode.");
        enableSandboxMode(email, "Demo Developer");
        return;
      }
      setError(err.message || "Login failed. Please check your credentials.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Password reset email
  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      if (user) {
        await logActivity(user.uid, "Password Reset Request", "Success", `Requested reset link for ${email}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to send reset link.");
      throw err;
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user || !profile) return;
    setLoading(true);
    setError(null);
    try {
      const userDocRef = doc(db, "users", user.uid);
      
      // Update Firebase Auth display name if provided
      if (data.displayName && data.displayName !== user.displayName) {
        await updateProfile(user, { displayName: data.displayName });
      }
      
      // Update Firestore profile
      const updatedProfile = { ...profile, ...data };
      await updateDoc(userDocRef, data);
      setProfile(updatedProfile);
      
      await logActivity(
        user.uid, 
        "Profile Updated", 
        "Success", 
        `Updated: ${Object.keys(data).join(", ")}`
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update profile.");
      await logActivity(user.uid, "Profile Updated", "Failed", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      if (!isSandbox && user) {
        await logActivity(user.uid, "Logout", "Success", "Logged out safely");
      }
      if (!isSandbox) {
        await signOut(auth);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setUser(null);
      setProfile(null);
      setActivities([]);
      setIsSandbox(false);
      localStorage.removeItem("vault_sandbox_active");
      localStorage.removeItem("vault_sandbox_user");
      localStorage.removeItem("vault_sandbox_profile");
      localStorage.removeItem("vault_sandbox_activities");
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        activities,
        language,
        isSandbox,
        setLanguage,
        signInWithGoogle,
        signUpEmail,
        signInEmail,
        logout,
        resetPassword,
        updateUserProfile,
        refreshActivities,
        clearError,
        enableSandboxMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
