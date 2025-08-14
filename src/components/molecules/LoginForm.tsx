import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  passwordOrPin: z.string().min(4, { message: "Enter your password or 4-digit pin" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setError("");
    const success = login(data.email, data.passwordOrPin);
    if (success) {
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/");
      }
    } else {
      setError("Invalid credentials or account not verified. Please check your email for verification code.");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-8 text-center" style={{fontFamily: 'inherit'}}>Welcome back, sign in to your investing journey!</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="loginEmail" className="text-white text-base font-semibold">Email*</Label>
          <Input
            id="loginEmail"
            type="email"
            {...register("email")}
            className="bg-white border-0 text-black text-base rounded-md px-3 py-2 mt-1"
            autoComplete="email"
          />
          {errors.email && <div className="text-red-300 text-sm mt-1">{errors.email.message}</div>}
        </div>
        <div>
          <div className="flex items-center gap-4 mb-1">
            <Label className="text-white text-base font-semibold">Pin*</Label>
            <span className="text-white text-base font-semibold">or</span>
            <Label className="text-white text-base font-semibold">Password*</Label>
          </div>
          <Input
            type="password"
            {...register("passwordOrPin")}
            className="bg-white border-0 text-black text-base rounded-md px-3 py-2 mt-1"
            autoComplete="current-password"
          />
          {errors.passwordOrPin && <div className="text-red-300 text-sm mt-1">{errors.passwordOrPin.message}</div>}
          <div className="text-right mt-1">
            <a href="#" className="text-xs text-green-200 hover:underline">Forgot password?</a>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-qi-green"
          />
          <Label htmlFor="remember" className="text-white text-base font-semibold">
            Remember me on this device
          </Label>
        </div>
        
        {error && <div className="text-red-300 text-sm text-center">{error}</div>}
        
        <button
          type="submit"
          className="w-full py-3 bg-black text-[#19d94b] font-bold text-lg rounded-full hover:bg-gray-900 transition mt-6"
          style={{fontFamily: 'inherit', boxShadow: 'none'}}>
          Login now
        </button>
        <p className="text-xs text-white/80 text-center mt-2">
          By signing up, I confirm I have read and agreed to all terms & conditions set by Quantinfinium Holdings OÜ.
        </p>
      </form>
    </>
  );
};

export default LoginForm; 