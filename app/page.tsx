
"use client";
import { useState } from "react";

export default function Page() {
  const [budget, setBudget] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  return (
    <>
      <header className="w-full bg-green-700 px-6 py-5">
        <h1 className="text-4xl font-bold text-white">Garden Planner</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <p className="text-center text-lg  mb-10">
          This will help you plan your next gardening endeavour!
        </p>

        <div className="flex items-center gap-3 mb-8">
          <label className="text-lg font-medium  whitespace-nowrap">
            Enter your budget:
          </label>
          <div className="flex items-center border-2 border-green-400 rounded-lg px-3 py-2 focus-within:border-green-600">
            <span className="text-lg text-green-600 font-medium">$</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={budget}
              onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))}
              className="text-lg w-28 outline-none ml-1 text-green-900"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <label className="text-lg font-medium whitespace-nowrap">
            Upload a photo of your garden:
          </label>
          <label className="border-2 border-green-400 rounded-lg px-3 py-2 cursor-pointer text-green-700 font-medium hover:bg-green-50 transition-colors">
            Choose a photo
            <input
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        {photo && (
          <div className="mt-4">
            <img
              src={URL.createObjectURL(photo)}
              alt="preview"
              className="w-64 rounded-xl border-2 border-green-300 shadow-md"
            />
          </div>
        )}
      </main>
    </>
  );
}
