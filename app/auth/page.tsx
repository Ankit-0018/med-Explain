"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        router.replace("/");
      }
    });
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    if (mode === "register" && password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (mode === "register" && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (data.session) {
          router.replace("/");
          return;
        }

        setInfoMessage("Logged in successfully.");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (data.session) {
          router.replace("/");
          return;
        }

        setInfoMessage(
          "Registration successful. Check your email to confirm your account.",
        );
        setMode("login");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setInfoMessage(null);
    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-foreground/50">
            MedExplain AI
          </p>
          <h1 className="text-3xl font-black">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-foreground/70">
            {mode === "login"
              ? "Sign in to access your medication explanations."
              : "Register to begin saving your consultations."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-semibold text-foreground/80">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-foreground outline-none transition focus:border-primary"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm font-semibold text-foreground/80">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-foreground outline-none transition focus:border-primary"
              placeholder="••••••••"
            />
          </label>

          {mode === "register" && (
            <label className="block text-sm font-semibold text-foreground/80">
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-foreground outline-none transition focus:border-primary"
                placeholder="••••••••"
              />
            </label>
          )}

          {errorMessage && (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          {infoMessage && (
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {infoMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-[28px] bg-primary py-4 text-sm font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? mode === "login"
                ? "Signing in..."
                : "Registering..."
              : mode === "login"
                ? "Sign In"
                : "Register"}
          </button>

          <div className="relative my-4 text-center text-xs uppercase tracking-[0.35em] text-foreground/40">
            <span className="bg-slate-950/80 px-3">or</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-[28px] border border-white/10 bg-slate-950/90 py-4 text-sm font-bold text-foreground transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
              <svg
                viewBox="0 0 18 18"
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.63-.06-1.23-.17-1.82H9v3.44h4.84c-.21 1.12-.84 2.06-1.79 2.7v2.24h2.89c1.69-1.56 2.66-3.86 2.66-6.56z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.89-2.24c-.8.54-1.83.86-3.07.86-2.36 0-4.36-1.59-5.08-3.73H.99v2.34C2.47 15.96 5.48 18 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.92 10.71c-.18-.54-.28-1.12-.28-1.71s.1-1.17.28-1.71V4.95H.99C.36 6.32 0 7.85 0 9.3c0 1.45.36 2.98.99 4.35l2.93-2.94z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.32 0 2.51.45 3.45 1.34l2.58-2.58C13.43.99 11.4 0 9 0 5.48 0 2.47 2.04.99 4.95l2.93 2.34C4.64 5.17 6.64 3.58 9 3.58z"
                />
              </svg>
            </span>
            Continue with Google
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-foreground/70">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setErrorMessage(null);
                  setInfoMessage(null);
                }}
                className="font-semibold text-white underline underline-offset-4"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMessage(null);
                  setInfoMessage(null);
                }}
                className="font-semibold text-white underline underline-offset-4"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
