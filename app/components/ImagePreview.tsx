import Image from "next/image";

export default function imagePreview({
  imagePreview,
}: {
  imagePreview: string | null;
}) {
  if (!imagePreview) return null;
  return (
    <div className="mt-4">
      <p className="text-gray-700 mb-2">Your Image:</p>
      <div className="relative w-full h-64">
        <Image
          src={imagePreview}
          alt="Dropped preview"
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="rounded-lg shadow-md mb-4"
        />
      </div>
    </div>
  );
}
