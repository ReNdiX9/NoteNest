"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { auth } from "../../../lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?!.*\s).{8,16}$/;

const formSchema = Yup.object().shape({
  username: Yup.string().required("Username is required").min(2, "Too short"),
  email: Yup.string().required("Email is required").email("Invalid email"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "At least 8 characters")
    .matches(passwordRegex, "Does not follow rules"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

export default function SignUp() {
  //state for password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [showChecklist, setShowChecklist] = useState(false);
  const hasLower = /[a-z]/.test(passwordValue);
  const hasUpper = /[A-Z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(passwordValue);
  const validLength = passwordValue.length >= 8 && passwordValue.length <= 16;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(formSchema),
    mode: "onBlur",
  });
  const router = useRouter();

  const onSubmit = async (data) => {
    console.log("Register data:", data);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      console.log(" User created:", userCredential.user);
      // Set the display name
      await updateProfile(auth.currentUser, {
        displayName: data.username,
      });
      toast.success("Account created!");
      setTimeout(() => {
        reset();
        setPasswordValue("");
        setShowChecklist(false);
        router.push("/notes");
      }, 1000);
    } catch (error) {
      console.error(" Firebase Error:", error.message);
      toast.error(error.message);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      toast.success(`Welcome ${user.displayName || "back"}!`);
      setTimeout(() => {
        router.push("/notes");
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 ">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md rounded-2xl p-6 shadow-xl/30 border-1 border-slate-400">
        <h1 className="text-2xl font-bold mb-6 text-center">Create your NoteNest account</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 shadow-lg ">
          <div className="relative">
            <input
              type="text"
              placeholder="Username..."
              {...register("username")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-transparent   transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400  focus:shadow"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1 absolute -bottom-6.5 left-0">{errors.username.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              type="email"
              placeholder="Email..."
              {...register("email")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-transparent   transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400  focus:shadow"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 absolute -bottom-6.5 left-0">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password..."
              {...register("password")}
              onChange={(e) => {
                const value = e.target.value;
                setPasswordValue(value);

                if (value.length > 0) setShowChecklist(true);
                else setShowChecklist(false);

                const lower = /[a-z]/.test(value);
                const upper = /[A-Z]/.test(value);
                const num = /\d/.test(value);
                const special = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);
                const lengthValid = value.length >= 8 && value.length <= 16;

                if (lower && upper && num && special && lengthValid) {
                  setShowChecklist(false);
                }
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-transparent   transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400  focus:shadow"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 absolute -bottom-6.5 left-0">{errors.password.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password..."
              {...register("confirmPassword")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-transparent   transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400  focus:shadow"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 absolute -bottom-6.5 left-0">{errors.confirmPassword.message}</p>
            )}
          </div>
          {showChecklist && (
            <div className="text-sm space-y-1">
              <p className={`transition-colors duration-300 ${hasLower ? "text-green-500" : "text-red-500"}`}>
                • One lowercase letter
              </p>
              <p className={`transition-colors duration-300 ${hasUpper ? "text-green-500" : "text-red-500"}`}>
                • One uppercase letter
              </p>
              <p className={`transition-colors duration-300 ${hasNumber ? "text-green-500" : "text-red-500"}`}>
                • One number
              </p>
              <p className={`transition-colors duration-300 ${hasSpecial ? "text-green-500" : "text-red-500"}`}>
                • One special character
              </p>
              <p className={`transition-colors duration-300 ${validLength ? "text-green-500" : "text-red-500"}`}>
                • 8-16 characters
              </p>
            </div>
          )}

          <button
            type="submit"
            className="
                rounded-lg p-2
              transition-all duration-300 ease-in-out hover:scale-105
              bg-black font-bold cursor-pointer text-white
            "
          >
            Sign Up
          </button>
        </form>
        {/* 🔹 Continue with Google */}
        <div className="mt-4">
          <button
            onClick={handleGoogleAuth}
            className="w-full p-2 border border-slate-300 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105  hover:border-slate-500 hover:shadow"
          >
            <FcGoogle className="w-6 h-6" />
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link href="/auth/signIn" className="text-[#2ebf91] hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
