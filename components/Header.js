"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/presentes", label: "Lista de Presentes" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-blush/70 shadow-sm backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-5 sm:flex-row sm:justify-between">
        <Link href="/" className="font-nerko text-4xl text-rose sm:text-5xl">
          Bia&apos;s Wish List
        </Link>

        <nav className="flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-comic text-lg text-rose hover:underline ${
                pathname === link.href ? "underline" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="rounded-full border-2 border-rose px-4 py-1 font-comic text-rose transition hover:bg-rose hover:text-white"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
