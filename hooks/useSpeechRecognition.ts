
import { useState, useEffect, useRef, useCallback } from 'react';

// TypeScript definitions for the Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

interface UseSpeechRecognitionOptions {
  lang: string;
}

export const useSpeechRecognition = ({ lang }: UseSpeechRecognitionOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }
    
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionAPI();
    const recognition = recognitionRef.current;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let currentInterim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev ? `${prev} ${finalTranscript.trim()}` : finalTranscript.trim());
      }
      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Don't report 'no-speech' as an error to the user.
      if (event.error !== 'no-speech') {
        setError(event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };
    
    return () => {
        if(recognitionRef.current){
            recognitionRef.current.stop();
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, isSupported]);
  
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript(''); // Reset transcript on new start
        setInterimTranscript('');
        setError(null);
        recognitionRef.current.start();
        setIsListening(true);
      } catch(e) {
        // This can happen if start() is called while it's already starting
        console.error("Could not start recognition", e);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);


  return { isSupported, transcript, interimTranscript, isListening, error, startListening, stopListening, resetTranscript };
};
