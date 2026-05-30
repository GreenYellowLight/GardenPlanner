'use server'

import { fal } from "@fal-ai/client";


import { readFileSync } from 'fs'
import { join } from 'path'


/**
 * Makes API call to open ai with garden planning information and gets
 *  hopefully an image as a response
 */
export async function getGardenPlannerImage(plants: string[], imageBase64V1: string): Promise<string | null> {

    const imageBase64 = readFileSync(join(process.cwd(), 'public', 'example-fence-image.webp')).toString('base64')


    const plantNames = plants.join(', ')


 const prompt = `Add all of the following plants, every single one must be present and clearly visible:  ${plantNames}. Plant them naturally in the optimal vacant spaces in the garden. No plant should be hidden behind existing structures or features. The plants should look healthy and well-established. Keep all existing structures, lawn, and features exactly as they are.`



    console.log(prompt);


    await new Promise((resolve) => setTimeout(resolve, 3000));

    const img_url = "https://images.unsplash.com/photo-1682928333176-8f8ac503bc6f?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    return img_url;



    const result = await fal.subscribe("fal-ai/flux-pro/kontext", {
        input: {
            prompt: prompt,
            image_url: img_url
        },
        logs: true,
        onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS") {
                update.logs.map((log) => log.message).forEach(console.log);
            }
        },
    });

    console.log(result.data);
    console.log(result.requestId);

    return result.data.images?.[0]?.url ?? null






}