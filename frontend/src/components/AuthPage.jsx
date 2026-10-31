import { useState } from "react";
import { BriefcaseBusiness } from "lucide-react";

export default function AuthPage({ onAuthenticate }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegistering = mode === "register";

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onAuthenticate(mode, { email, password });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <a className="brand auth-brand" href="#main">Pipeline<span>.</span></a>
        <div className="auth-icon"><BriefcaseBusiness size={22} /></div>
        <p className="eyebrow">YOUR CAREER, ORGANIZED</p>
        <h1 id="auth-title">{isRegistering ? "Create your account" : "Welcome back"}</h1>
        <p className="auth-description">Sign in to manage your applications and opportunities.</p>

        <form className="auth-form" onSubmit={submit}>
          <label htmlFor="auth-email">Email address</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            autoComplete={isRegistering ? "new-password" : "current-password"}
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {isRegistering && <small className="password-hint">Use 8–72 characters.</small>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button auth-submit" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegistering ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="auth-toggle">
          {isRegistering ? "Already have an account?" : "New to Pipeline?"}{" "}
          <button type="button" onClick={() => {
            setMode(isRegistering ? "login" : "register");
            setError("");
          }}>
            {isRegistering ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
    </main>
  );
}
