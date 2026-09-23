"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { href: "#experience", label: "Trải nghiệm" },
  { href: "#how-it-works", label: "Cách học" },
  { href: "#languages", label: "Ngôn ngữ" },
  { href: "#faq", label: "FAQ" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="site-header">
      <nav className="nav-pill" aria-label="Điều hướng chính">
        <a href="#top" className="brand" onClick={() => setOpen(false)} aria-label="Zhonglish, về đầu trang">
          <span className="brand-symbol" aria-hidden="true">中</span>
          <span>Zhonglish</span>
        </a>
        <div className="desktop-nav">
          {links.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </div>
        <a className="nav-cta" href="#languages">Bắt đầu học <ArrowUpRight size={16} aria-hidden="true" /></a>
        <button ref={toggleRef} className="menu-toggle" type="button" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="mobile-menu">
          {links.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
          <a className="mobile-menu-cta" href="#languages" onClick={() => setOpen(false)}>Bắt đầu học <ArrowUpRight size={18} /></a>
        </div>
      )}
    </header>
  );
}
