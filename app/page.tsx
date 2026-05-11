
"use client";
import { useState } from "react";




export default function Page() {
  const [budget, setBudget] = useState("");
   const [photo, setPhoto] = useState<File | null>(null);

  return (
    <>
      <header className="w-full  bg-green-300 px-6 py-4">
        <h1 className="text-4xl font-bold text-green-900" >Garden Planner</h1>
      </header>
      <p className="text-center text-lg mt-6 px-4"> This will help you plan your
        next gardening endevour!</p>

      <div className="flex justify-center items-center gap-2 mt-6 px-4">

        <label className="text-lg">Enter your budget:</label>

        <div className="flex items-center border border-gray-400 rounded px-2 py-1">


          <span className="text-lg text-gray-500">$</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={budget}
            onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))}
            className="text-lg w-28 outline-none"
          />

        </div>



      </div>

      <div  className="flex justify-center items-center gap-2 mt-10">



        <label className="text-lg mt-10 text-center " >Upload an image of the garden you want to populate:</label>


        <div className="flex justify-center">


          <label className="border border-gray-400 rounded px-2 py-1 cursor-pointer text-lg 
  text-gray-500">Choose a photo
            <input className="hidden"
             onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} 
              type="file"
              accept="image/*"

            />


          </label>


        </div>
          {photo && (
    <div className="flex justify-center mt-4">
      <img src={URL.createObjectURL(photo)} alt="preview" className="w-64 rounded" />
    </div>
  )}

      </div>


    </>
  );
}
