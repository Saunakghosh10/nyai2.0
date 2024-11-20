"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface AnalyticsData {
  totalSessions: number;
  totalDuration: number;
  averageRating: number;
  completedSessions: number;
  upcomingSessions: number;
  recentFeedback: Feedback[];
  popularTopics: { topic: string; count: number }[];
}

interface Feedback {
  id: string;
  sessionId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export default function ConsultAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/consult/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Fetch analytics error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-primary-violet border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent-midnight/50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-light/70">Total Sessions</p>
              <h3 className="text-2xl font-bold text-text-light">
                {analytics.totalSessions}
              </h3>
            </div>
            <ChartBarIcon className="h-8 w-8 text-primary-violet" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-accent-midnight/50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-light/70">Total Duration</p>
              <h3 className="text-2xl font-bold text-text-light">
                {Math.round(analytics.totalDuration / 60)} hrs
              </h3>
            </div>
            <ClockIcon className="h-8 w-8 text-primary-violet" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-accent-midnight/50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-light/70">Average Rating</p>
              <h3 className="text-2xl font-bold text-text-light">
                {analytics.averageRating.toFixed(1)}/5
              </h3>
            </div>
            <UserGroupIcon className="h-8 w-8 text-primary-violet" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-accent-midnight/50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-light/70">Upcoming Sessions</p>
              <h3 className="text-2xl font-bold text-text-light">
                {analytics.upcomingSessions}
              </h3>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-primary-violet" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-accent-midnight/50 rounded-lg p-6"
        >
          <h3 className="text-xl font-bold text-text-light mb-4">Popular Topics</h3>
          <div className="space-y-4">
            {analytics.popularTopics.map((topic) => (
              <div
                key={topic.topic}
                className="flex items-center justify-between"
              >
                <span className="text-text-light">{topic.topic}</span>
                <span className="text-text-light/70">{topic.count} sessions</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-accent-midnight/50 rounded-lg p-6"
        >
          <h3 className="text-xl font-bold text-text-light mb-4">Recent Feedback</h3>
          <div className="space-y-4">
            {analytics.recentFeedback.map((feedback) => (
              <div key={feedback.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-primary-violet">★</span>
                    <span className="text-text-light ml-1">{feedback.rating}/5</span>
                  </div>
                  <span className="text-text-light/70 text-sm">
                    {format(new Date(feedback.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-text-light/70 text-sm">{feedback.comment}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 