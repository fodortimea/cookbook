export default function Steps({ steps }: { steps: string[] }) {
  return (
    <div className="bg-orange-50 p-6 h-full">
      <h2 className="text-2xl font-semibold mb-4 text-orange-800 text-center">Steps</h2>
      <ol className="list-decimal pl-5 space-y-2 text-gray-700">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
