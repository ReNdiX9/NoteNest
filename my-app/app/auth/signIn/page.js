"use client";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../../../lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Toaster, toast } from "react-hot-toast";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    if (!email) return setEmailError("Email is required");
    if (!password) return setPasswordError("Password is required");

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in successfully!");
      setTimeout(() => {
        setEmail("");
        setPassword("");
        router.push("/notes");
      }, 1000);
    } catch (error) {
      // toast.error(error.message);
      if (error.code === "auth/invalid-email") setEmailError("Invalid email format");
      else if (error.code === "auth/invalid-credential") setEmailError("User not found");
      else if (error.code === "auth/wrong-password") setPasswordError("Incorrect password");
      else setPasswordError("Failed to sign in");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      toast.success("Signed in with Google!");
      setTimeout(() => {
        router.push("/notes");
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 ">
      <Toaster position="top-center" />
      <div className="w-full max-w-md rounded-2xl p-6 shadow-xl/30 border-1 border-slate-400">
        <h1 className="text-2xl font-bold mb-6 text-center ">Sign in to your NoteNest account </h1>
        <form className="flex flex-col gap-8 shadow-lg " onSubmit={handleSignIn}>
          {/*email*/}
          <div className="relative">
            <input
              type="text"
              placeholder="Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-transparent   transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400  focus:shadow"
            />
            {emailError && <p className="text-red-500 text-sm mt-1 absolute -bottom-6.5 left-0">{emailError}</p>}
            {/*password*/}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
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
            {passwordError && <p className="text-red-500 text-sm mt-1 absolute -bottom-6.5 left-0">{passwordError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
                rounded-lg p-2
              transition-all duration-300 ease-in-out hover:scale-105
              bg-sky-500  font-bold cursor-pointer text-white   
              ${loading ? "bg-sky-300 cursor-not-allowed" : "bg-sky-500 hover:scale-105 cursor-pointer"}
            `}
          >
            Sign In
          </button>
        </form>
        {/* 🔹 Continue with Google */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full p-2 border border-slate-300 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105  hover:border-slate-500 hover:shadow"
          >
            <FcGoogle className="w-6 h-6" />
            Continue with Google
          </button>
        </div>
        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link href="/auth/signUp" className="text-[#2ebf91] hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
