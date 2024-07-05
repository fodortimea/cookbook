export default function imagePreview({
  imagePreview,
}: {
  imagePreview: string | null;
}) {
  if (!imagePreview) return null;
  return (
    <div className="mt-4">
      <p className="text-gray-700 mb-2">Your Image:</p>
      <img
        src={imagePreview}
        alt="Dropped preview"
        className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
      />
    </div>
  );
}
