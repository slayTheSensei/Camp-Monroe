"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function FollowAlong() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError(null);

    const supabase = getAnonClient();
    const { error: insertError } = await supabase.from("waitlist").insert({
      name: name.trim() || null,
      email: email.trim().toLowerCase(),
      trip_interest: null,
      trip_slug: null,
      source: "home_follow_along",
    });

    setSubmitting(false);

    if (insertError) {
      // 23505 = unique violation on email. Treat re-signup as success —
      // a person doesn't need to know they already signed up.
      if (
        insertError.code === "23505" ||
        insertError.message?.toLowerCase().includes("duplicate")
      ) {
        setDone(true);
        return;
      }
      console.error("FollowAlong insert error:", insertError);
      setError("Something went wrong. Please try again.");
      return;
    }

    setDone(true);
  };

  return (
    <section className="follow-along">
      <div className="wrap">
        <div className="fa-inner">
          <div className="fa-text">
            <div className="eyebrow">Follow along</div>
            <h2>The next chapter of the club.</h2>
            <p>
              Leave an email and we&rsquo;ll send a quiet note when there&rsquo;s
              something to share.
            </p>
          </div>

          <div className="fa-form-wrap">
            {done ? (
              <div className="fa-success" role="status">
                <div className="fa-check" aria-hidden="true">
                  ✓
                </div>
                <p>
                  You&rsquo;re on the line{name.trim() ? `, ${name.trim().split(/\s+/)[0]}` : ""}.
                  We&rsquo;ll be in touch.
                </p>
              </div>
            ) : (
              <form className="fa-form" onSubmit={handleSubmit}>
                <div className="fa-fields">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    autoComplete="name"
                    aria-label="Your name"
                    className="fa-input"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    autoComplete="email"
                    inputMode="email"
                    aria-label="Your email"
                    className="fa-input"
                  />
                </div>
                {error && (
                  <p className="fa-error" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  className="btn btn-amber fa-submit"
                  disabled={submitting}
                >
                  {submitting ? "Sending…" : "Follow along"}
                  {!submitting && <span className="arr" />}
                </button>
                <p className="fa-fine">
                  Occasional updates only. No marketing, no spam.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
