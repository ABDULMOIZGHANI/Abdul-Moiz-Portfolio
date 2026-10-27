"use client";
import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="form">
      <div className="field">
        <label htmlFor="pw">Password</label>
        <input id="pw" name="password" type="password" className="input" required autoFocus autoComplete="current-password" />
      </div>
      {state?.error && <p className="form-msg err" role="alert">{state.error}</p>}
      <button className="btn pri" type="submit" disabled={pending} style={{ justifyContent: "center" }}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
