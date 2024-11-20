"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { supportedLanguages } from "@/utils/languageUtils";

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
  currentLanguage: string;
}

export default function LanguageSelector({ onLanguageChange, currentLanguage }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-accent-midnight border border-accent-violet/20 text-text-light"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>{supportedLanguages.find(lang => lang.code === currentLanguage)?.name || 'Select Language'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-10 mt-2 w-48 rounded-lg bg-accent-midnight border border-accent-violet/20 shadow-lg"
        >
          {supportedLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                onLanguageChange(language.code);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentLanguage === language.code
                  ? 'bg-primary-violet/10 text-primary-violet'
                  : 'text-text-light hover:bg-accent-violet/10'
              }`}
            >
              {language.name}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
} 