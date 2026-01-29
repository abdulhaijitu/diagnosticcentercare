import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";

interface MainLayoutProps {
  children: ReactNode;
  showFloatingActions?: boolean;
}

export function MainLayout({ children, showFloatingActions = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      {showFloatingActions && <FloatingActions />}
    </div>
  );
}
