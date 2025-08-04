export default function Note({ header, message, color, createdAt }) {
  return (
    <div
      style={{ backgroundColor: color }}
      className="rounded-xl shadow-lg p-4 min-h-[12rem] flex flex-col justify-between transition-transform hover:scale-[1.02]"
    >
      <div>
        <h2 className="font-bold text-lg mb-2 break-words text-center">{header}</h2>
        <p className="text-sm break-words">{message}</p>
      </div>
      {createdAt && <p className="text-xs text-right text-gray-600 mt-4 italic">{createdAt}</p>}
    </div>
  );
}
