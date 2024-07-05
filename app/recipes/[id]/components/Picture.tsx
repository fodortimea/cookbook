export default function Picture({ source, altSource }: { source: string , altSource: string}) {
    return (
        <div>
        <img
          src={source}
          alt={altSource}
          className="w-full h-auto object-cover rounded-lg shadow"
        />
      </div>
    );
  }