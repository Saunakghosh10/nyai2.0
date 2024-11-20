"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary-black to-accent-midnight">
      <motion.div
        className="max-w-md w-full mx-auto p-8 rounded-lg bg-accent-midnight/50 backdrop-blur-sm border border-accent-violet/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-2xl font-bold text-text-light mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Something went wrong!
        </motion.h2>
        <motion.p
          className="text-text-purple mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {error.message || "An unexpected error occurred."}
        </motion.p>
        <div className="flex space-x-4">
          <motion.button
            onClick={reset}
            className="px-4 py-2 bg-primary-violet text-white rounded-md hover:bg-accent-violet transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
          <motion.button
            onClick={() => router.push("/")}
            className="px-4 py-2 border border-accent-violet text-text-light rounded-md hover:bg-accent-violet/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
} 