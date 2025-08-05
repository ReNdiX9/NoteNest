// NoteForm.jsx
"use client";

import { useState } from "react";
import { ColorPicker } from "@wellbees/color-picker-input";
import { IoIosCloseCircle } from "react-icons/io";

export default function NoteForm({ onClose, onSave }) {
  const [colorValue, setColorValue] = useState("#ffffff");
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    if (todoInput.trim()) {
      setTodos((prev) => [...prev, { text: todoInput.trim(), done: false }]);
      setTodoInput("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const header = e.target.header.value;
    const message = e.target.message.value;
    onSave({ header, message, color: colorValue, todos });
  };

  const handleTodoToggle = (index) => {
    const updated = [...todos];
    updated[index].done = !updated[index].done;
    setTodos(updated);
  };

  const removeTodo = (index) => {
    const updated = [...todos];
    updated.splice(index, 1);
    setTodos(updated);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex justify-center items-center z-50 bg-gradient-to-br from-purple-500/30 via-blue-400/30 to-cyan-300/30 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: colorValue }}
        className="p-4 rounded-xl shadow-2xl w-80 animate-scale-in"
      >
        <h2 className="text-lg font-bold mb-2 text-center text-gray-800">Create a Note</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="header"
            placeholder="Heading..."
            className="border-b p-1 border-slate-300 outline-none hover:border-slate-400 focus:border-slate-500 transition"
          />
          <textarea name="message" placeholder="Main text..." className="p-1 rounded resize-none outline-none" />

          {/* To-do input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add to-do..."
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                className="border-b border-slate-300 p-1 flex-grow outline-none hover:border-slate-400 transition-all"
              />
              <button
                type="button"
                onClick={addTodo}
                className="bg-green-500 text-white px-3 rounded hover:bg-green-600 cursor-pointer transition-all"
              >
                +
              </button>
            </div>
            <ul className="max-h-24 overflow-y-auto space-y-1">
              {todos.map((todo, idx) => (
                <li key={idx} className="flex items-center justify-between bg-white px-2 py-1 rounded shadow-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={todo.done} onChange={() => handleTodoToggle(idx)} />
                    <span className={todo.done ? "line-through text-gray-400" : ""}>{todo.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTodo(idx)}
                    className="text-red-500 font-bold cursor-pointer hover:text-red-600"
                  >
                    <IoIosCloseCircle />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Color picker */}
          <div className="flex justify-center">
            <ColorPicker
              value={colorValue}
              inputType="mui"
              onChange={(color) => setColorValue(color)}
              size="small"
              colorShowType="circle"
              className="shadow-md"
              label="Pick a color of your note"
            />
          </div>

          <div className="flex justify-center gap-8 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
