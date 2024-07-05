import { FormEvent } from "react";
import ImagePreview from "./ImagePreview";
import SearchTextarea from "./SearchTextarea";

interface SearchFormProps {
  searchInput: string;
  imagePreview: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImageDrop: (e: React.DragEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function SearchForm({
  searchInput,
  imagePreview,
  onInputChange,
  onImageDrop,
  onSubmit,
}: SearchFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <ImagePreview imagePreview={imagePreview} />
      <SearchTextarea
        value={searchInput}
        onChange={onInputChange}
        onDrop={onImageDrop}
      />
      <button
        type="submit"
        className="mt-4 w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition">
        Find Recipes
      </button>
    </form>
  );
}
