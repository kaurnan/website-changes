import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X, Clock, Check } from "lucide-react";
import { useAuth } from "./AuthContext";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const VerificationModal = ({ isOpen, onClose, onSuccess }: VerificationModalProps) => {
  const { user, verificationCode, verifyAccount, resendVerificationCode, closeVerification, openSuccessModal } = useAuth();
  const [inputCode, setInputCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      console.log("VerificationModal: isOpen changed to true");
      setInputCode(verificationCode);
      setError("");
      setIsVerifying(false);
      console.log("VerificationModal: Setting up modal with code:", verificationCode);
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
  }, [isOpen, verificationCode]);

  const handleVerify = () => {
    console.log("VerificationModal: Verifying code:", inputCode);
    setIsVerifying(true);
    setError("");
    
    // Simulate verification delay
    setTimeout(() => {
      if (verifyAccount(inputCode)) {
        console.log("VerificationModal: Verification successful, opening success modal");
        setIsVerifying(false);
        // Don't call closeVerification() here - let the success modal handle the flow
        openSuccessModal(); // Open success modal
      } else {
        console.log("VerificationModal: Verification failed");
        setError("Invalid verification code. Please try again.");
        setIsVerifying(false);
      }
    }, 2000);
  };

  const handleResend = () => {
    console.log("VerificationModal: Resending code");
    resendVerificationCode();
    setError("");
  };

  const handleClose = () => {
    console.log("VerificationModal: Close requested");
    if (!isVerifying) {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    console.log("VerificationModal: Closing modal");
    closeVerification();
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isVerifying) {
      handleVerify();
    }
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
        onClick={handleClose}
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
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          disabled={isVerifying}
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center px-8 py-6">
          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Verification
          </h2>
          
          {/* Instructions */}
          <p className="text-white text-center mb-6">
            Input verification code sent to your email.
          </p>
          
          {/* Resend link */}
          <button
            onClick={handleResend}
            className="text-white underline text-sm mb-6 hover:text-gray-300 transition-colors"
            disabled={isVerifying}
          >
            Resend
          </button>
          
          {/* Verification code input */}
          <div className="w-full mb-6">
            <Input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-white border-0 text-black text-lg font-bold rounded-md px-4 py-3 text-center"
              placeholder="Enter verification code"
              disabled={isVerifying}
            />
          </div>
          
          {/* Error message */}
          {error && (
            <div className="text-red-300 text-sm text-center mb-4">
              {error}
            </div>
          )}
          
          {/* Verifying status */}
          {isVerifying && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3">
                <Clock className="h-8 w-8 text-[#0d3a24] animate-spin" />
              </div>
              <p className="text-white underline text-center">
                Verifying your account...
              </p>
            </div>
          )}
          
          {/* Verify button */}
          {!isVerifying && (
            <button
              onClick={handleVerify}
              className="w-full py-3 bg-black text-[#19d94b] font-bold text-lg rounded-full hover:bg-gray-900 transition"
            >
              Verify Account
            </button>
          )}
          
          {/* Terms and conditions */}
          <p className="text-xs text-white/80 text-center mt-auto">
            By signing up, I confirm I have read and agreed to all terms & conditions set by Quantinfinium Holdings OÜ.
          </p>
        </div>
      </div>
    </div>
  );
}; 