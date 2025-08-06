//firebaseNotes.js
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export async function addNoteToDB(noteData, userId) {
  const newNote = {
    ...noteData,
    userId,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "notes"), newNote);
  return { id: docRef.id, ...noteData, createdAt: new Date().toISOString(), userId };
}

export async function deleteNoteFromDB(noteId) {
  await deleteDoc(doc(db, "notes", noteId));
}

export async function updateNoteInDB(noteId, updatedData) {
  const noteRef = doc(db, "notes", noteId);
  await updateDoc(noteRef, updatedData);
}

// export async function getNotesFromDB() {
//   const querySnapshot = await getDocs(collection(db, "notes"));
//   return querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// }
export async function getUserNotes(userId) {
  const q = query(collection(db, "notes"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
