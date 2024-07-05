"use client";

import { useState, DragEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import SearchForm from "./components/SearchForm";
import SearchTitle from "./components/SearchTitle";
import { useRecipeContext } from "./context/RecipeContext";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { setFormData } = useRecipeContext();
  const router = useRouter();

  const handleImageDrop = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const message =searchInput.replace(/\r?\n|\r/g, ' ').trim().toLowerCase()
    formData.append("message", message);
      if (image) {
        formData.append("image", image);
      }
      setFormData(formData);
      router.push('/recipes');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(/background.jpg)" }}>
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
        <SearchTitle/>
        <SearchForm
          searchInput={searchInput}
          imagePreview={imagePreview}
          onInputChange={(e) => setSearchInput(e.target.value)}
          onImageDrop={handleImageDrop}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
