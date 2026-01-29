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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, Phone, Mail, User, LogOut, LayoutDashboard, ClipboardList, Settings, CalendarCheck } from "lucide-react";
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
            <div className="hidden lg:flex items-center gap-1">
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
              <Button 
                asChild 
                size="sm" 
                className="ml-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
              >
                <Link to="/book-test">Book Test</Link>
              </Button>
            </div>

            {/* Desktop CTA / User Menu */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoading ? (
                <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
              ) : user ? (
                <>
                  <NotificationBell />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2 pl-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {(profile?.full_name || user.email || "U").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
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
                      <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-appointments" className="flex items-center gap-2 cursor-pointer">
                        <CalendarCheck className="h-4 w-4" />
                        My Appointments
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-requests" className="flex items-center gap-2 cursor-pointer">
                        <ClipboardList className="h-4 w-4" />
                        My Test Requests
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
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-6 h-6">
                <Menu 
                  className={cn(
                    "absolute inset-0 h-6 w-6 text-foreground transition-all duration-300",
                    mobileMenuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                  )} 
                />
                <X 
                  className={cn(
                    "absolute inset-0 h-6 w-6 text-foreground transition-all duration-300",
                    mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                  )} 
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={cn(
            "lg:hidden border-t border-border bg-card overflow-hidden transition-all duration-300 ease-out",
            mobileMenuOpen 
              ? "max-h-[calc(100vh-80px)] opacity-100" 
              : "max-h-0 opacity-0"
          )}
        >
          <div className="container-custom py-4 space-y-2">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  "transform transition-all",
                  mobileMenuOpen 
                    ? "translate-x-0 opacity-100" 
                    : "-translate-x-4 opacity-0",
                  location.pathname === item.href
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                style={{ 
                  transitionDelay: mobileMenuOpen ? `${index * 50}ms` : "0ms" 
                }}
              >
                {item.name}
              </Link>
            ))}
            {/* Highlighted Book Test CTA for Mobile */}
            <Button 
              asChild 
              className={cn(
                "w-full mt-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25",
                "transform transition-all duration-300",
                mobileMenuOpen 
                  ? "translate-y-0 opacity-100" 
                  : "translate-y-4 opacity-0"
              )}
              style={{ 
                transitionDelay: mobileMenuOpen ? `${navigation.length * 50}ms` : "0ms" 
              }}
            >
              <Link to="/book-test" onClick={() => setMobileMenuOpen(false)}>
                Book Test
              </Link>
            </Button>
            <div 
              className={cn(
                "pt-4 border-t border-border space-y-2 transition-all duration-300",
                mobileMenuOpen 
                  ? "translate-y-0 opacity-100" 
                  : "translate-y-4 opacity-0"
              )}
              style={{ 
                transitionDelay: mobileMenuOpen ? `${(navigation.length + 1) * 50}ms` : "0ms" 
              }}
            >
              {user ? (
                <>
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/my-appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    My Appointments
                  </Link>
                  <Link
                    to="/my-requests"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    My Requests
                  </Link>
                  {(isAdmin || isStaff) && (
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive"
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
            <div 
              className={cn(
                "pt-4 border-t border-border space-y-2 text-sm text-muted-foreground transition-all duration-300",
                mobileMenuOpen 
                  ? "translate-y-0 opacity-100" 
                  : "translate-y-4 opacity-0"
              )}
              style={{ 
                transitionDelay: mobileMenuOpen ? `${(navigation.length + 2) * 50}ms` : "0ms" 
              }}
            >
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
      </nav>
    </header>
  );
}
