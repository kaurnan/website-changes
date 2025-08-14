import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./organisms/Navbar";
import Footer from "./organisms/Footer";
import { AuthModal } from "./molecules/AuthModal";
import { VerificationModal } from "./molecules/VerificationModal";
import { SuccessModal } from "./molecules/SuccessModal";
import { useAuth } from "./molecules/AuthContext";

const Layout = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { isVerifying, isSuccessModalOpen } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log("Layout: isVerifying changed to", isVerifying);
  }, [isVerifying]);

  useEffect(() => {
    console.log("Layout: isSuccessModalOpen changed to", isSuccessModalOpen);
  }, [isSuccessModalOpen]);

  const handleOpenAuthModal = () => {
    console.log("Layout: Opening auth modal");
    setIsAuthModalOpen(true);
  };
  
  const handleCloseAuthModal = () => {
    console.log("Layout: Closing auth modal");
    setIsAuthModalOpen(false);
  };
  
  const handleVerificationSuccess = () => {
    console.log("Layout: Verification success, opening login modal");
    // This function is called when verification is successful
    // The success modal will handle the login flow
  };

  const handleCloseVerification = () => {
    console.log("Layout: Verification modal close requested");
    // When verification modal is closed without completing, reset auth modal state
    setIsAuthModalOpen(false);
  };

  const handleSuccessModalLogin = () => {
    console.log("Layout: Success modal login clicked, opening login modal");
    // Close success modal first, then open login modal
    setIsAuthModalOpen(true);
  };

  const handleCloseSuccessModal = () => {
    console.log("Layout: Success modal close requested");
    // The success modal state will be handled by the AuthContext
  };

  const navBtn =
    "px-5 py-2 border border-green-500 text-green-600 rounded-md font-semibold text-base bg-transparent hover:bg-green-50 hover:text-green-700 hover:scale-105 active:scale-100 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2";

  return (
    <div className="min-h-screen w-full font-sans bg-white">
      {/* Quantinfinium text above navbar */}
      <div className="w-full text-center pt-3 pb-2">
        <span className="text-xl text-gray-500 font-semibold">
          Quantinfinium
        </span>
      </div>
      {/* First separator line - below Quantinfinium text */}
      <div className="w-full border-b border-gray-200"></div>
      <Navbar
        onSignUpClick={handleOpenAuthModal}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        navBtn={navBtn}
      />
      {/* Second separator line - below entire navbar */}
      <div className="w-full border-b border-gray-200"></div>
      <main>
        <Outlet />
      </main>
      <Footer />
      <AuthModal isOpen={isAuthModalOpen && !isVerifying && !isSuccessModalOpen} onClose={handleCloseAuthModal} />
      <VerificationModal 
        isOpen={isVerifying} 
        onClose={handleCloseVerification} 
        onSuccess={handleVerificationSuccess}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        onLogin={handleSuccessModalLogin}
      />
    </div>
  );
};

export default Layout; 