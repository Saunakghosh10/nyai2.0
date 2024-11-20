"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  VideoCameraIcon, 
  ClockIcon, 
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

interface Session {
  id: string;
  topic: string;
  status: 'scheduled' | 'active' | 'completed';
  startTime: Date;
  endTime?: Date;
  recording?: string;
  summary?: string;
}

export default function SessionManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/consult/sessions');
      const data = await response.json();
      setSessions(data.sessions);
    } catch (error) {
      console.error('Fetch sessions error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayRecording = (session: Session) => {
    setSelectedSession(session);
    setIsPlaying(true);
  };

  const handleDownloadRecording = async (session: Session) => {
    try {
      const response = await fetch(`/api/consult/video/recording/${session.id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consultation-${session.id}.webm`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download recording error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-light">Consultation Sessions</h2>
        <button
          onClick={fetchSessions}
          className="p-2 rounded-lg bg-accent-violet/20 text-text-light hover:bg-accent-violet/30"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary-violet border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent-midnight/50 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-text-light">{session.topic}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-text-light/70">
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {format(new Date(session.startTime), 'PPp')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      session.status === 'completed' 
                        ? 'bg-green-500/20 text-green-500'
                        : session.status === 'active'
                        ? 'bg-blue-500/20 text-blue-500'
                        : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                </div>

                {session.recording && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePlayRecording(session)}
                      className="p-2 rounded-lg bg-primary-violet text-white"
                    >
                      {isPlaying && selectedSession?.id === session.id ? (
                        <PauseIcon className="h-5 w-5" />
                      ) : (
                        <PlayIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDownloadRecording(session)}
                      className="p-2 rounded-lg bg-accent-violet/20 text-text-light hover:bg-accent-violet/30"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              {selectedSession?.id === session.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4"
                >
                  <video
                    src={session.recording}
                    controls
                    className="w-full rounded-lg"
                    autoPlay={isPlaying}
                  />
                  {session.summary && (
                    <p className="mt-4 text-sm text-text-light/70">{session.summary}</p>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 