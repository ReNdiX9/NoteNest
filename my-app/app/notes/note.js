export default function Note({ header, message }) {
  return (
    <div className="size-28 border rounded-lg p-4 sm:size-32 md:size-48 lg:size-56">
      <header>{header}</header>
      <p>{message}</p>
    </div>
  );
}
