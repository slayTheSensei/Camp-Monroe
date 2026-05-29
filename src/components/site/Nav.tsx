"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { id: "camp", href: "/the-camp", label: "The Camp" },
  { id: "visit", href: "/visit", label: "Visit" },
  { id: "renovation", href: "/renovation", label: "2026 Renovation" },
  { id: "membership", href: "/membership", label: "Membership" },
  { id: "locations", href: "/locations", label: "Locations" },
  { id: "history", href: "/history", label: "History" },
  { id: "partner", href: "/partner", label: "Partner", fullLabel: "Partner with us" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuShown, setMenuShown] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-lock");
      const id = requestAnimationFrame(() => setMenuShown(true));
      return () => cancelAnimationFrame(id);
    }
    document.body.classList.remove("menu-lock");
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuShown(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuOpen(false), 360);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  const navTo = useCallback(
    (href: string) => {
      closeMenu();
      router.push(href);
    },
    [closeMenu, router]
  );

  const navCls = [
    "nav",
    scrolled ? "scrolled" : "",
    menuOpen ? "menu-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={navCls}>
      <div className="nav-inner">
        <Link className="brand" href="/">
          <span className="l1">Cambridge Gun &amp; Rod Club</span>
          <span className="l2">Est. 1893 · Maine</span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {NAV_LINKS.map((r) => (
            <Link
              key={r.id}
              href={r.href}
              className={pathname === r.href ? "active" : undefined}
            >
              {r.label}
            </Link>
          ))}
          <Link className="btn btn-amber nav-cta" href="/request">
            Request an invitation
          </Link>
        </nav>

        <button
          className="nav-burger"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <div
          className={`mobile-menu${menuShown ? " is-in" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="mm-bar">
            <Link className="brand" href="/" onClick={closeMenu}>
              <span className="l1">Cambridge Gun &amp; Rod Club</span>
              <span className="l2">Est. 1893 · Maine</span>
            </Link>
            <button className="mm-close" aria-label="Close menu" onClick={closeMenu}>
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          <nav className="mm-links" aria-label="Mobile">
            {NAV_LINKS.map((r, i) => (
              <a
                key={r.id}
                href={r.href}
                className={`mm-link${pathname === r.href ? " active" : ""}`}
                style={{ ["--i" as string]: i }}
                onClick={(e) => {
                  e.preventDefault();
                  navTo(r.href);
                }}
              >
                <span className="mm-num">0{i + 1}</span>
                <span className="mm-label">{r.fullLabel ?? r.label}</span>
              </a>
            ))}
          </nav>

          <div className="mm-foot">
            <a
              className="btn btn-amber mm-cta"
              href="/request"
              onClick={(e) => {
                e.preventDefault();
                navTo("/request");
              }}
            >
              Request an invitation <span className="arr" />
            </a>
            <div className="mm-meta">Lake Cobbosseecontee · West Gardiner, Maine</div>
          </div>
        </div>
      )}
    </header>
  );
}
