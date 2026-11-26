"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function GoogleAuthButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signInWithGoogle() {
    setBusy(true);
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setBusy(false);
      setError(error.message);
    }
  }

  return (
    <>
      <button
        className="googleButton"
        disabled={busy}
        onClick={signInWithGoogle}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 48 48" width="20" height="20">
          <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.7-4.1 6.1l6.6 5.1c3.9-3.6 6.1-8.8 6.1-14.9Z" />
          <path fill="#34A853" d="M24 44c5.4 0 9.9-1.8 13.2-4.8l-6.6-5.1c-1.8 1.2-4.1 1.9-6.6 1.9-5.1 0-9.4-3.4-11-8l-6.8 5.2C9.5 39.6 16.3 44 24 44Z" />
          <path fill="#FBBC05" d="M13 28c-.4-1.2-.7-2.6-.7-4s.3-2.8.7-4l-6.8-5.2C4.8 17.3 4 20.5 4 24s.8 6.7 2.2 9.2L13 28Z" />
          <path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.9 29.5 4 24 4 16.3 4 9.5 8.4 6.2 14.8L13 20c1.6-4.6 5.9-8 11-8Z" />
        </svg>
        {busy ? "Connecting to Google…" : "Continue with Google"}
      </button>
      {error && <div className="error">{error}</div>}
      <div className="authDivider"><span>or continue with email</span></div>
    </>
  );
}
