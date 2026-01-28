import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Phone, Mail, User, LogOut, LayoutDashboard, ClipboardList, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import trustCareLogo from "@/assets/trust-care-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Doctors", href: "/doctors" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isLoading, isAdmin, isStaff, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar with contact info */}
      <div className="hidden md:block bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-6">
              <a 
                href="tel:01345580203" 
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Phone className="h-4 w-4" />
                <span>01345580203</span>
              </a>
              <a 
                href="mailto:trustcaredc@gmail.com" 
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Mail className="h-4 w-4" />
                <span>trustcaredc@gmail.com</span>
              </a>
            </div>
            <p className="text-primary-foreground/80">
              Your Trust, Your Care — Fast & Accurate Lab Service
            </p>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={trustCareLogo} 
                alt="TrustCare Logo" 
                className="h-10 md:h-12 w-auto"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg md:text-xl text-foreground leading-tight">
                  TrustCare
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Diagnostic Center
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    location.pathname === item.href
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              {/* Highlighted Book Test CTA */}
              <Button asChild size="sm" className="ml-2">
                <Link to="/book-test">Book Test</Link>
              </Button>
            </div>

            {/* Desktop CTA / User Menu */}
            <div className="hidden md:flex items-center gap-3">
              {isLoading ? (
                <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
              ) : user ? (
                <>
                  <NotificationBell />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <User className="h-4 w-4" />
                        <span className="max-w-[120px] truncate">
                          {profile?.full_name || user.email?.split("@")[0]}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/my-requests" className="flex items-center gap-2 cursor-pointer">
                        <ClipboardList className="h-4 w-4" />
                        My Requests
                      </Link>
                    </DropdownMenuItem>
                    {(isAdmin || isStaff) && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem asChild>
                            <Link to="/settings/notifications" className="flex items-center gap-2 cursor-pointer">
                              <Settings className="h-4 w-4" />
                              Notification Settings
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/login">Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card animate-fade-in">
            <div className="container-custom py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    location.pathname === item.href
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              {/* Highlighted Book Test CTA for Mobile */}
              <Button asChild className="w-full mt-2">
                <Link to="/book-test" onClick={() => setMobileMenuOpen(false)}>
                  Book Test
                </Link>
              </Button>
              <div className="pt-4 border-t border-border space-y-2">
                {user ? (
                  <>
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Link
                      to="/my-requests"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      My Requests
                    </Link>
                    {(isAdmin || isStaff) && (
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        Dashboard
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      className="w-full text-destructive"
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        Log In
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
              {/* Mobile contact info */}
              <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                <a 
                  href="tel:01345580203" 
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>01345580203</span>
                </a>
                <a 
                  href="mailto:trustcaredc@gmail.com" 
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>trustcaredc@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
