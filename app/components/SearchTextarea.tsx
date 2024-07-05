interface SearchTextareaProps {
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onDrop: (e: React.DragEvent<HTMLTextAreaElement>) => void;
    value: string;
  }
export default function SearchTextarea({onChange, onDrop, value}:SearchTextareaProps){
    return (
        <textarea
          value={value}
          onChange={onChange}
          onDrop={onDrop}
          placeholder="What would you like to make today?"
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          rows={4}
        />
    );
}