
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { Icon } from './components/Icon';

// Initialize the Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const App: React.FC = () => {
  const {
    transcript,
    interimTranscript,
    isListening,
    startListening,
    stopListening,
    resetTranscript, // Use the new reset function
    error: recognitionError,
    isSupported,
  } = useSpeechRecognition({ lang: 'my-MM' });
  
  const [showCopied, setShowCopied] = useState(false);
  const [fullText, setFullText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    // When a new dictation session starts and produces a transcript, update the main text.
    if (transcript) {
        setFullText(transcript);
    }
  }, [transcript]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      // Starting to listen implies a new session, so we clear previous text.
      setFullText('');
      startListening();
    }
  };
  
  const handleCopy = useCallback(() => {
    const textToCopy = fullText;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  }, [fullText]);
  
  const handleClear = useCallback(() => {
    stopListening();
    resetTranscript();
    setFullText('');
  }, [stopListening, resetTranscript]);

  const callGemini = async (systemInstruction: string) => {
    if (!fullText || isProcessing) return;
    setIsProcessing(true);
    setApiError(null);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: fullText,
        config: { systemInstruction }
      });
      setFullText(response.text.trim());
    } catch (e) {
      console.error(e);
      setApiError("An error occurred. Please check the console and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFixGrammar = () => {
    callGemini("You are an expert in Burmese grammar. Correct any grammatical errors, spelling mistakes, and punctuation in the following text. Only return the corrected Burmese text, without any additional comments, explanations, or introductory phrases.");
  };

  const handleSummarize = () => {
    callGemini("You are a helpful assistant that provides concise summaries of Burmese text. Summarize the following text in Burmese. Only return the summary, without any additional comments, explanations, or introductory phrases.");
  };

  const currentText = fullText + (interimTranscript ? ` ${interimTranscript}` : '');
  const hasText = currentText.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4">
      {showCopied && (
        <div className="fixed top-5 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg transition-transform transform animate-bounce z-20">
          Text Copied!
        </div>
      )}
      <header className="w-full max-w-4xl text-center mb-6 mt-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">
          Burmese Voice Dictate
        </h1>
        <p className="text-gray-400 mt-2">မြန်မာဘာသာဖြင့် အသံဖြင့်စာရိုက်ရန်</p>
      </header>

      <main className="w-full max-w-4xl flex-grow flex flex-col bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="p-6 flex-grow relative h-full min-h-[30vh] sm:min-h-[40vh]">
          <textarea
            value={currentText}
            readOnly
            placeholder="Press the microphone button and start speaking..."
            className="w-full h-full bg-transparent text-gray-200 text-lg resize-none focus:outline-none placeholder-gray-500 absolute inset-0 p-6"
          />
           {!isSupported && (
             <div className="absolute inset-0 bg-gray-800 bg-opacity-90 flex items-center justify-center p-4 z-10">
                <p className="text-center text-red-400 text-xl">
                    Your browser does not support Speech Recognition. Please try Google Chrome.
                </p>
             </div>
           )}
        </div>
        
        {apiError && (
          <div className="text-center text-red-400 text-sm pb-2 px-4">
            Error: {apiError}
          </div>
        )}
        {recognitionError && (
             <div className="text-center text-red-400 text-sm pb-2 px-4">
                Recognition Error: {recognitionError}
             </div>
        )}

        <div className="bg-gray-800/50 border-t border-gray-700 p-4 flex flex-col items-center justify-center gap-5">
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <button onClick={handleCopy} disabled={!hasText || isProcessing} title="Copy Text" className="p-3 bg-gray-700 rounded-full hover:bg-cyan-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon name="clipboard" className="w-6 h-6" />
            </button>
            <button onClick={handleFixGrammar} disabled={!hasText || isProcessing} title="Fix Grammar" className="p-3 bg-gray-700 rounded-full hover:bg-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon name="sparkles" className="w-6 h-6" />
            </button>
            <button onClick={handleSummarize} disabled={!hasText || isProcessing} title="Summarize" className="p-3 bg-gray-700 rounded-full hover:bg-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon name="summarize" className="w-6 h-6" />
            </button>
            <button onClick={handleClear} disabled={!hasText || isProcessing} title="Clear Text" className="p-3 bg-gray-700 rounded-full hover:bg-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon name="trash" className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={handleToggleListening}
            disabled={!isSupported || isProcessing}
            className={`p-5 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center ${
              isListening
                ? 'bg-red-500 animate-pulse'
                : 'bg-cyan-500 hover:bg-cyan-400'
            }`}
            style={{ width: '72px', height: '72px' }}
          >
            {isProcessing ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
                <Icon name={isListening ? 'stop-circle' : 'microphone'} className="w-8 h-8" />
            )}
          </button>
        </div>
      </main>

      <footer className="w-full max-w-4xl text-center mt-6 mb-4 text-gray-500 text-sm">
        <p>For best results, use a modern browser like Google Chrome.</p>
      </footer>
    </div>
  );
};

export default App;
