import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutTemplate, History, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4 md:px-8">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <LayoutTemplate className="h-5 w-5" />
              <span className="hidden font-bold font-display sm:inline-block">
                Design System Forge
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/"
                className={`transition-colors hover:text-foreground/80 ${
                  location === "/" ? "text-foreground" : "text-foreground/60"
                }`}
              >
                Import
              </Link>
              <Link
                href="/history"
                className={`transition-colors hover:text-foreground/80 ${
                  location === "/history" ? "text-foreground" : "text-foreground/60"
                }`}
              >
                History
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
             <Link href="/">
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <Plus className="h-4 w-4" />
                  <span>New Project</span>
                </Button>
             </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center max-w-screen-2xl w-full mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
