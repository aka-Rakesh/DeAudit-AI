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

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
            Docs
          </Link>
          <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
            API
          </Link>
          <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
            Pricing
          </Link>
          <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="https://github.com" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
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
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary px-2 py-1.5">
              Docs
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary px-2 py-1.5">
              API
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary px-2 py-1.5">
              Pricing
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary px-2 py-1.5">
              About
            </Link>
            <div className="w-full mt-2"><WalletConnect /></div>
          </nav>
        </div>
      )}
    </header>
  );
}