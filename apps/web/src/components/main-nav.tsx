"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@repo/ui/icons";
import { cn } from "@repo/ui/lib/utils";
import { docsConfig } from "@/config/docs";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
        <Logo />
        <span className="hidden font-bold lg:inline-block">AuthEz</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {docsConfig.mainNav.map((navItem, index) => (
          <Link
            key={index}
            href={navItem.href || "#"}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === navItem.href
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            {navItem.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
