
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      <Button onClick={() => changeLanguage("fr")} disabled={i18n.language === "fr"}>
        Fr
      </Button>
      <Button onClick={() => changeLanguage("ar")} disabled={i18n.language === "ar"}>
        Ar
      </Button>
    </div>
  );
}
