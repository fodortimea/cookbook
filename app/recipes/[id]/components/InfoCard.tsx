export function InfoCard({
  source,
  altSource,
  title,
  value,
}: {
  source: string;
  altSource: string;
  title: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex flex-col items-center bg-white p-4 shadow-lg w-32 h-32">
      <img src={source} alt={altSource} className="w-12 h-12 mb-2" />
      <div className="text-orange-300">{title}</div>
      <div className="text-gray-600">{value}</div>
    </div>
  );
}
