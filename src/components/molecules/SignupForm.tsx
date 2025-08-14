import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  pin: z.string().length(4, { message: "Pin must be exactly 4 digits" }).regex(/^\d{4}$/, { message: "Pin must be 4 digits" }),
  confirmPin: z.string(),
}).refine((data) => data.pin === data.confirmPin, {
  message: "Pins do not match",
  path: ["confirmPin"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    console.log("SignupForm: Submitting signup data:", data.email);
    setError("");
    const success = signup({ email: data.email, password: data.password, pin: data.pin });
    console.log("SignupForm: Signup result:", success);
    if (success) {
      console.log("SignupForm: Signup successful, closing modal");
      // Close the modal - verification will be handled by the VerificationModal
      if (onSuccess) {
        onSuccess();
      }
    } else {
      console.log("SignupForm: Signup failed");
      setError("Signup failed. Try again.");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-8 text-center" style={{fontFamily: 'inherit'}}>Your investing journey awaits you!</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-white text-base font-semibold">Email*</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="bg-white border-0 text-black text-base rounded-md px-3 py-2 mt-1"
            autoComplete="email"
          />
          {errors.email && <div className="text-red-300 text-sm mt-1">{errors.email.message}</div>}
        </div>
        <div>
          <Label htmlFor="password" className="text-white text-base font-semibold">Password*</Label>
          <div className="text-xs text-white/60 mb-1">8 characters minimum</div>
          <Input
            id="password"
            type="password"
            {...register("password")}
            className="bg-white border-0 text-black text-base rounded-md px-3 py-2 mt-1"
            autoComplete="new-password"
          />
          {errors.password && <div className="text-red-300 text-sm mt-1">{errors.password.message}</div>}
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="pin" className="text-white text-base font-semibold">Pin*</Label>
            <div className="text-xs text-white/60 mb-1">4 digits</div>
            <Input
              id="pin"
              type="password"
              maxLength={4}
              {...register("pin")}
              className="bg-white border-0 text-black text-base rounded-md px-3 py-2 mt-1"
              autoComplete="off"
            />
            {errors.pin && <div className="text-red-300 text-sm mt-1">{errors.pin.message}</div>}
          </div>
          <div className="flex-1">
            <Label htmlFor="confirmPin" className="text-white text-base font-semibold">Confirm Pin*</Label>
            <div className="text-xs text-white/60 mb-1">must match</div>
            <Input
              id="confirmPin"
              type="password"
              maxLength={4}
              {...register("confirmPin")}
              className="bg-white border-0 text-black text-base rounded-md px-3 py-2 mt-1"
              autoComplete="off"
            />
            {errors.confirmPin && <div className="text-red-300 text-sm mt-1">{errors.confirmPin.message}</div>}
          </div>
        </div>
        {error && <div className="text-red-300 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 bg-black text-[#19d94b] font-bold text-lg rounded-full hover:bg-gray-900 transition mt-6"
          style={{fontFamily: 'inherit', boxShadow: 'none'}}>
          Sign up now
        </button>
        <p className="text-xs text-white/80 text-center mt-2">
          By signing up, I confirm I have read and agreed to all terms & conditions set by Quantinfinium Holdings OÜ.
        </p>
      </form>
    </>
  );
};

export default SignupForm; 