"use client";

// Next Imports
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Context
import { useAuth } from "@/context/AuthContext";
// Services
import { ApiService, AuthService } from "@/services";

const apiService = new ApiService();
const authService = new AuthService(apiService);

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      authService.check();
    };
    fetchData();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authService.login({
        username,
        password,
      });

      if (!result.success && result.httpCode !== 200) {
        setError("Failed to login, please try again");
      }

      if (result.success && result.httpCode === 200) {
        console.log("went here", {
          result,
          data: result.data?.data,
          token: result.data?.token,
        });
        login(result.data?.token);
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#fbf7f2,transparent_38%),linear-gradient(180deg,#f7efe7_0%,#f2e8de_100%)]">
      <div className="w-full max-w-md">
        <div className="admin-card p-8">
          <div className="mb-8 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-latte">
              Brew Reserve
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-roast">
              Admin Login
            </h1>
            <p className="text-sm leading-6 text-mocha/75">
              Authorized personnel only. Enter your credentials to access the
              dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="label-base">
                Username
              </label>
              <input
                id="username"
                className="input-base"
                type="text"
                autoComplete="username"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label-base">
                Password
              </label>
              <input
                id="password"
                className="input-base"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
