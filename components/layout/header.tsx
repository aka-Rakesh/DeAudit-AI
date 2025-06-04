"use client";

import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Github,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { WalletConnect } from "@/components/wallet/connect";
import { usePathname } from "next/navigation";

// Utility for smooth scroll with offset
function scrollToHashWithOffset(hash: string, offset = 80) {
  const el = document.getElementById(hash.replace('#', ''));
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Helper to handle nav click
  function handleNavClick(e: React.MouseEvent, hash: string) {
    if (pathname === "/") {
      e.preventDefault();
      scrollToHashWithOffset(hash);
    } else {
      // Go to home with hash
      window.location.href = `/${hash}`;
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">DeAudit AI</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium transition-colors hover:text-primary" onClick={e => handleNavClick(e, '#features')}>
            Features
          </a>
          <a href="#community-qa" className="text-sm font-medium transition-colors hover:text-primary" onClick={e => handleNavClick(e, '#community-qa')}>
            Community Q&amp;A
          </a>
          <a href="#leaderboard" className="text-sm font-medium transition-colors hover:text-primary" onClick={e => handleNavClick(e, '#leaderboard')}>
            Leaderboard
          </a>
          <a href="#about" className="text-sm font-medium transition-colors hover:text-primary" onClick={e => handleNavClick(e, '#about')}>
            About
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="https://github.com/move-language/move" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
              <span className="sr-only">Move Docs (GitHub)</span>
            </Link>
          </Button>
          <ModeToggle />
          <div className="hidden md:flex"><WalletConnect /></div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t py-4">
          <nav className="container flex flex-col space-y-3">
            <a href="#features" className="text-sm font-medium transition-colors hover:text-primary px-2 py-1.5" onClick={e => { handleNavClick(e, '#features'); setIsMenuOpen(false); }}>
              Features
            </a>
            <a href="#community-qa" className="text-sm font-medium transition-colors hover:text-primary px-2 py-1.5" onClick={e => { handleNavClick(e, '#community-qa'); setIsMenuOpen(false); }}>
              Community Q&amp;A
            </a>
            <a href="#leaderboard" className="text-sm font-medium transition-colors hover:text-primary px-2 py-1.5" onClick={e => { handleNavClick(e, '#leaderboard'); setIsMenuOpen(false); }}>
              Leaderboard
            </a>
            <a href="#about" className="text-sm font-medium transition-colors hover:text-primary px-2 py-1.5" onClick={e => { handleNavClick(e, '#about'); setIsMenuOpen(false); }}>
              About
            </a>
            <div className="w-full mt-2"><WalletConnect /></div>
          </nav>
        </div>
      )}
    </header>
  );
}