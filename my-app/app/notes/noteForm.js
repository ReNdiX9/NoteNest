import { ColorPicker } from "@wellbees/color-picker-input";
import { useState } from "react";
export default function NoteForm({ onClose, onSave }) {
  const [colorValue, setColorValue] = useState("#ffffff");
  const handleSubmit = (e) => {
    e.preventDefault();
    const header = e.target.header.value;
    const message = e.target.message.value;
    const color = colorValue;
    onSave({ header, message, color });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex justify-center items-center z-50 bg-gradient-to-br from-purple-500/30 via-blue-400/30 to-cyan-300/30 backdrop-blur-sm animate-fade-in"
    >
      <div
        style={{ backgroundColor: colorValue }}
        onClick={(e) => e.stopPropagation()}
        className=" p-4 rounded-xl shadow-2xl w-80 animate-scale-in"
      >
        <h2 className="text-lg font-bold mb-2 text-center text-gray-800">Create a Note</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="header"
            placeholder="Heading..."
            className="border-b p-1 border-slate-300 outline-none hover:border-slate-400 focus:border-slate-500 transition"
          />
          <textarea name="message" placeholder="Main text..." className=" p-1 rounded resize-none outline-none " />
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
