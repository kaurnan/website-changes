import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useAuth } from "./AuthContext";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const SuccessModal = ({ isOpen, onClose, onLogin }: SuccessModalProps) => {
  const { handleSuccessLogin } = useAuth();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (isOpen) {
      setCountdown(10);
      console.log("SuccessModal: Success modal opened, starting 10-second countdown");
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      console.log("SuccessModal: Countdown at", countdown, "seconds");
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isOpen && countdown === 0) {
      console.log("SuccessModal: Countdown finished, redirecting to login");
      handleSuccessLogin();
      onLogin();
    }
  }, [isOpen, countdown, onLogin, handleSuccessLogin]);

  const handleLoginClick = () => {
    console.log("SuccessModal: Login link clicked");
    handleSuccessLogin();
    onLogin();
  };

  // If not open, don't render anything
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div
        className="relative z-50 p-0 border-0 shadow-2xl"
        style={{
          background: '#0d3a24',
          boxShadow: '0 8px 48px 0 rgba(0,0,0,0.45)',
          borderRadius: '16px',
          maxWidth: '500px',
          width: '100%',
          minHeight: '500px',
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-6">
          {/* Success message */}
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Verification
          </h2>
          
          <div className="w-full border-b border-white/20 mb-6"></div>
          
          <p className="text-white text-center text-lg mb-6">
            Yay! your account is now verified. Please proceed to login with your credentials.
          </p>
          
          {/* Success icon */}
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
            <Check className="h-8 w-8 text-[#0d3a24]" />
          </div>
          
          {/* Countdown text with login link */}
          <p className="text-white text-center text-sm">
            Auto-redirecting in {countdown} seconds, or <button onClick={handleLoginClick} className="underline hover:text-green-300 transition-colors">click here to login</button>
          </p>
          
          {/* Terms and conditions */}
          <p className="text-xs text-white/80 text-center mt-auto">
            By signing up, I confirm I have read and agreed to all terms & conditions set by Quantinfinium Holdings OÜ.
          </p>
        </div>
      </div>
    </div>
  );
}; 