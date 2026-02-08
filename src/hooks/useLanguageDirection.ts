import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Syncs the <html lang> attribute with the current i18n language.
 * This drives the CSS font-family switch via html[lang="bn"] selector.
 */
export function useLanguageDirection() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language === "bn" ? "bn" : "en";
  }, [i18n.language]);
}
