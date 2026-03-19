import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Activity, Pill, LayoutDashboard, ShieldPlus } from "lucide-react";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/records", label: "Medical Records", icon: Activity },
    { href: "/medications", label: "Medications", icon: Pill },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-card border-b p-4 flex items-center gap-3 sticky top-0 z-50">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ShieldPlus className="w-6 h-6 text-primary" />
        </div>
        <h1 className="font-display font-bold text-xl text-foreground">MedVault</h1>
      </header>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r fixed h-screen top-0 left-0 z-40">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldPlus className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">MedVault</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className="block">
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-transform duration-200",
                      isActive ? "text-primary-foreground" : "group-hover:scale-110"
                    )}
                  />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 m-4 bg-accent/50 rounded-2xl border border-accent">
          <p className="text-sm text-foreground/80 font-medium">Your Health Data</p>
          <p className="text-xs text-muted-foreground mt-1">Encrypted and secure.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative">
        {/* Mobile Nav (Bottom) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t flex justify-around p-3 z-50 safe-area-bottom">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center">
                <div
                  className={cn(
                    "p-2 rounded-xl transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                </div>
                <span className={cn("text-[10px] mt-1 font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
