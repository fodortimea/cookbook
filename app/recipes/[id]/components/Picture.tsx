import Image from "next/image";

export default function Picture({
  source,
  altSource,
}: {
  source: string;
  altSource: string;
}) {
  return (
    <div className="relative h-96 overflow-hidden">
       <Image
        src={source}
        alt={altSource}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
        style={{ objectFit: 'cover', objectPosition: 'top' }}
        className="rounded-lg shadow"
      />
    </div>
  );
}