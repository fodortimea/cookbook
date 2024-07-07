export default function Tag({ tag }: { tag: string }) {
    return ( 
    <span className="inline-block bg-orange-200 text-gray-800 text-sm px-2 py-1 rounded-full">
    {tag}
  </span>);
};