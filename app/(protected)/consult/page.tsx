"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { VideoCameraIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

const expertiseAreas = [
  { id: 'real-estate', name: 'Real Estate Law' },
  { id: 'corporate', name: 'Corporate Law' },
  { id: 'family', name: 'Family Law' },
  { id: 'intellectual', name: 'Intellectual Property' },
  { id: 'tax', name: 'Tax Law' },
  { id: 'other', name: 'Other Areas' },
];

export default function ConsultPage() {
  const [selectedArea, setSelectedArea] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-black to-accent-midnight py-12">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl font-bold text-text-light mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Expert Consultation
          </motion.h1>
          <motion.p
            className="text-text-purple text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Connect with top legal experts via video call
          </motion.p>
        </div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-accent-midnight/50 backdrop-blur-sm rounded-lg border border-accent-violet/20 p-8">
            <div className="flex items-center justify-center mb-8">
              <VideoCameraIcon className="h-12 w-12 text-primary-violet" />
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Select Area of Expertise
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {expertiseAreas.map((area) => (
                    <motion.button
                      key={area.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedArea(area.id)}
                      className={`p-4 rounded-lg border ${
                        selectedArea === area.id
                          ? 'border-primary-violet bg-primary-violet/10'
                          : 'border-accent-violet/20 hover:border-accent-violet/50'
                      } text-left transition-colors`}
                    >
                      <h3 className="text-text-light font-medium">
                        {area.name}
                      </h3>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text-light mb-2">
                    <CalendarIcon className="inline-block h-5 w-5 mr-1" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 rounded-lg bg-accent-midnight border border-accent-violet/20 text-text-light focus:border-primary-violet focus:ring-1 focus:ring-primary-violet"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text-light mb-2">
                    <ClockIcon className="inline-block h-5 w-5 mr-1" />
                    Select Time
                  </label>
                  <input
                    type="time"
                    className="w-full p-3 rounded-lg bg-accent-midnight border border-accent-violet/20 text-text-light focus:border-primary-violet focus:ring-1 focus:ring-primary-violet"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 rounded-lg bg-primary-violet text-white hover:bg-accent-violet transition-colors"
              >
                Schedule Consultation
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 