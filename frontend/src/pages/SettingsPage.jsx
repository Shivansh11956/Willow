import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Globe } from "lucide-react";
import SimpleSidebar from "../components/SimpleSidebar";
import { useState } from "react";
import { useTranslation } from "../lib/translations";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { t } = useTranslation();
  const [language, setLanguage] = useState(localStorage.getItem('app-language') || 'en');
  
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('app-language', lang);
    window.location.reload(); // Reload to apply translations
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  ];

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-16 sm:pt-20 px-2 sm:px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-7xl laptop:max-w-8xl 3xl:max-w-9xl h-[calc(100vh-4rem)] sm:h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <SimpleSidebar />
            
            <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
              <div className="space-y-6 sm:space-y-8 max-w-6xl laptop:max-w-7xl mx-auto">
        
        {/* Language Settings */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <h2 className="text-xl sm:text-2xl font-semibold">{t('language')}</h2>
            </div>
            <p className="text-sm text-base-content/70">{t('chooseLanguage')}</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border-2 transition-all
                  ${
                    language === lang.code
                      ? 'border-primary bg-primary/10'
                      : 'border-base-300 hover:border-base-400'
                  }
                `}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span className="text-3xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Theme Settings */}
        <div className="flex flex-col gap-1">
          <h2 className="text-xl sm:text-2xl font-semibold">{t('theme')}</h2>
          <p className="text-sm text-base-content/70">{t('chooseTheme')}</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 laptop:grid-cols-12 gap-2 sm:gap-3">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all border-2
                ${theme === t 
                  ? "bg-primary/10 border-primary shadow-md" 
                  : "border-transparent hover:bg-base-200/50 hover:border-base-300"
                }
              `}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-6 sm:h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <h3 className="text-lg sm:text-xl font-semibold mb-3">{t('preview')}</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-2 sm:p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium text-xs sm:text-sm">
                      JS
                    </div>
                    <div>
                      <h3 className="font-medium text-xs sm:text-sm">John Snow</h3>
                      <p className="text-[10px] sm:text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-2 sm:p-4 space-y-2 sm:space-y-4 min-h-[150px] sm:min-h-[200px] max-h-[150px] sm:max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-xl p-2 sm:p-3 shadow-sm
                          ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                        `}
                      >
                        <p className="text-xs sm:text-sm">{message.content}</p>
                        <p
                          className={`
                            text-[9px] sm:text-[10px] mt-1 sm:mt-1.5
                            ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-2 sm:p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-1 sm:gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-xs sm:text-sm h-8 sm:h-10"
                      placeholder="Type a message..."
                      value="Sic Mundus Creatus Est"
                      readOnly
                    />
                    <button className="btn btn-primary h-8 sm:h-10 min-h-0 px-2 sm:px-4">
                      <Send size={14} className="sm:hidden" />
                      <Send size={18} className="hidden sm:block" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
