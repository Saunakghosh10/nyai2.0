"use client";

import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: "/declutter", label: "Declutter" },
    { href: "/draft", label: "Draft" },
    { href: "/consult", label: "Consult" },
  ];

  if (!mounted || !isLoaded) {
    return (
      <nav className="bg-primary-black border-b border-accent-violet/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-text-light">NYAI</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-primary-black border-b border-accent-violet/20 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/" className="text-xl font-bold text-text-light">
              NY<span className="text-primary-violet">AI</span>
            </Link>
          </motion.div>
          
          <div className="flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  href={item.href} 
                  className="text-text-light hover:text-primary-violet transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            {isSignedIn ? (
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  baseTheme: "dark",
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary-violet text-white px-4 py-2 rounded-md hover:bg-accent-violet transition-colors"
                >
                  Sign In
                </motion.button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
} 