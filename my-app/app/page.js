"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useGLTF } from "@react-three/drei";
import { ReactTyped } from "react-typed";

function NotebookModel() {
  const ref = useRef();
  const { scene } = useGLTF("/models/notebook.glb");

  useEffect(() => {
    gsap.to(ref.current.rotation, {
      y: Math.PI * 2,
      duration: 8,
      repeat: -1,
      ease: "linear",
    });
  }, []);

  return <primitive ref={ref} object={scene} scale={1.5} rotation={[-6, 3, 8]}></primitive>;
}

function TypingText() {
  return (
    <ReactTyped
      strings={["Create, edit and explore!", "Your notes, your way!"]}
      typeSpeed={60}
      backSpeed={40}
      backDelay={1500}
      loop
      className=" text-lg text-center  font-mono text-gray-400 italic"
    />
  );
}

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white p-10">
      <h1 className="font-bold text-4xl mb-3">Welcome to NoteNest</h1>
      <TypingText />
      <div className="w-80 h-80 ">
        <Canvas camera={{ position: [0, 0, 1.5] }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[9, 0, 0]} />
          <NotebookModel />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center space-x-8">
        <button
          className="bg-gradient-to-r from-[#2ebf91] to-[#4286f4] text-white 
                   rounded-lg font-semibold px-6 py-2.5 shadow-md cursor-pointer 
                   hover:brightness-110 hover:shadow-lg hover:shadow-[#2ebf91]/40 
                   hover:from-[#4286f4] hover:to-[#2ebf91]
                   transition-all duration-300 ease-in-out hover:scale-105"
        >
          <Link href="/auth/signIn">Sign In</Link>
        </button>

        <button
          className="bg-gradient-to-r from-pink-400 to-purple-400 text-white 
                   rounded-lg font-semibold px-6 py-2.5 shadow-md cursor-pointer 
                   hover:brightness-110 hover:shadow-lg hover:shadow-purple-400/40
                   hover:from-pink-500 hover:to-purple-500 
                   transition duration-300 ease-in-out hover:scale-105"
        >
          <Link href="/auth/signUp">Sign Up</Link>
        </button>
      </div>
    </div>
  );
}
