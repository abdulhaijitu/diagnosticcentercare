import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "icon" | "full" | "compact";
  className?: string;
}

export function LanguageSwitcher({ variant = "compact", className }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === "bn" ? "en" : "bn";
    i18n.changeLanguage(newLang);
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleLanguage}
        className={cn("h-9 w-9", className)}
        title={currentLang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
      >
        <Globe className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn("gap-1.5 text-xs font-medium", className)}
    >
      <Globe className="h-3.5 w-3.5" />
      {currentLang === "bn" ? "EN" : "বাং"}
    </Button>
  );
}
