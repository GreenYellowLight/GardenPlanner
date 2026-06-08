'use server'

import { fal } from "@fal-ai/client";
import { readFileSync } from 'fs'
import { join } from 'path'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

const GENERATION_PERIOD = 60 // over how many minutes from now in the past to cap the number of images generated 
const GENERATION_LIMIT = 2 // how many images can be generated each GENERATION_PERIOD



// Don't allow more that GENERATION_LIMIT requests per GENERATION_PERIOD
async function validateCount() {

    await sql`DELETE FROM generation_log WHERE created_at < NOW() - INTERVAL '2 days'`

    await sql`INSERT INTO generation_log DEFAULT VALUES`

    const result = await sql`
        SELECT COUNT(*) as count 
        FROM generation_log 
        WHERE created_at > NOW() - (${GENERATION_PERIOD} * INTERVAL '1 minute')
`

    if (parseInt(result[0].count) >= GENERATION_LIMIT) {
        throw new Error('TOO_MANY_REQUESTS')
    }


}

/**
 * Makes API call to open ai with garden planning information and gets
 *  hopefully an image as a response
 */
export async function getGardenPlannerImage(plants: string[], imageBase64V1: string, filename: any): Promise<string | null> {

    const imageBase64 = readFileSync(join(process.cwd(), 'public', 'example-fence-image.webp')).toString('base64')



    validateCount();

    const plantNames = plants.join(', ')


    const prompt = `You are editing a garden photo. Add each of the following plants exactly once, all must be clearly visible and 
  not obscured: ${plantNames}. Place them in the most natural vacant spots in the garden as though they have just
  been transplanted from their pots — still small and freshly planted. Do not hide any plant behind fences, walls,
  or other features. The plants should look healthy with intact leaves and roots settled into the soil. Do not alter
   any existing structures, lawn, paths, or background features.`




    console.log(prompt);


    // await new Promise((resolve) => setTimeout(resolve, 3000)); //TODO: remove

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