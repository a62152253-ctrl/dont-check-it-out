import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../../hooks/useAuth";
import { translations } from "../../../lib/translations";
import { 
  Mail, 
  Lock, 
  User, 
  Building, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Chrome, 
  Check, 
  X, 
  AlertCircle, 
  ArrowLeft,
  Zap
} from "lucide-react";

type AuthTab = "login" | "register" | "forgot";

export default function AuthForms() {
  const { 
    signInEmail, 
    signUpEmail, 
    signInWithGoogle, 
    resetPassword, 
    error, 
    clearError,
    loading,
    language,
    setLanguage
  } = useAuth();

  const t = translations[language];

  const [tab, setTab] = useState<AuthTab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Password Validation states
  const [passRequirements, setPassRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [passwordScore, setPasswordScore] = useState(0);

  // Run password strength analyzer
  useEffect(() => {
    if (tab !== "register") return;
    
    const reqs = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    
    setPassRequirements(reqs);

    // Calculate score
    const score = Object.values(reqs).filter(Boolean).length;
    setPasswordScore(score);
  }, [password, tab]);

  // Handle errors cleanup
  useEffect(() => {
    clearError();
    setLocalError(null);
    setSuccessMessage(null);
  }, [tab]);

  // Fast Login with a secure Demo Account (registers on-demand if missing)
  const handleFastLogin = async () => {
    setLocalError(null);
    setSuccessMessage(null);
    clearError();
    
    let demoEmail = localStorage.getItem("vault_demo_email");
    if (!demoEmail) {
      demoEmail = `demo_${Math.random().toString(36).substring(2, 10)}@demovault.com`;
      localStorage.setItem("vault_demo_email", demoEmail);
    }
    const demoPassword = "DemoPassword123!";
    const demoName = "Demo Developer";

    try {
      await signInEmail(demoEmail, demoPassword);
      clearError();
    } catch (err: any) {
      console.warn("Fast login sign-in failed, attempting registration:", err);
      try {
        clearError();
        await signUpEmail(demoEmail, demoPassword, demoName, "CipherVault Demo Ltd.");
        clearError();
      } catch (signUpErr: any) {
        console.warn("Fast login registration failed, attempting final sign-in:", signUpErr);
        const isAlreadyInUse = signUpErr.code?.includes("email-already-in-use") || signUpErr.message?.includes("email-already-in-use");
        if (isAlreadyInUse) {
          try {
            clearError();
            await signInEmail(demoEmail, demoPassword);
            clearError();
          } catch (finalErr: any) {
            console.error("Fast login final sign-in failed:", finalErr);
            setLocalError(
              language === "PL"
                ? `Błąd szybkiego logowania: ${finalErr.message || finalErr}`
                : `Fast login error: ${finalErr.message || finalErr}`
            );
          }
        } else {
          setLocalError(
            language === "PL"
              ? `Rejestracja konta demo nie powiodła się: ${signUpErr.message || signUpErr}`
              : `Demo registration failed: ${signUpErr.message || signUpErr}`
          );
        }
      }
    }
  };

  // Standard submit action
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    try {
      if (tab === "login") {
        if (!email || !password) {
          setLocalError(language === "PL" ? "Wpisz wszystkie dane uwierzytelniające." : "Please fill in all credentials.");
          return;
        }
        await signInEmail(email, password);
      } else if (tab === "register") {
        if (!email || !password || !fullName) {
          setLocalError(language === "PL" ? "Wypełnij wszystkie wymagane pola." : "Please complete all required fields.");
          return;
        }
        if (passwordScore < 4) {
          setLocalError(language === "PL" ? "Wybierz silniejsze hasło spełniające wymagania." : "Please choose a stronger password matching the requirements.");
          return;
        }
        if (!termsAccepted) {
          setLocalError(language === "PL" ? "Musisz zaakceptować warunki korzystania z portalu." : "You must accept our service conditions.");
          return;
        }
        await signUpEmail(email, password, fullName, companyName);
      } else if (tab === "forgot") {
        if (!email) {
          setLocalError(language === "PL" ? "Podaj swój adres e-mail." : "Please type in your email address.");
          return;
        }
        await resetPassword(email);
        setSuccessMessage(language === "PL" ? "Link resetujący hasło został wysłany na Twój e-mail!" : "A password reset link has been dispatched to your mailbox!");
        setEmail("");
      }
    } catch (err: any) {
      console.error(err);
      const firebaseError = err.code || err.message || "";
      if (firebaseError.includes("auth/invalid-credential")) {
        setLocalError(language === "PL" ? "Podane dane są niepoprawne. Spróbuj ponownie." : "The credentials provided are invalid. Try again.");
      } else if (firebaseError.includes("auth/email-already-in-use")) {
        setLocalError(language === "PL" ? "Ten e-mail jest już połączony z istniejącym kontem." : "This email is already linked to an existing account.");
      } else if (firebaseError.includes("auth/weak-password")) {
        setLocalError(language === "PL" ? "Wybrane hasło nie spełnia podstawowych wymogów bezpieczeństwa." : "The password chosen does not meet standard safety rules.");
      } else if (firebaseError.includes("auth/user-not-found")) {
        setLocalError(language === "PL" ? "Nie znaleziono konta dla podanego adresu e-mail." : "No account found with this email address.");
      } else {
        setLocalError(err.message || (language === "PL" ? "Wystąpił nieoczekiwany błąd. Spróbuj ponownie." : "An unexpected error occurred. Please try again."));
      }
    }
  };

  // Google Sign-In helper
  const handleGoogleSignIn = async () => {
    setLocalError(null);
    setSuccessMessage(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      if (err.code !== "auth/popup-closed-by-user") {
        setLocalError(err.message || "Google Single Sign-On failed.");
      }
    }
  };

  // Password strength progress bar layout
  const getStrengthProgressColor = () => {
    switch (passwordScore) {
      case 1: return "bg-red-500 w-1/5";
      case 2: return "bg-orange-500 w-2/5";
      case 3: return "bg-yellow-500 w-3/5";
      case 4: return "bg-blue-500 w-4/5";
      case 5: return "bg-emerald-500 w-full";
      default: return "bg-slate-200 w-0";
    }
  };

  const getStrengthText = () => {
    switch (passwordScore) {
      case 1: return { text: t.strengthDangerous, color: "text-red-500" };
      case 2: return { text: t.strengthWeak, color: "text-orange-500" };
      case 3: return { text: t.strengthAverage, color: "text-yellow-600" };
      case 4: return { text: t.strengthGood, color: "text-blue-500" };
      case 5: return { text: t.strengthStrong, color: "text-emerald-500 font-semibold" };
      default: return { text: "N/A", color: "text-slate-400" };
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Floating Language Switcher */}
      <div className="absolute top-6 right-6 flex gap-1 bg-white/5 border border-white/5 rounded-lg p-0.5 text-[10px] z-20">
        <button
          type="button"
          onClick={() => setLanguage("PL")}
          className={`px-2.5 py-1 rounded-md font-mono transition-all duration-200 cursor-pointer ${
            language === "PL" 
              ? "bg-white/10 text-white font-bold shadow-sm" 
              : "text-slate-500 hover:text-white"
          }`}
        >
          PL
        </button>
        <button
          type="button"
          onClick={() => setLanguage("EN")}
          className={`px-2.5 py-1 rounded-md font-mono transition-all duration-200 cursor-pointer ${
            language === "EN" 
              ? "bg-white/10 text-white font-bold shadow-sm" 
              : "text-slate-500 hover:text-white"
          }`}
        >
          EN
        </button>
      </div>

      <div className="w-full max-w-md bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden cyber-scanner">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center rounded-lg shadow-lg shadow-emerald-500/10">
            <Lock className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight text-white">
            CipherVault
          </span>
        </div>

        {/* Dynamic Headers */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            {tab === "login" && (
              <motion.div
                key="login-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-3xl font-light text-white tracking-tight">
                  {t.loginTitle}
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                  {t.loginSub}
                </p>
              </motion.div>
            )}
            
            {tab === "register" && (
              <motion.div
                key="register-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-3xl font-light text-white tracking-tight">
                  {t.registerTitle}
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                  {t.registerSub}
                </p>
              </motion.div>
            )}

            {tab === "forgot" && (
              <motion.div
                key="forgot-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-3xl font-light text-white tracking-tight">
                  {t.forgotTitle}
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                  {t.forgotSub}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Success / Error feedback */}
        <AnimatePresence>
          {(localError || error) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex items-start gap-2.5 p-4 bg-red-950/20 border border-red-900/40 rounded-lg text-red-200 text-xs leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span className="font-medium">{localError || error}</span>
              </div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex items-start gap-2.5 p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-emerald-200 text-xs leading-relaxed">
                <Check className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span className="font-medium">{successMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Register-only Display name and organization */}
          {tab === "register" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="fullname" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {t.fullName} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="fullname"
                    type="text"
                    required={tab === "register"}
                    placeholder="E.g., Adam Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-white/10 hover:border-white/20 focus:bg-[#161616] focus:border-white/30 focus:ring-1 focus:ring-white/10 rounded-lg outline-none text-sm transition-all text-white placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {t.company}
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="company"
                    type="text"
                    placeholder="E.g., Acme SaaS Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-white/10 hover:border-white/20 focus:bg-[#161616] focus:border-white/30 focus:ring-1 focus:ring-white/10 rounded-lg outline-none text-sm transition-all text-white placeholder-slate-600"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Core Email input */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {t.emailAddress} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="email"
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-white/10 hover:border-white/20 focus:bg-[#161616] focus:border-white/30 focus:ring-1 focus:ring-white/10 rounded-lg outline-none text-sm transition-all text-white placeholder-slate-600"
              />
            </div>
          </div>

          {/* Password Input (not on Forgot screen) */}
          {tab !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="pass" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {t.password} <span className="text-red-400">*</span>
                </label>
                {tab === "login" && (
                  <button
                    type="button"
                    onClick={() => setTab("forgot")}
                    className="text-xs text-white hover:underline font-medium focus:outline-none cursor-pointer"
                  >
                    {t.forgotPassword}
                  </button>
                )}
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="pass"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={tab === "register" ? "Create a secure password" : "••••••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#121212] border border-white/10 hover:border-white/20 focus:bg-[#161616] focus:border-white/30 focus:ring-1 focus:ring-white/10 rounded-lg outline-none text-sm transition-all text-white placeholder-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded text-slate-400 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Live SaaS password requirements dashboard */}
              {tab === "register" && password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3.5 p-4 bg-[#121212] border border-white/5 rounded-lg space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{t.securityRating}</span>
                    <span className={`font-semibold ${getStrengthText().color}`}>
                      {getStrengthText().text}
                    </span>
                  </div>
                  
                  {/* Visual tracker bar */}
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${getStrengthProgressColor()}`} />
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] pt-1">
                    <div className="flex items-center gap-1.5">
                      {passRequirements.length ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-600" />
                      )}
                      <span className={passRequirements.length ? "text-emerald-300" : "text-slate-500"}>
                        8+ Characters
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {passRequirements.uppercase ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-600" />
                      )}
                      <span className={passRequirements.uppercase ? "text-emerald-300" : "text-slate-500"}>
                        A-Z Uppercase
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {passRequirements.lowercase ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-600" />
                      )}
                      <span className={passRequirements.lowercase ? "text-emerald-300" : "text-slate-500"}>
                        a-z Lowercase
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {passRequirements.number ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-600" />
                      )}
                      <span className={passRequirements.number ? "text-emerald-300" : "text-slate-500"}>
                        0-9 Numbers
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 col-span-2">
                      {passRequirements.special ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-600" />
                      )}
                      <span className={passRequirements.special ? "text-emerald-300" : "text-slate-500"}>
                        Special Symbols (@#$%)
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Terms checkbox on register screen */}
          {tab === "register" && (
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 text-white border-white/15 bg-transparent rounded focus:ring-white mt-0.5 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-400 select-none leading-relaxed cursor-pointer">
                {t.acceptTerms}
              </label>
            </div>
          )}

          {/* CTA Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-lg font-semibold text-black bg-white hover:bg-slate-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-sm shadow-xl shadow-white/5"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing secure request...
              </span>
            ) : (
              <>
                {tab === "login" && t.loginBtn}
                {tab === "register" && t.registerBtn}
                {tab === "forgot" && t.forgotBtn}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </>
            )}
          </button>

          {/* Fast Login Button for effortless demo evaluation */}
          {tab === "login" && (
            <button
              type="button"
              disabled={loading}
              onClick={handleFastLogin}
              className="relative w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-sm shadow-[0_4px_20px_rgba(124,58,237,0.3)] mt-3.5 border border-violet-400/20 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce shrink-0" />
              <span className="tracking-wide">{t.fastLoginBtn}</span>
            </button>
          )}
        </form>

        {/* Back option on password reset */}
        {tab === "forgot" && (
          <button
            type="button"
            onClick={() => setTab("login")}
            className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white mt-5 mx-auto font-medium transition-colors focus:outline-none cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t.backToLogin}
          </button>
        )}

        {/* Divider and Google auth (not on Forgot Password tab) */}
        {tab !== "forgot" && (
          <>
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#080808] px-3.5 text-slate-500 uppercase tracking-widest font-semibold font-mono">{t.orContinueWith}</span>
              </div>
            </div>

            {/* Google Single Sign-On Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg border border-white/10 hover:bg-white/5 text-white font-medium text-xs active:scale-[0.98] transition-all focus:outline-none disabled:opacity-50 cursor-pointer"
            >
              <Chrome className="w-4 h-4 text-white" />
              {t.googleAuth}
            </button>
          </>
        )}

        {/* Auth Mode Toggle Footer */}
        <div className="mt-8 text-center">
          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.p
                key="register-toggle-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-slate-400"
              >
                {t.noAccount}{" "}
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className="text-white hover:underline font-semibold cursor-pointer focus:outline-none"
                >
                  {t.createWorkspace}
                </button>
              </motion.p>
            ) : (
              tab === "register" && (
                <motion.p
                  key="login-toggle-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-slate-400"
                >
                  {t.alreadyRegistered}{" "}
                  <button
                     type="button"
                     onClick={() => setTab("login")}
                     className="text-white hover:underline font-semibold cursor-pointer focus:outline-none"
                  >
                    {t.logInAccount}
                  </button>
                </motion.p>
              )
            )}
          </AnimatePresence>
        </div>
        
        {/* Humble metadata banner */}
        <div className="mt-12 pt-6 border-t border-white/5 text-center">
          <span className="text-[9px] text-slate-600 uppercase tracking-[0.2em] font-mono font-semibold">
            {t.corporateBanner}
          </span>
        </div>

      </div>
    </div>
  );
}
