import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  email: string;
  password: string;
  pin: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isVerifying: boolean;
  isSuccessModalOpen: boolean;
  verificationCode: string;
  login: (email: string, passwordOrPin: string) => boolean;
  logout: () => void;
  signup: (user: User) => boolean;
  startVerification: (email: string) => void;
  verifyAccount: (code: string) => boolean;
  resendVerificationCode: () => void;
  closeVerification: () => void;
  openSuccessModal: () => void;
  closeSuccessModal: () => void;
  handleSuccessLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Remove automatic restoration of auth state from localStorage
  // Users should explicitly log in each time

  const login = (email: string, passwordOrPin: string) => {
    const storedUser = localStorage.getItem("demoUser");
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      if (
        parsedUser.email === email &&
        (parsedUser.password === passwordOrPin || parsedUser.pin === passwordOrPin)
      ) {
        // Only allow login if account is verified
        if (parsedUser.isVerified) {
          setUser(parsedUser);
          setIsAuthenticated(true);
          localStorage.setItem("demoAuth", "true");
          return true;
        } else {
          // If not verified, start verification process
          startVerification(email);
          return false;
        }
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsVerifying(false);
    setIsSuccessModalOpen(false);
    setVerificationCode("");
    localStorage.setItem("demoAuth", "false");
    // Also clear the stored user data for security
    localStorage.removeItem("demoUser");
  };

  const signup = (newUser: User) => {
    // For demo, only one user allowed
    const userWithVerification = { ...newUser, isVerified: false };
    localStorage.setItem("demoUser", JSON.stringify(userWithVerification));
    setUser(userWithVerification);
    // Start verification process after signup
    console.log("Signup successful, starting verification for:", newUser.email);
    startVerification(newUser.email);
    return true;
  };

  const startVerification = (email: string) => {
    console.log("Starting verification process for:", email);
    setIsVerifying(true);
    setIsSuccessModalOpen(false);
    // Generate a demo verification code
    const demoCode = Math.random().toString(36).substring(2, 8).toUpperCase() + "-" + 
                    Math.random().toString(36).substring(2, 6).toUpperCase();
    setVerificationCode(demoCode);
    console.log("Verification code sent to", email, ":", demoCode);
    console.log("isVerifying state set to:", true);
  };

  const verifyAccount = (code: string) => {
    if (code === verificationCode && user) {
      const verifiedUser = { ...user, isVerified: true };
      setUser(verifiedUser);
      // Don't close the verification modal immediately - let the success screen show
      // setIsVerifying(false); // Commented out - let the modal handle this
      setVerificationCode("");
      localStorage.setItem("demoUser", JSON.stringify(verifiedUser));
      console.log("AuthContext: Account verified successfully, keeping modal open for success screen");
      return true;
    }
    return false;
  };

  const resendVerificationCode = () => {
    if (user?.email) {
      startVerification(user.email);
    }
  };

  const closeVerification = () => {
    setIsVerifying(false);
    setVerificationCode("");
    console.log("AuthContext: Verification modal closed");
  };

  const openSuccessModal = () => {
    setIsSuccessModalOpen(true);
    setIsVerifying(false);
    console.log("AuthContext: Success modal opened");
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    console.log("AuthContext: Success modal closed");
  };

  const handleSuccessLogin = () => {
    console.log("AuthContext: Success login triggered, closing success modal and opening login");
    setIsSuccessModalOpen(false);
    // The login modal will be opened by the Layout component
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isVerifying, 
      isSuccessModalOpen,
      verificationCode,
      login, 
      logout, 
      signup, 
      startVerification, 
      verifyAccount, 
      resendVerificationCode,
      closeVerification,
      openSuccessModal,
      closeSuccessModal,
      handleSuccessLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}; 