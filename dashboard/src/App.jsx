import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [currentSpeaking, setCurrentSpeaking] = useState(null);
  const synthRef = useRef(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/api/collections/claims/records`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClaims(data.items);
      } catch (e) {
        console.error('Error fetching claims:', e);
        setError('Failed to load claims. Please ensure PocketBase is running and accessible.');
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      synthRef.current = synth;

      const voices = synth.getVoices();
      if (!voices.length) {
        synth.onvoiceschanged = () => {
          const updatedVoices = synth.getVoices();
          console.log("🔊 Voices loaded:", updatedVoices);
        };
      } else {
        console.log("✅ Voices available:", voices);
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const stopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setAudioLoading(false);
      setCurrentSpeaking(null);
    }
  };

  const handlePlayAudio = (textToSpeak, claimId) => {
    if (!textToSpeak || typeof textToSpeak !== 'string' || textToSpeak.trim() === '') {
      setError('Invalid or empty text for speech.');
      return;
    }

    if ('speechSynthesis' in window) {
      if (currentSpeaking === claimId) {
        stopSpeech();
        return;
      }

      stopSpeech();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      utterance.onstart = () => {
        setAudioLoading(false); // Reset here just in case
        setCurrentSpeaking(claimId);
      };

      utterance.onend = () => {
        setAudioLoading(false);
        setCurrentSpeaking(null);
      };

      utterance.onerror = (event) => {
  console.error('SpeechSynthesisUtterance.onerror', event);

  // Suppress false error if it already started speaking
  if (!wasManuallyStopped && !utterance.text.startsWith("Claim:")) {
    setError('Failed to play audio using Web Speech API.');
  }

  setWasManuallyStopped(false);
  setAudioLoading(false);
  setCurrentSpeaking(null);
};

      setAudioLoading(true);
      synthRef.current.speak(utterance);
    } else {
      setError('Web Speech API is not supported in this browser.');
    }
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      stopSpeech();
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-900 text-white p-8"
      onClick={handleBackgroundClick}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center text-teal-400 mb-8"
      >
        WebTruth Dashboard
      </motion.h1>

      {loading && <p className="text-center text-gray-400">Loading claims...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {claims.map((claim) => (
          <motion.div
            key={claim.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gray-800 rounded-lg shadow-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {currentSpeaking === claim.id && (
              <div className="absolute top-2 right-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Speaking...</span>
                </div>
              </div>
            )}

            <h2 className="text-xl font-semibold text-blue-400 mb-2">
              Claim: {claim.claimText}
            </h2>
            <p className="text-lg mb-2">
              Verdict: <span className={{
                true: 'text-green-500',
                false: 'text-red-500',
                uncertain: 'text-yellow-500'
              }[claim.verdict?.toLowerCase()] || 'text-gray-400'}>
                {claim.verdict}
              </span>
            </p>
            <p className="text-sm text-gray-300 mb-4">Explanation: {claim.explanation}</p>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  if (currentSpeaking === claim.id) {
                    stopSpeech();
                  } else {
                    handlePlayAudio(
                      `Claim: ${claim.claimText}. Verdict: ${claim.verdict}. Explanation: ${claim.explanation}`,
                      claim.id
                    );
                  }
                }}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  currentSpeaking === claim.id
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {audioLoading && currentSpeaking === claim.id
                  ? "Loading..."
                  : currentSpeaking === claim.id
                  ? "Stop Audio"
                  : "Play Audio"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {audioLoading && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            <span>Audio playing... Click anywhere outside cards to stop</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
