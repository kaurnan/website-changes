import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignupForm } from "./SignupForm";
import { LoginForm } from "./LoginForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Modal background color based on tab
  const modalBg = activeTab === "signup" ? "#21943c" : "#0d3a24";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-0 border-0 shadow-2xl flex flex-col justify-between"
        style={{
          background: modalBg,
          boxShadow: '0 8px 48px 0 rgba(0,0,0,0.45)',
          borderRadius: '16px',
          maxWidth: '500px',
          width: '100%',
          minHeight: '620px', // increased from 580px
          height: '620px',    // increased from 580px
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <DialogDescription className="sr-only">
          Please sign up for a new account or log in to your existing account to continue.
        </DialogDescription>
        {/* Remove custom close button, use Dialog's built-in close */}
        <div className="flex-1 flex flex-col h-full px-10 pt-8 pb-0 w-full">
          {/* Tabs */}
          <div className="flex w-full mb-8 relative border-b border-white/40">
            <button
              onClick={() => setActiveTab("signup")}
              className={cn(
                "flex-1 pb-2 text-center font-bold text-lg transition-colors relative",
                activeTab === "signup"
                  ? "text-white"
                  : "text-white/70"
              )}
              style={{ fontFamily: 'inherit', zIndex: 1 }}
            >
              Sign up
              {activeTab === "signup" && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-[-2px] w-1/2 h-1 bg-white rounded-full" style={{zIndex: 2}}></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("login")}
              className={cn(
                "flex-1 pb-2 text-center font-bold text-lg transition-colors relative",
                activeTab === "login"
                  ? "text-white"
                  : "text-white/70"
              )}
              style={{ fontFamily: 'inherit', zIndex: 1 }}
            >
              Login
              {activeTab === "login" && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-[-2px] w-1/2 h-1 bg-white rounded-full" style={{zIndex: 2}}></span>
              )}
            </button>
          </div>
          {/* Content always inside the box */}
          <div className="flex flex-col flex-1 h-full">
            {activeTab === "signup" ? (
              <SignupForm onSuccess={() => setActiveTab("login")} />
            ) : (
              <LoginForm onSuccess={onClose} />
            )}
          </div>
        </div>
        {/* Modal footer removed: button and terms now only in form components */}
      </DialogContent>
    </Dialog>
  );
};