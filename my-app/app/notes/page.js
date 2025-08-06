//page.js
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Note from "./note";
import NoteForm from "./noteForm";
import { FiPlus, FiMenu, FiX } from "react-icons/fi";
import { ColorPicker } from "@wellbees/color-picker-input";
import { addNoteToDB, deleteNoteFromDB, updateNoteInDB, getUserNotes } from "../../lib/firebaseNotes";

export default function NotesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [logOut, setLogOut] = useState(false);
  const [notes, setNotes] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [tempColor, setTempColor] = useState("#ffffff");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/signIn");
      } else {
        setCurrentUser(user);
        const userNotes = await getUserNotes(user.uid);
        setNotes(userNotes);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/signIn");
  };

  const handleAddNote = async (noteData) => {
    try {
      const savedNote = await addNoteToDB(noteData, currentUser.uid);
      setNotes((prevNotes) => {
        const updated = [...prevNotes, savedNote];
        return sortAsc
          ? updated.sort((a, b) => a.header.localeCompare(b.header))
          : updated.sort((a, b) => b.header.localeCompare(a.header));
      });
      setOpen(false);
    } catch (err) {
      console.error("Error saving to Firestore:", err);
    }
  };

  const handleDeleteNote = async (noteId, index) => {
    try {
      await deleteNoteFromDB(noteId);
      setNotes((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const toggleSort = () => {
    const sorted = [...notes].sort((a, b) =>
      sortAsc ? b.header.localeCompare(a.header) : a.header.localeCompare(b.header)
    );
    setNotes(sorted);
    setSortAsc(!sortAsc);
  };

  const searchNote = () => {
    return notes.filter((note) => note.header.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const openColorPicker = (index) => {
    if (notes[index]) {
      setSelectedNoteIndex(index);
      setTempColor(notes[index].color || "#ffffff");
      setColorPickerOpen(true);
    }
  };

  const confirmColorChange = async () => {
    if (selectedNoteIndex !== null) {
      const updated = [...notes];
      updated[selectedNoteIndex].color = tempColor;
      setNotes(updated);
      setColorPickerOpen(false);

      const noteId = updated[selectedNoteIndex].id;
      if (noteId) {
        try {
          await updateNoteInDB(noteId, { color: tempColor });
        } catch (err) {
          console.error("Failed to update color:", err);
        }
      }

      setTempColor("#ffffff");
      setSelectedNoteIndex(null);
    }
  };

  const toggleTodoDone = async (noteIndex, todoIndex) => {
    const updatedNotes = [...notes];
    updatedNotes[noteIndex].todos[todoIndex].done = !updatedNotes[noteIndex].todos[todoIndex].done;
    setNotes(updatedNotes);

    const noteId = updatedNotes[noteIndex].id;
    if (noteId) {
      try {
        await updateNoteInDB(noteId, { todos: updatedNotes[noteIndex].todos });
      } catch (err) {
        console.error("Failed to update todo:", err);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen min-w-screen">
      <header className="flex justify-between items-center border-b border-slate-200 shadow-sm px-4 py-4 bg-white">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-800">NoteNest</h1>
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-gray-700">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        <div className="hidden sm:flex gap-10 items-center">
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
          <input
            type="search"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring focus:ring-slate-400"
          />
        </div>
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
          <input
            type="search"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>
      )}

      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {searchNote().length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No notes found.</p>
        ) : (
          searchNote().map((n, i) => (
            <Note
              key={i}
              header={n.header}
              message={n.message}
              color={n.color}
              todos={n.todos}
              createdAt={n.createdAt}
              onDelete={() => handleDeleteNote(n.id, i)}
              onColorChange={() => openColorPicker(i)}
              onToggleTodo={(todoIdx) => toggleTodoDone(i, todoIdx)}
            />
          ))
        )}
        {open && <NoteForm onClose={() => setOpen(false)} onSave={handleAddNote} />}
      </main>

      {colorPickerOpen && selectedNoteIndex !== null && (
        <div
          onClick={() => setColorPickerOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-500/30 via-blue-400/30 to-cyan-300/30 backdrop-blur-sm animate-fade-in px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-xs rounded-xl p-5 shadow-xl animate-scale-in"
          >
            <h3 className="text-lg font-bold mb-3 text-center text-gray-800">Edit Note Color</h3>
            <div className="flex justify-center mb-4">
              <ColorPicker
                inputType="mui"
                value={tempColor}
                onChange={(newColor) => setTempColor(newColor)}
                size="small"
                colorShowType="circle"
                className="shadow-md"
                label="Pick a color"
              />
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setColorPickerOpen(false)}
                className="w-1/2 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmColorChange}
                className="w-1/2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
