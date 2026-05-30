
'use client' //TODO: disable for fun?

import Image from "next/image";
import { getGardenPlannerImage } from "../lib/actions";
import { useState } from "react";  




const promts = ['Coast Rosemary', 'Dampiera', 'Lemon Beautyheads', 'Robyn Gordon Grevillea']


export default function Page() {

    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleClick = async (): Promise<void> => {
        // const response = await fetch('example-fence-image.webp')
        // const blob = await response.blob()
        // const buffer = await blob.arrayBuffer()

        // const imageBase64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))

        setLoading(true);
        const url = await getGardenPlannerImage(promts, 'imageBase64');
        setResultUrl(url);
        setLoading(false);
    }

   




    console.log("I work!")

    return <div className="flex flex-col items-center justify-center min-h-screen pt-[15vh]">
        <h1 className="text-2xl py-10">Before:</h1>
        <Image
            src="https://images.unsplash.com/photo-1682928333176-8f8ac503bc6f?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="garden fence with grass"
            width={430}
            height={287}
             loading="eager"
        />

        <p className="pt-5 text-lg font-bold">Plants to be added to this image:</p>
        <p>{promts.join(', ')}</p>

        <h1 className="text-2xl py-10">After:</h1>

    
        <button className="hover:bg-green-200 border-2 border-green-500
         rounded-lg p-1"
         onClick={handleClick}
         >Call AI api</button>

         {loading && (
            <div className="w-12 h-12 border-4 border-green-300 border-t-green-600 rounded-full animate-spin mt-4" />
         )}
         {resultUrl && (<img src={resultUrl} alt="generated garden" className="max-w-lg rounded-xl" />)}
     

    </div>;

}
