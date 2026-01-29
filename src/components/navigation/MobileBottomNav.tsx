import { Link, useLocation } from "react-router-dom";
import { Home, TestTube, Stethoscope, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { icon: Home, label: "হোম", labelEn: "Home", href: "/" },
  { icon: TestTube, label: "টেস্ট", labelEn: "Book Test", href: "/book-test" },
  { icon: Stethoscope, label: "ডাক্তার", labelEn: "Doctors", href: "/doctors" },
  { icon: FileText, label: "রিপোর্ট", labelEn: "Reports", href: "/my-requests" },
  { icon: User, label: "প্রোফাইল", labelEn: "Profile", href: "/profile" },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  // Update profile link based on auth status
  const items = navItems.map((item) => {
    if (item.href === "/profile" && !user) {
      return { ...item, href: "/login" };
    }
    return item;
  });

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-card/95 backdrop-blur-lg border-t border-border",
        "lg:hidden", // Hide on desktop/laptop/tablet
        "pb-safe" // Safe area for iOS
      )}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full",
                "transition-all duration-200 ease-out",
                "min-w-[64px] py-2",
                "touch-manipulation", // Better touch handling
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl mb-0.5",
                  "transition-all duration-200 ease-out",
                  active && "bg-primary/10"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    active && "scale-110"
                  )}
                  strokeWidth={active ? 2.5 : 2}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium leading-tight",
                  active && "font-semibold"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
