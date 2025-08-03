export default function NoteForm({ onClose, onSave }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const header = e.target.header.value;
    const message = e.target.message.value;
    onSave({ header, message });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-bold mb-2">Create a Note</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input type="text" name="header" placeholder="Heading" className="border p-2 rounded" required />
          <textarea name="message" placeholder="Main text" className="border p-2 rounded" required />
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
