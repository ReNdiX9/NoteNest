"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Note from "./note";
import NoteForm from "./noteForm";
import { FiPlus, FiMenu, FiX } from "react-icons/fi";
import { format } from "date-fns";

export default function NotesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [logOut, setLogOut] = useState(false);
  const [notes, setNotes] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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
    const createdAt = format(new Date(), "yyyy-MM-dd");
    const newNote = { ...noteData, createdAt };
    setNotes((prevNotes) => {
      const updated = [...prevNotes, newNote];
      return sortAsc
        ? updated.sort((a, b) => a.header.localeCompare(b.header))
        : updated.sort((a, b) => b.header.localeCompare(a.header));
    });
    setOpen(false);
  };

  const toggleSort = () => {
    const sorted = [...notes].sort((a, b) =>
      sortAsc ? b.header.localeCompare(a.header) : a.header.localeCompare(b.header)
    );
    setNotes(sorted);
    setSortAsc(!sortAsc);
  };

  return (
    <div className="min-h-screen min-w-screen">
      <header className="flex justify-between items-center border-b border-slate-200 shadow-sm px-4 py-4 bg-white">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-800">NoteNest</h1>

        {/* Mobile menu toggle */}
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-gray-700">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex gap-8 items-center">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow hover:shadow-md transition cursor-pointer"
          >
            <FiPlus className="text-lg" />
            <span className="whitespace-nowrap">Create Note</span>
          </button>
          <button
            onClick={toggleSort}
            className="px-4 py-2 rounded-lg border border-blue-400 text-blue-500 font-semibold hover:bg-blue-50 transition shadow-sm cursor-pointer"
          >
            Sort {sortAsc ? "Z → A" : "A → Z"}
          </button>
        </div>

        {/* Username + logout */}
        <div className="relative hidden sm:block">
          <p
            id="username"
            onClick={() => setLogOut(!logOut)}
            className="font-medium text-gray-700 hover:underline cursor-pointer transition"
          >
            {currentUser.displayName || currentUser.email}
          </p>

          {logOut && (
            <button
              onClick={handleLogout}
              className="absolute right-0 mt-2 bg-red-500 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition z-50"
            >
              Log Out
            </button>
          )}
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="flex flex-col sm:hidden px-4 py-2 gap-2 border-b bg-white shadow">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow hover:shadow-md transition"
          >
            <FiPlus className="text-lg" />
            <span>Create Note</span>
          </button>
          <button
            onClick={toggleSort}
            className="px-4 py-2 rounded-lg border border-blue-400 text-blue-500 font-semibold hover:bg-blue-50 transition shadow-sm"
          >
            Sort {sortAsc ? "Z → A" : "A → Z"}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>
      )}

      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {notes.map((n, i) => (
          <Note key={i} header={n.header} message={n.message} color={n.color} createdAt={n.createdAt} />
        ))}
        {open && <NoteForm onClose={() => setOpen(false)} onSave={handleAddNote} />}
      </main>
    </div>
  );
}
