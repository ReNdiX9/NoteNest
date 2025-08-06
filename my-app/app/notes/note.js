// Note.jsx
import { FiTrash2, FiEdit2, FiCheckCircle, FiCircle } from "react-icons/fi";

export default function Note({ header, message, color, createdAt, todos = [], onDelete, onColorChange, onToggleTodo }) {
  return (
    <div
      style={{ backgroundColor: color }}
      className="group relative border border-slate-300 rounded-xl shadow-lg p-4 min-h-[12rem] flex flex-col justify-between transition-transform hover:scale-[1.02] hover:border-slate-400"
    >
      <div className="absolute bottom-2 left-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ">
        <button
          title="Delete"
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition cursor-pointer border-slate-300 border"
        >
          <FiTrash2 size={16} />
        </button>
        <button
          title="Change Color"
          onClick={onColorChange}
          className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full shadow-md transition cursor-pointer border border-slate-300"
        >
          <FiEdit2 size={16} />
        </button>
      </div>

      <div>
        <h2 className="font-bold text-lg mb-2 break-words text-center">{header}</h2>
        <p className="text-sm break-words">{message}</p>

        {todos.length > 0 && (
          <ul className="mt-3 space-y-1">
            {todos.map((todo, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer"
                onClick={() => onToggleTodo?.(idx)} // ✅ this toggles the checkbox on click
              >
                {todo.done ? <FiCheckCircle className="text-green-600" /> : <FiCircle className="text-gray-400" />}
                <span className={todo.done ? "line-through text-gray-500" : ""}>{todo.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {createdAt && (
        <p className="text-xs text-right text-gray-600 mt-4 italic">
          {typeof createdAt === "string" ? createdAt : new Date(createdAt.seconds * 1000).toLocaleString()}
        </p>
      )}
    </div>
  );
}
