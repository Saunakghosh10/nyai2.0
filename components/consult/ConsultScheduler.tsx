"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { VideoCameraIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ExpertiseArea } from '@/types/consult';

interface ConsultSchedulerProps {
  expertiseAreas: ExpertiseArea[];
  onSchedule: (data: {
    expertiseId: string;
    date: string;
    time: string;
  }) => Promise<void>;
}

export default function ConsultScheduler({ expertiseAreas, onSchedule }: ConsultSchedulerProps) {
  const [selectedExpertise, setSelectedExpertise] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpertise || !selectedDate || !selectedTime || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSchedule({
        expertiseId: selectedExpertise,
        date: selectedDate,
        time: selectedTime,
      });
    } catch (error) {
      console.error('Scheduling error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="bg-accent-midnight/50 rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-text-light mb-6">Schedule a Consultation</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-light mb-2">
            <VideoCameraIcon className="inline-block h-5 w-5 mr-1" />
            Select Area of Expertise
          </label>
          <select
            value={selectedExpertise}
            onChange={(e) => setSelectedExpertise(e.target.value)}
            className="w-full p-3 rounded-lg bg-accent-midnight border border-accent-violet/20 text-text-light focus:border-primary-violet focus:ring-1 focus:ring-primary-violet"
            required
          >
            <option value="">Select an area</option>
            {expertiseAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              <CalendarIcon className="inline-block h-5 w-5 mr-1" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 rounded-lg bg-accent-midnight border border-accent-violet/20 text-text-light focus:border-primary-violet focus:ring-1 focus:ring-primary-violet"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              <ClockIcon className="inline-block h-5 w-5 mr-1" />
              Select Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 rounded-lg bg-accent-midnight border border-accent-violet/20 text-text-light focus:border-primary-violet focus:ring-1 focus:ring-primary-violet"
              required
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 rounded-lg bg-primary-violet text-white hover:bg-accent-violet transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule Consultation'}
        </motion.button>
      </form>
    </motion.div>
  );
} 