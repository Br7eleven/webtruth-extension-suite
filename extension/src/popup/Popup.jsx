import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Popup = () => {
  const [claim, setClaim] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

  useEffect(() => {
    chrome.storage.session.get(["lastClickedClaim", "lastClickedContext"], (result) => {
      if (result.lastClickedClaim) {
        setClaim(result.lastClickedClaim);
        fetchFactCheck(result.lastClickedClaim);
      }
    });
  }, []);

  const fetchFactCheck = async (claimText) => {
    setLoading(true);
    setError(null);
    setVerdict(null);
    setExplanation(null);

    try {
      const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"; // TODO: Get API key from user/settings
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a fact-checking assistant. Provide a verdict (True, False, or Uncertain) and a one-sentence explanation.",
            },
            {
              role: "user",
              content: `Verdict whether this statement is True, False, or Uncertain, and give a one-sentence explanation: '${claimText}'.`,
            },
          ],
          max_tokens: 100,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      const verdictMatch = aiResponse.match(/(True|False|Uncertain)/i);
      const explanationMatch = aiResponse.match(/Explanation: (.+)/i);

      setVerdict(verdictMatch ? verdictMatch[0] : "Uncertain");
      setExplanation(explanationMatch ? explanationMatch[1] : aiResponse);

    } catch (e) {
      console.error("Error fetching fact check:", e);
      setError("Failed to fetch fact check. Please check your API key and network connection.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async () => {
    if (!verdict || !explanation) return;

    setAudioLoading(true);
    try {
      const MANUS_TTS_ENDPOINT = "https://api.manus.ai/v1/tts";
      const textToSpeak = `${verdict} — ${explanation}`;
      const voiceType = "professional-english-male"; // TODO: Allow user to select voice

      const response = await fetch(MANUS_TTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToSpeak,
          voice: voiceType,
          speed: 1.0,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();

    } catch (e) {
      console.error("Error playing audio:", e);
      setError("Failed to play audio.");
    } finally {
      setAudioLoading(false);
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case "true":
        return "bg-green-500";
      case "false":
        return "bg-red-500";
      case "uncertain":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="w-80 h-96 bg-gray-800 text-white p-4 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-teal-400">WebTruth</h1>
        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold">85%</span>
        </div>
      </div>
      
      {claim ? (
        <div className="flex-grow flex flex-col">
          <h2 className="text-lg font-bold mb-2">Claim: {claim}</h2>
          {loading && <p>Fact-checking...</p>}
          {error && <p className="text-red-400">Error: {error}</p>}
          {verdict && (
            <div className="mt-2">
              <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getVerdictColor(verdict)}`}>
                {verdict === "True" ? "✅ True" : verdict === "False" ? "❌ False" : "⚠️ Uncertain"}
              </span>
              {explanation && <p className="mt-2 text-sm">{explanation}</p>}
              <button
                onClick={handlePlayAudio}
                disabled={audioLoading}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg text-sm"
              >
                {audioLoading ? "Playing..." : "Play"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center text-center text-gray-400">
          <p>Click on a highlighted claim on the webpage to fact-check it.</p>
        </div>
      )}

      <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors mt-4">
        Open Dashboard
      </button>
      
      <div className="text-xs text-gray-400 text-center mt-2">
        Click on highlighted claims to fact-check
      </div>
    </motion.div>
  );
};

export default Popup;

