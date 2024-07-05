export default function Title({ name }: { name: string }) {
  return (
      <h1 className="text-4xl font-bold mb-4 text-orange-50 text-center">
        {name}
      </h1>
  );
}
