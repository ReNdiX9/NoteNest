"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Note from "./note";
import NoteForm from "./noteForm";

export default function NotesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth/signIn");
      } else {
        setCurrentUser(user);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/signIn");
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const handleAddNote = (noteData) => {
    setNotes([...notes, noteData]);
    setOpen(false);
  };

  return (
    <div className="min-h-screen min-w-screen ">
      <header className="flex justify-between items-center border-b border-slate-300 shadow-md  min-h-[4rem] relative px-10">
        <h1 className="text-2xl font-bold">NoteNest</h1>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className=" w-24 sm:w-auto px-1 py-1  sm:px-4 sm:py-3 font-medium  text-sm sm:text-base
             rounded-lg bg-blue-400 text-white sm:font-semibold cursor-pointer
             hover:scale-105 shadow-md shadow-blue-500/50 transition-all duration-200"
        >
          Create Note
        </button>

        <div className="relative">
          <p id="username" className="font-medium cursor-pointer select-none" onClick={() => setOpen(!open)}>
            {currentUser.displayName || currentUser.email}
          </p>

          {open && (
            <button
              onClick={handleLogout}
              className=" absolute right-3 mt-1 bg-gradient-to-r from-red-500 to-red-600 
               text-white font-medium px-4 py-2 rounded-lg shadow-lg
               hover:from-red-600 hover:to-red-700 hover:shadow-xl
               active:scale-95 transition-all duration-200 z-50 cursor-pointer"
            >
              Log Out
            </button>
          )}
        </div>
      </header>
      <main className="p-4">
        {notes.map((n, i) => (
          <Note key={i} header={n.header} message={n.message} />
        ))}
        {open && <NoteForm onClose={() => setOpen(false)} onSave={handleAddNote} />}
      </main>
    </div>
  );
}
