"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  VideoCameraIcon,
  MicrophoneIcon,
  PhoneXMarkIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import { WebRTCService } from '@/utils/webRTC';
import { useWebSocket } from '@/hooks/useWebSocket';
import { FiMessageSquare, FiX } from 'react-icons/fi';

interface VideoCallProps {
  sessionId: string;
  roomId: string;
  onEnd: () => void;
}

export default function VideoCall({ sessionId, roomId, onEnd }: VideoCallProps) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [webRTC, setWebRTC] = useState<WebRTCService | null>(null);
  const [remoteUserId, setRemoteUserId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'ice-candidate':
        webRTC?.handleIceCandidate(message.data);
        break;
      case 'offer':
        webRTC?.handleOffer(message.data);
        break;
      case 'answer':
        webRTC?.handleAnswer(message.data);
        break;
      case 'leave':
        handleUserLeft();
        break;
    }
  }, [webRTC]);

  const { sendMessage } = useWebSocket(sessionId, handleWebSocketMessage);

  useEffect(() => {
    const initializeWebRTC = async () => {
      const service = new WebRTCService(
        (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        },
        (candidate) => sendMessage('ice-candidate', remoteUserId!, candidate),
        async () => {
          const offer = await service.createOffer();
          sendMessage('offer', remoteUserId!, offer);
        }
      );

      try {
        const localStream = await service.initializeLocalStream();
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
        setWebRTC(service);
      } catch (error) {
        console.error('WebRTC initialization error:', error);
      }
    };

    initializeWebRTC();

    return () => {
      if (webRTC) {
        webRTC.cleanup();
      }
    };
  }, [roomId, sendMessage, remoteUserId]);

  const toggleAudio = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
      } else {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: isAudioEnabled,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = userStream;
        }
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error('Screen sharing error:', error);
    }
  };

  const handleEndCall = async () => {
    try {
      await fetch(`/api/consult/video/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      onEnd();
    } catch (error) {
      console.error('End call error:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = localVideoRef.current?.srcObject as MediaStream;
      if (!stream) return;

      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        await saveRecording(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveRecording = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('recording', blob);
      formData.append('sessionId', sessionId);

      await fetch('/api/consult/video/recording', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Save recording error:', error);
    }
  };

  return (
    <div className="relative h-screen bg-accent-midnight">
      <div className={`grid ${isChatOpen ? 'grid-cols-3' : 'grid-cols-2'} gap-4 h-full p-4`}>
        <motion.div
          className="relative rounded-lg overflow-hidden bg-accent-violet/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded">
            You
          </div>
        </motion.div>

        <motion.div
          className="relative rounded-lg overflow-hidden bg-accent-violet/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded">
            Expert
          </div>
        </motion.div>

        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-accent-violet/10 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-text-light font-medium">Chat</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-text-light hover:text-white"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <ConsultInterface sessionId={sessionId} />
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <motion.button
          onClick={toggleAudio}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-4 rounded-full ${
            isAudioEnabled ? 'bg-primary-violet' : 'bg-red-500'
          }`}
        >
          <MicrophoneIcon className="h-6 w-6 text-white" />
        </motion.button>

        <motion.button
          onClick={toggleVideo}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-4 rounded-full ${
            isVideoEnabled ? 'bg-primary-violet' : 'bg-red-500'
          }`}
        >
          <VideoCameraIcon className="h-6 w-6 text-white" />
        </motion.button>

        <motion.button
          onClick={toggleScreenShare}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-4 rounded-full ${
            isScreenSharing ? 'bg-primary-violet' : 'bg-accent-violet'
          }`}
        >
          <ComputerDesktopIcon className="h-6 w-6 text-white" />
        </motion.button>

        <motion.button
          onClick={handleEndCall}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-4 rounded-full bg-red-500"
        >
          <PhoneXMarkIcon className="h-6 w-6 text-white" />
        </motion.button>

        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-4 rounded-full ${
            isChatOpen ? 'bg-primary-violet' : 'bg-accent-violet'
          }`}
        >
          <FiMessageSquare className="h-6 w-6 text-white" />
        </motion.button>

        <motion.button
          onClick={isRecording ? stopRecording : startRecording}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-4 rounded-full ${
            isRecording ? 'bg-red-500' : 'bg-accent-violet'
          }`}
        >
          <div className={`h-6 w-6 rounded-full ${
            isRecording ? 'animate-pulse bg-red-500' : 'bg-red-500'
          }`} />
        </motion.button>
      </div>
    </div>
  );
} 