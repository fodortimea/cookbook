
export default function Picture({
  source,
  altSource,
}: {
  source: string;
  altSource: string;
}) {
  return (
    <div className="relative h-96 overflow-hidden">
      <picture>
      <img
        src={source}
        alt={altSource}
        className="w-full h-full object-cover object-top"
      />
      </picture>
    </div>
  );
}