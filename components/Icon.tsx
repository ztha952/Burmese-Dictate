
import React from 'react';

interface IconProps {
  name: 'microphone' | 'stop-circle' | 'clipboard' | 'trash' | 'sparkles' | 'summarize';
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'microphone':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      );
    case 'stop-circle':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9 8.25a.75.75 0 00-.75.75v6c0 .414.336.75.75.75h6a.75.75 0 00.75-.75v-6a.75.75 0 00-.75-.75H9z" clipRule="evenodd" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5a2 2 0 012-2h4a2 2 0 012 2M8 5v2h8V5m-4 8h.01M12 16h.01" />
        </svg>
      );
    case 'trash':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 15l.813-.904L10.5 13.5l.904.813L12 15l-.813.904L10.5 16.5l-.904-.813zM5.469 8.404L4.5 7.5l.969-.904L6 6l.904.969L7.5 7.5l-.969.904L6 9l-.904-.969zM15 9l-.813-.904L13.5 7.5l.904-.813L15 6l.813.904L16.5 7.5l-.904.813L15 9zm-5.25 10.5a.75.75 0 01-.75-.75V16.5a.75.75 0 011.5 0v2.25a.75.75 0 01-.75.75zM3.75 12a.75.75 0 01-.75-.75V9a.75.75 0 011.5 0v2.25A.75.75 0 013.75 12zM12 3.75a.75.75 0 01-.75-.75V.75a.75.75 0 011.5 0v2.25A.75.75 0 0112 3.75zM16.5 16.5a.75.75 0 01-.75-.75V13.5a.75.75 0 011.5 0v2.25a.75.75 0 01-.75.75zM20.25 12a.75.75 0 01-.75-.75V9a.75.75 0 011.5 0v2.25a.75.75 0 01-.75.75zM7.5 16.5a.75.75 0 01-.75-.75V13.5a.75.75 0 011.5 0v2.25a.75.75 0 01-.75.75z" />
        </svg>
      );
    case 'summarize':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
        </svg>
      );
    default:
      return null;
  }
};
